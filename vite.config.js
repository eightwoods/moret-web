// vite.config.js
import path from "path"
import fg from "fast-glob"
import copy from "rollup-plugin-copy"
import del from "rollup-plugin-delete"

export default {
    root: path.resolve(__dirname, "dev"),
    build: {
        outDir: path.resolve(__dirname, "./"),
        emptyOutDir: false,
        rollupOptions: {
            input: fg.sync(path.resolve(__dirname, "dev", "*.html")),
        }
    },
    plugins: [
        // del({ targets: "assets/*" }),
        copy({
            targets: [
                { src: "dev/src/json/*.json", dest: "json" }
            ]
        })
    ]
}