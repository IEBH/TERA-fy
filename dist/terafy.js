function Vt(t,e,r){if(!t||typeof t!="object"||!e||typeof e!="object")throw new Error("both arguments must be objects or arrays");r||(r=function(i){return i});function o({obj1:i,obj2:f,basePath:m,basePathForRemoves:h,diffs:b}){var O=Object.keys(i),T=O.length,x=Object.keys(f),I=x.length,y,p=i.length-f.length;if(uo(i,f)){for(var u=0;u<T;u++){var l=Array.isArray(i)?Number(O[u]):O[u];l in f||(y=h.concat(l),b.remove.push({op:"remove",path:r(y)}))}for(var u=0;u<I;u++){var l=Array.isArray(f)?Number(x[u]):x[u];s({key:l,obj1:i,obj2:f,path:m.concat(l),pathForRemoves:m.concat(l),diffs:b})}}else{for(var u=0;u<p;u++)y=h.concat(u),b.remove.push({op:"remove",path:r(y)});for(var _=i.slice(p),u=0;u<I;u++)s({key:u,obj1:_,obj2:f,path:m.concat(u),pathForRemoves:m.concat(u+p),diffs:b})}}var a={remove:[],replace:[],add:[]};return o({obj1:t,obj2:e,basePath:[],basePathForRemoves:[],diffs:a}),a.remove.reverse().concat(a.replace).concat(a.add);function s({key:i,obj1:f,obj2:m,path:h,pathForRemoves:b,diffs:O}){var T=f[i],x=m[i];if(!(i in f)&&i in m){var I=x;O.add.push({op:"add",path:r(h),value:I})}else T!==x&&(Object(T)!==T||Object(x)!==x||mo(T,x)||!Object.keys(T).length&&!Object.keys(x).length&&String(T)!=String(x)?n(h,O,x):o({obj1:f[i],obj2:m[i],basePath:h,basePathForRemoves:b,diffs:O}))}function n(i,f,m){f.replace.push({op:"replace",path:r(i),value:m})}}function mo(t,e){return Object.prototype.toString.call(t)!=Object.prototype.toString.call(e)}function uo(t,e){var r=t.length-e.length;if(Array.isArray(t)&&Array.isArray(e)&&r>0){for(var o=0,a=0,s=0;s<e.length&&String(t[s])===String(e[s]);s++)o++;for(var n=e.length;n>0&&String(t[n+r])===String(e[n]);n--)a++;return o>=a}return!0}var co=typeof global=="object"&&global&&global.Object===Object&&global,ut=co;var ho=typeof self=="object"&&self&&self.Object===Object&&self,go=ut||ho||Function("return this")(),g=go;var xo=g.Symbol,w=xo;var qt=Object.prototype,yo=qt.hasOwnProperty,bo=qt.toString,ft=w?w.toStringTag:void 0;function vo(t){var e=yo.call(t,ft),r=t[ft];try{t[ft]=void 0;var o=!0}catch{}var a=bo.call(t);return o&&(e?t[ft]=r:delete t[ft]),a}var Yt=vo;var wo=Object.prototype,To=wo.toString;function Po(t){return To.call(t)}var Zt=Po;var Oo="[object Null]",Ao="[object Undefined]",Jt=w?w.toStringTag:void 0;function jo(t){return t==null?t===void 0?Ao:Oo:Jt&&Jt in Object(t)?Yt(t):Zt(t)}var S=jo;function So(t){return t!=null&&typeof t=="object"}var j=So;var Io="[object Symbol]";function _o(t){return typeof t=="symbol"||j(t)&&S(t)==Io}var z=_o;function Eo(t,e){for(var r=-1,o=t==null?0:t.length,a=Array(o);++r<o;)a[r]=e(t[r],r,t);return a}var Xt=Eo;var Co=Array.isArray,v=Co;var Fo=1/0,Qt=w?w.prototype:void 0,te=Qt?Qt.toString:void 0;function ee(t){if(typeof t=="string")return t;if(v(t))return Xt(t,ee)+"";if(z(t))return te?te.call(t):"";var e=t+"";return e=="0"&&1/t==-Fo?"-0":e}var re=ee;function Mo(t){var e=typeof t;return t!=null&&(e=="object"||e=="function")}var A=Mo;function Ro(t){return t}var oe=Ro;var No="[object AsyncFunction]",Lo="[object Function]",Bo="[object GeneratorFunction]",ko="[object Proxy]";function Uo(t){if(!A(t))return!1;var e=S(t);return e==Lo||e==Bo||e==No||e==ko}var dt=Uo;var Do=g["__core-js_shared__"],ct=Do;var ae=function(){var t=/[^.]+$/.exec(ct&&ct.keys&&ct.keys.IE_PROTO||"");return t?"Symbol(src)_1."+t:""}();function zo(t){return!!ae&&ae in t}var ie=zo;var Ko=Function.prototype,Go=Ko.toString;function Wo(t){if(t!=null){try{return Go.call(t)}catch{}try{return t+""}catch{}}return""}var E=Wo;var $o=/[\\^$.*+?()[\]{}|]/g,Ho=/^\[object .+?Constructor\]$/,Vo=Function.prototype,qo=Object.prototype,Yo=Vo.toString,Zo=qo.hasOwnProperty,Jo=RegExp("^"+Yo.call(Zo).replace($o,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");function Xo(t){if(!A(t)||ie(t))return!1;var e=dt(t)?Jo:Ho;return e.test(E(t))}var se=Xo;function Qo(t,e){return t?.[e]}var ne=Qo;function ta(t,e){var r=ne(t,e);return se(r)?r:void 0}var P=ta;var ea=P(g,"WeakMap"),ht=ea;var fe=Object.create,ra=function(){function t(){}return function(e){if(!A(e))return{};if(fe)return fe(e);t.prototype=e;var r=new t;return t.prototype=void 0,r}}(),pe=ra;function oa(t,e,r){switch(r.length){case 0:return t.call(e);case 1:return t.call(e,r[0]);case 2:return t.call(e,r[0],r[1]);case 3:return t.call(e,r[0],r[1],r[2])}return t.apply(e,r)}var le=oa;function aa(t,e){var r=-1,o=t.length;for(e||(e=Array(o));++r<o;)e[r]=t[r];return e}var me=aa;var ia=800,sa=16,na=Date.now;function fa(t){var e=0,r=0;return function(){var o=na(),a=sa-(o-r);if(r=o,a>0){if(++e>=ia)return arguments[0]}else e=0;return t.apply(void 0,arguments)}}var ue=fa;function pa(t){return function(){return t}}var de=pa;var la=function(){try{var t=P(Object,"defineProperty");return t({},"",{}),t}catch{}}(),K=la;var ma=K?function(t,e){return K(t,"toString",{configurable:!0,enumerable:!1,value:de(e),writable:!0})}:oe,ce=ma;var ua=ue(ce),he=ua;function da(t,e){for(var r=-1,o=t==null?0:t.length;++r<o&&e(t[r],r,t)!==!1;);return t}var ge=da;var ca=9007199254740991,ha=/^(?:0|[1-9]\d*)$/;function ga(t,e){var r=typeof t;return e=e??ca,!!e&&(r=="number"||r!="symbol"&&ha.test(t))&&t>-1&&t%1==0&&t<e}var G=ga;function xa(t,e,r){e=="__proto__"&&K?K(t,e,{configurable:!0,enumerable:!0,value:r,writable:!0}):t[e]=r}var gt=xa;function ya(t,e){return t===e||t!==t&&e!==e}var xt=ya;var ba=Object.prototype,va=ba.hasOwnProperty;function wa(t,e,r){var o=t[e];(!(va.call(t,e)&&xt(o,r))||r===void 0&&!(e in t))&&gt(t,e,r)}var W=wa;function Ta(t,e,r,o){var a=!r;r||(r={});for(var s=-1,n=e.length;++s<n;){var i=e[s],f=o?o(r[i],t[i],i,r,t):void 0;f===void 0&&(f=t[i]),a?gt(r,i,f):W(r,i,f)}return r}var M=Ta;var xe=Math.max;function Pa(t,e,r){return e=xe(e===void 0?t.length-1:e,0),function(){for(var o=arguments,a=-1,s=xe(o.length-e,0),n=Array(s);++a<s;)n[a]=o[e+a];a=-1;for(var i=Array(e+1);++a<e;)i[a]=o[a];return i[e]=r(n),le(t,this,i)}}var ye=Pa;var Oa=9007199254740991;function Aa(t){return typeof t=="number"&&t>-1&&t%1==0&&t<=Oa}var $=Aa;function ja(t){return t!=null&&$(t.length)&&!dt(t)}var yt=ja;var Sa=Object.prototype;function Ia(t){var e=t&&t.constructor,r=typeof e=="function"&&e.prototype||Sa;return t===r}var H=Ia;function _a(t,e){for(var r=-1,o=Array(t);++r<t;)o[r]=e(r);return o}var be=_a;var Ea="[object Arguments]";function Ca(t){return j(t)&&S(t)==Ea}var Ft=Ca;var ve=Object.prototype,Fa=ve.hasOwnProperty,Ma=ve.propertyIsEnumerable,Ra=Ft(function(){return arguments}())?Ft:function(t){return j(t)&&Fa.call(t,"callee")&&!Ma.call(t,"callee")},V=Ra;function Na(){return!1}var we=Na;var Oe=typeof exports=="object"&&exports&&!exports.nodeType&&exports,Te=Oe&&typeof module=="object"&&module&&!module.nodeType&&module,La=Te&&Te.exports===Oe,Pe=La?g.Buffer:void 0,Ba=Pe?Pe.isBuffer:void 0,ka=Ba||we,bt=ka;var Ua="[object Arguments]",Da="[object Array]",za="[object Boolean]",Ka="[object Date]",Ga="[object Error]",Wa="[object Function]",$a="[object Map]",Ha="[object Number]",Va="[object Object]",qa="[object RegExp]",Ya="[object Set]",Za="[object String]",Ja="[object WeakMap]",Xa="[object ArrayBuffer]",Qa="[object DataView]",ti="[object Float32Array]",ei="[object Float64Array]",ri="[object Int8Array]",oi="[object Int16Array]",ai="[object Int32Array]",ii="[object Uint8Array]",si="[object Uint8ClampedArray]",ni="[object Uint16Array]",fi="[object Uint32Array]",c={};c[ti]=c[ei]=c[ri]=c[oi]=c[ai]=c[ii]=c[si]=c[ni]=c[fi]=!0;c[Ua]=c[Da]=c[Xa]=c[za]=c[Qa]=c[Ka]=c[Ga]=c[Wa]=c[$a]=c[Ha]=c[Va]=c[qa]=c[Ya]=c[Za]=c[Ja]=!1;function pi(t){return j(t)&&$(t.length)&&!!c[S(t)]}var Ae=pi;function li(t){return function(e){return t(e)}}var q=li;var je=typeof exports=="object"&&exports&&!exports.nodeType&&exports,pt=je&&typeof module=="object"&&module&&!module.nodeType&&module,mi=pt&&pt.exports===je,Mt=mi&&ut.process,ui=function(){try{var t=pt&&pt.require&&pt.require("util").types;return t||Mt&&Mt.binding&&Mt.binding("util")}catch{}}(),C=ui;var Se=C&&C.isTypedArray,di=Se?q(Se):Ae,Ie=di;var ci=Object.prototype,hi=ci.hasOwnProperty;function gi(t,e){var r=v(t),o=!r&&V(t),a=!r&&!o&&bt(t),s=!r&&!o&&!a&&Ie(t),n=r||o||a||s,i=n?be(t.length,String):[],f=i.length;for(var m in t)(e||hi.call(t,m))&&!(n&&(m=="length"||a&&(m=="offset"||m=="parent")||s&&(m=="buffer"||m=="byteLength"||m=="byteOffset")||G(m,f)))&&i.push(m);return i}var vt=gi;function xi(t,e){return function(r){return t(e(r))}}var wt=xi;var yi=wt(Object.keys,Object),_e=yi;var bi=Object.prototype,vi=bi.hasOwnProperty;function wi(t){if(!H(t))return _e(t);var e=[];for(var r in Object(t))vi.call(t,r)&&r!="constructor"&&e.push(r);return e}var Ee=wi;function Ti(t){return yt(t)?vt(t):Ee(t)}var Y=Ti;function Pi(t){var e=[];if(t!=null)for(var r in Object(t))e.push(r);return e}var Ce=Pi;var Oi=Object.prototype,Ai=Oi.hasOwnProperty;function ji(t){if(!A(t))return Ce(t);var e=H(t),r=[];for(var o in t)o=="constructor"&&(e||!Ai.call(t,o))||r.push(o);return r}var Fe=ji;function Si(t){return yt(t)?vt(t,!0):Fe(t)}var Z=Si;var Ii=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,_i=/^\w*$/;function Ei(t,e){if(v(t))return!1;var r=typeof t;return r=="number"||r=="symbol"||r=="boolean"||t==null||z(t)?!0:_i.test(t)||!Ii.test(t)||e!=null&&t in Object(e)}var Me=Ei;var Ci=P(Object,"create"),F=Ci;function Fi(){this.__data__=F?F(null):{},this.size=0}var Re=Fi;function Mi(t){var e=this.has(t)&&delete this.__data__[t];return this.size-=e?1:0,e}var Ne=Mi;var Ri="__lodash_hash_undefined__",Ni=Object.prototype,Li=Ni.hasOwnProperty;function Bi(t){var e=this.__data__;if(F){var r=e[t];return r===Ri?void 0:r}return Li.call(e,t)?e[t]:void 0}var Le=Bi;var ki=Object.prototype,Ui=ki.hasOwnProperty;function Di(t){var e=this.__data__;return F?e[t]!==void 0:Ui.call(e,t)}var Be=Di;var zi="__lodash_hash_undefined__";function Ki(t,e){var r=this.__data__;return this.size+=this.has(t)?0:1,r[t]=F&&e===void 0?zi:e,this}var ke=Ki;function J(t){var e=-1,r=t==null?0:t.length;for(this.clear();++e<r;){var o=t[e];this.set(o[0],o[1])}}J.prototype.clear=Re;J.prototype.delete=Ne;J.prototype.get=Le;J.prototype.has=Be;J.prototype.set=ke;var Rt=J;function Gi(){this.__data__=[],this.size=0}var Ue=Gi;function Wi(t,e){for(var r=t.length;r--;)if(xt(t[r][0],e))return r;return-1}var R=Wi;var $i=Array.prototype,Hi=$i.splice;function Vi(t){var e=this.__data__,r=R(e,t);if(r<0)return!1;var o=e.length-1;return r==o?e.pop():Hi.call(e,r,1),--this.size,!0}var De=Vi;function qi(t){var e=this.__data__,r=R(e,t);return r<0?void 0:e[r][1]}var ze=qi;function Yi(t){return R(this.__data__,t)>-1}var Ke=Yi;function Zi(t,e){var r=this.__data__,o=R(r,t);return o<0?(++this.size,r.push([t,e])):r[o][1]=e,this}var Ge=Zi;function X(t){var e=-1,r=t==null?0:t.length;for(this.clear();++e<r;){var o=t[e];this.set(o[0],o[1])}}X.prototype.clear=Ue;X.prototype.delete=De;X.prototype.get=ze;X.prototype.has=Ke;X.prototype.set=Ge;var N=X;var Ji=P(g,"Map"),L=Ji;function Xi(){this.size=0,this.__data__={hash:new Rt,map:new(L||N),string:new Rt}}var We=Xi;function Qi(t){var e=typeof t;return e=="string"||e=="number"||e=="symbol"||e=="boolean"?t!=="__proto__":t===null}var $e=Qi;function ts(t,e){var r=t.__data__;return $e(e)?r[typeof e=="string"?"string":"hash"]:r.map}var B=ts;function es(t){var e=B(this,t).delete(t);return this.size-=e?1:0,e}var He=es;function rs(t){return B(this,t).get(t)}var Ve=rs;function os(t){return B(this,t).has(t)}var qe=os;function as(t,e){var r=B(this,t),o=r.size;return r.set(t,e),this.size+=r.size==o?0:1,this}var Ye=as;function Q(t){var e=-1,r=t==null?0:t.length;for(this.clear();++e<r;){var o=t[e];this.set(o[0],o[1])}}Q.prototype.clear=We;Q.prototype.delete=He;Q.prototype.get=Ve;Q.prototype.has=qe;Q.prototype.set=Ye;var lt=Q;var is="Expected a function";function Nt(t,e){if(typeof t!="function"||e!=null&&typeof e!="function")throw new TypeError(is);var r=function(){var o=arguments,a=e?e.apply(this,o):o[0],s=r.cache;if(s.has(a))return s.get(a);var n=t.apply(this,o);return r.cache=s.set(a,n)||s,n};return r.cache=new(Nt.Cache||lt),r}Nt.Cache=lt;var Ze=Nt;var ss=500;function ns(t){var e=Ze(t,function(o){return r.size===ss&&r.clear(),o}),r=e.cache;return e}var Je=ns;var fs=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,ps=/\\(\\)?/g,ls=Je(function(t){var e=[];return t.charCodeAt(0)===46&&e.push(""),t.replace(fs,function(r,o,a,s){e.push(a?s.replace(ps,"$1"):o||r)}),e}),Xe=ls;function ms(t){return t==null?"":re(t)}var Qe=ms;function us(t,e){return v(t)?t:Me(t,e)?[t]:Xe(Qe(t))}var k=us;var ds=1/0;function cs(t){if(typeof t=="string"||z(t))return t;var e=t+"";return e=="0"&&1/t==-ds?"-0":e}var tt=cs;function hs(t,e){e=k(e,t);for(var r=0,o=e.length;t!=null&&r<o;)t=t[tt(e[r++])];return r&&r==o?t:void 0}var tr=hs;function gs(t,e){for(var r=-1,o=e.length,a=t.length;++r<o;)t[a+r]=e[r];return t}var et=gs;var er=w?w.isConcatSpreadable:void 0;function xs(t){return v(t)||V(t)||!!(er&&t&&t[er])}var rr=xs;function or(t,e,r,o,a){var s=-1,n=t.length;for(r||(r=rr),a||(a=[]);++s<n;){var i=t[s];e>0&&r(i)?e>1?or(i,e-1,r,o,a):et(a,i):o||(a[a.length]=i)}return a}var ar=or;function ys(t){var e=t==null?0:t.length;return e?ar(t,1):[]}var ir=ys;function bs(t){return he(ye(t,void 0,ir),t+"")}var sr=bs;var vs=wt(Object.getPrototypeOf,Object),Tt=vs;function ws(){this.__data__=new N,this.size=0}var nr=ws;function Ts(t){var e=this.__data__,r=e.delete(t);return this.size=e.size,r}var fr=Ts;function Ps(t){return this.__data__.get(t)}var pr=Ps;function Os(t){return this.__data__.has(t)}var lr=Os;var As=200;function js(t,e){var r=this.__data__;if(r instanceof N){var o=r.__data__;if(!L||o.length<As-1)return o.push([t,e]),this.size=++r.size,this;r=this.__data__=new lt(o)}return r.set(t,e),this.size=r.size,this}var mr=js;function rt(t){var e=this.__data__=new N(t);this.size=e.size}rt.prototype.clear=nr;rt.prototype.delete=fr;rt.prototype.get=pr;rt.prototype.has=lr;rt.prototype.set=mr;var ur=rt;function Ss(t,e){return t&&M(e,Y(e),t)}var dr=Ss;function Is(t,e){return t&&M(e,Z(e),t)}var cr=Is;var yr=typeof exports=="object"&&exports&&!exports.nodeType&&exports,hr=yr&&typeof module=="object"&&module&&!module.nodeType&&module,_s=hr&&hr.exports===yr,gr=_s?g.Buffer:void 0,xr=gr?gr.allocUnsafe:void 0;function Es(t,e){if(e)return t.slice();var r=t.length,o=xr?xr(r):new t.constructor(r);return t.copy(o),o}var br=Es;function Cs(t,e){for(var r=-1,o=t==null?0:t.length,a=0,s=[];++r<o;){var n=t[r];e(n,r,t)&&(s[a++]=n)}return s}var vr=Cs;function Fs(){return[]}var Pt=Fs;var Ms=Object.prototype,Rs=Ms.propertyIsEnumerable,wr=Object.getOwnPropertySymbols,Ns=wr?function(t){return t==null?[]:(t=Object(t),vr(wr(t),function(e){return Rs.call(t,e)}))}:Pt,ot=Ns;function Ls(t,e){return M(t,ot(t),e)}var Tr=Ls;var Bs=Object.getOwnPropertySymbols,ks=Bs?function(t){for(var e=[];t;)et(e,ot(t)),t=Tt(t);return e}:Pt,Ot=ks;function Us(t,e){return M(t,Ot(t),e)}var Pr=Us;function Ds(t,e,r){var o=e(t);return v(t)?o:et(o,r(t))}var At=Ds;function zs(t){return At(t,Y,ot)}var Or=zs;function Ks(t){return At(t,Z,Ot)}var Ar=Ks;var Gs=P(g,"DataView"),jt=Gs;var Ws=P(g,"Promise"),St=Ws;var $s=P(g,"Set"),It=$s;var jr="[object Map]",Hs="[object Object]",Sr="[object Promise]",Ir="[object Set]",_r="[object WeakMap]",Er="[object DataView]",Vs=E(jt),qs=E(L),Ys=E(St),Zs=E(It),Js=E(ht),D=S;(jt&&D(new jt(new ArrayBuffer(1)))!=Er||L&&D(new L)!=jr||St&&D(St.resolve())!=Sr||It&&D(new It)!=Ir||ht&&D(new ht)!=_r)&&(D=function(t){var e=S(t),r=e==Hs?t.constructor:void 0,o=r?E(r):"";if(o)switch(o){case Vs:return Er;case qs:return jr;case Ys:return Sr;case Zs:return Ir;case Js:return _r}return e});var at=D;var Xs=Object.prototype,Qs=Xs.hasOwnProperty;function tn(t){var e=t.length,r=new t.constructor(e);return e&&typeof t[0]=="string"&&Qs.call(t,"index")&&(r.index=t.index,r.input=t.input),r}var Cr=tn;var en=g.Uint8Array,Lt=en;function rn(t){var e=new t.constructor(t.byteLength);return new Lt(e).set(new Lt(t)),e}var it=rn;function on(t,e){var r=e?it(t.buffer):t.buffer;return new t.constructor(r,t.byteOffset,t.byteLength)}var Fr=on;var an=/\w*$/;function sn(t){var e=new t.constructor(t.source,an.exec(t));return e.lastIndex=t.lastIndex,e}var Mr=sn;var Rr=w?w.prototype:void 0,Nr=Rr?Rr.valueOf:void 0;function nn(t){return Nr?Object(Nr.call(t)):{}}var Lr=nn;function fn(t,e){var r=e?it(t.buffer):t.buffer;return new t.constructor(r,t.byteOffset,t.length)}var Br=fn;var pn="[object Boolean]",ln="[object Date]",mn="[object Map]",un="[object Number]",dn="[object RegExp]",cn="[object Set]",hn="[object String]",gn="[object Symbol]",xn="[object ArrayBuffer]",yn="[object DataView]",bn="[object Float32Array]",vn="[object Float64Array]",wn="[object Int8Array]",Tn="[object Int16Array]",Pn="[object Int32Array]",On="[object Uint8Array]",An="[object Uint8ClampedArray]",jn="[object Uint16Array]",Sn="[object Uint32Array]";function In(t,e,r){var o=t.constructor;switch(e){case xn:return it(t);case pn:case ln:return new o(+t);case yn:return Fr(t,r);case bn:case vn:case wn:case Tn:case Pn:case On:case An:case jn:case Sn:return Br(t,r);case mn:return new o;case un:case hn:return new o(t);case dn:return Mr(t);case cn:return new o;case gn:return Lr(t)}}var kr=In;function _n(t){return typeof t.constructor=="function"&&!H(t)?pe(Tt(t)):{}}var Ur=_n;var En="[object Map]";function Cn(t){return j(t)&&at(t)==En}var Dr=Cn;var zr=C&&C.isMap,Fn=zr?q(zr):Dr,Kr=Fn;var Mn="[object Set]";function Rn(t){return j(t)&&at(t)==Mn}var Gr=Rn;var Wr=C&&C.isSet,Nn=Wr?q(Wr):Gr,$r=Nn;var Ln=1,Bn=2,kn=4,Hr="[object Arguments]",Un="[object Array]",Dn="[object Boolean]",zn="[object Date]",Kn="[object Error]",Vr="[object Function]",Gn="[object GeneratorFunction]",Wn="[object Map]",$n="[object Number]",qr="[object Object]",Hn="[object RegExp]",Vn="[object Set]",qn="[object String]",Yn="[object Symbol]",Zn="[object WeakMap]",Jn="[object ArrayBuffer]",Xn="[object DataView]",Qn="[object Float32Array]",tf="[object Float64Array]",ef="[object Int8Array]",rf="[object Int16Array]",of="[object Int32Array]",af="[object Uint8Array]",sf="[object Uint8ClampedArray]",nf="[object Uint16Array]",ff="[object Uint32Array]",d={};d[Hr]=d[Un]=d[Jn]=d[Xn]=d[Dn]=d[zn]=d[Qn]=d[tf]=d[ef]=d[rf]=d[of]=d[Wn]=d[$n]=d[qr]=d[Hn]=d[Vn]=d[qn]=d[Yn]=d[af]=d[sf]=d[nf]=d[ff]=!0;d[Kn]=d[Vr]=d[Zn]=!1;function _t(t,e,r,o,a,s){var n,i=e&Ln,f=e&Bn,m=e&kn;if(r&&(n=a?r(t,o,a,s):r(t)),n!==void 0)return n;if(!A(t))return t;var h=v(t);if(h){if(n=Cr(t),!i)return me(t,n)}else{var b=at(t),O=b==Vr||b==Gn;if(bt(t))return br(t,i);if(b==qr||b==Hr||O&&!a){if(n=f||O?{}:Ur(t),!i)return f?Pr(t,cr(n,t)):Tr(t,dr(n,t))}else{if(!d[b])return a?t:{};n=kr(t,b,i)}}s||(s=new ur);var T=s.get(t);if(T)return T;s.set(t,n),$r(t)?t.forEach(function(y){n.add(_t(y,e,r,y,t,s))}):Kr(t)&&t.forEach(function(y,p){n.set(p,_t(y,e,r,p,t,s))});var x=m?f?Ar:Or:f?Z:Y,I=h?void 0:x(t);return ge(I||t,function(y,p){I&&(p=y,y=t[p]),W(n,p,_t(y,e,r,p,t,s))}),n}var Yr=_t;var pf=1,lf=4;function mf(t){return Yr(t,pf|lf)}var Bt=mf;function uf(t,e){return t!=null&&e in Object(t)}var Zr=uf;function df(t,e,r){e=k(e,t);for(var o=-1,a=e.length,s=!1;++o<a;){var n=tt(e[o]);if(!(s=t!=null&&r(t,n)))break;t=t[n]}return s||++o!=a?s:(a=t==null?0:t.length,!!a&&$(a)&&G(n,a)&&(v(t)||V(t)))}var Jr=df;function cf(t,e){return t!=null&&Jr(t,e,Zr)}var Xr=cf;function hf(t,e,r,o){if(!A(t))return t;e=k(e,t);for(var a=-1,s=e.length,n=s-1,i=t;i!=null&&++a<s;){var f=tt(e[a]),m=r;if(f==="__proto__"||f==="constructor"||f==="prototype")return t;if(a!=n){var h=i[f];m=o?o(h,f,i):void 0,m===void 0&&(m=A(h)?h:G(e[a+1])?[]:{})}W(i,f,m),i=i[f]}return t}var Qr=hf;function gf(t,e,r){for(var o=-1,a=e.length,s={};++o<a;){var n=e[o],i=tr(t,n);r(i,n)&&Qr(s,k(n,t),i)}return s}var to=gf;function xf(t,e){return to(t,e,function(r,o){return Xr(t,o)})}var eo=xf;var yf=sr(function(t,e){return t==null?{}:eo(t,e)}),Et=yf;function ro(t){return{all:t=t||new Map,on:function(e,r){var o=t.get(e);o?o.push(r):t.set(e,[r])},off:function(e,r){var o=t.get(e);o&&(r?o.splice(o.indexOf(r)>>>0,1):t.set(e,[]))},emit:function(e,r){var o=t.get(e);o&&o.slice().map(function(a){a(r)}),(o=t.get("*"))&&o.slice().map(function(a){a(e,r)})}}}var oo="useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";var kt=(t=21)=>{let e="",r=crypto.getRandomValues(new Uint8Array(t));for(;t--;)e+=oo[r[t]&63];return e};var bf="array",vf="bit",ao="bits",wf="byte",io="bytes",st="",Tf="exponent",Pf="function",so="iec",Of="Invalid number",Af="Invalid rounding method",Ut="jedec",jf="object",no=".",Sf="round",If="s",_f="si",Ef="kbit",Cf="kB",Ff=" ",Mf="string",Rf="0",Dt={symbol:{iec:{bits:["bit","Kibit","Mibit","Gibit","Tibit","Pibit","Eibit","Zibit","Yibit"],bytes:["B","KiB","MiB","GiB","TiB","PiB","EiB","ZiB","YiB"]},jedec:{bits:["bit","Kbit","Mbit","Gbit","Tbit","Pbit","Ebit","Zbit","Ybit"],bytes:["B","KB","MB","GB","TB","PB","EB","ZB","YB"]}},fullform:{iec:["","kibi","mebi","gibi","tebi","pebi","exbi","zebi","yobi"],jedec:["","kilo","mega","giga","tera","peta","exa","zetta","yotta"]}};function fo(t,{bits:e=!1,pad:r=!1,base:o=-1,round:a=2,locale:s=st,localeOptions:n={},separator:i=st,spacer:f=Ff,symbols:m={},standard:h=st,output:b=Mf,fullform:O=!1,fullforms:T=[],exponent:x=-1,roundingMethod:I=Sf,precision:y=0}={}){let p=x,u=Number(t),l=[],_=0,Ct=st;h===_f?(o=10,h=Ut):h===so||h===Ut?o=2:o===2?h=so:(o=10,h=Ut);let mt=o===10?1e3:1024,po=O===!0,Kt=u<0,Gt=Math[I];if(typeof t!="bigint"&&isNaN(t))throw new TypeError(Of);if(typeof Gt!==Pf)throw new TypeError(Af);if(Kt&&(u=-u),(p===-1||isNaN(p))&&(p=Math.floor(Math.log(u)/Math.log(mt)),p<0&&(p=0)),p>8&&(y>0&&(y+=8-p),p=8),b===Tf)return p;if(u===0)l[0]=0,Ct=l[1]=Dt.symbol[h][e?ao:io][p];else{_=u/(o===2?Math.pow(2,p*10):Math.pow(1e3,p)),e&&(_=_*8,_>=mt&&p<8&&(_=_/mt,p++));let nt=Math.pow(10,p>0?a:0);l[0]=Gt(_*nt)/nt,l[0]===mt&&p<8&&x===-1&&(l[0]=1,p++),Ct=l[1]=o===10&&p===1?e?Ef:Cf:Dt.symbol[h][e?ao:io][p]}if(Kt&&(l[0]=-l[0]),y>0&&(l[0]=l[0].toPrecision(y)),l[1]=m[l[1]]||l[1],s===!0?l[0]=l[0].toLocaleString():s.length>0?l[0]=l[0].toLocaleString(s,n):i.length>0&&(l[0]=l[0].toString().replace(no,i)),r&&Number.isInteger(l[0])===!1&&a>0){let nt=i||no,Wt=l[0].toString().split(nt),$t=Wt[1]||st,Ht=$t.length,lo=a-Ht;l[0]=`${Wt[0]}${nt}${$t.padEnd(Ht+lo,Rf)}`}return po&&(l[1]=T[p]?T[p]:Dt.fullform[h][p]+(e?vf:wf)+(l[0]===1?st:If)),b===bf?l:b===jf?{value:l[0],symbol:l[1],exponent:p,unit:Ct}:l.join(f)}var U=class t{_tera;id;name;icon;path;url;teraUrl;parsedName;created;createdFormatted;modified;modifiedFormatted;accessed;accessedFormatted;size;sizeFormatted;mime;meta={};constructor(e){if(!e.tera)throw new Error("Basic file requires a `tera` key to access the Tera instance");Object.assign(this,e);let r=this.tera;Object.defineProperty(this,"_tera",{enumerable:!1,configurable:!1,get(){return r}}),delete this.tera,this.teraUrl=this.url.replace(/^https?:\/\/(?:.+?)\/projects\/(?:.+?)\/project\/(.+)$/,"/project/$1"),this.sizeFormatted=fo(this.size||0,{spacer:""}),this.createdFormatted=this.created?this.created.toLocaleDateString():"Unknown created date",this.modifiedFormatted=this.modified?this.modified.toLocaleDateString():"Unknown modified date",this.accessedFormatted=this.accessed?this.accessed.toLocaleDateString():"Unknown access date"}getContents(e){return this._tera.getProjectFileContents(this.id,e)}setContents(e){return this._tera.setProjectFileContents(this.id,e)}getRefs(){return this._tera.getProjectLibrary(this.id)}setRefs(e){return this._tera.setProjectLibrary(this.id,e)}serialize(){return Et(this,["id","name","icon","path","url","parsedName","created","modified","accessed","size","mime","meta"])}static deserialize(e){return new t(Et(e,["tera","id","name","icon","path","url","parsedName","created","modified","accessed","size","mime","meta"]))}};var zt=class{settings={session:null,devMode:!1,verbosity:1,mode:"detect",modeTimeout:300,modeFallback:"child",modeOverrides:{child(e){e.siteUrl=="https://tera-tools.com/embed"&&Object.assign(e,{siteUrl:"https://dev.tera-tools.com/embed",restrictOrigin:"https://dev.tera-tools.com"})}},siteUrl:"https://tera-tools.com/embed",restrictOrigin:"https://tera-tools.com",frameSandbox:["allow-forms","allow-modals","allow-orientation-lock","allow-pointer-lock","allow-popups","allow-popups-to-escape-sandbox","allow-presentation","allow-same-origin","allow-scripts","allow-top-navigation"],handshakeInterval:1e3,handshakeTimeout:1e4,debugPaths:null};events=ro();dom={el:null,iframe:null,popup:null,stylesheet:null};methods=["handshake","setServerVerbosity","getUser","requireUser","bindProject","getProject","getProjects","setActiveProject","requireProject","selectProject","getProjectState","setProjectState","setProjectStateDefaults","setProjectStateFlush","setProjectStateRefresh","saveProjectState","replaceProjectState","getProjectFileContents","deleteProjectFile","setProjectFileContents","selectProjectLibrary","getProjectLibrary","setProjectLibrary","projectLog","setPage","uiAlert","uiConfirm","uiPanic","uiProgress","uiPrompt","uiThrow","uiSplat","uiWindow"];plugins=[];send(e){let r=kt();return this.acceptPostboxes[r]={},this.acceptPostboxes[r].promise=new Promise((o,a)=>{Object.assign(this.acceptPostboxes[r],{resolve:o,reject:a}),this.sendRaw({id:r,...e})}),this.acceptPostboxes[r].promise}sendRaw(e){let r;try{if(r={TERA:1,id:e.id||kt(),...Bt(e)},this.settings.mode=="parent")window.parent.postMessage(r,this.settings.restrictOrigin);else if(this.settings.mode=="child")this.dom.iframe.contentWindow.postMessage(r,this.settings.restrictOrigin);else if(this.settings.mode=="popup")this.dom.popup.postMessage(r,this.settings.restrictOrigin);else throw this.settings.mode=="detect"?new Error("Call init() or detectMode() before trying to send data to determine the mode"):new Error(`Unknown TERA communication mode "${this.settings.mode}"`)}catch(o){throw this.debug("ERROR",1,"Message compose client->server:",o),this.debug("ERROR",1,"Attempted to dispatch payload client->server",r),o}}rpc(e,...r){return this.send({action:"rpc",method:e,args:r})}acceptMessage(e){if(e.origin==window.location.origin)return Promise.resolve();let r=e.data;return!r.TERA||!r.id?Promise.resolve():(this.debug("INFO",3,"Recieved message",r),r?.action=="response"&&this.acceptPostboxes[r.id]?(r.isError===!0?this.acceptPostboxes[r.id].reject(r.response):this.acceptPostboxes[r.id].resolve(r.response),Promise.resolve()):r?.action=="rpc"?Promise.resolve().then(()=>this[r.method].apply(this,r.args)).then(o=>this.sendRaw({id:r.id,action:"response",response:o})).catch(o=>{console.warn(`TERA-FY client threw on RPC:${r.method}:`,o),this.sendRaw({id:r.id,action:"response",isError:!0,response:o&&o.toString()})}):r?.action=="event"?Promise.resolve().then(()=>this.events.emit(r.event,...r.payload)).catch(o=>{throw console.warn(`TERA-FY client threw while handling emitted event "${r.event}"`,{message:r}),o}):r?.id?(this.debug("INFO",3,`Ignoring message ID ${r.id} - was meant for someone else?`),Promise.resolve()):(this.debug("INFO",3,"Unexpected incoming TERA-FY CLIENT message",{message:r}),Promise.resolve()))}acceptPostboxes={};createProjectStatePatch(e,r){let o=Vt(r,e);return this.debug("INFO",3,"Created project patch",{patch:o,newState:e,oldState:r}),this.applyProjectStatePatch(o)}applyProjectStatePatch(e){if(this.settings.devMode&&this.settings.debugPaths){if(!Array.isArray(this.settings.debugPaths))throw new Error("teraFyClient.settings.debugPaths should be either null or an Array<String>");let r=e.filter(o=>this.settings.debugPaths.some(a=>o.path.join(".").slice(0,a.length)==a)).map(o=>o.path.join("."));if(r.length>0){console.info("Detected writes to",r,"- entering debugging mode");debugger}}return this.rpc("applyProjectStatePatch",e,{session:this.settings.session})}applyProjectStatePatchLocal(e){throw new Error("applyProjectStatePatchLocal() has not been sub-classed by a plugin")}constructor(e){e&&this.set(e)}init(e){if(e&&this.set(e),this.init.promise)return this.init.promise;window.addEventListener("message",this.acceptMessage.bind(this));let r=this;return this.init.promise=Promise.resolve().then(()=>this.settings.session||="tfy-"+this.getEntropicString(16)).then(()=>this.debug("INFO",4,"[0/6] Init","Session",this.settings.session,"against",this.settings.siteUrl)).then(()=>{this.settings.devMode&&(this.settings.debugPaths=this.settings.debugPaths?Array.isArray(this.settings.debugPaths)?this.settings.debugPaths.map(o=>Array.isArray(o)?o.join("."):typeof o=="string"?o:(()=>{throw new Error("Unknown path type - should be an array or string in dotted notation")})()):(()=>{throw new Error("Unknown terafyClient.settings.debugPaths type")})():null,this.debug("INFO",0,"Watching state paths",this.settings.debugPaths))}).then(()=>this.detectMode()).then(o=>{if(this.debug("INFO",4,"[1/6] Setting client mode to",o),this.settings.mode=o,this.settings.modeOverrides[o])return this.debug("INFO",4,"[1/6] Applying specific config overrides for mode",o),this.settings.modeOverrides[o](this.settings)}).then(()=>this.debug("INFO",4,"[2/6] Injecting comms + styles + methods")).then(()=>Promise.all([this.injectComms(),this.injectStylesheet(),this.injectMethods()])).then(()=>{if(this.settings.verbosity<=1){this.debug("INFO",4,"[3/6] Skip - Server verbosity is already at 1");return}else return this.debug("INFO",4,`[3/6] Set server verbosity to ${this.settings.verbosity}`),this.rpc("setServerVerbosity",this.settings.verbosity)}).then(()=>this.debug("INFO",4,`[4/6] Set server mode to "${this.settings.mode}"`)).then(()=>this.rpc("setServerMode",this.settings.mode=="child"?"embedded":this.settings.mode=="parent"?"frame":this.settings.mode=="popup"?"popup":(()=>{throw`Unknown server mode "${this.settings.mode}"`})())).then(()=>this.debug("INFO",4,"[5/6] Run client plugins")).then(()=>Promise.all(this.plugins.map(o=>o.init.call(r,this.settings)))).then(()=>this.debug("INFO",4,"[6/6] Init complete")).catch(o=>this.debug("WARN",0,"Init process fault",o))}detectMode(){return this.settings.mode!="detect"?Promise.resolve(this.settings.mode):window.self===window.parent?Promise.resolve(this.settings.modeFallback):Promise.resolve().then(()=>this.settings.mode="parent").then(()=>new Promise((e,r)=>{let o=setTimeout(()=>r(),this.settings.modeTimeout);this.rpc("handshake").then(()=>clearTimeout(o)).then(()=>e())})).then(()=>"parent").catch(()=>this.settings.modeFallback)}injectComms(){switch(this.settings.mode){case"child":return Promise.resolve().then(()=>new Promise(e=>{this.debug("INFO",2,"Injecting TERA site as iFrame child"),this.dom.el=document.createElement("div"),this.dom.el.id="tera-fy",this.dom.el.classList.toggle("dev-mode",this.settings.devMode),this.dom.el.classList.add("minimized"),document.body.append(this.dom.el),this.dom.el.addEventListener("click",()=>this.dom.el.classList.toggle("minimized")),this.dom.iframe=document.createElement("iframe"),this.dom.iframe.setAttribute("sandbox",this.settings.frameSandbox.join(" ")),this.dom.iframe.addEventListener("load",()=>{this.debug("INFO",3,"Embeded iframe ready"),e()}),this.dom.iframe.src=this.settings.siteUrl,this.dom.el.append(this.dom.iframe)})).then(()=>this.handshakeLoop());case"parent":return this.debug("INFO",2,"Using TERA window parent"),Promise.resolve();case"popup":return this.debug("INFO",2,"Injecting TERA site as a popup window"),this.dom.popup=window.open(this.settings.siteUrl,"_blank","popup=1, location=0, menubar=0, status=0, scrollbars=0, width=500, height=600"),this.handshakeLoop().then(()=>this.debug("INFO",3,"Popup window accepted handshake"));default:throw new Error(`Unsupported mode "${this.settings.mode}" when calling injectComms()`)}}handshakeLoop(e){let r={handshakeInterval:this.settings.handshakeInterval,handshakeTimeout:this.settings.handshakeTimeout,...e};return new Promise((o,a)=>{let s=0,n,i=setTimeout(()=>{clearTimeout(n),a("TIMEOUT")},r.handshakeTimeout),f=()=>{this.debug("INFO",4,"Trying handshake",++s),clearTimeout(n),n=setTimeout(f,r.handshakeInterval),this.rpc("handshake").then(()=>{clearTimeout(i),clearTimeout(n)}).then(()=>o()).catch(a)};f()})}injectStylesheet(){switch(this.settings.mode){case"child":this.dom.stylesheet=document.createElement("style"),this.dom.stylesheet.innerHTML=[":root {","--TERA-accent: #4d659c;","}","#tera-fy {","display: none;","position: fixed;","right: 50px;","bottom: 50px;","width: 300px;","height: 150px;","background: transparent;","body:not(.tera-fy-focus) &.minimized.dev-mode {","background: var(--TERA-accent) !important;","opacity: 0.5;","right: 0px;","bottom: 0px;","width: 30px;","height: 30px;","transition: opacity 0.2s ease-out;","cursor: pointer;","border: none;","border-top-left-radius: 30px;","border-top: 2px solid var(--TERA-accent);","border-left: 2px solid var(--TERA-accent);","display: flex;","justify-content: center;","align-items: center;","&::before {","margin: 2px 0 0 0;",'content: "\u{1F300}";',"color: #FFF;","}","&:hover {","opacity: 1;","}","& > iframe {","display: none;","}","}","body:not(.tera-fy-focus) &:not(.minimized) {","&::before {","display: flex;","align-items: center;","justify-content: center;","cursor: pointer;","background: var(--TERA-accent) !important;","opacity: 0.5;","transition: opacity 0.2s ease-out;","position: absolute;","right: 0px;","bottom: 0px;","width: 20px;","height: 20px;","margin: 2px 0 0 0;",'content: "\u2B68";',"color: #FFF;","border: none;","border-top-left-radius: 30px;","border-top: 2px solid var(--TERA-accent);","border-left: 2px solid var(--TERA-accent);","}","&:hover::before {","opacity: 1;","}","}","&.dev-mode {","display: flex;","border: 5px solid var(--TERA-accent);","background: #FFF;","}","& > iframe {","width: 100%;","height: 100%;","}","}","body.tera-fy-focus {","overflow: hidden;","& #tera-fy {","display: flex !important;","position: fixed !important;","top: 0px !important;","width: 100vw !important;","height: 100vh !important;","left: 0px !important;","z-index: 10000 !important;","}","}"].join(`
`),document.head.appendChild(this.dom.stylesheet);break;case"parent":case"popup":break;default:throw new Error(`Unsupported mode "${this.settings.mode}" when injectStylesheet()`)}return Promise.resolve()}injectMethods(){this.methods.forEach(e=>this[e]=this.rpc.bind(this,e))}debug(...e){if(!this.settings.devMode||this.settings.verbosity<1)return;let r="log",o=1;typeof e[0]=="string"&&["INFO","LOG","WARN","ERROR"].includes(e[0])&&(r=e.shift().toLowerCase()),typeof e[0]=="number"&&(o=e[0],e.shift()),!(this.settings.verbosity<o)&&console[r]("%c[TERA-FY CLIENT]","font-weight: bold; color: #ff5722;",...e)}set(e,r,o){let a={ignoreNullish:!0,...o};return typeof e=="string"?(!a.ignoreNullish||r!=null)&&(this.settings[e]=r):Object.assign(this.settings,e),this.toggleDevMode(this.settings.devMode)}setIfDev(e,r,o){return!this.settings.devMode||r===void 0?this:this.set(e,r,o)}use(e,r){let o=typeof e=="function"?new e(this,r):typeof e=="object"?e:typeof e=="string"?(()=>{throw new Error("use(String) is not yet supported")})():(()=>{throw new Error("Expected use() call to be provided with a class initalizer")})();return this.mixin(this,o),this.plugins.push(o),this}mixin(e,r){Object.getOwnPropertyNames(Object.getPrototypeOf(r)).filter(o=>!["constructor","prototype","name"].includes(o)).filter(o=>o!="init").forEach(o=>{Object.defineProperty(e,o,{value:r[o].bind(e),enumerable:!1})})}toggleDevMode(e="toggle"){return e==="toggle"?this.settings.devMode=!this.settings.devMode:e==="proxy"?Object.assign(this.settings,{devMode:!0,siteUrl:"http://localhost:7334/embed",mode:"child"}):this.settings.devMode=!!e,this.settings.devMode&&(this.settings.restrictOrigin="*"),this.dom?.el&&this.dom.el.classList.toggle("dev-mode",this.settings.devMode),this}toggleFocus(e="toggle"){this.debug("INFO",2,"Request focus",{isFocused:e}),globalThis.document.body.classList.toggle("tera-fy-focus",e==="toggle"?void 0:e)}getEntropicString(e=32){let r=new Uint32Array(4);return window.crypto.getRandomValues(r),btoa(String.fromCharCode(...new Uint8Array(r.buffer))).replace(/[+/]/g,"").slice(0,e)}selectProjectFile(e){return this.rpc("selectProjectFile",e).then(r=>r&&new U({tera:this,...r}))}getProjectFiles(e){return this.rpc("getProjectFiles",e).then(r=>r.map(o=>new U({tera:this,...o})))}getProjectFile(e,r){return this.rpc("getProjectFile",e,r).then(o=>o&&new U({tera:this,...o}))}createProjectFile(e){return this.rpc("createProjectFile",e).then(r=>r&&new U({tera:this,...r}))}};export{zt as default};
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
   * @version 10.1.4
   *)
*/
