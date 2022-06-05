export default {
    globals: {
        elem: document.querySelectorAll(".dropdown-select"),
    },

    init() {
        this.globals.elem.forEach((dropdownSelect) => {
            this.btnValues(dropdownSelect)

            // buttons
            const btn = dropdownSelect.querySelector(".ds-btn")
            btn.addEventListener("click", () => {
                if (btn.parentElement.classList.contains("active")) {
                    btn.parentElement.classList.remove("active")
                } else {
                    btn.parentElement.classList.add("active")
                }
            }, false)

            btn.addEventListener("blur", () => { // added tabindex="0" to work in div element
                setTimeout(() => {
                    btn.parentElement.classList.remove("active")
                }, 100)
            }, false)

            // infos
            const listItems = dropdownSelect.querySelectorAll("li")
            listItems.forEach((item) => {
                item.addEventListener("click", () => {
                    console.log(item)
                    // reset
                    listItems.forEach((item) => item.classList.remove("info-active"))
                    // set state
                    item.classList.add("info-active")
                    // set value
                    this.btnValues(dropdownSelect)
                }, false)
            })
        })
    },

    btnValues(dropdownSelect) {
        const listItems = dropdownSelect.querySelectorAll("li")
        listItems.forEach((item) => {
            if (item.classList.contains("info-active")) {
                const [value1, value2] = item.textContent.split("|")
                const btn = dropdownSelect.querySelector(".ds-btn")
                btn.querySelector(".ds-value1").textContent = value1
                btn.querySelector(".ds-value2").textContent = value2
            }
        })
    },
}