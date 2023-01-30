import{k as w,l as T,t as x,d as S,m as L,s as k,a as P,o as I,p as N,q as u,r as A}from"./main.8a35641f.js";import F from"./component.chartComparison.2145fb22.js";import q from"./component.percentageBarMulti.56f4828c.js";var H={globals:{elem:document.querySelector(".perpetual")},init(){const e=document.querySelector(".perpetual-list-content .js-refresh");e&&e.addEventListener("click",()=>this.setPerpetuals()),document.querySelector("body.mobile.unknown")&&this.setPerpetuals();const t={childList:!0,attributes:!0,attributeFilter:["sidenav-activechange","sidenav-refreshprice"]};new MutationObserver(i=>{console.log("sidenav refreshed from Perpetual!");for(let s of i)if(s.type==="attributes")switch(s.attributeName){case"sidenav-activechange":this.setPerpetuals();break}this.globals.init=!1}).observe(this.globals.elem.querySelector(".sidenav"),t)},setPerpetuals(){console.log("setPerpetuals()");const e=document.querySelector(".perpetual-list"),t=document.querySelector(".perpetual-info");w(e),w(t);const a=e.querySelector(".comp-dynamic-table");a.innerHTML=`
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
            </div>`,this.setPerpetualInfo();const i=[];let s=!0,o=0;T().forEach((n,y)=>{const l=async()=>{try{const r=await u(n,"name"),c=await u(n,"symbol"),d=await u(n,"aum"),m=await u(n,"supply"),g=await u(n,"balance"),h=await u(n,"leverage"),b=await u(n,"strike"),v=await u(n,"notional"),p=await u(n,"params"),$=m>0?d/m:1,C=`$${(m>0?d/m*g:0).toFixed(2)}`;if(i.push({Name:r,Symbol:c,Address:n,Description:`${p[2]} ${c}<br>Leverage achieved by buying ${(Number(p[3])/86400).toFixed(0)}-day options`,MarketCap:`$${d.toFixed(0)}`,UnitAsset:$,Holding:C,Leverage:h,SetLevel:p[0],CriticalLevel:p[1],Target:Math.ceil((p[0]+p[1])/2),Direction:p[2],Tenor:p[3],Strike:b,Notional:v}),o++,A.setDynamic(a,[r,p[2],h.toFixed(1)+"x",C,`$${$.toFixed(2)}`],!1,T().length,o),s&&(w(e,!1),w(t,!1),this.setPerpetualInfo(i[0]),s=!1),T().length>1){const f=a.querySelector(`tbody tr:nth-child(${o})`);f.classList.add("cursor"),f.addEventListener("click",()=>{this.setPerpetualInfo(i[f.dataset.id-1])},!1)}console.log("Success!!! Row:",o,n)}catch{console.log("Failed!!! Row:",o+1,n);const r=setTimeout(()=>{l(),clearTimeout(r)},2500)}};l()})},setPerpetualInfo(e){const t=document.querySelector(".perpetual-info-content");if(!e){t.textContent="";return}t.innerHTML=`
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
                                    <div class="pbm-value-static size-sm"><span>2.5x</span></div>
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
            </div>`,F.createChart({elem:t.querySelector(".chart-comparison"),endpoint1:`https://api.binance.com/api/v3/klines?symbol=${x()}${S()}T&interval=12h&limit=${Math.ceil(e.Tenor/3600)}`,endpoint2:`https://api.binance.com/api/v3/klines?symbol=TKOUSDT&interval=12h&limit=${Math.ceil(e.Tenor/3600)}`,linedata:[e.Strike]}),q.progressBar(t.querySelector(".percentage-bar-multi"),(e.Leverage-e.CriticalLevel)/e.SetLevel*100,100),t.querySelector(".js-save").addEventListener("click",a=>{a.preventDefault(),this.setPopupInfo({type:"save",title:"Invest in Leveraged Perpetuals",data:e,amount:parseFloat(document.querySelector("input[name='usdc-amount']").value)})},!1),t.querySelector(".js-withdraw").addEventListener("click",a=>{a.preventDefault(),this.setPopupInfo({type:"withdraw",title:"Withdraw from Leveraged Perpetuals",data:e,amount:parseFloat(document.querySelector("input[name='usdc-amount']").value)})},!1)},setPopupInfo(e){console.log(e);let t=e.data.UnitAsset==0?e.amount:e.amount/e.data.UnitAsset;const a=[{name:"Name: ",span:e.data.Name},{name:"Address: ",span:L(e.data.Address)},{name:"Price: ",span:`$${e.data.UnitAsset}`},{name:"Units: ",span:`${t.toFixed(2)} ${e.data.Symbol}`},{name:"Trade value: ",span:`$${e.amount.toFixed(2)}`}];k(e.title,P(a,"investinperpetuals")),this.executeTrade(e.type,e.data.Address,e.amount,t)},executeTrade(e,t,a,i){const s=document.createElement("div");s.className="executetrade",document.querySelector(".overlay-popup .op-content").appendChild(s);let o="blue";e==="save"?o="green":e==="withdraw"&&(o="pink");const n=document.createElement("a");n.setAttribute("href","#"),n.className=`btn btn-${o}`,n.textContent="Execute",s.appendChild(n),n.addEventListener("click",async y=>{y.preventDefault(),n.remove();const l=document.createElement("div");l.className="await-approval",l.textContent="Awaiting for allowance approval";const r=document.createElement("div");r.className="await-approval-timer",r.textContent="00:00",l.appendChild(r),s.appendChild(l);const c=document.createElement("div");c.className="await-trade",c.textContent="Awaiting for transaction";const d=document.createElement("div");d.className="await-trade-timer",d.textContent="00:00",c.appendChild(d),s.appendChild(c),this.executeTradeTimer(r,120);const m="Warning: Transaction has failed.",g=await I(e,t,a,i);console.log("approve finished",g),g==="failure"?this.executeTradeFailure(s,m):(l.classList.add("await-active"),l.textContent="Allowance approved.",r.remove(),this.clearTradeTimer(),setTimeout(async()=>{this.executeTradeTimer(d,e==="propose"?300:120),console.log("prior to trade",e,t,a,i);const h=await N(e,t,a);if(console.log("trade finished",h),h==="")this.executeTradeFailure(s,m);else{c.classList.add("await-active"),c.textContent="Transaction mined.",d.remove(),this.clearTradeTimer();const b=document.createElement("div");b.className="approve-trade-link";const v=document.createElement("a");v.setAttribute("href",h),v.setAttribute("target","_blank"),v.className="link-arrow",v.textContent="View on Polygonscan",b.appendChild(v),s.appendChild(b)}},500))},!1)},executeTradeFailure(e,t){const a=document.createElement("div");a.className="await-failure";const i=document.createElement("div");i.className="warning-icon";const s=document.createElement("div");s.className="warning-text",s.textContent=t,a.appendChild(i),a.appendChild(s),e.appendChild(a)},executeTradeTimer(e,t){const a=s=>s>9?s:`0${s}`;let i=0;this.globals.execIntervalId=setInterval(()=>{i++,i>t?(this.executeTradeFailure(document.querySelector(".overlay-popup .executetrade"),"Warning: Transaction has taking longer than normal to be mined. You can close the window and try to trade again."),this.clearTradeTimer()):e.textContent=`${a(parseInt(i/60))}:${a(i%60)}`},1e3)},clearTradeTimer(){clearInterval(this.globals.execIntervalId),this.globals.execIntervalId=null,console.log("clearTradeTimer()")}};export{H as default};
