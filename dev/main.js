import "./main.scss"

import { getDeviceType, getMobileOS } from "./src/js/helpers/utils"

const setup = {
    init() {
        document.body.classList.add("js-enable", getDeviceType(), getMobileOS()) // use for styling

        // call objects
        this.getComponents()
        this.getModules()
        this.getPages()
        this.setEvents()
    },

    async getComponents() {
        if (document.querySelectorAll(".dropdown-select").length) {
            const { default: dropdownSelect } = await import("./src/js/components/component.dropdowSelect")
            dropdownSelect.init()
        }

        if (document.querySelectorAll(".percentage-bar").length) {
            const { default: percentageBar } = await import("./src/js/components/component.percentageBar")
            percentageBar.init()
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
    },

    async getModules() {
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
