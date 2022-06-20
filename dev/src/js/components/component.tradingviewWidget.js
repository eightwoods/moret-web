import { tokenName, tokenPrice } from "../helpers/constant"

export default {
    globals: {
        elem: document.querySelector(".tradingview-widget-wrapper"),
        exchange: "BINANCE",
    },

    init() {
        const twScript = document.createElement("script")
        twScript.setAttribute("async", "")
        twScript.setAttribute("src", "https://s3.tradingview.com/tv.js")
        document.head.appendChild(twScript)
    },

    async createGraph() {
        this.globals.elem.textContent = ""
        
        const twContainer = document.createElement("div")
        twContainer.className = "tradingview-widget-container"
        this.globals.elem.appendChild(twContainer)

        const twGraph = document.createElement("div")
        twGraph.id = "tradingview_graph"
        twContainer.appendChild(twGraph)

        const twCopyright = document.createElement("div")
        twCopyright.className = "tradingview-widget-copyright"
        twCopyright.innerHTML = `<a href="https://www.tradingview.com/symbols/${tokenName()}${tokenPrice()}/?exchange=${this.globals.exchange}" rel="noopener" target="_blank">
            <span class="blue-text">${tokenName()}${tokenPrice()} Chart</span>
        </a> by TradingView`
        twContainer.appendChild(twCopyright)

        await new TradingView.widget({
            // "autosize": true,
            "width": "100%",
            "height": "100%",
            "symbol": `${this.globals.exchange}:${tokenName()}${tokenPrice()}`,
            "interval": "D",
            "timezone": "Etc/UTC",
            "theme": "dark",
            "style": "1",
            "locale": "en",
            "toolbar_bg": "#f1f3f6",
            "hide_legend": true,
            "enable_publishing": false,
            "hide_top_toolbar": true,
            "hide_side_toolbar": true,
            "allow_symbol_change": false,
            "container_id": "tradingview_graph"
        })

        // remove multiple <style> generated by the widget for "tradingview-widget-copyright"
        document.body.querySelectorAll("style").forEach((item, index) => {
            if (index > 0 && item.innerText.includes("tradingview-widget-copyright")) {
                item.remove()
            }
        })
    },
}