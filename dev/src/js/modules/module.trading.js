import { gsap } from "gsap"
import { tokenActive, tokenName, tokenPrice, tokenAddress, tokens } from "../helpers/constant"
import { getUrlVars, getImageUrl } from "../helpers/utils"
import { getPrice } from "../helpers/web3"

export default {
    globals: {
        elem: document.querySelector(".trading"),
        refreshDuration: 15000,
        elSidenav: null,
    },

    init() {
        this.elSidenav = this.globals.elem.querySelector(".sidenav")
        this.headerMenu()
        this.sideNav(this.elSidenav)
        this.sideNavRefreshPrice(this.elSidenav)
        this.sideNavLimiteView(this.elSidenav)
        this.animateEachPanel()
    },

    headerMenu() {
        const pageUrlName = window.location.pathname.replace("/", "").replace(".html", "")
        const navItems = this.globals.elem.parentElement.querySelectorAll(".nav-contents .items li")
        navItems.forEach((list) => {
            const linkUrlName = list.querySelector("a").getAttribute("href").replace(".html", "")
            if (pageUrlName.includes(linkUrlName)) {
                list.querySelector("a").classList.add("btn-border-active")
            }
        })
    },

    sideNav(sidenav) {
        sidenav.textContent = ""
        // for MutationObserver use
        sidenav.setAttribute("sidenav-activechange", "")

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

        // search panel for future use
        // this.sideNavSearch(contentInfo)

        this.sideNavItem(mainInfo, {token: tokenName(), price: tokenPrice(), address: tokenAddress()}, false)
        tokens.forEach((token, index) => {
            if (token.address !== tokenAddress()) {
                this.sideNavItem(contentInfo, token)
            }
        })
    },

    sideNavSearch(elParent) {
        const contentSearch = document.createElement("div")
        contentSearch.className = "input-search"
        elParent.appendChild(contentSearch)

        const contentSearchInput = document.createElement("input")
        contentSearchInput.setAttribute("type", "search")
        contentSearchInput.setAttribute("name", "s")
        contentSearchInput.setAttribute("placeholder", "Search")
        contentSearchInput.className = "size-sm"
        contentSearch.appendChild(contentSearchInput)

        // set events here!
    },

    async sideNavItem(elParent, data, isContent = true) {
        const infoItem = document.createElement("div")
        infoItem.className = "info-item"
        elParent.appendChild(infoItem)

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
        tokenIconImg.src = getImageUrl(`icon_${data.token.toLowerCase()}.svg`)
        tokenIcon.appendChild(tokenIconImg)

        const tokenName = document.createElement("div")
        tokenName.className = "token-name"
        tokenName.textContent = `${data.token} - ${data.price}`
        tokenContent.appendChild(tokenName)

        const tokenPrice = document.createElement("div")
        tokenPrice.className = "token-price align-right"
        tokenPrice.setAttribute("data-address", data.address)
        tokenPrice.textContent = await getPrice(data.address)
        infoItem.appendChild(tokenPrice)

        if (isContent) {
            infoItem.addEventListener("click", () => {
                localStorage.removeItem(tokenActive)
                localStorage.setItem(tokenActive, JSON.stringify(data))
                this.sideNav(this.elSidenav)
                this.sideNavLimiteView(this.elSidenav)
            })
        }
    },

    sideNavRefreshPrice(sidenav) {
        // removed from sideNavItem() to avoid multiple intervals base from the number of tokens
        // refresh/clear
        let refreshId = null
        const refreshTokenPrice = () => {
            refreshId = setInterval(() => {
                // for MutationObserver use
                sidenav.setAttribute("sidenav-refreshprice", "")
                // insert tokens price
                sidenav.querySelectorAll(".token-price").forEach(async (tokenPrice) => {
                    try {
                        tokenPrice.textContent = await getPrice(tokenPrice.dataset.address)
                    } catch (error) {
                        console.log("error refreshTokenPrice()", tokenPrice)
                    }
                })
            }, this.globals.refreshDuration)
        }
        const clearTokenPrice = () => {
            clearInterval(refreshId)
            refreshId = null
        }
        refreshTokenPrice()
        
        // tab visibility remove/resume
        document.addEventListener("visibilitychange", () => {
            document.hidden ? clearTokenPrice() : refreshTokenPrice()
        })
    },

    sideNavLimiteView(sidenav) {
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

    animateEachPanel() {
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