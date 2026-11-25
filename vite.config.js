import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const require = createRequire(import.meta.url)
const axiosBrowser = join(dirname(require.resolve('axios/package.json')), 'dist/axios.min.js')
const axiosModule = 'virtual:vueex-axios-runtime'

export default defineConfig({
  base: '/VueEx/',
  plugins: [
    vue(),
    {
      name: 'vueex-axios-runtime',
      resolveId(id) {
        if (id === axiosModule) return '\0' + id
      },
      load(id) {
        if (id === '\0' + axiosModule) return `export default ${JSON.stringify(readFileSync(axiosBrowser, 'utf8'))}`
      },
    },
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/') && /\/(?:@codemirror|@lezer|codemirror)\//.test(id)) return 'code-editor'
          if (id.includes('/node_modules/') && /\/(?:@vue\/compiler-[^/]+|postcss|estree-walker|magic-string)\//.test(id)) return 'vue-compiler'
        },
      },
    },
  },
})
