import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
//import mkcert from 'vite-plugin-mkcert';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    //mkcert(),
  ],
/*
  server: {
    proxy: {
      '/.well-known': {
        target: 'https://broker.pod.inrupt.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  */
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
