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
                            percentageBar.dataset.initValueAgainst, 
                            percentageBar.dataset.initValueFor
                        )
                        observer.unobserve(entry.target)
                    }
                })
            }, { threshold: 0.5 })

            observer.observe(percentageBar)
        })
    },

    progressBar(elem, againstVal, forVal) {
        const progressAgainst = elem.querySelector(".pbm-against")
        const progressFor = elem.querySelector(".pbm-for")

        gsap.to(progressAgainst, {
            width: `${againstVal}%`,
            ease: this.globals.easing,
            duration: this.globals.duration
        })
        this.countPercent(progressAgainst, againstVal)

        gsap.to(progressFor, {
            width: `${forVal}%`,
            ease: this.globals.easing,
            duration: this.globals.duration
        })
        this.countPercent(progressFor, forVal)
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