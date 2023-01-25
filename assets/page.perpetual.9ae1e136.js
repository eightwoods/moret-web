import{k as w,l as $,o as d,p as C,q as y,t as f,d as L,m as S,s as k,a as I,r as N,u as P}from"./main.4724051d.js";import A from"./component.chartComparison.2145fb22.js";import E from"./component.percentageBarMulti.77e904b7.js";var M={globals:{elem:document.querySelector(".perpetual")},init(){document.querySelector(".perpetual-list-content .js-refresh").addEventListener("click",()=>this.setPerpetuals());const e={childList:!0,attributes:!0,attributeFilter:["sidenav-activechange","sidenav-refreshprice"]};new MutationObserver(t=>{console.log("sidenav refreshed from Perpetual!");for(let n of t)if(n.type==="attributes")switch(n.attributeName){case"sidenav-activechange":this.setPerpetuals();break}this.globals.init=!1}).observe(this.globals.elem.querySelector(".sidenav"),e)},setPerpetuals(){const e=document.querySelector(".perpetual-list"),a=document.querySelector(".perpetual-info");w(e),w(a);const t=e.querySelector(".comp-dynamic-table");t.innerHTML=`
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
            </div>`,this.setPerpetualInfo(),$().then(n=>{w(e,!1),w(a,!1);const r=[],o=[];n.forEach(async(s,m)=>{try{const l=await d(s,"name"),u=await d(s,"symbol"),c=await d(s,"aum"),p=await d(s,"supply"),b=await d(s,"balance"),g=await d(s,"leverage"),v=await d(s,"strike"),h=await d(s,"notional"),i=await d(s,"params");o.push({Name:l,Symbol:u,Address:s,Description:`${i[2]} ${u} <br> Leverage achieved by buying ${(Number(i[3])/86400).toFixed(0)}-day options`,MarketCap:`$${c.toFixed(0)}`,UnitAsset:p>0?c/p:1,Holding:`$${(p>0?c/p*b:0).toFixed(2)}`,Leverage:g,SetLevel:i[0],CriticalLevel:i[1],Target:Math.ceil((i[0]+i[1])/2),Direction:i[2],Tenor:i[3],Strike:v,Notional:h}),r.push([o[m].Name,o[m].Direction,o[m].Leverage.toFixed(2)+"x",o[m].Holding,`$${o[m].UnitAsset.toFixed(2)}`]),m+1===n.length&&(this.setPerpetualInfo(o[0]),C.setDynamic(t,r),n.length>1&&t.querySelectorAll("tbody tr").forEach((T,x)=>{T.classList.add("cursor"),T.addEventListener("click",()=>{this.setPerpetualInfo(o[x])},!1)}))}catch(l){console.error(l),y()}})}).catch(n=>{console.error(n),y()})},setPerpetualInfo(e){const a=document.querySelector(".perpetual-info-content");if(!e){a.textContent="";return}a.innerHTML=`
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
            </div>`,A.createChart({elem:a.querySelector(".chart-comparison"),endpoint1:`https://api.binance.com/api/v3/klines?symbol=${f()}${L()}T&interval=12h&limit=${Math.ceil(e.Tenor/3600)}`,endpoint2:`https://api.binance.com/api/v3/klines?symbol=TKOUSDT&interval=12h&limit=${Math.ceil(e.Tenor/3600)}`,linedata:[e.Strike]}),E.progressBar(a.querySelector(".percentage-bar-multi"),e.Leverage,e.SetLevel),a.querySelector(".js-save").addEventListener("click",t=>{t.preventDefault(),this.setPopupInfo({type:"save",title:"Invest in Leveraged Perpetuals",data:e,amount:parseFloat(document.querySelector("input[name='usdc-amount']").value)})},!1),a.querySelector(".js-withdraw").addEventListener("click",t=>{t.preventDefault(),this.setPopupInfo({type:"withdraw",title:"Withdraw from Leveraged Perpetuals",data:e,amount:parseFloat(document.querySelector("input[name='usdc-amount']").value)})},!1)},setPopupInfo(e){console.log(e);let a=e.data.UnitAsset==0?e.amount:e.amount/e.data.UnitAsset;const t=[{name:"Name: ",span:e.data.Name},{name:"Address: ",span:S(e.data.Address)},{name:"Price: ",span:`$${e.data.UnitAsset}`},{name:"Units: ",span:`${a.toFixed(2)} ${e.data.Symbol}`},{name:"Trade value: ",span:`$${e.amount.toFixed(2)}`}];k(e.title,I(t,"investinperpetuals")),this.executeTrade(e.type,e.data.Address,e.amount,a)},executeTrade(e,a,t,n){const r=document.createElement("div");r.className="executetrade",document.querySelector(".overlay-popup .op-content").appendChild(r);let o="blue";e==="save"?o="green":e==="withdraw"&&(o="pink");const s=document.createElement("a");s.setAttribute("href","#"),s.className=`btn btn-${o}`,s.textContent="Execute",r.appendChild(s),s.addEventListener("click",async m=>{m.preventDefault(),s.remove();const l=document.createElement("div");l.className="await-approval",l.textContent="Awaiting for allowance approval";const u=document.createElement("div");u.className="await-approval-timer",u.textContent="00:00",l.appendChild(u),r.appendChild(l);const c=document.createElement("div");c.className="await-trade",c.textContent="Awaiting for transaction";const p=document.createElement("div");p.className="await-trade-timer",p.textContent="00:00",c.appendChild(p),r.appendChild(c),this.executeTradeTimer(u,120);const b="Warning: Transaction has failed.",g=await N(e,a,t,n);console.log("approve finished",g),g==="failure"?this.executeTradeFailure(r,b):(l.classList.add("await-active"),l.textContent="Allowance approved.",u.remove(),this.clearTradeTimer(),setTimeout(async()=>{this.executeTradeTimer(p,e==="propose"?300:120),console.log("prior to trade",e,a,t,n);const v=await P(e,a,t);if(console.log("trade finished",v),v==="")this.executeTradeFailure(r,b);else{c.classList.add("await-active"),c.textContent="Transaction mined.",p.remove(),this.clearTradeTimer();const h=document.createElement("div");h.className="approve-trade-link";const i=document.createElement("a");i.setAttribute("href",v),i.setAttribute("target","_blank"),i.className="link-arrow",i.textContent="View on Polygonscan",h.appendChild(i),r.appendChild(h)}},500))},!1)},executeTradeFailure(e,a){const t=document.createElement("div");t.className="await-failure";const n=document.createElement("div");n.className="warning-icon";const r=document.createElement("div");r.className="warning-text",r.textContent=a,t.appendChild(n),t.appendChild(r),e.appendChild(t)},executeTradeTimer(e,a){const t=r=>r>9?r:`0${r}`;let n=0;this.globals.execIntervalId=setInterval(()=>{n++,n>a?(this.executeTradeFailure(document.querySelector(".overlay-popup .executetrade"),"Warning: Transaction has taking longer than normal to be mined. You can close the window and try to trade again."),this.clearTradeTimer()):e.textContent=`${t(parseInt(n/60))}:${t(n%60)}`},1e3)},clearTradeTimer(){clearInterval(this.globals.execIntervalId),this.globals.execIntervalId=null,console.log("clearTradeTimer()")}};export{M as default};
