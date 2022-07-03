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
        init: true
    },

    init() {
        // static methods call
        this.optAmount()
        this.optExpiry()
        this.buttonTrade()

        // observe sidenav
        const sidenavOptions = {
            childList: true, 
            attributes: true, 
            attributeFilter: ["sidenav-activechange", "sidenav-refreshprice"]
        }
        const sidenavObserver = new MutationObserver((mutations) => {
            console.log("sidenav has changed from Trader!")

            for (let mutation of mutations) {
                if (mutation.type === "attributes") {
                    switch (mutation.attributeName) {
                        case "sidenav-activechange":
                            componentTradingviewWidget.createGraph()
                            this.optTokenName()
                            // remove attribute to reset option Strike
                            document.querySelector(".opt-strike").removeAttribute("dds-selected")
                            this.optStrike(true)
                            
                            this.optPrice()
                            this.liquidityPool()
                            if (!this.globals.init) {
                                this.optToken()
                            }
                            break
                        case "sidenav-refreshprice":
                            this.optPrice()
                            if (document.querySelector(".overlay-popup")) {
                                this.optPrice(true)
                            }
                            break
                        default:
                    }
                }
            }

            this.globals.init = false
        })
        sidenavObserver.observe(this.globals.elem.querySelector(".sidenav"), sidenavOptions)
        
        // observe toggle switches and dropdown select
        const tsddsOptions = {attributes: true, attributeFilter: ["ts-activechanged", "dds-updated"]}
        const tsddsObserver = new MutationObserver((mutations) => {
            for (let mutation of mutations) {
                if (mutation.attributeName === "ts-activechanged" || mutation.attributeName === "dds-updated") {
                    if (mutation.target.classList.contains("opt-callput")) {
                        // update option Strike percentage end value string
                        const optStrike = document.querySelector(".opt-strike")
                        if (parseInt(optStrike.getAttribute("dds-selected")) === 0) {
                            componentDropdownSelect.valueFromInputField(
                                optStrike, 
                                optStrike.querySelector(".ds-value1").textContent
                            )
                        }
                        this.optStrike()

                    } else if (mutation.target.classList.contains("opt-expiry")) {
                        this.optToken()
                    }

                    this.optPrice()
                }
            }
        })
        tsddsObserver.observe(document.querySelector(".opt-buysell"), tsddsOptions)
        tsddsObserver.observe(document.querySelector(".opt-callput"), tsddsOptions)
        tsddsObserver.observe(document.querySelector(".opt-token"), tsddsOptions)
        tsddsObserver.observe(document.querySelector(".opt-strike"), tsddsOptions)
        tsddsObserver.observe(document.querySelector(".opt-expiry"), tsddsOptions)

        // observe option Expiry dropdown select, only on initial load
        const expiryObserver = new MutationObserver((mutations) => {
            this.optToken()
            expiryObserver.disconnect()
        })
        expiryObserver.observe(document.querySelector(".opt-expiry .ds-value1"), {childList: true})
    },

    optTokenName() {
        // console.log("optTokenName()")
        document.querySelector(".opt-token .ts-token-name").textContent = tokenName()
    },

    async optToken() {
        // console.log("optToken()")
        const expiry = document.querySelector(".opt-expiry .ds-value1").textContent.replace("Days", "").replace("Day", "").trim()
        const optToken = await getVolTokenName(null, expiry)
        document.querySelector(".opt-token .ts-token").textContent = optToken
    },

    optStrike(resetInput = false) {
        // console.log("optStrike()")
        const isCall = componentToggleSwitches.getActiveItem(document.querySelector(".opt-callput")).toLowerCase() === "call" ? true : false
        componentDropdownSelect.createListItems(document.querySelector(".opt-strike"), getStrikes(null, isCall), false, resetInput)
    },

    optAmount() {
        const inputAmount = document.querySelector("input[name='opt-amount']")
        inputAmount.addEventListener("keydown", (e) => {
            // ENTER key
            if (e.keyCode == 13) {
                this.optPrice()
            }
        }, false)
    },

    optExpiry() {
        componentDropdownSelect.createListItems(document.querySelector(".opt-expiry"), calcIV())
    },

    optPrice(inOverlayPopup = false) {
        // console.log("optPrice()")
        const isBuy = componentToggleSwitches.getActiveItem(document.querySelector(".opt-buysell")).toLowerCase() === "buy" ? true : false
        const isCall = componentToggleSwitches.getActiveItem(document.querySelector(".opt-callput")).toLowerCase() === "call" ? true : false
        const paymentMethod = componentToggleSwitches.getActiveItem(document.querySelector(".opt-token"), true)

        new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({
                    "strike": document.querySelector(".opt-strike .ds-value1").textContent.trim(), 
                    "amount": document.querySelector("input[name='opt-amount']").value, 
                    "expiry": document.querySelector(".opt-expiry .ds-value1").textContent.replace("Days", "").replace("Day", "").trim()
                })
            }, this.globals.init ? 2000 : 500)
        })
        .then(async(res) => { 
            // console.log(res)
            const optPrice = await calcOptionPrice(null, tokenName(), isBuy, isCall, paymentMethod, res.strike, res.amount, res.expiry)
            if (inOverlayPopup) {
                // console.log("refresh inOverlayPopup")
                document.querySelector(".overlay-popup .to-volatility span").textContent = optPrice.volatility
                document.querySelector(".overlay-popup .to-premium span").textContent = optPrice.premium
                document.querySelector(".overlay-popup .to-collateral span").textContent = optPrice.collateral
            } else {
                document.querySelector(".opt-price .info-volatility").textContent = optPrice.volatility
                document.querySelector(".opt-price .info-premium").textContent = optPrice.premium
                document.querySelector(".opt-price .info-collateral").textContent = optPrice.collateral
            }
        })
        .catch((err) => console.warn(err))
    },

    async liquidityPool() {
        // console.log("liquidityPool()")
        const liquidityPool = await getCapital()
        document.querySelector(".liquidity-pool .pb-price-end").textContent = liquidityPool.gross
        componentPercentageBar.progressBar(document.querySelector(".liquidity-pool"), liquidityPool.perc)
    },

    buttonTrade() {
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
            componentDropdownSelect.insertValues(document.querySelector(".opt-strike"), document.querySelector(".overlay-popup .to-strike span"))
            componentDropdownSelect.insertValues(document.querySelector(".opt-expiry"), document.querySelector(".overlay-popup .to-expiry span"), true)
            this.optPrice(true)
        })
    },
}