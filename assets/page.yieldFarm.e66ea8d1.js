import{y as m,B as q,m as y,S as g,A as x,C as S,s as f,a as w,D as A,E as C,F as k}from"./main.3ae5ee79.js";var N={globals:{elem:document.querySelector(".yieldfarm")},init(){document.querySelector(".pools .js-refresh").addEventListener("click",()=>this.setPoolsAndHottubs()),this.setActiveVote();const e={childList:!0,attributes:!0,attributeFilter:["sidenav-activechange","sidenav-refreshprice"]};new MutationObserver(a=>{console.log("sidenav refreshed from Yield Farm!");for(let n of a)if(n.type==="attributes")switch(n.attributeName){case"sidenav-activechange":this.setPoolsAndHottubs();break}this.globals.init=!1}).observe(this.globals.elem.querySelector(".sidenav"),e)},setPoolsAndHottubs(){const e=document.querySelector(".pool-list"),o=document.querySelector(".active-hottubs");m(e),m(o);const a=e.querySelector(".comp-dynamic-table");a.innerHTML=`
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th class="sortable sort-text">Name</th>
                            <th class="sortable sort-text">Symbol</th>
                            <th class="sortable sort-text">Market Cap</th>
                            <th class="sortable">Utilization</th>
                            <th class="sortable">Estimated Yield</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>`;const n=o.querySelector(".hottubs-content");n.innerHTML=`
            <div class="swiper">
                <div class="swiper-wrapper"></div>
            </div>
            <div class="swiper-button-next hide-important"></div>
            <div class="swiper-button-prev hide-important"></div>`,q(null).then(s=>{m(e,!1),m(o,!1);const p=[];let r="";s.forEach(t=>{p.push([t.Name,t.Symbol,t.MarketCap,t.Utilization,t.EstimatedYield]),r+=`
                    <div class="swiper-slide">
                        <div class="in-box">
                            <ul class="info">
                                <li class="info-name">Name: <span>${t.Name}</span></li>
                                <li class="info-address hide">Address: <span>${t.Address}</span></li>
                                <li>Description: <span>${t.Description}</span></li>
                                <li>Dedicated hedging address: <span>${y(t.Bot)}</span></li>
                                <li>AMM factor: <span>${t.AMMCurveFactor}</span></li>
                                <li>Exercise fee: <span>${t.ExerciseFee}</span></li>
                                <li>Minimum volatility price: <span>${t.MinVolPrice}</span></li>
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
                    </div>`}),n.querySelector(".swiper-wrapper").innerHTML=r;const d=new g(".swiper",{slidesPerView:"auto",spaceBetween:12,grabCursor:!1});if(x.setDynamic(a,p),s.length>1){const t=n.querySelector(".swiper-button-next");t.classList.remove("hide-important"),t.addEventListener("click",()=>d.slideNext());const i=n.querySelector(".swiper-button-prev");i.classList.remove("hide-important"),i.addEventListener("click",()=>d.slidePrev()),a.querySelectorAll("tbody tr").forEach((l,c)=>{l.classList.add("cursor"),l.addEventListener("click",()=>{d.slideTo(c)},!1)})}n.querySelectorAll(".swiper-slide").forEach(t=>{t.querySelector(".js-topup").addEventListener("click",i=>{i.preventDefault(),this.setPopupInfo({type:"topup",title:"Top up in liquidity pool",poolName:t.querySelector(".info-name span").textContent.trim(),poolAddress:t.querySelector(".info-address span").textContent.trim(),poolAmount:t.querySelector("input[name='usdc-amount']").value})},!1),t.querySelector(".js-takeout").addEventListener("click",i=>{i.preventDefault(),this.setPopupInfo({type:"takeout",title:"Take out from liquidity pool",poolName:t.querySelector(".info-name span").textContent.trim(),poolAddress:t.querySelector(".info-address span").textContent.trim(),poolAmount:t.querySelector("input[name='usdc-amount']").value})},!1)})})},setPopupInfo(e){e.type==="topup"?S(e.poolAddress,e.poolAmount).then(o=>{const a=[{name:"Name of liquidity pool:",span:e.poolName},{name:"Address of liquidity pool:",span:y(e.poolAddress)},{name:"Top up:",span:o.invest},{name:"Liquidity pool tokens:",span:o.holding}];f(e.title,w(a,"liquiditypool")),this.executeTrade(e.type,e.poolAddress,parseFloat(e.poolAmount),null)}):e.type==="takeout"&&A(e.poolAddress,e.poolAmount).then(o=>{const a=[{name:"Name of liquidity pool:",span:e.poolName},{name:"Address of liquidity pool:",span:y(e.poolAddress)},{name:"Take out:",span:o.divest},{name:"Liquidity pool tokens:",span:o.holding}];f(e.title,w(a,"liquiditypool")),this.executeTrade(e.type,e.poolAddress,parseFloat(e.poolAmount),null)})},executeTrade(e,o,a,n){const s=document.createElement("div");s.className="executetrade",document.querySelector(".overlay-popup .op-content").appendChild(s);let p="blue";e==="topup"?p="green":e==="takeout"&&(p="pink");const r=document.createElement("a");r.setAttribute("href","#"),r.className=`btn btn-${p}`,r.textContent="Execute",s.appendChild(r),r.addEventListener("click",async d=>{d.preventDefault(),r.remove();const t=document.createElement("div");t.className="await-approval",t.textContent="Awaiting for allowance approval";const i=document.createElement("div");i.className="await-approval-timer",i.textContent="00:00",t.appendChild(i),s.appendChild(t);const l=document.createElement("div");l.className="await-trade",l.textContent="Awaiting for transaction";const c=document.createElement("div");c.className="await-trade-timer",c.textContent="00:00",l.appendChild(c),s.appendChild(l),this.executeTradeTimer(i,120);const T="Warning: Transaction has failed.",b=await C(e,o,a);console.log("approve finished",b),b==="failure"?this.executeTradeFailure(s,T):(t.classList.add("await-active"),t.textContent="Allowance approved.",i.remove(),this.clearTradeTimer(),setTimeout(async()=>{this.executeTradeTimer(c,e==="propose"?300:120),console.log("prior to trade");const v=await k(e,o,a,n);if(console.log("trade finished",v),v==="")this.executeTradeFailure(s,T);else{l.classList.add("await-active"),l.textContent="Transaction mined.",c.remove(),this.clearTradeTimer();const h=document.createElement("div");h.className="approve-trade-link";const u=document.createElement("a");u.setAttribute("href",v),u.setAttribute("target","_blank"),u.className="link-arrow",u.textContent="View on Polygonscan",h.appendChild(u),s.appendChild(h)}},500))},!1)},executeTradeFailure(e,o){const a=document.createElement("div");a.className="await-failure";const n=document.createElement("div");n.className="warning-icon";const s=document.createElement("div");s.className="warning-text",s.textContent=o,a.appendChild(n),a.appendChild(s),e.appendChild(a)},executeTradeTimer(e,o){const a=s=>s>9?s:`0${s}`;let n=0;this.globals.execIntervalId=setInterval(()=>{n++,n>o?(this.executeTradeFailure(document.querySelector(".overlay-popup .executetrade"),"Warning: Transaction has taking longer than normal to be mined. You can close the window and try to trade again."),this.clearTradeTimer()):e.textContent=`${a(parseInt(n/60))}:${a(n%60)}`},1e3)},clearTradeTimer(){clearInterval(this.globals.execIntervalId),this.globals.execIntervalId=null,console.log("clearTradeTimer()")},setActiveVote(){const e=document.querySelector(".active-vote");e.querySelector(".js-propose").addEventListener("click",o=>{o.preventDefault();const a=[{name:"Pool Name:",span:e.querySelector("input[name='pool-name']").value},{name:"Pool Symbol:",span:e.querySelector("input[name='pool-symbol']").value},{name:"Description:",span:e.querySelector("input[name='description']").value},{name:"Hedging Address:",span:e.querySelector("input[name='address']").value},{name:"Initial USDC Amount:",span:e.querySelector("input[name='usdc-amount']").value}];f("Propose strategies",w(a,"proposestrategies")),this.executeTrade("propose",null,parseFloat(e.querySelector("input[name='usdc-amount']").value),{name:e.querySelector("input[name='pool-name']").value,symbol:e.querySelector("input[name='pool-symbol']").value,description:e.querySelector("input[name='description']").value,hedgingAddress:e.querySelector("input[name='address']").value})})}};export{N as default};
