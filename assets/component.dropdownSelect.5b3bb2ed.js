import{B as u,c as o}from"./web3.df24fb58.js";import m from"./component.toggleSwitches.d31686b5.js";import"./main.7b461383.js";var d={globals:{elem:document.querySelectorAll(".dropdown-select")},init(){this.globals.elem.forEach(e=>{const s=e.querySelector(".ds-btn"),a=e.querySelector("input[name='info-amount']");let l=!1;if(a){const t=()=>{l=!1,s.parentElement.classList.remove("active")};a.addEventListener("click",i=>{l=!0,e.querySelectorAll("li").forEach(n=>n.classList.remove("info-active")),i.target.value===""&&this.valueFromInputField(e,0)},!1),a.addEventListener("blur",i=>{t()},!1),a.addEventListener("keyup",async i=>{let n=i.target.value;i.target.value===""&&(n=0),this.valueFromInputField(e,n)},!1),a.addEventListener("keydown",i=>{i.keyCode==13&&i.target.value!==""&&(t(),e.setAttribute("dds-selected",0),e.setAttribute("dds-updated",""))},!1)}s.addEventListener("click",()=>{s.parentElement.classList.contains("active")?s.parentElement.classList.remove("active"):s.parentElement.classList.add("active")},!1),s.addEventListener("blur",()=>{setTimeout(()=>{l||s.parentElement.classList.remove("active")},500)},!1),this.eventListItems(e)})},async createListItems(e,s,a=!0,l=!1){const t=e.querySelector(".info-list");t.textContent="";const i=await s;if(i.forEach((n,c)=>{const r=document.createElement("li");r.textContent=n,a?c<1&&(r.className="info-active"):e.hasAttribute("dds-selected")?parseInt(e.getAttribute("dds-selected"))===c+1&&(r.className="info-active"):u(i.length).div(2).round().toNumber()===c+1&&(r.className="info-active"),t.appendChild(r)}),this.eventListItems(e),l){const n=e.querySelector("input[name='info-amount']");n&&(n.value="")}},eventListItems(e){this.valueFromListItem(e);const s=e.querySelectorAll("li");s.forEach((a,l)=>{a.addEventListener("click",()=>{const t=e.querySelector("input[name='info-amount']");t&&(t.value=""),s.forEach(i=>i.classList.remove("info-active")),a.classList.add("info-active"),this.valueFromListItem(e),e.setAttribute("dds-selected",l+1),e.setAttribute("dds-updated","")},!1)})},valueFromListItem(e){e.querySelectorAll("li").forEach(a=>{if(a.classList.contains("info-active")){const[l,t]=a.textContent.split("|");e.querySelector(".ds-value1").textContent=l,e.querySelector(".ds-value2").textContent=t}})},async valueFromInputField(e,s){e.querySelector(".ds-value1").textContent=s;const a=m.getActiveItem(document.querySelector(".opt-callput")).toLowerCase()==="call";e.querySelector(".ds-value2").textContent=await o(null,s,a)},async insertValues(e,s,a=!1,l=!1){new Promise((t,i)=>{setTimeout(()=>{t([e.querySelector(".ds-value1").textContent,e.querySelector(".ds-value2").textContent])},500)}).then(t=>{let i=`${t[0].trim()} (${t[1].trim()})`;a?i=t[0].trim():l&&(i=t[1].trim()),s.textContent=i}).catch(t=>console.warn(t))}};export{d as default};