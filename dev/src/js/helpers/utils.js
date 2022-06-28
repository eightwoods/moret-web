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