import{b as n,a}from"./main.831294b5.js";var d={globals:{elem:document.querySelectorAll(".comp-tables"),limitrows:6},init(){this.globals.elem.forEach(t=>{this.swipeArrows(t),this.sortableHeaders(t),t.dataset.limitview==="button"&&this.limitViewButton(t),t.dataset.limitview==="scroll"&&this.limitViewScroll(t),this.hasScroll(t),window.addEventListener("resize",()=>{this.hasScroll(t)})})},swipeArrows(t){if(!n()){const r=t.querySelector(".table-container"),s=document.createElement("div");s.className="table-arrowleft",t.appendChild(s);const e=document.createElement("div");e.className="table-arrowright",t.appendChild(e),s.addEventListener("click",()=>{a.to(r,{scrollLeft:"-=100",ease:"none"})},!1),e.addEventListener("click",()=>{a.to(r,{scrollLeft:"+=100",ease:"none"})},!1)}},hasScroll(t){const r=t.querySelector(".table-container").offsetWidth;t.querySelector("table").offsetWidth>r?t.setAttribute("data-has-scroll",!0):t.setAttribute("data-has-scroll",!1)},limitViewButton(t){const r=t.querySelectorAll("tbody tr"),s=this.globals.limitrows;if(r.forEach((e,l)=>{l>s-1&&e.classList.add("hide")}),r.length>s){const e=document.createElement("div");e.className="table-viewmore",t.appendChild(e);const l=document.createElement("a");l.setAttribute("href","#"),l.className="btn btn-white btn-viewmore size-sm",l.textContent="View more",e.appendChild(l),l.addEventListener("click",i=>{i.preventDefault(),r.forEach(o=>o.classList.remove("hide")),e.remove()},!1)}},limitViewScroll(t){const r=t.querySelectorAll("tbody tr"),s=this.globals.limitrows;r.length>s-1&&t.setAttribute("data-max-rows",!0)},sortableHeaders(t){t.querySelectorAll("thead th").forEach((s,e)=>{s.classList.contains("sortable")&&s.addEventListener("click",()=>{this.sortByColumn({table:t,index:e,flag:s.classList.contains("sort-asc")?-1:1,sortText:s.classList.contains("sort-text")})},!1)})},sortByColumn(t){const r=Array.from(t.table.querySelectorAll("tbody tr")),s=e=>{let l="";return t.sortText?l=e.querySelector(`td:nth-child(${t.index+1})`).textContent.trim().toLowerCase():e.querySelector(`td:nth-child(${t.index+1})`).dataset.unformattedValue?l=parseFloat(e.querySelector(`td:nth-child(${t.index+1})`).dataset.unformattedValue):l=parseFloat(e.querySelector(`td:nth-child(${t.index+1})`).textContent.trim()),l};r.sort((e,l)=>{const i=s(e),o=s(l);return i<o?-1*t.flag:i>o?1*t.flag:0}),t.table.querySelectorAll("th.sortable").forEach(e=>e.classList.remove("sort-asc","sort-desc")),t.table.querySelector(`th:nth-child(${t.index+1})`).classList.add(t.flag===1?"sort-asc":"sort-desc"),r.forEach(e=>{t.table.querySelector("tbody").appendChild(e)})}};export{d as default};
