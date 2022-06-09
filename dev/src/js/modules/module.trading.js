import { gsap } from "gsap"

export default {
    globals: {
        elem: document.querySelector(".trading"),
    },

    init() {
        this.sideNav()
        this.animatePanels()
    },

    sideNav() {
        const sidenav = this.globals.elem.querySelector(".sidenav")
        const tokenArrow = sidenav.querySelector(".token-arrow")
        const tokenList = sidenav.querySelector(".token-list")
        const infoItems = tokenList.querySelectorAll(".info-item")
        const limitRows = 3

        // mobile hide/show
        tokenArrow.addEventListener("click", () => {
            if (sidenav.classList.contains("sidenav-mobile-active")) {
                sidenav.classList.remove("sidenav-mobile-active")
            } else {
                sidenav.classList.add("sidenav-mobile-active")
            }
        }, false)
        
        // limit content view
        infoItems.forEach((item, index) => {
            if (index > (limitRows - 1)) {
                item.classList.add("hide-important")
            }
        })

        if (infoItems.length > limitRows) {
            // create button view more
            const viewMore = document.createElement("div")
            viewMore.className = "token-viewmore"
            tokenList.appendChild(viewMore)

            const button = document.createElement("a")
            button.setAttribute("href", "#")
            button.className = "btn btn-white btn-viewmore size-sm"
            button.textContent = "View more"
            viewMore.appendChild(button)

            button.addEventListener("click", (e) => {
                e.preventDefault()
                infoItems.forEach((item) => item.classList.remove("hide-important"))
                viewMore.remove()
            }, false)
        }
    },

    animatePanels() {
        // automate transistion base on classname
        this.globals.elem.querySelectorAll(".animate-panel").forEach((panel, index) => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.intersectionRatio) {
                        panel.style.opacity = 1

                        const tl = gsap.timeline()
                        tl.from(panel, {opacity: 0, y: 200, delay: index * 0.1})

                        observer.unobserve(entry.target)
                    }
                })
            }, { threshold: 0.25 })

            observer.observe(panel)
        })
    },
}