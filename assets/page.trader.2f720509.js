import{c as s,d as n,s as c,h as p}from"./main.bc7e1bdb.js";import{a as u,b as m,d as y,e as d,f as v}from"./web3.f7bd1880.js";import l from"./component.dropdownSelect.a3bf7620.js";import h from"./component.percentageBar.2ac6f243.js";import i from"./component.toggleSwitches.8990d3da.js";import S from"./component.tradingviewWidget.0de58ba3.js";var C={globals:{elem:document.querySelector(".trader"),initObserver:!0},init(){this.optExpiry(),this.setTrade(),new MutationObserver(async a=>{console.log("sidenav has changed from Trader!"),S.createGraph(),this.optToken(),this.optStrike(),this.optPrice(),this.liquidityPool(),this.globals.initObserver=!1}).observe(this.globals.elem.querySelector(".sidenav"),{childList:!0,attributes:!1,characterData:!1}),new MutationObserver(a=>{this.globals.initObserver||this.optStrike()}).observe(document.querySelector(".opt-callput"),{childList:!1,attributes:!0,characterData:!1}),new MutationObserver(async a=>{this.globals.initObserver||this.optToken()}).observe(document.querySelector(".opt-expiry .ds-value1"),{childList:!0,attributes:!1,characterData:!1})},async optToken(){const e=document.querySelector(".opt-expiry .ds-value1").textContent.replace("Days","").replace("Day","").trim(),t=await u(null,e);document.querySelector(".opt-token .ts-token").textContent=t},optStrike(){const e=i.getActiveItem(document.querySelector(".opt-callput")).toLowerCase()==="call";l.createListItems(document.querySelector(".opt-strike"),m(null,e),!1)},optExpiry(){l.createListItems(document.querySelector(".opt-expiry"),y())},async optPrice(e=null){new Promise((t,o)=>{setTimeout(()=>{t({strike:document.querySelector(".opt-strike .ds-value1").textContent.trim(),expiry:document.querySelector(".opt-expiry .ds-value1").textContent.replace("Days","").replace("Day","").trim()})},e?500:2e3)}).then(async t=>{const o=i.getActiveItem(document.querySelector(".opt-buysell")).toLowerCase()==="buy",a=i.getActiveItem(document.querySelector(".opt-callput")).toLowerCase()==="call",r=await d(null,s(),o,a,0,t.strike,1e-5,t.expiry);e?(e.volatility.textContent=r.volatility,e.premium.textContent=r.premium,e.collateral.textContent=r.collateral):(document.querySelector(".opt-price .info-volatility").textContent=r.volatility,document.querySelector(".opt-price .info-premium").textContent=r.premium,document.querySelector(".opt-price .info-collateral").textContent=r.collateral)}).catch(t=>console.warn(t))},async liquidityPool(){const e=await v();document.querySelector(".liquidity-pool .pb-price-end").textContent=e.gross,h.progressBar(document.querySelector(".liquidity-pool"),e.perc)},setTrade(){document.querySelector(".opt-price .btn").addEventListener("click",async t=>{t.preventDefault();const o=[{name:`${i.getActiveItem(document.querySelector(".opt-buysell"))}:`,span:`call on ${s()} - ${n()}`,class:"to-buy"},{name:"Strike:",span:"-",class:"to-strike"},{name:"Expiry:",span:"-",class:"to-expiry"},{name:"Amount:",span:document.querySelector(".opt-amount input").value,class:"to-amount"},{name:"Implied Volatility:",span:"-",class:"to-volatility"},{name:"Premium:",span:"-",class:"to-premium"},{name:"Collateral:",span:"-",class:"to-collateral"}];c("Trade overview",p(o,"tradeoverview")),l.getValues(document.querySelector(".opt-strike"),document.querySelector(".overlay-popup .to-strike span")),l.getValues(document.querySelector(".opt-expiry"),document.querySelector(".overlay-popup .to-expiry span"),!0),this.optPrice({volatility:document.querySelector(".overlay-popup .to-volatility span"),premium:document.querySelector(".overlay-popup .to-premium span"),collateral:document.querySelector(".overlay-popup .to-collateral span")})})},refresh(){let e=null;const t=()=>{e=setInterval(()=>{this.optPrice()},5e3)},o=()=>{clearInterval(e),e=null};t(),document.addEventListener("visibilitychange",()=>{document.hidden?o():t()})}};export{C as default};
