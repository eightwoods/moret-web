export default {
    globals: {
        elem: document.querySelectorAll(".dropdown-select"),
    },

    init() {
        this.globals.elem.forEach((dropdownSelect) => {
            const btn = dropdownSelect.querySelector(".ds-btn")
            const listItems = dropdownSelect.querySelectorAll("li")
            const input = dropdownSelect.querySelector("input[name='info-amount']")
            let inputFocus = false

            // set value
            if (input) {
                this.valueFromInputField(dropdownSelect, input.value)

                // input events
                input.addEventListener("click", (e) => {
                    inputFocus = true
                    listItems.forEach((item) => item.classList.remove("info-active"))
                    this.valueFromInputField(dropdownSelect, e.target.value)
                }, false)

                input.addEventListener("blur", () => {
                    inputFocus = false
                    btn.parentElement.classList.remove("active")
                }, false)

                input.addEventListener("keyup", (e) => {
                    this.valueFromInputField(dropdownSelect, e.target.value)
                }, false)

            } else {
                this.valueFromListItem(dropdownSelect)
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
                }, 100)
            }, false)

            // infos
            listItems.forEach((item) => {
                item.addEventListener("click", () => {
                    // reset
                    listItems.forEach((item) => item.classList.remove("info-active"))
                    // set state
                    item.classList.add("info-active")
                    // set value
                    this.valueFromListItem(dropdownSelect)
                }, false)
            })
        })
    },

    valueFromListItem(dropdownSelect) {
        const listItems = dropdownSelect.querySelectorAll("li")
        listItems.forEach((item) => {
            if (item.classList.contains("info-active")) {
                const [itemVal1, itemVal2] = item.textContent.split("|")
                const btn = dropdownSelect.querySelector(".ds-btn")
                btn.querySelector(".ds-value1").textContent = itemVal1
                btn.querySelector(".ds-value2").textContent = itemVal2
            }
        })
    },

    valueFromInputField(dropdownSelect, inputVal) {
        const btn = dropdownSelect.querySelector(".ds-btn")
        btn.querySelector(".ds-value1").textContent = inputVal
        btn.querySelector(".ds-value2").textContent = "0%" // calculate percentage value
    },
}