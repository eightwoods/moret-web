import Swiper from "swiper"

export default {
    globals: {
        elem: document.querySelector(".liquidity"),
    },

    init() {
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