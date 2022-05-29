import "./main.scss"

import { getDeviceType, getMobileOS } from "./src/js/helpers/utils"

const setup = {
    init() {
        document.body.classList.add("js-enable", getDeviceType(), getMobileOS()) // use for styling

        // call objects
        this.getModules()
        this.getPages()
        this.setEvents()
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
    },

    async getPages() {
        if (document.querySelector("main.home")) {
            const { default: homepage } = await import("./src/js/page/page.home")
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
