import { gsap } from "gsap"

export default {
    globals: {
        elem: document.querySelector("main.home"),
    },

    init() {
        this.tokens()

        this.globals.elem.querySelectorAll("section").forEach((section, index) => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.intersectionRatio) {
                        section.style.opacity = 1;

                        // headers
                        const title = section.querySelector(".header .title")
                        const introCopy = section.querySelector(".header .introcopy")

                        const tl = gsap.timeline()
                        const easing = "power4.out"
                        tl.from(title, {opacity: 0, x: -200, duration: 1, ease: easing, delay: (index > 0 ? 0 : 0.5)})
                        tl.from(introCopy, {opacity: 0, x: -200, duration: 1, ease: easing}, "-=1")

                        // sections
                        switch (section.className) {
                            case "hero":
                                const btn = section.querySelector(".btn")
                                const btnText = section.querySelector(".btn span")
                                gsap.set(btn, {opacity: 0, scale: 0, width: 44, height: 44, borderRadius: "50%", padding: 0})
                                gsap.set(btnText, {opacity: 0})

                                tl.from(section.querySelector("img"), {opacity: 0, x: 200, duration: 1, ease: easing}, "-=1")
                                tl.to(btn, {opacity: 1, scale: 1}, "-=1")
                                tl.to(btn, {borderRadius: "8px", padding: "10px 26px"}, "-=0.5")
                                tl.to(btn, {width: "auto"})
                                tl.to(btnText, {opacity: 1, duration: 1}, "-=0.5")
                                break;

                            case "features":
                                tl.from(section.querySelector("img"), {opacity: 0, x: 200, duration: 1, ease: easing}, "-=1")
                                tl.from(section.querySelectorAll(".list"), {opacity: 0, x: 200, stagger: 0.1}, "-=1")
                                break;

                            case "option-trading":
                                tl.from(section.querySelector("img"), {opacity: 0, x: 200, duration: 1, ease: easing}, "-=1")
                                break;

                            case "volatility-tokens":
                                tl.from(section.querySelectorAll(".list"), {opacity: 0, x: 200, stagger: 0.1}, "-=1")
                                tl.from(section.querySelectorAll(".token-item"), {opacity: 0, x: 200, stagger: 0.1}, "-=0.75")
                                break;

                            case "governance-tokens":
                                const list = section.querySelectorAll(".list p")
                                const listText = section.querySelectorAll(".list span")
                                gsap.set(list, {width: 46, height: 56})
                                gsap.set(listText, {display: "none", opacity: 0})

                                tl.from(section.querySelectorAll(".list"), {opacity: 0, y: 200, stagger: 0.1}, "-=1")
                                tl.to(listText, {display: "block"}, "-=1")
                                tl.to(list, {width: "auto"})
                                tl.to(list, {height: "auto"})
                                tl.to(listText, {opacity: 1}, "-=0.5")
                                break;

                            case "partners":
                                tl.from(section.querySelectorAll("li"), {opacity: 0, x: 200, stagger: 0.1}, "-=1")
                                break;

                            default:
                        }

                        observer.unobserve(entry.target)
                    }
                })
            }, { threshold: 0.5 })

            observer.observe(section)
        })
    },

    tokens() {
        const tokens = this.globals.elem.querySelectorAll(".tokens .token-item")
        tokens.forEach((token) => {
            const btn = token.querySelector(".token-btn")
            btn.addEventListener("click", () => {
                // set state
                if (token.classList.contains("active")) {
                    token.classList.remove("active")
                } else {
                    // reset
                    tokens.forEach((token) => token.classList.remove("active")) 
                    token.classList.add("active")
                }
            }, false)
        })
    },
}