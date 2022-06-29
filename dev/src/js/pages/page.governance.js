export default {
    globals: {
        elem: document.querySelector(".governance"),
    },

    init() {
        const sidenavObserver = new MutationObserver((mutations) => {
            console.log("sidenav has changed from Governance!")
        })
        sidenavObserver.observe(this.globals.elem.querySelector(".sidenav"), {childList: true, attributes: false, characterData: false})
    },
}