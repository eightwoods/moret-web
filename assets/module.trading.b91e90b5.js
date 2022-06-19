import{g as O}from"./index.2d9ac2c0.js";import{t as D,a as V,c as $,d as T,e as M}from"./main.601bbad0.js";var W=20,z=1,g=1e6,q=1e6,U=-7,F=21,H=!1,C="[big.js] ",w=C+"Invalid ",I=w+"decimal places",J=w+"rounding mode",j=C+"Division by zero",f={},d=void 0,X=/^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;function B(){function e(t){var r=this;if(!(r instanceof e))return t===d?B():new e(t);if(t instanceof e)r.s=t.s,r.e=t.e,r.c=t.c.slice();else{if(typeof t!="string"){if(e.strict===!0&&typeof t!="bigint")throw TypeError(w+"value");t=t===0&&1/t<0?"-0":String(t)}Y(r,t)}r.constructor=e}return e.prototype=f,e.DP=W,e.RM=z,e.NE=U,e.PE=F,e.strict=H,e.roundDown=0,e.roundHalfUp=1,e.roundHalfEven=2,e.roundUp=3,e}function Y(e,t){var r,i,n;if(!X.test(t))throw Error(w+"number");for(e.s=t.charAt(0)=="-"?(t=t.slice(1),-1):1,(r=t.indexOf("."))>-1&&(t=t.replace(".","")),(i=t.search(/e/i))>0?(r<0&&(r=i),r+=+t.slice(i+1),t=t.substring(0,i)):r<0&&(r=t.length),n=t.length,i=0;i<n&&t.charAt(i)=="0";)++i;if(i==n)e.c=[e.e=0];else{for(;n>0&&t.charAt(--n)=="0";);for(e.e=r-i-1,e.c=[],r=0;i<=n;)e.c[r++]=+t.charAt(i++)}return e}function E(e,t,r,i){var n=e.c;if(r===d&&(r=e.constructor.RM),r!==0&&r!==1&&r!==2&&r!==3)throw Error(J);if(t<1)i=r===3&&(i||!!n[0])||t===0&&(r===1&&n[0]>=5||r===2&&(n[0]>5||n[0]===5&&(i||n[1]!==d))),n.length=1,i?(e.e=e.e-t+1,n[0]=1):n[0]=e.e=0;else if(t<n.length){if(i=r===1&&n[t]>=5||r===2&&(n[t]>5||n[t]===5&&(i||n[t+1]!==d||n[t-1]&1))||r===3&&(i||!!n[0]),n.length=t--,i)for(;++n[t]>9;)n[t]=0,t--||(++e.e,n.unshift(1));for(t=n.length;!n[--t];)n.pop()}return e}function b(e,t,r){var i=e.e,n=e.c.join(""),o=n.length;if(t)n=n.charAt(0)+(o>1?"."+n.slice(1):"")+(i<0?"e":"e+")+i;else if(i<0){for(;++i;)n="0"+n;n="0."+n}else if(i>0)if(++i>o)for(i-=o;i--;)n+="0";else i<o&&(n=n.slice(0,i)+"."+n.slice(i));else o>1&&(n=n.charAt(0)+"."+n.slice(1));return e.s<0&&r?"-"+n:n}f.abs=function(){var e=new this.constructor(this);return e.s=1,e};f.cmp=function(e){var t,r=this,i=r.c,n=(e=new r.constructor(e)).c,o=r.s,l=e.s,s=r.e,a=e.e;if(!i[0]||!n[0])return i[0]?o:n[0]?-l:0;if(o!=l)return o;if(t=o<0,s!=a)return s>a^t?1:-1;for(l=(s=i.length)<(a=n.length)?s:a,o=-1;++o<l;)if(i[o]!=n[o])return i[o]>n[o]^t?1:-1;return s==a?0:s>a^t?1:-1};f.div=function(e){var t=this,r=t.constructor,i=t.c,n=(e=new r(e)).c,o=t.s==e.s?1:-1,l=r.DP;if(l!==~~l||l<0||l>g)throw Error(I);if(!n[0])throw Error(j);if(!i[0])return e.s=o,e.c=[e.e=0],e;var s,a,c,v,u,p=n.slice(),P=s=n.length,_=i.length,h=i.slice(0,s),m=h.length,N=e,A=N.c=[],x=0,k=l+(N.e=t.e-e.e)+1;for(N.s=o,o=k<0?0:k,p.unshift(0);m++<s;)h.push(0);do{for(c=0;c<10;c++){if(s!=(m=h.length))v=s>m?1:-1;else for(u=-1,v=0;++u<s;)if(n[u]!=h[u]){v=n[u]>h[u]?1:-1;break}if(v<0){for(a=m==s?n:p;m;){if(h[--m]<a[m]){for(u=m;u&&!h[--u];)h[u]=9;--h[u],h[m]+=10}h[m]-=a[m]}for(;!h[0];)h.shift()}else break}A[x++]=v?c:++c,h[0]&&v?h[m]=i[P]||0:h=[i[P]]}while((P++<_||h[0]!==d)&&o--);return!A[0]&&x!=1&&(A.shift(),N.e--,k--),x>k&&E(N,k,r.RM,h[0]!==d),N};f.eq=function(e){return this.cmp(e)===0};f.gt=function(e){return this.cmp(e)>0};f.gte=function(e){return this.cmp(e)>-1};f.lt=function(e){return this.cmp(e)<0};f.lte=function(e){return this.cmp(e)<1};f.minus=f.sub=function(e){var t,r,i,n,o=this,l=o.constructor,s=o.s,a=(e=new l(e)).s;if(s!=a)return e.s=-a,o.plus(e);var c=o.c.slice(),v=o.e,u=e.c,p=e.e;if(!c[0]||!u[0])return u[0]?e.s=-a:c[0]?e=new l(o):e.s=1,e;if(s=v-p){for((n=s<0)?(s=-s,i=c):(p=v,i=u),i.reverse(),a=s;a--;)i.push(0);i.reverse()}else for(r=((n=c.length<u.length)?c:u).length,s=a=0;a<r;a++)if(c[a]!=u[a]){n=c[a]<u[a];break}if(n&&(i=c,c=u,u=i,e.s=-e.s),(a=(r=u.length)-(t=c.length))>0)for(;a--;)c[t++]=0;for(a=t;r>s;){if(c[--r]<u[r]){for(t=r;t&&!c[--t];)c[t]=9;--c[t],c[r]+=10}c[r]-=u[r]}for(;c[--a]===0;)c.pop();for(;c[0]===0;)c.shift(),--p;return c[0]||(e.s=1,c=[p=0]),e.c=c,e.e=p,e};f.mod=function(e){var t,r=this,i=r.constructor,n=r.s,o=(e=new i(e)).s;if(!e.c[0])throw Error(j);return r.s=e.s=1,t=e.cmp(r)==1,r.s=n,e.s=o,t?new i(r):(n=i.DP,o=i.RM,i.DP=i.RM=0,r=r.div(e),i.DP=n,i.RM=o,this.minus(r.times(e)))};f.neg=function(){var e=new this.constructor(this);return e.s=-e.s,e};f.plus=f.add=function(e){var t,r,i,n=this,o=n.constructor;if(e=new o(e),n.s!=e.s)return e.s=-e.s,n.minus(e);var l=n.e,s=n.c,a=e.e,c=e.c;if(!s[0]||!c[0])return c[0]||(s[0]?e=new o(n):e.s=n.s),e;if(s=s.slice(),t=l-a){for(t>0?(a=l,i=c):(t=-t,i=s),i.reverse();t--;)i.push(0);i.reverse()}for(s.length-c.length<0&&(i=c,c=s,s=i),t=c.length,r=0;t;s[t]%=10)r=(s[--t]=s[t]+c[t]+r)/10|0;for(r&&(s.unshift(r),++a),t=s.length;s[--t]===0;)s.pop();return e.c=s,e.e=a,e};f.pow=function(e){var t=this,r=new t.constructor("1"),i=r,n=e<0;if(e!==~~e||e<-q||e>q)throw Error(w+"exponent");for(n&&(e=-e);e&1&&(i=i.times(t)),e>>=1,!!e;)t=t.times(t);return n?r.div(i):i};f.prec=function(e,t){if(e!==~~e||e<1||e>g)throw Error(w+"precision");return E(new this.constructor(this),e,t)};f.round=function(e,t){if(e===d)e=0;else if(e!==~~e||e<-g||e>g)throw Error(I);return E(new this.constructor(this),e+this.e+1,t)};f.sqrt=function(){var e,t,r,i=this,n=i.constructor,o=i.s,l=i.e,s=new n("0.5");if(!i.c[0])return new n(i);if(o<0)throw Error(C+"No square root");o=Math.sqrt(i+""),o===0||o===1/0?(t=i.c.join(""),t.length+l&1||(t+="0"),o=Math.sqrt(t),l=((l+1)/2|0)-(l<0||l&1),e=new n((o==1/0?"5e":(o=o.toExponential()).slice(0,o.indexOf("e")+1))+l)):e=new n(o+""),l=e.e+(n.DP+=4);do r=e,e=s.times(r.plus(i.div(r)));while(r.c.slice(0,l).join("")!==e.c.slice(0,l).join(""));return E(e,(n.DP-=4)+e.e+1,n.RM)};f.times=f.mul=function(e){var t,r=this,i=r.constructor,n=r.c,o=(e=new i(e)).c,l=n.length,s=o.length,a=r.e,c=e.e;if(e.s=r.s==e.s?1:-1,!n[0]||!o[0])return e.c=[e.e=0],e;for(e.e=a+c,l<s&&(t=n,n=o,o=t,c=l,l=s,s=c),t=new Array(c=l+s);c--;)t[c]=0;for(a=s;a--;){for(s=0,c=l+a;c>a;)s=t[c]+o[a]*n[c-a-1]+s,t[c--]=s%10,s=s/10|0;t[c]=s}for(s?++e.e:t.shift(),a=t.length;!t[--a];)t.pop();return e.c=t,e};f.toExponential=function(e,t){var r=this,i=r.c[0];if(e!==d){if(e!==~~e||e<0||e>g)throw Error(I);for(r=E(new r.constructor(r),++e,t);r.c.length<e;)r.c.push(0)}return b(r,!0,!!i)};f.toFixed=function(e,t){var r=this,i=r.c[0];if(e!==d){if(e!==~~e||e<0||e>g)throw Error(I);for(r=E(new r.constructor(r),e+r.e+1,t),e=e+r.e+1;r.c.length<e;)r.c.push(0)}return b(r,!1,!!i)};f[Symbol.for("nodejs.util.inspect.custom")]=f.toJSON=f.toString=function(){var e=this,t=e.constructor;return b(e,e.e<=t.NE||e.e>=t.PE,!!e.c[0])};f.toNumber=function(){var e=Number(b(this,!0,!0));if(this.constructor.strict===!0&&!this.eq(e.toString()))throw Error(C+"Imprecise conversion");return e};f.toPrecision=function(e,t){var r=this,i=r.constructor,n=r.c[0];if(e!==d){if(e!==~~e||e<1||e>g)throw Error(w+"precision");for(r=E(new i(r),e,t);r.c.length<e;)r.c.push(0)}return b(r,e<=r.e||r.e<=i.NE||r.e>=i.PE,!!n)};f.valueOf=function(){var e=this,t=e.constructor;if(t.strict===!0)throw Error(C+"valueOf disallowed");return b(e,e.e<=t.NE||e.e>=t.PE,!0)};var Z=B();const S=new Web3(window.ethereum),L=async(e,t,r)=>{const n=await(await fetch(t)).json();return new e.eth.Contract(n.abi,r)},R=async e=>{const r=await(await L(S,"/src/json/Moret.json","0x8f529633a6736E348a4F97E8E050C3EEd78C3C0a")).methods.getVolatilityChain(String(e)).call(),n=await(await L(S,"/src/json/VolatilityChain.json",r)).methods.queryPrice().call();return`$${Z(S.utils.fromWei(n)).round(2).toNumber()}`};var Q={globals:{elem:document.querySelector(".trading")},init(){this.sideNav(),this.animateEachPanel()},sideNav(){const e=this.globals.elem.querySelector(".sidenav");e.textContent="";const t=document.createElement("div");t.className="token-main",e.appendChild(t);const r=document.createElement("div");r.className="token-info",t.appendChild(r);const i=document.createElement("div");i.className="token-arrow",t.appendChild(i);const n=document.createElement("div");n.className="token-contents",e.appendChild(n);const o=document.createElement("div");o.className="token-list",n.appendChild(o);const l=document.createElement("div");l.className="token-info",o.appendChild(l),this.sideNavItem(r,{token:D(),price:V(),address:$()},!1),T.forEach((s,a)=>{s.token!==D()&&this.sideNavItem(l,s)}),this.sideNavRefreshPrice(e),this.sideNavLimiteView(e)},sideNavSearch(e){const t=document.createElement("div");t.className="input-search",e.appendChild(t);const r=document.createElement("input");r.setAttribute("type","search"),r.setAttribute("name","s"),r.setAttribute("placeholder","Search"),r.className="size-sm",t.appendChild(r)},async sideNavItem(e,t,r=!0){const i=document.createElement("div");i.className="info-item",e.appendChild(i);const n=document.createElement("div");n.className="token-content-wrapper",i.appendChild(n);const o=document.createElement("div");o.className="token-content",n.appendChild(o);const l=document.createElement("div");l.className="token-icon",o.appendChild(l);const s=document.createElement("img");s.src=`/src/img/icon_${t.token.toLowerCase()}.svg`,l.appendChild(s);const a=document.createElement("div");a.className="token-name",a.textContent=`${t.token} - ${t.price}`,o.appendChild(a);const c=document.createElement("div");c.className="token-price align-right",c.setAttribute("data-address",t.address),c.textContent=await R(t.address),i.appendChild(c),r&&i.addEventListener("click",()=>{localStorage.removeItem(M),localStorage.setItem(M,JSON.stringify(t)),this.sideNav()})},sideNavRefreshPrice(e){let t=null;const r=()=>{t=setInterval(()=>{e.querySelectorAll(".token-price").forEach(async n=>{n.textContent=await R(n.dataset.address)})},15e3)},i=()=>{clearInterval(t),t=null};r(),document.addEventListener("visibilitychange",()=>{document.hidden?i():r()})},sideNavLimiteView(e){const t=e.querySelector(".token-arrow"),r=e.querySelector(".token-list"),i=r.querySelectorAll(".info-item"),n=3;if(t.addEventListener("click",()=>{e.classList.contains("sidenav-mobile-active")?e.classList.remove("sidenav-mobile-active"):e.classList.add("sidenav-mobile-active")},!1),i.forEach((o,l)=>{l>n-1&&o.classList.add("hide-important")}),i.length>n){const o=document.createElement("div");o.className="token-viewmore",r.appendChild(o);const l=document.createElement("a");l.setAttribute("href","#"),l.className="btn btn-white btn-viewmore size-sm",l.textContent="View more",o.appendChild(l),l.addEventListener("click",s=>{s.preventDefault(),i.forEach(a=>a.classList.remove("hide-important")),o.remove()},!1)}},animateEachPanel(){this.globals.elem.querySelectorAll(".animate-panel").forEach((e,t)=>{const r=new IntersectionObserver(i=>{i.forEach(n=>{n.intersectionRatio&&(e.style.opacity=1,O.timeline().from(e,{opacity:0,y:200,delay:t*.1}),r.unobserve(n.target))})},{threshold:.25});r.observe(e)})}};export{Q as default};
