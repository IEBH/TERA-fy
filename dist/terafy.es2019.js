var mo=typeof global=="object"&&global&&global.Object===Object&&global,ut=mo;var uo=typeof self=="object"&&self&&self.Object===Object&&self,co=ut||uo||Function("return this")(),d=co;var ho=d.Symbol,g=ho;var qt=Object.prototype,xo=qt.hasOwnProperty,go=qt.toString,it=g?g.toStringTag:void 0;function yo(t){var e=xo.call(t,it),r=t[it];try{t[it]=void 0;var o=!0}catch{}var a=go.call(t);return o&&(e?t[it]=r:delete t[it]),a}var Yt=yo;var bo=Object.prototype,vo=bo.toString;function wo(t){return vo.call(t)}var Zt=wo;var To="[object Null]",Po="[object Undefined]",Jt=g?g.toStringTag:void 0;function jo(t){return t==null?t===void 0?Po:To:Jt&&Jt in Object(t)?Yt(t):Zt(t)}var T=jo;function Ao(t){return t!=null&&typeof t=="object"}var w=Ao;var Oo="[object Symbol]";function So(t){return typeof t=="symbol"||w(t)&&T(t)==Oo}var B=So;function Io(t,e){for(var r=-1,o=t==null?0:t.length,a=Array(o);++r<o;)a[r]=e(t[r],r,t);return a}var Xt=Io;var _o=Array.isArray,x=_o;var Eo=1/0,Qt=g?g.prototype:void 0,te=Qt?Qt.toString:void 0;function ee(t){if(typeof t=="string")return t;if(x(t))return Xt(t,ee)+"";if(B(t))return te?te.call(t):"";var e=t+"";return e=="0"&&1/t==-Eo?"-0":e}var re=ee;function Fo(t){var e=typeof t;return t!=null&&(e=="object"||e=="function")}var v=Fo;function Co(t){return t}var oe=Co;var No="[object AsyncFunction]",Mo="[object Function]",Ro="[object GeneratorFunction]",Lo="[object Proxy]";function Bo(t){if(!v(t))return!1;var e=T(t);return e==Mo||e==Ro||e==No||e==Lo}var dt=Bo;var ko=d["__core-js_shared__"],ct=ko;var ae=function(){var t=/[^.]+$/.exec(ct&&ct.keys&&ct.keys.IE_PROTO||"");return t?"Symbol(src)_1."+t:""}();function Uo(t){return!!ae&&ae in t}var ie=Uo;var Do=Function.prototype,zo=Do.toString;function Go(t){if(t!=null){try{return zo.call(t)}catch{}try{return t+""}catch{}}return""}var j=Go;var Wo=/[\\^$.*+?()[\]{}|]/g,Ko=/^\[object .+?Constructor\]$/,$o=Function.prototype,Ho=Object.prototype,Vo=$o.toString,qo=Ho.hasOwnProperty,Yo=RegExp("^"+Vo.call(qo).replace(Wo,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");function Zo(t){if(!v(t)||ie(t))return!1;var e=dt(t)?Yo:Ko;return e.test(j(t))}var se=Zo;function Jo(t,e){return t==null?void 0:t[e]}var ne=Jo;function Xo(t,e){var r=ne(t,e);return se(r)?r:void 0}var y=Xo;var Qo=y(d,"WeakMap"),ht=Qo;var fe=Object.create,ta=function(){function t(){}return function(e){if(!v(e))return{};if(fe)return fe(e);t.prototype=e;var r=new t;return t.prototype=void 0,r}}(),pe=ta;function ea(t,e,r){switch(r.length){case 0:return t.call(e);case 1:return t.call(e,r[0]);case 2:return t.call(e,r[0],r[1]);case 3:return t.call(e,r[0],r[1],r[2])}return t.apply(e,r)}var le=ea;function ra(t,e){var r=-1,o=t.length;for(e||(e=Array(o));++r<o;)e[r]=t[r];return e}var me=ra;var oa=800,aa=16,ia=Date.now;function sa(t){var e=0,r=0;return function(){var o=ia(),a=aa-(o-r);if(r=o,a>0){if(++e>=oa)return arguments[0]}else e=0;return t.apply(void 0,arguments)}}var ue=sa;function na(t){return function(){return t}}var de=na;var fa=function(){try{var t=y(Object,"defineProperty");return t({},"",{}),t}catch{}}(),k=fa;var pa=k?function(t,e){return k(t,"toString",{configurable:!0,enumerable:!1,value:de(e),writable:!0})}:oe,ce=pa;var la=ue(ce),he=la;function ma(t,e){for(var r=-1,o=t==null?0:t.length;++r<o&&e(t[r],r,t)!==!1;);return t}var xe=ma;var ua=9007199254740991,da=/^(?:0|[1-9]\d*)$/;function ca(t,e){var r=typeof t;return e=e==null?ua:e,!!e&&(r=="number"||r!="symbol"&&da.test(t))&&t>-1&&t%1==0&&t<e}var U=ca;function ha(t,e,r){e=="__proto__"&&k?k(t,e,{configurable:!0,enumerable:!0,value:r,writable:!0}):t[e]=r}var xt=ha;function xa(t,e){return t===e||t!==t&&e!==e}var gt=xa;var ga=Object.prototype,ya=ga.hasOwnProperty;function ba(t,e,r){var o=t[e];(!(ya.call(t,e)&&gt(o,r))||r===void 0&&!(e in t))&&xt(t,e,r)}var D=ba;function va(t,e,r,o){var a=!r;r||(r={});for(var s=-1,i=e.length;++s<i;){var n=e[s],u=o?o(r[n],t[n],n,r,t):void 0;u===void 0&&(u=t[n]),a?xt(r,n,u):D(r,n,u)}return r}var S=va;var ge=Math.max;function wa(t,e,r){return e=ge(e===void 0?t.length-1:e,0),function(){for(var o=arguments,a=-1,s=ge(o.length-e,0),i=Array(s);++a<s;)i[a]=o[e+a];a=-1;for(var n=Array(e+1);++a<e;)n[a]=o[a];return n[e]=r(i),le(t,this,n)}}var ye=wa;var Ta=9007199254740991;function Pa(t){return typeof t=="number"&&t>-1&&t%1==0&&t<=Ta}var z=Pa;function ja(t){return t!=null&&z(t.length)&&!dt(t)}var yt=ja;var Aa=Object.prototype;function Oa(t){var e=t&&t.constructor,r=typeof e=="function"&&e.prototype||Aa;return t===r}var G=Oa;function Sa(t,e){for(var r=-1,o=Array(t);++r<t;)o[r]=e(r);return o}var be=Sa;var Ia="[object Arguments]";function _a(t){return w(t)&&T(t)==Ia}var Ct=_a;var ve=Object.prototype,Ea=ve.hasOwnProperty,Fa=ve.propertyIsEnumerable,Ca=Ct(function(){return arguments}())?Ct:function(t){return w(t)&&Ea.call(t,"callee")&&!Fa.call(t,"callee")},W=Ca;function Na(){return!1}var we=Na;var je=typeof exports=="object"&&exports&&!exports.nodeType&&exports,Te=je&&typeof module=="object"&&module&&!module.nodeType&&module,Ma=Te&&Te.exports===je,Pe=Ma?d.Buffer:void 0,Ra=Pe?Pe.isBuffer:void 0,La=Ra||we,bt=La;var Ba="[object Arguments]",ka="[object Array]",Ua="[object Boolean]",Da="[object Date]",za="[object Error]",Ga="[object Function]",Wa="[object Map]",Ka="[object Number]",$a="[object Object]",Ha="[object RegExp]",Va="[object Set]",qa="[object String]",Ya="[object WeakMap]",Za="[object ArrayBuffer]",Ja="[object DataView]",Xa="[object Float32Array]",Qa="[object Float64Array]",ti="[object Int8Array]",ei="[object Int16Array]",ri="[object Int32Array]",oi="[object Uint8Array]",ai="[object Uint8ClampedArray]",ii="[object Uint16Array]",si="[object Uint32Array]",m={};m[Xa]=m[Qa]=m[ti]=m[ei]=m[ri]=m[oi]=m[ai]=m[ii]=m[si]=!0;m[Ba]=m[ka]=m[Za]=m[Ua]=m[Ja]=m[Da]=m[za]=m[Ga]=m[Wa]=m[Ka]=m[$a]=m[Ha]=m[Va]=m[qa]=m[Ya]=!1;function ni(t){return w(t)&&z(t.length)&&!!m[T(t)]}var Ae=ni;function fi(t){return function(e){return t(e)}}var K=fi;var Oe=typeof exports=="object"&&exports&&!exports.nodeType&&exports,st=Oe&&typeof module=="object"&&module&&!module.nodeType&&module,pi=st&&st.exports===Oe,Nt=pi&&ut.process,li=function(){try{var t=st&&st.require&&st.require("util").types;return t||Nt&&Nt.binding&&Nt.binding("util")}catch{}}(),A=li;var Se=A&&A.isTypedArray,mi=Se?K(Se):Ae,Ie=mi;var ui=Object.prototype,di=ui.hasOwnProperty;function ci(t,e){var r=x(t),o=!r&&W(t),a=!r&&!o&&bt(t),s=!r&&!o&&!a&&Ie(t),i=r||o||a||s,n=i?be(t.length,String):[],u=n.length;for(var c in t)(e||di.call(t,c))&&!(i&&(c=="length"||a&&(c=="offset"||c=="parent")||s&&(c=="buffer"||c=="byteLength"||c=="byteOffset")||U(c,u)))&&n.push(c);return n}var vt=ci;function hi(t,e){return function(r){return t(e(r))}}var wt=hi;var xi=wt(Object.keys,Object),_e=xi;var gi=Object.prototype,yi=gi.hasOwnProperty;function bi(t){if(!G(t))return _e(t);var e=[];for(var r in Object(t))yi.call(t,r)&&r!="constructor"&&e.push(r);return e}var Ee=bi;function vi(t){return yt(t)?vt(t):Ee(t)}var $=vi;function wi(t){var e=[];if(t!=null)for(var r in Object(t))e.push(r);return e}var Fe=wi;var Ti=Object.prototype,Pi=Ti.hasOwnProperty;function ji(t){if(!v(t))return Fe(t);var e=G(t),r=[];for(var o in t)o=="constructor"&&(e||!Pi.call(t,o))||r.push(o);return r}var Ce=ji;function Ai(t){return yt(t)?vt(t,!0):Ce(t)}var H=Ai;var Oi=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,Si=/^\w*$/;function Ii(t,e){if(x(t))return!1;var r=typeof t;return r=="number"||r=="symbol"||r=="boolean"||t==null||B(t)?!0:Si.test(t)||!Oi.test(t)||e!=null&&t in Object(e)}var Ne=Ii;var _i=y(Object,"create"),O=_i;function Ei(){this.__data__=O?O(null):{},this.size=0}var Me=Ei;function Fi(t){var e=this.has(t)&&delete this.__data__[t];return this.size-=e?1:0,e}var Re=Fi;var Ci="__lodash_hash_undefined__",Ni=Object.prototype,Mi=Ni.hasOwnProperty;function Ri(t){var e=this.__data__;if(O){var r=e[t];return r===Ci?void 0:r}return Mi.call(e,t)?e[t]:void 0}var Le=Ri;var Li=Object.prototype,Bi=Li.hasOwnProperty;function ki(t){var e=this.__data__;return O?e[t]!==void 0:Bi.call(e,t)}var Be=ki;var Ui="__lodash_hash_undefined__";function Di(t,e){var r=this.__data__;return this.size+=this.has(t)?0:1,r[t]=O&&e===void 0?Ui:e,this}var ke=Di;function V(t){var e=-1,r=t==null?0:t.length;for(this.clear();++e<r;){var o=t[e];this.set(o[0],o[1])}}V.prototype.clear=Me;V.prototype.delete=Re;V.prototype.get=Le;V.prototype.has=Be;V.prototype.set=ke;var Mt=V;function zi(){this.__data__=[],this.size=0}var Ue=zi;function Gi(t,e){for(var r=t.length;r--;)if(gt(t[r][0],e))return r;return-1}var I=Gi;var Wi=Array.prototype,Ki=Wi.splice;function $i(t){var e=this.__data__,r=I(e,t);if(r<0)return!1;var o=e.length-1;return r==o?e.pop():Ki.call(e,r,1),--this.size,!0}var De=$i;function Hi(t){var e=this.__data__,r=I(e,t);return r<0?void 0:e[r][1]}var ze=Hi;function Vi(t){return I(this.__data__,t)>-1}var Ge=Vi;function qi(t,e){var r=this.__data__,o=I(r,t);return o<0?(++this.size,r.push([t,e])):r[o][1]=e,this}var We=qi;function q(t){var e=-1,r=t==null?0:t.length;for(this.clear();++e<r;){var o=t[e];this.set(o[0],o[1])}}q.prototype.clear=Ue;q.prototype.delete=De;q.prototype.get=ze;q.prototype.has=Ge;q.prototype.set=We;var _=q;var Yi=y(d,"Map"),E=Yi;function Zi(){this.size=0,this.__data__={hash:new Mt,map:new(E||_),string:new Mt}}var Ke=Zi;function Ji(t){var e=typeof t;return e=="string"||e=="number"||e=="symbol"||e=="boolean"?t!=="__proto__":t===null}var $e=Ji;function Xi(t,e){var r=t.__data__;return $e(e)?r[typeof e=="string"?"string":"hash"]:r.map}var F=Xi;function Qi(t){var e=F(this,t).delete(t);return this.size-=e?1:0,e}var He=Qi;function ts(t){return F(this,t).get(t)}var Ve=ts;function es(t){return F(this,t).has(t)}var qe=es;function rs(t,e){var r=F(this,t),o=r.size;return r.set(t,e),this.size+=r.size==o?0:1,this}var Ye=rs;function Y(t){var e=-1,r=t==null?0:t.length;for(this.clear();++e<r;){var o=t[e];this.set(o[0],o[1])}}Y.prototype.clear=Ke;Y.prototype.delete=He;Y.prototype.get=Ve;Y.prototype.has=qe;Y.prototype.set=Ye;var nt=Y;var os="Expected a function";function Rt(t,e){if(typeof t!="function"||e!=null&&typeof e!="function")throw new TypeError(os);var r=function(){var o=arguments,a=e?e.apply(this,o):o[0],s=r.cache;if(s.has(a))return s.get(a);var i=t.apply(this,o);return r.cache=s.set(a,i)||s,i};return r.cache=new(Rt.Cache||nt),r}Rt.Cache=nt;var Ze=Rt;var as=500;function is(t){var e=Ze(t,function(o){return r.size===as&&r.clear(),o}),r=e.cache;return e}var Je=is;var ss=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,ns=/\\(\\)?/g,fs=Je(function(t){var e=[];return t.charCodeAt(0)===46&&e.push(""),t.replace(ss,function(r,o,a,s){e.push(a?s.replace(ns,"$1"):o||r)}),e}),Xe=fs;function ps(t){return t==null?"":re(t)}var Qe=ps;function ls(t,e){return x(t)?t:Ne(t,e)?[t]:Xe(Qe(t))}var C=ls;var ms=1/0;function us(t){if(typeof t=="string"||B(t))return t;var e=t+"";return e=="0"&&1/t==-ms?"-0":e}var Z=us;function ds(t,e){e=C(e,t);for(var r=0,o=e.length;t!=null&&r<o;)t=t[Z(e[r++])];return r&&r==o?t:void 0}var tr=ds;function cs(t,e){for(var r=-1,o=e.length,a=t.length;++r<o;)t[a+r]=e[r];return t}var J=cs;var er=g?g.isConcatSpreadable:void 0;function hs(t){return x(t)||W(t)||!!(er&&t&&t[er])}var rr=hs;function or(t,e,r,o,a){var s=-1,i=t.length;for(r||(r=rr),a||(a=[]);++s<i;){var n=t[s];e>0&&r(n)?e>1?or(n,e-1,r,o,a):J(a,n):o||(a[a.length]=n)}return a}var ar=or;function xs(t){var e=t==null?0:t.length;return e?ar(t,1):[]}var ir=xs;function gs(t){return he(ye(t,void 0,ir),t+"")}var sr=gs;var ys=wt(Object.getPrototypeOf,Object),Tt=ys;function bs(){this.__data__=new _,this.size=0}var nr=bs;function vs(t){var e=this.__data__,r=e.delete(t);return this.size=e.size,r}var fr=vs;function ws(t){return this.__data__.get(t)}var pr=ws;function Ts(t){return this.__data__.has(t)}var lr=Ts;var Ps=200;function js(t,e){var r=this.__data__;if(r instanceof _){var o=r.__data__;if(!E||o.length<Ps-1)return o.push([t,e]),this.size=++r.size,this;r=this.__data__=new nt(o)}return r.set(t,e),this.size=r.size,this}var mr=js;function X(t){var e=this.__data__=new _(t);this.size=e.size}X.prototype.clear=nr;X.prototype.delete=fr;X.prototype.get=pr;X.prototype.has=lr;X.prototype.set=mr;var ur=X;function As(t,e){return t&&S(e,$(e),t)}var dr=As;function Os(t,e){return t&&S(e,H(e),t)}var cr=Os;var yr=typeof exports=="object"&&exports&&!exports.nodeType&&exports,hr=yr&&typeof module=="object"&&module&&!module.nodeType&&module,Ss=hr&&hr.exports===yr,xr=Ss?d.Buffer:void 0,gr=xr?xr.allocUnsafe:void 0;function Is(t,e){if(e)return t.slice();var r=t.length,o=gr?gr(r):new t.constructor(r);return t.copy(o),o}var br=Is;function _s(t,e){for(var r=-1,o=t==null?0:t.length,a=0,s=[];++r<o;){var i=t[r];e(i,r,t)&&(s[a++]=i)}return s}var vr=_s;function Es(){return[]}var Pt=Es;var Fs=Object.prototype,Cs=Fs.propertyIsEnumerable,wr=Object.getOwnPropertySymbols,Ns=wr?function(t){return t==null?[]:(t=Object(t),vr(wr(t),function(e){return Cs.call(t,e)}))}:Pt,Q=Ns;function Ms(t,e){return S(t,Q(t),e)}var Tr=Ms;var Rs=Object.getOwnPropertySymbols,Ls=Rs?function(t){for(var e=[];t;)J(e,Q(t)),t=Tt(t);return e}:Pt,jt=Ls;function Bs(t,e){return S(t,jt(t),e)}var Pr=Bs;function ks(t,e,r){var o=e(t);return x(t)?o:J(o,r(t))}var At=ks;function Us(t){return At(t,$,Q)}var jr=Us;function Ds(t){return At(t,H,jt)}var Ar=Ds;var zs=y(d,"DataView"),Ot=zs;var Gs=y(d,"Promise"),St=Gs;var Ws=y(d,"Set"),It=Ws;var Or="[object Map]",Ks="[object Object]",Sr="[object Promise]",Ir="[object Set]",_r="[object WeakMap]",Er="[object DataView]",$s=j(Ot),Hs=j(E),Vs=j(St),qs=j(It),Ys=j(ht),R=T;(Ot&&R(new Ot(new ArrayBuffer(1)))!=Er||E&&R(new E)!=Or||St&&R(St.resolve())!=Sr||It&&R(new It)!=Ir||ht&&R(new ht)!=_r)&&(R=function(t){var e=T(t),r=e==Ks?t.constructor:void 0,o=r?j(r):"";if(o)switch(o){case $s:return Er;case Hs:return Or;case Vs:return Sr;case qs:return Ir;case Ys:return _r}return e});var tt=R;var Zs=Object.prototype,Js=Zs.hasOwnProperty;function Xs(t){var e=t.length,r=new t.constructor(e);return e&&typeof t[0]=="string"&&Js.call(t,"index")&&(r.index=t.index,r.input=t.input),r}var Fr=Xs;var Qs=d.Uint8Array,Lt=Qs;function tn(t){var e=new t.constructor(t.byteLength);return new Lt(e).set(new Lt(t)),e}var et=tn;function en(t,e){var r=e?et(t.buffer):t.buffer;return new t.constructor(r,t.byteOffset,t.byteLength)}var Cr=en;var rn=/\w*$/;function on(t){var e=new t.constructor(t.source,rn.exec(t));return e.lastIndex=t.lastIndex,e}var Nr=on;var Mr=g?g.prototype:void 0,Rr=Mr?Mr.valueOf:void 0;function an(t){return Rr?Object(Rr.call(t)):{}}var Lr=an;function sn(t,e){var r=e?et(t.buffer):t.buffer;return new t.constructor(r,t.byteOffset,t.length)}var Br=sn;var nn="[object Boolean]",fn="[object Date]",pn="[object Map]",ln="[object Number]",mn="[object RegExp]",un="[object Set]",dn="[object String]",cn="[object Symbol]",hn="[object ArrayBuffer]",xn="[object DataView]",gn="[object Float32Array]",yn="[object Float64Array]",bn="[object Int8Array]",vn="[object Int16Array]",wn="[object Int32Array]",Tn="[object Uint8Array]",Pn="[object Uint8ClampedArray]",jn="[object Uint16Array]",An="[object Uint32Array]";function On(t,e,r){var o=t.constructor;switch(e){case hn:return et(t);case nn:case fn:return new o(+t);case xn:return Cr(t,r);case gn:case yn:case bn:case vn:case wn:case Tn:case Pn:case jn:case An:return Br(t,r);case pn:return new o;case ln:case dn:return new o(t);case mn:return Nr(t);case un:return new o;case cn:return Lr(t)}}var kr=On;function Sn(t){return typeof t.constructor=="function"&&!G(t)?pe(Tt(t)):{}}var Ur=Sn;var In="[object Map]";function _n(t){return w(t)&&tt(t)==In}var Dr=_n;var zr=A&&A.isMap,En=zr?K(zr):Dr,Gr=En;var Fn="[object Set]";function Cn(t){return w(t)&&tt(t)==Fn}var Wr=Cn;var Kr=A&&A.isSet,Nn=Kr?K(Kr):Wr,$r=Nn;var Mn=1,Rn=2,Ln=4,Hr="[object Arguments]",Bn="[object Array]",kn="[object Boolean]",Un="[object Date]",Dn="[object Error]",Vr="[object Function]",zn="[object GeneratorFunction]",Gn="[object Map]",Wn="[object Number]",qr="[object Object]",Kn="[object RegExp]",$n="[object Set]",Hn="[object String]",Vn="[object Symbol]",qn="[object WeakMap]",Yn="[object ArrayBuffer]",Zn="[object DataView]",Jn="[object Float32Array]",Xn="[object Float64Array]",Qn="[object Int8Array]",tf="[object Int16Array]",ef="[object Int32Array]",rf="[object Uint8Array]",of="[object Uint8ClampedArray]",af="[object Uint16Array]",sf="[object Uint32Array]",l={};l[Hr]=l[Bn]=l[Yn]=l[Zn]=l[kn]=l[Un]=l[Jn]=l[Xn]=l[Qn]=l[tf]=l[ef]=l[Gn]=l[Wn]=l[qr]=l[Kn]=l[$n]=l[Hn]=l[Vn]=l[rf]=l[of]=l[af]=l[sf]=!0;l[Dn]=l[Vr]=l[qn]=!1;function _t(t,e,r,o,a,s){var i,n=e&Mn,u=e&Rn,c=e&Ln;if(r&&(i=a?r(t,o,a,s):r(t)),i!==void 0)return i;if(!v(t))return t;var h=x(t);if(h){if(i=Fr(t),!n)return me(t,i)}else{var P=tt(t),ft=P==Vr||P==zn;if(bt(t))return br(t,n);if(P==qr||P==Hr||ft&&!a){if(i=u||ft?{}:Ur(t),!n)return u?Pr(t,cr(i,t)):Tr(t,dr(i,t))}else{if(!l[P])return a?t:{};i=kr(t,P,n)}}s||(s=new ur);var ot=s.get(t);if(ot)return ot;s.set(t,i),$r(t)?t.forEach(function(b){i.add(_t(b,e,r,b,t,s))}):Gr(t)&&t.forEach(function(b,f){i.set(f,_t(b,e,r,f,t,s))});var pt=c?u?Ar:jr:u?H:$,lt=h?void 0:pt(t);return xe(lt||t,function(b,f){lt&&(f=b,b=t[f]),D(i,f,_t(b,e,r,f,t,s))}),i}var Yr=_t;var nf=1,ff=4;function pf(t){return Yr(t,nf|ff)}var Bt=pf;function lf(t,e){return t!=null&&e in Object(t)}var Zr=lf;function mf(t,e,r){e=C(e,t);for(var o=-1,a=e.length,s=!1;++o<a;){var i=Z(e[o]);if(!(s=t!=null&&r(t,i)))break;t=t[i]}return s||++o!=a?s:(a=t==null?0:t.length,!!a&&z(a)&&U(i,a)&&(x(t)||W(t)))}var Jr=mf;function uf(t,e){return t!=null&&Jr(t,e,Zr)}var Xr=uf;function df(t,e,r,o){if(!v(t))return t;e=C(e,t);for(var a=-1,s=e.length,i=s-1,n=t;n!=null&&++a<s;){var u=Z(e[a]),c=r;if(u==="__proto__"||u==="constructor"||u==="prototype")return t;if(a!=i){var h=n[u];c=o?o(h,u,n):void 0,c===void 0&&(c=v(h)?h:U(e[a+1])?[]:{})}D(n,u,c),n=n[u]}return t}var Qr=df;function cf(t,e,r){for(var o=-1,a=e.length,s={};++o<a;){var i=e[o],n=tr(t,i);r(n,i)&&Qr(s,C(i,t),n)}return s}var to=cf;function hf(t,e){return to(t,e,function(r,o){return Xr(t,o)})}var eo=hf;var xf=sr(function(t,e){return t==null?{}:eo(t,e)}),Et=xf;function ro(t){return{all:t=t||new Map,on:function(e,r){var o=t.get(e);o?o.push(r):t.set(e,[r])},off:function(e,r){var o=t.get(e);o&&(r?o.splice(o.indexOf(r)>>>0,1):t.set(e,[]))},emit:function(e,r){var o=t.get(e);o&&o.slice().map(function(a){a(r)}),(o=t.get("*"))&&o.slice().map(function(a){a(e,r)})}}}var oo="useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";var kt=(t=21)=>{let e="",r=crypto.getRandomValues(new Uint8Array(t|=0));for(;t--;)e+=oo[r[t]&63];return e};var gf="array",yf="bit",ao="bits",bf="byte",io="bytes",rt="",vf="exponent",wf="function",so="iec",Tf="Invalid number",Pf="Invalid rounding method",Ut="jedec",jf="object",no=".",Af="round",Of="s",Sf="si",If="kbit",_f="kB",Ef=" ",Ff="string",Cf="0",Dt={symbol:{iec:{bits:["bit","Kibit","Mibit","Gibit","Tibit","Pibit","Eibit","Zibit","Yibit"],bytes:["B","KiB","MiB","GiB","TiB","PiB","EiB","ZiB","YiB"]},jedec:{bits:["bit","Kbit","Mbit","Gbit","Tbit","Pbit","Ebit","Zbit","Ybit"],bytes:["B","KB","MB","GB","TB","PB","EB","ZB","YB"]}},fullform:{iec:["","kibi","mebi","gibi","tebi","pebi","exbi","zebi","yobi"],jedec:["","kilo","mega","giga","tera","peta","exa","zetta","yotta"]}};function fo(t,{bits:e=!1,pad:r=!1,base:o=-1,round:a=2,locale:s=rt,localeOptions:i={},separator:n=rt,spacer:u=Ef,symbols:c={},standard:h=rt,output:P=Ff,fullform:ft=!1,fullforms:ot=[],exponent:pt=-1,roundingMethod:lt=Af,precision:b=0}={}){let f=pt,L=Number(t),p=[],M=0,Ft=rt;h===Sf?(o=10,h=Ut):h===so||h===Ut?o=2:o===2?h=so:(o=10,h=Ut);let mt=o===10?1e3:1024,po=ft===!0,Gt=L<0,Wt=Math[lt];if(typeof t!="bigint"&&isNaN(t))throw new TypeError(Tf);if(typeof Wt!==wf)throw new TypeError(Pf);if(Gt&&(L=-L),(f===-1||isNaN(f))&&(f=Math.floor(Math.log(L)/Math.log(mt)),f<0&&(f=0)),f>8&&(b>0&&(b+=8-f),f=8),P===vf)return f;if(L===0)p[0]=0,Ft=p[1]=Dt.symbol[h][e?ao:io][f];else{M=L/(o===2?Math.pow(2,f*10):Math.pow(1e3,f)),e&&(M=M*8,M>=mt&&f<8&&(M=M/mt,f++));let at=Math.pow(10,f>0?a:0);p[0]=Wt(M*at)/at,p[0]===mt&&f<8&&pt===-1&&(p[0]=1,f++),Ft=p[1]=o===10&&f===1?e?If:_f:Dt.symbol[h][e?ao:io][f]}if(Gt&&(p[0]=-p[0]),b>0&&(p[0]=p[0].toPrecision(b)),p[1]=c[p[1]]||p[1],s===!0?p[0]=p[0].toLocaleString():s.length>0?p[0]=p[0].toLocaleString(s,i):n.length>0&&(p[0]=p[0].toString().replace(no,n)),r&&a>0){let at=p[0].toString(),Kt=n||(at.match(/(\D)/g)||[]).pop()||no,$t=at.toString().split(Kt),Ht=$t[1]||rt,Vt=Ht.length,lo=a-Vt;p[0]=`${$t[0]}${Kt}${Ht.padEnd(Vt+lo,Cf)}`}return po&&(p[1]=ot[f]?ot[f]:Dt.fullform[h][f]+(e?yf:bf)+(p[0]===1?rt:Of)),P===gf?p:P===jf?{value:p[0],symbol:p[1],exponent:f,unit:Ft}:p.join(u)}var N=class t{constructor(e){this.meta={};if(!e.tera)throw new Error("Basic file requires a `tera` key to access the Tera instance");Object.assign(this,e);let r=this.tera;Object.defineProperty(this,"_tera",{enumerable:!1,configurable:!1,get(){return r}}),delete this.tera,this.teraUrl=this.url.replace(/^https?:\/\/(?:.+?)\/projects\/(?:.+?)\/project\/(.+)$/,"/project/$1"),this.sizeFormatted=fo(this.size||0,{spacer:""}),this.createdFormatted=this.created?this.created.toLocaleDateString():"Unknown created date",this.modifiedFormatted=this.modified?this.modified.toLocaleDateString():"Unknown modified date",this.accessedFormatted=this.accessed?this.accessed.toLocaleDateString():"Unknown access date"}getContents(e){return this._tera.getProjectFileContents(this.id,e)}setContents(e){return this._tera.setProjectFileContents(this.id,e,{})}getRefs(){return this._tera.getProjectLibrary(this.id)}setRefs(e){return this._tera.setProjectLibrary(this.id,e)}serialize(){return Et(this,["id","sbId","name","icon","path","url","parsedName","created","modified","accessed","size","mime","meta"])}static deserialize(e){let r=Et(e,["tera","id","sbId","name","icon","path","url","parsedName","created","modified","accessed","size","mime","meta"]);return new t(r)}};var zt=class{constructor(e){this.settings={session:null,devMode:!1,verbosity:1,mode:"detect",modeTimeout:300,modeFallback:"child",modeOverrides:{child(e){e.siteUrl=="https://tera-tools.com/embed"&&(e.siteUrl="https://dev.tera-tools.com/embed")}},siteUrl:"https://tera-tools.com/embed",restrictOrigin:"*",frameSandbox:["allow-forms","allow-modals","allow-orientation-lock","allow-pointer-lock","allow-popups","allow-popups-to-escape-sandbox","allow-presentation","allow-same-origin","allow-scripts","allow-top-navigation"],handshakeInterval:1e3,handshakeTimeout:1e4,debugPaths:null};this.events=ro();this.dom={el:null,iframe:null,popup:null,stylesheet:null};this.methods=["handshake","setServerVerbosity","getUser","requireUser","getCredentials","bindProject","getProject","getProjects","setActiveProject","requireProject","selectProject","getNamespace","setNamespace","listNamespaces","getProjectState","setProjectState","setProjectStateDefaults","setProjectStateRefresh","getProjectFileContents","deleteProjectFile","setProjectFileContents","selectProjectLibrary","getProjectLibrary","setProjectLibrary","projectLog","setPage","uiAlert","uiConfirm","uiPanic","uiProgress","uiPrompt","uiThrow","uiSplat","uiWindow"];this.plugins=[];this.namespaces={};this.acceptPostboxes={};this.initPromise=null;e&&this.set(e)}send(e){let r=kt();return this.acceptPostboxes[r]={},this.acceptPostboxes[r].promise=new Promise((o,a)=>{Object.assign(this.acceptPostboxes[r],{resolve:o,reject:a}),this.sendRaw({id:r,...e})}),this.acceptPostboxes[r].promise}sendRaw(e){let r;try{if(r={TERA:1,id:e.id||kt(),...Bt(e)},this.settings.mode=="parent")window.parent.postMessage(r,this.settings.restrictOrigin);else if(this.settings.mode=="child")this.dom.iframe.contentWindow.postMessage(r,this.settings.restrictOrigin);else if(this.settings.mode=="popup")this.dom.popup.postMessage(r,this.settings.restrictOrigin);else throw this.settings.mode=="detect"?new Error("Call init() or detectMode() before trying to send data to determine the mode"):new Error(`Unknown TERA communication mode "${this.settings.mode}"`)}catch(o){throw this.debug("ERROR",1,"Message compose client->server:",o),this.debug("ERROR",1,"Attempted to dispatch payload client->server",r),o}}rpc(e,...r){return this.send({action:"rpc",method:e,args:r})}acceptMessage(e){if(e.origin==window.location.origin)return Promise.resolve();let r=e.data;return!r.TERA||!r.id?Promise.resolve():(this.debug("INFO",3,"Recieved message",r),(r==null?void 0:r.action)=="response"&&this.acceptPostboxes[r.id]?(r.isError===!0?this.acceptPostboxes[r.id].reject(r.response):this.acceptPostboxes[r.id].resolve(r.response),Promise.resolve()):(r==null?void 0:r.action)=="rpc"?Promise.resolve().then(()=>this[r.method].apply(this,r.args)).then(o=>this.sendRaw({id:r.id,action:"response",response:o})).catch(o=>{console.warn(`TERA-FY client threw on RPC:${r.method}:`,o),this.sendRaw({id:r.id,action:"response",isError:!0,response:o&&o.toString()})}):(r==null?void 0:r.action)=="event"?Promise.resolve().then(()=>this.events.emit(r.event,...r.payload)).catch(o=>{throw console.warn(`TERA-FY client threw while handling emitted event "${r.event}"`,{message:r}),o}):r!=null&&r.id?(this.debug("INFO",3,`Ignoring message ID ${r.id} - was meant for someone else?`),Promise.resolve()):(this.debug("INFO",3,"Unexpected incoming TERA-FY CLIENT message",{message:r}),Promise.resolve()))}mountNamespace(e){if(!/^[\w-]+$/.test(e))throw new Error("Namespaces must be alphanumeric + hyphens + underscores");return this.namespaces[e]?Promise.resolve(this.namespaces[e]):Promise.resolve().then(()=>this._mountNamespace(e)).then(()=>this.namespaces[e]||Promise.reject(`teraFy.mountNamespace('${e}') resolved but no namespace has been mounted`))}_mountNamespace(e){throw console.warn("teraFy._mountNamespace() has not been overriden by a TERA-fy plugin, load one to add this functionality for your preferred framework"),new Error("teraFy._mountNamespace() is not supported")}unmountNamespace(e){return this.namespaces[e]?this._unmountNamespace(e):Promise.resolve()}_unmountNamespace(e){console.warn("teraFy.unbindNamespace() has not been overriden by a TERA-fy plugin, load one to add this functionality for your preferred framework")}init(e){if(e&&this.set(e),this.initPromise)return this.initPromise;window.addEventListener("message",this.acceptMessage.bind(this));let r=this;return this.initPromise=Promise.resolve().then(()=>{var o;return(o=this.settings).session||(o.session="tfy-"+this.getEntropicString(16))}).then(()=>this.debug("INFO",4,"[0/6] Init","Session",this.settings.session,"against",this.settings.siteUrl)).then(()=>{this.settings.devMode&&(this.settings.debugPaths?this.settings.debugPaths=this.settings.debugPaths.map(o=>Array.isArray(o)?o.join("."):typeof o=="string"?o:(()=>{throw new Error("Unknown path type - should be an array or string in dotted notation")})()):this.settings.debugPaths=null,this.debug("INFO",0,"Watching state paths",this.settings.debugPaths))}).then(()=>this.detectMode()).then(o=>{if(this.debug("INFO",4,"[1/6] Setting client mode to",o),this.settings.mode=o,this.settings.modeOverrides[o])return this.debug("INFO",4,"[1/6] Applying specific config overrides for mode",o),this.settings.modeOverrides[o](this.settings)}).then(()=>this.debug("INFO",4,"[2/6] Injecting comms + styles + methods")).then(()=>Promise.all([this.injectComms(),this.injectStylesheet(),this.injectMethods()])).then(()=>{if(this.settings.verbosity<=1){this.debug("INFO",4,"[3/6] Skip - Server verbosity is already at 1");return}else return this.debug("INFO",4,`[3/6] Set server verbosity to ${this.settings.verbosity}`),this.rpc("setServerVerbosity",this.settings.verbosity)}).then(()=>this.debug("INFO",4,`[4/6] Set server mode to "${this.settings.mode}"`)).then(()=>this.rpc("setServerMode",this.settings.mode=="child"?"embedded":this.settings.mode=="parent"?"frame":this.settings.mode=="popup"?"popup":(()=>{throw`Unknown server mode "${this.settings.mode}"`})())).then(()=>this.debug("INFO",4,"[5/6] Run client plugins")).then(()=>Promise.all(this.plugins.map(o=>o.init.call(r,this.settings)))).then(()=>(this.debug("INFO",4,"[6/6] Init complete"),r)).catch(o=>{throw this.debug("WARN",0,"Init process fault",o),o}),this.initPromise}detectMode(){return this.settings.mode!="detect"?Promise.resolve(this.settings.mode):window.self===window.parent?Promise.resolve(this.settings.modeFallback):Promise.resolve().then(()=>this.settings.mode="parent").then(()=>new Promise((e,r)=>{let o=setTimeout(()=>r("TIMEOUT"),this.settings.modeTimeout);this.rpc("handshake").then(()=>clearTimeout(o)).then(()=>e(void 0)).catch(r)})).then(()=>"parent").catch(()=>this.settings.modeFallback)}injectComms(){switch(this.settings.mode){case"child":return Promise.resolve().then(()=>new Promise(e=>{this.debug("INFO",2,"Injecting TERA site as iFrame child"),this.dom.el=document.createElement("div"),this.dom.el.id="tera-fy",this.dom.el.classList.toggle("dev-mode",this.settings.devMode),this.dom.el.classList.add("minimized"),document.body.append(this.dom.el),this.dom.el.addEventListener("click",()=>this.dom.el.classList.toggle("minimized")),this.dom.iframe=document.createElement("iframe"),this.dom.iframe.setAttribute("sandbox",this.settings.frameSandbox.join(" ")),this.dom.iframe.addEventListener("load",()=>{this.debug("INFO",3,"Embeded iframe ready"),e(void 0)}),this.dom.iframe.src=this.settings.siteUrl,this.dom.el.append(this.dom.iframe)})).then(()=>this.handshakeLoop());case"parent":return this.debug("INFO",2,"Using TERA window parent"),Promise.resolve();case"popup":return this.debug("INFO",2,"Injecting TERA site as a popup window"),this.dom.popup=window.open(this.settings.siteUrl,"_blank","popup=1, location=0, menubar=0, status=0, scrollbars=0, width=500, height=600"),this.handshakeLoop().then(()=>this.debug("INFO",3,"Popup window accepted handshake"));default:throw new Error(`Unsupported mode "${this.settings.mode}" when calling injectComms()`)}}handshakeLoop(e){let r={handshakeInterval:this.settings.handshakeInterval,handshakeTimeout:this.settings.handshakeTimeout,...e};return new Promise((o,a)=>{let s=0,i,n=setTimeout(()=>{clearTimeout(i),a("TIMEOUT")},r.handshakeTimeout),u=()=>{this.debug("INFO",4,"Trying handshake",++s),clearTimeout(i),i=setTimeout(u,r.handshakeInterval),this.rpc("handshake").then(()=>{clearTimeout(n),clearTimeout(i)}).then(()=>o(void 0)).catch(a)};u()})}injectStylesheet(){switch(this.settings.mode){case"child":this.dom.stylesheet=document.createElement("style"),this.dom.stylesheet.innerHTML=[":root {","--TERA-accent: #4d659c;","}","#tera-fy {","display: none;","position: fixed;","right: 50px;","bottom: 50px;","width: 300px;","height: 150px;","background: transparent;","body:not(.tera-fy-focus) &.minimized.dev-mode {","background: var(--TERA-accent) !important;","opacity: 0.5;","right: 0px;","bottom: 0px;","width: 30px;","height: 30px;","transition: opacity 0.2s ease-out;","cursor: pointer;","border: none;","border-top-left-radius: 30px;","border-top: 2px solid var(--TERA-accent);","border-left: 2px solid var(--TERA-accent);","display: flex;","justify-content: center;","align-items: center;","&::before {","margin: 2px 0 0 0;",'content: "\u{1F300}";',"color: #FFF;","}","&:hover {","opacity: 1;","}","& > iframe {","display: none;","}","}","body:not(.tera-fy-focus) &:not(.minimized) {","&::before {","display: flex;","align-items: center;","justify-content: center;","cursor: pointer;","background: var(--TERA-accent) !important;","opacity: 0.5;","transition: opacity 0.2s ease-out;","position: absolute;","right: 0px;","bottom: 0px;","width: 20px;","height: 20px;","margin: 2px 0 0 0;",'content: "\u2B68";',"color: #FFF;","border: none;","border-top-left-radius: 30px;","border-top: 2px solid var(--TERA-accent);","border-left: 2px solid var(--TERA-accent);","}","&:hover::before {","opacity: 1;","}","}","&.dev-mode {","display: flex;","border: 5px solid var(--TERA-accent);","background: #FFF;","}","& > iframe {","width: 100%;","height: 100%;","}","}","body.tera-fy-focus {","overflow: hidden;","& #tera-fy {","display: flex !important;","position: fixed !important;","top: 0px !important;","width: 100vw !important;","height: 100vh !important;","left: 0px !important;","z-index: 10000 !important;","}","}"].join(`
`),document.head.appendChild(this.dom.stylesheet);break;case"parent":case"popup":break;default:throw new Error(`Unsupported mode "${this.settings.mode}" when injectStylesheet()`)}return Promise.resolve()}injectMethods(){this.methods.forEach(e=>this[e]=this.rpc.bind(this,e))}debug(...e){if(!this.settings.devMode||this.settings.verbosity<1)return;let r="log",o=1;typeof e[0]=="string"&&["INFO","LOG","WARN","ERROR"].includes(e[0])&&(r=e.shift().toLowerCase()),typeof e[0]=="number"&&(o=e[0],e.shift()),!(this.settings.verbosity<o)&&console[r]("%c[TERA-FY CLIENT]","font-weight: bold; color: #ff5722;",...e)}set(e,r,o){let a={ignoreNullish:!0,...o};return typeof e=="string"?(!a.ignoreNullish||r!=null)&&(this.settings[e]=r):Object.assign(this.settings,e),this.toggleDevMode(this.settings.devMode)}setIfDev(e,r,o){return!this.settings.devMode||r===void 0?this:this.set(e,r,o)}use(e,r){let o=typeof e=="function"?new e(this,r):typeof e=="object"?e:typeof e=="string"?(()=>{throw new Error("use(String) is not yet supported")})():(()=>{throw new Error("Expected use() call to be provided with a class initalizer")})();return this.mixin(this,o),this.plugins.push(o),this}mixin(e,r){let o=[],a=r;do o.unshift(a);while(a=Object.getPrototypeOf(a));o.forEach(s=>Object.getOwnPropertyNames(s).filter(i=>!["constructor","init","prototype","name"].includes(i)&&!i.startsWith("__")).forEach(i=>{typeof r[i]=="function"?Object.defineProperty(e,i,{enumerable:!1,value:r[i].bind(e)}):e[i]=r[i]}))}toggleDevMode(e="toggle"){var r;return e==="toggle"?this.settings.devMode=!this.settings.devMode:e==="proxy"?Object.assign(this.settings,{devMode:!0,siteUrl:"http://localhost:7334/embed",mode:"child"}):this.settings.devMode=!!e,this.settings.devMode&&(this.settings.restrictOrigin="*"),(r=this.dom)!=null&&r.el&&this.dom.el.classList.toggle("dev-mode",this.settings.devMode),this}toggleFocus(e="toggle"){this.debug("INFO",2,"Request focus",{isFocused:e}),globalThis.document.body.classList.toggle("tera-fy-focus",e==="toggle"?void 0:e)}getEntropicString(e=32){let r=new Uint32Array(4);return window.crypto.getRandomValues(r),btoa(String.fromCharCode(...new Uint8Array(r.buffer))).replace(/[+/]/g,"").slice(0,e)}selectProjectFile(e){return this.rpc("selectProjectFile",e).then(r=>r&&new N({tera:this,...r}))}getProjectFiles(e){return this.rpc("getProjectFiles",e).then(r=>r.map(o=>new N({tera:this,...o})))}getProjectFile(e,r){return this.rpc("getProjectFile",e,r).then(o=>o&&new N({tera:this,...o}))}createProjectFile(e){return this.rpc("createProjectFile",e).then(r=>r&&new N({tera:this,...r}))}};export{zt as default};
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

filesize/dist/filesize.esm.js:
  (**
   * filesize
   *
   * @copyright 2024 Jason Mulligan <jason.mulligan@avoidwork.com>
   * @license BSD-3-Clause
   * @version 10.1.6
   *)
*/
