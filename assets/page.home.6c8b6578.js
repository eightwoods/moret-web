import{a as r}from"./main.bc7e1bdb.js";var m={globals:{elem:document.querySelector("main.home")},init(){this.globals.elem.querySelectorAll("section").forEach((t,p)=>{const s=new IntersectionObserver(u=>{u.forEach(c=>{if(c.intersectionRatio){t.style.opacity=1;const n=t.querySelector(".header .title"),d=t.querySelector(".header .introcopy"),e=r.timeline(),o="power4.out";switch(e.from(n,{opacity:0,x:-200,duration:1,ease:o,delay:p>0?0:.5}),e.from(d,{opacity:0,x:-200,duration:1,ease:o},"-=1"),t.className){case"hero":const a=t.querySelector(".btn"),y=t.querySelector(".btn span");r.set(a,{opacity:0,scale:0,width:44,height:44,borderRadius:"50%",padding:0}),r.set(y,{opacity:0}),e.from(t.querySelector("img"),{opacity:0,x:200,duration:1,ease:o},"-=1"),e.to(a,{opacity:1,scale:1},"-=1"),e.to(a,{borderRadius:"8px",padding:"10px 26px"},"-=0.5"),e.to(a,{width:"auto"}),e.to(y,{opacity:1,duration:1},"-=0.5");break;case"features":e.from(t.querySelector("img"),{opacity:0,x:200,duration:1,ease:o},"-=1"),e.from(t.querySelectorAll(".list"),{opacity:0,x:200,stagger:.1},"-=1");break;case"option-trading":e.from(t.querySelector("img"),{opacity:0,x:200,duration:1,ease:o},"-=1");break;case"volatility-tokens":e.from(t.querySelectorAll(".list"),{opacity:0,x:200,stagger:.1},"-=1"),e.from(t.querySelectorAll(".token-item"),{opacity:0,x:200,stagger:.1},"-=0.75");break;case"governance-tokens":const l=t.querySelectorAll(".list p"),i=t.querySelectorAll(".list span");r.set(l,{width:46,height:56}),r.set(i,{display:"none",opacity:0}),e.from(t.querySelectorAll(".list"),{opacity:0,y:200,stagger:.1},"-=1"),e.to(i,{display:"block"},"-=1"),e.to(l,{width:"auto"}),e.to(l,{height:"auto"}),e.to(i,{opacity:1},"-=0.5");break;case"partners":e.from(t.querySelectorAll("li"),{opacity:0,x:200,stagger:.1},"-=1");break}s.unobserve(c.target)}})},{threshold:.5});s.observe(t)})}};export{m as default};
