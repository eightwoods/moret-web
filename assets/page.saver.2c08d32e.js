import{y as p,B as w,A as T,t as g,d as x,s as S,a as y,C,D as $}from"./main.cc3ea385.js";import N from"./component.chartComparison.2145fb22.js";import L from"./component.percentageBarMulti.d5d3af02.js";var k={globals:{elem:document.querySelector(".saver")},init(){document.querySelector(".saver-list-content .js-refresh").addEventListener("click",()=>this.setSavers());const e={childList:!0,attributes:!0,attributeFilter:["sidenav-activechange","sidenav-refreshprice"]};new MutationObserver(s=>{console.log("sidenav refreshed from Saver!");for(let n of s)if(n.type==="attributes")switch(n.attributeName){case"sidenav-activechange":this.setSavers();break}this.globals.init=!1}).observe(this.globals.elem.querySelector(".sidenav"),e)},setSavers(){const e=document.querySelector(".saver-list"),a=document.querySelector(".saver-info");p(e),p(a),console.log("loader set");const s=e.querySelector(".comp-dynamic-table");s.innerHTML=`
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
            </div>`,this.setSaverInfo(),w(null).then(n=>{p(e,!1),p(a,!1);const t=[],l=Math.floor(Date.now()/1e3);n.forEach(r=>{t.push([r.Name,r.Holding,`$${r.UnitAsset.toFixed(2)}`,r.StaticYield,r.ProfitLoss,r.NextVintageTime>l?"Closed":"Open",r.NextVintageStart]),this.setSaverInfo(r)}),T.setDynamic(s,t),n.length>1&&s.querySelectorAll("tbody tr").forEach((r,m)=>{r.classList.add("cursor"),r.addEventListener("click",()=>{this.setSaverInfo(n[m])},!1)})})},setSaverInfo(e){const a=document.querySelector(".saver-info-content");if(!e){a.textContent="";return}const s=Math.floor(Date.now()/1e3);a.innerHTML=`
            <div class="saver-row">
                <div class="saver-col">
                    <div class="header-title m-b-24">${e.Name}</div>
                    <div class="saver-content">
                        <div class="info">
                            <p class="m-b-20">${e.Params}</p>
                            <p>Vintage reopened at ${e.NextVintage}</p>
                        </div>

                        <div class="percentage-bar-multi">
                            <div class="pbm-progress">
                                <div class="pbm-top">
                                    <div class="pbm-progressbar"></div>
                                    <div class="pbm-value size-sm"><span>${e.ProfitLoss}</span> P&L</div>
                                </div>
                                <div class="pbm-bottom">
                                    <div class="pbm-progressbar"></div>
                                    <div class="pbm-value size-sm"><span>${e.StaticYield}</span> APY</div>
                                </div>
                            </div>
                        </div>
                        <div class="percentage-bar-text align-center word-nowrap white-50">
                            <p>Current Holding ${e.UnitHeld} ${e.Symbol} = ${e.Holding}</p>
                        </div>
                    </div>
                </div>
                <div class="saver-col">
                    <!-- <div class="chart-comparison-legends size-sm white-50">
                        <div class="ccl-legend">${g()}</div>
                        <div class="ccl-legend">${e.Symbol}</div>
                    </div> -->
                    <div class="chart-comparison-wrapper">
                        <div class="chart-comparison"></div>
                    </div>
                </div>
            </div>

            <div class="buttons-container"></div>`;const n=e.NextVintageTime<=s;n&&(a.querySelector(".buttons-container").innerHTML=`
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
                </div>`),N.createChart({elem:a.querySelector(".chart-comparison"),endpoint1:`https://api.binance.com/api/v3/klines?symbol=${g()}${x()}T&interval=12h&limit=${e.Tenor}`,endpoint2:`https://api.binance.com/api/v3/klines?symbol=TKOUSDT&interval=12h&limit=${e.Tenor}`,linedata:[e.StartLevel,e.Upside,e.Downside,e.Downside-e.Protection]}),L.progressBar(a.querySelector(".percentage-bar-multi"),e.ProfitLoss.replace("%",""),e.StaticYield.replace("%","")),n&&(a.querySelector(".js-save").addEventListener("click",t=>{t.preventDefault(),this.setPopupInfo({type:"save",title:"Top up to vault",data:e,amount:parseFloat(document.querySelector("input[name='usdc-amount']").value)})},!1),a.querySelector(".js-withdraw").addEventListener("click",t=>{t.preventDefault(),this.setPopupInfo({type:"withdraw",title:"Withdraw from vault",data:e,amount:parseFloat(document.querySelector("input[name='usdc-amount']").value)})},!1))},setPopupInfo(e){console.log(e);let a=e.amount/e.data.UnitAsset;const s=[{name:"Name:",span:e.data.Name},{name:"Address:",span:e.data.Address},{name:"Unit price",span:`$${e.data.UnitAsset.toFixed(2)}`},{name:"Units:",span:`${a.toFixed(2)} ${e.data.Symbol}`},{name:"Trade value:",span:`$${e.amount.toFixed(2)}`}];S(e.title,y(s,"investinsavers")),this.executeTrade(e.type,e.data.Address,e.amount,a)},executeTrade(e,a,s,n){const t=document.createElement("div");t.className="executetrade",document.querySelector(".overlay-popup .op-content").appendChild(t);let l="blue";e==="save"?l="green":e==="withdraw"&&(l="pink");const r=document.createElement("a");r.setAttribute("href","#"),r.className=`btn btn-${l}`,r.textContent="Execute",t.appendChild(r),r.addEventListener("click",async m=>{m.preventDefault(),r.remove();const i=document.createElement("div");i.className="await-approval",i.textContent="Awaiting for allowance approval";const c=document.createElement("div");c.className="await-approval-timer",c.textContent="00:00",i.appendChild(c),t.appendChild(i);const o=document.createElement("div");o.className="await-trade",o.textContent="Awaiting for transaction";const d=document.createElement("div");d.className="await-trade-timer",d.textContent="00:00",o.appendChild(d),t.appendChild(o),this.executeTradeTimer(c,120);const b="Warning: Transaction has failed.",f=await C(e,a,s,n);console.log("approve finished",f),f==="failure"?this.executeTradeFailure(t,b):(i.classList.add("await-active"),i.textContent="Allowance approved.",c.remove(),this.clearTradeTimer(),setTimeout(async()=>{this.executeTradeTimer(d,e==="propose"?300:120),console.log("prior to trade",e,a,s,n);const u=await $(e,a,s,n);if(console.log("trade finished",u),u==="")this.executeTradeFailure(t,b);else{o.classList.add("await-active"),o.textContent="Transaction mined.",d.remove(),this.clearTradeTimer();const h=document.createElement("div");h.className="approve-trade-link";const v=document.createElement("a");v.setAttribute("href",u),v.setAttribute("target","_blank"),v.className="link-arrow",v.textContent="View on Polygonscan",h.appendChild(v),t.appendChild(h)}},500))},!1)},executeTradeFailure(e,a){const s=document.createElement("div");s.className="await-failure";const n=document.createElement("div");n.className="warning-icon";const t=document.createElement("div");t.className="warning-text",t.textContent=a,s.appendChild(n),s.appendChild(t),e.appendChild(s)},executeTradeTimer(e,a){const s=t=>t>9?t:`0${t}`;let n=0;this.globals.execIntervalId=setInterval(()=>{n++,n>a?(this.executeTradeFailure(document.querySelector(".overlay-popup .executetrade"),"Warning: Transaction has taking longer than normal to be mined. You can close the window and try to trade again."),this.clearTradeTimer()):e.textContent=`${s(parseInt(n/60))}:${s(n%60)}`},1e3)},clearTradeTimer(){clearInterval(this.globals.execIntervalId),this.globals.execIntervalId=null,console.log("clearTradeTimer()")}};export{k as default};
