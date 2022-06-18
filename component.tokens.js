export default {
    globals: {
        elem: document.querySelectorAll(".tokens"),
    },

    init() {
        this.globals.elem.forEach((token) => {
            const tokenItems = token.querySelectorAll(".token-item")
            tokenItems.forEach((item) => {
                
                const btn = item.querySelector(".token-btn")
                btn.addEventListener("click", () => {
                    // set state
                    if (item.classList.contains("active")) {
                        item.classList.remove("active")
                    } else {
                        // reset
                        tokenItems.forEach((item) => item.classList.remove("active")) 
                        item.classList.add("active")
                    }
                }, false)
            })
        })
    },
}