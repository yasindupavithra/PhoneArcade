import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { gsmarenaApiPlugin } from './server/viteGsmarenaPlugin.mjs'

export default defineConfig({
  plugins: [react(), tailwindcss(), gsmarenaApiPlugin()],
})
