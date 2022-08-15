import { gsap } from "gsap"
import pageLiquidity from "../pages/page.liquidity"
import pageTrader from "../pages/page.trader"

export const breakpoint = {
    xl:   1200,
    lg:   1024,
    lgmd: 900,
    md:   768,
    sm:   640,
    xs:   460,
    xxs:  321,
}

export const noScroll = (noscroll = true) => {
    const html = document.querySelector("html")
    if (noscroll) {
        html.classList.add("noscroll")
    } else {
        html.classList.remove("noscroll")
    }
}

export const getDeviceType = () => {
    const ua = navigator.userAgent
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return "tablet"
    }
    if (/Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return "mobile"
    }
    return "desktop"
}

export const getMobileOS = () => {
    const ua = navigator.userAgent
    if (/android/i.test(ua)) {
        return "os-android"
    }
    if (/iPad|iPhone|iPod/.test(ua)) {
        return "os-ios"
    }
    return "os-other"
}

export const mobileDevices = () => document.body.classList.contains("mobile") || document.body.classList.contains("tablet")

export const elMouseOver = () => (mobileDevices() ? "touchstart" : "mouseenter")

export const elMouseOut = () => (mobileDevices() ? "touchend" : "mouseleave")

export const computedStyle = (elem) => (window.getComputedStyle ? getComputedStyle(elem, null) : elem.currentStyle)

export const getUrlVars = () => new URLSearchParams(window.location.search)

export const getUrlParam = (param) => getUrlVars().get(param)

export const getImageUrl = (filename) => new URL(`/src/img/${filename}`, import.meta.url).href

export const getJsonUrl = (filename) => location.hostname === "localhost" ? `/src/json/${filename}` : `../json/${filename}`

export const minimizeAddress = (address) => {
    const strAddress = String(address)
    return `${strAddress.substring(0, 4)}...${strAddress.substring(strAddress.length - 4)}`
}

export const createList = (arrValues, containerClass) => {
    const listContainer = document.createElement("ul")
    listContainer.className = containerClass
    
    for (const txtVal of arrValues) {
        const listItem = document.createElement("li")

        listItem.textContent = txtVal.name
        if (txtVal.class) {
            listItem.className = txtVal.class
        } else {
            listItem.className = txtVal.name.toLowerCase()
        }

        if (txtVal.span) {
            const span = document.createElement("span")
            span.textContent = txtVal.span
            listItem.appendChild(span)
        }

        listContainer.appendChild(listItem)
    }

    return listContainer
}

export const showOverlayPopup = (title = null, data = null, btnClose = false) => {
    noScroll()

    // set elements
    const opPanel = document.createElement("div")
    opPanel.className = "overlay-popup"
    document.body.appendChild(opPanel)

    const opBox = document.createElement("div")
    opBox.className = "op-box"
    opPanel.appendChild(opBox)

    if (title) {
        const opTitle = document.createElement("div")
        opTitle.className = "op-title header-title m-b-24"
        opTitle.textContent = title
        opBox.appendChild(opTitle)
    }

    const opClose = document.createElement("div")
    if (btnClose) {
        opClose.className = "op-close hide"
    } else {
        opClose.className = "op-close cursor"
    }
    opBox.appendChild(opClose)
    opClose.addEventListener("click", () => {
        closeOverlayPopup()
    }, false)

    const opContent = document.createElement("div")
    opContent.className = "op-content"
    opContent.appendChild(data)
    opBox.appendChild(opContent)

    // transition
    gsap.from(opBox, {opacity: 0, scale: 0.5})
}

export const closeOverlayPopup = () => {
    const overlayPopup = document.querySelector(".overlay-popup")
    if (overlayPopup) {
        noScroll(false)
        gsap.to(document.querySelector(".op-box"), {opacity: 0, scale: 0.5, duration: 0.35, onComplete: function(){
            const elMain = document.querySelector("main")
            const executeButton = elMain.dataset.executeButton
            const executeFailure = elMain.dataset.executeFailure

            // Trader - refresh holdings table
            const transactionsTable = document.querySelector(".trader .transactions .comp-dynamic-table")
            if (executeButton && !executeFailure && transactionsTable) {
                console.log("Transactions: OK to refresh")
                const transPrevNumbRows = transactionsTable.querySelectorAll("tbody tr").length
                let transRefreshLimit = 0
                let transIntervalId = setInterval(() => {
                    let transCurrNumbRows = transactionsTable.querySelectorAll("tbody tr").length
                    console.log("Transactions: curr rows", transCurrNumbRows, "Transactions: prev rows", transPrevNumbRows)
                    if (transCurrNumbRows !== transPrevNumbRows) {
                        console.log("Transactions: clear interval not equal refresh")
                        clearInterval(transIntervalId)
                    } else {
                        // stop after 8 times if interval not clear
                        if (transRefreshLimit++ > 8) {
                            console.log("Transactions: clear interval refresh limit")
                            clearInterval(transIntervalId)
                        }
                        
                        console.log("Transactions: refresh holdings table")
                        pageTrader.activeTransactions()
                    }
                }, 10000)
            }

            // Liquidity provider -  refresh Pool information and Active hot tubs
            const liquidityPool = document.querySelector(".liquidity .pool-list")
            if (executeButton && !executeFailure && liquidityPool) {
                console.log("Liquidity: refresh Pool information and Active hot tubs")
                setTimeout(() => pageLiquidity.setPoolsAndHottubs(), 30000)
            }

            elMain.removeAttribute("data-execute-button")
            elMain.removeAttribute("data-execute-failure")
            overlayPopup.remove()
        }})
    }
}