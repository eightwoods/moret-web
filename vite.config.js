// vite.config.js
import path from "path"

export default {
    root: path.resolve(__dirname, "dev"),
    build: {
        outDir: path.resolve(__dirname, "./"),
        rollupOptions: {
            input: {
                index: path.resolve(__dirname, "dev/index.html"),
                trader: path.resolve(__dirname, "dev/trader.html"),
                liquidity: path.resolve(__dirname, "dev/liquidity-provider.html"),
                governance: path.resolve(__dirname, "dev/governance.html")
            }
        }
    }
}