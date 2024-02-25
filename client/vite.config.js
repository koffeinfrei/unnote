import { defineConfig } from 'vite'
import { resolve } from 'path'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import sveltePreprocess from 'svelte-preprocess'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte({
      preprocess: [sveltePreprocess()],
    }),
  ],
  server: {
    proxy: {
      '^/users.*': 'http://localhost:3001',
      '^/api/.*': 'http://localhost:3001',
    },
  },
  build: {
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        www: resolve(__dirname, 'www.html'),
      },
    },
  },
})
