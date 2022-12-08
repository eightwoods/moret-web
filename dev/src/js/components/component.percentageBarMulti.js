import { gsap } from "gsap"

export default {
    globals: {
        elem: document.querySelectorAll(".percentage-bar-multi"),
        easing: "none",
        duration: 1.5
    },

    init() {
        this.globals.elem.forEach((percentageBar) => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.intersectionRatio) {
                        this.progressBar(
                            percentageBar, 
                            percentageBar.dataset.initValueTop, 
                            percentageBar.dataset.initValueBottom
                        )
                        observer.unobserve(entry.target)
                    }
                })
            }, { threshold: 0.5 })

            observer.observe(percentageBar)
        })
    },

    progressBar(elem, topVal, bottomVal) {
        const progressTop = elem.querySelector(".pbm-top")
        const progressBottom = elem.querySelector(".pbm-bottom")

        gsap.to(progressTop, {
            width: `${topVal}%`,
            ease: this.globals.easing,
            duration: this.globals.duration
        })
        this.countPercent(progressTop, topVal)

        gsap.to(progressBottom, {
            width: `${bottomVal}%`,
            ease: this.globals.easing,
            duration: this.globals.duration
        })
        this.countPercent(progressBottom, bottomVal)
    },

    countPercent(elem, value) {
        const textValue = elem.querySelector(".pbm-value span")
        const currValue = textValue.textContent.replace("%", "")
        const target = {val: currValue}

        gsap.to(target, {
            val: value, 
            ease: this.globals.easing,
            duration: this.globals.duration,
            onUpdate: function() {
                const targetValue = target.val.toFixed(0)
                textValue.textContent = `${targetValue}%`
                if (targetValue > 55) {
                    elem.querySelector(".pbm-value").classList.add("pbm-value-50plus")
                }
            }
        })
    },
}