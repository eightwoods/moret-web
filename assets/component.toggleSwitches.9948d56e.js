var r={globals:{elem:document.querySelectorAll(".toggle-switches")},init(){this.globals.elem.forEach(e=>{parseInt(e.dataset.toggleTotal)>2?this.toggleMoreSwitches(e):this.toggle2Switches(e)})},toggle2Switches(e){this.setActiveItem(e),e.addEventListener("click",()=>{e.classList.contains("ts-active1")?this.setActiveItem(e,2):this.setActiveItem(e,1),e.setAttribute("ts-activechanged",""),e.dataset.collab&&(e.classList.contains("ts-active1")?(e.parentElement.classList.add(e.dataset.bg1),e.parentElement.classList.remove(e.dataset.bg2)):(e.parentElement.classList.add(e.dataset.bg2),e.parentElement.classList.remove(e.dataset.bg1)))},!1)},toggleMoreSwitches(e){this.setActiveItem(e),e.querySelectorAll(".ts-item").forEach((a,t)=>{a.addEventListener("click",()=>{this.setActiveItem(e,t+1),e.setAttribute("ts-activechanged","")})})},resetItems(e){this.setActiveItem(e)},setActiveItem(e,s=1){e.classList.remove("ts-active1","ts-active2","ts-active3","ts-active4"),e.classList.add(`ts-active${s}`),e.querySelectorAll(".ts-item").forEach((t,i)=>{s===i+1?t.classList.add("ts-item-active"):t.classList.remove("ts-item-active")})},getActiveItem(e,s=!1){let a=null,t=0;return e.querySelectorAll(".ts-item").forEach((c,l)=>{c.classList.contains("ts-item-active")&&(a=c.textContent,t=l)}),s?t:a}};export{r as default};
