var Pe=Object.defineProperty;var Ee=(t,e,r)=>e in t?Pe(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r;var Z=(t,e,r)=>Ee(t,typeof e!="symbol"?e+"":e,r);var Me=typeof global=="object"&&global&&global.Object===Object&&global,N=Me;var De=typeof self=="object"&&self&&self.Object===Object&&self,Re=N||De||Function("return this")(),d=Re;var Be=d.Symbol,_=Be;var st=Object.prototype,Le=st.hasOwnProperty,Fe=st.toString,M=_?_.toStringTag:void 0;function Ne(t){var e=Le.call(t,M),r=t[M];try{t[M]=void 0;var o=!0}catch{}var a=Fe.call(t);return o&&(e?t[M]=r:delete t[M]),a}var pt=Ne;var ze=Object.prototype,We=ze.toString;function Ue(t){return We.call(t)}var it=Ue;var Ge="[object Null]",He="[object Undefined]",nt=_?_.toStringTag:void 0;function qe(t){return t==null?t===void 0?He:Ge:nt&&nt in Object(t)?pt(t):it(t)}var h=qe;function $e(t){return t!=null&&typeof t=="object"}var x=$e;var Ke=Array.isArray,D=Ke;function Ve(t){var e=typeof t;return t!=null&&(e=="object"||e=="function")}var u=Ve;function ke(t){return t}var z=ke;var Ye="[object AsyncFunction]",Je="[object Function]",Xe="[object GeneratorFunction]",Ze="[object Proxy]";function Qe(t){if(!u(t))return!1;var e=h(t);return e==Je||e==Xe||e==Ye||e==Ze}var O=Qe;var tr=d["__core-js_shared__"],W=tr;var ut=function(){var t=/[^.]+$/.exec(W&&W.keys&&W.keys.IE_PROTO||"");return t?"Symbol(src)_1."+t:""}();function er(t){return!!ut&&ut in t}var lt=er;var rr=Function.prototype,or=rr.toString;function ar(t){if(t!=null){try{return or.call(t)}catch{}try{return t+""}catch{}}return""}var mt=ar;var fr=/[\\^$.*+?()[\]{}|]/g,sr=/^\[object .+?Constructor\]$/,pr=Function.prototype,ir=Object.prototype,nr=pr.toString,ur=ir.hasOwnProperty,lr=RegExp("^"+nr.call(ur).replace(fr,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");function mr(t){if(!u(t)||lt(t))return!1;var e=O(t)?lr:sr;return e.test(mt(t))}var dt=mr;function dr(t,e){return t==null?void 0:t[e]}var xt=dr;function xr(t,e){var r=xt(t,e);return dt(r)?r:void 0}var T=xr;var ct=Object.create,cr=function(){function t(){}return function(e){if(!u(e))return{};if(ct)return ct(e);t.prototype=e;var r=new t;return t.prototype=void 0,r}}(),ht=cr;function hr(t,e,r){switch(r.length){case 0:return t.call(e);case 1:return t.call(e,r[0]);case 2:return t.call(e,r[0],r[1]);case 3:return t.call(e,r[0],r[1],r[2])}return t.apply(e,r)}var gt=hr;function gr(t,e){var r=-1,o=t.length;for(e||(e=Array(o));++r<o;)e[r]=t[r];return e}var yt=gr;var yr=800,br=16,vr=Date.now;function _r(t){var e=0,r=0;return function(){var o=vr(),a=br-(o-r);if(r=o,a>0){if(++e>=yr)return arguments[0]}else e=0;return t.apply(void 0,arguments)}}var bt=_r;function Or(t){return function(){return t}}var vt=Or;var Tr=function(){try{var t=T(Object,"defineProperty");return t({},"",{}),t}catch{}}(),j=Tr;var jr=j?function(t,e){return j(t,"toString",{configurable:!0,enumerable:!1,value:vt(e),writable:!0})}:z,_t=jr;var wr=bt(_t),Ot=wr;var Ar=9007199254740991,Ir=/^(?:0|[1-9]\d*)$/;function Sr(t,e){var r=typeof t;return e=e==null?Ar:e,!!e&&(r=="number"||r!="symbol"&&Ir.test(t))&&t>-1&&t%1==0&&t<e}var U=Sr;function Cr(t,e,r){e=="__proto__"&&j?j(t,e,{configurable:!0,enumerable:!0,value:r,writable:!0}):t[e]=r}var w=Cr;function Pr(t,e){return t===e||t!==t&&e!==e}var g=Pr;var Er=Object.prototype,Mr=Er.hasOwnProperty;function Dr(t,e,r){var o=t[e];(!(Mr.call(t,e)&&g(o,r))||r===void 0&&!(e in t))&&w(t,e,r)}var Tt=Dr;function Rr(t,e,r,o){var a=!r;r||(r={});for(var s=-1,p=e.length;++s<p;){var f=e[s],n=o?o(r[f],t[f],f,r,t):void 0;n===void 0&&(n=t[f]),a?w(r,f,n):Tt(r,f,n)}return r}var jt=Rr;var wt=Math.max;function Br(t,e,r){return e=wt(e===void 0?t.length-1:e,0),function(){for(var o=arguments,a=-1,s=wt(o.length-e,0),p=Array(s);++a<s;)p[a]=o[e+a];a=-1;for(var f=Array(e+1);++a<e;)f[a]=o[a];return f[e]=r(p),gt(t,this,f)}}var At=Br;function Lr(t,e){return Ot(At(t,e,z),t+"")}var It=Lr;var Fr=9007199254740991;function Nr(t){return typeof t=="number"&&t>-1&&t%1==0&&t<=Fr}var G=Nr;function zr(t){return t!=null&&G(t.length)&&!O(t)}var A=zr;function Wr(t,e,r){if(!u(r))return!1;var o=typeof e;return(o=="number"?A(r)&&U(e,r.length):o=="string"&&e in r)?g(r[e],t):!1}var St=Wr;function Ur(t){return It(function(e,r){var o=-1,a=r.length,s=a>1?r[a-1]:void 0,p=a>2?r[2]:void 0;for(s=t.length>3&&typeof s=="function"?(a--,s):void 0,p&&St(r[0],r[1],p)&&(s=a<3?void 0:s,a=1),e=Object(e);++o<a;){var f=r[o];f&&t(e,f,o,s)}return e})}var Ct=Ur;var Gr=Object.prototype;function Hr(t){var e=t&&t.constructor,r=typeof e=="function"&&e.prototype||Gr;return t===r}var H=Hr;function qr(t,e){for(var r=-1,o=Array(t);++r<t;)o[r]=e(r);return o}var Pt=qr;var $r="[object Arguments]";function Kr(t){return x(t)&&h(t)==$r}var Q=Kr;var Et=Object.prototype,Vr=Et.hasOwnProperty,kr=Et.propertyIsEnumerable,Yr=Q(function(){return arguments}())?Q:function(t){return x(t)&&Vr.call(t,"callee")&&!kr.call(t,"callee")},R=Yr;function Jr(){return!1}var Mt=Jr;var Bt=typeof exports=="object"&&exports&&!exports.nodeType&&exports,Dt=Bt&&typeof module=="object"&&module&&!module.nodeType&&module,Xr=Dt&&Dt.exports===Bt,Rt=Xr?d.Buffer:void 0,Zr=Rt?Rt.isBuffer:void 0,Qr=Zr||Mt,q=Qr;var to="[object Arguments]",eo="[object Array]",ro="[object Boolean]",oo="[object Date]",ao="[object Error]",fo="[object Function]",so="[object Map]",po="[object Number]",io="[object Object]",no="[object RegExp]",uo="[object Set]",lo="[object String]",mo="[object WeakMap]",xo="[object ArrayBuffer]",co="[object DataView]",ho="[object Float32Array]",go="[object Float64Array]",yo="[object Int8Array]",bo="[object Int16Array]",vo="[object Int32Array]",_o="[object Uint8Array]",Oo="[object Uint8ClampedArray]",To="[object Uint16Array]",jo="[object Uint32Array]",i={};i[ho]=i[go]=i[yo]=i[bo]=i[vo]=i[_o]=i[Oo]=i[To]=i[jo]=!0;i[to]=i[eo]=i[xo]=i[ro]=i[co]=i[oo]=i[ao]=i[fo]=i[so]=i[po]=i[io]=i[no]=i[uo]=i[lo]=i[mo]=!1;function wo(t){return x(t)&&G(t.length)&&!!i[h(t)]}var Lt=wo;function Ao(t){return function(e){return t(e)}}var Ft=Ao;var Nt=typeof exports=="object"&&exports&&!exports.nodeType&&exports,B=Nt&&typeof module=="object"&&module&&!module.nodeType&&module,Io=B&&B.exports===Nt,tt=Io&&N.process,So=function(){try{var t=B&&B.require&&B.require("util").types;return t||tt&&tt.binding&&tt.binding("util")}catch{}}(),et=So;var zt=et&&et.isTypedArray,Co=zt?Ft(zt):Lt,$=Co;var Po=Object.prototype,Eo=Po.hasOwnProperty;function Mo(t,e){var r=D(t),o=!r&&R(t),a=!r&&!o&&q(t),s=!r&&!o&&!a&&$(t),p=r||o||a||s,f=p?Pt(t.length,String):[],n=f.length;for(var m in t)(e||Eo.call(t,m))&&!(p&&(m=="length"||a&&(m=="offset"||m=="parent")||s&&(m=="buffer"||m=="byteLength"||m=="byteOffset")||U(m,n)))&&f.push(m);return f}var Wt=Mo;function Do(t,e){return function(r){return t(e(r))}}var Ut=Do;function Ro(t){var e=[];if(t!=null)for(var r in Object(t))e.push(r);return e}var Gt=Ro;var Bo=Object.prototype,Lo=Bo.hasOwnProperty;function Fo(t){if(!u(t))return Gt(t);var e=H(t),r=[];for(var o in t)o=="constructor"&&(e||!Lo.call(t,o))||r.push(o);return r}var Ht=Fo;function No(t){return A(t)?Wt(t,!0):Ht(t)}var K=No;var zo=T(Object,"create"),c=zo;function Wo(){this.__data__=c?c(null):{},this.size=0}var qt=Wo;function Uo(t){var e=this.has(t)&&delete this.__data__[t];return this.size-=e?1:0,e}var $t=Uo;var Go="__lodash_hash_undefined__",Ho=Object.prototype,qo=Ho.hasOwnProperty;function $o(t){var e=this.__data__;if(c){var r=e[t];return r===Go?void 0:r}return qo.call(e,t)?e[t]:void 0}var Kt=$o;var Ko=Object.prototype,Vo=Ko.hasOwnProperty;function ko(t){var e=this.__data__;return c?e[t]!==void 0:Vo.call(e,t)}var Vt=ko;var Yo="__lodash_hash_undefined__";function Jo(t,e){var r=this.__data__;return this.size+=this.has(t)?0:1,r[t]=c&&e===void 0?Yo:e,this}var kt=Jo;function I(t){var e=-1,r=t==null?0:t.length;for(this.clear();++e<r;){var o=t[e];this.set(o[0],o[1])}}I.prototype.clear=qt;I.prototype.delete=$t;I.prototype.get=Kt;I.prototype.has=Vt;I.prototype.set=kt;var rt=I;function Xo(){this.__data__=[],this.size=0}var Yt=Xo;function Zo(t,e){for(var r=t.length;r--;)if(g(t[r][0],e))return r;return-1}var y=Zo;var Qo=Array.prototype,ta=Qo.splice;function ea(t){var e=this.__data__,r=y(e,t);if(r<0)return!1;var o=e.length-1;return r==o?e.pop():ta.call(e,r,1),--this.size,!0}var Jt=ea;function ra(t){var e=this.__data__,r=y(e,t);return r<0?void 0:e[r][1]}var Xt=ra;function oa(t){return y(this.__data__,t)>-1}var Zt=oa;function aa(t,e){var r=this.__data__,o=y(r,t);return o<0?(++this.size,r.push([t,e])):r[o][1]=e,this}var Qt=aa;function S(t){var e=-1,r=t==null?0:t.length;for(this.clear();++e<r;){var o=t[e];this.set(o[0],o[1])}}S.prototype.clear=Yt;S.prototype.delete=Jt;S.prototype.get=Xt;S.prototype.has=Zt;S.prototype.set=Qt;var b=S;var fa=T(d,"Map"),V=fa;function sa(){this.size=0,this.__data__={hash:new rt,map:new(V||b),string:new rt}}var te=sa;function pa(t){var e=typeof t;return e=="string"||e=="number"||e=="symbol"||e=="boolean"?t!=="__proto__":t===null}var ee=pa;function ia(t,e){var r=t.__data__;return ee(e)?r[typeof e=="string"?"string":"hash"]:r.map}var v=ia;function na(t){var e=v(this,t).delete(t);return this.size-=e?1:0,e}var re=na;function ua(t){return v(this,t).get(t)}var oe=ua;function la(t){return v(this,t).has(t)}var ae=la;function ma(t,e){var r=v(this,t),o=r.size;return r.set(t,e),this.size+=r.size==o?0:1,this}var fe=ma;function C(t){var e=-1,r=t==null?0:t.length;for(this.clear();++e<r;){var o=t[e];this.set(o[0],o[1])}}C.prototype.clear=te;C.prototype.delete=re;C.prototype.get=oe;C.prototype.has=ae;C.prototype.set=fe;var se=C;var da=Ut(Object.getPrototypeOf,Object),k=da;var xa="[object Object]",ca=Function.prototype,ha=Object.prototype,pe=ca.toString,ga=ha.hasOwnProperty,ya=pe.call(Object);function ba(t){if(!x(t)||h(t)!=xa)return!1;var e=k(t);if(e===null)return!0;var r=ga.call(e,"constructor")&&e.constructor;return typeof r=="function"&&r instanceof r&&pe.call(r)==ya}var ie=ba;function va(){this.__data__=new b,this.size=0}var ne=va;function _a(t){var e=this.__data__,r=e.delete(t);return this.size=e.size,r}var ue=_a;function Oa(t){return this.__data__.get(t)}var le=Oa;function Ta(t){return this.__data__.has(t)}var me=Ta;var ja=200;function wa(t,e){var r=this.__data__;if(r instanceof b){var o=r.__data__;if(!V||o.length<ja-1)return o.push([t,e]),this.size=++r.size,this;r=this.__data__=new se(o)}return r.set(t,e),this.size=r.size,this}var de=wa;function P(t){var e=this.__data__=new b(t);this.size=e.size}P.prototype.clear=ne;P.prototype.delete=ue;P.prototype.get=le;P.prototype.has=me;P.prototype.set=de;var xe=P;var ye=typeof exports=="object"&&exports&&!exports.nodeType&&exports,ce=ye&&typeof module=="object"&&module&&!module.nodeType&&module,Aa=ce&&ce.exports===ye,he=Aa?d.Buffer:void 0,ge=he?he.allocUnsafe:void 0;function Ia(t,e){if(e)return t.slice();var r=t.length,o=ge?ge(r):new t.constructor(r);return t.copy(o),o}var be=Ia;var Sa=d.Uint8Array,ot=Sa;function Ca(t){var e=new t.constructor(t.byteLength);return new ot(e).set(new ot(t)),e}var ve=Ca;function Pa(t,e){var r=e?ve(t.buffer):t.buffer;return new t.constructor(r,t.byteOffset,t.length)}var _e=Pa;function Ea(t){return typeof t.constructor=="function"&&!H(t)?ht(k(t)):{}}var Oe=Ea;function Ma(t){return function(e,r,o){for(var a=-1,s=Object(e),p=o(e),f=p.length;f--;){var n=p[t?f:++a];if(r(s[n],n,s)===!1)break}return e}}var Te=Ma;var Da=Te(),je=Da;function Ra(t,e,r){(r!==void 0&&!g(t[e],r)||r===void 0&&!(e in t))&&w(t,e,r)}var L=Ra;function Ba(t){return x(t)&&A(t)}var we=Ba;function La(t,e){if(!(e==="constructor"&&typeof t[e]=="function")&&e!="__proto__")return t[e]}var F=La;function Fa(t){return jt(t,K(t))}var Ae=Fa;function Na(t,e,r,o,a,s,p){var f=F(t,r),n=F(e,r),m=p.get(n);if(m){L(t,r,m);return}var l=s?s(f,n,r+"",t,e,p):void 0,E=l===void 0;if(E){var J=D(n),X=!J&&q(n),ft=!J&&!X&&$(n);l=n,J||X||ft?D(f)?l=f:we(f)?l=yt(f):X?(E=!1,l=be(n,!0)):ft?(E=!1,l=_e(n,!0)):l=[]:ie(n)||R(n)?(l=f,R(f)?l=Ae(f):(!u(f)||O(f))&&(l=Oe(n))):E=!1}E&&(p.set(n,l),a(l,n,o,s,p),p.delete(n)),L(t,r,l)}var Ie=Na;function Se(t,e,r,o,a){t!==e&&je(e,function(s,p){if(a||(a=new xe),u(s))Ie(t,e,p,r,Se,o,a);else{var f=o?o(F(t,p),s,p+"",t,e,a):void 0;f===void 0&&(f=s),L(t,p,f)}},K)}var Ce=Se;var za=Ct(function(t,e,r){Ce(t,e,r)}),Y=za;var at=class{constructor(e){Z(this,"settings",{client:"tera-fy",clientType:"esm"});Z(this,"bootstrapperDeferredMethods",[]);e&&Y(this.settings,e),["set","setIfDev","use"].forEach(r=>{this[r]=(...o)=>(this.bootstrapperDeferredMethods.push({method:r,args:o}),this)})}init(e){let r=o=>`https://dev.tera-tools.com/api/tera-fy/${o}.js`;return Promise.resolve().then(()=>this.settings.clientType=="esm"?this.bootstrapperImport(r(this.settings.client)).then(o=>typeof o=="function"?o:Promise.reject("Tera-fy import didn't return a class")):Promise.reject(`Unsupported TERA-fy clientType "${this.settings.clientType}"`)).then(o=>{let a=new o;if(!a.mixin)throw new Error("TERA-fy client doesnt expose a mixin() method");a.mixin(this,a),Y(this.settings,a.settings,this.settings)}).then(()=>{if(console.log("IAM",this),!this.init||typeof this.init!="function")throw new Error("Newly mixed-in TERA-fy client doesnt expose a init() method");if(!this.detectMode||typeof this.detectMode!="function")throw new Error("Newly mixed-in TERA-fy client doesnt expose a detectMode() method")}).then(()=>this.bootstrapperDeferredMethods.reduce((o,a)=>a.method=="use"&&typeof a.args[0]=="string"?(console.log("TERA-FY DEFERRED-USE",a.args[0]),this.bootstrapperImport(r(a.args[0])).then(s=>typeof s=="function"?s:Promise.reject("Tera-fy plugin import didn't return a class")).then(s=>this.use(s,...a.args.slice(1)))):(console.log("TERA-FY DEFERRED-METHOD",a),this[a.method].apply(this,a.args))),Promise.resolve()).then(()=>delete this.bootstrapperDeferredMethods).then(()=>console.log("TYBS","Init")).then(()=>this.init.call(this,e))}bootstrapperImport(e){return new Promise((r,o)=>{let a=`installTFyBS${Math.random().toString(36).slice(2)}`,s=document.createElement("script");s.type="module",s.textContent=`
				import mod from '${e}';
				window['installMod${a}'](mod);
			`;let p=()=>console.warn("CLEANUP",a);window[`installMod${a}`]=f=>{console.log("Accept module from",e,"=",f),r(f),p()},s.onerror=f=>{o(new Error(`Failed to load module from ${e} - ${f.toString()}`)),p()},document.head.appendChild(s)})}};export{at as default};
/*! Bundled license information:

lodash-es/lodash.js:
  (**
   * @license
   * Lodash (Custom Build) <https://lodash.com/>
   * Build: `lodash modularize exports="es" -o ./`
   * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
   * Released under MIT license <https://lodash.com/license>
   * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
   * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   *)
*/
