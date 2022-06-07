import { gsap } from "gsap"
import { mobileDevices } from "../helpers/utils"

export default {
    globals: {
        elem: document.querySelectorAll(".comp-tables"),
    },

    init() {
        this.globals.elem.forEach((table) => {
            this.swipeArrows(table)
            this.limitView(table)

            // on window resize
            this.hasScroll(table)
            window.addEventListener("resize", () => {
                this.hasScroll(table)
            })
        })
    },

    swipeArrows(table) {
        if (!mobileDevices()) {
            const tableContainer = table.querySelector(".table-container")

            // create arrows
            const arrowLeft = document.createElement("div")
            arrowLeft.className = "table-arrowleft"
            table.appendChild(arrowLeft)

            const arrowRight = document.createElement("div")
            arrowRight.className = "table-arrowright"
            table.appendChild(arrowRight)

            // set events
            arrowLeft.addEventListener("click", () => {
                gsap.to(tableContainer, {scrollLeft: "-=100", ease: "none"})
            }, false)

            arrowRight.addEventListener("click", () => {
                gsap.to(tableContainer, {scrollLeft: "+=100", ease: "none"})
            }, false)
        }
    },

    limitView(table) {
        const tableRows = table.querySelectorAll("tbody tr")
        const limitRows = 5

        tableRows.forEach((row, index) => {
            if (index > (limitRows - 1)) {
                row.classList.add("hide")
            }
        })

        if (tableRows.length > limitRows) {
            // create view more
            const viewMore = document.createElement("div")
            viewMore.className = "table-viewmore"
            table.appendChild(viewMore)

            const button = document.createElement("a")
            button.setAttribute("href", "#")
            button.className = "btn btn-white btn-viewmore size-sm"
            button.textContent = "View more"
            viewMore.appendChild(button)

            button.addEventListener("click", (e) => {
                e.preventDefault()
                tableRows.forEach((row) => row.classList.remove("hide"))
                viewMore.remove()
            }, false)
        }
    },

    hasScroll(table) {
        const tableContainerWidth = table.querySelector(".table-container").offsetWidth
        const tableWidth = table.querySelector("table").offsetWidth

        if (tableWidth > tableContainerWidth) {
            table.setAttribute("data-has-scroll", true)
        } else {
            table.setAttribute("data-has-scroll", false)
        }
    },
}