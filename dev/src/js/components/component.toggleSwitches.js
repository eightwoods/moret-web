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
        // initial state
        this.setActiveItem(toggleSwitch)

        // this trigger the same element to toggle (similar to touch devices)
        toggleSwitch.addEventListener("click", () => {
            if (toggleSwitch.classList.contains("ts-active1")) {
                this.setActiveItem(toggleSwitch, 2)
            } else {
                this.setActiveItem(toggleSwitch, 1)
            }

            // toggle switch collab (bg color) base on data attribute
            if (toggleSwitch.dataset.collab) {
                if (toggleSwitch.classList.contains("ts-active1")) {
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
        // initial state
        this.setActiveItem(toggleSwitch)

        // trigger from individual item
        const tsItems = toggleSwitch.querySelectorAll(".ts-item")
        tsItems.forEach((item, index) => {
            item.addEventListener("click", () => {
                this.setActiveItem(toggleSwitch, index + 1)
            })
        })
    },

    resetItems(toggleSwitch) {
        this.setActiveItem(toggleSwitch)
    },

    setActiveItem(toggleSwitch, activeIndex = 1) {
        // parent
        toggleSwitch.classList.remove("ts-active1", "ts-active2", "ts-active3", "ts-active4")
        toggleSwitch.classList.add(`ts-active${activeIndex}`)

        // items
        const tsItems = toggleSwitch.querySelectorAll(".ts-item")
        tsItems.forEach((item, index) => {
            if (activeIndex === (index + 1)) {
                item.classList.add("ts-item-active")
            } else {
                item.classList.remove("ts-item-active")
            }
        })
    },

    getActiveItem(toggleSwitch) {
        let activeItem = null
        const tsItems = toggleSwitch.querySelectorAll(".ts-item")
        tsItems.forEach((item) => {
            if (item.classList.contains("ts-item-active")) {
                activeItem = item.textContent
            }
        })

        return activeItem
    },
}