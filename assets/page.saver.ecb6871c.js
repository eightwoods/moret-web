import{k as f,u as C,v,r as D,t as N,d as I,s as k,a as E,x as A,y as F}from"./main.8a35641f.js";import q from"./component.chartComparison.2145fb22.js";import P from"./component.percentageBarMulti.56f4828c.js";var H={globals:{elem:document.querySelector(".saver")},init(){document.querySelector(".saver-list-content .js-refresh").addEventListener("click",()=>this.setSavers()),document.querySelector("body.mobile.unknown")&&this.setSavers();const e={childList:!0,attributes:!0,attributeFilter:["sidenav-activechange","sidenav-refreshprice"]};new MutationObserver(t=>{console.log("sidenav refreshed from Saver!");for(let n of t)if(n.type==="attributes")switch(n.attributeName){case"sidenav-activechange":this.setSavers();break}this.globals.init=!1}).observe(this.globals.elem.querySelector(".sidenav"),e)},setSavers(){console.log("setSavers()");const e=document.querySelector(".saver-list"),a=document.querySelector(".saver-info");f(e),f(a);const t=e.querySelector(".comp-dynamic-table");t.innerHTML=`
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
            </div>`,this.setSaverInfo(),C().then(n=>{const i=[],u=[];let m=0;n.forEach(async(s,h)=>{try{const o=await v(s,"name"),l=await v(s,"symbol"),c=await v(s,"aum"),g=await v(s,"supply"),b=await v(s,"balance"),r=await v(s,"params"),d=await v(s,"vintage"),p=await v(s,"opentime"),w=g>0?c/g:1,T=`$${(g>0?c/g*b:0).toFixed(2)}`,S=d.StartLevel>0?c/d.StartLevel-1:0,y=new Date((p+Number(r.tradeWindow))*1e3).toLocaleString(),x=p<Math.floor(Date.now()/1e3);u.push({Name:o,Symbol:l,Address:s,Description:`Soft Ceiling at ${(Number(r.callMoney)/Number(r.multiplier)).toLocaleString(void 0,{style:"percent",minimumFractionDigits:0})} rolled every ${Number(r.callTenor)/86400} days <br>Buffer range ${(Number(r.putSpread)/Number(r.multiplier)).toLocaleString(void 0,{style:"percent",minimumFractionDigits:0})} to ${(Number(r.putMoney)/Number(r.multiplier)).toLocaleString(void 0,{style:"percent",minimumFractionDigits:0})} rolled every ${Number(r.putTenor)/86400} days`,MarketCap:`$${c.toFixed(2)}`,UnitAsset:w,Holding:T,Yield:(Number(r.callMoney)/Number(r.multiplier)-1)*365/(Number(r.putTenor)/86400),ProfitLoss:S,NextVintageStart:y,ThisVintageEnd:new Date(p*1e3).toLocaleString(),VintageOpen:x,StartLevel:d.StartLevel,Upside:d.Upside,Downside:d.Downside,Protection:d.Protection,Tenor:r.callTenor}),i.push([o,T,`$${w.toFixed(2)}`,S.toLocaleString(void 0,{style:"percent",minimumFractionDigits:0}),x?"Open":"Closed",y]),m++,m===n.length&&(f(e,!1),f(a,!1),this.setSaverInfo(u[0]),D.setDynamic(t,i),n.length>1&&t.querySelectorAll("tbody tr").forEach((L,$)=>{L.classList.add("cursor"),L.addEventListener("click",()=>{this.setSaverInfo(u[$])},!1)}))}catch(o){console.error(o),console.log("Fail! refresh data load...");const l=setTimeout(()=>{this.setSavers(),clearTimeout(l)},5e3)}})}).catch(n=>{console.error(n)})},setSaverInfo(e){const a=document.querySelector(".saver-info-content");if(!e){a.textContent="";return}a.innerHTML=`
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
                        <div class="ccl-legend">${N()}</div>
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
                </div>`),q.createChart({elem:a.querySelector(".chart-comparison"),endpoint1:`https://api.binance.com/api/v3/klines?symbol=${N()}${I()}T&interval=12h&limit=${Math.ceil(e.Tenor/3600)}`,endpoint2:`https://api.binance.com/api/v3/klines?symbol=TKOUSDT&interval=12h&limit=${Math.ceil(e.Tenor/3600)}`,linedata:[e.StartLevel,e.Upside,e.Downside,e.Downside-e.Protection]}),P.progressBar(a.querySelector(".percentage-bar-multi"),e.ProfitLoss/e.Yield*100,100),e.VintageOpen&&(a.querySelector(".js-save").addEventListener("click",t=>{t.preventDefault(),this.setPopupInfo({type:"save",title:"Top up to vault",data:e,amount:parseFloat(document.querySelector("input[name='usdc-amount']").value)})},!1),a.querySelector(".js-withdraw").addEventListener("click",t=>{t.preventDefault(),this.setPopupInfo({type:"withdraw",title:"Withdraw from vault",data:e,amount:parseFloat(document.querySelector("input[name='usdc-amount']").value)})},!1))},setPopupInfo(e){console.log(e);let a=e.data.UnitAsset==0?e.amount:e.amount/e.data.UnitAsset;const t=[{name:"Name:",span:e.data.Name},{name:"Address:",span:e.data.Address},{name:"Unit price",span:`$${e.data.UnitAsset}`},{name:"Units:",span:`${a.toFixed(2)} ${e.data.Symbol}`},{name:"Trade value:",span:`$${e.amount.toFixed(2)}`}];k(e.title,E(t,"investinsavers")),this.executeTrade(e.type,e.data.Address,e.amount,a)},executeTrade(e,a,t,n){const i=document.createElement("div");i.className="executetrade",document.querySelector(".overlay-popup .op-content").appendChild(i);let u="blue";e==="save"?u="green":e==="withdraw"&&(u="pink");const m=document.createElement("a");m.setAttribute("href","#"),m.className=`btn btn-${u}`,m.textContent="Execute",i.appendChild(m),m.addEventListener("click",async s=>{s.preventDefault(),m.remove();const h=document.createElement("div");h.className="await-approval",h.textContent="Awaiting for allowance approval";const o=document.createElement("div");o.className="await-approval-timer",o.textContent="00:00",h.appendChild(o),i.appendChild(h);const l=document.createElement("div");l.className="await-trade",l.textContent="Awaiting for transaction";const c=document.createElement("div");c.className="await-trade-timer",c.textContent="00:00",l.appendChild(c),i.appendChild(l),this.executeTradeTimer(o,120);const g="Warning: Transaction has failed.",b=await A(e,a,t,n);console.log("approve finished",b),b==="failure"?this.executeTradeFailure(i,g):(h.classList.add("await-active"),h.textContent="Allowance approved.",o.remove(),this.clearTradeTimer(),setTimeout(async()=>{this.executeTradeTimer(c,e==="propose"?300:120),console.log("prior to trade",e,a,t,n);const r=await F(e,a,t,n);if(console.log("trade finished",r),r==="")this.executeTradeFailure(i,g);else{l.classList.add("await-active"),l.textContent="Transaction mined.",c.remove(),this.clearTradeTimer();const d=document.createElement("div");d.className="approve-trade-link";const p=document.createElement("a");p.setAttribute("href",r),p.setAttribute("target","_blank"),p.className="link-arrow",p.textContent="View on Polygonscan",d.appendChild(p),i.appendChild(d)}},500))},!1)},executeTradeFailure(e,a){const t=document.createElement("div");t.className="await-failure";const n=document.createElement("div");n.className="warning-icon";const i=document.createElement("div");i.className="warning-text",i.textContent=a,t.appendChild(n),t.appendChild(i),e.appendChild(t)},executeTradeTimer(e,a){const t=i=>i>9?i:`0${i}`;let n=0;this.globals.execIntervalId=setInterval(()=>{n++,n>a?(this.executeTradeFailure(document.querySelector(".overlay-popup .executetrade"),"Warning: Transaction has taking longer than normal to be mined. You can close the window and try to trade again."),this.clearTradeTimer()):e.textContent=`${t(parseInt(n/60))}:${t(n%60)}`},1e3)},clearTradeTimer(){clearInterval(this.globals.execIntervalId),this.globals.execIntervalId=null,console.log("clearTradeTimer()")}};export{H as default};
