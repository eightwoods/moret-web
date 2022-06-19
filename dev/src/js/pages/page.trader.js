export default {
    globals: {
        elem: document.querySelector(".trader"),
    },

    init() {
        const observer = new MutationObserver((mutations) => {
            console.log("sidenav has changed!")
        })
        observer.observe(this.globals.elem.querySelector(".sidenav"), {childList: true, characterData: true})
    },
}