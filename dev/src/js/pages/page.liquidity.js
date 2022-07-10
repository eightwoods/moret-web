import Swiper from "swiper"

export default {
    globals: {
        elem: document.querySelector(".liquidity"),
    },

    init() {
        // observe sidenav
        const sidenavOptions = {
            childList: true, 
            attributes: true, 
            attributeFilter: ["sidenav-activechange", "sidenav-refreshprice"]
        }
        const sidenavObserver = new MutationObserver((mutations) => {
            console.log("sidenav refreshed from Liquidity!")

            for (let mutation of mutations) {
                if (mutation.type === "attributes") {
                    switch (mutation.attributeName) {
                        case "sidenav-activechange":
                            break
                        case "sidenav-refreshprice":
                            break
                        default:
                    }
                }
            }

            this.globals.init = false
        })
        sidenavObserver.observe(this.globals.elem.querySelector(".sidenav"), sidenavOptions)

        this.setSwiper()
    },

    setSwiper() {
        const swiper = new Swiper(".swiper", {
            slidesPerView: "auto",
            spaceBetween: 12,
            grabCursor: false,
        })

        const btnNext = this.globals.elem.querySelector(".swiper-button-next")
        btnNext.addEventListener("click", () => {
            swiper.slideNext()
        })

        const btnPrev = this.globals.elem.querySelector(".swiper-button-prev")
        btnPrev.addEventListener("click", () => {
            swiper.slidePrev()
        })
    },
}