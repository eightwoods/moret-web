export default {
    globals: {
        elem: document.querySelectorAll(".custom-checkbox"),
    },

    init() {
        this.globals.elem.forEach((customCheckbox) => {
            customCheckbox.addEventListener("click", () => {
                const checkedClass = "cc-checked"
                if (customCheckbox.classList.contains(checkedClass)) {
                    customCheckbox.classList.remove(checkedClass)
                } else {
                    customCheckbox.classList.add(checkedClass)
                }

                // for MutationObserver use
                customCheckbox.setAttribute("customcheckbox-clicked", "")
            }, false)
        })
    },
}