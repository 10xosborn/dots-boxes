import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'

// base './' makes the build work at any path, e.g. https://<user>.github.io/dots-boxes/
export default defineConfig({
  base: './',
  plugins: [svelte()],
  worker: { format: 'es' },
  // Firebase SDK chunks are large but only load when Firebase is configured.
  build: { chunkSizeWarningLimit: 700 },
})
