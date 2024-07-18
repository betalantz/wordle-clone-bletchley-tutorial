import { defineConfig } from "vite";

export default defineConfig({
    server: {
        proxy: {
            '/api': {
                target: 'https://api.wordnik.com/v4/',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            }
        }
    },
    optimizeDeps: { exclude: ["fsevents"]},
})