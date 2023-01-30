import{k as w,l as T,t as x,d as L,m as S,s as I,a as k,o as P,p as N,q as u,r as F}from"./main.f83b0cfd.js";import A from"./component.chartComparison.2145fb22.js";import q from"./component.percentageBarMulti.953a7402.js";var H={globals:{elem:document.querySelector(".perpetual"),appInit:!0},init(){const e=document.querySelector(".perpetual-list-content .js-refresh");e&&e.addEventListener("click",()=>this.setPerpetuals()),setTimeout(()=>{this.globals.appInit&&this.setPerpetuals()},2500);const t={childList:!0,attributes:!0,attributeFilter:["sidenav-activechange","sidenav-refreshprice"]};new MutationObserver(n=>{console.log("sidenav refreshed from Perpetual!");for(let s of n)if(s.type==="attributes")switch(s.attributeName){case"sidenav-activechange":this.setPerpetuals();break}}).observe(this.globals.elem.querySelector(".sidenav"),t)},setPerpetuals(){this.globals.appInit=!1,console.log("setPerpetuals()");const e=document.querySelector(".perpetual-list"),t=document.querySelector(".perpetual-info");w(e),w(t);const a=e.querySelector(".comp-dynamic-table");a.innerHTML=`
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
            </div>`,this.setPerpetualInfo();const n=[];let s=!0,o=0;T().forEach((i,y)=>{const l=async()=>{try{const r=await u(i,"name"),c=await u(i,"symbol"),p=await u(i,"aum"),m=await u(i,"supply"),g=await u(i,"balance"),h=await u(i,"leverage"),b=await u(i,"strike"),v=await u(i,"notional"),d=await u(i,"params"),C=m>0?p/m:1,$=`$${(m>0?p/m*g:0).toFixed(2)}`;if(n.push({Name:r,Symbol:c,Address:i,Description:`${d[2]} ${c}<br>Leverage achieved by buying ${(Number(d[3])/86400).toFixed(0)}-day options`,MarketCap:`$${p.toFixed(0)}`,UnitAsset:C,Holding:$,Leverage:h,SetLevel:d[0],CriticalLevel:d[1],Target:Math.ceil((d[0]+d[1])/2),Direction:d[2],Tenor:d[3],Strike:b,Notional:v}),o++,F.setDynamic(a,[r,d[2],h.toFixed(1)+"x",$,`$${C.toFixed(2)}`],!1,T().length,o),s&&(w(e,!1),w(t,!1),this.setPerpetualInfo(n[0]),s=!1),T().length>1){const f=a.querySelector(`tbody tr:nth-child(${o})`);f.classList.add("cursor"),f.addEventListener("click",()=>{this.setPerpetualInfo(n[f.dataset.id-1])},!1)}console.log("Success!!! Row:",o,i)}catch{console.log("Failed!!! Row:",o+1,i);const r=setTimeout(()=>{l(),clearTimeout(r)},2500)}};l()})},setPerpetualInfo(e){const t=document.querySelector(".perpetual-info-content");if(!e){t.textContent="";return}t.innerHTML=`
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
                                    <div class="pbm-value-static size-sm"><span>${e.CriticalLevel.toFixed(1)}</span>x</div>
                                    <div class="pbm-value size-sm"><span>${e.SetLevel.toFixed(1)}</span>x</div>
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

            <div class="buttons-container"></div>`,t.querySelector(".buttons-container").innerHTML=`
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
            </div>`,A.createChart({elem:t.querySelector(".chart-comparison"),endpoint1:`https://api.binance.com/api/v3/klines?symbol=${x()}${L()}T&interval=12h&limit=${Math.ceil(e.Tenor/3600)}`,endpoint2:`https://api.binance.com/api/v3/klines?symbol=TKOUSDT&interval=12h&limit=${Math.ceil(e.Tenor/3600)}`,linedata:[e.Strike]}),q.progressBar(t.querySelector(".percentage-bar-multi"),(e.Leverage-e.CriticalLevel)/(e.SetLevel-e.CriticalLevel)*100,100),t.querySelector(".js-save").addEventListener("click",a=>{a.preventDefault(),this.setPopupInfo({type:"save",title:"Invest in Leveraged Perpetuals",data:e,amount:parseFloat(document.querySelector("input[name='usdc-amount']").value)})},!1),t.querySelector(".js-withdraw").addEventListener("click",a=>{a.preventDefault(),this.setPopupInfo({type:"withdraw",title:"Withdraw from Leveraged Perpetuals",data:e,amount:parseFloat(document.querySelector("input[name='usdc-amount']").value)})},!1)},setPopupInfo(e){console.log(e);let t=e.data.UnitAsset==0?e.amount:e.amount/e.data.UnitAsset;const a=[{name:"Name: ",span:e.data.Name},{name:"Address: ",span:S(e.data.Address)},{name:"Price: ",span:`$${e.data.UnitAsset}`},{name:"Units: ",span:`${t.toFixed(2)} ${e.data.Symbol}`},{name:"Trade value: ",span:`$${e.amount.toFixed(2)}`}];I(e.title,k(a,"investinperpetuals")),this.executeTrade(e.type,e.data.Address,e.amount,t)},executeTrade(e,t,a,n){const s=document.createElement("div");s.className="executetrade",document.querySelector(".overlay-popup .op-content").appendChild(s);let o="blue";e==="save"?o="green":e==="withdraw"&&(o="pink");const i=document.createElement("a");i.setAttribute("href","#"),i.className=`btn btn-${o}`,i.textContent="Execute",s.appendChild(i),i.addEventListener("click",async y=>{y.preventDefault(),i.remove();const l=document.createElement("div");l.className="await-approval",l.textContent="Awaiting for allowance approval";const r=document.createElement("div");r.className="await-approval-timer",r.textContent="00:00",l.appendChild(r),s.appendChild(l);const c=document.createElement("div");c.className="await-trade",c.textContent="Awaiting for transaction";const p=document.createElement("div");p.className="await-trade-timer",p.textContent="00:00",c.appendChild(p),s.appendChild(c),this.executeTradeTimer(r,120);const m="Warning: Transaction has failed.",g=await P(e,t,a,n);console.log("approve finished",g),g==="failure"?this.executeTradeFailure(s,m):(l.classList.add("await-active"),l.textContent="Allowance approved.",r.remove(),this.clearTradeTimer(),setTimeout(async()=>{this.executeTradeTimer(p,e==="propose"?300:120),console.log("prior to trade",e,t,a,n);const h=await N(e,t,a);if(console.log("trade finished",h),h==="")this.executeTradeFailure(s,m);else{c.classList.add("await-active"),c.textContent="Transaction mined.",p.remove(),this.clearTradeTimer();const b=document.createElement("div");b.className="approve-trade-link";const v=document.createElement("a");v.setAttribute("href",h),v.setAttribute("target","_blank"),v.className="link-arrow",v.textContent="View on Polygonscan",b.appendChild(v),s.appendChild(b)}},500))},!1)},executeTradeFailure(e,t){const a=document.createElement("div");a.className="await-failure";const n=document.createElement("div");n.className="warning-icon";const s=document.createElement("div");s.className="warning-text",s.textContent=t,a.appendChild(n),a.appendChild(s),e.appendChild(a)},executeTradeTimer(e,t){const a=s=>s>9?s:`0${s}`;let n=0;this.globals.execIntervalId=setInterval(()=>{n++,n>t?(this.executeTradeFailure(document.querySelector(".overlay-popup .executetrade"),"Warning: Transaction has taking longer than normal to be mined. You can close the window and try to trade again."),this.clearTradeTimer()):e.textContent=`${a(parseInt(n/60))}:${a(n%60)}`},1e3)},clearTradeTimer(){clearInterval(this.globals.execIntervalId),this.globals.execIntervalId=null,console.log("clearTradeTimer()")}};export{H as default};
