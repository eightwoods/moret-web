import{g as l,b as u,n as i}from"./main.41f8fcd9.js";var b={globals:{elem:document.querySelector("header")},init(){const t=new IntersectionObserver(s=>{s.forEach(e=>{if(e.intersectionRatio){this.globals.elem.classList.add("show-opacity");const y=this.globals.elem.querySelector(".logo"),r=this.globals.elem.querySelector(".menu"),n=this.globals.elem.querySelectorAll(".items li"),a=this.globals.elem.querySelectorAll(".social .btn-social"),c=this.globals.elem.querySelector(".icon-account"),m=this.globals.elem.querySelector(".button"),o=l.timeline();o.from(y,{opacity:0,x:200,delay:.2}),window.innerWidth<u.lgmd?r&&o.from(r,{opacity:0,x:200},"-=0.25"):(n&&o.from(n,{opacity:0,x:200,stagger:.1},"-=0.25"),a&&o.from(a,{opacity:0,x:200,stagger:.1},"-=0.25"),c&&o.from(c,{opacity:0,x:200},"-=0.25"),m&&o.from(m,{opacity:0,x:200},"-=0.25")),t.unobserve(e.target)}})},{threshold:.25});t.observe(this.globals.elem),this.setEvents()},setEvents(){if(document.querySelector(".no-access"))return!1;const t=this.globals.elem.querySelector(".js-menuOpen"),s=this.globals.elem.querySelector(".js-menuClose"),e=this.globals.elem.querySelector(".menuPopup");t.addEventListener("click",()=>{l.fromTo(e,{opacity:0},{display:"block",opacity:1}),i()}),s.addEventListener("click",()=>{l.fromTo(e,{opacity:1},{display:"none",opacity:0}),i(!1)}),window.addEventListener("resize",()=>{window.innerWidth>=u.md&&e.hasAttribute("style")&&(e.removeAttribute("style"),i(!1))})}};export{b as default};
