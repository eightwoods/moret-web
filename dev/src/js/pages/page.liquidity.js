import Swiper from "swiper"
import { getAllPools, getPoolInfo, quoteInvestInPool, quoteDivestFromPool, approvePool, tradePool } from "../helpers/web3"
import { getLoader, minimizeAddress, createList, showOverlayPopup } from "../helpers/utils"
import componentTables from "../components/component.tables"

export default {
    globals: {
        elem: document.querySelector(".liquidity"),
    },

    init() {
        // static methods call
        document.querySelector(".pools .js-refresh").addEventListener("click", () => this.setLiquidity())
        this.setActiveVote()

        // observe sidenav
        const sidenavOptions = {
            childList: true, 
            attributes: true, 
            attributeFilter: ["sidenav-activechange", "sidenav-refreshprice"]
        }
        const sidenavObserver = new MutationObserver((mutations) => {
            console.log("sidenav refreshed from Liquidity!")

            for (let mutation of mutations) {
                if (mutation.type === "attributes") {
                    switch (mutation.attributeName) {
                        case "sidenav-activechange":
                            this.setLiquidity()
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

    setLiquidity() {
        console.log("setLiquidity()")
        const poolList = document.querySelector(".pool-list")
        const hotTubs = document.querySelector(".active-hottubs")
        getLoader(poolList)
        getLoader(hotTubs)
        
        const poolsTable = poolList.querySelector(".comp-dynamic-table")
        poolsTable.innerHTML = `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th class="sortable sort-text">Name</th>
                            <th class="sortable sort-text">Symbol</th>
                            <th class="sortable sort-text">Description</th>
                            <th class="sortable">Market Cap</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>`

        const poolsSwiper = hotTubs.querySelector(".hottubs-content")
        poolsSwiper.innerHTML = `
            <div class="swiper">
                <div class="swiper-wrapper"></div>
            </div>
            <div class="swiper-button-next hide-important"></div>
            <div class="swiper-button-prev hide-important"></div>`
        
        getAllPools().then((addresses) => {
            // console.log(addresses)
            const poolsData = []
            let swiperSlideElem = ""
            let counter = 0

            addresses.forEach(async(address, index) => {
                try {
                    const poolName = await getPoolInfo(address, "name")
                    const poolSymbol = await getPoolInfo(address, "symbol")
                    const poolDescription = await getPoolInfo(address, "description")
                    const poolMarketCap = await getPoolInfo(address, "aum")
                    const poolPriceOffer = await getPoolInfo(address, "navoffer")
                    const poolPriceBid = await getPoolInfo(address, "navbid")
                    const poolBalance = await getPoolInfo(address, "balance")
                    
                    poolsData.push([poolName, poolSymbol, poolDescription, poolMarketCap])

                    swiperSlideElem += `
                        <div class="swiper-slide">
                            <div class="in-box">
                                <ul class="info">
                                    <li class="info-name">Name: <span>${poolName}</span></li>
                                    <li class="info-address hide">Address: <span>${address}</span></li>
                                    <li>Unit Price: <span>$${poolPriceOffer.toFixed(2)}</span></li>
                                    <li>Holding Value: <span>$${(poolPriceOffer*poolBalance).toFixed(2)}</span></li>
                                    <li>LP Utilized: <span>${(poolPriceOffer > 0 ? poolPriceBid / poolPriceOffer : 0).toLocaleString(undefined, { style: "percent", minimumFractionDigits: 0 })}</span></li>
                                </ul>
                                <div class="buttons m-t-24">
                                    <div class="col">
                                        <div class="in-border word-nowrap white-50">
                                            <input type="number" name="usdc-amount" value="50" />&nbsp;&nbsp;USDC
                                        </div>
                                    </div>
                                    <div class="col">
                                        <a href="#" class="btn btn-green js-topup">Top-up</a>
                                    </div>
                                    <div class="col">
                                        <a href="#" class="btn btn-pink js-takeout">Take-out</a>
                                    </div>
                                </div>
                            </div>
                        </div>`

                    // ALL DONE!
                    counter++
                    if (counter === addresses.length) {
                        getLoader(poolList, false)
                        getLoader(hotTubs, false)

                        // insert elements into swiper
                        poolsSwiper.querySelector(".swiper-wrapper").innerHTML = swiperSlideElem
                        // init swiper
                        const swiper = new Swiper(".swiper", {
                            slidesPerView: "auto",
                            spaceBetween: 12,
                            grabCursor: false,
                        })

                        // init pools table
                        componentTables.setDynamic(poolsTable, poolsData)

                        // events
                        if (addresses.length > 1) {
                            // swiper arrows
                            const swiperBtnNext = poolsSwiper.querySelector(".swiper-button-next")
                            swiperBtnNext.classList.remove("hide-important")
                            swiperBtnNext.addEventListener("click", () => swiper.slideNext())

                            const swiperBtnPrev = poolsSwiper.querySelector(".swiper-button-prev")
                            swiperBtnPrev.classList.remove("hide-important")
                            swiperBtnPrev.addEventListener("click", () => swiper.slidePrev())

                            // pools table rows to navigate swiper
                            poolsTable.querySelectorAll("tbody tr").forEach((row, index) => {
                                row.classList.add("cursor")
                                row.addEventListener("click", () => {
                                    swiper.slideTo(index)
                                }, false)
                            })
                        }

                        // Top-up and Take-out
                        poolsSwiper.querySelectorAll(".swiper-slide").forEach((slide) => {
                            slide.querySelector(".js-topup").addEventListener("click", (e) => {
                                e.preventDefault()
                                this.setPopupInfo({
                                    type: "topup",
                                    title: "Top up in liquidity pool",
                                    poolName: slide.querySelector(".info-name span").textContent.trim(),
                                    poolAddress: slide.querySelector(".info-address span").textContent.trim(),
                                    poolAmount: slide.querySelector("input[name='usdc-amount']").value,
                                })
                            }, false)

                            slide.querySelector(".js-takeout").addEventListener("click", (e) => {
                                e.preventDefault()
                                this.setPopupInfo({
                                    type: "takeout",
                                    title: "Take out from liquidity pool",
                                    poolName: slide.querySelector(".info-name span").textContent.trim(),
                                    poolAddress: slide.querySelector(".info-address span").textContent.trim(),
                                    poolAmount: slide.querySelector("input[name='usdc-amount']").value,
                                })
                            }, false)
                        })
                    }
                } catch (error) {
                    console.error(error)
                    console.log("Fail! refresh data load...")
                    const failTimeout = setTimeout(() => {
                        this.setLiquidity()
                        clearTimeout(failTimeout)
                    }, 5000)
                }
            })

        }).catch(error => {
            console.error(error)
        })
    },

    setPopupInfo(objVal) {
        if (objVal.type === "topup") {
            quoteInvestInPool(objVal.poolAddress, objVal.poolAmount).then((results) => {
                const arrNames = [
                    {name: "Name of liquidity pool:", span: objVal.poolName},
                    {name: "Address of liquidity pool:", span: minimizeAddress(objVal.poolAddress)},
                    {name: "Top up:", span: results.invest},
                    {name: "Liquidity pool tokens:", span: results.holding},
                ]

                showOverlayPopup(objVal.title, createList(arrNames, "liquiditypool"))
                this.executeTrade(objVal.type, objVal.poolAddress, parseFloat(objVal.poolAmount), null)
            })
        } else if (objVal.type === "takeout"){
            quoteDivestFromPool(objVal.poolAddress, objVal.poolAmount).then((results) => {
                const arrNames = [
                    { name: "Name of liquidity pool:", span: objVal.poolName },
                    { name: "Address of liquidity pool:", span: minimizeAddress(objVal.poolAddress) },
                    { name: "Take out:", span: results.divest },
                    { name: "Liquidity pool tokens:", span: results.holding },
                ]

                showOverlayPopup(objVal.title, createList(arrNames, "liquiditypool"))
                this.executeTrade(objVal.type, objVal.poolAddress, parseFloat(objVal.poolAmount), null)
            })
        }
    },

    executeTrade(type, poolAddress, amount, poolParams) {
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
            const approveAllowance = await approvePool(type, poolAddress, amount)
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
                    console.log('prior to trade')
                    const approveTrade = await tradePool(type, poolAddress, amount, poolParams)
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

    setActiveVote() {
        const activeVote = document.querySelector(".active-vote")

        activeVote.querySelector(".js-propose").addEventListener("click", (e) => {
            e.preventDefault()
            const arrNames = [
                { name: "Pool Name:", span: activeVote.querySelector("input[name='pool-name']").value },
                { name: "Pool Symbol:", span: activeVote.querySelector("input[name='pool-symbol']").value },
                { name: "Description:", span: activeVote.querySelector("input[name='description']").value },
                { name: "Hedging Address:", span: activeVote.querySelector("input[name='address']").value },
                { name: "Initial USDC Amount:", span: activeVote.querySelector("input[name='usdc-amount']").value },
            ]

            showOverlayPopup("Propose strategies", createList(arrNames, "proposestrategies"))
            this.executeTrade("propose", null, parseFloat(activeVote.querySelector("input[name='usdc-amount']").value), { "name": activeVote.querySelector("input[name='pool-name']").value, "symbol": activeVote.querySelector("input[name='pool-symbol']").value, "description": activeVote.querySelector("input[name='description']").value, "hedgingAddress": activeVote.querySelector("input[name='address']").value })
        })
    },
}