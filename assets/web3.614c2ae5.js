import{t as E,g as v,e as j,m as Z,a as S}from"./main.2b926913.js";var at=20,it=1,W=1e6,Q=1e6,st=-7,lt=21,ct=!1,G="[big.js] ",V=G+"Invalid ",H=V+"decimal places",ut=V+"rounding mode",tt=G+"Division by zero",p={},A=void 0,ht=/^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;function et(){function t(e){var o=this;if(!(o instanceof t))return e===A?et():new t(e);if(e instanceof t)o.s=e.s,o.e=e.e,o.c=e.c.slice();else{if(typeof e!="string"){if(t.strict===!0&&typeof e!="bigint")throw TypeError(V+"value");e=e===0&&1/e<0?"-0":String(e)}ft(o,e)}o.constructor=t}return t.prototype=p,t.DP=at,t.RM=it,t.NE=st,t.PE=lt,t.strict=ct,t.roundDown=0,t.roundHalfUp=1,t.roundHalfEven=2,t.roundUp=3,t}function ft(t,e){var o,r,n;if(!ht.test(e))throw Error(V+"number");for(t.s=e.charAt(0)=="-"?(e=e.slice(1),-1):1,(o=e.indexOf("."))>-1&&(e=e.replace(".","")),(r=e.search(/e/i))>0?(o<0&&(o=r),o+=+e.slice(r+1),e=e.substring(0,r)):o<0&&(o=e.length),n=e.length,r=0;r<n&&e.charAt(r)=="0";)++r;if(r==n)t.c=[t.e=0];else{for(;n>0&&e.charAt(--n)=="0";);for(t.e=o-r-1,t.c=[],o=0;r<=n;)t.c[o++]=+e.charAt(r++)}return t}function y(t,e,o,r){var n=t.c;if(o===A&&(o=t.constructor.RM),o!==0&&o!==1&&o!==2&&o!==3)throw Error(ut);if(e<1)r=o===3&&(r||!!n[0])||e===0&&(o===1&&n[0]>=5||o===2&&(n[0]>5||n[0]===5&&(r||n[1]!==A))),n.length=1,r?(t.e=t.e-e+1,n[0]=1):n[0]=t.e=0;else if(e<n.length){if(r=o===1&&n[e]>=5||o===2&&(n[e]>5||n[e]===5&&(r||n[e+1]!==A||n[e-1]&1))||o===3&&(r||!!n[0]),n.length=e--,r)for(;++n[e]>9;)n[e]=0,e--||(++t.e,n.unshift(1));for(e=n.length;!n[--e];)n.pop()}return t}function O(t,e,o){var r=t.e,n=t.c.join(""),a=n.length;if(e)n=n.charAt(0)+(a>1?"."+n.slice(1):"")+(r<0?"e":"e+")+r;else if(r<0){for(;++r;)n="0"+n;n="0."+n}else if(r>0)if(++r>a)for(r-=a;r--;)n+="0";else r<a&&(n=n.slice(0,r)+"."+n.slice(r));else a>1&&(n=n.charAt(0)+"."+n.slice(1));return t.s<0&&o?"-"+n:n}p.abs=function(){var t=new this.constructor(this);return t.s=1,t};p.cmp=function(t){var e,o=this,r=o.c,n=(t=new o.constructor(t)).c,a=o.s,l=t.s,i=o.e,u=t.e;if(!r[0]||!n[0])return r[0]?a:n[0]?-l:0;if(a!=l)return a;if(e=a<0,i!=u)return i>u^e?1:-1;for(l=(i=r.length)<(u=n.length)?i:u,a=-1;++a<l;)if(r[a]!=n[a])return r[a]>n[a]^e?1:-1;return i==u?0:i>u^e?1:-1};p.div=function(t){var e=this,o=e.constructor,r=e.c,n=(t=new o(t)).c,a=e.s==t.s?1:-1,l=o.DP;if(l!==~~l||l<0||l>W)throw Error(H);if(!n[0])throw Error(tt);if(!r[0])return t.s=a,t.c=[t.e=0],t;var i,u,s,f,h,g=n.slice(),M=i=n.length,N=r.length,m=r.slice(0,i),w=m.length,d=t,C=d.c=[],T=0,x=l+(d.e=e.e-t.e)+1;for(d.s=a,a=x<0?0:x,g.unshift(0);w++<i;)m.push(0);do{for(s=0;s<10;s++){if(i!=(w=m.length))f=i>w?1:-1;else for(h=-1,f=0;++h<i;)if(n[h]!=m[h]){f=n[h]>m[h]?1:-1;break}if(f<0){for(u=w==i?n:g;w;){if(m[--w]<u[w]){for(h=w;h&&!m[--h];)m[h]=9;--m[h],m[w]+=10}m[w]-=u[w]}for(;!m[0];)m.shift()}else break}C[T++]=f?s:++s,m[0]&&f?m[w]=r[M]||0:m=[r[M]]}while((M++<N||m[0]!==A)&&a--);return!C[0]&&T!=1&&(C.shift(),d.e--,x--),T>x&&y(d,x,o.RM,m[0]!==A),d};p.eq=function(t){return this.cmp(t)===0};p.gt=function(t){return this.cmp(t)>0};p.gte=function(t){return this.cmp(t)>-1};p.lt=function(t){return this.cmp(t)<0};p.lte=function(t){return this.cmp(t)<1};p.minus=p.sub=function(t){var e,o,r,n,a=this,l=a.constructor,i=a.s,u=(t=new l(t)).s;if(i!=u)return t.s=-u,a.plus(t);var s=a.c.slice(),f=a.e,h=t.c,g=t.e;if(!s[0]||!h[0])return h[0]?t.s=-u:s[0]?t=new l(a):t.s=1,t;if(i=f-g){for((n=i<0)?(i=-i,r=s):(g=f,r=h),r.reverse(),u=i;u--;)r.push(0);r.reverse()}else for(o=((n=s.length<h.length)?s:h).length,i=u=0;u<o;u++)if(s[u]!=h[u]){n=s[u]<h[u];break}if(n&&(r=s,s=h,h=r,t.s=-t.s),(u=(o=h.length)-(e=s.length))>0)for(;u--;)s[e++]=0;for(u=e;o>i;){if(s[--o]<h[o]){for(e=o;e&&!s[--e];)s[e]=9;--s[e],s[o]+=10}s[o]-=h[o]}for(;s[--u]===0;)s.pop();for(;s[0]===0;)s.shift(),--g;return s[0]||(t.s=1,s=[g=0]),t.c=s,t.e=g,t};p.mod=function(t){var e,o=this,r=o.constructor,n=o.s,a=(t=new r(t)).s;if(!t.c[0])throw Error(tt);return o.s=t.s=1,e=t.cmp(o)==1,o.s=n,t.s=a,e?new r(o):(n=r.DP,a=r.RM,r.DP=r.RM=0,o=o.div(t),r.DP=n,r.RM=a,this.minus(o.times(t)))};p.neg=function(){var t=new this.constructor(this);return t.s=-t.s,t};p.plus=p.add=function(t){var e,o,r,n=this,a=n.constructor;if(t=new a(t),n.s!=t.s)return t.s=-t.s,n.minus(t);var l=n.e,i=n.c,u=t.e,s=t.c;if(!i[0]||!s[0])return s[0]||(i[0]?t=new a(n):t.s=n.s),t;if(i=i.slice(),e=l-u){for(e>0?(u=l,r=s):(e=-e,r=i),r.reverse();e--;)r.push(0);r.reverse()}for(i.length-s.length<0&&(r=s,s=i,i=r),e=s.length,o=0;e;i[e]%=10)o=(i[--e]=i[e]+s[e]+o)/10|0;for(o&&(i.unshift(o),++u),e=i.length;i[--e]===0;)i.pop();return t.c=i,t.e=u,t};p.pow=function(t){var e=this,o=new e.constructor("1"),r=o,n=t<0;if(t!==~~t||t<-Q||t>Q)throw Error(V+"exponent");for(n&&(t=-t);t&1&&(r=r.times(e)),t>>=1,!!t;)e=e.times(e);return n?o.div(r):r};p.prec=function(t,e){if(t!==~~t||t<1||t>W)throw Error(V+"precision");return y(new this.constructor(this),t,e)};p.round=function(t,e){if(t===A)t=0;else if(t!==~~t||t<-W||t>W)throw Error(H);return y(new this.constructor(this),t+this.e+1,e)};p.sqrt=function(){var t,e,o,r=this,n=r.constructor,a=r.s,l=r.e,i=new n("0.5");if(!r.c[0])return new n(r);if(a<0)throw Error(G+"No square root");a=Math.sqrt(r+""),a===0||a===1/0?(e=r.c.join(""),e.length+l&1||(e+="0"),a=Math.sqrt(e),l=((l+1)/2|0)-(l<0||l&1),t=new n((a==1/0?"5e":(a=a.toExponential()).slice(0,a.indexOf("e")+1))+l)):t=new n(a+""),l=t.e+(n.DP+=4);do o=t,t=i.times(o.plus(r.div(o)));while(o.c.slice(0,l).join("")!==t.c.slice(0,l).join(""));return y(t,(n.DP-=4)+t.e+1,n.RM)};p.times=p.mul=function(t){var e,o=this,r=o.constructor,n=o.c,a=(t=new r(t)).c,l=n.length,i=a.length,u=o.e,s=t.e;if(t.s=o.s==t.s?1:-1,!n[0]||!a[0])return t.c=[t.e=0],t;for(t.e=u+s,l<i&&(e=n,n=a,a=e,s=l,l=i,i=s),e=new Array(s=l+i);s--;)e[s]=0;for(u=i;u--;){for(i=0,s=l+u;s>u;)i=e[s]+a[u]*n[s-u-1]+i,e[s--]=i%10,i=i/10|0;e[s]=i}for(i?++t.e:e.shift(),u=e.length;!e[--u];)e.pop();return t.c=e,t};p.toExponential=function(t,e){var o=this,r=o.c[0];if(t!==A){if(t!==~~t||t<0||t>W)throw Error(H);for(o=y(new o.constructor(o),++t,e);o.c.length<t;)o.c.push(0)}return O(o,!0,!!r)};p.toFixed=function(t,e){var o=this,r=o.c[0];if(t!==A){if(t!==~~t||t<0||t>W)throw Error(H);for(o=y(new o.constructor(o),t+o.e+1,e),t=t+o.e+1;o.c.length<t;)o.c.push(0)}return O(o,!1,!!r)};p[Symbol.for("nodejs.util.inspect.custom")]=p.toJSON=p.toString=function(){var t=this,e=t.constructor;return O(t,t.e<=e.NE||t.e>=e.PE,!!t.c[0])};p.toNumber=function(){var t=Number(O(this,!0,!0));if(this.constructor.strict===!0&&!this.eq(t.toString()))throw Error(G+"Imprecise conversion");return t};p.toPrecision=function(t,e){var o=this,r=o.constructor,n=o.c[0];if(t!==A){if(t!==~~t||t<1||t>W)throw Error(V+"precision");for(o=y(new r(o),t,e);o.c.length<t;)o.c.push(0)}return O(o,t<=o.e||o.e<=r.NE||o.e>=r.PE,!!n)};p.valueOf=function(){var t=this,e=t.constructor;if(e.strict===!0)throw Error(G+"valueOf disallowed");return O(t,t.e<=e.NE||t.e>=e.PE,!0)};var mt=et(),P=mt;function _(t){var e=0;if(t>=8)e=1;else if(t<=-8)e=0;else{for(var o=0;o<100;o++)e+=Math.pow(t,2*o+1)/gt(2*o+1);e*=Math.pow(Math.E,-.5*Math.pow(t,2)),e/=Math.sqrt(2*Math.PI),e+=.5}return e}function gt(t){for(var e=1,o=t;o>1;o-=2)e*=o;return e}function wt(t,e,o,r,n,a){var l=null,i=(n*o+Math.pow(r,2)*o/2-Math.log(e/t))/(r*Math.sqrt(o));return a==="call"?l=t*_(i)-e*Math.pow(Math.E,-1*n*o)*_(i-r*Math.sqrt(o)):l=e*Math.pow(Math.E,-1*n*o)*_(r*Math.sqrt(o)-i)-t*_(-i),l}function pt(t,e,o,r,n){var a=(n*o+Math.pow(r,2)*o/2-Math.log(e/t))/(r*Math.sqrt(o));return a}var dt={blackScholes:wt,stdNormCDF:_,getW:pt},q=dt;function J(t){return Math.pow(Math.E,-1*Math.pow(t,2)/2)/Math.sqrt(2*Math.PI)}function vt(t,e,o,r,n,a){return a==="call"?ot(t,e,o,r,n):bt(t,e,o,r,n)}function ot(t,e,o,r,n){var a=q.getW(t,e,o,r,n),l=null;return isFinite(a)?l=q.stdNormCDF(a):l=t>e?1:0,l}function bt(t,e,o,r,n){var a=ot(t,e,o,r,n)-1;return a==-1&&e==t?0:a}function Mt(t,e,o,r,n,a,l){return l=l||100,a==="call"?Nt(t,e,o,r,n)/l:Tt(t,e,o,r,n)/l}function Nt(t,e,o,r,n){var a=q.getW(t,e,o,r,n);return isNaN(a)?0:e*o*Math.pow(Math.E,-1*n*o)*q.stdNormCDF(a-r*Math.sqrt(o))}function Tt(t,e,o,r,n){var a=q.getW(t,e,o,r,n);return isNaN(a)?0:-1*e*o*Math.pow(Math.E,-1*n*o)*q.stdNormCDF(r*Math.sqrt(o)-a)}function Ct(t,e,o,r,n){var a=q.getW(t,e,o,r,n);return isFinite(a)?t*Math.sqrt(o)*J(a)/100:0}function Et(t,e,o,r,n,a,l){return l=l||365,a==="call"?kt(t,e,o,r,n)/l:Pt(t,e,o,r,n)/l}function kt(t,e,o,r,n){var a=q.getW(t,e,o,r,n);return isFinite(a)?-1*r*t*J(a)/(2*Math.sqrt(o))-e*n*Math.pow(Math.E,-1*n*o)*q.stdNormCDF(a-r*Math.sqrt(o)):0}function Pt(t,e,o,r,n){var a=q.getW(t,e,o,r,n);return isFinite(a)?-1*r*t*J(a)/(2*Math.sqrt(o))+e*n*Math.pow(Math.E,-1*n*o)*q.stdNormCDF(r*Math.sqrt(o)-a):0}function xt(t,e,o,r,n){var a=q.getW(t,e,o,r,n);return isFinite(a)?J(a)/(t*r*Math.sqrt(o)):0}var U={getDelta:vt,getVega:Ct,getGamma:xt,getTheta:Et,getRho:Mt};const c=new Web3(window.ethereum),b=async(t,e,o)=>{const n=await(await fetch(e)).json();return new t.eth.Contract(n.abi,o)},I=async(t=null)=>{const e=t||E(),r=await(await b(c,v("Moret.json"),S)).methods.getVolatilityChain(String(e)).call();return await b(c,v("VolatilityChain.json"),r)},Ft=async(t=null)=>{const e=t||E(),r=await(await I(e)).methods.queryPrice().call();return`$${P(c.utils.fromWei(r)).round(2).toNumber()}`},Wt=async(t=null,e)=>{const o=t||E(),n=await(await I(o)).methods.queryPrice().call(),a=P(c.utils.fromWei(n)).toNumber(),l=[.6,.7,.8,.85,.9,.95,1,1.05,1.1,1.15,1.2,1.3,1.4],i=50,u=[];for(let s of l){let f=P(a).times(s).div(i).round().times(i).toNumber(),h=await qt(o,f,e);u.push(`${f} | ${h}`)}return u},qt=async(t=null,e,o)=>{const r=t||E(),a=await(await I(r)).methods.queryPrice().call(),l=P(c.utils.fromWei(a)).toNumber(),i=P(e).div(l).times(100).round().toNumber();return i===100?"ATM":i>100?`${(i-100).toString()}${o?"% OTM":"% ITM"}`:`${(100-i).toString()}${o?"% ITM":"% OTM"}`},St=async(t=null)=>{const e=t||E(),o=await I(e),r=[1,7,30];let n=[];for(let a of r){const l=P(a).times(86400).round().toNumber(),i=P(a).div(365),u=await o.methods.queryVol(l).call(),s=`${P(c.utils.fromWei(u)).div(i.sqrt()).toNumber().toLocaleString(void 0,{style:"percent",minimumFractionDigits:0})} RV`,f=P(a).eq(1)?"":"s";n.push(`${a} Day${f} | ${s}`)}return n},At=async(t=null,e)=>{const o=t||E(),r=await b(c,v("Moret.json"),S),n=P(e).times(86400).round().toNumber();try{const a=await r.methods.getVolatilityToken(o,n).call();return await(await b(c,v("VolatilityToken.json"),a)).methods.symbol().call()}catch{return""}},rt=async(t=null,e=null,o,r,n,a,l,i)=>{try{if(a<=0)throw"Strike not set correctly.";if(i<=0)throw"Expiry not set correctly";const m=t||E(),w=await b(c,v("Exchange.json"),j),d=Math.floor(i*86400),C=await X(m);var u=0 .toString(16),s,f,h=0,g=0;for(let T=0;T<C.length;T++){const x=C[T],k=await w.methods.queryOption(x,d,c.utils.toWei(a.toString(),"ether"),c.utils.toWei(l.toString(),"ether"),r?0:1,o?0:1,!1).call(),D=parseFloat(c.utils.fromWei(c.utils.toBN(k[0])));(parseInt(u,16)==0||o&&D<s||!o&&D>s)&&(s=D,f=parseFloat(c.utils.fromWei(c.utils.toBN(k[1]))),g=parseFloat(c.utils.fromWei(c.utils.toBN(k[2]))),h=parseFloat(c.utils.fromWei(c.utils.toBN(k[3]))),u=x)}if(h==0||g==0)throw"There is no available liquidity pool.";var M="USDC",N="USDC";return n==0||(n==1?(s=s/g,f=f/g,M=N=e):n==2&&(s=s/h,M=await At(m,i))),e?{volatility:h.toLocaleString(void 0,{style:"percent",minimumFractionDigits:0}),premium:`${P(s).round(5)}${M}`,collateral:`${P(f).round(2)}${N}`,error:""}:{volatility:h,premium:s,collateral:f,pool:u,error:""}}catch(m){return{volatility:"-",premium:"-",collateral:"-",error:m.message}}},X=async(t=null)=>{const e=t||E(),r=await(await b(c,v("Moret.json"),S)).methods.broker().call();return await(await b(c,v("MoretBroker.json"),r)).methods.getAllPools(e).call()},Vt=async(t=null)=>{const e=t||E(),r=await(await b(c,v("Exchange.json"),j)).methods.vault().call(),n=await b(c,v("OptionVault.json"),r),a=await X(e);var l=0,i=0;for(let f=0;f<a.length;f++){const h=a[f],g=await n.methods.calcCapital(h,!1,!1).call(),M=await n.methods.calcCapital(h,!0,!1).call();l=l+parseFloat(c.utils.fromWei(g)),i=i+parseFloat(c.utils.fromWei(M))}const u=l-i,s=Math.max(0,1-i/l);return{gross:`$${(l/1e3).toFixed(3)}K`,utilized:`$${(u/1e3).toFixed(3)}K`,perc:s*100,text:s.toLocaleString(void 0,{style:"percent",minimumFractionDigits:0})}},yt=async(t=null,e,o,r,n,a,l)=>{const i=t||E(),u=await b(c,v("Moret.json"),S),s=await rt(i,null,e,o,r,n,a,l);console.log(s);const f=await u.methods.funding().call(),h=Math.floor(l*86400);var g=r==0?f:i;if(r==2)try{g=await u.methods.getVolatilityToken(i,h).call()}catch{console.log(`no vol token exists for ${l.toString()}`)}const M=await b(c,v("ERC20.json"),g),N=await b(c,v("ERC20.json"),r==1?i:f);var m=await ethereum.request({method:"eth_requestAccounts"}),w=c.utils.toChecksumAddress(m[0]);try{await z(M,w,j,s.premium),await z(N,w,j,s.collateral)}catch(d){return console.warn(d),"failure"}},z=async(t,e,o,r)=>{var n=await t.methods.allowance(e,o).call();const a=await t.methods.decimals().call();if(c.utils.toBN(c.utils.toWei(r.toString())).mul(c.utils.toBN(10).pow(c.utils.toBN(18-Number(a)))).gt(c.utils.toBN(n))){var i=await c.eth.getGasPrice(),u=await t.methods.approve(o,Z).estimateGas({from:e,gasPrice:i});u=Number(c.utils.toBN(u).mul(c.utils.toBN(Number(150))).div(c.utils.toBN(Number(100))));var s=await c.eth.getTransactionCount(e);await t.methods.approve(o,Z).send({from:e,gas:u,gasPrice:i,nonce:s})}},Bt=async(t=null,e,o,r,n,a,l)=>{const i=t||E(),u=await rt(i,null,e,o,r,n,a,l),s=c.utils.toChecksumAddress(u.pool),f=Math.floor(l*86400);var h=await ethereum.request({method:"eth_requestAccounts"}),g=c.utils.toChecksumAddress(h[0]);try{const w=await b(c,v("Exchange.json"),j);var M=await c.eth.getGasPrice(),N=await w.methods.tradeOption(s,f,c.utils.toWei(n.toString()),c.utils.toWei(a.toString()),o?0:1,e?0:1,r).estimateGas({from:g,gasPrice:M});N=Number(c.utils.toBN(N).mul(c.utils.toBN(Number(150))).div(c.utils.toBN(Number(100))));var m=await c.eth.getTransactionCount(g);let d=null;return await w.methods.tradeOption(s,f,c.utils.toWei(n.toString()),c.utils.toWei(a.toString()),o?0:1,e?0:1,r).send({from:g,gas:N,gasPrice:M,nonce:m}).on("transactionHash",C=>{d=`https://polygonscan.com/tx/${C}`}).on("error",function(C,T){return""}),d}catch(w){return console.warn(w),""}},$t=async(t=null)=>{const e=t||E(),r=await(await b(c,v("Exchange.json"),j)).methods.vault().call(),n=await b(c,v("OptionVault.json"),r),a=await I(e);var l=await a.methods.queryPrice().call(),i=parseFloat(c.utils.fromWei(l)),u=await ethereum.request({method:"eth_requestAccounts"});c.utils.toChecksumAddress(u[0]);const s=await X(e);let f=[];var h=Math.round(new Date().getTime()/1e3);return await Promise.all(s.map(async g=>{const M=await n.methods.getActiveOptions(g).call();await Promise.all(M.map(async N=>{let m=await n.methods.getOption(N).call(),w=Math.floor(m.maturity-h),d=w/(3600*24*365),C=parseFloat(c.utils.fromWei(m.strike)),T=parseFloat(c.utils.fromWei(m.amount)),x=m.poType==0?"call":"put",k=m.side==0?1:-1,D,B,$,R;if(w>0){let L=await a.methods.queryVol(w).call(),F=parseFloat(c.utils.fromWei(L))/Math.sqrt(d);D=U.getDelta(i,C,d,F,0,x)*k*T,B=U.getGamma(i,C,d,F,0)*k*T,$=U.getVega(i,C,d,F,0)*k*T,R=U.getTheta(i,C,d,F,0,x)*k*T}f.push({Type:m.poType==0?"Call":"Put",BS:m.side==0?"Buy":"Sell",Expiry:new Date(m.maturity*1e3).toLocaleString(),Strike:C.toFixed(0),Amount:T.toFixed(3),Delta:D.toFixed(3),Gamma:B.toFixed(3),Vega:$.toFixed(3),Theta:R.toFixed(3)})}))})),f},nt=async(t=null,e=null,o,r,n)=>{try{if(n<=0)throw"Expiry not set correctly";const s=t||E(),f=await b(c,v("Exchange.json"),j),h=await I(s),g=Math.floor(n*86400),M=n/365,N=await h.methods.queryVol(g).call(),m=await h.methods.queryPrice().call(),w=r/parseFloat(c.utils.fromWei(N))/parseFloat(c.utils.fromWei(m))/.4,d=await jt(s);var a,l,i=0;const T=await(await b(c,v("Moret.json"),S)).methods.getVolatilityToken(s,g).call(),k=await(await b(c,v("VolatilityToken.json"),T)).methods.symbol().call(),D="USDC";var u=0 .toString(16);if(d.length==0)throw"There is no available pool to trade volatility tokens with.";for(let B=0;B<d.length;B++){const $=d[B],R=await f.methods.queryOption($,g,m,c.utils.toWei(w.toFixed(18),"ether"),0,o?0:1,!0).call(),L=parseFloat(c.utils.fromWei(c.utils.toBN(R[0]))),F=parseFloat(c.utils.fromWei(R[3])),Y=(o?L:L/F)/r*w,K=r/F;(parseInt(u,16)==0||a<K)&&(a=K,u=$,i=F,l=Y)}return e?{volatility:i.toLocaleString(void 0,{style:"percent",minimumFractionDigits:0}),premium:`${P(r).round(5)}${D}`,volpremium:`${P(a).round(5)}${k}`}:{volatility:i,premium:r,volpremium:a,notional:l,voltoken:T,pool:u}}catch(s){return console.log(s.message),{volatility:"-",premium:"-",volpremium:"-",error:s.message}}},jt=async t=>{const e=await b(c,v("Moret.json"),S),o=await e.methods.broker().call(),n=await(await b(c,v("MoretBroker.json"),o)).methods.getAllPools(t).call();var a=[];for(let l=0;l<n.length;l++)await e.methods.existVolTradingPool(n[l]).call()&&a.push(n[l]);return a},Ot=async(t=null,e,o,r)=>{const n=t||E(),a=await b(c,v("Moret.json"),S),l=await nt(n,null,e,o,r);var i=await ethereum.request({method:"eth_requestAccounts"}),u=c.utils.toChecksumAddress(i[0]);if(e){const s=await a.methods.funding().call(),f=await b(c,v("ERC20.json"),s);await z(f,u,j,l.premium)}else{const s=c.utils.toChecksumAddress(l.voltoken),f=await b(c,v("ERC20.json"),s);await z(f,u,j,l.volpremium)}},It=async(t=null,e,o,r)=>{try{const s=t||E(),f=await nt(s,null,e,o,r),h=c.utils.toChecksumAddress(f.pool),g=c.utils.toWei(f.notional.toFixed(18),"ether"),M=Math.floor(r*86400);var n=await ethereum.request({method:"eth_requestAccounts"}),a=c.utils.toChecksumAddress(n[0]);const N=await b(c,v("Exchange.json"),j);var l=await c.eth.getGasPrice(),i=await N.methods.tradeVolToken(h,M,g,e?0:1).estimateGas({from:a,gasPrice:l});i=Number(c.utils.toBN(i).mul(c.utils.toBN(Number(150))).div(c.utils.toBN(Number(100))));var u=await c.eth.getTransactionCount(a);await N.methods.tradeVolToken(h,M,g,e?0:1).send({from:a,gas:i,gasPrice:l,nonce:u}).on("transactionHash",m=>(console.log(`https://polygonscan.com/tx/${m}`),`https://polygonscan.com/tx/${m}`)).on("error",function(m,w){return""})}catch(s){return console.warn(s),""}};export{P as B,At as a,Wt as b,qt as c,St as d,rt as e,Vt as f,Ft as g,yt as h,Bt as i,$t as j,nt as k,Ot as l,It as m,c as w};
