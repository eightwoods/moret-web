import Big from "big.js"
import { tokenName, tokenPrice, tokenAddress } from "../helpers/constant" 
import { getLoader, createList, showOverlayPopup } from "../helpers/utils"
import { getPrice } from "../helpers/web3"
import { getStrikes, calcIV, getVolTokenName, calcOptionPrice, getCapital, approveOptionSpending, executeOptionTrade, getActiveTransactions } from "../helpers/web3"
import componentDropdownSelect from "../components/component.dropdownSelect"
import componentPercentageBar from "../components/component.percentageBar"
import componentTables from "../components/component.tables"
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
        // this.optExpiry()
        // this.activeTransactions()
        document.querySelector(".transactions .js-refresh").addEventListener("click", () => this.activeTransactions())
        this.buttonTrade()

        // observe sidenav
        const sidenavOptions = {
            childList: true, 
            attributes: true, 
            attributeFilter: ["sidenav-activechange", "sidenav-refreshprice"]
        }
        const sidenavObserver = new MutationObserver((mutations) => {
            console.log("sidenav refreshed from Trader!")

            for (let mutation of mutations) {
                if (mutation.type === "attributes") {
                    switch (mutation.attributeName) {
                        case "sidenav-activechange":
                            componentTradingviewWidget.createGraph()
                            this.optTokenName()
                            // remove attribute to reset option Strike
                            document.querySelector(".opt-strike").removeAttribute("dds-selected")
                            this.optStrike(true)
                            this.optExpiry()
                            this.optSpread(0, 5)
                            
                            this.optPrice()
                            this.liquidityPool()
                            this.activeTransactions()
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

        // observe option Spread checkbox
        const optSpreadCheckOpt = {attributes: true, attributeFilter: ["customcheckbox-clicked"]}
        const optSpreadCheckObserver = new MutationObserver((mutations) => {
            for (let mutation of mutations) {
                if (mutation.attributeName === "customcheckbox-clicked") {
                    const optSpreadDropdownSelect = document.querySelector(".opt-spread.dropdown-select")
                    if (mutation.target.classList.contains("cc-checked")) {
                        optSpreadDropdownSelect.classList.remove("hide")
                        this.optPrice()
                    } else {
                        optSpreadDropdownSelect.classList.add("hide")
                    }
                }
            }
        })
        optSpreadCheckObserver.observe(document.querySelector(".opt-spread.custom-checkbox"), optSpreadCheckOpt)

        // observe option Spread dropdown input
        const optSpreadInputOpt = {attributes: true, attributeFilter: ["numberandpercentage-updated"]}
        const optSpreadInputObserver = new MutationObserver((mutations) => {
            for (let mutation of mutations) {
                if (mutation.attributeName === "numberandpercentage-updated") {
                    const optSpreadInputVal = document.querySelector(".opt-spread.dropdown-select input").value
                    if (optSpreadInputVal.includes("%")) {
                        this.optSpread(0, optSpreadInputVal.replace("%", ""))
                    } else {
                        this.optSpread(optSpreadInputVal)
                    }
                    console.log(optSpreadInputVal)
                    this.optPrice()
                }
            }
        })
        optSpreadInputObserver.observe(document.querySelector(".opt-spread.dropdown-select input"), optSpreadInputOpt)
    },

    optTokenName() {
        // console.log("optTokenName()")
        document.querySelector(".opt-token .ts-token-name").textContent = tokenName()
    },

    async optToken() {
        // console.log("optToken()")
        // const optToken = await getVolTokenName(null, this.getExpiryValue())
        // document.querySelector(".opt-token .ts-token").textContent = optToken
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

    async optSpread(value1 = 0, value2 = 0) {
        // console.log("optSpread()")
        try {
            const currPrice = await getPrice(tokenAddress())
            let spreadVal1 = value1
            let spreadVal2 = value2
            
            if (value1 > 0) {
                spreadVal2 = Big(spreadVal1).div(currPrice.replace("$", "")).times(100).round(2).toNumber()
            } else {
                spreadVal1 = Big(currPrice.replace("$", "")).times(spreadVal2).div(100).round(2).toNumber()
            }
            componentDropdownSelect.setValues(document.querySelector(".opt-spread.dropdown-select"), spreadVal1, `${spreadVal2}%`)

        } catch (error) {
            console.error(error)
        }
    },

    optPrice(inOverlayPopup = false) {
        console.log("optPrice()")
        new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({
                    "strike": this.getStrikeValue(), 
                    "amount": this.getAmountValue(), 
                    "expiry": this.getExpiryValue(),
                    "spread": this.getSpreadValue()
                })
            }, this.globals.init ? 2000 : 500)
        })
        .then(async(res) => { 
            console.log(res)
            // console.log(tokenName(), this.isBuy(), this.getOptionType(), this.getPaymentMethodValue(), res.strike, res.amount, res.expiry)
            const optPrice = await calcOptionPrice(null, tokenName(), this.isBuy(), this.getOptionType(), this.getPaymentMethodValue(), res.strike, res.spread, res.amount, res.expiry)
            // console.log(optPrice)
            
            if (inOverlayPopup) {
                // console.log("refresh inOverlayPopup")
                if (document.querySelector(".opt-spread.custom-checkbox.cc-checked")) {
                    document.querySelector(".overlay-popup .to-spread span").textContent = res.spread
                }

                document.querySelector(".overlay-popup .to-volatility span").textContent = optPrice.volatility
                document.querySelector(".overlay-popup .to-premium span").textContent = optPrice.premium
                document.querySelector(".overlay-popup .to-collateral span").textContent = optPrice.collateral
                document.querySelector(".overlay-popup .to-fee span").textContent = optPrice.fee
            } else {
                document.querySelector(".opt-price .info-volatility").textContent = optPrice.volatility
                document.querySelector(".opt-price .info-premium").textContent = optPrice.premium
                document.querySelector(".opt-price .info-collateral").textContent = optPrice.collateral
            }
        })
        .catch((err) => {
            console.warn(err)
            document.querySelector(".opt-price .info-volatility").textContent = 'No Quote'
            document.querySelector(".opt-price .info-premium").textContent = 'No Quote'
            document.querySelector(".opt-price .info-collateral").textContent = 'No Quote'
        })
    },

    async liquidityPool() {
        // console.log("liquidityPool()")
        const liquidityPool = await getCapital()
        document.querySelector(".liquidity-pool .pb-price-end").textContent = liquidityPool.gross
        document.querySelector(".liquidity-pool .pb-price-from").textContent = liquidityPool.utilized
        document.querySelector(".liquidity-pool .pb-text-value").textContent = liquidityPool.text
        componentPercentageBar.progressBar(document.querySelector(".liquidity-pool"), liquidityPool.perc)
    },

    activeTransactions() {
        // console.log("activeTransactions()")
        const transactions = document.querySelector(".transactions")
        getLoader(transactions)

        const transactionsTable = transactions.querySelector(".comp-dynamic-table")
        transactionsTable.innerHTML = `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th class="sortable sort-text">Type</th>
                            <th class="sortable sort-text">B/S</th>
                            <th class="sortable sort-text">Expiry</th>
                            <th class="sortable">Strike</th>
                            <th class="sortable">Spread</th>
                            <th class="sortable">Amount</th>
                            <th class="sortable">P&L</th>
                            <th class="sortable">Delta</th>
                            <th class="sortable">Gamma</th>
                            <th class="sortable">Vega</th>
                            <th class="sortable">Theta</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>`

        getActiveTransactions(null).then((results) => {
            getLoader(transactions, false)

            const dataRows = []
            results.forEach((data) => {
                dataRows.push([
                    data.Type,
                    data.BS,
                    data.Expiry,
                    data.Strike,
                    data.Spread,
                    data.Amount,
                    data.PnL,
                    data.Delta,
                    data.Gamma,
                    data.Vega,
                    data.Theta
                ])
            })

            componentTables.setDynamic(transactionsTable, dataRows)
        })
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
                {name: "Spread:", span: "n.a.", class: "to-spread"},
                {name: "Expiry:", span: "-", class: "to-expiry"},
                {name: "Amount:", span: this.getAmountValue(), class: "to-amount"},
                {name: "Implied Volatility:", span: "-", class: "to-volatility"},
                {name: "Premium:", span: "-", class: "to-premium"},
                {name: "Collateral:", span: "-", class: "to-collateral"},
                { name: "Fee:", span: "-", class: "to-fee" }
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
            document.querySelector("main").setAttribute("data-execute-button", true)
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
            const approveAllowance = await approveOptionSpending(null, this.isBuy(), this.getOptionType(), this.getPaymentMethodValue(), this.getStrikeValue(), this.getSpreadValue(), this.getAmountValue(), this.getExpiryValue())
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
                    const approveTrade = await executeOptionTrade(null, this.isBuy(), this.getOptionType(), this.getPaymentMethodValue(), this.getStrikeValue(), this.getSpreadValue(), this.getAmountValue(), this.getExpiryValue())
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
        if (document.querySelector(".overlay-popup")) {
            console.log("executeTradeFailure()")
            document.querySelector("main").setAttribute("data-execute-failure", true)

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
        }

        this.clearTradeTimer()
    },

    executeTradeTimer(elemTimer) {
        console.log("executeTradeTimer()")
        const padTime = (val) => val > 9 ? val : `0${val}`
        let totalSeconds = 0
        this.globals.execIntervalId = setInterval(() => {
            if (totalSeconds > 120) {
                // more than 2 mins, create warning
                console.log("more than 2 mins, show warning")
                this.executeTradeFailure(document.querySelector(".overlay-popup .executetrade"), "Warning: Transaction has taking longer than normal to be mined. You can close the window and try to trade again.")
            } else {
                totalSeconds++
                elemTimer.textContent = `${padTime(parseInt(totalSeconds / 60))}:${padTime(totalSeconds % 60)}`
            }
        }, 1000)
    },

    clearTradeTimer() {
        console.log("clearTradeTimer()")
        clearInterval(this.globals.execIntervalId)
        this.globals.execIntervalId = null
    },

    isBuy() {
        return componentToggleSwitches.getActiveItem(document.querySelector(".opt-buysell")).toLowerCase() === "buy"
    },

    isCall(){
        return componentToggleSwitches.getActiveItem(document.querySelector(".opt-callput")).toLowerCase() === "call"
    },

    getOptionType() {
        const isCall = componentToggleSwitches.getActiveItem(document.querySelector(".opt-callput")).toLowerCase() === "call"
        const isSpreadCheckboxChecked = document.querySelector(".opt-spread.custom-checkbox.cc-checked")
        
        if (isCall){
            if (isSpreadCheckboxChecked === null) {
                return 0
            }
            else{
                return 2
            }
        }
        else{
            if (isSpreadCheckboxChecked === null) {
                return 1
            }
            else {
                return 3
            }
        }
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
        const expiryText = document.querySelector(".opt-expiry .ds-value1").textContent
        return expiryText.includes('Hours') ? (expiryText.replace("Hours", "").trim() / 24) : expiryText.replace("Days", "").replace("Day", "").trim()
    },

    getSpreadValue() {
        const isSpreadCheckboxChecked = document.querySelector(".opt-spread.custom-checkbox.cc-checked")

        if (isSpreadCheckboxChecked === null) {
            return 0
        }
        else{
            return document.querySelector(".opt-spread .ds-value1").textContent.trim()
        }   
    },
}