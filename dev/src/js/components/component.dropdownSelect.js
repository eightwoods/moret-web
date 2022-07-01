import Big from "big.js"
import { calcMoneyness } from "../helpers/web3"
import componentToggleSwitches from "./component.toggleSwitches"

export default {
    globals: {
        elem: document.querySelectorAll(".dropdown-select"),
    },

    init() {
        this.globals.elem.forEach((dropdownSelect) => {
            const btn = dropdownSelect.querySelector(".ds-btn")
            const input = dropdownSelect.querySelector("input[name='info-amount']")
            let inputFocus = false

            // set input field
            if (input) {
                // input events
                input.addEventListener("click", () => {
                    inputFocus = true
                    dropdownSelect.querySelectorAll("li").forEach((item) => item.classList.remove("info-active"))
                    this.valueFromInputField(dropdownSelect, 0)
                }, false)

                input.addEventListener("blur", (e) => {
                    inputFocus = false
                    btn.parentElement.classList.remove("active")

                    // for MutationObserver use
                    setTimeout(() => {
                        if (e.target.value !== "") {
                            dropdownSelect.setAttribute("dds-updated", "")
                        }
                    }, 500)
                }, false)

                input.addEventListener("keyup", async(e) => {
                    let inputValue = e.target.value
                    if (e.target.value === "") {
                        inputValue = 0
                    }
                    this.valueFromInputField(dropdownSelect, inputValue)
                }, false)

                input.addEventListener("keydown", (e) => {
                    if (e.keyCode == 13) {
                        // ENTER key
                    }
                }, false)
            }

            // button events
            btn.addEventListener("click", () => {
                if (btn.parentElement.classList.contains("active")) {
                    btn.parentElement.classList.remove("active")
                } else {
                    btn.parentElement.classList.add("active")
                }
            }, false)

            btn.addEventListener("blur", () => { // added tabindex="0" to work in div element
                setTimeout(() => {
                    if (!inputFocus) {
                        btn.parentElement.classList.remove("active")
                    }
                }, 500)
            }, false)

            this.eventListItems(dropdownSelect)
        })
    },

    async createListItems(dropdownSelect, arrayValues, firstItemActive = true) {
        const infoList = dropdownSelect.querySelector(".info-list")
        infoList.textContent = ""

        const items = await arrayValues
        items.forEach((item, index) => {
            const middleList = Big(items.length).div(2).round().toNumber()
            const list = document.createElement("li")
            list.textContent = item
            if (firstItemActive) {
                // first active item
                if (index < 1) {
                    list.className = "info-active"
                }
            } else {
                // middle active item
                if (middleList === (index + 1)) {
                    list.className = "info-active"
                }
            }

            infoList.appendChild(list)
        })

        this.eventListItems(dropdownSelect)
    },

    eventListItems(dropdownSelect) {
        this.valueFromListItem(dropdownSelect)

        const input = dropdownSelect.querySelector("input[name='info-amount']")
        if (input) input.value = ""

        const listItems = dropdownSelect.querySelectorAll("li")
        listItems.forEach((item) => {
            item.addEventListener("click", () => {
                // reset
                if (input) input.value = ""
                listItems.forEach((item) => item.classList.remove("info-active"))
                // set state
                item.classList.add("info-active")
                // set value
                this.valueFromListItem(dropdownSelect)

                // for MutationObserver use
                dropdownSelect.setAttribute("dds-updated", "")
            }, false)
        })
    },

    valueFromListItem(dropdownSelect) {
        const listItems = dropdownSelect.querySelectorAll("li")
        listItems.forEach((item) => {
            if (item.classList.contains("info-active")) {
                const [itemVal1, itemVal2] = item.textContent.split("|")
                dropdownSelect.querySelector(".ds-value1").textContent = itemVal1
                dropdownSelect.querySelector(".ds-value2").textContent = itemVal2
            }
        })
    },

    async valueFromInputField(dropdownSelect, inputVal) {
        dropdownSelect.querySelector(".ds-value1").textContent = inputVal
        const isCall = componentToggleSwitches.getActiveItem(document.querySelector(".opt-callput")).toLowerCase() === "call" ? true : false
        dropdownSelect.querySelector(".ds-value2").textContent = await calcMoneyness(null, inputVal, isCall) // calculate percentage value
    },

    async getValues(dropdownSelect, insert2elem, showFirstVal = false) {
        new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve([dropdownSelect.querySelector(".ds-value1").textContent, dropdownSelect.querySelector(".ds-value2").textContent])
            }, 500)
        })
        .then((res) => {
            // console.log(res)
            let value = `${res[0].trim()} (${res[1].trim()})`
            if (showFirstVal) {
                value = res[0].trim()
            }
            insert2elem.textContent = value
        })
        .catch((err) => console.warn(err))
    },
}