import e from"./component.tradingviewWidget.a27c94b3.js";import"./main.d659a3aa.js";var s={globals:{elem:document.querySelector(".trader")},init(){new MutationObserver(t=>{console.log("sidenav has changed!"),e.createGraph()}).observe(this.globals.elem.querySelector(".sidenav"),{childList:!0,characterData:!0})}};export{s as default};