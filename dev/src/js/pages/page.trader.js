import { tokenName, tokenPrice } from "../helpers/constant" 
import { createList, showOverlayPopup, closeOverlayPopup } from "../helpers/utils"
import { getStrikes, calcIV, getVolTokenName, calcOptionPrice, getCapital, approveOptionSpending, executeOptionTrade, getPastTransactions } from "../helpers/web3"
import componentDropdownSelect from "../components/component.dropdownSelect"
import componentPercentageBar from "../components/component.percentageBar"
import componentToggleSwitches from "../components/component.toggleSwitches"
import componentTradingviewWidget from "../components/component.tradingviewWidget"

export default {
    globals: {
        elem: document.querySelector(".trader"),
        init: true,
        execIntervalId: null
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

        // as a test...
        getPastTransactions(null, 9000, null)
    },

    optTokenName() {
        // console.log("optTokenName()")
        document.querySelector(".opt-token .ts-token-name").textContent = tokenName()
    },

    async optToken() {
        // console.log("optToken()")
        const optToken = await getVolTokenName(null, this.getExpiryValue())
        document.querySelector(".opt-token .ts-token").textContent = optToken
    },

    optStrike(resetInput = false) {
        // console.log("optStrike()")
        componentDropdownSelect.createListItems(document.querySelector(".opt-strike"), getStrikes(null, this.isCall()), false, resetInput)
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
        new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({
                    "strike": this.getStrikeValue(), 
                    "amount": this.getAmountValue(), 
                    "expiry": this.getExpiryValue()
                })
            }, this.globals.init ? 2000 : 500)
        })
        .then(async(res) => { 
            // console.log(res)
            const optPrice = await calcOptionPrice(null, tokenName(), this.isBuy(), this.isCall(), this.getPaymentMethodValue(), res.strike, res.amount, res.expiry)
            
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
                    span: `${componentToggleSwitches.getActiveItem(document.querySelector(".opt-callput")).toLowerCase()} on ${tokenName()} - ${tokenPrice()}`, 
                    class: "to-buy"
                }, 
                {name: "Strike:", span: "-", class: "to-strike"},
                {name: "Expiry:", span: "-", class: "to-expiry"},
                {name: "Amount:", span: this.getAmountValue(), class: "to-amount"},
                {name: "Implied Volatility:", span: "-", class: "to-volatility"},
                {name: "Premium:", span: "-", class: "to-premium"},
                {name: "Collateral:", span: "-", class: "to-collateral"}
            ]

            showOverlayPopup("Trade overview", createList(arrNames, "tradeoverview"))

            // insert data values in overlay popup
            componentDropdownSelect.insertValues(document.querySelector(".opt-strike"), document.querySelector(".overlay-popup .to-strike span"))
            componentDropdownSelect.insertValues(document.querySelector(".opt-expiry"), document.querySelector(".overlay-popup .to-expiry span"), true)
            this.optPrice(true)
            
            setTimeout(() => this.executeTrade(), 500)
        })
    },

    executeTrade() {
        const container = document.createElement("div")
        container.className = "executetrade"
        document.querySelector(".overlay-popup .op-content").appendChild(container)

        const button = document.createElement("a")
        button.setAttribute("href", "#")
        button.className = "btn btn-blue"
        button.textContent = "Execute"
        container.appendChild(button)

        button.addEventListener("click", async(e) => {
            e.preventDefault()
            button.remove()

            const awaitApproval = document.createElement("div")
            awaitApproval.className = "await-approval"
            awaitApproval.textContent = "Awaiting for allowance approval"
            const awaitApprovalTimer = document.createElement("div")
            awaitApprovalTimer.className = "await-approval-timer"
            awaitApprovalTimer.textContent = "00:00"
            awaitApproval.appendChild(awaitApprovalTimer)
            container.appendChild(awaitApproval)

            const awaitTrade = document.createElement("div")
            awaitTrade.className = "await-trade"
            awaitTrade.textContent = "Awaiting for transaction"
            const awaitTradeTimer = document.createElement("div")
            awaitTradeTimer.className = "await-trade-timer"
            awaitTradeTimer.textContent = "00:00"
            awaitTrade.appendChild(awaitTradeTimer)
            container.appendChild(awaitTrade)

            // approve option spending
            this.executeTradeTimer(awaitApprovalTimer)
            const warningMessage = "Warning: Transaction has failed."
            const approveAllowance = await approveOptionSpending(null, this.isBuy(), this.isCall(), this.getPaymentMethodValue(), this.getStrikeValue(), this.getAmountValue(), this.getExpiryValue())
            if (approveAllowance === "failure") {
                this.executeTradeFailure(container, warningMessage)
            } else {
                awaitApproval.classList.add("await-active")
                awaitApprovalTimer.remove()
                this.clearTradeTimer()

                // execute option trade
                setTimeout(async() => {
                    this.executeTradeTimer(awaitTradeTimer)
                    const approveTrade = await executeOptionTrade(null, this.isBuy(), this.isCall(), this.getPaymentMethodValue(), this.getStrikeValue(), this.getAmountValue(), this.getExpiryValue())
                    if (approveTrade === "") {
                        this.executeTradeFailure(container, warningMessage)
                    } else {
                        awaitTrade.classList.add("await-active")
                        awaitTradeTimer.remove()
                        this.clearTradeTimer()

                        // display approve trade link
                        const approveTradeLinkWrapper = document.createElement("div")
                        approveTradeLinkWrapper.className = "approve-trade-link"
                        const approveTradeLink = document.createElement("a")
                        approveTradeLink.setAttribute("href", approveTrade)
                        approveTradeLink.setAttribute("target", "_blank")
                        approveTradeLink.textContent = "View on Polygonscan"
                        approveTradeLinkWrapper.appendChild(approveTradeLink)
                        container.appendChild(approveTradeLinkWrapper)
                    }
                }, 500)
            }
        }, false)
    },

    executeTradeFailure(container, failureTxt) {
        const awaitFailure = document.createElement("div")
        awaitFailure.className = "await-failure"
        const warningIcon = document.createElement("div")
        warningIcon.className = "warning-icon"
        const warningText = document.createElement("div")
        warningText.className = "warning-text"
        warningText.textContent = failureTxt
        awaitFailure.appendChild(warningIcon)
        awaitFailure.appendChild(warningText)
        container.appendChild(awaitFailure)
    },

    executeTradeTimer(elemTimer) {
        // console.log("executeTradeTimer()")
        const padTime = (val) => val > 9 ? val : `0${val}`
        let totalSeconds = 0
        this.globals.execIntervalId = setInterval(() => {
            totalSeconds++
            if (totalSeconds > 120) {
                // more than 2 mins, create warning
                this.executeTradeFailure(document.querySelector(".overlay-popup .executetrade"), "Warning: Transaction has taking longer than normal to be mined. You can close the window and try to trade again.")
                this.clearTradeTimer()
            } else {
                elemTimer.textContent = `${padTime(parseInt(totalSeconds / 60))}:${padTime(totalSeconds % 60)}`
            }
        }, 1000)
    },

    clearTradeTimer() {
        // clear intervals
        clearInterval(this.globals.execIntervalId)
        this.globals.execIntervalId = null
        console.log("clearTradeTimer()")
    },

    isBuy() {
        return componentToggleSwitches.getActiveItem(document.querySelector(".opt-buysell")).toLowerCase() === "buy"
    },

    isCall() {
        return componentToggleSwitches.getActiveItem(document.querySelector(".opt-callput")).toLowerCase() === "call"
    },

    getPaymentMethodValue() {
        return componentToggleSwitches.getActiveItem(document.querySelector(".opt-token"), true)
    },

    getStrikeValue() {
        return document.querySelector(".opt-strike .ds-value1").textContent.trim()
    },

    getAmountValue() {
        return document.querySelector("input[name='opt-amount']").value
    },

    getExpiryValue() {
        return document.querySelector(".opt-expiry .ds-value1").textContent.replace("Days", "").replace("Day", "").trim()
    }
}