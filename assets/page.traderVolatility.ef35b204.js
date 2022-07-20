import{f as d,h as y,s as v,j as h}from"./main.7b461383.js";import{d as x,k as b,f as T,l as g,m as w,n as f}from"./web3.df24fb58.js";import u from"./component.dropdownSelect.5b3bb2ed.js";import q from"./component.percentageBar.5a44e3db.js";import S from"./component.tables.6913cfb8.js";import m from"./component.toggleSwitches.d31686b5.js";import C from"./component.tradingviewWidget.e26bee9d.js";var O={globals:{elem:document.querySelector(".trader-volatility"),init:!0,execIntervalId:null},init(){this.optAmount(),this.optExpiry(),this.buttonTrade(),this.transactionsTable();const e={childList:!0,attributes:!0,attributeFilter:["sidenav-activechange","sidenav-refreshprice"]};new MutationObserver(n=>{console.log("sidenav refreshed from Trader Volatility!");for(let i of n)if(i.type==="attributes")switch(i.attributeName){case"sidenav-activechange":C.createGraph(),this.optPrice(),this.liquidityPool();break;case"sidenav-refreshprice":this.optPrice(),document.querySelector(".overlay-popup")&&this.optPrice(!0);break}this.globals.init=!1}).observe(this.globals.elem.querySelector(".sidenav"),e);const a={attributes:!0,attributeFilter:["ts-activechanged","dds-updated"]},o=new MutationObserver(n=>{for(let i of n)if(i.attributeName==="ts-activechanged"||i.attributeName==="dds-updated"){if(i.target.classList.contains("opt-callput")){const l=document.querySelector(".opt-strike");parseInt(l.getAttribute("dds-selected"))===0&&u.valueFromInputField(l,l.querySelector(".ds-value1").textContent),this.optStrike()}this.optPrice()}});o.observe(document.querySelector(".opt-buysell"),a),o.observe(document.querySelector(".opt-expiry"),a);const r=new MutationObserver(n=>{r.disconnect()});r.observe(document.querySelector(".opt-expiry .ds-value1"),{childList:!0})},optAmount(){document.querySelector("input[name='opt-amount']").addEventListener("keydown",t=>{t.keyCode==13&&this.optPrice()},!1)},optExpiry(){u.createListItems(document.querySelector(".opt-expiry"),x())},optPrice(e=!1){new Promise((t,a)=>{setTimeout(()=>{t({amount:this.getAmountValue(),expiry:this.getExpiryValue()})},this.globals.init?2e3:500)}).then(async t=>{const a=await b(null,d(),this.isBuy(),t.amount,t.expiry);e?(document.querySelector(".overlay-popup .to-volatility span").textContent=a.volatility,document.querySelector(".overlay-popup .to-vol-premium span").textContent=a.volpremium):(document.querySelector(".opt-price .info-volatility").textContent=a.volatility,document.querySelector(".opt-price .info-vol-premium").textContent=a.volpremium)}).catch(t=>console.warn(t))},async liquidityPool(){const e=await T();document.querySelector(".liquidity-pool .pb-price-end").textContent=e.gross,document.querySelector(".liquidity-pool .pb-price-from").textContent=e.utilized,document.querySelector(".liquidity-pool .pb-text-value").textContent=e.text,q.progressBar(document.querySelector(".liquidity-pool"),e.perc)},buttonTrade(){document.querySelector(".opt-price .btn").addEventListener("click",async t=>{t.preventDefault();const a=[{name:`${m.getActiveItem(document.querySelector(".opt-buysell"))}:`,span:`volatility token on ${d()} - ${y()}`,class:"to-buy"},{name:"Expiry:",span:"-",class:"to-expiry"},{name:"Dollar Amount:",span:this.getAmountValue(),class:"to-amount"},{name:"Implied Volatility:",span:"-",class:"to-volatility"},{name:"Volatility Token Amount:",span:"-",class:"to-vol-premium"}];v("Trade overview",h(a,"tradeoverview")),u.insertValues(document.querySelector(".opt-expiry"),document.querySelector(".overlay-popup .to-expiry span"),!0),this.optPrice(!0),setTimeout(()=>this.executeTrade(),500)})},executeTrade(){const e=document.createElement("div");e.className="executetrade",document.querySelector(".overlay-popup .op-content").appendChild(e);const t=document.createElement("a");t.setAttribute("href","#"),t.className="btn btn-blue",t.textContent="Execute",e.appendChild(t),t.addEventListener("click",async a=>{a.preventDefault(),t.remove();const o=document.createElement("div");o.className="await-approval",o.textContent="Awaiting for allowance approval";const r=document.createElement("div");r.className="await-approval-timer",r.textContent="00:00",o.appendChild(r),e.appendChild(o);const n=document.createElement("div");n.className="await-trade",n.textContent="Awaiting for transaction";const i=document.createElement("div");i.className="await-trade-timer",i.textContent="00:00",n.appendChild(i),e.appendChild(n),this.executeTradeTimer(r);const l="Warning: Transaction has failed.";await g(null,this.isBuy(),this.getAmountValue(),this.getExpiryValue())==="failure"?this.executeTradeFailure(e,l):(o.classList.add("await-active"),o.textContent="Allowance approved.",r.remove(),this.clearTradeTimer(),setTimeout(async()=>{this.executeTradeTimer(i);const p=await w(null,this.isBuy(),this.getAmountValue(),this.getExpiryValue());if(p==="")this.executeTradeFailure(e,l);else{n.classList.add("await-active"),n.textContent="Transaction mined.",i.remove(),this.clearTradeTimer();const c=document.createElement("div");c.className="approve-trade-link";const s=document.createElement("a");s.setAttribute("href",p),s.setAttribute("target","_blank"),s.className="link-arrow",s.textContent="View on Polygonscan",c.appendChild(s),e.appendChild(c)}},500))},!1)},executeTradeFailure(e,t){const a=document.createElement("div");a.className="await-failure";const o=document.createElement("div");o.className="warning-icon";const r=document.createElement("div");r.className="warning-text",r.textContent=t,a.appendChild(o),a.appendChild(r),e.appendChild(a)},executeTradeTimer(e){const t=o=>o>9?o:`0${o}`;let a=0;this.globals.execIntervalId=setInterval(()=>{a++,a>120?(this.executeTradeFailure(document.querySelector(".overlay-popup .executetrade"),"Warning: Transaction has taking longer than normal to be mined. You can close the window and try to trade again."),this.clearTradeTimer()):e.textContent=`${t(parseInt(a/60))}:${t(a%60)}`},1e3)},clearTradeTimer(){clearInterval(this.globals.execIntervalId),this.globals.execIntervalId=null,console.log("clearTradeTimer()")},transactionsTable(){f(null).then(e=>{const t=document.querySelector(".transactions .comp-dynamic-table"),a=[];e.forEach(o=>{a.push([o.Token,o.Tenor,o.Amount,o.ImpliedVolatility])}),S.setDynamic(t,a)})},isBuy(){return m.getActiveItem(document.querySelector(".opt-buysell")).toLowerCase()==="buy"},getAmountValue(){return document.querySelector("input[name='opt-amount']").value},getExpiryValue(){return document.querySelector(".opt-expiry .ds-value1").textContent.replace("Days","").replace("Day","").trim()}};export{O as default};
