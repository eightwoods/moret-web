import { tokenName, tokenPrice } from "../helpers/constant" 
import { createList, showOverlayPopup, closeOverlayPopup } from "../helpers/utils"
import { calcIV, getVolTokenName, calcVolTokenPrice, getCapital, approveVolatilitySpending, executeVolatilityTrade, getActiveTransactions } from "../helpers/web3"
import componentDropdownSelect from "../components/component.dropdownSelect"
import componentPercentageBar from "../components/component.percentageBar"
import componentTables from "../components/component.tables"
import componentToggleSwitches from "../components/component.toggleSwitches"
import componentTradingviewWidget from "../components/component.tradingviewWidget"

export default {
    globals: {
        elem: document.querySelector(".trader-volatility"),
        init: true,
        execIntervalId: null
    },

    init() {
        // static methods call
        this.optAmount()
        this.optExpiry()
        this.buttonTrade()
        this.transactionsTable()

        // observe sidenav
        const sidenavOptions = {
            childList: true, 
            attributes: true, 
            attributeFilter: ["sidenav-activechange", "sidenav-refreshprice"]
        }
        const sidenavObserver = new MutationObserver((mutations) => {
            console.log("sidenav refreshed from Trader Volatility!")

            for (let mutation of mutations) {
                if (mutation.type === "attributes") {
                    switch (mutation.attributeName) {
                        case "sidenav-activechange":
                            componentTradingviewWidget.createGraph()
                            // remove attribute to reset option Strike
                            this.optPrice()
                            this.liquidityPool()
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

                    } 

                    this.optPrice()
                }
            }
        })
        tsddsObserver.observe(document.querySelector(".opt-buysell"), tsddsOptions)
        tsddsObserver.observe(document.querySelector(".opt-expiry"), tsddsOptions)

        // observe option Expiry dropdown select, only on initial load
        const expiryObserver = new MutationObserver((mutations) => {
            expiryObserver.disconnect()
        })
        expiryObserver.observe(document.querySelector(".opt-expiry .ds-value1"), {childList: true})
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
                    "amount": this.getAmountValue(), 
                    "expiry": this.getExpiryValue()
                })
            }, this.globals.init ? 2000 : 500)
        })
        .then(async(res) => { 
            // console.log(res)
            const optPrice = await calcVolTokenPrice(null, tokenName(), this.isBuy(), res.amount, res.expiry)
            
            if (inOverlayPopup) {
                // console.log("refresh inOverlayPopup")
                document.querySelector(".overlay-popup .to-volatility span").textContent = optPrice.volatility
                // document.querySelector(".overlay-popup .to-premium span").textContent = optPrice.premium
                document.querySelector(".overlay-popup .to-vol-premium span").textContent = optPrice.volpremium
            } else {
                document.querySelector(".opt-price .info-volatility").textContent = optPrice.volatility
                // document.querySelector(".opt-price .info-premium").textContent = optPrice.premium
                document.querySelector(".opt-price .info-vol-premium").textContent = optPrice.volpremium
            }
        })
        .catch((err) => console.warn(err))
    },

    async liquidityPool() {
        // console.log("liquidityPool()")
        const liquidityPool = await getCapital()
        document.querySelector(".liquidity-pool .pb-price-end").textContent = liquidityPool.gross
        document.querySelector(".liquidity-pool .pb-price-from").textContent = liquidityPool.utilized
        document.querySelector(".liquidity-pool .pb-text-value").textContent = liquidityPool.text
        componentPercentageBar.progressBar(document.querySelector(".liquidity-pool"), liquidityPool.perc)
    },

    buttonTrade() {
        const btnTrade = document.querySelector(".opt-price .btn")
        btnTrade.addEventListener("click", async(e) => {
            e.preventDefault()
            const arrNames = [
                {
                    name: `${componentToggleSwitches.getActiveItem(document.querySelector(".opt-buysell"))}:`, 
                    span: `volatility token on ${tokenName()} - ${tokenPrice()}`, 
                    class: "to-buy"
                }, 
                {name: "Expiry:", span: "-", class: "to-expiry"},
                {name: "Dollar Amount:", span: this.getAmountValue(), class: "to-amount"},
                {name: "Implied Volatility:", span: "-", class: "to-volatility"},
                // {name: "Dollar Amount:", span: "-", class: "to-premium"},
                {name: "Volatility Token Amount:", span: "-", class: "to-vol-premium"}
            ]

            showOverlayPopup("Trade overview", createList(arrNames, "tradeoverview"))

            // insert data values in overlay popup
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
            const approveAllowance = await approveVolatilitySpending(null, this.isBuy(), this.getAmountValue(), this.getExpiryValue())
            if (approveAllowance === "failure") {
                this.executeTradeFailure(container, warningMessage)
            } else {
                awaitApproval.classList.add("await-active")
                awaitApproval.textContent = "Allowance approved."
                awaitApprovalTimer.remove()
                this.clearTradeTimer()

                // execute option trade
                setTimeout(async() => {
                    this.executeTradeTimer(awaitTradeTimer)
                    const approveTrade = await executeVolatilityTrade(null, this.isBuy(), this.getAmountValue(), this.getExpiryValue())
                    if (approveTrade === "") {
                        this.executeTradeFailure(container, warningMessage)
                    } else {
                        awaitTrade.classList.add("await-active")
                        awaitTrade.textContent = "Transaction mined."
                        awaitTradeTimer.remove()
                        this.clearTradeTimer()

                        // display approve trade link
                        const approveTradeLinkWrapper = document.createElement("div")
                        approveTradeLinkWrapper.className = "approve-trade-link"
                        const approveTradeLink = document.createElement("a")
                        approveTradeLink.setAttribute("href", approveTrade)
                        approveTradeLink.setAttribute("target", "_blank")
                        approveTradeLink.className = "link-arrow"
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

    transactionsTable() {
        getActiveTransactions(null).then((results) => {
            const dynamicTable = document.querySelector(".transactions .comp-dynamic-table")
            const dataRows = []
            results.forEach((data) => {
                dataRows.push([
                    data.Type,
                    data.BS,
                    data.Expiry,
                    data.Strike,
                    data.Amount,
                    data.Delta,
                    data.Gamma,
                    data.Vega,
                    data.Theta
                ])
            })
            componentTables.setDynamic(dynamicTable, dataRows)
        })
    },

    isBuy() {
        return componentToggleSwitches.getActiveItem(document.querySelector(".opt-buysell")).toLowerCase() === "buy"
    },

    getAmountValue() {
        return document.querySelector("input[name='opt-amount']").value
    },

    getExpiryValue() {
        return document.querySelector(".opt-expiry .ds-value1").textContent.replace("Days", "").replace("Day", "").trim()
    }
}