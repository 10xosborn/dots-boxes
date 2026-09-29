/* =====================================================================
   AI — pure functions over a 0/1 "drawn" mask. No DOM.
   easy   : takes an available box ~50% of the time, otherwise random.
   medium : always takes boxes; never gives a 3rd side while a safe line exists.
   Works on any rows × columns board.
   hard   : chain-aware (safe-line race search, all-but-two double-dealing,
            optimal chain/loop opening order) + exact alpha-beta search once the
            remaining game is small enough (the whole game on 3×3, which also has
            an opening book). Picks at random among equally good moves.
   ===================================================================== */
// @ts-nocheck -- performance-critical engine kept in plain JS; typed via the wrapper in ai.ts
/**
 * Create an independent AI engine instance (holds its own transposition table).
 * @returns {{choose:(g:any,d:Uint8Array,level:'easy'|'medium'|'hard')=>number, resetGame:()=>void}}
 */
export function createAI(){
  let ROWS,COLS,H,E,NB,boxEdges,edgeBoxes,geoKey='';
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  function setGeometry(g){
    const key=g.rows+'x'+g.cols;
    if(geoKey===key) return; geoKey=key;
    ({rows:ROWS,cols:COLS,H,E,NB,boxEdges,edgeBoxes}=g);
    vMemo.clear(); TT.clear(); initZobrist();
  }
const sides=(d,b)=>{let s=0;for(const e of boxEdges[b]) if(d[e]) s++;return s};
  const missingEdge=(d,b)=>boxEdges[b].find(e=>!d[e]);
  const otherBox=(e,b)=>{const bs=edgeBoxes[e];return bs.length<2?null:(bs[0]===b?bs[1]:bs[0])};
  function safeMoves(d){const r=[];for(let e=0;e<E;e++) if(!d[e]&&edgeBoxes[e].every(b=>sides(d,b)<2)) r.push(e);return r}
  function capBoxes(d){const r=[];for(let b=0;b<NB;b++) if(sides(d,b)===3) r.push(b);return r}
  function undrawn(d){const r=[];for(let e=0;e<E;e++) if(!d[e]) r.push(e);return r}
  function takeAll(d){const dd=Uint8Array.from(d);let f=true;while(f){f=false;for(let b=0;b<NB;b++) if(sides(dd,b)===3){dd[missingEdge(dd,b)]=1;f=true}}return dd}
  
  function components(d){
    const seen=new Uint8Array(NB), out=[];
    for(let b=0;b<NB;b++){
      if(seen[b]||sides(d,b)===4) continue;
      const q=[b]; seen[b]=1; const boxes=[], edges=new Set(); let ground=0, allTwo=true;
      while(q.length){
        const x=q.pop(); boxes.push(x); if(sides(d,x)!==2) allTwo=false;
        for(const e of boxEdges[x]){
          if(d[e]) continue; edges.add(e);
          const y=otherBox(e,x); if(y===null){ground++;continue}
          if(!seen[y]){seen[y]=1;q.push(y)}
        }
      }
      out.push({boxes,size:boxes.length,loop:allTwo&&ground===0&&boxes.length>=4,simple:allTwo,edges:[...edges]});
    }
    return out;
  }
  
  /* ---------- endgame value: net boxes for the player forced to open ---------- */
  const vMemo=new Map();
  function V(ch,lp){
    if(!ch.length&&!lp.length) return 0;
    const key=ch.join(',')+'|'+lp.join(',');
    if(vMemo.has(key)) return vMemo.get(key);
    let best=-Infinity;
    ch.forEach((L,i)=>{ if(i&&ch[i-1]===L) return;
      const c2=ch.slice(); c2.splice(i,1); const v=V(c2,lp);
      const opp=L<=2?L+v:Math.max(L+v,L-4-v); best=Math.max(best,-opp)});
    lp.forEach((L,i)=>{ if(i&&lp[i-1]===L) return;
      const l2=lp.slice(); l2.splice(i,1); const v=V(ch,l2);
      const opp=Math.max(L+v,L-8-v); best=Math.max(best,-opp)});
    vMemo.set(key,best); return best;
  }
  const lists=cs=>[cs.filter(c=>!c.loop).map(c=>c.size).sort((a,b)=>a-b),cs.filter(c=>c.loop).map(c=>c.size).sort((a,b)=>a-b)];
  const Vof=cs=>V(...lists(cs));
  function compVal(comps,c){
    const v=Vof(comps.filter(x=>x!==c)), L=c.size;
    const opp=c.loop?Math.max(L+v,L-8-v):(L<=2?L+v:Math.max(L+v,L-4-v));
    return -opp;
  }
  const label=c=>`${c.size}-box ${c.loop?'loop':'chain'}`;
  
  /* ---------- handout (all-but-two / all-but-four) detection ---------- */
  function chainHandoutEdge(d,A){
    const e=missingEdge(d,A), B=otherBox(e,A);
    if(B===null||sides(d,B)!==2) return null;
    const f=boxEdges[B].find(x=>!d[x]&&x!==e); if(f===undefined) return null;
    const C=otherBox(f,B); if(C!==null&&sides(d,C)>=2) return null;
    return f;
  }
  function findHandout(d,caps){
    if(caps.length===1){const f=chainHandoutEdge(d,caps[0]); if(f!==null) return {e:f,k:2}}
    if(caps.length===2){
      const [A,D]=caps, eA=missingEdge(d,A), eD=missingEdge(d,D);
      if(eA===eD) return null;
      const B=otherBox(eA,A), C=otherBox(eD,D);
      if(B===null||C===null||B===C||sides(d,B)!==2||sides(d,C)!==2) return null;
      const gB=boxEdges[B].find(x=>!d[x]&&x!==eA), gC=boxEdges[C].find(x=>!d[x]&&x!==eD);
      if(gB!==undefined&&gB===gC) return {e:gB,k:4};
    }
    return null;
  }
  
  /* ---------- safe-line race search ---------- */
  function searchSafe(d){
    const memo=new Map(), dd=Uint8Array.from(d);
    const f=()=>{const key=dd.join('');if(memo.has(key)) return memo.get(key);
      const s=safeMoves(dd); let v;
      if(!s.length) v=Vof(components(dd));
      else{v=-Infinity;for(const e of s){dd[e]=1;v=Math.max(v,-f());dd[e]=0}}
      memo.set(key,v);return v};
    const vals=new Map(); let best=-Infinity, be=[];
    for(const e of safeMoves(dd)){dd[e]=1;const v=-f();dd[e]=0;vals.set(e,v);
      if(v>best){best=v;be=[e]}else if(v===best) be.push(e)}
    return {e:pick(be),v:best,vals};
  }
  
  function openEdge(d,c){
    const inC=new Set(c.boxes);
    if(c.loop||c.size===1) return pick(c.edges);
    if(c.size===2){const m=c.edges.find(e=>edgeBoxes[e].length===2&&edgeBoxes[e].every(b=>inC.has(b)));if(m!==undefined) return m}
    const ends=c.edges.filter(e=>edgeBoxes[e].filter(b=>inC.has(b)).length===1);
    return ends.length?pick(ends):pick(c.edges);
  }
  
  /* ---------- move choice (reasons are phrased for hints to the player) ---------- */
  function chooseMove(d,lvl){
    const caps=capBoxes(d), safe=safeMoves(d);
    if(lvl==='easy'){
      if(caps.length&&Math.random()<.8) return {e:missingEdge(d,caps[0]),kind:'capture'};
      if(safe.length&&Math.random()<.9) return {e:pick(safe),kind:'safe'};
      if(caps.length) return {e:missingEdge(d,caps[0]),kind:'capture'};
      return {e:pick(undrawn(d)),kind:'loose'};
    }
    if(caps.length){
      if(lvl==='hard'&&!safe.length){
        const ho=findHandout(d,caps);
        if(ho){
          const sim=takeAll(d);
          if(!safeMoves(sim).length){
            const comps=components(sim);
            if(comps.length){
              const v=Vof(comps);
              if(-ho.k-v>ho.k+v) return {e:ho.e,kind:'handout',k:ho.k,
                reason:ho.k===2?'All-but-two: draw this line so the last 2 boxes stay as a pair. Your opponent takes them, then has to open the next chain for you.'
                               :'All-but-four: this line splits the last 4 loop boxes into two pairs. Your opponent takes them, then has to open the next chain.'};
            }
          }
        }
      }
      // Boxes that can't start a hand-out go first, in any order; that keeps the hand-out option for last.
      const early=caps.filter(x=>chainHandoutEdge(d,x)===null), b=early.length?pick(early):caps[0];
      return {e:missingEdge(d,b),kind:'capture',reason:'That box already has 3 sides. Take it, then you draw again.'};
    }
    if(safe.length){
      if(lvl==='hard'&&safe.length<=14){
        const r=searchSafe(d);
        return {e:r.e,kind:'safe',v:r.v,reason:r.v>0
          ?'Safe line, and counting ahead it wins the safe-line race: your opponent runs out first and has to open a chain.'
          :'Safe line. Counting ahead, the race isn\'t in your favour yet, so stay safe and wait for a slip.'};
      }
      return {e:pick(safe),kind:'safe',reason:'Safe line: it doesn\'t give any box its 3rd side. Too early to count chains.'};
    }
    const comps=components(d);
    let c;
    if(lvl==='medium') c=comps.reduce((a,b)=>b.size<a.size?b:a);
    else{ // best value, then smallest; ties are equally good, so pick one of them at random
      let bv=-Infinity,ties=[];
      for(const x of comps){const v=compVal(comps,x);
        if(v>bv||(v===bv&&x.size<ties[0].size)){bv=v;ties=[x]} else if(v===bv&&x.size===ties[0].size) ties.push(x)}
      c=pick(ties);
    }
    return {e:openEdge(d,c),kind:'open',comp:c,
      reason:`No safe lines left. Open the ${label(c)}, the cheapest thing to give away${c.size===2&&!c.loop?' (use the middle line so it can\'t be handed back)':''}.`};
  }
  
  
  
  /* ---------- exact search: negamax + alpha-beta + transposition table ----------
     Value = net boxes (from the remaining ones) for the player to move.
     Pruning rule (Barker & Korf): if a 3-sided box's missing edge does not lead into a
     2-sided box, capturing it is always optimal, so it is the only move searched.
     Otherwise only "capture" or "decline (hand out)" need to be searched.
     Keys are 53-bit Zobrist hashes so any board size fits in a JS number. */
  let dx,scx,undrawnN=0,z1=0,z2=0,Z1,Z2;
  function initZobrist(){ dx=new Uint8Array(E); scx=new Uint8Array(NB);
    Z1=new Int32Array(E); Z2=new Int32Array(E);
    for(let e=0;e<E;e++){Z1[e]=(Math.random()*4294967296)|0;Z2[e]=(Math.random()*4294967296)|0} }
  function load(d){ dx.set(d); scx.fill(0); undrawnN=0; z1=0; z2=0;
    for(let e=0;e<E;e++){ if(d[e]){z1^=Z1[e];z2^=Z2[e];for(const b of edgeBoxes[e]) scx[b]++} else undrawnN++ } }
  function put(e){dx[e]=1;undrawnN--;z1^=Z1[e];z2^=Z2[e];let k=0;for(const b of edgeBoxes[e]) if(++scx[b]===4)k++;return k}
  function unput(e){dx[e]=0;undrawnN++;z1^=Z1[e];z2^=Z2[e];for(const b of edgeBoxes[e])scx[b]--}
  const oth=(e,b)=>{const bs=edgeBoxes[e];return bs.length<2?-1:(bs[0]===b?bs[1]:bs[0])};
  const missx=b=>{for(const e of boxEdges[b]) if(!dx[e]) return e};
  function gen(){
    let first=-1;
    for(let b=0;b<NB;b++){ if(scx[b]!==3) continue; const e=missx(b),B=oth(e,b);
      if(B<0||scx[B]!==2) return [e]; if(first<0) first=b }
    if(first>=0){const e=missx(first),B=oth(e,first);let f=-1;for(const x of boxEdges[B]) if(!dx[x]&&x!==e) f=x;return f>=0?[e,f]:[e]}
    const safe=[],rest=[];
    for(let e=0;e<E;e++){ if(dx[e]) continue; let ok=true; for(const b of edgeBoxes[e]) if(scx[b]>=2) ok=false; (ok?safe:rest).push(e) }
    return safe.concat(rest);
  }
  const TT=new Map(); let nodes=0,deadline=0; const ABORT={};
  function search(a,b){
    if(!undrawnN) return 0;
    // Check the clock every 2048 nodes: a time limit behaves the same on fast and slow devices.
    if((++nodes&2047)===0&&performance.now()>deadline) throw ABORT;
    const key=(z1>>>0)*2097152+(z2&0x1FFFFF), t=TT.get(key);
    if(t!==undefined){ if(t[0]>=b) return t[0]; if(t[1]<=a) return t[1]; if(t[0]===t[1]) return t[0]; if(t[0]>a) a=t[0]; if(t[1]<b) b=t[1] }
    const a0=a,b0=b; let best=-999;
    for(const e of gen()){ const k=put(e); let v; try{ v=k?k+search(a-k,b-k):-search(-b,-a) } finally{ unput(e) }
      if(v>best){best=v;if(v>a)a=v;if(a>=b)break} }
    let lb=t?t[0]:-999, ub=t?t[1]:999;
    if(best<=a0) ub=Math.min(ub,best); else if(best>=b0) lb=Math.max(lb,best); else lb=ub=best;
    TT.set(key,[lb,ub]); return best;
  }
  /* ---------- 3×3 opening book ----------
     Every optimal move for every position with at most BOOK_LINES lines drawn, taken from a full
     solve of all 2^24 positions (scripts/opening-book.mjs), so Hard can play any of them.
     Rotations and mirror images share one entry: a position is looked up by its canonical form,
     the smallest bitmask (bit e set = edge e drawn) among its 8 symmetric copies. Entries are in
     ascending order of that bitmask, 4 base64url characters each: a 24-bit mask of the optimal moves. */
  const BOOK_LINES=4, B64='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  const BOOK_SRC='____-f9u-f_t___8___6___A-__n_8_2___1CHCA___z8__gK-SAAAAQAGVAAgAABgAACBCA8P_AAAAoBAAAAECAAACA949kImSABAAC1Bth___X__6ECWHAAAAQ_w_SCWCAAAAC9p4F__--__-9_f-E__-7-7s6_r-B9E-o__-3kMoEKGWgAAAQ8JoB_M-yAAAQ__-vua-ECQGAAgAo-_-Bvm-oAAAoIGSARAAC1JoFBAAC__-f-_4E_W-IAAAQ_z6B9h-aAAAQbGQCAAEA__-VAAEAOSYAAAACApAFAAACAAEABAAA__99-Z98-Qo6__94-cs2_ft1-o90vVoz-09ikj9hBgAAefdu-ZttkI9MBmVC-f5n_09i_x9h1i9g__4X_89W__9V__9HQgAS6rg9__88aYAyAAQA__85BAQA__81AAQA9t8u-f8t8P8r__8nBAAA9f8d9T8bAAEABgAA-_oW9po9-d68__66AAAg_P61AAAg996u8P6tkJqVBAQAAAQA__3-__393f3E__37__36u_3B_23ou_3kG2WAAAAQ8_3h_83yAAAQif3ECQSAIgAooX1B721oRAAoRAAC5JhlBAAC__3MGWTAAAAQ__3J_z3aAAAQ_83WAAAQ_z3TAAAC5pkNAAAC_Lklj928z_26if25z822AAAQz_2zz_2uAgAIz_2rz_2ez_2dzz2b_dk9rr187_1q__150r11xv1zBwVq-Z1tBgAA7v1e5b1dAAQA-_zN-az8__z6__z577z1__zzBAAg8_zeAAAQz_y967x9__v9__vk__o6_2vo-etEAAAQ2UvymVvxmQoAAAAI_2voBBAhAAAQn8u8AACAmXu5__u1AgAAv9udn_t8AAFABgAAn5n8__n6__n5__X6_8_2_-_9_-_8_-_7--96_-_BJMCg_8_2ACAACGCBACAA8-_hACAAAAAQAgAAXYeGCACBAgAA8O_BIsAAAAAoAECAACAA949kBAAC_-_f-e9OTWSBuIpE_O_JsQtCAAAQ_-6FACAAAAAQ_w_SRGSAAgAAsotMAgACAAAC_--_-Y8m_e-F0Aug-6s7_M-g9E-okMoEACAAAAAQ_M-yua-EAgAAAgAovm-oRAAC--4FtsuGAAAQ9g-bAAEAAAACBAAAQwES-Y99nI9E-Qo6BAAA_-95-cs2ACAA-o90-09ieedvAAVAkI9MBmVC_09i26oeBAAAlM9M_S9K_89Wtk9IQgASBAAA_-89AAQABAQA9s8vBAAA_-7__872987FgAjA_cp78c7g8i7o_86EACAAAAAQ9o7y_e7FgkjgAAAo127oAAAC8IoFssrUAAAQ8y7bAABAAgAC--oXmeq--c69_-67AAAg986vAAAIaQAb_852_-59AAQA-s528O5vAAQABAQA--1-3e3F_Azg_-37_M3g_23ou-3lACAAAAAQ_83yie3FCgBgIgAo721oRAAC_-3N_83WAAAQ_y3b_83WAAAC-6k_z822j829z-27z822z-2vz-2f-Yg-BAAArq197-1r_812BwVq7u1fBEQA_-h_1Mjk-az8_-z7_8z2_uzu8-zfz-y_AAQA_-v_--t-_-vlmAqA_-o7v8vA_2vovOslACAAAAAQ2Uvy3evligjAAAAI_2voAAAC--pfsAqAmavcuSva_8vWu-vOawAznsqUn8u8AACAAACAssuvv-ueCQASBAAAn-t9AAFAAgBAmetvBAEAlOsMaQAbgYiEmer8AACA_8r2teruAACAAACAlupk_cg_nMjmn4n9_-n734n2vqnuqenfAACAAiFAAACA_-f_eedu3efF_Qfg_-f7-cfg_2fo_-flACAAAAAQ_8fyWOdEggAAIgAof2doAAAC_OfN_8fWAAAQ_yfb_8fWAgAC8-M__sem_-e9_-e7_8e29seu_-efcaIuBAAA_-d9f-dr_8d2BgAANudfBAQA_-J_Ocb2Geb9P-b7P8b2P-bvP-bfP-a_AAQA_-X__MVm_-X9_-X7_8X2_-Vu_-Xfz-W_b-FuP-T_-6I__8P2_-P9_-P7-YP2_-Pv_-PfAACABEFAAACAb-F__9_99J5s_N56_Z9p_s-w_8_2ABAA_5_lABAA_Z8zABAA2gvg_9_v8I_kAEAAAEAA8x7p_8_iAEAA44zkABAAAEAA_4_g_9_f_J7e_5_N540E_B_b9w-ScRdJ_9_XABAABsXU_w_S_J_N541EAEAA_x_J_8_G_8s2956togiA-5sz9s-QGke47A2yABAAfMe0AEAAu5-tdoIkAEAA_9-r_8-m-98f90-QFsOc9g-a_8-W_9-PAgAA6Agw5AhoAgAACAAwAgAAAgAAvUtyABAAeodkAgAAuZ9tJoUEAEAAVxdp_49kONIf989EVwdI1x9Z_89W949M6QgaAAQAf9c9AAQA_882dscuBAAA_97_9ApQVYYsCAAAeEJqAgAA-x7p-87mABAA_870_87yqxzh986mAEAABAAABAAAcIJeAkAA897d897b_87W_97P99o9896sCAAA_967_9639s6u_96fZAAYAgQACgAAgowA_8529t5vggwAAAQA_Nl-_Z1tr4mE_Nl7_83y-135-52nABAA7onE_83yo5zl5Y1EAEAA_93rBAAA_93f583EoonE-xnb7s3U943M_5k3j820CMW8z927AEAAz92vz92f7Ag4AgQAAgAAAgQA5s12Z4FsZ9FfAEQA-Nhv_8z2-pjt_9z7_8z2BAAA89zfz9y_AgQA_9v_7Zg-_Zttr4mk7Zg7_8vyOBPh_dt3ABAAawHg80vw_5vt94ukAEAAdxPp_4vk19pf_8vWAZGNABHb_8vW_5vN6Qg6AACAPoOMAACAfMO2d4OsttudCAAQEkNAAgAAEkNAAgAAANFvAAEAFtMFbQAaAACAyJjtAACA3sr2xJjtAACAAACAktpl_Qg6AACAq4jEAACA58n05ZhtoBlZAACAAtFFAACA_Nf-95bt_8f0_NZ7_8fyMxMJ_9f3ABAAcoME_8fy3Jftd8cmAEAAdxNp_4fk_JZf_8fWNxMBtxPZd8fU_5fN_9e_98emYBEB-9e5dMO0doMsdted-BJbd8dmchMBAAEAdsN0AAEoAAEAd9ctNBJZP8b2CAAAAACA_8b2F9bvAECAP9a_AsQk_NX__8X2fZWt_9X7_8X295Vt99VfTNW9d9FPP9T__5J__8P2ORMBt9PJWoM0NRMpv1PZVtOlAEEAAACAe9F_9I5tAAAIAAAI_s-wuY4mAAABAAAB8I_kAAAIAEAA_8_iAAABAAAI540E9w-SAAAB541EAAAIogiA9s-QAAABdoIk90-Q6AgwAAAIAgAAAgAAAAABJoUE989EAAQAAAAICAAAAgAAAAAB986mAkAA886tAgQAAAAIr4mE_83yAAAB5Y1E583EAgQA_8z27Yg_AAAIr4mk_8vyAAAB94uk_8vWAACAEkNAAACAAACAAAAI_8f0_8fyAAABd8cm_8fW98emd8dmP8b2_8X2_8P2-49tRIAE_w_S9y7Z6I1k_g7S_I-sAgAAACAA_y_L_4_ktAvQtQvI_w_S_w_JBACA_Y-sBAAA_K-3AgAA_y-bAQAYBAAABAAABAAAvo90ro1sBAAAFAYBlYr0hSz49i7R9g7y_67vACAA_66_AAQA_I3kzIhk_y3b7ols_y3bAABA_az9e4I_3IrEwYnM_yvbAIH27ons_CvYAACAhClAAACA3qnl_Yf0_af8_yfb_YP2_6fv_yfb_6e_BAQA_6X_AACAAAAQAAAQ_w_SAAAQAABAAAACAAAC_5_tAAAC_w_SAAAQBAAIEIIEAAAC_x-bYAAoBgQAAAAQ_49kAAACFAYA_56__43kAAAQ_x3bAAAC5hnJAgRA_5ztaQAoAACAAAAQf4PkAAACAACAlptFAACA_5XtAAAQAAACBgQAAACA_2_FJECk-Q_SAAAQ2AtC8G_FIkAEAAAoBAAC_w_S9E-o-C-Jvm-o9g-b-Qo6BAAA_299-09iBmVCAAQA_26__E3k_23o-S3J721o_y3b721v_2z__2o_v0vE_2vo2Uvy_2voAACAAAFA_2n__2X__k-0_0_mAgAA_0v2_v_9_N_k3N_K_r-5-E6o-O-kAAAQ-P-j1A6ymJ4xAgAAWBfA2I_EAAAI2K_CAgAAsg8ooGmgBAACBBABBAAAXFbK_P_Nvu9cAgAA_j_ZvPuX_s_Wzp3V_j_TVAbIAgAAAgAAAgAA_v_HqDwx-E-g_L-xsE-AAEAAAgAAAgAA_P-nEgMIKgSokCogAgAA_P-Xtm-Klt-d9g-aAgAA6umO-N8-_J89qI1EjFx7vv9quJ9huop0IgRwgjlh8P9vMAYIkA9oACQgBjVj_N5fBOVMFudc_j9bEvNXAOVOBAAAAEAANvcr_v8f_N7e_r692G7o8r7wui7w8A4y0D4x1i7wpuxs-o6spjgrAgAA8v7d_v7XAgAAnPq2AEAA_r6r8v5m-t51AgAA_r29rK1k3Nx77O36_v354I0U7v1z_qjs-o2s_rxr7P1e_p3V_j3bAEAAzv27oIl0AgAAqJz9AgAA_vv9_Ovs_vv7_vv6-tv53rv12Hsz_ovskLqr2Pvd-hvbmHujmvtz9rrr_vn7_vf6_vf5fLejvrdjgAgArM2g-E6oAAAQ1A6yWAfBAgAAAAAIAgAABAACsIoEvu9c_s_WAgAA-E-gsE-AEgMItm-K-M8_lI9EqI1Evu9ruop0MAYIBOVMBAAAgMzE2G7o8A4ypuxsnOq38u5nrK1k7O36_qjs7O1fruld_OzurImE_Ovs_uv7QAAAgKmsmKvegOimiul3nuq_7MWm_uf9_sf2AgAA_ueuvudP7OX-_uP_AgAASAUA1E-wUIfMAgAAAEAA_p_p_o_kAgAAhp2Fzs3UAgAAAACAkE-QdoYsFlOZBABYAgAAAgAAAgAAYsV0NoIsAgAA9s8uAgAA6pgt3sr25pgtktqtAgAAupwFAgAA5Jzt4pnVAgAAAgAA_sv2uhqp-tvZXMK29pptqlmbAgAAktqlAgAAepclUIM0AgAARNGFAgAAAgAAAgAAAgAA_j7SfiZAVAfIAgAAACAAAgAAfhdh9ivazj3RAgAAVIOEAAACIgAo_j-b8J89vK9kAABAbDRBLiFgAAAgZjVbBAAC9j7yAABAxijw5hgpAAAC5jxrAABA_jxLBAAo5BxRBDBB5DhBzqnG3pvl_jrLAAAofiPaBrFn_rf-fJdlQBEhAgAA9LOnZDFB7rVnAgAAvK9kAAACAgAA2j-A0AoC2C_GAgAAsg8oli4ABAAAAgAA_j_TAgAAEAOAkCog9g-ajFx7vn9uuB9lAgAAgjlhACQg_j9bNncv8j701i7wpjgr_j6vAgAA_n39_j3b_jxv_j3bAgAAAgAA_nv--lv9njuTkDqvmnt3_nf-fDenvjdnvHczvjcv_nX_AgAAvm9v_h_tAgAAAgAAbDRB3F5KtO-4vFoz2EuivHuhpRijefdu-f9tsApoQKRIAQAgAAAgWOYEAAACoBgh9GugVEbIAAAQAQAQfPeF_c_WAAAQ_T_TefdPqZkG-Z9NqRkDgAgC_Poz8G-wICCAAQAACKEEAFACsB4h-H8hAQAAOLcF_f-eAAAQ8T8ZAQAAxEiCaBBg6EhgACAA6VxrAKAAACAAAAQAAAQAQKUABAAABAAABAAABAAABAAAKFAL9GtYRSUYAAEA9ftXBAAA_f8-cbcNAAUABAAQ_BpKAKCkACAA-M60-O60AACAAAAgAAAgAAAgASAQ8f7XoZgH-O608C6gAACAACQAACQAAIAAyFhr6G36uf25_f3zIAACIBBhBACAqPneAAAQ6TnbiX25ACAAAIAAIKDsAQCA2doFsKrc2fvSmVuhAACAAACAJADgsHphAAAQAACAEKNIAACA-ef6-POzgAAgIEQQ2EuioEhgsApoAQAgAAACAAAQ_c_WqYkH8G-wAEAD_e-fgC1IACAAAKAAAAQABAAA9GtY_e8_AACw-M60AAAg-O60ACQA6G36IAACqOnf-Kz8sKrcIAAAECMIgAAQeYP2gAAA_ee_BAAQaOX-AQGAAACAAEAA_c_mAQEA_c_WAQAA_N-z_d-v_d-fEccGEZcFAIAAQIQEBAAAQQEAAcCk_c729drv_d6_md4nAQCA5Ins4dnfAQCAAACAIdBvEdNPAQAA_Me2IQAA7NW1AQAA_T_a_T_TACAA_SvY_T_T_T6ZoBghAAAQACAABCUYACAAAAEABAAA9T9ZACAAAACA9T65_T3b6J1t5DnZ7Kz8IaGUuLtvACEA_aP0cKO0oQBgAAAQ7bH_AACAAACAAAAgAQAQ_T_ToCiA8T8ZACAEACAAECMABAAAACAAAACAAACAAACABACA6TnbAQCAmVuhsHphECNM-Wf--HO3-He16XX_ICAwAABAIAAgoKkUAABAAAAIAAAIACAABAAAACAgICGA6Ojc-n64AAAQ0OrO2PsXkEug6PmHKERgAgAA0G5Q-v37WFLZaWCScGOyYPCXIGAAAACQ-f9vAACQAACQ9v6SlE4ylv9XkE8CJkGY9v379vv97M_g78_y78_W78_Wz-27z-2fxMrkzO0r78_y583E7s3Uz927z92f78727872z9y_z927gIkUz9y_78f278f27j3Rzz2b7z-b7b785rz1z7y_zz0LpBhR77f-7z_Tzz2b7373BgCQ73f-3s_Uzt2d37-f1rr1';
  // Edge e of the 3×3 board as its end dots [x1,y1,x2,y2], and back (numbering as in rules.ts).
  const ends33=e=>e<12?[e%3,e/3|0,e%3+1,e/3|0]:[(e-12)%4,(e-12)/4|0,(e-12)%4,((e-12)/4|0)+1];
  const edge33=(x1,y1,x2,y2)=>y1===y2?y1*3+Math.min(x1,x2):12+Math.min(y1,y2)*4+x1;
  let SYM=null, BOOK=null;
  function initBook(){
    // SYM[t][e]: where symmetry t (the 4 rotations, each optionally mirrored) sends edge e.
    SYM=[(x,y)=>[x,y],(x,y)=>[3-y,x],(x,y)=>[3-x,3-y],(x,y)=>[y,3-x],(x,y)=>[3-x,y],(x,y)=>[y,x],(x,y)=>[x,3-y],(x,y)=>[3-y,3-x]]
      .map(f=>Array.from({length:24},(_,e)=>{const [a,b,c,d]=ends33(e),[x1,y1]=f(a,b),[x2,y2]=f(c,d);return edge33(x1,y1,x2,y2)}));
    const keys=[];
    (function add(from,m,n){ if(canon33(m)[0]===m) keys.push(m); if(n<BOOK_LINES) for(let e=from;e<24;e++) add(e+1,m|1<<e,n+1) })(0,0,0);
    BOOK=new Map(keys.sort((a,b)=>a-b).map((m,i)=>[m,i]));
  }
  /** [canonical form of mask m, the symmetry that gives it] */
  function canon33(m){
    let best=m,bt=0;
    for(let t=1;t<8;t++){ let x=0; for(let e=0;e<24;e++) if(m>>e&1) x|=1<<SYM[t][e]; if(x<best){best=x;bt=t} }
    return [best,bt];
  }
  /** All optimal moves in a 3×3 position from the book, or null past the book. */
  function bookMoves(d){
    let m=0,n=0; for(let e=0;e<E;e++) if(d[e]){m|=1<<e;n++}
    if(n>BOOK_LINES) return null;
    if(!BOOK) initBook();
    const [c,t]=canon33(m), i=BOOK.get(c); if(i===undefined) return null;
    let v=0; for(let j=0;j<4;j++) v=v<<6|B64.indexOf(BOOK_SRC[4*i+j]);
    const r=[]; for(let e=0;e<E;e++) if(!d[e]&&v>>SYM[t][e]&1) r.push(e);
    return r.length?r:null;
  }
  // Exact search starts once this few lines remain; small boards are searched from the start.
  const exactFrom=()=>NB<=9?99:NB<=16?26:NB<=25?24:22;
  // Time allowed for one exact search. 3×3 gets longer so it always finishes (that keeps its
  // play perfect after the opening book); other small boards fall back to strategy quickly.
  const budgetMs=()=>ROWS===3&&COLS===3?1500:NB<=9?500:300;
  let failAt=999;
  function exactBest(d){
    load(d);
    if(undrawnN>exactFrom()||undrawnN>=failAt) return null;
    if(TT.size>3000000) TT.clear();
    nodes=0; deadline=performance.now()+budgetMs();
    try{
      let best=-999,bm=[];
      for(let e=0;e<E;e++){ if(dx[e]) continue; const k=put(e); let v; try{ v=k?k+search(-999,999):-search(-999,999) } finally{ unput(e) }
        if(v>best){best=v;bm=[e]} else if(v===best) bm.push(e) }
      return {v:best,moves:bm};
    }catch(x){ if(x===ABORT){ failAt=undrawnN; return null } throw x }
  }

  /** Main entry: returns an edge index. `d` is the 0/1 drawn mask. Always legal. */
  function choose(g,d,level){
    setGeometry(g);
    const free=undrawn(d); if(!free.length) return -1;
    const caps=capBoxes(d), safe=safeMoves(d);
    if(level==='easy'){
      if(caps.length&&Math.random()<.5) return missingEdge(d,pick(caps));
      return pick(free);
    }
    if(level==='medium'){
      if(caps.length) return missingEdge(d,caps[0]);
      if(safe.length) return pick(safe);
      const comps=components(d), c=comps.reduce((a,b)=>b.size<a.size?b:a);
      return pick(c.edges);
    }
    // Every optimal move, from the 3×3 opening book or else the exact search.
    let best=ROWS===3&&COLS===3?bookMoves(d):null;
    if(!best){const ex=exactBest(d); if(ex) best=ex.moves}
    if(best&&best.length){ // all equally good: prefer natural-looking ones (captures, then safe lines), then pick at random
      const cap=best.filter(e=>edgeBoxes[e].some(b=>sides(d,b)===3)); if(cap.length) return pick(cap);
      const sf=best.filter(e=>safe.includes(e)); return pick(sf.length?sf:best);
    }
    const m=chooseMove(d,'hard');
    return (m&&d[m.e]===0)?m.e:pick(free);
  }
  // New game: also empty the search cache. With varied play, the last game's positions rarely come up
  // again, and across a session the cache would grow by tens of thousands of entries per game.
  const resetGame=()=>{failAt=999;TT.clear()};
  return {choose,resetGame};
}
