// vite.config.js
import path from "path"
import fg from "fast-glob"

export default {
    root: path.resolve(__dirname, "dev"),
    build: {
        outDir: path.resolve(__dirname, "./"),
        rollupOptions: {
            input: fg.sync(path.resolve(__dirname, "dev", "*.html")),
        }
    }
}