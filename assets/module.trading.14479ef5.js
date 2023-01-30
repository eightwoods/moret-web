import{t as p,d as v,e as d,f as u,h as f,i as m,j as h,g as k}from"./main.8a35641f.js";var E={globals:{elem:document.querySelector(".trading"),refreshDuration:15e3,elSidenav:null},init(){this.elSidenav=this.globals.elem.querySelector(".sidenav"),this.headerMenu(),this.sideNav(this.elSidenav),this.sideNavRefreshPrice(this.elSidenav),this.sideNavLimiteView(this.elSidenav),this.animateEachPanel()},headerMenu(){const t=window.location.pathname.replace("/","").replace(".html","");this.globals.elem.parentElement.querySelectorAll(".nav-contents .items li").forEach(n=>{const a=n.querySelector("a").getAttribute("href").replace(".html","");t.includes(a)&&n.querySelector("a").classList.add("btn-border-active")})},sideNav(t){t.textContent="",t.setAttribute("sidenav-activechange","");const e=document.createElement("div");e.className="token-main",t.appendChild(e);const n=document.createElement("div");n.className="token-info",e.appendChild(n);const a=document.createElement("div");a.className="token-arrow",e.appendChild(a);const s=document.createElement("div");s.className="token-contents",t.appendChild(s);const i=document.createElement("div");i.className="token-list",s.appendChild(i);const o=document.createElement("div");o.className="token-info",i.appendChild(o),this.sideNavItem(n,{token:p(),price:v(),address:d()},!1),u.forEach((c,r)=>{c.address!==d()&&this.sideNavItem(o,c)})},sideNavSearch(t){const e=document.createElement("div");e.className="input-search",t.appendChild(e);const n=document.createElement("input");n.setAttribute("type","search"),n.setAttribute("name","s"),n.setAttribute("placeholder","Search"),n.className="size-sm",e.appendChild(n)},async sideNavItem(t,e,n=!0){const a=document.createElement("div");a.className="info-item",t.appendChild(a);const s=document.createElement("div");s.className="token-content-wrapper",a.appendChild(s);const i=document.createElement("div");i.className="token-content",s.appendChild(i);const o=document.createElement("div");o.className="token-icon",i.appendChild(o);const c=document.createElement("img");c.src=f(`icon_${e.token.toLowerCase()}.svg`),o.appendChild(c);const r=document.createElement("div");r.className="token-name",r.textContent=`${e.token} - ${e.price}`,i.appendChild(r);const l=document.createElement("div");l.className="token-price align-right",l.setAttribute("data-address",e.address),l.textContent=await m(e.address),a.appendChild(l),n&&a.addEventListener("click",()=>{localStorage.removeItem(h),localStorage.setItem(h,JSON.stringify(e)),this.sideNav(this.elSidenav),this.sideNavLimiteView(this.elSidenav)})},sideNavRefreshPrice(t){let e=null;const n=()=>{e=setInterval(()=>{t.setAttribute("sidenav-refreshprice",""),t.querySelectorAll(".token-price").forEach(async s=>{try{s.textContent=await m(s.dataset.address)}catch{console.log("error refreshTokenPrice()",s)}})},this.globals.refreshDuration)},a=()=>{clearInterval(e),e=null};n(),document.addEventListener("visibilitychange",()=>{document.hidden?a():n()})},sideNavLimiteView(t){const e=t.querySelector(".token-arrow"),n=t.querySelector(".token-list"),a=n.querySelectorAll(".info-item"),s=3;if(e.addEventListener("click",()=>{t.classList.contains("sidenav-mobile-active")?t.classList.remove("sidenav-mobile-active"):t.classList.add("sidenav-mobile-active")},!1),a.forEach((i,o)=>{o>s-1&&i.classList.add("hide-important")}),a.length>s){const i=document.createElement("div");i.className="token-viewmore",n.appendChild(i);const o=document.createElement("a");o.setAttribute("href","#"),o.className="btn btn-white btn-viewmore size-sm",o.textContent="View more",i.appendChild(o),o.addEventListener("click",c=>{c.preventDefault(),a.forEach(r=>r.classList.remove("hide-important")),i.remove()},!1)}},animateEachPanel(){this.globals.elem.querySelectorAll(".animate-panel").forEach((t,e)=>{const n=new IntersectionObserver(a=>{a.forEach(s=>{s.intersectionRatio&&(t.style.opacity=1,k.timeline().from(t,{opacity:0,y:200,delay:e*.1}),n.unobserve(s.target))})},{threshold:.25});n.observe(t)})}};export{E as default};
