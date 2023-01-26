import{k as w,l as S,o as d,p as k,t as T,d as L,m as P,s as I,a as N,q as A,r as q}from"./main.809ceb9c.js";import E from"./component.chartComparison.2145fb22.js";import F from"./component.percentageBarMulti.b2fc03b2.js";var U={globals:{elem:document.querySelector(".perpetual")},init(){const e=document.querySelector(".perpetual-list-content .js-refresh");e.addEventListener("click",()=>this.setPerpetuals()),document.querySelector("body.desktop.os-other")&&e.click();const t={childList:!0,attributes:!0,attributeFilter:["sidenav-activechange","sidenav-refreshprice"]};new MutationObserver(r=>{console.log("sidenav refreshed from Perpetual!");for(let n of r)if(n.type==="attributes")switch(n.attributeName){case"sidenav-activechange":document.querySelector("body.desktop.os-other")||this.setPerpetuals();break}this.globals.init=!1}).observe(this.globals.elem.querySelector(".sidenav"),t)},setPerpetuals(){console.log("setPerpetuals()"),alert("03 setPerpetuals()");const e=document.querySelector(".perpetual-list"),t=document.querySelector(".perpetual-info");w(e),w(t);const a=e.querySelector(".comp-dynamic-table");a.textContent="",a.innerHTML=`
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th class="sortable sort-text">Name</th>
                            <th class="sortable sort-text">Side</th>
                            <th class="sortable sort-text">Leverage</th>
                            <th class="sortable sort-text">Holding</th>
                            <th class="sortable">NAV</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>`,this.setPerpetualInfo(),S().then(r=>{const n=[],u=[];let l=0;r.forEach(async(s,m)=>{try{const o=await d(s,"name"),i=await d(s,"symbol"),c=await d(s,"aum"),v=await d(s,"supply"),f=await d(s,"balance"),b=await d(s,"leverage"),g=await d(s,"strike"),h=await d(s,"notional"),p=await d(s,"params"),x=v>0?c/v:1,y=`$${(v>0?c/v*f:0).toFixed(2)}`;u.push({Name:o,Symbol:i,Address:s,Description:`${p[2]} ${i}<br>Leverage achieved by buying ${(Number(p[3])/86400).toFixed(0)}-day options`,MarketCap:`$${c.toFixed(0)}`,UnitAsset:x,Holding:y,Leverage:b,SetLevel:p[0],CriticalLevel:p[1],Target:Math.ceil((p[0]+p[1])/2),Direction:p[2],Tenor:p[3],Strike:g,Notional:h}),n.push([o,p[2],b.toFixed(2)+"x",y,`$${x.toFixed(2)}`]),l++,l===r.length&&(w(e,!1),w(t,!1),this.setPerpetualInfo(u[0]),k.setDynamic(a,n),r.length>1&&a.querySelectorAll("tbody tr").forEach(($,C)=>{$.classList.add("cursor"),$.addEventListener("click",()=>{this.setPerpetualInfo(u[C])},!1)}))}catch(o){console.error(o),console.log("Fail! refresh data load...");const i=setTimeout(()=>{this.setPerpetuals(),clearTimeout(i)},5e3)}})}).catch(r=>{console.error(r)})},setPerpetualInfo(e){const t=document.querySelector(".perpetual-info-content");if(!e){t.textContent="";return}t.innerHTML=`
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
                                    <div class="pbm-value size-sm"><span>${e.Leverage}</span>x</div>
                                </div>
                                <div class="pbm-bottom">
                                    <div class="pbm-progressbar"></div>
                                    <div class="pbm-value size-sm"><span>${e.SetLevel}</span>x</div>
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
            </div>`,E.createChart({elem:t.querySelector(".chart-comparison"),endpoint1:`https://api.binance.com/api/v3/klines?symbol=${T()}${L()}T&interval=12h&limit=${Math.ceil(e.Tenor/3600)}`,endpoint2:`https://api.binance.com/api/v3/klines?symbol=TKOUSDT&interval=12h&limit=${Math.ceil(e.Tenor/3600)}`,linedata:[e.Strike]}),F.progressBar(t.querySelector(".percentage-bar-multi"),e.Leverage,e.SetLevel),t.querySelector(".js-save").addEventListener("click",a=>{a.preventDefault(),this.setPopupInfo({type:"save",title:"Invest in Leveraged Perpetuals",data:e,amount:parseFloat(document.querySelector("input[name='usdc-amount']").value)})},!1),t.querySelector(".js-withdraw").addEventListener("click",a=>{a.preventDefault(),this.setPopupInfo({type:"withdraw",title:"Withdraw from Leveraged Perpetuals",data:e,amount:parseFloat(document.querySelector("input[name='usdc-amount']").value)})},!1)},setPopupInfo(e){console.log(e);let t=e.data.UnitAsset==0?e.amount:e.amount/e.data.UnitAsset;const a=[{name:"Name: ",span:e.data.Name},{name:"Address: ",span:P(e.data.Address)},{name:"Price: ",span:`$${e.data.UnitAsset}`},{name:"Units: ",span:`${t.toFixed(2)} ${e.data.Symbol}`},{name:"Trade value: ",span:`$${e.amount.toFixed(2)}`}];I(e.title,N(a,"investinperpetuals")),this.executeTrade(e.type,e.data.Address,e.amount,t)},executeTrade(e,t,a,r){const n=document.createElement("div");n.className="executetrade",document.querySelector(".overlay-popup .op-content").appendChild(n);let u="blue";e==="save"?u="green":e==="withdraw"&&(u="pink");const l=document.createElement("a");l.setAttribute("href","#"),l.className=`btn btn-${u}`,l.textContent="Execute",n.appendChild(l),l.addEventListener("click",async s=>{s.preventDefault(),l.remove();const m=document.createElement("div");m.className="await-approval",m.textContent="Awaiting for allowance approval";const o=document.createElement("div");o.className="await-approval-timer",o.textContent="00:00",m.appendChild(o),n.appendChild(m);const i=document.createElement("div");i.className="await-trade",i.textContent="Awaiting for transaction";const c=document.createElement("div");c.className="await-trade-timer",c.textContent="00:00",i.appendChild(c),n.appendChild(i),this.executeTradeTimer(o,120);const v="Warning: Transaction has failed.",f=await A(e,t,a,r);console.log("approve finished",f),f==="failure"?this.executeTradeFailure(n,v):(m.classList.add("await-active"),m.textContent="Allowance approved.",o.remove(),this.clearTradeTimer(),setTimeout(async()=>{this.executeTradeTimer(c,e==="propose"?300:120),console.log("prior to trade",e,t,a,r);const b=await q(e,t,a);if(console.log("trade finished",b),b==="")this.executeTradeFailure(n,v);else{i.classList.add("await-active"),i.textContent="Transaction mined.",c.remove(),this.clearTradeTimer();const g=document.createElement("div");g.className="approve-trade-link";const h=document.createElement("a");h.setAttribute("href",b),h.setAttribute("target","_blank"),h.className="link-arrow",h.textContent="View on Polygonscan",g.appendChild(h),n.appendChild(g)}},500))},!1)},executeTradeFailure(e,t){const a=document.createElement("div");a.className="await-failure";const r=document.createElement("div");r.className="warning-icon";const n=document.createElement("div");n.className="warning-text",n.textContent=t,a.appendChild(r),a.appendChild(n),e.appendChild(a)},executeTradeTimer(e,t){const a=n=>n>9?n:`0${n}`;let r=0;this.globals.execIntervalId=setInterval(()=>{r++,r>t?(this.executeTradeFailure(document.querySelector(".overlay-popup .executetrade"),"Warning: Transaction has taking longer than normal to be mined. You can close the window and try to trade again."),this.clearTradeTimer()):e.textContent=`${a(parseInt(r/60))}:${a(r%60)}`},1e3)},clearTradeTimer(){clearInterval(this.globals.execIntervalId),this.globals.execIntervalId=null,console.log("clearTradeTimer()")}};export{U as default};
