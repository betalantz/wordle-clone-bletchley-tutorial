import { defineConfig } from "vite";

export default defineConfig({
    server: {
        proxy: {
            '/api': {
                target: 'https://api.wordnik.com/v4/words.json',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            }
        }
    }
})