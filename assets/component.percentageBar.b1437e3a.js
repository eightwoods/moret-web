import{g as r}from"./index.2d9ac2c0.js";var l={globals:{elem:document.querySelectorAll(".percentage-bar"),easing:"none",duration:1},init(){this.globals.elem.forEach(t=>{this.progressBar(t,t.dataset.initValue)})},progressBar(t,e){const a=t.querySelector(".pb-progressbar");r.to(a,{width:`${e}%`,ease:this.globals.easing,duration:this.globals.duration}),this.countPercent(t,e)},countPercent(t,e){const a=t.querySelector(".pb-text-value"),o={val:a.textContent.replace("%","")};r.to(o,{val:e,ease:this.globals.easing,duration:this.globals.duration,onUpdate:function(){a.textContent=`${o.val.toFixed(0)}%`}})}};export{l as default};