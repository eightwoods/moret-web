import{y as p,B as w,A as T,m as g,t as x,d as S,s as y,a as C,C as N,D as L}from"./main.56198c74.js";import I from"./component.chartComparison.e2224000.js";import A from"./component.percentageBarMulti.5957e2ea.js";var q={globals:{elem:document.querySelector(".saver")},init(){document.querySelector(".saver-list-content .js-refresh").addEventListener("click",()=>this.setSavers());const e={childList:!0,attributes:!0,attributeFilter:["sidenav-activechange","sidenav-refreshprice"]};new MutationObserver(n=>{console.log("sidenav refreshed from Saver!");for(let s of n)if(s.type==="attributes")switch(s.attributeName){case"sidenav-activechange":this.setSavers();break}this.globals.init=!1}).observe(this.globals.elem.querySelector(".sidenav"),e)},setSavers(){const e=document.querySelector(".saver-list"),a=document.querySelector(".saver-info");p(e),p(a);const n=e.querySelector(".comp-dynamic-table");n.innerHTML=`
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
            </div>`,this.setSaverInfo(),w(null).then(s=>{p(e,!1),p(a,!1);const t=[],l=Math.floor(Date.now()/1e3);s.forEach(r=>{t.push([r.Name,r.Holding,r.UnitAsset,r.StaticYield,r.ProfitLoss,r.NextVintageTime>l?"Closed":"Open",r.NextVintageStart]),this.setSaverInfo(r)}),T.setDynamic(n,t),s.length>1&&n.querySelectorAll("tbody tr").forEach((r,m)=>{r.classList.add("cursor"),r.addEventListener("click",()=>{this.setSaverInfo(s[m])},!1)})})},setSaverInfo(e){const a=document.querySelector(".saver-info-content");if(!e){a.textContent="";return}const n=Math.floor(Date.now()/1e3);a.innerHTML=`
            <div class="saver-row">
                <div class="saver-col">
                    <div class="header-title m-b-24">${e.Name}</div>
                    <div class="saver-content">
                        <div class="info">
                            <p class="m-b-20">${e.Symbol}.saver address: ${g(e.Address)}</p>
                            <p>Vintage reopened at ${e.NextVintage}</p>
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
                        <div class="percentage-bar-text align-center word-nowrap white-50">
                            <p>$1,000.00 holding</p>
                        </div>
                    </div>
                </div>
                <div class="saver-col">
                    <div class="chart-comparison-legends size-sm white-50">
                        <div class="ccl-legend">Legend 1</div>
                        <div class="ccl-legend">Legend 2</div>
                    </div>
                    <div class="chart-comparison-wrapper">
                        <div class="chart-comparison"></div>
                    </div>
                </div>
            </div>

            <div class="buttons-container"></div>`;const s=e.NextVintageTime<=n;s&&(a.querySelector(".buttons-container").innerHTML=`
                <div class="buttons m-t-32">
                    <div class="col">
                        <div class="in-border word-nowrap white-50">
                            <input type="number" name="usdc-amount" value="6000" />&nbsp;&nbsp;USDC
                        </div>
                    </div>
                    <div class="col">
                        <a href="#" class="btn btn-green js-save">SAVE</a>
                        <a href="#" class="btn btn-pink js-withdraw">WITHDRAW</a>
                    </div>
                </div>`),I.createChart({elem:a.querySelector(".chart-comparison"),endpoint1:`https://api.binance.com/api/v3/klines?symbol=${x()}${S()}T&interval=1d&limit=325`,endpoint2:"https://api.binance.com/api/v3/klines?symbol=TKOUSDT&interval=1d&limit=325"}),A.progressBar(a.querySelector(".percentage-bar-multi"),e.StaticYield.replace("%",""),e.ProfitLoss.replace("%","")),s&&(a.querySelector(".js-save").addEventListener("click",t=>{t.preventDefault(),this.setPopupInfo({type:"save",title:"Invest to save",data:e})},!1),a.querySelector(".js-withdraw").addEventListener("click",t=>{t.preventDefault(),this.setPopupInfo({type:"withdraw",title:"Invest to withdraw",data:e})},!1))},setPopupInfo(e){console.log(e);const a=[{name:"Name:",span:e.data.Name},{name:`${e.data.Symbol}.saver address:`,span:g(e.data.Address)},{name:"Vintage reopened at",span:e.data.NextVintage},{name:"P&L:",span:e.data.StaticYield},{name:"APY:",span:e.data.ProfitLoss}];y(e.title,C(a,"investinsavers"))},executeTrade(e,a,n,s){const t=document.createElement("div");t.className="executetrade",document.querySelector(".overlay-popup .op-content").appendChild(t);let l="blue";e==="topup"?l="green":e==="takeout"&&(l="pink");const r=document.createElement("a");r.setAttribute("href","#"),r.className=`btn btn-${l}`,r.textContent="Execute",t.appendChild(r),r.addEventListener("click",async m=>{m.preventDefault(),r.remove();const i=document.createElement("div");i.className="await-approval",i.textContent="Awaiting for allowance approval";const c=document.createElement("div");c.className="await-approval-timer",c.textContent="00:00",i.appendChild(c),t.appendChild(i);const o=document.createElement("div");o.className="await-trade",o.textContent="Awaiting for transaction";const d=document.createElement("div");d.className="await-trade-timer",d.textContent="00:00",o.appendChild(d),t.appendChild(o),this.executeTradeTimer(c,120);const b="Warning: Transaction has failed.",f=await N(e,a,n,s);console.log("approve finished",f),f==="failure"?this.executeTradeFailure(t,b):(i.classList.add("await-active"),i.textContent="Allowance approved.",c.remove(),this.clearTradeTimer(),setTimeout(async()=>{this.executeTradeTimer(d,e==="propose"?300:120),console.log("prior to trade",e,a,n,s);const u=await L(e,a,n,s);if(console.log("trade finished",u),u==="")this.executeTradeFailure(t,b);else{o.classList.add("await-active"),o.textContent="Transaction mined.",d.remove(),this.clearTradeTimer();const h=document.createElement("div");h.className="approve-trade-link";const v=document.createElement("a");v.setAttribute("href",u),v.setAttribute("target","_blank"),v.className="link-arrow",v.textContent="View on Polygonscan",h.appendChild(v),t.appendChild(h)}},500))},!1)},executeTradeFailure(e,a){const n=document.createElement("div");n.className="await-failure";const s=document.createElement("div");s.className="warning-icon";const t=document.createElement("div");t.className="warning-text",t.textContent=a,n.appendChild(s),n.appendChild(t),e.appendChild(n)},executeTradeTimer(e,a){const n=t=>t>9?t:`0${t}`;let s=0;this.globals.execIntervalId=setInterval(()=>{s++,s>a?(this.executeTradeFailure(document.querySelector(".overlay-popup .executetrade"),"Warning: Transaction has taking longer than normal to be mined. You can close the window and try to trade again."),this.clearTradeTimer()):e.textContent=`${n(parseInt(s/60))}:${n(s%60)}`},1e3)},clearTradeTimer(){clearInterval(this.globals.execIntervalId),this.globals.execIntervalId=null,console.log("clearTradeTimer()")}};export{q as default};
