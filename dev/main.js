import "swiper/css"
import "./main.scss"

import { tokens, tokenActive } from "./src/js/helpers/constant"
import { getDeviceType, getMobileOS, getBrowser } from "./src/js/helpers/utils"

const setup = {
    init() {
        // use for styling
        document.body.classList.add("js-enable", getDeviceType(), getMobileOS(), getBrowser())
        alert(getDeviceType(), getMobileOS(), getBrowser())

        // no metamask
        this.getMetaMask()

        // no access - redirect user
        this.setNoAccess()
        
        // set default active token
        if (!localStorage.getItem(tokenActive)) {
            localStorage.setItem(tokenActive, JSON.stringify(tokens[0]))
        }
        
        // call objects
        this.getComponents()
        this.getModules()
        this.getPages()
        this.setEvents()
    },

    getMetaMask() {
        if (document.querySelector("main.home, .no-metamask, .no-access")) 
            return

        if (document.querySelector("body.os-android, body.os-ios")) {
            if (!window.ethereum) {
                window.location.href = "https://metamask.io/download/"
            }
        } else if (document.querySelector("body.desktop.os-other")) {
            if (!window.ethereum) {
                window.location.href = "/no-metamask.html"
            }
        }
    },

    setNoAccess() {
        if (document.querySelector("main.home, .no-metamask, .no-access")) 
            return

        fetch("https://get.geojs.io/v1/ip/geo.json")
            .then(res => res.json())
            .then((data) => {
                console.log("Country", data)
                if (data.country_code === "US") {
                    window.location.href = "/no-access.html"
                }
            }).catch(err => console.error(err))
    },

    async getComponents() {
        if (document.querySelectorAll(".chart-comparison").length) {
            const { default: chartComparison } = await import("./src/js/components/component.chartComparison")
            chartComparison.init()
        }

        if (document.querySelectorAll(".custom-checkbox").length) {
            const { default: customCheckbox } = await import("./src/js/components/component.customCheckbox")
            customCheckbox.init()
        }

        if (document.querySelectorAll(".dropdown-select").length) {
            const { default: dropdownSelect } = await import("./src/js/components/component.dropdownSelect")
            dropdownSelect.init()
        }

        if (document.querySelectorAll(".percentage-bar").length) {
            const { default: percentageBar } = await import("./src/js/components/component.percentageBar")
            percentageBar.init()
        }

        if (document.querySelectorAll(".percentage-bar-multi").length) {
            const { default: percentageBarMulti } = await import("./src/js/components/component.percentageBarMulti")
            percentageBarMulti.init()
        }

        if (document.querySelectorAll(".comp-tables").length) {
            const { default: compTables } = await import("./src/js/components/component.tables")
            compTables.init()
        }

        if (document.querySelectorAll(".toggle-switches").length) {
            const { default: toggleSwitches } = await import("./src/js/components/component.toggleSwitches")
            toggleSwitches.init()
        }

        if (document.querySelectorAll(".tokens").length) {
            const { default: tokens } = await import("./src/js/components/component.tokens")
            tokens.init()
        }
        
        if (document.querySelector(".tradingview-widget-wrapper")) {
            const { default: tradingviewWidget } = await import("./src/js/components/component.tradingviewWidget")
            tradingviewWidget.init()
        }
    },

    async getModules() {
        if (document.querySelector(".connection-button")) {
            const { default: connect } = await import("./src/js/modules/module.connect")
            connect.init()
        }

        if (document.querySelector("header")) {
            const { default: header } = await import("./src/js/modules/module.header")
            header.init()
        }

        if (document.querySelector("footer")) {
            const { default: footer } = await import("./src/js/modules/module.footer")
            footer.init()
        }

        if (document.querySelector(".trading")) {
            const { default: trading } = await import("./src/js/modules/module.trading")
            trading.init()
        }
    },

    async getPages() {
        if (document.querySelector("main.home")) {
            const { default: homepage } = await import("./src/js/pages/page.home")
            homepage.init()
        }

        if (document.querySelector(".governance")) {
            const { default: governance } = await import("./src/js/pages/page.governance")
            governance.init()
        }

        if (document.querySelector(".liquidity")) {
            const { default: liquidity } = await import("./src/js/pages/page.liquidity")
            liquidity.init()
        }

        if (document.querySelector(".perpetual")) {
            const { default: perpetual } = await import("./src/js/pages/page.perpetual")
            perpetual.init()
        }

        if (document.querySelector(".saver")) {
            const { default: saver } = await import("./src/js/pages/page.saver")
            saver.init()
        }

        if (document.querySelector(".trader")) {
            const { default: trader } = await import("./src/js/pages/page.trader")
            trader.init()
        }

        if (document.querySelector(".trader-volatility")) {
            const { default: traderVolatility } = await import("./src/js/pages/page.traderVolatility")
            traderVolatility.init()
        }
    },

    setEvents() {
        // href prevent click
        const links = document.querySelectorAll("a.js-preventDefault")
        if (links.length) {
            links.forEach((link) => {
                link.addEventListener("click", (e) => {
                    e.preventDefault()
                }, false)
            })
        }
    },
}

document.addEventListener("DOMContentLoaded", () => {
    setup.init()
}, false)
