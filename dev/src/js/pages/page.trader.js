import { tokenName, tokenPrice } from "../helpers/constant" 
import { createList, showOverlayPopup, closeOverlayPopup } from "../helpers/utils"
import { getStrikes, calcIV, getVolTokenName, calcOptionPrice, getCapital } from "../helpers/web3"
import componentDropdownSelect from "../components/component.dropdownSelect"
import componentPercentageBar from "../components/component.percentageBar"
import componentToggleSwitches from "../components/component.toggleSwitches"
import componentTradingviewWidget from "../components/component.tradingviewWidget"

export default {
    globals: {
        elem: document.querySelector(".trader"),
        initObserver: true
    },

    init() {
        // methods call
        this.optExpiry()
        this.setTrade()

        // observe sidenav
        const sidenavObserver = new MutationObserver(async(mutations) => {
            console.log("sidenav has changed from Trader!")
            componentTradingviewWidget.createGraph()
            this.optToken()
            this.optStrike()
            this.optPrice()
            this.liquidityPool()

            this.globals.initObserver = false
        })
        sidenavObserver.observe(this.globals.elem.querySelector(".sidenav"), {childList: true, attributes: false, characterData: false})
        
        // observe toggle switches call/put
        const optcallputObserver = new MutationObserver((mutations) => {
            if (!this.globals.initObserver) {
                this.optStrike()
            }
        })
        optcallputObserver.observe(document.querySelector(".opt-callput"), {childList: false, attributes: true, characterData: false})

        // observe expiry dropdown select
        const expiryObserver = new MutationObserver(async(mutations) => {
            if (!this.globals.initObserver) {
                this.optToken()
            }
        })
        expiryObserver.observe(document.querySelector(".opt-expiry .ds-value1"), {childList: true, attributes: false, characterData: false})
    },

    async optToken() {
        const expiry = document.querySelector(".opt-expiry .ds-value1").textContent.replace("Days", "").replace("Day", "").trim()
        const optToken = await getVolTokenName(null, expiry)
        document.querySelector(".opt-token .ts-token").textContent = optToken
    },

    optStrike() {
        const isCall = componentToggleSwitches.getActiveItem(document.querySelector(".opt-callput")).toLowerCase() === "call" ? true : false
        componentDropdownSelect.createListItems(document.querySelector(".opt-strike"), getStrikes(null, isCall), false)
    },

    optExpiry() {
        componentDropdownSelect.createListItems(document.querySelector(".opt-expiry"), calcIV())
    },

    async optPrice(objInsert2elem = null) {
        new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({
                    "strike": document.querySelector(".opt-strike .ds-value1").textContent.trim(), 
                    "expiry": document.querySelector(".opt-expiry .ds-value1").textContent.replace("Days", "").replace("Day", "").trim()
                })
            }, objInsert2elem ? 500 : 2000)
        })
        .then(async(res) => { 
            // console.log(res)
            const isBuy = componentToggleSwitches.getActiveItem(document.querySelector(".opt-buysell")).toLowerCase() === "buy" ? true : false
            const isCall = componentToggleSwitches.getActiveItem(document.querySelector(".opt-callput")).toLowerCase() === "call" ? true : false

            const optPrice = await calcOptionPrice(null, tokenName(), isBuy, isCall, 0, res.strike, 0.00001, res.expiry)
            if (objInsert2elem) {
                objInsert2elem.volatility.textContent = optPrice.volatility
                objInsert2elem.premium.textContent = optPrice.premium
                objInsert2elem.collateral.textContent = optPrice.collateral
            } else {
                document.querySelector(".opt-price .info-volatility").textContent = optPrice.volatility
                document.querySelector(".opt-price .info-premium").textContent = optPrice.premium
                document.querySelector(".opt-price .info-collateral").textContent = optPrice.collateral
            }
        })
        .catch((err) => console.warn(err))
    },

    async liquidityPool() {
        const liquidityPool = await getCapital()
        document.querySelector(".liquidity-pool .pb-price-end").textContent = liquidityPool.gross
        componentPercentageBar.progressBar(document.querySelector(".liquidity-pool"), liquidityPool.perc)
    },

    setTrade() {
        const btnTrade = document.querySelector(".opt-price .btn")
        btnTrade.addEventListener("click", async(e) => {
            e.preventDefault()
            const arrNames = [
                {
                    name: `${componentToggleSwitches.getActiveItem(document.querySelector(".opt-buysell"))}:`, 
                    span: `call on ${tokenName()} - ${tokenPrice()}`, 
                    class: "to-buy"
                }, 
                {name: "Strike:", span: "-", class: "to-strike"},
                {name: "Expiry:", span: "-", class: "to-expiry"},
                {name: "Amount:", span: document.querySelector(".opt-amount input").value, class: "to-amount"},
                {name: "Implied Volatility:", span: "-", class: "to-volatility"},
                {name: "Premium:", span: "-", class: "to-premium"},
                {name: "Collateral:", span: "-", class: "to-collateral"}
            ]

            showOverlayPopup("Trade overview", createList(arrNames, "tradeoverview"))

            // insert data values in overlay popup
            componentDropdownSelect.getValues(document.querySelector(".opt-strike"), document.querySelector(".overlay-popup .to-strike span"))
            componentDropdownSelect.getValues(document.querySelector(".opt-expiry"), document.querySelector(".overlay-popup .to-expiry span"), true)
            this.optPrice({
                "volatility": document.querySelector(".overlay-popup .to-volatility span"),
                "premium": document.querySelector(".overlay-popup .to-premium span"),
                "collateral": document.querySelector(".overlay-popup .to-collateral span")
            })
        })
    },

    refresh() {
        let refreshId = null
        const refreshMethod = () => {
            refreshId = setInterval(() => {
                this.optPrice()
            }, 5000)
        }
        const clearMethod = () => {
            clearInterval(refreshId)
            refreshId = null
        }
        refreshMethod()
        
        // tab visibility remove/resume
        document.addEventListener("visibilitychange", () => {
            document.hidden ? clearMethod() : refreshMethod()
        })
    },
}