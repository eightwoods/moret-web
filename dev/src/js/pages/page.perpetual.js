import Swiper from "swiper"
import { tokenName, tokenPrice } from "../helpers/constant"
import { getAllSavers, getSaverInfo, approveSaver, tradeSaver } from "../helpers/web3"
import { getLoader, minimizeAddress, createList, showOverlayPopup } from "../helpers/utils"
import compChartComparison from "../components/component.chartComparison"
import compPercentageBarMulti from "../components/component.percentageBarMulti"
import componentTables from "../components/component.tables"

export default {
    globals: {
        elem: document.querySelector(".perpetual"),
    },

    init() {
        // static methods call
        document.querySelector(".perpetual-list-content .js-refresh").addEventListener("click", () => this.setPerpetuals())
        // this.setActiveVote()

        // observe sidenav
        const sidenavOptions = {
            childList: true, 
            attributes: true, 
            attributeFilter: ["sidenav-activechange", "sidenav-refreshprice"]
        }
        const sidenavObserver = new MutationObserver((mutations) => {
            console.log("sidenav refreshed from Perpetual!")

            for (let mutation of mutations) {
                if (mutation.type === "attributes") {
                    switch (mutation.attributeName) {
                        case "sidenav-activechange":
                            this.setPerpetuals()
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

    setPerpetuals() {
        const perpetualList = document.querySelector(".perpetual-list")
        const perpetualInfo = document.querySelector(".perpetual-info")
        getLoader(perpetualList)
        getLoader(perpetualInfo)

        const perpetualTable = perpetualList.querySelector(".comp-dynamic-table")
        perpetualTable.innerHTML = `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th class="sortable sort-text">Name</th>
                            <th class="sortable sort-text">Holding</th>
                            <th class="sortable">NAV</th>
                            <th class="sortable">P&L</th>
                            <th class="sortable sort-text">Status</th>
                            <th class="sortable">Next Vintage</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>`

        // reset
        this.setPerpetualInfo()

        getAllSavers().then((addresses) => {
            // console.log(addresses)
            getLoader(perpetualList, false)
            getLoader(perpetualInfo, false)

            const perpetualData = []
            const perpetualDataInfo = []
            const nowTime = Math.floor(Date.now() / 1000)

            addresses.forEach(async(address, index) => {
                try {
                    const name = await getSaverInfo(address, "name")
                    const symbol = await getSaverInfo(address, "symbol")
                    const holding = await getSaverInfo(address, "holding")
                    const aum = await getSaverInfo(address, "aum")
                    const nav = await getSaverInfo(address, "nav")
                    const estYield = await getSaverInfo(address, "yield")
                    const vintage = await getSaverInfo(address, "vintage")
                    const profit = await getSaverInfo(address, "profit")
                    // console.log(profit, estYield, vintage)
                    const vintageTime = await getSaverInfo(address, "time")
                    const description = await getSaverInfo(address, "description")

                    perpetualDataInfo.push({
                        "Name": name,
                        "Symbol": symbol,
                        "Address": address,
                        "Description": description,
                        "MarketCap": aum,
                        "UnitAsset": nav,
                        "Holding": holding,
                        "Yield": estYield,
                        "ProfitLoss": profit,
                        "NextVintageStart": vintageTime[1],
                        "VintageOpen": vintageTime[0],
                        "StartLevel": vintage["StartLevel"],
                        "Upside": vintage["Upside"],
                        "Downside": vintage["Downside"],
                        "Protection": vintage["Protection"],
                        "Tenor": vintageTime[3]
                    })

                    perpetualData.push([
                        perpetualDataInfo[index].Name,
                        perpetualDataInfo[index].Holding,
                        `$${perpetualDataInfo[index].UnitAsset}`,
                        perpetualDataInfo[index].ProfitLoss,
                        perpetualDataInfo[index].VintageOpen ? "Open": "Closed",
                        perpetualDataInfo[index].NextVintageStart
                    ])

                    // console.log(index, addresses.length)
                    // ALL DONE!
                    if ((index + 1) === addresses.length) {
                        // perpetual info data
                        this.setPerpetualInfo(perpetualDataInfo[0])

                        // init perpetuals table
                        componentTables.setDynamic(perpetualTable, perpetualData)

                        /// events
                        if (addresses.length > 1) {
                            // perpetual table rows to inject data 
                            perpetualTable.querySelectorAll("tbody tr").forEach((row, index) => {
                                row.classList.add("cursor")
                                row.addEventListener("click", () => {
                                    // perpetual info 
                                    this.setPerpetualInfo(perpetualDataInfo[index])
                                }, false)
                            })
                        }
                    }
                } catch (error) {
                    console.error(error)
                }
            })

        }).catch(error => {
            console.error(error)
        })
        
    },

    setPerpetualInfo(data) {
        const perpetualInfo = document.querySelector(".perpetual-info-content")
        if (!data) {
            perpetualInfo.textContent = ""
            return
        }
        
        const nowTime = Math.floor( Date.now() / 1000)
        perpetualInfo.innerHTML = `
            <div class="perpetual-row">
                <div class="perpetual-col">
                    <div class="header-title m-b-24">${data.Name}</div>
                    <div class="perpetual-content">
                        <div class="info">
                            <p class="m-b-20">${data.Description}</p>
                            <p>Vintage reopened at ${data.VintageOpen}</p>
                        </div>

                        <div class="percentage-bar-multi">
                            <div class="pbm-progress">
                                <div class="pbm-top">
                                    <div class="pbm-progressbar"></div>
                                    <div class="pbm-value size-sm"><span>${data.ProfitLoss}</span> P&L</div>
                                </div>
                                <div class="pbm-bottom">
                                    <div class="pbm-progressbar"></div>
                                    <div class="pbm-value size-sm"><span>${data.Yield}</span> Yield</div>
                                </div>
                            </div>
                        </div>
                        <div class="percentage-bar-text align-center word-nowrap white-50">
                            <p>Current Holding = ${data.Holding}</p>
                        </div>
                    </div>
                </div>
                <div class="perpetual-col">
                    <!-- <div class="chart-comparison-legends size-sm white-50">
                        <div class="ccl-legend">${tokenName()}</div>
                    </div> -->
                    <div class="chart-comparison-wrapper">
                        <div class="chart-comparison"></div>
                    </div>
                </div>
            </div>

            <div class="buttons-container"></div>`

        if (data.VintageOpen) {
            perpetualInfo.querySelector(".buttons-container").innerHTML = `
                <div class="buttons m-t-32">
                    <div class="col">
                        <div class="in-border word-nowrap white-50">
                            <input type="number" name="usdc-amount" value="6000" />&nbsp;&nbsp;USDC
                        </div>
                    </div>
                    <div class="col">
                        <a href="#" class="btn btn-green js-save">TOP UP</a>
                        <a href="#" class="btn btn-pink js-withdraw">WITHDRAW</a>
                    </div>
                </div>`
        }

        // initiate components
        compChartComparison.createChart({
            elem: perpetualInfo.querySelector(".chart-comparison"),
            endpoint1: `https://api.binance.com/api/v3/klines?symbol=${tokenName()}${tokenPrice()}T&interval=12h&limit=${data.Tenor}`,
            endpoint2: `https://api.binance.com/api/v3/klines?symbol=TKOUSDT&interval=12h&limit=${data.Tenor}`,
            linedata: [data.StartLevel, data.Upside, data.Downside, data.Downside - data.Protection],
        })

        // console.log(data.ProfitLoss, data.Yield)
        compPercentageBarMulti.progressBar(perpetualInfo.querySelector(".percentage-bar-multi"), data.ProfitLoss.replace("%", ""), data.Yield.replace("%", ""))
        
        // click events
        if (data.VintageOpen) {
            perpetualInfo.querySelector(".js-save").addEventListener("click", (e) => {
                e.preventDefault()
                this.setPopupInfo({
                    type: "save",
                    title: "Top up to vault",
                    data: data,
                    amount: parseFloat(document.querySelector("input[name='usdc-amount']").value),
                })
            }, false)

            perpetualInfo.querySelector(".js-withdraw").addEventListener("click", (e) => {
                e.preventDefault()
                this.setPopupInfo({
                    type: "withdraw",
                    title: "Withdraw from vault",
                    data: data,
                    amount: parseFloat(document.querySelector("input[name='usdc-amount']").value),
                })
            }, false)
        }
    },

    setPopupInfo(objVal) {
        console.log(objVal)
        let units = objVal.data.UnitAsset == 0 ? objVal.amount: objVal.amount / objVal.data.UnitAsset
        const arrNames = [
            {name: "Name:", span: objVal.data.Name},
            { name: "Address:", span: objVal.data.Address }, //minimizeAddress(objVal.data.Address)
            { name: "Unit price", span: `$${(objVal.data.UnitAsset)}` },
            { name: "Units:", span: `${(units).toFixed(2)} ${objVal.data.Symbol}` },
            { name: "Trade value:", span: `$${(objVal.amount).toFixed(2)}` },
        ]

        showOverlayPopup(objVal.title, createList(arrNames, "investinperpetuals"))
        this.executeTrade(objVal.type, objVal.data.Address, objVal.amount, units)
    },

    executeTrade(type, perpetualAddress, funding, units) {
        const container = document.createElement("div")
        container.className = "executetrade"
        document.querySelector(".overlay-popup .op-content").appendChild(container)

        let btnColor = "blue"
        if (type === "save") {
            btnColor = "green"
        } else if (type === "withdraw") {
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
            const approveAllowance = await approveSaver(type, perpetualAddress, funding, units)
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
                    console.log('prior to trade', type, perpetualAddress, funding, units)
                    const approveTrade = await tradeSaver(type, perpetualAddress, funding, units)
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