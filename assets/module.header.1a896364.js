import{g as l}from"./index.2d9ac2c0.js";import{b as n,n as i}from"./main.a62db04f.js";var p={globals:{elem:document.querySelector("header")},init(){const t=new IntersectionObserver(s=>{s.forEach(e=>{if(e.intersectionRatio){this.globals.elem.classList.add("show-opacity");const a=this.globals.elem.querySelector(".logo"),c=this.globals.elem.querySelector(".menu"),m=this.globals.elem.querySelectorAll(".items li"),r=this.globals.elem.querySelectorAll(".social .btn-social"),u=this.globals.elem.querySelector(".button"),o=l.timeline();o.from(a,{opacity:0,x:200,delay:.2}),window.innerWidth<n.lgmd?o.from(c,{opacity:0,x:200},"-=0.25"):(o.from(m,{opacity:0,x:200,stagger:.1},"-=0.25"),r&&o.from(r,{opacity:0,x:200,stagger:.1},"-=0.25"),o.from(u,{opacity:0,x:200},"-=0.5")),t.unobserve(e.target)}})},{threshold:.5});t.observe(this.globals.elem),this.setEvents()},setEvents(){const t=this.globals.elem.querySelector(".js-menuOpen"),s=this.globals.elem.querySelector(".js-menuClose"),e=this.globals.elem.querySelector(".menuPopup");t.addEventListener("click",()=>{l.fromTo(e,{opacity:0},{display:"block",opacity:1}),i()}),s.addEventListener("click",()=>{l.fromTo(e,{opacity:1},{display:"none",opacity:0}),i(!1)}),window.addEventListener("resize",()=>{window.innerWidth>=n.md&&e.hasAttribute("style")&&(e.removeAttribute("style"),i(!1))})}};export{p as default};
