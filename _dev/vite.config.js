// vite.config.js
const { resolve } = require('path')
const { defineConfig } = require('vite')

module.exports = defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                trader: resolve(__dirname, 'page-trader.html'),
                // liquidityprovider: resolve(__dirname, 'page-liquidityprovider.html'),
                // governance: resolve(__dirname, 'page-governance.html'),
            }
        }
    }
})