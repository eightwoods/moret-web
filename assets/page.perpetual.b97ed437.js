import{k as w,l as S,o as d,p as L,t as T,d as k,m as P,s as I,a as N,q as A,r as F}from"./main.70a7fb04.js";import q from"./component.chartComparison.2145fb22.js";import E from"./component.percentageBarMulti.ed2fe187.js";var U={globals:{elem:document.querySelector(".perpetual")},init(){document.querySelector(".perpetual-list-content .js-refresh").addEventListener("click",()=>this.setPerpetuals()),document.querySelector("body.mobile.unknown")&&this.setPerpetuals();const e={childList:!0,attributes:!0,attributeFilter:["sidenav-activechange","sidenav-refreshprice"]};new MutationObserver(t=>{console.log("sidenav refreshed from Perpetual!");for(let n of t)if(n.type==="attributes")switch(n.attributeName){case"sidenav-activechange":this.setPerpetuals();break}this.globals.init=!1}).observe(this.globals.elem.querySelector(".sidenav"),e)},setPerpetuals(){console.log("setPerpetuals()");const e=document.querySelector(".perpetual-list"),a=document.querySelector(".perpetual-info");w(e),w(a);const t=e.querySelector(".comp-dynamic-table");t.textContent="",t.innerHTML=`
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
            </div>`,this.setPerpetualInfo(),S().then(n=>{const i=[],u=[];let o=0;n.forEach(async(s,m)=>{try{const l=await d(s,"name"),r=await d(s,"symbol"),c=await d(s,"aum"),v=await d(s,"supply"),f=await d(s,"balance"),b=await d(s,"leverage"),g=await d(s,"strike"),h=await d(s,"notional"),p=await d(s,"params"),x=v>0?c/v:1,y=`$${(v>0?c/v*f:0).toFixed(2)}`;u.push({Name:l,Symbol:r,Address:s,Description:`${p[2]} ${r}<br>Leverage achieved by buying ${(Number(p[3])/86400).toFixed(0)}-day options`,MarketCap:`$${c.toFixed(0)}`,UnitAsset:x,Holding:y,Leverage:b,SetLevel:p[0],CriticalLevel:p[1],Target:Math.ceil((p[0]+p[1])/2),Direction:p[2],Tenor:p[3],Strike:g,Notional:h}),i.push([l,p[2],b.toFixed(1)+"x",y,`$${x.toFixed(2)}`]),o++,console.log(o,n.length),o===n.length&&(w(e,!1),w(a,!1),this.setPerpetualInfo(u[0]),L.setDynamic(t,i),n.length>1&&t.querySelectorAll("tbody tr").forEach((C,$)=>{C.classList.add("cursor"),C.addEventListener("click",()=>{this.setPerpetualInfo(u[$])},!1)}))}catch{console.log("Fail! refresh data load...");const r=setTimeout(()=>{this.setPerpetuals(),clearTimeout(r)},5e3)}})}).catch(n=>{console.error(n)})},setPerpetualInfo(e){const a=document.querySelector(".perpetual-info-content");if(!e){a.textContent="";return}a.innerHTML=`
            <div class="perpetual-row">
                <div class="perpetual-col">
                    <div class="header-title m-b-24">${e.Name}</div>
                    <div class="perpetual-content">
                        <div class="info">
                            <p class="m-b-20">${e.Description}</p>
                            <p>Current option position ${e.Notional.toFixed(2)} ${T()}, strike at $${e.Strike.toFixed(2)}</p>
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
                        <div class="ccl-legend">${T()}</div>
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
            </div>`,q.createChart({elem:a.querySelector(".chart-comparison"),endpoint1:`https://api.binance.com/api/v3/klines?symbol=${T()}${k()}T&interval=12h&limit=${Math.ceil(e.Tenor/3600)}`,endpoint2:`https://api.binance.com/api/v3/klines?symbol=TKOUSDT&interval=12h&limit=${Math.ceil(e.Tenor/3600)}`,linedata:[e.Strike]}),E.progressBar(a.querySelector(".percentage-bar-multi"),(e.Leverage-e.CriticalLevel)/e.SetLevel*100,100),a.querySelector(".js-save").addEventListener("click",t=>{t.preventDefault(),this.setPopupInfo({type:"save",title:"Invest in Leveraged Perpetuals",data:e,amount:parseFloat(document.querySelector("input[name='usdc-amount']").value)})},!1),a.querySelector(".js-withdraw").addEventListener("click",t=>{t.preventDefault(),this.setPopupInfo({type:"withdraw",title:"Withdraw from Leveraged Perpetuals",data:e,amount:parseFloat(document.querySelector("input[name='usdc-amount']").value)})},!1)},setPopupInfo(e){console.log(e);let a=e.data.UnitAsset==0?e.amount:e.amount/e.data.UnitAsset;const t=[{name:"Name: ",span:e.data.Name},{name:"Address: ",span:P(e.data.Address)},{name:"Price: ",span:`$${e.data.UnitAsset}`},{name:"Units: ",span:`${a.toFixed(2)} ${e.data.Symbol}`},{name:"Trade value: ",span:`$${e.amount.toFixed(2)}`}];I(e.title,N(t,"investinperpetuals")),this.executeTrade(e.type,e.data.Address,e.amount,a)},executeTrade(e,a,t,n){const i=document.createElement("div");i.className="executetrade",document.querySelector(".overlay-popup .op-content").appendChild(i);let u="blue";e==="save"?u="green":e==="withdraw"&&(u="pink");const o=document.createElement("a");o.setAttribute("href","#"),o.className=`btn btn-${u}`,o.textContent="Execute",i.appendChild(o),o.addEventListener("click",async s=>{s.preventDefault(),o.remove();const m=document.createElement("div");m.className="await-approval",m.textContent="Awaiting for allowance approval";const l=document.createElement("div");l.className="await-approval-timer",l.textContent="00:00",m.appendChild(l),i.appendChild(m);const r=document.createElement("div");r.className="await-trade",r.textContent="Awaiting for transaction";const c=document.createElement("div");c.className="await-trade-timer",c.textContent="00:00",r.appendChild(c),i.appendChild(r),this.executeTradeTimer(l,120);const v="Warning: Transaction has failed.",f=await A(e,a,t,n);console.log("approve finished",f),f==="failure"?this.executeTradeFailure(i,v):(m.classList.add("await-active"),m.textContent="Allowance approved.",l.remove(),this.clearTradeTimer(),setTimeout(async()=>{this.executeTradeTimer(c,e==="propose"?300:120),console.log("prior to trade",e,a,t,n);const b=await F(e,a,t);if(console.log("trade finished",b),b==="")this.executeTradeFailure(i,v);else{r.classList.add("await-active"),r.textContent="Transaction mined.",c.remove(),this.clearTradeTimer();const g=document.createElement("div");g.className="approve-trade-link";const h=document.createElement("a");h.setAttribute("href",b),h.setAttribute("target","_blank"),h.className="link-arrow",h.textContent="View on Polygonscan",g.appendChild(h),i.appendChild(g)}},500))},!1)},executeTradeFailure(e,a){const t=document.createElement("div");t.className="await-failure";const n=document.createElement("div");n.className="warning-icon";const i=document.createElement("div");i.className="warning-text",i.textContent=a,t.appendChild(n),t.appendChild(i),e.appendChild(t)},executeTradeTimer(e,a){const t=i=>i>9?i:`0${i}`;let n=0;this.globals.execIntervalId=setInterval(()=>{n++,n>a?(this.executeTradeFailure(document.querySelector(".overlay-popup .executetrade"),"Warning: Transaction has taking longer than normal to be mined. You can close the window and try to trade again."),this.clearTradeTimer()):e.textContent=`${t(parseInt(n/60))}:${t(n%60)}`},1e3)},clearTradeTimer(){clearInterval(this.globals.execIntervalId),this.globals.execIntervalId=null,console.log("clearTradeTimer()")}};export{U as default};