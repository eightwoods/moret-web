import{t as E,g as b,e as S,m as V,a as I}from"./main.1af5adb8.js";var H=20,J=1,B=1e6,F=1e6,X=-7,K=21,Y=!1,$="[big.js] ",A=$+"Invalid ",O=A+"decimal places",Z=A+"rounding mode",U=$+"Division by zero",g={},P=void 0,Q=/^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;function L(){function t(e){var o=this;if(!(o instanceof t))return e===P?L():new t(e);if(e instanceof t)o.s=e.s,o.e=e.e,o.c=e.c.slice();else{if(typeof e!="string"){if(t.strict===!0&&typeof e!="bigint")throw TypeError(A+"value");e=e===0&&1/e<0?"-0":String(e)}y(o,e)}o.constructor=t}return t.prototype=g,t.DP=H,t.RM=J,t.NE=X,t.PE=K,t.strict=Y,t.roundDown=0,t.roundHalfUp=1,t.roundHalfEven=2,t.roundUp=3,t}function y(t,e){var o,r,i;if(!Q.test(e))throw Error(A+"number");for(t.s=e.charAt(0)=="-"?(e=e.slice(1),-1):1,(o=e.indexOf("."))>-1&&(e=e.replace(".","")),(r=e.search(/e/i))>0?(o<0&&(o=r),o+=+e.slice(r+1),e=e.substring(0,r)):o<0&&(o=e.length),i=e.length,r=0;r<i&&e.charAt(r)=="0";)++r;if(r==i)t.c=[t.e=0];else{for(;i>0&&e.charAt(--i)=="0";);for(t.e=o-r-1,t.c=[],o=0;r<=i;)t.c[o++]=+e.charAt(r++)}return t}function D(t,e,o,r){var i=t.c;if(o===P&&(o=t.constructor.RM),o!==0&&o!==1&&o!==2&&o!==3)throw Error(Z);if(e<1)r=o===3&&(r||!!i[0])||e===0&&(o===1&&i[0]>=5||o===2&&(i[0]>5||i[0]===5&&(r||i[1]!==P))),i.length=1,r?(t.e=t.e-e+1,i[0]=1):i[0]=t.e=0;else if(e<i.length){if(r=o===1&&i[e]>=5||o===2&&(i[e]>5||i[e]===5&&(r||i[e+1]!==P||i[e-1]&1))||o===3&&(r||!!i[0]),i.length=e--,r)for(;++i[e]>9;)i[e]=0,e--||(++t.e,i.unshift(1));for(e=i.length;!i[--e];)i.pop()}return t}function W(t,e,o){var r=t.e,i=t.c.join(""),a=i.length;if(e)i=i.charAt(0)+(a>1?"."+i.slice(1):"")+(r<0?"e":"e+")+r;else if(r<0){for(;++r;)i="0"+i;i="0."+i}else if(r>0)if(++r>a)for(r-=a;r--;)i+="0";else r<a&&(i=i.slice(0,r)+"."+i.slice(r));else a>1&&(i=i.charAt(0)+"."+i.slice(1));return t.s<0&&o?"-"+i:i}g.abs=function(){var t=new this.constructor(this);return t.s=1,t};g.cmp=function(t){var e,o=this,r=o.c,i=(t=new o.constructor(t)).c,a=o.s,u=t.s,n=o.e,c=t.e;if(!r[0]||!i[0])return r[0]?a:i[0]?-u:0;if(a!=u)return a;if(e=a<0,n!=c)return n>c^e?1:-1;for(u=(n=r.length)<(c=i.length)?n:c,a=-1;++a<u;)if(r[a]!=i[a])return r[a]>i[a]^e?1:-1;return n==c?0:n>c^e?1:-1};g.div=function(t){var e=this,o=e.constructor,r=e.c,i=(t=new o(t)).c,a=e.s==t.s?1:-1,u=o.DP;if(u!==~~u||u<0||u>B)throw Error(O);if(!i[0])throw Error(U);if(!r[0])return t.s=a,t.c=[t.e=0],t;var n,c,s,h,f,m=i.slice(),p=n=i.length,x=r.length,w=r.slice(0,n),v=w.length,j=t,M=j.c=[],T=0,C=u+(j.e=e.e-t.e)+1;for(j.s=a,a=C<0?0:C,m.unshift(0);v++<n;)w.push(0);do{for(s=0;s<10;s++){if(n!=(v=w.length))h=n>v?1:-1;else for(f=-1,h=0;++f<n;)if(i[f]!=w[f]){h=i[f]>w[f]?1:-1;break}if(h<0){for(c=v==n?i:m;v;){if(w[--v]<c[v]){for(f=v;f&&!w[--f];)w[f]=9;--w[f],w[v]+=10}w[v]-=c[v]}for(;!w[0];)w.shift()}else break}M[T++]=h?s:++s,w[0]&&h?w[v]=r[p]||0:w=[r[p]]}while((p++<x||w[0]!==P)&&a--);return!M[0]&&T!=1&&(M.shift(),j.e--,C--),T>C&&D(j,C,o.RM,w[0]!==P),j};g.eq=function(t){return this.cmp(t)===0};g.gt=function(t){return this.cmp(t)>0};g.gte=function(t){return this.cmp(t)>-1};g.lt=function(t){return this.cmp(t)<0};g.lte=function(t){return this.cmp(t)<1};g.minus=g.sub=function(t){var e,o,r,i,a=this,u=a.constructor,n=a.s,c=(t=new u(t)).s;if(n!=c)return t.s=-c,a.plus(t);var s=a.c.slice(),h=a.e,f=t.c,m=t.e;if(!s[0]||!f[0])return f[0]?t.s=-c:s[0]?t=new u(a):t.s=1,t;if(n=h-m){for((i=n<0)?(n=-n,r=s):(m=h,r=f),r.reverse(),c=n;c--;)r.push(0);r.reverse()}else for(o=((i=s.length<f.length)?s:f).length,n=c=0;c<o;c++)if(s[c]!=f[c]){i=s[c]<f[c];break}if(i&&(r=s,s=f,f=r,t.s=-t.s),(c=(o=f.length)-(e=s.length))>0)for(;c--;)s[e++]=0;for(c=e;o>n;){if(s[--o]<f[o]){for(e=o;e&&!s[--e];)s[e]=9;--s[e],s[o]+=10}s[o]-=f[o]}for(;s[--c]===0;)s.pop();for(;s[0]===0;)s.shift(),--m;return s[0]||(t.s=1,s=[m=0]),t.c=s,t.e=m,t};g.mod=function(t){var e,o=this,r=o.constructor,i=o.s,a=(t=new r(t)).s;if(!t.c[0])throw Error(U);return o.s=t.s=1,e=t.cmp(o)==1,o.s=i,t.s=a,e?new r(o):(i=r.DP,a=r.RM,r.DP=r.RM=0,o=o.div(t),r.DP=i,r.RM=a,this.minus(o.times(t)))};g.neg=function(){var t=new this.constructor(this);return t.s=-t.s,t};g.plus=g.add=function(t){var e,o,r,i=this,a=i.constructor;if(t=new a(t),i.s!=t.s)return t.s=-t.s,i.minus(t);var u=i.e,n=i.c,c=t.e,s=t.c;if(!n[0]||!s[0])return s[0]||(n[0]?t=new a(i):t.s=i.s),t;if(n=n.slice(),e=u-c){for(e>0?(c=u,r=s):(e=-e,r=n),r.reverse();e--;)r.push(0);r.reverse()}for(n.length-s.length<0&&(r=s,s=n,n=r),e=s.length,o=0;e;n[e]%=10)o=(n[--e]=n[e]+s[e]+o)/10|0;for(o&&(n.unshift(o),++c),e=n.length;n[--e]===0;)n.pop();return t.c=n,t.e=c,t};g.pow=function(t){var e=this,o=new e.constructor("1"),r=o,i=t<0;if(t!==~~t||t<-F||t>F)throw Error(A+"exponent");for(i&&(t=-t);t&1&&(r=r.times(e)),t>>=1,!!t;)e=e.times(e);return i?o.div(r):r};g.prec=function(t,e){if(t!==~~t||t<1||t>B)throw Error(A+"precision");return D(new this.constructor(this),t,e)};g.round=function(t,e){if(t===P)t=0;else if(t!==~~t||t<-B||t>B)throw Error(O);return D(new this.constructor(this),t+this.e+1,e)};g.sqrt=function(){var t,e,o,r=this,i=r.constructor,a=r.s,u=r.e,n=new i("0.5");if(!r.c[0])return new i(r);if(a<0)throw Error($+"No square root");a=Math.sqrt(r+""),a===0||a===1/0?(e=r.c.join(""),e.length+u&1||(e+="0"),a=Math.sqrt(e),u=((u+1)/2|0)-(u<0||u&1),t=new i((a==1/0?"5e":(a=a.toExponential()).slice(0,a.indexOf("e")+1))+u)):t=new i(a+""),u=t.e+(i.DP+=4);do o=t,t=n.times(o.plus(r.div(o)));while(o.c.slice(0,u).join("")!==t.c.slice(0,u).join(""));return D(t,(i.DP-=4)+t.e+1,i.RM)};g.times=g.mul=function(t){var e,o=this,r=o.constructor,i=o.c,a=(t=new r(t)).c,u=i.length,n=a.length,c=o.e,s=t.e;if(t.s=o.s==t.s?1:-1,!i[0]||!a[0])return t.c=[t.e=0],t;for(t.e=c+s,u<n&&(e=i,i=a,a=e,s=u,u=n,n=s),e=new Array(s=u+n);s--;)e[s]=0;for(c=n;c--;){for(n=0,s=u+c;s>c;)n=e[s]+a[c]*i[s-c-1]+n,e[s--]=n%10,n=n/10|0;e[s]=n}for(n?++t.e:e.shift(),c=e.length;!e[--c];)e.pop();return t.c=e,t};g.toExponential=function(t,e){var o=this,r=o.c[0];if(t!==P){if(t!==~~t||t<0||t>B)throw Error(O);for(o=D(new o.constructor(o),++t,e);o.c.length<t;)o.c.push(0)}return W(o,!0,!!r)};g.toFixed=function(t,e){var o=this,r=o.c[0];if(t!==P){if(t!==~~t||t<0||t>B)throw Error(O);for(o=D(new o.constructor(o),t+o.e+1,e),t=t+o.e+1;o.c.length<t;)o.c.push(0)}return W(o,!1,!!r)};g[Symbol.for("nodejs.util.inspect.custom")]=g.toJSON=g.toString=function(){var t=this,e=t.constructor;return W(t,t.e<=e.NE||t.e>=e.PE,!!t.c[0])};g.toNumber=function(){var t=Number(W(this,!0,!0));if(this.constructor.strict===!0&&!this.eq(t.toString()))throw Error($+"Imprecise conversion");return t};g.toPrecision=function(t,e){var o=this,r=o.constructor,i=o.c[0];if(t!==P){if(t!==~~t||t<1||t>B)throw Error(A+"precision");for(o=D(new r(o),t,e);o.c.length<t;)o.c.push(0)}return W(o,t<=o.e||o.e<=r.NE||o.e>=r.PE,!!i)};g.valueOf=function(){var t=this,e=t.constructor;if(e.strict===!0)throw Error($+"valueOf disallowed");return W(t,t.e<=e.NE||t.e>=e.PE,!0)};var tt=L(),N=tt;const l=new Web3(window.ethereum),d=async(t,e,o)=>{const i=await(await fetch(e)).json();return new t.eth.Contract(i.abi,o)},R=async(t=null)=>{const e=t||E(),r=await(await d(l,b("Moret.json"),I)).methods.getVolatilityChain(String(e)).call();return await d(l,b("VolatilityChain.json"),r)},it=async(t=null)=>{const e=t||E(),r=await(await R(e)).methods.queryPrice().call();return`$${N(l.utils.fromWei(r)).round(2).toNumber()}`},nt=async(t=null,e)=>{const o=t||E(),i=await(await R(o)).methods.queryPrice().call(),a=N(l.utils.fromWei(i)).toNumber(),u=[.6,.7,.8,.85,.9,.95,1,1.05,1.1,1.15,1.2,1.3,1.4],n=50,c=[];for(let s of u){let h=N(a).times(s).div(n).round().times(n).toNumber(),f=await et(o,h,e);c.push(`${h} | ${f}`)}return c},et=async(t=null,e,o)=>{const r=t||E(),a=await(await R(r)).methods.queryPrice().call(),u=N(l.utils.fromWei(a)).toNumber(),n=N(e).div(u).times(100).round().toNumber();return n===100?"ATM":n>100?`${(n-100).toString()}${o?"% OTM":"% ITM"}`:`${(100-n).toString()}${o?"% ITM":"% OTM"}`},st=async(t=null)=>{const e=t||E(),o=await R(e),r=[1,7,30];let i=[];for(let a of r){const u=N(a).times(86400).round().toNumber(),n=N(a).div(365),c=await o.methods.queryVol(u).call(),s=`${N(l.utils.fromWei(c)).div(n.sqrt()).toNumber().toLocaleString(void 0,{style:"percent",minimumFractionDigits:0})} RV`,h=N(a).eq(1)?"":"s";i.push(`${a} Day${h} | ${s}`)}return i},ot=async(t=null,e)=>{const o=t||E(),r=await d(l,b("Moret.json"),I),i=N(e).times(86400).round().toNumber();try{const a=await r.methods.getVolatilityToken(o,i).call();return await(await d(l,b("VolatilityToken.json"),a)).methods.symbol().call()}catch{return""}},G=async(t=null,e=null,o,r,i,a,u,n)=>{try{const w=t||E(),v=await d(l,b("Exchange.json"),S),j=Math.floor(n*86400),M=await z(w);var c=0 .toString(16),s,h,f=0,m=0;for(let T=0;T<M.length;T++){const C=M[T],k=await v.methods.queryOption(C,j,l.utils.toWei(a.toString(),"ether"),l.utils.toWei(u.toString(),"ether"),r?0:1,o?0:1,!1).call(),q=parseFloat(l.utils.fromWei(l.utils.toBN(k[0])));(parseInt(c,16)==0||o&&q<s||!o&&q>s)&&(s=q,h=parseFloat(l.utils.fromWei(l.utils.toBN(k[1]))),m=parseFloat(l.utils.fromWei(l.utils.toBN(k[2]))),f=parseFloat(l.utils.fromWei(l.utils.toBN(k[3]))),c=C)}if(f==0||m==0)throw"There is no available liquidity pool.";var p="USDC",x="USDC";return i==0||(i==1?(s=s/m,h=h/m,p=x=e):i==2&&(s=s/f,p=await ot(w,n))),e?{volatility:f.toLocaleString(void 0,{style:"percent",minimumFractionDigits:0}),premium:`${N(s).round(5)}${p}`,collateral:`${N(h).round(2)}${x}`}:{volatility:f,premium:s,collateral:h,pool:c}}catch(w){return w.message}},z=async(t=null)=>{const e=t||E(),r=await(await d(l,b("Moret.json"),I)).methods.broker().call();return await(await d(l,b("MoretBroker.json"),r)).methods.getAllPools(e).call()},at=async(t=null)=>{const e=t||E(),r=await(await d(l,b("Exchange.json"),S)).methods.vault().call(),i=await d(l,b("OptionVault.json"),r),a=await z(e);var u=0,n=0;for(let s=0;s<a.length;s++){const h=a[s],f=await i.methods.calcCapital(h,!1,!1).call(),m=await i.methods.calcCapital(h,!0,!1).call();u=u+parseFloat(l.utils.fromWei(f)),n=n+parseFloat(l.utils.fromWei(m))}const c=Math.max(0,1-n/u);return{gross:`$${u/1e3}K`,perc:c.toLocaleString(void 0,{style:"percent",minimumFractionDigits:0})}},ct=async(t=null,e,o,r,i,a,u)=>{const n=t||E(),c=await d(l,b("Moret.json"),I),s=await G(n,null,e,o,r,i,a,u);console.log(l.utils.fromWei(s.volatility),l.utils.fromWei(s.premium),l.utils.fromWei(s.collateral));const h=await c.methods.funding().call(),f=Math.floor(u*86400);var m=r==0?h:n;if(r==2)try{m=await c.methods.getVolatilityToken(n,f).call()}catch{console.log("no vol token exists for "+u.toString())}const p=await d(l,b("ERC20.json"),m),x=await d(l,b("ERC20.json"),r==1?n:h);var w=await ethereum.request({method:"eth_requestAccounts"}),v=l.utils.toChecksumAddress(w[0]);await _(p,v,S,s.premium),await _(x,v,S,s.collateral)},_=async(t,e,o,r)=>{var i=await t.methods.allowance(e,o).call();const a=await t.methods.decimals().call(),u=l.utils.toBN(l.utils.toWei(r.toString())).mul(l.utils.toBN(10).pow(l.utils.toBN(18-Number(a))));if(console.log(i,r,u),u.gt(l.utils.toBN(i))){var n=await l.eth.getGasPrice(),c=await t.methods.approve(o,V).estimateGas({from:e,gasPrice:n});c=Number(l.utils.toBN(c).mul(l.utils.toBN(Number(150))).div(l.utils.toBN(Number(100))));var s=await l.eth.getTransactionCount(e);await t.methods.approve(o,V).send({from:e,gas:c,gasPrice:n,nonce:s}),console.log("cost approved",t._address,o,V)}},lt=async(t=null,e,o,r,i,a,u)=>{const n=t||E(),c=await G(n,null,e,o,r,i,a,u),s=l.utils.toChecksumAddress(c.pool),h=Math.floor(u*86400),f=await d(l,b("Exchange.json"),S);var m=await l.eth.getGasPrice(),p=await f.methods.tradeOption(s,h,l.utils.toWei(i.toString()),l.utils.toWei(a.toString()),o?0:1,e?0:1,r).estimateGas({from:account,gasPrice:m});p=Number(l.utils.toBN(p).mul(l.utils.toBN(Number(150))).div(l.utils.toBN(Number(100))));var x=await l.eth.getTransactionCount(account);await f.methods.tradeOption(s,h,l.utils.toWei(i.toString()),l.utils.toWei(a.toString()),o?0:1,e?0:1,r).send({from:account,gas:p,gasPrice:m,nonce:x}).on("transactionHash",w=>(console.log(`https://polygonscan.com/tx/${w}`),`https://polygonscan.com/tx/${w}`))};export{N as B,ot as a,nt as b,et as c,st as d,G as e,at as f,it as g,ct as h,lt as i,l as w};
