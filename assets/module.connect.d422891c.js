import{g as l}from"./index.2d9ac2c0.js";import{n as r}from"./main.8bb1ba07.js";var d={init(){this.accountsConnect(),this.accountsChanged()},createList(t,o){const n=document.createElement("ul");n.className=o;for(const e of t){const c=document.createElement("li");c.appendChild(document.createTextNode(e)),c.className=e.toLowerCase(),n.appendChild(c),c.addEventListener("click",()=>{c.classList.contains("metamask")?(console.log("metamask"),this.connectMetaMask(c)):console.log("others...")},!1)}return n},overlayPopup(t=null,o=null){r();const n=document.createElement("div");n.className="overlay-popup",document.body.appendChild(n);const e=document.createElement("div");if(e.className="op-box",n.appendChild(e),t){const a=document.createElement("div");a.className="op-title header-title m-b-24",a.textContent=t,e.appendChild(a)}const c=document.createElement("div");c.className="op-close cursor",e.appendChild(c),c.addEventListener("click",()=>{this.closeOverlayPopup()},!1);const s=document.createElement("div");s.className="op-content",s.appendChild(o),e.appendChild(s),l.from(e,{opacity:0,scale:.5})},closeOverlayPopup(){r(!1),l.to(document.querySelector(".op-box"),{opacity:0,scale:.5,duration:.35,onComplete:function(){document.querySelector(".overlay-popup").remove()}})},async connectMetaMask(t){t.textContent="Requesting...";try{await window.ethereum.request({method:"eth_requestAccounts"}).then(o=>{console.log("result",o),this.closeOverlayPopup(),this.accountsConnect()}).catch(o=>{throw console.log("eth_requestAccounts error",o),o})}catch(o){console.log("error",o)}},accountsConnect(){ethereum.request({method:"eth_accounts"}).then(t=>{const o=document.querySelector(".connection-button");if(o)if(t.length>0){o.textContent="";const n=String(t),e=document.createElement("div");e.className="in-border white-50 icon icon-account",e.textContent=`${n.substring(0,4)}...${n.substring(n.length-4)}`,o.appendChild(e)}else{const n=document.createElement("div");n.className="button",o.appendChild(n);const e=document.createElement("a");e.setAttribute("href","#"),e.className="btn btn-blue js-connectWallet",e.textContent="Connect wallet",n.appendChild(e),e.addEventListener("click",c=>{c.preventDefault();const s=["Metamask","Walletconnect","Coinbase"];this.overlayPopup("Connect Wallet",this.createList(s,"connectwallets"))},!1)}}).catch(t=>{throw console.log("eth_accounts error",t),t})},async accountsChanged(){ethereum.on("accountsChanged",()=>{ethereum.request({method:"eth_chainId"}).then(t=>{console.log("chain",t),t==137||t==80001?console.log("yes",t):(alert("You are not using Polygon chain. Please switch to Polygon network on your wallet."),console.log("Non-Polygon chain",t))})})}};export{d as default};
