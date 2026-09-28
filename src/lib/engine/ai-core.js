/* =====================================================================
   AI — pure functions over a 0/1 "drawn" mask. No DOM.
   easy   : takes an available box ~50% of the time, otherwise random.
   medium : always takes boxes; never gives a 3rd side while a safe line exists.
   hard   : chain-aware (safe-line race search, all-but-two double-dealing,
            optimal chain/loop opening order) + exact alpha-beta search once the
            remaining game is small enough (the whole game on 3×3).
   ===================================================================== */
// @ts-nocheck -- performance-critical engine kept in plain JS; typed via the wrapper in ai.ts
/**
 * Create an independent AI engine instance (holds its own transposition table).
 * @returns {{choose:(g:any,d:Uint8Array,level:'easy'|'medium'|'hard')=>number, resetGame:()=>void}}
 */
export function createAI(){
  let N,H,E,NB,boxEdges,edgeBoxes,geoN=0;
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  function setGeometry(g){
    if(geoN===g.n) return; geoN=g.n;
    ({n:N,H,E,NB,boxEdges,edgeBoxes}=g);
    vMemo.clear(); TT.clear(); initZobrist();
  }
const sides=(d,b)=>{let s=0;for(const e of boxEdges[b]) if(d[e]) s++;return s};
  const missingEdge=(d,b)=>boxEdges[b].find(e=>!d[e]);
  const otherBox=(e,b)=>{const bs=edgeBoxes[e];return bs.length<2?null:(bs[0]===b?bs[1]:bs[0])};
  function safeMoves(d){const r=[];for(let e=0;e<E;e++) if(!d[e]&&edgeBoxes[e].every(b=>sides(d,b)<2)) r.push(e);return r}
  function capBoxes(d){const r=[];for(let b=0;b<N*N;b++) if(sides(d,b)===3) r.push(b);return r}
  function undrawn(d){const r=[];for(let e=0;e<E;e++) if(!d[e]) r.push(e);return r}
  function takeAll(d){const dd=Uint8Array.from(d);let f=true;while(f){f=false;for(let b=0;b<N*N;b++) if(sides(dd,b)===3){dd[missingEdge(dd,b)]=1;f=true}}return dd}
  
  function components(d){
    const seen=new Uint8Array(N*N), out=[];
    for(let b=0;b<N*N;b++){
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
      const b=caps.find(x=>chainHandoutEdge(d,x)===null)??caps[0];
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
    else{let bv=-Infinity;for(const x of comps){const v=compVal(comps,x);if(v>bv||(v===bv&&x.size<c.size)){bv=v;c=x}}}
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
  const TT=new Map(); let nodes=0,budget=0; const ABORT={};
  function search(a,b){
    if(!undrawnN) return 0;
    if(++nodes>budget) throw ABORT;
    const key=(z1>>>0)*2097152+(z2&0x1FFFFF), t=TT.get(key);
    if(t!==undefined){ if(t[0]>=b) return t[0]; if(t[1]<=a) return t[1]; if(t[0]===t[1]) return t[0]; if(t[0]>a) a=t[0]; if(t[1]<b) b=t[1] }
    const a0=a,b0=b; let best=-999;
    for(const e of gen()){ const k=put(e); let v; try{ v=k?k+search(a-k,b-k):-search(-b,-a) } finally{ unput(e) }
      if(v>best){best=v;if(v>a)a=v;if(a>=b)break} }
    let lb=t?t[0]:-999, ub=t?t[1]:999;
    if(best<=a0) ub=Math.min(ub,best); else if(best>=b0) lb=Math.max(lb,best); else lb=ub=best;
    TT.set(key,[lb,ub]); return best;
  }
  // When exact search may be attempted, and its node budget (keeps each move well under 1 s).
  let BOOK=null; const BOOK_SRC='0:0,1:1,2:0,3:2,4:0,5:1,7:6,8:0,9:1,b:7,d:5,f:4,g:6,h:h,j:7,l:6,n:3,p:7,r:2,w:0,x:1,z:7,11:3,13:4,15:2,17:4,1d:7,1f:2,1s:0,1t:1,1v:2,1x:1,1z:3,21:2,23:4,29:2,2a:7,2b:3,2c:0,2g:7,2p:2,2r:4,34:9,3k:1,3l:i,3n:2,3p:1,3q:0,3r:3,3t:1,3u:0,3v:2,42:0,4h:1,4i:0,4j:2,5d:1,5e:0,5f:2,5s:0,74:0,75:1,77:2,79:1,7b:3,7d:2,7f:4,7l:2,7n:3,81:2,83:4,8x:1,8z:2,9c:0,ap:1,aq:0,ar:2,e8:0,e9:1,eb:2,ed:1,ef:3,eh:2,ej:4,ep:2,er:3,f5:2,f7:4,g1:1,g3:2,gg:0,ht:1,hu:0,hv:2,ld:1,lf:2,sg:0,sh:1,sj:2,sl:1,sn:3,sp:2,sr:4,sx:2,sz:3,td:1,tf:2,u9:1,ub:2,uo:0,w1:1,w2:0,w3:2,zl:1,zn:2,16p:1,16r:2,1kw:0,1kx:1,1kz:2,1l1:1,1l3:3,1l5:2,1l7:4,1ld:2,1lf:3,1lt:2,1lv:4,1mp:1,1mr:2,1n4:0,1oh:1,1oi:0,1oj:2,1s1:1,1s3:2,1z5:1,1z7:2,2dd:1,2df:2,35s:0,35t:1,35v:2,35x:1,35z:5,361:d,363:d,369:1,36b:h,36p:1,36r:2,37l:1,37n:5,380:2,39d:1,39e:0,39f:2,3cx:1,3cz:6,3k1:1,3k3:5,3y9:1,3yb:7,4qp:1,4qr:5,6bk:0,6bl:1,6bn:2,6bp:1,6br:4,6bt:c,6bv:c,6c1:2,6c3:e,6ch:1,6cj:2,6dd:1,6df:7,6ds:0,6f5:4,6f6:3,6f7:h,6ip:4,6ir:j,6pt:1,6pv:2,741:1,743:2,7wh:1,7wj:2,9hd:3,9hf:3,cn4:0,cn5:1,cn7:2,cn9:1,cnb:3,cnd:1,cnf:2,cnl:2,cnn:d,co1:1,co3:3,cox:1,coz:2,cpc:2,cqp:3,cqq:3,cqr:i,cu9:1,cub:3,d1d:1,d1f:2,dfl:1,dfn:2,e81:1,e83:2,fsx:1,fsz:2,iyp:2,iyr:4,pa8:0,pa9:1,pab:2,pad:1,paf:3,pah:2,paj:4,pap:2,par:3,pb5:2,pb7:4,pc1:1,pc3:3,pcg:0,pdt:1,pdu:0,pdv:2,phd:1,phf:3,poh:1,poj:3,q2p:1,q2r:3,qv5:1,qv7:3,sg1:1,sg3:2,vlt:1,vlv:2,11xd:1,11xf:3,1ekg:0,1ekh:1,1ekj:2,1ekl:1,1ekn:3,1ekp:2,1ekr:4,1ekx:6,1ekz:3,1eld:1,1elf:2,1em9:1,1emb:5,1emo:0,1eo1:1,1eo2:0,1eo3:2,1erl:1,1ern:3,1eyp:1,1eyr:2,1fcx:1,1fcz:2,1g5d:1,1g5f:2,1hq9:1,1hqb:b,1kw1:3,1kw3:h,1r7l:1,1r7n:2,23up:1,23ur:3,2t4w:3,2t4x:4,2t4z:2,2t51:1,2t53:3,2t55:2,2t56:2,2t57:4,2t58:0,2t5f:3,2t5h:5,2t5k:2,2t5l:1,2t5t:3,2t5v:4,2t60:0,2t69:1,2t6p:2,2t6r:4,2t6w:g,2t74:2,2t75:1,2t8i:5,2t8o:5,2t8x:i,2tc1:1,2tc3:2,2tc8:0,2tch:5,2tj5:2,2tj7:4,2tjc:0,2tjl:1,2txd:1,2txf:2,2txk:4,2txt:l,2upt:2,2upv:4,2uq0:0,2uq9:n,2wap:1,2war:4,2waw:2,2wb5:5,2zgh:6,2zgj:7,2zgo:1,2zgx:g,35s1:1,35s3:2,35s8:0,35sh:6,3if5:1,3if7:2,3ifc:0,3ifl:5,47pd:a,47pf:d,47pk:6,47pt:2,5m9s:5,5m9t:7,5m9v:2,5m9x:1,5m9z:3,5ma1:5,5ma3:4,5map:1,5maq:0,5mar:2,5mas:0,5maw:0,5mb4:0,5mbl:1,5mbn:2,5mc0:8,5mcg:1,5mde:3,5mdf:e,5mdh:c,5mdl:6,5mdt:h,5me8:3,5me9:6,5mf5:c,5mgx:1,5mgz:7,5mhs:j,5mkh:6,5mo1:1,5mo3:2,5mow:0,5mrl:6,5n29:1,5n2b:2,5n34:3,5n5t:5,5nup:1,5nur:2,5nvk:0,5ny9:c,5pfl:1,5pfn:2,5pgg:1,5pj5:6,5sld:1,5slf:2,5sm8:0,5sox:e,5ywx:4,5ywz:7,5yxs:1,5z0h:c,6bk1:1,6bk3:3,6bkw:0,6bnl:c,70u9:1,70ub:5,70v4:0,70xt:6,8few:0,8ff5:7,8ffk:0,8fi9:4,b8jk:0,b8jl:1,b8jn:2,b8jp:1,b8jr:3,b8jt:1,b8jv:2,b8k1:1,b8k3:3,b8kh:1,b8kj:2,b8ld:1,b8lf:3,b8ls:0,b8n5:1,b8n6:0,b8n7:2,b8qp:2,b8qr:d,b8xt:1,b8xv:2,b9c1:1,b9c3:2,ba4h:1,ba4j:2,bbpd:1,bbpf:5,bev5:2,bev7:8,bl6p:1,bl6r:3,bxtt:1,bxtv:3,cn41:1,cn43:2,e1oh:1,e1oj:3,e1oo:0,e1ox:5,gutd:1,gutf:3,guu8:8,guwx:6,mh34:0,mh35:1,mh37:2,mh39:1,mh3b:3,mh3d:2,mh3f:4,mh3l:2,mh3n:3,mh41:2,mh43:4,mh4x:1,mh4z:2,mh5c:0,mh6p:1,mh6q:0,mh6r:2,mha9:1,mhab:2,mhhd:1,mhhf:2,mhvl:1,mhvn:2,mio1:1,mio3:2,mk8x:1,mk8z:5,mnep:1,mner:2,mtq9:1,mtqb:2,n6dd:1,n6df:3,nvnl:1,nvnn:2,pa81:2,pa83:4,pa88:0,pa8h:1,s3cx:1,s3cz:2,s3ds:0,s3gh:6,xpmp:1,xpmr:2,18y68:0,18y69:1,18y6b:2,18y6d:1,18y6f:3,18y6h:2,18y6j:4,18y6p:2,18y6r:3,18y75:2,18y77:4,18y81:1,18y83:2,18y8g:0,18y9t:1,18y9u:0,18y9v:2,18ydd:1,18ydf:2,18ykh:2,18ykj:4,18yyp:1,18yyr:2,18zr5:2,18zr7:4,191c1:1,191c3:2,194ht:1,194hv:2,19atd:1,19atf:2,19ngh:1,19ngj:3,1acqp:1,1acqr:2,1brb5:3,1brb7:4,1brbc:0,1brbl:1,1ekg1:1,1ekg3:3,1ekgw:1,1ekjl:5,1k6pt:1,1k6pv:2,1vf9d:2,1vf9f:4,2hwcg:0,2hwch:1,2hwcj:2,2hwcl:1,2hwcn:3,2hwcp:2,2hwcr:4,2hwcx:2,2hwcz:3,2hwdd:1,2hwdf:2,2hwe9:1,2hweb:2,2hweo:2,2hwg1:1,2hwg2:0,2hwg3:2,2hwjl:1,2hwjn:2,2hwqp:1,2hwqr:2,2hx4x:1,2hx4z:2,2hxxd:1,2hxxf:2,2hzi9:1,2hzib:6,2i2o1:1,2i2o3:2,2i8zl:1,2i8zn:2,2ilmp:1,2ilmr:2,2jawx:1,2jawz:2,2kphd:1,2kphf:3,2kphk:0,2kpht:l,2nim9:1,2nimb:2,2nin4:0,2nipt:e,2t4w1:1,2t4w3:2,34dfl:1,34dfn:2,3quip:2,3quir:4,4zsow:0,4zsox:1,4zsoz:2,4zsp1:1,4zsp3:3,4zsp5:2,4zsp7:4,4zspd:2,4zspf:3,4zspt:2,4zspv:4,4zsqp:1,4zsqr:2,4zsr4:0,4zssh:1,4zssi:0,4zssj:2,4zsw1:1,4zsw3:2,4zt35:1,4zt37:2,4zthd:1,4zthf:2,4zu9t:1,4zu9v:2,4zvup:1,4zvur:5,4zz0h:1,4zz0j:2,505c1:1,505c3:2,50hz5:1,50hz7:3,5179d:1,5179f:2,52ltt:2,52ltv:4,52lu0:0,52lu9:b,55eyp:1,55eyr:2,55ezk:0,55f29:c,5b18h:1,5b18j:2,5m9s1:1,5m9s3:2,68qv5:2,68qv7:4,7hp1d:1,7hp1f:2';
  const EXACT_FROM={3:99,4:26,5:24,6:22}, BUDGET=450000;
  let failAt=999;
  function exactBest(d){
    load(d);
    if(undrawnN>(EXACT_FROM[N]??20)||undrawnN>=failAt) return null;
    if(TT.size>3000000) TT.clear();
    nodes=0; budget=N===3?5000000:BUDGET;
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
    if(N===3){ // opening book (generated offline from a full solve of all 16.7M positions)
      if(!BOOK){BOOK=new Map();for(const it of BOOK_SRC.split(',')){const [k,v]=it.split(':');BOOK.set(parseInt(k,36),parseInt(v,36))}}
      let m=0;for(let e=0;e<E;e++) if(d[e]) m+=2**e;
      const b=BOOK.get(m); if(b!==undefined&&!d[b]) return b;
    }
    const ex=exactBest(d);
    if(ex&&ex.moves.length){ // prefer natural-looking optimal moves: captures, then safe lines
      const cap=ex.moves.filter(e=>edgeBoxes[e].some(b=>sides(d,b)===3)); if(cap.length) return pick(cap);
      const sf=ex.moves.filter(e=>safe.includes(e)); return pick(sf.length?sf:ex.moves);
    }
    const m=chooseMove(d,'hard');
    return (m&&d[m.e]===0)?m.e:pick(free);
  }
  const resetGame=()=>{failAt=999};
  return {choose,resetGame};
}
