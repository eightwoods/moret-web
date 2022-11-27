import{y as m,B as x,S,A as y,C,m as T,s as b,a as g,D as N,E as A,F as k}from"./main.78a41c4d.js";var E={globals:{elem:document.querySelector(".saver")},init(){document.querySelector(".pools .js-refresh").addEventListener("click",()=>this.setSavers());const t={childList:!0,attributes:!0,attributeFilter:["sidenav-activechange","sidenav-refreshprice"]};new MutationObserver(s=>{console.log("sidenav refreshed from Saver!");for(let n of s)if(n.type==="attributes")switch(n.attributeName){case"sidenav-activechange":this.setSavers();break}this.globals.init=!1}).observe(this.globals.elem.querySelector(".sidenav"),t)},setSavers(){const t=document.querySelector(".saver-list"),a=document.querySelector(".active-hottubs");m(t),m(a);const s=t.querySelector(".comp-dynamic-table");s.innerHTML=`
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th class="sortable sort-text">Name</th>
                            <th class="sortable sort-text">Holdings</th>
                            <th class="sortable">NAV</th>
                            <th class="sortable">APY</th>
                            <th class="sortable">P&L</th>
                            <th class="sortable sort-text">Status</th>
                            <th class="sortable">Next Vintage</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>`;const n=a.querySelector(".hottubs-content");n.innerHTML=`
            <div class="swiper">
                <div class="swiper-wrapper"></div>
            </div>
            <div class="swiper-button-next hide-important"></div>
            <div class="swiper-button-prev hide-important"></div>`,x(null).then(r=>{m(t,!1),m(a,!1);const d=[];let l="";const u=Math.floor(Date.now()/1e3);r.forEach(e=>{d.push([e.Name,e.Holding,e.UnitAsset,e.StaticYield,e.ProfitLoss,e.NextVintageTime>u?"Closed":"Open",e.NextVintageStart]);let i=e.NextVintageTime>u?"hidden":"";l+=`
                    <div class="swiper-slide">
                        <div class="in-box">
                            <ul class="info">
                                <li class="info-name">Name: <span>${e.Name}</span></li>
                                <li class="info-name">Symbol: <span>${e.Symbol}</span></li>
                                <li class="info-address">Address: <span>${e.Address}</span></li>
                                <li>Market Cap: <span>${e.MarketCap}</span></li>
                                <li>Vintage Start Price: <span>${e.StartLevel}</span></li>
                                <li>Upside Knockout: <span>${e.Upside}</span></li>
                                <li>Protection Kick-in: <span>${e.Downside}</span></li>
                                <li>Buffer: <span>${e.Protection}</span></li>
                                <li>Vintage unlocked at <span>${e.NextVintage}</span></li>
                            </ul>
                            <div class="buttons m-t-24" ${i}>
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
                    </div>`}),n.querySelector(".swiper-wrapper").innerHTML=l;const o=new S(".swiper",{slidesPerView:"auto",spaceBetween:12,grabCursor:!1});if(y.setDynamic(s,d),r.length>1){const e=n.querySelector(".swiper-button-next");e.classList.remove("hide-important"),e.addEventListener("click",()=>o.slideNext());const i=n.querySelector(".swiper-button-prev");i.classList.remove("hide-important"),i.addEventListener("click",()=>o.slidePrev()),s.querySelectorAll("tbody tr").forEach((c,v)=>{c.classList.add("cursor"),c.addEventListener("click",()=>{o.slideTo(v)},!1)})}n.querySelectorAll(".swiper-slide").forEach(e=>{e.querySelector(".js-topup").addEventListener("click",i=>{i.preventDefault(),this.setPopupInfo({type:"topup",title:"Top up in saver",saverName:e.querySelector(".info-name span").textContent.trim(),saverAddress:e.querySelector(".info-address span").textContent.trim(),saverAmount:e.querySelector("input[name='usdc-amount']").value})},!1),e.querySelector(".js-takeout").addEventListener("click",i=>{i.preventDefault(),this.setPopupInfo({type:"takeout",title:"Take out from saver",saverName:e.querySelector(".info-name span").textContent.trim(),saverAddress:e.querySelector(".info-address span").textContent.trim(),saverAmount:e.querySelector("input[name='usdc-amount']").value})},!1)})})},setPopupInfo(t){t.type==="topup"?C(t.saverAddress,t.saverAmount).then(a=>{const s=[{name:"Name of the saver:",span:t.saverName},{name:"Address of saver contract:",span:T(t.saverAddress)},{name:"Top up:",span:a.invest},{name:"Saver units:",span:a.holding}];b(t.title,g(s,"liquiditypool")),this.executeTrade(t.type,t.saverAddress,a.funding,a.units)}):t.type==="takeout"&&N(t.saverAddress,t.saverAmount).then(a=>{const s=[{name:"Name of the saver:",span:t.saverName},{name:"Address of saver contract",span:T(t.saverAddress)},{name:"Take out:",span:a.divest},{name:"Saver units:",span:a.holding}];b(t.title,g(s,"liquiditypool")),this.executeTrade(t.type,t.saverAddress,a.funding,a.units)})},executeTrade(t,a,s,n){const r=document.createElement("div");r.className="executetrade",document.querySelector(".overlay-popup .op-content").appendChild(r);let d="blue";t==="topup"?d="green":t==="takeout"&&(d="pink");const l=document.createElement("a");l.setAttribute("href","#"),l.className=`btn btn-${d}`,l.textContent="Execute",r.appendChild(l),l.addEventListener("click",async u=>{u.preventDefault(),l.remove();const o=document.createElement("div");o.className="await-approval",o.textContent="Awaiting for allowance approval";const e=document.createElement("div");e.className="await-approval-timer",e.textContent="00:00",o.appendChild(e),r.appendChild(o);const i=document.createElement("div");i.className="await-trade",i.textContent="Awaiting for transaction";const c=document.createElement("div");c.className="await-trade-timer",c.textContent="00:00",i.appendChild(c),r.appendChild(i),this.executeTradeTimer(e,120);const v="Warning: Transaction has failed.",w=await A(t,a,s,n);console.log("approve finished",w),w==="failure"?this.executeTradeFailure(r,v):(o.classList.add("await-active"),o.textContent="Allowance approved.",e.remove(),this.clearTradeTimer(),setTimeout(async()=>{this.executeTradeTimer(c,t==="propose"?300:120),console.log("prior to trade",t,a,s,n);const h=await k(t,a,s,n);if(console.log("trade finished",h),h==="")this.executeTradeFailure(r,v);else{i.classList.add("await-active"),i.textContent="Transaction mined.",c.remove(),this.clearTradeTimer();const f=document.createElement("div");f.className="approve-trade-link";const p=document.createElement("a");p.setAttribute("href",h),p.setAttribute("target","_blank"),p.className="link-arrow",p.textContent="View on Polygonscan",f.appendChild(p),r.appendChild(f)}},500))},!1)},executeTradeFailure(t,a){const s=document.createElement("div");s.className="await-failure";const n=document.createElement("div");n.className="warning-icon";const r=document.createElement("div");r.className="warning-text",r.textContent=a,s.appendChild(n),s.appendChild(r),t.appendChild(s)},executeTradeTimer(t,a){const s=r=>r>9?r:`0${r}`;let n=0;this.globals.execIntervalId=setInterval(()=>{n++,n>a?(this.executeTradeFailure(document.querySelector(".overlay-popup .executetrade"),"Warning: Transaction has taking longer than normal to be mined. You can close the window and try to trade again."),this.clearTradeTimer()):t.textContent=`${s(parseInt(n/60))}:${s(n%60)}`},1e3)},clearTradeTimer(){clearInterval(this.globals.execIntervalId),this.globals.execIntervalId=null,console.log("clearTradeTimer()")}};export{E as default};
