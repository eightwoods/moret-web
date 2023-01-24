import{k as w,l as x,o as c,p as C,t as T,d as L,s as N,a as $,q as I,r as k}from"./main.213b5167.js";import A from"./component.chartComparison.2145fb22.js";import E from"./component.percentageBarMulti.f8a4403e.js";var O={globals:{elem:document.querySelector(".saver")},init(){document.querySelector(".saver-list-content .js-refresh").addEventListener("click",()=>this.setSavers());const e={childList:!0,attributes:!0,attributeFilter:["sidenav-activechange","sidenav-refreshprice"]};new MutationObserver(t=>{console.log("sidenav refreshed from Saver!");for(let n of t)if(n.type==="attributes")switch(n.attributeName){case"sidenav-activechange":this.setSavers();break}this.globals.init=!1}).observe(this.globals.elem.querySelector(".sidenav"),e)},setSavers(){const e=document.querySelector(".saver-list"),a=document.querySelector(".saver-info");w(e),w(a);const t=e.querySelector(".comp-dynamic-table");t.innerHTML=`
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
            </div>`,this.setSaverInfo(),x().then(n=>{w(e,!1),w(a,!1);const s=[],r=[];n.forEach(async(i,l)=>{try{const o=await c(i,"name"),m=await c(i,"symbol"),p=await c(i,"holding"),u=await c(i,"aum"),g=await c(i,"nav"),f=await c(i,"yield"),v=await c(i,"vintage"),h=await c(i,"profit"),d=await c(i,"time"),S=await c(i,"description");r.push({Name:o,Symbol:m,Address:i,Description:S,MarketCap:u,UnitAsset:g,Holding:p,Yield:f,ProfitLoss:h,NextVintageStart:d[1],VintageOpen:d[0],StartLevel:v.StartLevel,Upside:v.Upside,Downside:v.Downside,Protection:v.Protection,Tenor:d[3]}),s.push([r[l].Name,r[l].Holding,`$${r[l].UnitAsset}`,r[l].ProfitLoss,r[l].VintageOpen?"Open":"Closed",r[l].NextVintageStart]),l+1===n.length&&(this.setSaverInfo(r[0]),C.setDynamic(t,s),n.length>1&&t.querySelectorAll("tbody tr").forEach((b,y)=>{b.classList.add("cursor"),b.addEventListener("click",()=>{this.setSaverInfo(r[y])},!1)}))}catch(o){console.error(o)}})}).catch(n=>{console.error(n)})},setSaverInfo(e){const a=document.querySelector(".saver-info-content");if(!e){a.textContent="";return}a.innerHTML=`
            <div class="saver-row">
                <div class="saver-col">
                    <div class="header-title m-b-24">${e.Name}</div>
                    <div class="saver-content">
                        <div class="info">
                            <p class="m-b-20">${e.Description}</p>
                            <p>Vintage reopened at ${e.VintageOpen}</p>
                        </div>

                        <div class="percentage-bar-multi">
                            <div class="pbm-progress">
                                <div class="pbm-top">
                                    <div class="pbm-progressbar"></div>
                                    <div class="pbm-value size-sm"><span>${e.ProfitLoss}</span> P&L</div>
                                </div>
                                <div class="pbm-bottom">
                                    <div class="pbm-progressbar"></div>
                                    <div class="pbm-value size-sm"><span>${e.Yield}</span> Yield</div>
                                </div>
                            </div>
                        </div>
                        <div class="percentage-bar-text align-center word-nowrap white-50">
                            <p>Current Holding = ${e.Holding}</p>
                        </div>
                    </div>
                </div>
                <div class="saver-col">
                    <!-- <div class="chart-comparison-legends size-sm white-50">
                        <div class="ccl-legend">${T()}</div>
                    </div> -->
                    <div class="chart-comparison-wrapper">
                        <div class="chart-comparison"></div>
                    </div>
                </div>
            </div>

            <div class="buttons-container"></div>`,e.VintageOpen&&(a.querySelector(".buttons-container").innerHTML=`
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
                </div>`),A.createChart({elem:a.querySelector(".chart-comparison"),endpoint1:`https://api.binance.com/api/v3/klines?symbol=${T()}${L()}T&interval=12h&limit=${e.Tenor}`,endpoint2:`https://api.binance.com/api/v3/klines?symbol=TKOUSDT&interval=12h&limit=${e.Tenor}`,linedata:[e.StartLevel,e.Upside,e.Downside,e.Downside-e.Protection]}),E.progressBar(a.querySelector(".percentage-bar-multi"),e.ProfitLoss.replace("%",""),e.Yield.replace("%","")),e.VintageOpen&&(a.querySelector(".js-save").addEventListener("click",t=>{t.preventDefault(),this.setPopupInfo({type:"save",title:"Top up to vault",data:e,amount:parseFloat(document.querySelector("input[name='usdc-amount']").value)})},!1),a.querySelector(".js-withdraw").addEventListener("click",t=>{t.preventDefault(),this.setPopupInfo({type:"withdraw",title:"Withdraw from vault",data:e,amount:parseFloat(document.querySelector("input[name='usdc-amount']").value)})},!1))},setPopupInfo(e){console.log(e);let a=e.data.UnitAsset==0?e.amount:e.amount/e.data.UnitAsset;const t=[{name:"Name:",span:e.data.Name},{name:"Address:",span:e.data.Address},{name:"Unit price",span:`$${e.data.UnitAsset}`},{name:"Units:",span:`${a.toFixed(2)} ${e.data.Symbol}`},{name:"Trade value:",span:`$${e.amount.toFixed(2)}`}];N(e.title,$(t,"investinsavers")),this.executeTrade(e.type,e.data.Address,e.amount,a)},executeTrade(e,a,t,n){const s=document.createElement("div");s.className="executetrade",document.querySelector(".overlay-popup .op-content").appendChild(s);let r="blue";e==="save"?r="green":e==="withdraw"&&(r="pink");const i=document.createElement("a");i.setAttribute("href","#"),i.className=`btn btn-${r}`,i.textContent="Execute",s.appendChild(i),i.addEventListener("click",async l=>{l.preventDefault(),i.remove();const o=document.createElement("div");o.className="await-approval",o.textContent="Awaiting for allowance approval";const m=document.createElement("div");m.className="await-approval-timer",m.textContent="00:00",o.appendChild(m),s.appendChild(o);const p=document.createElement("div");p.className="await-trade",p.textContent="Awaiting for transaction";const u=document.createElement("div");u.className="await-trade-timer",u.textContent="00:00",p.appendChild(u),s.appendChild(p),this.executeTradeTimer(m,120);const g="Warning: Transaction has failed.",f=await I(e,a,t,n);console.log("approve finished",f),f==="failure"?this.executeTradeFailure(s,g):(o.classList.add("await-active"),o.textContent="Allowance approved.",m.remove(),this.clearTradeTimer(),setTimeout(async()=>{this.executeTradeTimer(u,e==="propose"?300:120),console.log("prior to trade",e,a,t,n);const v=await k(e,a,t,n);if(console.log("trade finished",v),v==="")this.executeTradeFailure(s,g);else{p.classList.add("await-active"),p.textContent="Transaction mined.",u.remove(),this.clearTradeTimer();const h=document.createElement("div");h.className="approve-trade-link";const d=document.createElement("a");d.setAttribute("href",v),d.setAttribute("target","_blank"),d.className="link-arrow",d.textContent="View on Polygonscan",h.appendChild(d),s.appendChild(h)}},500))},!1)},executeTradeFailure(e,a){const t=document.createElement("div");t.className="await-failure";const n=document.createElement("div");n.className="warning-icon";const s=document.createElement("div");s.className="warning-text",s.textContent=a,t.appendChild(n),t.appendChild(s),e.appendChild(t)},executeTradeTimer(e,a){const t=s=>s>9?s:`0${s}`;let n=0;this.globals.execIntervalId=setInterval(()=>{n++,n>a?(this.executeTradeFailure(document.querySelector(".overlay-popup .executetrade"),"Warning: Transaction has taking longer than normal to be mined. You can close the window and try to trade again."),this.clearTradeTimer()):e.textContent=`${t(parseInt(n/60))}:${t(n%60)}`},1e3)},clearTradeTimer(){clearInterval(this.globals.execIntervalId),this.globals.execIntervalId=null,console.log("clearTradeTimer()")}};export{O as default};
