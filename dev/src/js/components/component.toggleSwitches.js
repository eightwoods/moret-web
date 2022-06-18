export default {
    globals: {
        elem: document.querySelectorAll(".toggle-switches"),
    },

    init() {
        this.globals.elem.forEach((toggleSwitch) => {
            if (parseInt(toggleSwitch.dataset.toggleTotal) > 2) {
                this.toggleMoreSwitches(toggleSwitch)
            } else {
                this.toggle2Switches(toggleSwitch)
            }
        })
    },

    toggle2Switches(toggleSwitch) {
        // this trigger the same element to toggle (similar to touch devices)
        toggleSwitch.addEventListener("click", () => {
            const tsActive1 = "ts-active1"
            const tsActive2 = "ts-active2"

            if (toggleSwitch.classList.contains(tsActive1)) {
                toggleSwitch.classList.add(tsActive2)
                toggleSwitch.classList.remove(tsActive1)
            } else {
                toggleSwitch.classList.add(tsActive1)
                toggleSwitch.classList.remove(tsActive2)
            }

            // toggle switch collab base on data attribute
            if (toggleSwitch.dataset.collab) {
                if (toggleSwitch.classList.contains(tsActive1)) {
                    toggleSwitch.parentElement.classList.add(toggleSwitch.dataset.bg1)
                    toggleSwitch.parentElement.classList.remove(toggleSwitch.dataset.bg2)
                } else {
                    toggleSwitch.parentElement.classList.add(toggleSwitch.dataset.bg2)
                    toggleSwitch.parentElement.classList.remove(toggleSwitch.dataset.bg1)
                }
            }
        }, false)
    },

    toggleMoreSwitches(toggleSwitch) {
        const tsItems = toggleSwitch.querySelectorAll(".ts-item")
        tsItems.forEach((item, index) => {
            item.addEventListener("click", () => {
                toggleSwitch.classList.remove("ts-active1", "ts-active2", "ts-active3", "ts-active4")
                toggleSwitch.classList.add(`ts-active${index + 1}`)
            })
        })
    },
}