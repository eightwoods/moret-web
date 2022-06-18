import { gsap } from "gsap"

export default {
    globals: {
        elem: document.querySelector(".trading"),
        sideNavItems: [
            {id: 1, token: "ETH", exhange: "USD", address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"},
            {id: 2, token: "BTC", exhange: "USD", address: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6"},
        ]
    },

    async init() {
        this.sideNav()
        this.sideNavTest()
        this.animatePanels()
    },

    sideNav() {
        const localStorageName = "SideNavTokens"
        if (!localStorage.getItem(localStorageName)) {
            localStorage.setItem(localStorageName, JSON.stringify(this.globals.sideNavItems))
        }

        const sidenav = this.globals.elem.querySelector(".sidenav")

        // main
        const tokenMain = document.createElement("div")
        tokenMain.className = "token-main"
        sidenav.appendChild(tokenMain)

        const mainInfo = document.createElement("div")
        mainInfo.className = "token-info"
        tokenMain.appendChild(mainInfo)

        const mainArrow = document.createElement("div")
        mainArrow.className = "token-arrow"
        tokenMain.appendChild(mainArrow)

        // contents
        const tokenContents = document.createElement("div")
        tokenContents.className = "token-contents"
        sidenav.appendChild(tokenContents)

        const contentList = document.createElement("div")
        contentList.className = "token-list"
        tokenContents.appendChild(contentList)

        const contentInfo = document.createElement("div")
        contentInfo.className = "token-info"
        contentList.appendChild(contentInfo)

        JSON.parse(localStorage.getItem(localStorageName)).forEach((token, index) => {
            if (index < 1) {
                this.sideNavItem(mainInfo, token, false)
            } else {
                this.sideNavItem(contentInfo, token)
            }
        })
    },

    sideNavItem(parentElem, data, isContent = true) {
        const infoItem = document.createElement("div")
        infoItem.className = "info-item"
        parentElem.appendChild(infoItem)

        const tokenWrapper = document.createElement("div")
        tokenWrapper.className = "token-content-wrapper"
        infoItem.appendChild(tokenWrapper)

        const tokenContent = document.createElement("div")
        tokenContent.className = "token-content"
        tokenWrapper.appendChild(tokenContent)

        const tokenIcon = document.createElement("div")
        tokenIcon.className = "token-icon"
        tokenContent.appendChild(tokenIcon)

        const tokenIconImg = document.createElement("img")
        tokenIconImg.src = `/src/img/icon_${data.token.toLowerCase()}.svg`
        tokenIcon.appendChild(tokenIconImg)

        const tokenName = document.createElement("div")
        tokenName.className = "token-name"
        tokenName.textContent = `${data.token} - ${data.exhange}`
        tokenContent.appendChild(tokenName)

        const tokenPrice = document.createElement("div")
        tokenPrice.className = "token-price align-right"
        infoItem.appendChild(tokenPrice)

        if (isContent) {
            infoItem.addEventListener("click", () => {
                console.log(data.id)
            })
        }
    },

    sideNavTest() {
        const sidenav = this.globals.elem.querySelector(".sidenav")
        const tokenArrow = sidenav.querySelector(".token-arrow")
        const tokenList = sidenav.querySelector(".token-list")
        const infoItems = tokenList.querySelectorAll(".info-item")
        const limitRows = 3

        // mobile hide/show
        tokenArrow.addEventListener("click", () => {
            if (sidenav.classList.contains("sidenav-mobile-active")) {
                sidenav.classList.remove("sidenav-mobile-active")
            } else {
                sidenav.classList.add("sidenav-mobile-active")
            }
        }, false)
        
        // limit content view
        infoItems.forEach((item, index) => {
            if (index > (limitRows - 1)) {
                item.classList.add("hide-important")
            }
        })

        if (infoItems.length > limitRows) {
            // create button view more
            const viewMore = document.createElement("div")
            viewMore.className = "token-viewmore"
            tokenList.appendChild(viewMore)

            const button = document.createElement("a")
            button.setAttribute("href", "#")
            button.className = "btn btn-white btn-viewmore size-sm"
            button.textContent = "View more"
            viewMore.appendChild(button)

            button.addEventListener("click", (e) => {
                e.preventDefault()
                infoItems.forEach((item) => item.classList.remove("hide-important"))
                viewMore.remove()
            }, false)
        }
    },

    animatePanels() {
        // automate transistion base on classname
        this.globals.elem.querySelectorAll(".animate-panel").forEach((panel, index) => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.intersectionRatio) {
                        panel.style.opacity = 1

                        const tl = gsap.timeline()
                        tl.from(panel, {opacity: 0, y: 200, delay: index * 0.1})

                        observer.unobserve(entry.target)
                    }
                })
            }, { threshold: 0.25 })

            observer.observe(panel)
        })
    },
}