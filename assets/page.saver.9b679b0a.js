import{k as b,u as f,t as $,d as C,s as I,a as D,v as k,x as E,y as v,r as F}from"./main.b1a451b8.js";import A from"./component.chartComparison.2145fb22.js";import q from"./component.percentageBarMulti.50bf6a13.js";var U={globals:{elem:document.querySelector(".saver"),btnRefresh:document.querySelector(".saver-list-content .js-refresh"),appInit:!0},init(){this.globals.btnRefresh.addEventListener("click",()=>{this.setSavers(),this.globals.btnRefresh.classList.add("hide")}),setTimeout(()=>{this.globals.appInit&&this.setSavers()},2500);const e={childList:!0,attributes:!0,attributeFilter:["sidenav-activechange","sidenav-refreshprice"]};new MutationObserver(a=>{console.log("sidenav refreshed from Saver!");for(let i of a)if(i.type==="attributes")switch(i.attributeName){case"sidenav-activechange":this.setSavers();break}}).observe(this.globals.elem.querySelector(".sidenav"),e)},setSavers(){this.globals.appInit=!1,console.log("setSavers()");const e=document.querySelector(".saver-list"),t=document.querySelector(".saver-info");b(e),b(t);const a=e.querySelector(".comp-dynamic-table");a.innerHTML=`
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
            </div>`,this.setSaverInfo();const i=[];let n=!0,o=0;f().forEach((s,T)=>{const p=async()=>{try{const l=await v(s,"name"),u=await v(s,"symbol"),c=await v(s,"aum"),h=await v(s,"supply"),g=await v(s,"balance"),r=await v(s,"params"),d=await v(s,"vintage"),m=await v(s,"opentime"),S=h>0?c/h:1,y=`$${(h>0?c/h*g:0).toFixed(2)}`,x=d.StartLevel>0?c/d.StartLevel-1:0,L=new Date((m+Number(r.tradeWindow))*1e3).toLocaleString(),N=m<Math.floor(Date.now()/1e3);if(i.push({Name:l,Symbol:u,Address:s,Description:`Soft Ceiling at ${(Number(r.callMoney)/Number(r.multiplier)).toLocaleString(void 0,{style:"percent",minimumFractionDigits:0})} rolled every ${Number(r.callTenor)/86400} days <br>Buffer range ${(Number(r.putSpread)/Number(r.multiplier)).toLocaleString(void 0,{style:"percent",minimumFractionDigits:0})} to ${(Number(r.putMoney)/Number(r.multiplier)).toLocaleString(void 0,{style:"percent",minimumFractionDigits:0})} rolled every ${Number(r.putTenor)/86400} days`,MarketCap:`$${c.toFixed(2)}`,UnitAsset:S,Holding:y,Yield:(Number(r.callMoney)/Number(r.multiplier)-1)*365/(Number(r.putTenor)/86400),ProfitLoss:x,NextVintageStart:L,ThisVintageEnd:new Date(m*1e3).toLocaleString(),VintageOpen:N,StartLevel:d.StartLevel,Upside:d.Upside,Downside:d.Downside,Protection:d.Protection,Tenor:r.callTenor}),o++,F.setDynamic(a,[l,y,`$${S.toFixed(2)}`,x.toLocaleString(void 0,{style:"percent",minimumFractionDigits:0}),N?"Open":"Closed",L],!1,f().length,o),n&&(b(e,!1),b(t,!1),this.setSaverInfo(i[0]),n=!1),f().length>1){const w=perpetualTable.querySelector(`tbody tr:nth-child(${o})`);w.classList.add("cursor"),w.addEventListener("click",()=>{this.setSaverInfo(i[w.dataset.id-1])},!1)}f().length===o&&this.globals.btnRefresh.classList.remove("hide"),console.log("Success!!! Row:",o,s)}catch{console.log("Failed!!! Row:",o+1,s);const l=setTimeout(()=>{p(),clearTimeout(l)},2500)}};p()})},setSaverInfo(e){const t=document.querySelector(".saver-info-content");if(!e){t.textContent="";return}t.innerHTML=`
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
                                    <div class="pbm-value size-sm"><span>${e.Yield.toLocaleString(void 0,{style:"percent",minimumFractionDigits:0})}</span> Yield</div>
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

            <div class="buttons-container"></div>`,e.VintageOpen&&(t.querySelector(".buttons-container").innerHTML=`
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
                </div>`),A.createChart({elem:t.querySelector(".chart-comparison"),endpoint1:`https://api.binance.com/api/v3/klines?symbol=${$()}${C()}T&interval=12h&limit=${Math.ceil(e.Tenor/3600)}`,endpoint2:`https://api.binance.com/api/v3/klines?symbol=TKOUSDT&interval=12h&limit=${Math.ceil(e.Tenor/3600)}`,linedata:[e.StartLevel,e.Upside,e.Downside,e.Downside-e.Protection]}),q.progressBar(t.querySelector(".percentage-bar-multi"),e.ProfitLoss/e.Yield*100,100),e.VintageOpen&&(t.querySelector(".js-save").addEventListener("click",a=>{a.preventDefault(),this.setPopupInfo({type:"save",title:"Top up to vault",data:e,amount:parseFloat(document.querySelector("input[name='usdc-amount']").value)})},!1),t.querySelector(".js-withdraw").addEventListener("click",a=>{a.preventDefault(),this.setPopupInfo({type:"withdraw",title:"Withdraw from vault",data:e,amount:parseFloat(document.querySelector("input[name='usdc-amount']").value)})},!1))},setPopupInfo(e){console.log(e);let t=e.data.UnitAsset==0?e.amount:e.amount/e.data.UnitAsset;const a=[{name:"Name:",span:e.data.Name},{name:"Address:",span:e.data.Address},{name:"Unit price",span:`$${e.data.UnitAsset}`},{name:"Units:",span:`${t.toFixed(2)} ${e.data.Symbol}`},{name:"Trade value:",span:`$${e.amount.toFixed(2)}`}];I(e.title,D(a,"investinsavers")),this.executeTrade(e.type,e.data.Address,e.amount,t)},executeTrade(e,t,a,i){const n=document.createElement("div");n.className="executetrade",document.querySelector(".overlay-popup .op-content").appendChild(n);let o="blue";e==="save"?o="green":e==="withdraw"&&(o="pink");const s=document.createElement("a");s.setAttribute("href","#"),s.className=`btn btn-${o}`,s.textContent="Execute",n.appendChild(s),s.addEventListener("click",async T=>{T.preventDefault(),s.remove();const p=document.createElement("div");p.className="await-approval",p.textContent="Awaiting for allowance approval";const l=document.createElement("div");l.className="await-approval-timer",l.textContent="00:00",p.appendChild(l),n.appendChild(p);const u=document.createElement("div");u.className="await-trade",u.textContent="Awaiting for transaction";const c=document.createElement("div");c.className="await-trade-timer",c.textContent="00:00",u.appendChild(c),n.appendChild(u),this.executeTradeTimer(l,120);const h="Warning: Transaction has failed.",g=await k(e,t,a,i);console.log("approve finished",g),g==="failure"?this.executeTradeFailure(n,h):(p.classList.add("await-active"),p.textContent="Allowance approved.",l.remove(),this.clearTradeTimer(),setTimeout(async()=>{this.executeTradeTimer(c,e==="propose"?300:120),console.log("prior to trade",e,t,a,i);const r=await E(e,t,a,i);if(console.log("trade finished",r),r==="")this.executeTradeFailure(n,h);else{u.classList.add("await-active"),u.textContent="Transaction mined.",c.remove(),this.clearTradeTimer();const d=document.createElement("div");d.className="approve-trade-link";const m=document.createElement("a");m.setAttribute("href",r),m.setAttribute("target","_blank"),m.className="link-arrow",m.textContent="View on Polygonscan",d.appendChild(m),n.appendChild(d)}},500))},!1)},executeTradeFailure(e,t){const a=document.createElement("div");a.className="await-failure";const i=document.createElement("div");i.className="warning-icon";const n=document.createElement("div");n.className="warning-text",n.textContent=t,a.appendChild(i),a.appendChild(n),e.appendChild(a)},executeTradeTimer(e,t){const a=n=>n>9?n:`0${n}`;let i=0;this.globals.execIntervalId=setInterval(()=>{i++,i>t?(this.executeTradeFailure(document.querySelector(".overlay-popup .executetrade"),"Warning: Transaction has taking longer than normal to be mined. You can close the window and try to trade again."),this.clearTradeTimer()):e.textContent=`${a(parseInt(i/60))}:${a(i%60)}`},1e3)},clearTradeTimer(){clearInterval(this.globals.execIntervalId),this.globals.execIntervalId=null,console.log("clearTradeTimer()")}};export{U as default};
