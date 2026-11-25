import { defineConfig } from 'vite'
export default defineConfig({
  build: {
    target: 'node22',
    ssr: 'scripts/catalog.js',
    outDir: '.verify',
    emptyOutDir: true,
    rollupOptions: { output: { entryFileNames: 'catalog.js' } },
  },
})
