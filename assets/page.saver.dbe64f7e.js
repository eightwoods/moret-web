import{k as f,v as S,x as u,p as L,q as w,t as T,d as N,s as x,a as $,y as C,z as D}from"./main.21990bbd.js";import I from"./component.chartComparison.2145fb22.js";import E from"./component.percentageBarMulti.8cc65e19.js";var P={globals:{elem:document.querySelector(".saver")},init(){document.querySelector(".saver-list-content .js-refresh").addEventListener("click",()=>this.setSavers());const e={childList:!0,attributes:!0,attributeFilter:["sidenav-activechange","sidenav-refreshprice"]};new MutationObserver(t=>{console.log("sidenav refreshed from Saver!");for(let n of t)if(n.type==="attributes")switch(n.attributeName){case"sidenav-activechange":this.setSavers();break}this.globals.init=!1}).observe(this.globals.elem.querySelector(".sidenav"),e)},setSavers(){const e=document.querySelector(".saver-list"),a=document.querySelector(".saver-info");f(e),f(a);const t=e.querySelector(".comp-dynamic-table");t.innerHTML=`
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th class="sortable sort-text">Name</th>
                            <th class="sortable sort-text">Holding</th>
                            <th class="sortable">NAV</th>
                            <th class="sortable">P&L</th>
                            <th class="sortable sort-text">Status</th>
                            <th class="sortable">Next Vintage</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>`,this.setSaverInfo(),S().then(n=>{f(e,!1),f(a,!1);const i=[],o=[];n.forEach(async(r,m)=>{try{const c=await u(r,"name"),h=await u(r,"symbol"),l=await u(r,"aum"),d=await u(r,"supply"),b=await u(r,"balance"),s=await u(r,"params"),p=await u(r,"vintage"),g=await u(r,"opentime");o.push({Name:c,Symbol:h,Address:r,Description:`Soft Ceiling at ${(Number(s.callMoney)/Number(s.multiplier)).toLocaleString(void 0,{style:"percent",minimumFractionDigits:0})} rolled every ${Number(s.callTenor)/86400} days <br>Buffer range ${(Number(s.putSpread)/Number(s.multiplier)).toLocaleString(void 0,{style:"percent",minimumFractionDigits:0})} to ${(Number(s.putMoney)/Number(s.multiplier)).toLocaleString(void 0,{style:"percent",minimumFractionDigits:0})} rolled every ${Number(s.putTenor)/86400} days`,MarketCap:`$${l.toFixed(2)}`,UnitAsset:d>0?l/d:1,Holding:`$${(d>0?l/d*b:0).toFixed(2)}`,Yield:((Number(s.callMoney)/Number(s.multiplier)-1)*365/(Number(s.putTenor)/86400)).toLocaleString(void 0,{style:"percent",minimumFractionDigits:0}),ProfitLoss:p.StartLevel>0?l/p.StartLevel-1:0,NextVintageStart:new Date((g+Number(s.tradeWindow))*1e3).toLocaleString(),ThisVintageEnd:new Date(g*1e3).toLocaleString(),VintageOpen:g<Math.floor(Date.now()/1e3),StartLevel:p.StartLevel,Upside:p.Upside,Downside:p.Downside,Protection:p.Protection,Tenor:s.callTenor}),i.push([o[m].Name,o[m].Holding,`$${o[m].UnitAsset}`,o[m].ProfitLoss.toLocaleString(void 0,{style:"percent",minimumFractionDigits:0}),o[m].VintageOpen?"Open":"Closed",o[m].NextVintageStart]),m+1===n.length&&(this.setSaverInfo(o[0]),L.setDynamic(t,i),n.length>1&&t.querySelectorAll("tbody tr").forEach((v,y)=>{v.classList.add("cursor"),v.addEventListener("click",()=>{this.setSaverInfo(o[y])},!1)}))}catch(c){console.error(c),w()}})}).catch(n=>{console.error(n),w()})},setSaverInfo(e){const a=document.querySelector(".saver-info-content");if(!e){a.textContent="";return}a.innerHTML=`
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
                                    <div class="pbm-value size-sm"><span>${e.ProfitLoss}</span> P&L</div>
                                </div>
                                <div class="pbm-bottom">
                                    <div class="pbm-progressbar"></div>
                                    <div class="pbm-value size-sm"><span>${e.Yield}</span> Yield</div>
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
                        <div class="ccl-legend">${T()}</div>
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
                </div>`),I.createChart({elem:a.querySelector(".chart-comparison"),endpoint1:`https://api.binance.com/api/v3/klines?symbol=${T()}${N()}T&interval=12h&limit=${Math.ceil(e.Tenor/3600)}`,endpoint2:`https://api.binance.com/api/v3/klines?symbol=TKOUSDT&interval=12h&limit=${Math.ceil(e.Tenor/3600)}`,linedata:[e.StartLevel,e.Upside,e.Downside,e.Downside-e.Protection]}),E.progressBar(a.querySelector(".percentage-bar-multi"),e.ProfitLoss,e.Yield),e.VintageOpen&&(a.querySelector(".js-save").addEventListener("click",t=>{t.preventDefault(),this.setPopupInfo({type:"save",title:"Top up to vault",data:e,amount:parseFloat(document.querySelector("input[name='usdc-amount']").value)})},!1),a.querySelector(".js-withdraw").addEventListener("click",t=>{t.preventDefault(),this.setPopupInfo({type:"withdraw",title:"Withdraw from vault",data:e,amount:parseFloat(document.querySelector("input[name='usdc-amount']").value)})},!1))},setPopupInfo(e){console.log(e);let a=e.data.UnitAsset==0?e.amount:e.amount/e.data.UnitAsset;const t=[{name:"Name:",span:e.data.Name},{name:"Address:",span:e.data.Address},{name:"Unit price",span:`$${e.data.UnitAsset}`},{name:"Units:",span:`${a.toFixed(2)} ${e.data.Symbol}`},{name:"Trade value:",span:`$${e.amount.toFixed(2)}`}];x(e.title,$(t,"investinsavers")),this.executeTrade(e.type,e.data.Address,e.amount,a)},executeTrade(e,a,t,n){const i=document.createElement("div");i.className="executetrade",document.querySelector(".overlay-popup .op-content").appendChild(i);let o="blue";e==="save"?o="green":e==="withdraw"&&(o="pink");const r=document.createElement("a");r.setAttribute("href","#"),r.className=`btn btn-${o}`,r.textContent="Execute",i.appendChild(r),r.addEventListener("click",async m=>{m.preventDefault(),r.remove();const c=document.createElement("div");c.className="await-approval",c.textContent="Awaiting for allowance approval";const h=document.createElement("div");h.className="await-approval-timer",h.textContent="00:00",c.appendChild(h),i.appendChild(c);const l=document.createElement("div");l.className="await-trade",l.textContent="Awaiting for transaction";const d=document.createElement("div");d.className="await-trade-timer",d.textContent="00:00",l.appendChild(d),i.appendChild(l),this.executeTradeTimer(h,120);const b="Warning: Transaction has failed.",s=await C(e,a,t,n);console.log("approve finished",s),s==="failure"?this.executeTradeFailure(i,b):(c.classList.add("await-active"),c.textContent="Allowance approved.",h.remove(),this.clearTradeTimer(),setTimeout(async()=>{this.executeTradeTimer(d,e==="propose"?300:120),console.log("prior to trade",e,a,t,n);const p=await D(e,a,t,n);if(console.log("trade finished",p),p==="")this.executeTradeFailure(i,b);else{l.classList.add("await-active"),l.textContent="Transaction mined.",d.remove(),this.clearTradeTimer();const g=document.createElement("div");g.className="approve-trade-link";const v=document.createElement("a");v.setAttribute("href",p),v.setAttribute("target","_blank"),v.className="link-arrow",v.textContent="View on Polygonscan",g.appendChild(v),i.appendChild(g)}},500))},!1)},executeTradeFailure(e,a){const t=document.createElement("div");t.className="await-failure";const n=document.createElement("div");n.className="warning-icon";const i=document.createElement("div");i.className="warning-text",i.textContent=a,t.appendChild(n),t.appendChild(i),e.appendChild(t)},executeTradeTimer(e,a){const t=i=>i>9?i:`0${i}`;let n=0;this.globals.execIntervalId=setInterval(()=>{n++,n>a?(this.executeTradeFailure(document.querySelector(".overlay-popup .executetrade"),"Warning: Transaction has taking longer than normal to be mined. You can close the window and try to trade again."),this.clearTradeTimer()):e.textContent=`${t(parseInt(n/60))}:${t(n%60)}`},1e3)},clearTradeTimer(){clearInterval(this.globals.execIntervalId),this.globals.execIntervalId=null,console.log("clearTradeTimer()")}};export{P as default};
