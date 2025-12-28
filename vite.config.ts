import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        open: true,
        proxy: {
            '/api-ip': {
                target: 'https://ipwho.is', // Nouvelle API gratuite et plus cool
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api-ip/, ''),
            },
        },// Ouvre automatiquement le navigateur
    },
})
