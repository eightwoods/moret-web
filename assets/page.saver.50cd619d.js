import{y as w,B as y,C as l,A as x,t as T,d as C,s as L,a as N,D as E,E as I}from"./main.9980345e.js";import A from"./component.chartComparison.2145fb22.js";import k from"./component.percentageBarMulti.e98fe4ff.js";var D={globals:{elem:document.querySelector(".saver")},init(){document.querySelector(".saver-list-content .js-refresh").addEventListener("click",()=>this.setSavers());const e={childList:!0,attributes:!0,attributeFilter:["sidenav-activechange","sidenav-refreshprice"]};new MutationObserver(t=>{console.log("sidenav refreshed from Saver!");for(let n of t)if(n.type==="attributes")switch(n.attributeName){case"sidenav-activechange":this.setSavers();break}this.globals.init=!1}).observe(this.globals.elem.querySelector(".sidenav"),e)},setSavers(){const e=document.querySelector(".saver-list"),a=document.querySelector(".saver-info");w(e),w(a);const t=e.querySelector(".comp-dynamic-table");t.innerHTML=`
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
            </div>`,this.setSaverInfo(),y().then(n=>{w(e,!1),w(a,!1);const s=[],r=[];n.forEach(async(i,c)=>{try{const o=await l(i,"name"),p=await l(i,"holding"),d=await l(i,"aum"),v=await l(i,"nav"),f=await l(i,"yield"),m=await l(i,"vintage"),g=await l(i,"profit"),u=await l(i,"time"),h=await l(i,"description");r.push({Name:o,Address:i,Description:h,MarketCap:d,UnitAsset:v,Holding:p,Yield:f,ProfitLoss:g,VintageEnds:u[0],NextVintageStart:u[1],VintageOpen:u[0],StartLevel:m.StartLevel,Upside:m.Upside,Downside:m.Downside,Protection:m.Protection}),s.push([r[c].Name,r[c].Holding,r[c].UnitAsset,r[c].ProfitLoss,r[c].VintageOpen?"Open":"Closed",r[c].NextVintageStart]),c+1===n.length&&(this.setSaverInfo(r[0]),x.setDynamic(t,s),n.length>1&&t.querySelectorAll("tbody tr").forEach((b,S)=>{b.classList.add("cursor"),b.addEventListener("click",()=>{this.setSaverInfo(r[S])},!1)}))}catch(o){console.error(o)}})}).catch(n=>{console.error(n)})},setSaverInfo(e){const a=document.querySelector(".saver-info-content");if(!e){a.textContent="";return}a.innerHTML=`
            <div class="saver-row">
                <div class="saver-col">
                    <div class="header-title m-b-24">${e.Name}</div>
                    <div class="saver-content">
                        <div class="info">
                            <p class="m-b-20">${e.Description}</p>
                            <p>Vintage reopened at ${e.VintageEnds}</p>
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
                </div>`),A.createChart({elem:a.querySelector(".chart-comparison"),endpoint1:`https://api.binance.com/api/v3/klines?symbol=${T()}${C()}T&interval=12h&limit=325`,endpoint2:"https://api.binance.com/api/v3/klines?symbol=TKOUSDT&interval=12h&limit=325",linedata:[e.StartLevel,e.Upside,e.Downside,e.Downside-e.Protection]}),k.progressBar(a.querySelector(".percentage-bar-multi"),e.ProfitLoss.replace("%",""),e.Yield.replace("%","")),e.VintageOpen&&(a.querySelector(".js-save").addEventListener("click",t=>{t.preventDefault(),this.setPopupInfo({type:"save",title:"Top up to vault",data:e,amount:parseFloat(document.querySelector("input[name='usdc-amount']").value)})},!1),a.querySelector(".js-withdraw").addEventListener("click",t=>{t.preventDefault(),this.setPopupInfo({type:"withdraw",title:"Withdraw from vault",data:e,amount:parseFloat(document.querySelector("input[name='usdc-amount']").value)})},!1))},setPopupInfo(e){console.log(e);let a=e.amount/e.data.UnitAsset;const t=[{name:"Name:",span:e.data.Name},{name:"Address:",span:e.data.Address},{name:"Unit price",span:`${e.data.UnitAsset}`},{name:"Units:",span:`${a.toFixed(2)} ${e.data.Symbol}`},{name:"Trade value:",span:`$${e.amount.toFixed(2)}`}];L(e.title,N(t,"investinsavers")),this.executeTrade(e.type,e.data.Address,e.amount,a)},executeTrade(e,a,t,n){const s=document.createElement("div");s.className="executetrade",document.querySelector(".overlay-popup .op-content").appendChild(s);let r="blue";e==="save"?r="green":e==="withdraw"&&(r="pink");const i=document.createElement("a");i.setAttribute("href","#"),i.className=`btn btn-${r}`,i.textContent="Execute",s.appendChild(i),i.addEventListener("click",async c=>{c.preventDefault(),i.remove();const o=document.createElement("div");o.className="await-approval",o.textContent="Awaiting for allowance approval";const p=document.createElement("div");p.className="await-approval-timer",p.textContent="00:00",o.appendChild(p),s.appendChild(o);const d=document.createElement("div");d.className="await-trade",d.textContent="Awaiting for transaction";const v=document.createElement("div");v.className="await-trade-timer",v.textContent="00:00",d.appendChild(v),s.appendChild(d),this.executeTradeTimer(p,120);const f="Warning: Transaction has failed.",m=await E(e,a,t,n);console.log("approve finished",m),m==="failure"?this.executeTradeFailure(s,f):(o.classList.add("await-active"),o.textContent="Allowance approved.",p.remove(),this.clearTradeTimer(),setTimeout(async()=>{this.executeTradeTimer(v,e==="propose"?300:120),console.log("prior to trade",e,a,t,n);const g=await I(e,a,t,n);if(console.log("trade finished",g),g==="")this.executeTradeFailure(s,f);else{d.classList.add("await-active"),d.textContent="Transaction mined.",v.remove(),this.clearTradeTimer();const u=document.createElement("div");u.className="approve-trade-link";const h=document.createElement("a");h.setAttribute("href",g),h.setAttribute("target","_blank"),h.className="link-arrow",h.textContent="View on Polygonscan",u.appendChild(h),s.appendChild(u)}},500))},!1)},executeTradeFailure(e,a){const t=document.createElement("div");t.className="await-failure";const n=document.createElement("div");n.className="warning-icon";const s=document.createElement("div");s.className="warning-text",s.textContent=a,t.appendChild(n),t.appendChild(s),e.appendChild(t)},executeTradeTimer(e,a){const t=s=>s>9?s:`0${s}`;let n=0;this.globals.execIntervalId=setInterval(()=>{n++,n>a?(this.executeTradeFailure(document.querySelector(".overlay-popup .executetrade"),"Warning: Transaction has taking longer than normal to be mined. You can close the window and try to trade again."),this.clearTradeTimer()):e.textContent=`${t(parseInt(n/60))}:${t(n%60)}`},1e3)},clearTradeTimer(){clearInterval(this.globals.execIntervalId),this.globals.execIntervalId=null,console.log("clearTradeTimer()")}};export{D as default};
