export default {
    globals: {
        elem: document.querySelectorAll("#tradingview_graph"),
    },

    init() {
        this.globals.elem.forEach((graph) => {
            this.tradingViewGraph();
        })
    },

    tradingViewGraph(token = null) {
        let graphToken = token;

        if(token === null) {
            graphToken = "ETHUSDC";
        }

        new TradingView.widget({
            // "autosize": true,
            "width": "100%",
            "height": "100%",
            "symbol": "BINANCE:" + graphToken,
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
        });
    },
}