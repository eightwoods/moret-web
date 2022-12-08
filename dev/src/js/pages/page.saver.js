import Swiper from "swiper"
import { getAllSaverInfo, quoteInvestInSaver, quoteDivestFromSaver, approveSaver, tradeSaver } from "../helpers/web3"
import { getLoader, minimizeAddress, createList, showOverlayPopup } from "../helpers/utils"
import compPercentageBarMulti from "../components/component.percentageBarMulti"
import componentTables from "../components/component.tables"

export default {
    globals: {
        elem: document.querySelector(".saver"),
    },

    init() {
        // static methods call
        document.querySelector(".saver-list-content .js-refresh").addEventListener("click", () => this.setSavers())
        // this.setActiveVote()

        // observe sidenav
        const sidenavOptions = {
            childList: true, 
            attributes: true, 
            attributeFilter: ["sidenav-activechange", "sidenav-refreshprice"]
        }
        const sidenavObserver = new MutationObserver((mutations) => {
            console.log("sidenav refreshed from Saver!")

            for (let mutation of mutations) {
                if (mutation.type === "attributes") {
                    switch (mutation.attributeName) {
                        case "sidenav-activechange":
                            this.setSavers()
                            break
                        case "sidenav-refreshprice":
                            break
                        default:
                    }
                }
            }

            this.globals.init = false
        })
        sidenavObserver.observe(this.globals.elem.querySelector(".sidenav"), sidenavOptions)
    },

    setSavers() {
        const saverList = document.querySelector(".saver-list")
        const saverInfo = document.querySelector(".saver-info")
        getLoader(saverList)
        getLoader(saverInfo)
        
        const saverTable = saverList.querySelector(".comp-dynamic-table")
        saverTable.innerHTML = `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th class="sortable sort-text">Name</th>
                            <th class="sortable sort-text">Holding</th>
                            <th class="sortable">NAV</th>
                            <th class="sortable">APY</th>
                            <th class="sortable">P&L</th>
                            <th class="sortable sort-text">Status</th>
                            <th class="sortable">Next Vintage</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>`

        // reset
        this.setSaverInfo()

        getAllSaverInfo(null).then((results) => {
            // console.log(results)
            getLoader(saverList, false)
            getLoader(saverInfo, false)

            const saverData = []
            const nowTime = Math.floor( Date.now() / 1000)

            results.forEach((data) => {
                saverData.push([
                    data.Name,
                    data.Holding,
                    data.UnitAsset,
                    data.StaticYield,
                    data.ProfitLoss,
                    data.NextVintageTime > nowTime? "Closed": "Open",
                    data.NextVintageStart
                ])

                // saver info data
                this.setSaverInfo(data)
            })

            // init savers table
            componentTables.setDynamic(saverTable, saverData)

            // events
            if (results.length > 1) {
                // saver table rows to inject data 
                saverTable.querySelectorAll("tbody tr").forEach((row, index) => {
                    row.classList.add("cursor")
                    row.addEventListener("click", () => {
                        // saver info 
                        this.setSaverInfo(results[index])
                    }, false)
                })
            }
        })
    },

    setSaverInfo(data) {
        const saverInfo = document.querySelector(".saver-info-content")
        if (!data) {
            saverInfo.textContent = ""
            return false
        }
        
        const nowTime = Math.floor( Date.now() / 1000)
        saverInfo.innerHTML = `
            <div class="header-title m-b-24">${data.Name}</div>
            <div class="saver-content">
                <div class="info">
                    <p class="m-b-20">${data.Symbol}.saver address: ${minimizeAddress(data.Address)}</p>
                    <p>Vintage reopened at ${data.NextVintage}</p>
                </div>

                <div class="percentage-bar-multi">
                    <div class="pbm-progress">
                        <div class="pbm-top">
                            <div class="pbm-progressbar"></div>
                            <div class="pbm-value size-sm"><span>0%</span> P&L</div>
                        </div>
                        <div class="pbm-bottom">
                            <div class="pbm-progressbar"></div>
                            <div class="pbm-value size-sm"><span>0%</span> APY</div>
                        </div>
                    </div>
                </div>
                <div class="percentage-bar-text align-center word-nowrap white-50 m-b-32">
                    <p>$1,000.00 holding</p>
                </div>

                <div class="buttons-container"></div>
            </div>`

        const showButtons = data.NextVintageTime <= nowTime
        if (showButtons) {
            saverInfo.querySelector(".buttons-container").innerHTML = `
                <div class="buttons">
                    <div class="col">
                        <div class="in-border word-nowrap white-50">
                            <input type="number" name="usdc-amount" value="6000" />&nbsp;&nbsp;USDC
                        </div>
                    </div>
                    <div class="col">
                        <a href="#" class="btn btn-green js-save">SAVE</a>
                        <a href="#" class="btn btn-pink js-withdraw">WITHDRAW</a>
                    </div>
                </div>`
        }

        compPercentageBarMulti.progressBar(saverInfo.querySelector(".percentage-bar-multi"), data.StaticYield.replace("%", ""), data.ProfitLoss.replace("%", ""))
        
        // click events
        if (showButtons) {
            saverInfo.querySelector(".js-save").addEventListener("click", (e) => {
                e.preventDefault()
                this.setPopupInfo({
                    type: "save",
                    title: "Invest to save",
                    data: data,
                })
            }, false)

            saverInfo.querySelector(".js-withdraw").addEventListener("click", (e) => {
                e.preventDefault()
                this.setPopupInfo({
                    type: "withdraw",
                    title: "Invest to withdraw",
                    data: data,
                })
            }, false)
        }
    },

    setPopupInfo(objVal) {
        console.log(objVal)
        const arrNames = [
            {name: "Name:", span: objVal.data.Name},
            {name: `${objVal.data.Symbol}.saver address:`, span: minimizeAddress(objVal.data.Address)},
            {name: "Vintage reopened at", span: objVal.data.NextVintage},
            {name: "P&L:", span: objVal.data.StaticYield},
            {name: "APY:", span: objVal.data.ProfitLoss},
        ]

        showOverlayPopup(objVal.title, createList(arrNames, "investinsavers"))
        // this.executeTrade(objVal.type, objVal.saverAddress, results.funding, results.units)
    },

    executeTrade(type, saverAddress, funding, units) {
        const container = document.createElement("div")
        container.className = "executetrade"
        document.querySelector(".overlay-popup .op-content").appendChild(container)

        let btnColor = "blue"
        if (type === "topup") {
            btnColor = "green"
        } else if (type === "takeout") {
            btnColor = "pink"
        }

        const button = document.createElement("a")
        button.setAttribute("href", "#")
        button.className = `btn btn-${btnColor}`
        button.textContent = "Execute"
        container.appendChild(button)

        button.addEventListener("click", async(e) => {
            e.preventDefault()
            // document.querySelector("main").setAttribute("data-execute-button", true)
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
            this.executeTradeTimer(awaitApprovalTimer, 120)
            const warningMessage = "Warning: Transaction has failed."
            const approveAllowance = await approveSaver(type, saverAddress, funding, units)
            console.log('approve finished', approveAllowance)
            if (approveAllowance === "failure") {
                this.executeTradeFailure(container, warningMessage)
            } else {
                awaitApproval.classList.add("await-active")
                awaitApproval.textContent = "Allowance approved."
                awaitApprovalTimer.remove()
                this.clearTradeTimer()

                // execute option trade
                setTimeout(async () => {
                    this.executeTradeTimer(awaitTradeTimer, type==="propose"? 300: 120)
                    console.log('prior to trade', type, saverAddress, funding, units)
                    const approveTrade = await tradeSaver(type, saverAddress, funding, units)
                    console.log('trade finished', approveTrade)
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

    executeTradeTimer(elemTimer, maxTimeOut) {
        // console.log("executeTradeTimer()")
        const padTime = (val) => val > 9 ? val : `0${val}`
        let totalSeconds = 0
        this.globals.execIntervalId = setInterval(() => {
            totalSeconds++
            if (totalSeconds > maxTimeOut) {
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

}