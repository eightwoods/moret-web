var s={globals:{elem:document.querySelector(".governance")},init(){const t={childList:!0,attributes:!0,attributeFilter:["sidenav-activechange","sidenav-refreshprice"]};new MutationObserver(a=>{console.log("sidenav has changed from Governance!");for(let e of a)if(e.type==="attributes")switch(e.attributeName){}this.globals.init=!1}).observe(this.globals.elem.querySelector(".sidenav"),t)}};export{s as default};
