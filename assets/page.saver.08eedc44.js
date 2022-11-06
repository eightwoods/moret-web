import{y as m,B as x,S as y,A as S,C as g,m as w,s as T,a as b,D as A,E as C,F as N}from"./main.e5fa4bac.js";var q={globals:{elem:document.querySelector(".saver")},init(){document.querySelector(".pools .js-refresh").addEventListener("click",()=>this.setSavers());const e={childList:!0,attributes:!0,attributeFilter:["sidenav-activechange","sidenav-refreshprice"]};new MutationObserver(s=>{console.log("sidenav refreshed from Saver!");for(let a of s)if(a.type==="attributes")switch(a.attributeName){case"sidenav-activechange":this.setSavers();break}this.globals.init=!1}).observe(this.globals.elem.querySelector(".sidenav"),e)},setSavers(){const e=document.querySelector(".saver-list"),r=document.querySelector(".active-hottubs");m(e),m(r);const s=e.querySelector(".comp-dynamic-table");s.innerHTML=`
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th class="sortable sort-text">Name</th>
                            <th class="sortable sort-text">Symbol</th>
                            <th class="sortable sort-text">Market Cap</th>
                            <th class="sortable">Unit Price</th>
                            <th class="sortable">Yield</th>
                            <th class="sortable">Status</th>
                            <th class="sortable">Vintage</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>`;const a=r.querySelector(".hottubs-content");a.innerHTML=`
            <div class="swiper">
                <div class="swiper-wrapper"></div>
            </div>
            <div class="swiper-button-next hide-important"></div>
            <div class="swiper-button-prev hide-important"></div>`,x(null).then(n=>{m(e,!1),m(r,!1);const o=[];let u="";const c=Math.floor(Date.now()/1e3);n.forEach(t=>{o.push([t.Name,t.Symbol,t.MarketCap,t.UnitAsset,t.Yield,t.NextVintageTime>c?"Closed":"Open",t.NextVintage]),u+=`
                    <div class="swiper-slide">
                        <div class="in-box">
                            <ul class="info">
                                <li class="info-name">Name: <span>${t.Name}</span></li>
                                <li class="info-address">Address: <span>${t.Address}</span></li>
                                <li>Upside: <span>${t.Upside}</span></li>
                                <li>Protection Level: <span>${t.Downside}</span></li>
                                <li>Protection Limit: <span>${t.Protection}</span></li>
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
                    </div>`}),a.querySelector(".swiper-wrapper").innerHTML=u;const l=new y(".swiper",{slidesPerView:"auto",spaceBetween:12,grabCursor:!1});if(S.setDynamic(s,o),n.length>1){const t=a.querySelector(".swiper-button-next");t.classList.remove("hide-important"),t.addEventListener("click",()=>l.slideNext());const i=a.querySelector(".swiper-button-prev");i.classList.remove("hide-important"),i.addEventListener("click",()=>l.slidePrev()),s.querySelectorAll("tbody tr").forEach((d,v)=>{d.classList.add("cursor"),d.addEventListener("click",()=>{l.slideTo(v)},!1)})}a.querySelectorAll(".swiper-slide").forEach(t=>{t.querySelector(".js-topup").addEventListener("click",i=>{i.preventDefault(),this.setPopupInfo({type:"topup",title:"Top up in saver",saverName:t.querySelector(".info-name span").textContent.trim(),saverAddress:t.querySelector(".info-address span").textContent.trim(),saverAmount:t.querySelector("input[name='usdc-amount']").value})},!1),t.querySelector(".js-takeout").addEventListener("click",i=>{i.preventDefault(),this.setPopupInfo({type:"takeout",title:"Take out from saver",saverName:t.querySelector(".info-name span").textContent.trim(),saverAddress:t.querySelector(".info-address span").textContent.trim(),saverAmount:t.querySelector("input[name='usdc-amount']").value})},!1)})})},setPopupInfo(e){e.type==="topup"?g(e.saverAddress,e.saverAmount).then(r=>{const s=[{name:"Name of the saver:",span:e.saverName},{name:"Address of saver contract:",span:w(e.saverAddress)},{name:"Top up:",span:r.invest},{name:"Saver units:",span:r.holding}];T(e.title,b(s,"liquiditypool")),this.executeTrade(e.type,e.saverAddress,parseFloat(e.saverAmount))}):e.type==="takeout"&&A(e.saverAddress,e.saverAmount).then(r=>{const s=[{name:"Name of the saver:",span:e.saverName},{name:"Address of saver contract",span:w(e.saverAddress)},{name:"Take out:",span:r.divest},{name:"Saver units:",span:r.holding}];T(e.title,b(s,"liquiditypool")),this.executeTrade(e.type,e.saverAddress,parseFloat(e.saverAmount))})},executeTrade(e,r,s){const a=document.createElement("div");a.className="executetrade",document.querySelector(".overlay-popup .op-content").appendChild(a);let n="blue";e==="topup"?n="green":e==="takeout"&&(n="pink");const o=document.createElement("a");o.setAttribute("href","#"),o.className=`btn btn-${n}`,o.textContent="Execute",a.appendChild(o),o.addEventListener("click",async u=>{u.preventDefault(),o.remove();const c=document.createElement("div");c.className="await-approval",c.textContent="Awaiting for allowance approval";const l=document.createElement("div");l.className="await-approval-timer",l.textContent="00:00",c.appendChild(l),a.appendChild(c);const t=document.createElement("div");t.className="await-trade",t.textContent="Awaiting for transaction";const i=document.createElement("div");i.className="await-trade-timer",i.textContent="00:00",t.appendChild(i),a.appendChild(t),this.executeTradeTimer(l,120);const d="Warning: Transaction has failed.",v=await C(e,r);console.log("approve finished",v),v==="failure"?this.executeTradeFailure(a,d):(c.classList.add("await-active"),c.textContent="Allowance approved.",l.remove(),this.clearTradeTimer(),setTimeout(async()=>{this.executeTradeTimer(i,e==="propose"?300:120),console.log("prior to trade");const h=await N(e,r,s);if(console.log("trade finished",h),h==="")this.executeTradeFailure(a,d);else{t.classList.add("await-active"),t.textContent="Transaction mined.",i.remove(),this.clearTradeTimer();const f=document.createElement("div");f.className="approve-trade-link";const p=document.createElement("a");p.setAttribute("href",h),p.setAttribute("target","_blank"),p.className="link-arrow",p.textContent="View on Polygonscan",f.appendChild(p),a.appendChild(f)}},500))},!1)},executeTradeFailure(e,r){const s=document.createElement("div");s.className="await-failure";const a=document.createElement("div");a.className="warning-icon";const n=document.createElement("div");n.className="warning-text",n.textContent=r,s.appendChild(a),s.appendChild(n),e.appendChild(s)},executeTradeTimer(e,r){const s=n=>n>9?n:`0${n}`;let a=0;this.globals.execIntervalId=setInterval(()=>{a++,a>r?(this.executeTradeFailure(document.querySelector(".overlay-popup .executetrade"),"Warning: Transaction has taking longer than normal to be mined. You can close the window and try to trade again."),this.clearTradeTimer()):e.textContent=`${s(parseInt(a/60))}:${s(a%60)}`},1e3)},clearTradeTimer(){clearInterval(this.globals.execIntervalId),this.globals.execIntervalId=null,console.log("clearTradeTimer()")}};export{q as default};
