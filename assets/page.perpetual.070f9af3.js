import{k as w,l as g,t as x,d as C,m as S,s as I,a as k,o as P,p as N,q as u,r as A}from"./main.e32a582e.js";import F from"./component.chartComparison.2145fb22.js";import q from"./component.percentageBarMulti.ae7f5e2c.js";var M={globals:{elem:document.querySelector(".perpetual"),btnRefresh:document.querySelector(".perpetual-list-content .js-refresh"),appInit:!0},init(){this.globals.btnRefresh.addEventListener("click",()=>this.setPerpetuals()),setTimeout(()=>{this.globals.appInit&&this.setPerpetuals()},2500);const e={childList:!0,attributes:!0,attributeFilter:["sidenav-activechange","sidenav-refreshprice"]};new MutationObserver(t=>{console.log("sidenav refreshed from Perpetual!");for(let i of t)if(i.type==="attributes")switch(i.attributeName){case"sidenav-activechange":this.setPerpetuals();break}}).observe(this.globals.elem.querySelector(".sidenav"),e)},setPerpetuals(){this.globals.appInit=!1,this.globals.btnRefresh.classList.add("hide"),console.log("setPerpetuals()");const e=document.querySelector(".perpetual-list"),a=document.querySelector(".perpetual-info");w(e),w(a);const t=e.querySelector(".comp-dynamic-table");t.innerHTML=`
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th class="sortable sort-text">Name</th>
                            <th class="sortable sort-text">Side</th>
                            <th class="sortable sort-text">Leverage</th>
                            <th class="sortable sort-text">Holding</th>
                            <th class="sortable sort-text">NAV</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>`,this.setPerpetualInfo();const i=[];let s=!0,r=0;g().forEach((n,y)=>{const l=async()=>{try{const o=await u(n,"name"),c=await u(n,"symbol"),p=await u(n,"aum"),m=await u(n,"supply"),f=await u(n,"balance"),h=await u(n,"leverage"),b=await u(n,"strike"),v=await u(n,"notional"),d=await u(n,"params"),L=m>0?p/m:1,$=`$${(m>0?p/m*f:0).toFixed(2)}`;if(i.push({Name:o,Symbol:c,Address:n,Description:`${d[3]} ${c}<br>Leverage by ${(Number(d[4])/86400).toFixed(0)}-day ${d[5]} options`,MarketCap:`$${p.toFixed(0)}`,UnitAsset:L,Holding:$,Leverage:h,SetLevel:d[0],LowerLevel:d[1],UpperLevel:d[2],Direction:d[3],Tenor:d[4],Strike:b,Notional:v}),r++,A.setDynamic(t,[o,d[3],h.toFixed(1)+"x",$,`$${L.toFixed(2)}`],!1,g().length,r),s&&(w(e,!1),w(a,!1),this.setPerpetualInfo(i[0]),s=!1),g().length>1){const T=t.querySelector(`tbody tr:nth-child(${r})`);T.classList.add("cursor"),T.addEventListener("click",()=>{this.setPerpetualInfo(i[T.dataset.id-1])},!1)}g().length===r&&this.globals.btnRefresh.classList.remove("hide"),console.log("Success!!! Row:",r,n)}catch{if(g().length>parseInt(t.querySelectorAll("tbody tr").length)){console.log("Failed!!! Row:",r+1,n);const o=setTimeout(()=>{l(),clearTimeout(o)},2500)}}};l()})},setPerpetualInfo(e){const a=document.querySelector(".perpetual-info-content");if(!e){a.textContent="";return}a.innerHTML=`
            <div class="perpetual-row">
                <div class="perpetual-col">
                    <div class="header-title m-b-24">${e.Name}</div>
                    <div class="perpetual-content">
                        <div class="info">
                            <p class="m-b-20">${e.Description}</p>
                            <p>Current option position ${e.Notional.toFixed(2)} ${x()}, strike at $${e.Strike.toFixed(2)}</p>
                        </div>

                        <div class="percentage-bar-multi">
                            <div class="pbm-progress">
                                <div class="pbm-top">
                                    <div class="pbm-progressbar"></div>
                                    <div class="pbm-value size-sm"><span>${e.Leverage.toFixed(1)}</span>x</div>
                                </div>
                                <div class="pbm-bottom">
                                    <div class="pbm-progressbar"></div>
                                    <div class="pbm-value-static size-sm"><span>${e.LowerLevel.toFixed(1)}</span>x</div>
                                    <div class="pbm-value size-sm"><span>${e.UpperLevel.toFixed(1)}</span>x</div>
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
                        <div class="ccl-legend">${x()}</div>
                    </div> -->
                    <div class="chart-comparison-wrapper">
                        <div class="chart-comparison"></div>
                    </div>
                </div>
            </div>

            <div class="buttons-container"></div>`,a.querySelector(".buttons-container").innerHTML=`
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
            </div>`,F.createChart({elem:a.querySelector(".chart-comparison"),endpoint1:`https://api.binance.com/api/v3/klines?symbol=${x()}${C()}T&interval=12h&limit=${Math.ceil(e.Tenor/3600)}`,endpoint2:`https://api.binance.com/api/v3/klines?symbol=TKOUSDT&interval=12h&limit=${Math.ceil(e.Tenor/3600)}`,linedata:[e.Strike]}),q.progressBar(a.querySelector(".percentage-bar-multi"),(e.Leverage-e.LowerLevel)/(e.UpperLevel-e.LowerLevel)*100,100),a.querySelector(".js-save").addEventListener("click",t=>{t.preventDefault(),this.setPopupInfo({type:"save",title:"Invest in Leveraged Perpetuals",data:e,amount:parseFloat(document.querySelector("input[name='usdc-amount']").value)})},!1),a.querySelector(".js-withdraw").addEventListener("click",t=>{t.preventDefault(),this.setPopupInfo({type:"withdraw",title:"Withdraw from Leveraged Perpetuals",data:e,amount:parseFloat(document.querySelector("input[name='usdc-amount']").value)})},!1)},setPopupInfo(e){console.log(e);let a=e.data.UnitAsset==0?e.amount:e.amount/e.data.UnitAsset;const t=[{name:"Name: ",span:e.data.Name},{name:"Address: ",span:S(e.data.Address)},{name:"Price: ",span:`$${e.data.UnitAsset}`},{name:"Units: ",span:`${a.toFixed(2)} ${e.data.Symbol}`},{name:"Trade value: ",span:`$${e.amount.toFixed(2)}`}];I(e.title,k(t,"investinperpetuals")),this.executeTrade(e.type,e.data.Address,e.amount,a)},executeTrade(e,a,t,i){const s=document.createElement("div");s.className="executetrade",document.querySelector(".overlay-popup .op-content").appendChild(s);let r="blue";e==="save"?r="green":e==="withdraw"&&(r="pink");const n=document.createElement("a");n.setAttribute("href","#"),n.className=`btn btn-${r}`,n.textContent="Execute",s.appendChild(n),n.addEventListener("click",async y=>{y.preventDefault(),n.remove();const l=document.createElement("div");l.className="await-approval",l.textContent="Awaiting for allowance approval";const o=document.createElement("div");o.className="await-approval-timer",o.textContent="00:00",l.appendChild(o),s.appendChild(l);const c=document.createElement("div");c.className="await-trade",c.textContent="Awaiting for transaction";const p=document.createElement("div");p.className="await-trade-timer",p.textContent="00:00",c.appendChild(p),s.appendChild(c),this.executeTradeTimer(o,120);const m="Warning: Transaction has failed.",f=await P(e,a,t,i);console.log("approve finished",f),f==="failure"?this.executeTradeFailure(s,m):(l.classList.add("await-active"),l.textContent="Allowance approved.",o.remove(),this.clearTradeTimer(),setTimeout(async()=>{this.executeTradeTimer(p,e==="propose"?300:120);const h=await N(e,a,t);if(console.log("trade finished",h),h==="")this.executeTradeFailure(s,m);else{c.classList.add("await-active"),c.textContent="Transaction mined.",p.remove(),this.clearTradeTimer();const b=document.createElement("div");b.className="approve-trade-link";const v=document.createElement("a");v.setAttribute("href",h),v.setAttribute("target","_blank"),v.className="link-arrow",v.textContent="View on Polygonscan",b.appendChild(v),s.appendChild(b)}},500))},!1)},executeTradeFailure(e,a){const t=document.createElement("div");t.className="await-failure";const i=document.createElement("div");i.className="warning-icon";const s=document.createElement("div");s.className="warning-text",s.textContent=a,t.appendChild(i),t.appendChild(s),e.appendChild(t)},executeTradeTimer(e,a){const t=s=>s>9?s:`0${s}`;let i=0;this.globals.execIntervalId=setInterval(()=>{i++,i>a?(this.executeTradeFailure(document.querySelector(".overlay-popup .executetrade"),"Warning: Transaction has taking longer than normal to be mined. You can close the window and try to trade again."),this.clearTradeTimer()):e.textContent=`${t(parseInt(i/60))}:${t(i%60)}`},1e3)},clearTradeTimer(){clearInterval(this.globals.execIntervalId),this.globals.execIntervalId=null,console.log("clearTradeTimer()")}};export{M as default};
