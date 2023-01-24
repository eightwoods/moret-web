import{k as w,l as x,o as d,p as $,t as f,d as C,m as L,s as S,a as k,q as N,r as P}from"./main.4df4cad7.js";import I from"./component.chartComparison.2145fb22.js";import A from"./component.percentageBarMulti.a5840dd3.js";var D={globals:{elem:document.querySelector(".perpetual")},init(){document.querySelector(".perpetual-list-content .js-refresh").addEventListener("click",()=>this.setPerpetuals());const e={childList:!0,attributes:!0,attributeFilter:["sidenav-activechange","sidenav-refreshprice"]};new MutationObserver(t=>{console.log("sidenav refreshed from Perpetual!");for(let r of t)if(r.type==="attributes")switch(r.attributeName){case"sidenav-activechange":this.setPerpetuals();break}this.globals.init=!1}).observe(this.globals.elem.querySelector(".sidenav"),e)},setPerpetuals(){const e=document.querySelector(".perpetual-list"),a=document.querySelector(".perpetual-info");w(e),w(a);const t=e.querySelector(".comp-dynamic-table");t.innerHTML=`
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
            </div>`,this.setPerpetualInfo(),x().then(r=>{w(e,!1),w(a,!1);const n=[],o=[];r.forEach(async(i,m)=>{try{const l=await d(i,"name"),u=await d(i,"symbol"),c=await d(i,"aum"),p=await d(i,"supply"),b=await d(i,"balance"),g=await d(i,"leverage"),v=await d(i,"strike"),h=await d(i,"notional"),s=await d(i,"params");o.push({Name:l,Symbol:u,Address:i,Description:`${s[2]} ${u} <br> Leverage achieved by buying ${(Number(s[3])/86400).toFixed(0)}-day options`,MarketCap:`$${c.toFixed(0)}`,UnitAsset:p>0?c/p:1,Holding:`$${(p>0?c/p*b:0).toFixed(2)}`,Leverage:g,SetLevel:s[0],CriticalLevel:s[1],Target:Math.ceil((s[0]+s[1])/2),Direction:s[2],Tenor:s[3],Strike:v,Notional:h}),n.push([o[m].Name,o[m].Direction,o[m].Leverage.toFixed(2)+"x",o[m].Holding,`$${o[m].UnitAsset.toFixed(2)}`]),m+1===r.length&&(this.setPerpetualInfo(o[0]),$.setDynamic(t,n),r.length>1&&t.querySelectorAll("tbody tr").forEach((T,y)=>{T.classList.add("cursor"),T.addEventListener("click",()=>{this.setPerpetualInfo(o[y])},!1)}))}catch(l){console.error(l)}})}).catch(r=>{console.error(r)})},setPerpetualInfo(e){const a=document.querySelector(".perpetual-info-content");if(!e){a.textContent="";return}a.innerHTML=`
            <div class="perpetual-row">
                <div class="perpetual-col">
                    <div class="header-title m-b-24">${e.Name}</div>
                    <div class="perpetual-content">
                        <div class="info">
                            <p class="m-b-20">${e.Description}</p>
                            <p>Current option position ${e.Notional.toFixed(2)} ${f()}, strike at $${e.Strike.toFixed(2)}</p>
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
                        <div class="ccl-legend">${f()}</div>
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
            </div>`,I.createChart({elem:a.querySelector(".chart-comparison"),endpoint1:`https://api.binance.com/api/v3/klines?symbol=${f()}${C()}T&interval=12h&limit=${Math.ceil(e.Tenor/3600)}`,endpoint2:`https://api.binance.com/api/v3/klines?symbol=TKOUSDT&interval=12h&limit=${Math.ceil(e.Tenor/3600)}`,linedata:[e.Strike]}),A.progressBar(a.querySelector(".percentage-bar-multi"),e.Leverage,e.SetLevel),a.querySelector(".js-save").addEventListener("click",t=>{t.preventDefault(),this.setPopupInfo({type:"save",title:"Invest in Leveraged Perpetuals",data:e,amount:parseFloat(document.querySelector("input[name='usdc-amount']").value)})},!1),a.querySelector(".js-withdraw").addEventListener("click",t=>{t.preventDefault(),this.setPopupInfo({type:"withdraw",title:"Withdraw from Leveraged Perpetuals",data:e,amount:parseFloat(document.querySelector("input[name='usdc-amount']").value)})},!1)},setPopupInfo(e){console.log(e);let a=e.data.UnitAsset==0?e.amount:e.amount/e.data.UnitAsset;const t=[{name:"Name: ",span:e.data.Name},{name:"Address: ",span:L(e.data.Address)},{name:"Price: ",span:`$${e.data.UnitAsset}`},{name:"Units: ",span:`${a.toFixed(2)} ${e.data.Symbol}`},{name:"Trade value: ",span:`$${e.amount.toFixed(2)}`}];S(e.title,k(t,"investinperpetuals")),this.executeTrade(e.type,e.data.Address,e.amount,a)},executeTrade(e,a,t,r){const n=document.createElement("div");n.className="executetrade",document.querySelector(".overlay-popup .op-content").appendChild(n);let o="blue";e==="save"?o="green":e==="withdraw"&&(o="pink");const i=document.createElement("a");i.setAttribute("href","#"),i.className=`btn btn-${o}`,i.textContent="Execute",n.appendChild(i),i.addEventListener("click",async m=>{m.preventDefault(),i.remove();const l=document.createElement("div");l.className="await-approval",l.textContent="Awaiting for allowance approval";const u=document.createElement("div");u.className="await-approval-timer",u.textContent="00:00",l.appendChild(u),n.appendChild(l);const c=document.createElement("div");c.className="await-trade",c.textContent="Awaiting for transaction";const p=document.createElement("div");p.className="await-trade-timer",p.textContent="00:00",c.appendChild(p),n.appendChild(c),this.executeTradeTimer(u,120);const b="Warning: Transaction has failed.",g=await N(e,a,t,r);console.log("approve finished",g),g==="failure"?this.executeTradeFailure(n,b):(l.classList.add("await-active"),l.textContent="Allowance approved.",u.remove(),this.clearTradeTimer(),setTimeout(async()=>{this.executeTradeTimer(p,e==="propose"?300:120),console.log("prior to trade",e,a,t,r);const v=await P(e,a,t);if(console.log("trade finished",v),v==="")this.executeTradeFailure(n,b);else{c.classList.add("await-active"),c.textContent="Transaction mined.",p.remove(),this.clearTradeTimer();const h=document.createElement("div");h.className="approve-trade-link";const s=document.createElement("a");s.setAttribute("href",v),s.setAttribute("target","_blank"),s.className="link-arrow",s.textContent="View on Polygonscan",h.appendChild(s),n.appendChild(h)}},500))},!1)},executeTradeFailure(e,a){const t=document.createElement("div");t.className="await-failure";const r=document.createElement("div");r.className="warning-icon";const n=document.createElement("div");n.className="warning-text",n.textContent=a,t.appendChild(r),t.appendChild(n),e.appendChild(t)},executeTradeTimer(e,a){const t=n=>n>9?n:`0${n}`;let r=0;this.globals.execIntervalId=setInterval(()=>{r++,r>a?(this.executeTradeFailure(document.querySelector(".overlay-popup .executetrade"),"Warning: Transaction has taking longer than normal to be mined. You can close the window and try to trade again."),this.clearTradeTimer()):e.textContent=`${t(parseInt(r/60))}:${t(r%60)}`},1e3)},clearTradeTimer(){clearInterval(this.globals.execIntervalId),this.globals.execIntervalId=null,console.log("clearTradeTimer()")}};export{D as default};
