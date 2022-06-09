import { gsap } from "gsap"

export default {
    globals: {
        elem: document.querySelector("footer"),
    },

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.intersectionRatio) {
                    // console.log("footer")
                    this.globals.elem.classList.add("show-opacity")
                    
                    const logo = this.globals.elem.querySelector(".logo")
                    const links = this.globals.elem.querySelectorAll(".links .link")
                    const linksChildren = this.globals.elem.querySelectorAll(".links .link li")
                    const socials = this.globals.elem.querySelectorAll(".social .btn-social")
                    const legals = this.globals.elem.querySelectorAll(".legals li")
                    const copyright = this.globals.elem.querySelector(".copyright")

                    const tl = gsap.timeline()
                    tl.from(logo, {opacity: 0, x: 200, delay: 0.2})
                    tl.from(links, {opacity: 0, x: 200, stagger: 0.1}, "-=0.25")
                    tl.from(linksChildren, {opacity: 0, x: 50, stagger: 0.05}, "-=0.5")
                    tl.from(socials, {opacity: 0, x: 100, stagger: 0.1}, "-=0.5")
                    tl.from(legals, {opacity: 0, x: 50, stagger: 0.05}, "-=0.5")
                    tl.from(copyright, {opacity: 0, x: 100, stagger: 0.1}, "-=0.25")

                    observer.unobserve(entry.target)
                }
            })
        }, { threshold: 0.25 })

        observer.observe(this.globals.elem)
    },
}