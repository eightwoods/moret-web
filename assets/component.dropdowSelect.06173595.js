var r={globals:{elem:document.querySelectorAll(".dropdown-select")},init(){this.globals.elem.forEach(e=>{const t=e.querySelector(".ds-btn"),s=e.querySelectorAll("li"),a=e.querySelector("input[name='info-amount']");let i=!1;a?(this.valueFromInputField(e,a.value),a.addEventListener("click",l=>{i=!0,s.forEach(n=>n.classList.remove("info-active")),this.valueFromInputField(e,l.target.value)},!1),a.addEventListener("blur",()=>{i=!1,t.parentElement.classList.remove("active")},!1),a.addEventListener("keyup",l=>{this.valueFromInputField(e,l.target.value)},!1)):this.valueFromListItem(e),t.addEventListener("click",()=>{t.parentElement.classList.contains("active")?t.parentElement.classList.remove("active"):t.parentElement.classList.add("active")},!1),t.addEventListener("blur",()=>{setTimeout(()=>{i||t.parentElement.classList.remove("active")},100)},!1),s.forEach(l=>{l.addEventListener("click",()=>{s.forEach(n=>n.classList.remove("info-active")),l.classList.add("info-active"),this.valueFromListItem(e)},!1)})})},valueFromListItem(e){e.querySelectorAll("li").forEach(s=>{if(s.classList.contains("info-active")){const[a,i]=s.textContent.split("|"),l=e.querySelector(".ds-btn");l.querySelector(".ds-value1").textContent=a,l.querySelector(".ds-value2").textContent=i}})},valueFromInputField(e,t){const s=e.querySelector(".ds-btn");s.querySelector(".ds-value1").textContent=t,s.querySelector(".ds-value2").textContent="0%"}};export{r as default};