import Big from "big.js"
import { computedStyle } from "../helpers/utils"
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
                const resetInputEvent = () => {
                    inputFocus = false
                    btn.parentElement.classList.remove("active")
                }

                input.addEventListener("click", (e) => {
                    inputFocus = true
                    dropdownSelect.querySelectorAll("li").forEach((item) => item.classList.remove("info-active"))
                    if (e.target.value === "") {
                        this.valueFromInputField(dropdownSelect, 0)
                    }
                }, false)

                input.addEventListener("blur", (e) => {
                    resetInputEvent()
                }, false)

                input.addEventListener("keyup", async(e) => {
                    let inputValue = e.target.value
                    if (e.target.value === "") {
                        inputValue = 0
                    }
                    this.valueFromInputField(dropdownSelect, inputValue)
                }, false)

                input.addEventListener("keydown", (e) => {
                    // ENTER key
                    if (e.keyCode == 13) {
                        // for MutationObserver use
                        if (e.target.value !== "") {
                            resetInputEvent()
                            dropdownSelect.setAttribute("dds-selected", 0)
                            dropdownSelect.setAttribute("dds-updated", "")
                        }
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

    async createListItems(dropdownSelect, arrayValues, firstItemActive = true, resetInput = false) {
        const infoList = dropdownSelect.querySelector(".info-list")
        infoList.textContent = ""

        const items = await arrayValues
        items.forEach((item, index) => {
            const list = document.createElement("li")
            list.textContent = item
            if (firstItemActive) {
                // first active item
                if (index < 1) {
                    list.className = "info-active"
                }
            } else {
                if (dropdownSelect.hasAttribute("dds-selected")) {
                    if (parseInt(dropdownSelect.getAttribute("dds-selected")) === (index + 1)) {
                        list.className = "info-active"
                    }
                } else {
                    // middle active item
                    const middleList = Big(items.length).div(2).round().toNumber()
                    if (middleList === (index + 1)) {
                        list.className = "info-active"
                    }
                }
            }

            infoList.appendChild(list)
        })

        this.eventListItems(dropdownSelect)
        if (resetInput) {
            const input = dropdownSelect.querySelector("input[name='info-amount']")
            if (input) input.value = ""
        }
    },

    eventListItems(dropdownSelect) {
        this.valueFromListItem(dropdownSelect)

        const listItems = dropdownSelect.querySelectorAll("li")
        listItems.forEach((item, index) => {
            // scroll up onload
            if (item.classList.contains("info-active")) {
                this.scrollTopActiveItem(dropdownSelect, index, item)
            }

            item.addEventListener("click", () => {
                // reset input
                const input = dropdownSelect.querySelector("input[name='info-amount']")
                if (input) input.value = ""
                // reset items
                listItems.forEach((item) => item.classList.remove("info-active"))

                // set state
                item.classList.add("info-active")

                // scroll up onclick
                this.scrollTopActiveItem(dropdownSelect, index, item)

                // set value
                this.valueFromListItem(dropdownSelect)

                // for MutationObserver use
                dropdownSelect.setAttribute("dds-selected", (index + 1))
                dropdownSelect.setAttribute("dds-updated", "")
            }, false)
        })
    },

    scrollTopActiveItem(dropdownSelect, index, item) {
        const itemHeight = item.getBoundingClientRect().height
        const itemMarginBottom = parseInt(computedStyle(item).getPropertyValue("margin-bottom"))
        setTimeout(() => dropdownSelect.querySelector("ul").scrollTo(0, index * (itemHeight + itemMarginBottom)), 500)
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

    async insertValues(dropdownSelect, insert2elem, firstVal = false, secondVal = false) {
        new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve([dropdownSelect.querySelector(".ds-value1").textContent, dropdownSelect.querySelector(".ds-value2").textContent])
            }, 500)
        })
        .then((res) => {
            // console.log(res)
            let value = `${res[0].trim()} (${res[1].trim()})`
            if (firstVal) {
                value = res[0].trim()
            } else if (secondVal) {
                value = res[1].trim()
            }
            insert2elem.textContent = value
        })
        .catch((err) => console.warn(err))
    },
}