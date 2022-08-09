import Swiper from "swiper"
import { getAllPoolsInfo } from "../helpers/web3"
import componentTables from "../components/component.tables"

export default {
    globals: {
        elem: document.querySelector(".liquidity"),
    },

    init() {
        // static methods call
        this.setPoolsAndHottubs()

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

    setPoolsAndHottubs() {
        getAllPoolsInfo(null).then((results) => {
            const poolsTable = document.querySelector(".pools .comp-dynamic-table")
            const poolsData = []
            let swiperSlideElem = ""

            results.forEach((data) => {
                poolsData.push([
                    data.Name,
                    data.MarketCap,
                    data.Utilization,
                    data.EstimatedYield
                ])

                const strBot = String(data.Bot)
                swiperSlideElem += `
                    <div class="swiper-slide">
                        <div class="in-box">
                            <ul class="info">
                                <li>Name: <span>${data.Name}</span></li>
                                <li>Description: <span>${data.Description}</span></li>
                                <li>Dedicated hedging address: <span>${strBot.substring(0, 4)}...${strBot.substring(strBot.length - 4)}</span></li>
                                <li>AMM factor: <span>${data.AMMCurveFactor}</span></li>
                                <li>Exercise fee: <span>${data.ExerciseFee}</span></li>
                                <li>Minimum volatility price: <span>${data.MinVolPrice}</span></li>
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
            })
            document.querySelector(".swiper .swiper-wrapper").innerHTML = swiperSlideElem
            componentTables.setDynamic(poolsTable, poolsData)

            const swiper = new Swiper(".swiper", {
                slidesPerView: "auto",
                spaceBetween: 12,
                grabCursor: false,
            })

            if (results.length > 1) {
                const btnNext = this.globals.elem.querySelector(".swiper-button-next")
                btnNext.classList.remove("hide-important")
                btnNext.addEventListener("click", () => {
                    swiper.slideNext()
                })

                const btnPrev = this.globals.elem.querySelector(".swiper-button-prev")
                btnPrev.classList.remove("hide-important")
                btnPrev.addEventListener("click", () => {
                    swiper.slidePrev()
                })

                poolsTable.querySelectorAll("tbody tr").forEach((row, index) => {
                    row.classList.add("cursor")
                    row.addEventListener("click", () => {
                        swiper.slideTo(index)
                    }, false)
                })
            }
        })
    },
}