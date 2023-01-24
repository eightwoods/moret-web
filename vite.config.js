// vite.config.js
import path from "path"
import fg from "fast-glob"
import copy from "rollup-plugin-copy"
import del from "rollup-plugin-delete"
import handlebars from "vite-plugin-handlebars"

export default {
    root: path.resolve(__dirname, "dev"),
    build: {
        assetsInlineLimit: 0,
        outDir: path.resolve(__dirname, "./"),
        emptyOutDir: false,
        rollupOptions: {
            input: fg.sync(path.resolve(__dirname, "dev", "*.html")),
        },
    },
    plugins: [
        handlebars({
            partialDirectory: path.resolve(__dirname, "dev/partials"),
        }),
        del({ 
            targets: "assets/*", 
            hook: "buildEnd" 
        }),
        copy({
            targets: [
                {src: "dev/src/json/*.json", dest: "json"},
                {src: "dev/script/*", dest: "script"}
            ]
        })
    ]
}