import{k as f,u as g,t as $,d as C,s as I,a as A,v as D,x as k,y as v,r as E}from"./main.09292056.js";import F from"./component.chartComparison.2145fb22.js";import q from"./component.percentageBarMulti.9c4953f0.js";var U={globals:{elem:document.querySelector(".saver"),btnRefresh:document.querySelector(".saver-list-content .js-refresh"),appInit:!0},init(){this.globals.btnRefresh.addEventListener("click",()=>this.setSavers()),setTimeout(()=>{this.globals.appInit&&this.setSavers()},2500);const e={childList:!0,attributes:!0,attributeFilter:["sidenav-activechange","sidenav-refreshprice"]};new MutationObserver(t=>{console.log("sidenav refreshed from Saver!");for(let s of t)if(s.type==="attributes")switch(s.attributeName){case"sidenav-activechange":this.setSavers();break}}).observe(this.globals.elem.querySelector(".sidenav"),e)},setSavers(){this.globals.appInit=!1,this.globals.btnRefresh.classList.add("hide"),console.log("setSavers()");const e=document.querySelector(".saver-list"),a=document.querySelector(".saver-info");f(e),f(a);const t=e.querySelector(".comp-dynamic-table");t.innerHTML=`
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th class="sortable sort-text">Name</th>
                            <th class="sortable sort-text">Holding</th>
                            <th class="sortable sort-text">NAV</th>
                            <th class="sortable sort-text">P&L</th>
                            <th class="sortable sort-text">Status</th>
                            <th class="sortable sort-text">Next Vintage</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>`,this.setSaverInfo();const s=[];let n=!0,o=0;g().forEach((i,T)=>{const p=async()=>{try{const l=await v(i,"name"),u=await v(i,"symbol"),c=await v(i,"aum"),h=await v(i,"supply"),b=await v(i,"balance"),r=await v(i,"params"),d=await v(i,"vintage"),m=await v(i,"opentime"),y=h>0?c/h:1,S=`$${(h>0?c/h*b:0).toFixed(2)}`,x=d.startNAV>0?c/d.startNAV-1:0,L=new Date((m+Number(r.tradeWindow))*1e3).toLocaleString(),N=m<Math.floor(Date.now()/1e3);if(s.push({Name:l,Symbol:u,Address:i,Description:`Soft Ceiling at ${(Number(r.callMoney)/Number(r.multiplier)).toLocaleString(void 0,{style:"percent",minimumFractionDigits:0})} rolled every ${Number(r.callTenor)/86400} days <br>Buffer range ${(Number(r.putSpread)/Number(r.multiplier)).toLocaleString(void 0,{style:"percent",minimumFractionDigits:0})} to ${(Number(r.putMoney)/Number(r.multiplier)).toLocaleString(void 0,{style:"percent",minimumFractionDigits:0})} rolled every ${Number(r.putTenor)/86400} days`,MarketCap:`$${c.toFixed(2)}`,UnitAsset:y,Holding:S,Yield:(Number(r.callMoney)/Number(r.multiplier)-1)*365/12/(Number(r.putTenor)/86400),ProfitLoss:x,NextVintageStart:L,ThisVintageEnd:new Date(m*1e3).toLocaleString(),VintageOpen:N,StartLevel:d.StartLevel,Upside:d.Upside,Downside:d.Downside,Protection:d.Protection,Tenor:r.callTenor}),o++,E.setDynamic(t,[l,S,`$${y.toFixed(2)}`,x.toLocaleString(void 0,{style:"percent",minimumFractionDigits:0}),N?"Open":"Closed",L],!1,g().length,o),n&&(f(e,!1),f(a,!1),this.setSaverInfo(s[0]),n=!1),g().length>1){const w=perpetualTable.querySelector(`tbody tr:nth-child(${o})`);w.classList.add("cursor"),w.addEventListener("click",()=>{this.setSaverInfo(s[w.dataset.id-1])},!1)}g().length===o&&this.globals.btnRefresh.classList.remove("hide"),console.log("Success!!! Row:",o,i)}catch{if(g().length>parseInt(t.querySelectorAll("tbody tr").length)){console.log("Failed!!! Row:",o+1,i);const l=setTimeout(()=>{p(),clearTimeout(l)},2500)}}};p()})},setSaverInfo(e){const a=document.querySelector(".saver-info-content");if(!e){a.textContent="";return}a.innerHTML=`
            <div class="saver-row">
                <div class="saver-col">
                    <div class="header-title m-b-24">${e.Name}</div>
                    <div class="saver-content">
                        <div class="info">
                            <p class="m-b-20">${e.Description}</p>
                            <p>Vintage reopened at ${e.ThisVintageEnd}</p>
                        </div>

                        <div class="percentage-bar-multi">
                            <div class="pbm-progress">
                                <div class="pbm-top">
                                    <div class="pbm-progressbar"></div>
                                    <div class="pbm-value size-sm"><span>${e.ProfitLoss.toLocaleString(void 0,{style:"percent",minimumFractionDigits:0})}</span> P&L</div>
                                </div>
                                <div class="pbm-bottom">
                                    <div class="pbm-progressbar"></div>
                                    <div class="pbm-value size-sm"><span>${e.Yield.toLocaleString(void 0,{style:"percent",minimumFractionDigits:0})}</span> MPY</div>
                                </div>
                            </div>
                        </div>
                        <div class="percentage-bar-text align-center word-nowrap white-50">
                            <p>Current Holding = ${e.Holding}</p>
                        </div>
                    </div>
                </div>
                <div class="saver-col">
                    <!-- <div class="chart-comparison-legends size-sm white-50">
                        <div class="ccl-legend">${$()}</div>
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
                </div>`),F.createChart({elem:a.querySelector(".chart-comparison"),endpoint1:`https://api.binance.com/api/v3/klines?symbol=${$()}${C()}T&interval=12h&limit=${Math.ceil(e.Tenor/3600)}`,endpoint2:`https://api.binance.com/api/v3/klines?symbol=TKOUSDT&interval=12h&limit=${Math.ceil(e.Tenor/3600)}`,linedata:[e.StartLevel,e.Upside,e.Protection]}),q.progressBar(a.querySelector(".percentage-bar-multi"),e.ProfitLoss/e.Yield*100,100),e.VintageOpen&&(a.querySelector(".js-save").addEventListener("click",t=>{t.preventDefault(),this.setPopupInfo({type:"save",title:"Top up to vault",data:e,amount:parseFloat(document.querySelector("input[name='usdc-amount']").value)})},!1),a.querySelector(".js-withdraw").addEventListener("click",t=>{t.preventDefault(),this.setPopupInfo({type:"withdraw",title:"Withdraw from vault",data:e,amount:parseFloat(document.querySelector("input[name='usdc-amount']").value)})},!1))},setPopupInfo(e){console.log(e);let a=e.data.UnitAsset==0?e.amount:e.amount/e.data.UnitAsset;const t=[{name:"Name:",span:e.data.Name},{name:"Address:",span:e.data.Address},{name:"Unit price",span:`$${e.data.UnitAsset}`},{name:"Units:",span:`${a.toFixed(2)} ${e.data.Symbol}`},{name:"Trade value:",span:`$${e.amount.toFixed(2)}`}];I(e.title,A(t,"investinsavers")),this.executeTrade(e.type,e.data.Address,e.amount,a)},executeTrade(e,a,t,s){const n=document.createElement("div");n.className="executetrade",document.querySelector(".overlay-popup .op-content").appendChild(n);let o="blue";e==="save"?o="green":e==="withdraw"&&(o="pink");const i=document.createElement("a");i.setAttribute("href","#"),i.className=`btn btn-${o}`,i.textContent="Execute",n.appendChild(i),i.addEventListener("click",async T=>{T.preventDefault(),i.remove();const p=document.createElement("div");p.className="await-approval",p.textContent="Awaiting for allowance approval";const l=document.createElement("div");l.className="await-approval-timer",l.textContent="00:00",p.appendChild(l),n.appendChild(p);const u=document.createElement("div");u.className="await-trade",u.textContent="Awaiting for transaction";const c=document.createElement("div");c.className="await-trade-timer",c.textContent="00:00",u.appendChild(c),n.appendChild(u),this.executeTradeTimer(l,120);const h="Warning: Transaction has failed.",b=await D(e,a,t,s);console.log("approve finished",b),b==="failure"?this.executeTradeFailure(n,h):(p.classList.add("await-active"),p.textContent="Allowance approved.",l.remove(),this.clearTradeTimer(),setTimeout(async()=>{this.executeTradeTimer(c,e==="propose"?300:120),console.log("prior to trade",e,a,t,s);const r=await k(e,a,t,s);if(console.log("trade finished",r),r==="")this.executeTradeFailure(n,h);else{u.classList.add("await-active"),u.textContent="Transaction mined.",c.remove(),this.clearTradeTimer();const d=document.createElement("div");d.className="approve-trade-link";const m=document.createElement("a");m.setAttribute("href",r),m.setAttribute("target","_blank"),m.className="link-arrow",m.textContent="View on Polygonscan",d.appendChild(m),n.appendChild(d)}},500))},!1)},executeTradeFailure(e,a){const t=document.createElement("div");t.className="await-failure";const s=document.createElement("div");s.className="warning-icon";const n=document.createElement("div");n.className="warning-text",n.textContent=a,t.appendChild(s),t.appendChild(n),e.appendChild(t)},executeTradeTimer(e,a){const t=n=>n>9?n:`0${n}`;let s=0;this.globals.execIntervalId=setInterval(()=>{s++,s>a?(this.executeTradeFailure(document.querySelector(".overlay-popup .executetrade"),"Warning: Transaction has taking longer than normal to be mined. You can close the window and try to trade again."),this.clearTradeTimer()):e.textContent=`${t(parseInt(s/60))}:${t(s%60)}`},1e3)},clearTradeTimer(){clearInterval(this.globals.execIntervalId),this.globals.execIntervalId=null,console.log("clearTradeTimer()")}};export{U as default};
