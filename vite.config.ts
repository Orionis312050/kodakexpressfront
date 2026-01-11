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
        allowedHosts: true,
        proxy: {
            '/api-ip': {
                target: 'https://ipwho.is', // Nouvelle API gratuite et plus cool
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api-ip/, ''),
            },
            '/api': {
                target: 'http://localhost:3001', // L'adresse locale de votre NestJS
                changeOrigin: true,
                secure: false,
                // Si votre NestJS n'a pas de préfixe global /api, décommentez la ligne ci-dessous :
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
        },// Ouvre automatiquement le navigateur
    },
})
