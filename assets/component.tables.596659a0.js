import{g as r}from"./index.2d9ac2c0.js";import{m as n}from"./main.825986c3.js";var m={globals:{elem:document.querySelectorAll(".comp-tables")},init(){this.globals.elem.forEach(e=>{this.swipeArrows(e),this.limitView(e),this.hasScroll(e),window.addEventListener("resize",()=>{this.hasScroll(e)})})},swipeArrows(e){if(!n()){const s=e.querySelector(".table-container"),o=document.createElement("div");o.className="table-arrowleft",e.appendChild(o);const t=document.createElement("div");t.className="table-arrowright",e.appendChild(t),o.addEventListener("click",()=>{r.to(s,{scrollLeft:"-=100",ease:"none"})},!1),t.addEventListener("click",()=>{r.to(s,{scrollLeft:"+=100",ease:"none"})},!1)}},limitView(e){const s=e.querySelectorAll("tbody tr"),o=5;if(s.forEach((t,i)=>{i>o-1&&t.classList.add("hide")}),s.length>o){const t=document.createElement("div");t.className="table-viewmore",e.appendChild(t);const i=document.createElement("a");i.setAttribute("href","#"),i.className="btn btn-white btn-viewmore size-sm",i.textContent="View more",t.appendChild(i),i.addEventListener("click",a=>{a.preventDefault(),s.forEach(l=>l.classList.remove("hide")),t.remove()},!1)}},hasScroll(e){const s=e.querySelector(".table-container").offsetWidth;e.querySelector("table").offsetWidth>s?e.setAttribute("data-has-scroll",!0):e.setAttribute("data-has-scroll",!1)}};export{m as default};
