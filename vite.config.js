// vite.config.js
import path from "path"
import fg from "fast-glob"
import copy from 'rollup-plugin-copy'

export default {
    root: path.resolve(__dirname, "dev"),
    build: {
        outDir: path.resolve(__dirname, "./"),
        rollupOptions: {
            input: fg.sync(path.resolve(__dirname, "dev", "*.html")),
        }
    },
    plugins: [
        copy({
            targets: [
                { src: "dev/src/json/*.json", dest: "json" }
            ]
        })
    ]
}