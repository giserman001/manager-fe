import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const path = require('path')
// https://vitejs.dev/config/
export default defineConfig(({command, mode}) => {
  console.log(command, mode, 'command, mode')
  return {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      }
    },
    server: {
      host: 'localhost',
      port: 8880,
      proxy: {
        "/api": {
          target: 'http://localhost:3000'
        }
      }
    },
    build: {
      outDir: mode === 'prod' ? 'dist' : 'test'
    },
    plugins: [vue()]
  }
})
