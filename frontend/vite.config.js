import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react({
        include: "**/*.{jsx,tsx}",
        babel: {
            plugins: []
        }
    })],
    build: {
        outDir: '../public/build',
        assetsDir: 'assets',
        manifest: true,
        rollupOptions: {
            input: {
                main: './src/main.jsx'
            },
            output: {
                entryFileNames: 'assets/[name]-[hash].js',
                chunkFileNames: 'assets/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash].[ext]',
                manualChunks: undefined,
            },
        },
    },
    server: {
        port: 3000,
        proxy: {
            '/api': {
                target: 'http://localhost:8000',
                changeOrigin: true,
            },
            '/storage': {
                target: 'http://localhost:8000',
                changeOrigin: true,
            }
        }
    }
})
