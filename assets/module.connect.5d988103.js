import{g as s}from"./index.2d9ac2c0.js";import{n as d}from"./main.73422f6a.js";var r={init(){document.querySelector(".js-connectWallet").addEventListener("click",a=>{a.preventDefault();const e=["Metamask","Walletconnect","Coinbase"];this.overlayPopup("Connect Wallet",this.createList(e,"connectwallets"))},!1)},createList(o,a){const e=document.createElement("ul");e.className=a;for(const t of o){const n=document.createElement("li");n.appendChild(document.createTextNode(t)),e.appendChild(n)}return e},overlayPopup(o=null,a=null){d();const e=document.createElement("div");e.className="overlay-popup",document.body.appendChild(e);const t=document.createElement("div");if(t.className="op-box",e.appendChild(t),o){const c=document.createElement("div");c.className="op-title header-title m-b-24",c.textContent=o,t.appendChild(c)}const n=document.createElement("div");n.className="op-close cursor",t.appendChild(n),n.addEventListener("click",()=>{d(!1),s.to(t,{opacity:0,scale:.5,duration:.35,onComplete:function(){e.remove()}})},!1);const l=document.createElement("div");l.className="op-content",l.appendChild(a),t.appendChild(l),s.from(t,{opacity:0,scale:.5})}};export{r as default};
