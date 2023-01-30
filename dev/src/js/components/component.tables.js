import { gsap } from "gsap"
import { mobileDevices } from "../helpers/utils"

export default {
    globals: {
        elem: document.querySelectorAll(".comp-tables"),
        limitrows: 6,
    },

    init() {
        this.globals.elem.forEach((table) => {
            this.setTable(table)
        })
    },

    setTable(table, rowsAllLoaded = true) {
        this.swipeArrows(table)
        if (rowsAllLoaded) {
            this.rowsAllLoaded(table)
        }

        // on window resize
        this.hasScroll(table)
        window.addEventListener("resize", () => {
            this.hasScroll(table)
        })
    },

    rowsAllLoaded(table) {
        this.sortableHeaders(table)
        if (table.dataset.limitview === "button") {
            this.limitViewButton(table)
        }
        if (table.dataset.limitview === "scroll") {
            this.limitViewScroll(table)
        }
    },

    setDynamic(table, dataRows = [], setRows = true, totalRows = 0, countRow = 0) {
        if (dataRows.length > 0) {
            table.querySelector(".table-container").classList.add("show-important")
            if (setRows) {
                dataRows.forEach((row, index) => this.setRows(table, row, index))
                this.setTable(table)
            } else {
                this.setRows(table, dataRows, countRow)
                if (totalRows > 0) {
                    if (countRow === 1) {
                        const loadingCount = document.createElement("div")
                        loadingCount.className = "table-loadingcount align-center"
                        table.appendChild(loadingCount)
                        this.setTable(table, false)
                    }
                    // number of rows left to load
                    table.querySelector(".table-loadingcount").innerHTML = `Loading... ${countRow} OF ${totalRows}`
                    if (countRow === totalRows) {
                        this.rowsAllLoaded(table)
                        table.querySelector(".table-loadingcount").remove()
                    }
                }
            }
        } else {
            const noData = document.createElement("div")
            noData.className = "align-center"
            noData.textContent = "No available data to show"
            table.appendChild(noData)
        }
    },

    setRows(table, dataColumn = [], index) {
        const tbody = table.querySelector("tbody")
        const row = document.createElement("tr")
        row.dataset.id = index
        dataColumn.forEach((data) => {
            const col = document.createElement("td")
            col.textContent = data
            row.appendChild(col)
        })
        tbody.appendChild(row)
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

    hasScroll(table) {
        const tableContainerWidth = table.querySelector(".table-container").offsetWidth
        const tableWidth = table.querySelector("table").offsetWidth

        if (tableWidth > tableContainerWidth) {
            table.setAttribute("data-has-scroll", true)
        } else {
            table.setAttribute("data-has-scroll", false)
        }
    },

    limitViewButton(table) {
        const tableRows = table.querySelectorAll("tbody tr")
        const limitRows = this.globals.limitrows

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

    limitViewScroll(table) {
        const tableRows = table.querySelectorAll("tbody tr")
        const limitRows = this.globals.limitrows

        if (tableRows.length > (limitRows - 1)) {
            table.setAttribute("data-max-rows", true)
        }
    },

    sortableHeaders(table) {
        const tableHeadCell = table.querySelectorAll("thead th")

        tableHeadCell.forEach((headCell, index) => {
            // filter from here to retrieve index value
            if (headCell.classList.contains("sortable")) {
                // activate
                headCell.classList.add("sort-active")
                // let toggleFlag = 1
                headCell.addEventListener("click", () => {
                    // toggleFlag *= -1
                    this.sortByColumn({
                        table,
                        index,
                        flag: headCell.classList.contains("sort-asc") ? -1 : 1, // toggleFlag (retain previous flag individually)
                        sortText: headCell.classList.contains("sort-text"),
                    })
                }, false)
            }
        })
    },

    sortByColumn(obj) {
        const tableRows = Array.from(obj.table.querySelectorAll("tbody tr"))

        const getVal = (elSort) => {
            let sortVal = ""

            if (obj.sortText) {
                sortVal = elSort.querySelector(`td:nth-child(${obj.index + 1})`).textContent.trim().toLowerCase()
            } else if (elSort.querySelector(`td:nth-child(${obj.index + 1})`).dataset.unformattedValue) {
                sortVal = parseFloat(elSort.querySelector(`td:nth-child(${obj.index + 1})`).dataset.unformattedValue)
            } else {
                sortVal = parseFloat(elSort.querySelector(`td:nth-child(${obj.index + 1})`).textContent.trim())
            }

            return sortVal
        }

        tableRows.sort((a, b) => {
            const elA = getVal(a)
            const elB = getVal(b)

            if (elA < elB) return -1 * obj.flag

            if (elA > elB) return 1 * obj.flag

            return 0
        })

        // update sortable arrows
        obj.table.querySelectorAll("th.sortable").forEach((headCell) => headCell.classList.remove("sort-asc", "sort-desc"))
        obj.table.querySelector(`th:nth-child(${obj.index + 1})`).classList.add(obj.flag === 1 ? "sort-asc" : "sort-desc")

        // append sorted rows
        tableRows.forEach((row) => {
            obj.table.querySelector("tbody").appendChild(row)
        })
    },
}