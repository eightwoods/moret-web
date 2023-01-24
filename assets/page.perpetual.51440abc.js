import{k as w,l as S,o as l,p as C,t as T,d as L,s as P,a as N,q as $,r as I}from"./main.c233f031.js";import k from"./component.chartComparison.2145fb22.js";import A from"./component.percentageBarMulti.b683a152.js";var O={globals:{elem:document.querySelector(".perpetual")},init(){document.querySelector(".perpetual-list-content .js-refresh").addEventListener("click",()=>this.setPerpetuals());const e={childList:!0,attributes:!0,attributeFilter:["sidenav-activechange","sidenav-refreshprice"]};new MutationObserver(t=>{console.log("sidenav refreshed from Perpetual!");for(let n of t)if(n.type==="attributes")switch(n.attributeName){case"sidenav-activechange":this.setPerpetuals();break}this.globals.init=!1}).observe(this.globals.elem.querySelector(".sidenav"),e)},setPerpetuals(){const e=document.querySelector(".perpetual-list"),a=document.querySelector(".perpetual-info");w(e),w(a);const t=e.querySelector(".comp-dynamic-table");t.innerHTML=`
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
            </div>`,this.setPerpetualInfo(),S().then(n=>{w(e,!1),w(a,!1);const i=[],r=[];n.forEach(async(s,c)=>{try{const o=await l(s,"name"),u=await l(s,"symbol"),d=await l(s,"holding"),v=await l(s,"aum"),g=await l(s,"nav"),f=await l(s,"yield"),m=await l(s,"vintage"),h=await l(s,"profit"),p=await l(s,"time"),y=await l(s,"description");r.push({Name:o,Symbol:u,Address:s,Description:y,MarketCap:v,UnitAsset:g,Holding:d,Yield:f,ProfitLoss:h,NextVintageStart:p[1],VintageOpen:p[0],StartLevel:m.StartLevel,Upside:m.Upside,Downside:m.Downside,Protection:m.Protection,Tenor:p[3]}),i.push([r[c].Name,r[c].Holding,`$${r[c].UnitAsset}`,r[c].ProfitLoss,r[c].VintageOpen?"Open":"Closed",r[c].NextVintageStart]),c+1===n.length&&(this.setPerpetualInfo(r[0]),C.setDynamic(t,i),n.length>1&&t.querySelectorAll("tbody tr").forEach((b,x)=>{b.classList.add("cursor"),b.addEventListener("click",()=>{this.setPerpetualInfo(r[x])},!1)}))}catch(o){console.error(o)}})}).catch(n=>{console.error(n)})},setPerpetualInfo(e){const a=document.querySelector(".perpetual-info-content");if(!e){a.textContent="";return}a.innerHTML=`
            <div class="perpetual-row">
                <div class="perpetual-col">
                    <div class="header-title m-b-24">${e.Name}</div>
                    <div class="perpetual-content">
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
                <div class="perpetual-col">
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
                </div>`),k.createChart({elem:a.querySelector(".chart-comparison"),endpoint1:`https://api.binance.com/api/v3/klines?symbol=${T()}${L()}T&interval=12h&limit=${e.Tenor}`,endpoint2:`https://api.binance.com/api/v3/klines?symbol=TKOUSDT&interval=12h&limit=${e.Tenor}`,linedata:[e.StartLevel,e.Upside,e.Downside,e.Downside-e.Protection]}),A.progressBar(a.querySelector(".percentage-bar-multi"),e.ProfitLoss.replace("%",""),e.Yield.replace("%","")),e.VintageOpen&&(a.querySelector(".js-save").addEventListener("click",t=>{t.preventDefault(),this.setPopupInfo({type:"save",title:"Top up to vault",data:e,amount:parseFloat(document.querySelector("input[name='usdc-amount']").value)})},!1),a.querySelector(".js-withdraw").addEventListener("click",t=>{t.preventDefault(),this.setPopupInfo({type:"withdraw",title:"Withdraw from vault",data:e,amount:parseFloat(document.querySelector("input[name='usdc-amount']").value)})},!1))},setPopupInfo(e){console.log(e);let a=e.data.UnitAsset==0?e.amount:e.amount/e.data.UnitAsset;const t=[{name:"Name:",span:e.data.Name},{name:"Address:",span:e.data.Address},{name:"Unit price",span:`$${e.data.UnitAsset}`},{name:"Units:",span:`${a.toFixed(2)} ${e.data.Symbol}`},{name:"Trade value:",span:`$${e.amount.toFixed(2)}`}];P(e.title,N(t,"investinperpetuals")),this.executeTrade(e.type,e.data.Address,e.amount,a)},executeTrade(e,a,t,n){const i=document.createElement("div");i.className="executetrade",document.querySelector(".overlay-popup .op-content").appendChild(i);let r="blue";e==="save"?r="green":e==="withdraw"&&(r="pink");const s=document.createElement("a");s.setAttribute("href","#"),s.className=`btn btn-${r}`,s.textContent="Execute",i.appendChild(s),s.addEventListener("click",async c=>{c.preventDefault(),s.remove();const o=document.createElement("div");o.className="await-approval",o.textContent="Awaiting for allowance approval";const u=document.createElement("div");u.className="await-approval-timer",u.textContent="00:00",o.appendChild(u),i.appendChild(o);const d=document.createElement("div");d.className="await-trade",d.textContent="Awaiting for transaction";const v=document.createElement("div");v.className="await-trade-timer",v.textContent="00:00",d.appendChild(v),i.appendChild(d),this.executeTradeTimer(u,120);const g="Warning: Transaction has failed.",f=await $(e,a,t,n);console.log("approve finished",f),f==="failure"?this.executeTradeFailure(i,g):(o.classList.add("await-active"),o.textContent="Allowance approved.",u.remove(),this.clearTradeTimer(),setTimeout(async()=>{this.executeTradeTimer(v,e==="propose"?300:120),console.log("prior to trade",e,a,t,n);const m=await I(e,a,t,n);if(console.log("trade finished",m),m==="")this.executeTradeFailure(i,g);else{d.classList.add("await-active"),d.textContent="Transaction mined.",v.remove(),this.clearTradeTimer();const h=document.createElement("div");h.className="approve-trade-link";const p=document.createElement("a");p.setAttribute("href",m),p.setAttribute("target","_blank"),p.className="link-arrow",p.textContent="View on Polygonscan",h.appendChild(p),i.appendChild(h)}},500))},!1)},executeTradeFailure(e,a){const t=document.createElement("div");t.className="await-failure";const n=document.createElement("div");n.className="warning-icon";const i=document.createElement("div");i.className="warning-text",i.textContent=a,t.appendChild(n),t.appendChild(i),e.appendChild(t)},executeTradeTimer(e,a){const t=i=>i>9?i:`0${i}`;let n=0;this.globals.execIntervalId=setInterval(()=>{n++,n>a?(this.executeTradeFailure(document.querySelector(".overlay-popup .executetrade"),"Warning: Transaction has taking longer than normal to be mined. You can close the window and try to trade again."),this.clearTradeTimer()):e.textContent=`${t(parseInt(n/60))}:${t(n%60)}`},1e3)},clearTradeTimer(){clearInterval(this.globals.execIntervalId),this.globals.execIntervalId=null,console.log("clearTradeTimer()")}};export{O as default};
