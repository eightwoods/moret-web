import { gsap } from "gsap"

export default {
    globals: {
        elem: document.querySelectorAll(".percentage-bar"),
        easing: "none",
        duration: 1.5
    },

    init() {
        this.globals.elem.forEach((percentageBar) => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.intersectionRatio) {
                        this.progressBar(percentageBar, percentageBar.dataset.initValue)
                        observer.unobserve(entry.target)
                    }
                })
            }, { threshold: 0.5 })

            observer.observe(percentageBar)
        })
    },

    progressBar(elem, value) {
        if (value > 0) {
            const progressBar = elem.querySelector(".pb-progressbar")
            gsap.to(progressBar, {
                width: `${value}%`,
                ease: this.globals.easing,
                duration: this.globals.duration
            })

            this.countPercent(elem, value)
        }
    },

    countPercent(elem, value) {
        const textValue = elem.querySelector(".pb-text-value")
        const currValue = textValue.textContent.replace("%", "")
        const target = {val: currValue}

        gsap.to(target, {
            val: value, 
            ease: this.globals.easing,
            duration: this.globals.duration,
            onUpdate: function() {
                textValue.textContent = `${target.val.toFixed(0)}%`
            }
        })
    },
}