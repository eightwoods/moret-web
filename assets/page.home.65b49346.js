import{g as a}from"./index.2d9ac2c0.js";var m={globals:{elem:document.querySelector("main.home")},init(){this.tokens(),this.globals.elem.querySelectorAll("section").forEach((e,o)=>{const s=new IntersectionObserver(i=>{i.forEach(y=>{if(y.intersectionRatio){e.style.opacity=1;const u=e.querySelector(".header .title"),d=e.querySelector(".header .introcopy"),t=a.timeline(),r="power4.out";switch(t.from(u,{opacity:0,x:-200,duration:1,ease:r,delay:o>0?0:.5}),t.from(d,{opacity:0,x:-200,duration:1,ease:r},"-=1"),e.className){case"hero":const l=e.querySelector(".btn"),p=e.querySelector(".btn span");a.set(l,{opacity:0,scale:0,width:44,height:44,borderRadius:"50%",padding:0}),a.set(p,{opacity:0}),t.from(e.querySelector("img"),{opacity:0,x:200,duration:1,ease:r},"-=1"),t.to(l,{opacity:1,scale:1},"-=1"),t.to(l,{borderRadius:"8px",padding:"10px 26px"},"-=0.5"),t.to(l,{width:"auto"}),t.to(p,{opacity:1,duration:1},"-=0.5");break;case"features":t.from(e.querySelector("img"),{opacity:0,x:200,duration:1,ease:r},"-=1"),t.from(e.querySelectorAll(".list"),{opacity:0,x:200,stagger:.1},"-=1");break;case"option-trading":t.from(e.querySelector("img"),{opacity:0,x:200,duration:1,ease:r},"-=1");break;case"volatility-tokens":t.from(e.querySelectorAll(".list"),{opacity:0,x:200,stagger:.1},"-=1"),t.from(e.querySelectorAll(".token-item"),{opacity:0,x:200,stagger:.1},"-=0.75");break;case"governance-tokens":const c=e.querySelectorAll(".list p"),n=e.querySelectorAll(".list span");a.set(c,{width:46,height:56}),a.set(n,{display:"none",opacity:0}),t.from(e.querySelectorAll(".list"),{opacity:0,y:200,stagger:.1},"-=1"),t.to(n,{display:"block"},"-=1"),t.to(c,{width:"auto"}),t.to(c,{height:"auto"}),t.to(n,{opacity:1},"-=0.5");break;case"partners":t.from(e.querySelectorAll("li"),{opacity:0,x:200,stagger:.1},"-=1");break}s.unobserve(y.target)}})},{threshold:.5});s.observe(e)})},tokens(){const e=this.globals.elem.querySelectorAll(".tokens .token-item");e.forEach(o=>{o.querySelector(".token-btn").addEventListener("click",()=>{o.classList.contains("active")?o.classList.remove("active"):(e.forEach(i=>i.classList.remove("active")),o.classList.add("active"))},!1)})}};export{m as default};