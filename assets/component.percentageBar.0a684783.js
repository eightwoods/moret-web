import{g as a}from"./index.2d9ac2c0.js";var i={globals:{elem:document.querySelectorAll(".percentage-bar"),easing:"none",duration:1.5},init(){this.globals.elem.forEach(e=>{const t=new IntersectionObserver(o=>{o.forEach(r=>{r.intersectionRatio&&(this.progressBar(e,e.dataset.initValue),t.unobserve(r.target))})},{threshold:.5});t.observe(e)})},progressBar(e,t){const o=e.querySelector(".pb-progressbar");a.to(o,{width:`${t}%`,ease:this.globals.easing,duration:this.globals.duration}),this.countPercent(e,t)},countPercent(e,t){const o=e.querySelector(".pb-text-value"),s={val:o.textContent.replace("%","")};a.to(s,{val:t,ease:this.globals.easing,duration:this.globals.duration,onUpdate:function(){o.textContent=`${s.val.toFixed(0)}%`}})}};export{i as default};
