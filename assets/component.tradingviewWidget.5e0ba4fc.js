import{t as a,a as i}from"./main.825986c3.js";var l={globals:{elem:document.querySelector(".tradingview-widget-wrapper"),exchange:"BINANCE"},init(){const e=document.createElement("script");e.setAttribute("async",""),e.setAttribute("src","https://s3.tradingview.com/tv.js"),document.head.appendChild(e)},createGraph(){this.globals.elem.textContent="",setTimeout(()=>{const e=document.createElement("div");e.className="tradingview-widget-container",this.globals.elem.appendChild(e);const n=document.createElement("div");n.id="tradingview_graph",e.appendChild(n);const t=document.createElement("div");t.className="tradingview-widget-copyright",t.innerHTML=`<a href="https://www.tradingview.com/symbols/${a()}${i()}/?exchange=${this.globals.exchange}" rel="noopener" target="_blank">
                <span class="blue-text">${a()}${i()} Chart</span>
            </a> by TradingView`,e.appendChild(t),new TradingView.widget({width:"100%",height:"100%",symbol:`${this.globals.exchange}:${a()}${i()}`,interval:"D",timezone:"Etc/UTC",theme:"dark",style:"1",locale:"en",toolbar_bg:"#f1f3f6",hide_legend:!0,enable_publishing:!1,hide_top_toolbar:!0,hide_side_toolbar:!0,allow_symbol_change:!1,container_id:"tradingview_graph"})},500)}};export{l as default};
