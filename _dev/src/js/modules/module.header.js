import { gsap } from "gsap"
import { noScroll, breakpoint } from "../helpers/utils"

export default {
    globals: {
        elem: document.querySelector("header"),
    },

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.intersectionRatio) {
                    // console.log("header")
                    this.globals.elem.style.opacity = 1;
                    const logo = this.globals.elem.querySelector(".logo")
                    const menu = this.globals.elem.querySelector(".menu")
                    const navItems = this.globals.elem.querySelectorAll(".items li")
                    const button = this.globals.elem.querySelector(".button")

                    const tl = gsap.timeline()
                    tl.from(logo, {opacity: 0, x: 200, delay: 0.2})
                    if (window.innerWidth < breakpoint.md) {
                        tl.from(menu, {opacity: 0, x: 200}, "-=0.25")
                    } else {
                        tl.from(navItems, {opacity: 0, x: 200, stagger: 0.1}, "-=0.25")
                        tl.from(button, {opacity: 0, x: 200}, "-=0.25")
                    }

                    observer.unobserve(entry.target)
                }
            })
        }, { threshold: 0.5 })

        observer.observe(this.globals.elem)
        this.setEvents()
    },

    setEvents() {
        const menuOpen = this.globals.elem.querySelector(".js-menuOpen")
        const menuClose = this.globals.elem.querySelector(".js-menuClose")
        const menuPopup = this.globals.elem.querySelector(".menuPopup")

        // events
        menuOpen.addEventListener("click", () => {
            gsap.fromTo(menuPopup, {opacity: 0}, {display: "block", opacity: 1})
            noScroll()
        })
        menuClose.addEventListener("click", () => {
            gsap.fromTo(menuPopup, {opacity: 1}, {display: "none", opacity: 0})
            noScroll(false)
        })

        // remove style
        window.addEventListener("resize", () => {
            if (window.innerWidth >= breakpoint.md && menuPopup.hasAttribute("style")) {
                menuPopup.removeAttribute("style")
                noScroll(false)
            }
        })
    },
}