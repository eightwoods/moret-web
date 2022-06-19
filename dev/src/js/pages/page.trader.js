import tradingView from "../components/component.tradingviewWidget"

export default {
    globals: {
        elem: document.querySelector(".trader"),
    },

    init() {
        const observer = new MutationObserver((mutations) => {
            console.log("sidenav has changed!")
            tradingView.createGraph()
        })
        observer.observe(this.globals.elem.querySelector(".sidenav"), {childList: true, characterData: true})
    },
}