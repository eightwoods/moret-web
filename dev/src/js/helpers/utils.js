import { gsap } from "gsap"
import { setTableActiveTransactions } from "../helpers/web3"

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
            // Trader - refresh holdings table
            const transactionsTable = document.querySelector(".transactions .comp-dynamic-table")
            if (transactionsTable) {
                const prevNumberRows = transactionsTable.querySelectorAll("tr").length
                let timerId = setInterval(() => {
                    console.log("curr rows", transactionsTable.querySelectorAll("tr").length, "prev rows", prevNumberRows)
                    if (transactionsTable.querySelectorAll("tr").length > prevNumberRows) {
                        console.log("clear interval for transactions table")
                        clearInterval(timerId)
                    } else {
                        console.log("refresh transactions table")
                        setTableActiveTransactions()
                    }
                }, 8000)
            }

            overlayPopup.remove()
        }})
    }
}