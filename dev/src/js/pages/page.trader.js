import { getStrikes } from "../helpers/web3"
import tradingView from "../components/component.tradingviewWidget"
import toggleSwitches from "../components/component.toggleSwitches"

export default {
    globals: {
        elem: document.querySelector(".trader"),
    },

    init() {
        const observer = new MutationObserver((mutations) => {
            console.log("sidenav has changed!")
            tradingView.createGraph()

            // console.log(typeof tokenAddress())

            console.log("true", getStrikes(true))
            console.log("false", getStrikes(false))

            // console.log("trader", toggleSwitches.getActiveItem(document.querySelector(".toggle-switches.opt-callput")))
        })
        observer.observe(this.globals.elem.querySelector(".sidenav"), {childList: true, characterData: true})
    },
}