var uo=Object.defineProperty;var co=(t,e,r)=>e in t?uo(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r;var d=(t,e,r)=>co(t,typeof e!="symbol"?e+"":e,r);function qt(t,e,r){if(!t||typeof t!="object"||!e||typeof e!="object")throw new Error("both arguments must be objects or arrays");r||(r=function(i){return i});function o({obj1:i,obj2:f,basePath:m,basePathForRemoves:x,diffs:v}){var O=Object.keys(i),P=O.length,y=Object.keys(f),_=y.length,b,p=i.length-f.length;if(xo(i,f)){for(var u=0;u<P;u++){var l=Array.isArray(i)?Number(O[u]):O[u];l in f||(b=x.concat(l),v.remove.push({op:"remove",path:r(b)}))}for(var u=0;u<_;u++){var l=Array.isArray(f)?Number(y[u]):y[u];s({key:l,obj1:i,obj2:f,path:m.concat(l),pathForRemoves:m.concat(l),diffs:v})}}else{for(var u=0;u<p;u++)b=x.concat(u),v.remove.push({op:"remove",path:r(b)});for(var E=i.slice(p),u=0;u<_;u++)s({key:u,obj1:E,obj2:f,path:m.concat(u),pathForRemoves:m.concat(u+p),diffs:v})}}var a={remove:[],replace:[],add:[]};return o({obj1:t,obj2:e,basePath:[],basePathForRemoves:[],diffs:a}),a.remove.reverse().concat(a.replace).concat(a.add);function s({key:i,obj1:f,obj2:m,path:x,pathForRemoves:v,diffs:O}){var P=f[i],y=m[i];if(!(i in f)&&i in m){var _=y;O.add.push({op:"add",path:r(x),value:_})}else P!==y&&(Object(P)!==P||Object(y)!==y||ho(P,y)||!Object.keys(P).length&&!Object.keys(y).length&&String(P)!=String(y)?n(x,O,y):o({obj1:f[i],obj2:m[i],basePath:x,basePathForRemoves:v,diffs:O}))}function n(i,f,m){f.replace.push({op:"replace",path:r(i),value:m})}}function ho(t,e){return Object.prototype.toString.call(t)!=Object.prototype.toString.call(e)}function xo(t,e){var r=t.length-e.length;if(Array.isArray(t)&&Array.isArray(e)&&r>0){for(var o=0,a=0,s=0;s<e.length&&String(t[s])===String(e[s]);s++)o++;for(var n=e.length;n>0&&String(t[n+r])===String(e[n]);n--)a++;return o>=a}return!0}var go=typeof global=="object"&&global&&global.Object===Object&&global,dt=go;var yo=typeof self=="object"&&self&&self.Object===Object&&self,bo=dt||yo||Function("return this")(),g=bo;var vo=g.Symbol,T=vo;var Yt=Object.prototype,wo=Yt.hasOwnProperty,To=Yt.toString,pt=T?T.toStringTag:void 0;function Po(t){var e=wo.call(t,pt),r=t[pt];try{t[pt]=void 0;var o=!0}catch{}var a=To.call(t);return o&&(e?t[pt]=r:delete t[pt]),a}var Zt=Po;var Ao=Object.prototype,Oo=Ao.toString;function jo(t){return Oo.call(t)}var Jt=jo;var So="[object Null]",Io="[object Undefined]",Xt=T?T.toStringTag:void 0;function _o(t){return t==null?t===void 0?Io:So:Xt&&Xt in Object(t)?Zt(t):Jt(t)}var I=_o;function Eo(t){return t!=null&&typeof t=="object"}var S=Eo;var Co="[object Symbol]";function Fo(t){return typeof t=="symbol"||S(t)&&I(t)==Co}var K=Fo;function Mo(t,e){for(var r=-1,o=t==null?0:t.length,a=Array(o);++r<o;)a[r]=e(t[r],r,t);return a}var Qt=Mo;var Ro=Array.isArray,w=Ro;var No=1/0,te=T?T.prototype:void 0,ee=te?te.toString:void 0;function re(t){if(typeof t=="string")return t;if(w(t))return Qt(t,re)+"";if(K(t))return ee?ee.call(t):"";var e=t+"";return e=="0"&&1/t==-No?"-0":e}var oe=re;function Lo(t){var e=typeof t;return t!=null&&(e=="object"||e=="function")}var j=Lo;function Bo(t){return t}var ae=Bo;var ko="[object AsyncFunction]",Uo="[object Function]",Do="[object GeneratorFunction]",zo="[object Proxy]";function Ko(t){if(!j(t))return!1;var e=I(t);return e==Uo||e==Do||e==ko||e==zo}var ct=Ko;var Go=g["__core-js_shared__"],ht=Go;var ie=function(){var t=/[^.]+$/.exec(ht&&ht.keys&&ht.keys.IE_PROTO||"");return t?"Symbol(src)_1."+t:""}();function Wo(t){return!!ie&&ie in t}var se=Wo;var $o=Function.prototype,Ho=$o.toString;function Vo(t){if(t!=null){try{return Ho.call(t)}catch{}try{return t+""}catch{}}return""}var C=Vo;var qo=/[\\^$.*+?()[\]{}|]/g,Yo=/^\[object .+?Constructor\]$/,Zo=Function.prototype,Jo=Object.prototype,Xo=Zo.toString,Qo=Jo.hasOwnProperty,ta=RegExp("^"+Xo.call(Qo).replace(qo,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");function ea(t){if(!j(t)||se(t))return!1;var e=ct(t)?ta:Yo;return e.test(C(t))}var ne=ea;function ra(t,e){return t==null?void 0:t[e]}var fe=ra;function oa(t,e){var r=fe(t,e);return ne(r)?r:void 0}var A=oa;var aa=A(g,"WeakMap"),xt=aa;var pe=Object.create,ia=function(){function t(){}return function(e){if(!j(e))return{};if(pe)return pe(e);t.prototype=e;var r=new t;return t.prototype=void 0,r}}(),le=ia;function sa(t,e,r){switch(r.length){case 0:return t.call(e);case 1:return t.call(e,r[0]);case 2:return t.call(e,r[0],r[1]);case 3:return t.call(e,r[0],r[1],r[2])}return t.apply(e,r)}var me=sa;function na(t,e){var r=-1,o=t.length;for(e||(e=Array(o));++r<o;)e[r]=t[r];return e}var ue=na;var fa=800,pa=16,la=Date.now;function ma(t){var e=0,r=0;return function(){var o=la(),a=pa-(o-r);if(r=o,a>0){if(++e>=fa)return arguments[0]}else e=0;return t.apply(void 0,arguments)}}var de=ma;function ua(t){return function(){return t}}var ce=ua;var da=function(){try{var t=A(Object,"defineProperty");return t({},"",{}),t}catch{}}(),G=da;var ca=G?function(t,e){return G(t,"toString",{configurable:!0,enumerable:!1,value:ce(e),writable:!0})}:ae,he=ca;var ha=de(he),xe=ha;function xa(t,e){for(var r=-1,o=t==null?0:t.length;++r<o&&e(t[r],r,t)!==!1;);return t}var ge=xa;var ga=9007199254740991,ya=/^(?:0|[1-9]\d*)$/;function ba(t,e){var r=typeof t;return e=e==null?ga:e,!!e&&(r=="number"||r!="symbol"&&ya.test(t))&&t>-1&&t%1==0&&t<e}var W=ba;function va(t,e,r){e=="__proto__"&&G?G(t,e,{configurable:!0,enumerable:!0,value:r,writable:!0}):t[e]=r}var gt=va;function wa(t,e){return t===e||t!==t&&e!==e}var yt=wa;var Ta=Object.prototype,Pa=Ta.hasOwnProperty;function Aa(t,e,r){var o=t[e];(!(Pa.call(t,e)&&yt(o,r))||r===void 0&&!(e in t))&&gt(t,e,r)}var $=Aa;function Oa(t,e,r,o){var a=!r;r||(r={});for(var s=-1,n=e.length;++s<n;){var i=e[s],f=o?o(r[i],t[i],i,r,t):void 0;f===void 0&&(f=t[i]),a?gt(r,i,f):$(r,i,f)}return r}var R=Oa;var ye=Math.max;function ja(t,e,r){return e=ye(e===void 0?t.length-1:e,0),function(){for(var o=arguments,a=-1,s=ye(o.length-e,0),n=Array(s);++a<s;)n[a]=o[e+a];a=-1;for(var i=Array(e+1);++a<e;)i[a]=o[a];return i[e]=r(n),me(t,this,i)}}var be=ja;var Sa=9007199254740991;function Ia(t){return typeof t=="number"&&t>-1&&t%1==0&&t<=Sa}var H=Ia;function _a(t){return t!=null&&H(t.length)&&!ct(t)}var bt=_a;var Ea=Object.prototype;function Ca(t){var e=t&&t.constructor,r=typeof e=="function"&&e.prototype||Ea;return t===r}var V=Ca;function Fa(t,e){for(var r=-1,o=Array(t);++r<t;)o[r]=e(r);return o}var ve=Fa;var Ma="[object Arguments]";function Ra(t){return S(t)&&I(t)==Ma}var Mt=Ra;var we=Object.prototype,Na=we.hasOwnProperty,La=we.propertyIsEnumerable,Ba=Mt(function(){return arguments}())?Mt:function(t){return S(t)&&Na.call(t,"callee")&&!La.call(t,"callee")},q=Ba;function ka(){return!1}var Te=ka;var Oe=typeof exports=="object"&&exports&&!exports.nodeType&&exports,Pe=Oe&&typeof module=="object"&&module&&!module.nodeType&&module,Ua=Pe&&Pe.exports===Oe,Ae=Ua?g.Buffer:void 0,Da=Ae?Ae.isBuffer:void 0,za=Da||Te,vt=za;var Ka="[object Arguments]",Ga="[object Array]",Wa="[object Boolean]",$a="[object Date]",Ha="[object Error]",Va="[object Function]",qa="[object Map]",Ya="[object Number]",Za="[object Object]",Ja="[object RegExp]",Xa="[object Set]",Qa="[object String]",ti="[object WeakMap]",ei="[object ArrayBuffer]",ri="[object DataView]",oi="[object Float32Array]",ai="[object Float64Array]",ii="[object Int8Array]",si="[object Int16Array]",ni="[object Int32Array]",fi="[object Uint8Array]",pi="[object Uint8ClampedArray]",li="[object Uint16Array]",mi="[object Uint32Array]",h={};h[oi]=h[ai]=h[ii]=h[si]=h[ni]=h[fi]=h[pi]=h[li]=h[mi]=!0;h[Ka]=h[Ga]=h[ei]=h[Wa]=h[ri]=h[$a]=h[Ha]=h[Va]=h[qa]=h[Ya]=h[Za]=h[Ja]=h[Xa]=h[Qa]=h[ti]=!1;function ui(t){return S(t)&&H(t.length)&&!!h[I(t)]}var je=ui;function di(t){return function(e){return t(e)}}var Y=di;var Se=typeof exports=="object"&&exports&&!exports.nodeType&&exports,lt=Se&&typeof module=="object"&&module&&!module.nodeType&&module,ci=lt&&lt.exports===Se,Rt=ci&&dt.process,hi=function(){try{var t=lt&&lt.require&&lt.require("util").types;return t||Rt&&Rt.binding&&Rt.binding("util")}catch{}}(),F=hi;var Ie=F&&F.isTypedArray,xi=Ie?Y(Ie):je,_e=xi;var gi=Object.prototype,yi=gi.hasOwnProperty;function bi(t,e){var r=w(t),o=!r&&q(t),a=!r&&!o&&vt(t),s=!r&&!o&&!a&&_e(t),n=r||o||a||s,i=n?ve(t.length,String):[],f=i.length;for(var m in t)(e||yi.call(t,m))&&!(n&&(m=="length"||a&&(m=="offset"||m=="parent")||s&&(m=="buffer"||m=="byteLength"||m=="byteOffset")||W(m,f)))&&i.push(m);return i}var wt=bi;function vi(t,e){return function(r){return t(e(r))}}var Tt=vi;var wi=Tt(Object.keys,Object),Ee=wi;var Ti=Object.prototype,Pi=Ti.hasOwnProperty;function Ai(t){if(!V(t))return Ee(t);var e=[];for(var r in Object(t))Pi.call(t,r)&&r!="constructor"&&e.push(r);return e}var Ce=Ai;function Oi(t){return bt(t)?wt(t):Ce(t)}var Z=Oi;function ji(t){var e=[];if(t!=null)for(var r in Object(t))e.push(r);return e}var Fe=ji;var Si=Object.prototype,Ii=Si.hasOwnProperty;function _i(t){if(!j(t))return Fe(t);var e=V(t),r=[];for(var o in t)o=="constructor"&&(e||!Ii.call(t,o))||r.push(o);return r}var Me=_i;function Ei(t){return bt(t)?wt(t,!0):Me(t)}var J=Ei;var Ci=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,Fi=/^\w*$/;function Mi(t,e){if(w(t))return!1;var r=typeof t;return r=="number"||r=="symbol"||r=="boolean"||t==null||K(t)?!0:Fi.test(t)||!Ci.test(t)||e!=null&&t in Object(e)}var Re=Mi;var Ri=A(Object,"create"),M=Ri;function Ni(){this.__data__=M?M(null):{},this.size=0}var Ne=Ni;function Li(t){var e=this.has(t)&&delete this.__data__[t];return this.size-=e?1:0,e}var Le=Li;var Bi="__lodash_hash_undefined__",ki=Object.prototype,Ui=ki.hasOwnProperty;function Di(t){var e=this.__data__;if(M){var r=e[t];return r===Bi?void 0:r}return Ui.call(e,t)?e[t]:void 0}var Be=Di;var zi=Object.prototype,Ki=zi.hasOwnProperty;function Gi(t){var e=this.__data__;return M?e[t]!==void 0:Ki.call(e,t)}var ke=Gi;var Wi="__lodash_hash_undefined__";function $i(t,e){var r=this.__data__;return this.size+=this.has(t)?0:1,r[t]=M&&e===void 0?Wi:e,this}var Ue=$i;function X(t){var e=-1,r=t==null?0:t.length;for(this.clear();++e<r;){var o=t[e];this.set(o[0],o[1])}}X.prototype.clear=Ne;X.prototype.delete=Le;X.prototype.get=Be;X.prototype.has=ke;X.prototype.set=Ue;var Nt=X;function Hi(){this.__data__=[],this.size=0}var De=Hi;function Vi(t,e){for(var r=t.length;r--;)if(yt(t[r][0],e))return r;return-1}var N=Vi;var qi=Array.prototype,Yi=qi.splice;function Zi(t){var e=this.__data__,r=N(e,t);if(r<0)return!1;var o=e.length-1;return r==o?e.pop():Yi.call(e,r,1),--this.size,!0}var ze=Zi;function Ji(t){var e=this.__data__,r=N(e,t);return r<0?void 0:e[r][1]}var Ke=Ji;function Xi(t){return N(this.__data__,t)>-1}var Ge=Xi;function Qi(t,e){var r=this.__data__,o=N(r,t);return o<0?(++this.size,r.push([t,e])):r[o][1]=e,this}var We=Qi;function Q(t){var e=-1,r=t==null?0:t.length;for(this.clear();++e<r;){var o=t[e];this.set(o[0],o[1])}}Q.prototype.clear=De;Q.prototype.delete=ze;Q.prototype.get=Ke;Q.prototype.has=Ge;Q.prototype.set=We;var L=Q;var ts=A(g,"Map"),B=ts;function es(){this.size=0,this.__data__={hash:new Nt,map:new(B||L),string:new Nt}}var $e=es;function rs(t){var e=typeof t;return e=="string"||e=="number"||e=="symbol"||e=="boolean"?t!=="__proto__":t===null}var He=rs;function os(t,e){var r=t.__data__;return He(e)?r[typeof e=="string"?"string":"hash"]:r.map}var k=os;function as(t){var e=k(this,t).delete(t);return this.size-=e?1:0,e}var Ve=as;function is(t){return k(this,t).get(t)}var qe=is;function ss(t){return k(this,t).has(t)}var Ye=ss;function ns(t,e){var r=k(this,t),o=r.size;return r.set(t,e),this.size+=r.size==o?0:1,this}var Ze=ns;function tt(t){var e=-1,r=t==null?0:t.length;for(this.clear();++e<r;){var o=t[e];this.set(o[0],o[1])}}tt.prototype.clear=$e;tt.prototype.delete=Ve;tt.prototype.get=qe;tt.prototype.has=Ye;tt.prototype.set=Ze;var mt=tt;var fs="Expected a function";function Lt(t,e){if(typeof t!="function"||e!=null&&typeof e!="function")throw new TypeError(fs);var r=function(){var o=arguments,a=e?e.apply(this,o):o[0],s=r.cache;if(s.has(a))return s.get(a);var n=t.apply(this,o);return r.cache=s.set(a,n)||s,n};return r.cache=new(Lt.Cache||mt),r}Lt.Cache=mt;var Je=Lt;var ps=500;function ls(t){var e=Je(t,function(o){return r.size===ps&&r.clear(),o}),r=e.cache;return e}var Xe=ls;var ms=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,us=/\\(\\)?/g,ds=Xe(function(t){var e=[];return t.charCodeAt(0)===46&&e.push(""),t.replace(ms,function(r,o,a,s){e.push(a?s.replace(us,"$1"):o||r)}),e}),Qe=ds;function cs(t){return t==null?"":oe(t)}var tr=cs;function hs(t,e){return w(t)?t:Re(t,e)?[t]:Qe(tr(t))}var U=hs;var xs=1/0;function gs(t){if(typeof t=="string"||K(t))return t;var e=t+"";return e=="0"&&1/t==-xs?"-0":e}var et=gs;function ys(t,e){e=U(e,t);for(var r=0,o=e.length;t!=null&&r<o;)t=t[et(e[r++])];return r&&r==o?t:void 0}var er=ys;function bs(t,e){for(var r=-1,o=e.length,a=t.length;++r<o;)t[a+r]=e[r];return t}var rt=bs;var rr=T?T.isConcatSpreadable:void 0;function vs(t){return w(t)||q(t)||!!(rr&&t&&t[rr])}var or=vs;function ar(t,e,r,o,a){var s=-1,n=t.length;for(r||(r=or),a||(a=[]);++s<n;){var i=t[s];e>0&&r(i)?e>1?ar(i,e-1,r,o,a):rt(a,i):o||(a[a.length]=i)}return a}var ir=ar;function ws(t){var e=t==null?0:t.length;return e?ir(t,1):[]}var sr=ws;function Ts(t){return xe(be(t,void 0,sr),t+"")}var nr=Ts;var Ps=Tt(Object.getPrototypeOf,Object),Pt=Ps;function As(){this.__data__=new L,this.size=0}var fr=As;function Os(t){var e=this.__data__,r=e.delete(t);return this.size=e.size,r}var pr=Os;function js(t){return this.__data__.get(t)}var lr=js;function Ss(t){return this.__data__.has(t)}var mr=Ss;var Is=200;function _s(t,e){var r=this.__data__;if(r instanceof L){var o=r.__data__;if(!B||o.length<Is-1)return o.push([t,e]),this.size=++r.size,this;r=this.__data__=new mt(o)}return r.set(t,e),this.size=r.size,this}var ur=_s;function ot(t){var e=this.__data__=new L(t);this.size=e.size}ot.prototype.clear=fr;ot.prototype.delete=pr;ot.prototype.get=lr;ot.prototype.has=mr;ot.prototype.set=ur;var dr=ot;function Es(t,e){return t&&R(e,Z(e),t)}var cr=Es;function Cs(t,e){return t&&R(e,J(e),t)}var hr=Cs;var br=typeof exports=="object"&&exports&&!exports.nodeType&&exports,xr=br&&typeof module=="object"&&module&&!module.nodeType&&module,Fs=xr&&xr.exports===br,gr=Fs?g.Buffer:void 0,yr=gr?gr.allocUnsafe:void 0;function Ms(t,e){if(e)return t.slice();var r=t.length,o=yr?yr(r):new t.constructor(r);return t.copy(o),o}var vr=Ms;function Rs(t,e){for(var r=-1,o=t==null?0:t.length,a=0,s=[];++r<o;){var n=t[r];e(n,r,t)&&(s[a++]=n)}return s}var wr=Rs;function Ns(){return[]}var At=Ns;var Ls=Object.prototype,Bs=Ls.propertyIsEnumerable,Tr=Object.getOwnPropertySymbols,ks=Tr?function(t){return t==null?[]:(t=Object(t),wr(Tr(t),function(e){return Bs.call(t,e)}))}:At,at=ks;function Us(t,e){return R(t,at(t),e)}var Pr=Us;var Ds=Object.getOwnPropertySymbols,zs=Ds?function(t){for(var e=[];t;)rt(e,at(t)),t=Pt(t);return e}:At,Ot=zs;function Ks(t,e){return R(t,Ot(t),e)}var Ar=Ks;function Gs(t,e,r){var o=e(t);return w(t)?o:rt(o,r(t))}var jt=Gs;function Ws(t){return jt(t,Z,at)}var Or=Ws;function $s(t){return jt(t,J,Ot)}var jr=$s;var Hs=A(g,"DataView"),St=Hs;var Vs=A(g,"Promise"),It=Vs;var qs=A(g,"Set"),_t=qs;var Sr="[object Map]",Ys="[object Object]",Ir="[object Promise]",_r="[object Set]",Er="[object WeakMap]",Cr="[object DataView]",Zs=C(St),Js=C(B),Xs=C(It),Qs=C(_t),tn=C(xt),z=I;(St&&z(new St(new ArrayBuffer(1)))!=Cr||B&&z(new B)!=Sr||It&&z(It.resolve())!=Ir||_t&&z(new _t)!=_r||xt&&z(new xt)!=Er)&&(z=function(t){var e=I(t),r=e==Ys?t.constructor:void 0,o=r?C(r):"";if(o)switch(o){case Zs:return Cr;case Js:return Sr;case Xs:return Ir;case Qs:return _r;case tn:return Er}return e});var it=z;var en=Object.prototype,rn=en.hasOwnProperty;function on(t){var e=t.length,r=new t.constructor(e);return e&&typeof t[0]=="string"&&rn.call(t,"index")&&(r.index=t.index,r.input=t.input),r}var Fr=on;var an=g.Uint8Array,Bt=an;function sn(t){var e=new t.constructor(t.byteLength);return new Bt(e).set(new Bt(t)),e}var st=sn;function nn(t,e){var r=e?st(t.buffer):t.buffer;return new t.constructor(r,t.byteOffset,t.byteLength)}var Mr=nn;var fn=/\w*$/;function pn(t){var e=new t.constructor(t.source,fn.exec(t));return e.lastIndex=t.lastIndex,e}var Rr=pn;var Nr=T?T.prototype:void 0,Lr=Nr?Nr.valueOf:void 0;function ln(t){return Lr?Object(Lr.call(t)):{}}var Br=ln;function mn(t,e){var r=e?st(t.buffer):t.buffer;return new t.constructor(r,t.byteOffset,t.length)}var kr=mn;var un="[object Boolean]",dn="[object Date]",cn="[object Map]",hn="[object Number]",xn="[object RegExp]",gn="[object Set]",yn="[object String]",bn="[object Symbol]",vn="[object ArrayBuffer]",wn="[object DataView]",Tn="[object Float32Array]",Pn="[object Float64Array]",An="[object Int8Array]",On="[object Int16Array]",jn="[object Int32Array]",Sn="[object Uint8Array]",In="[object Uint8ClampedArray]",_n="[object Uint16Array]",En="[object Uint32Array]";function Cn(t,e,r){var o=t.constructor;switch(e){case vn:return st(t);case un:case dn:return new o(+t);case wn:return Mr(t,r);case Tn:case Pn:case An:case On:case jn:case Sn:case In:case _n:case En:return kr(t,r);case cn:return new o;case hn:case yn:return new o(t);case xn:return Rr(t);case gn:return new o;case bn:return Br(t)}}var Ur=Cn;function Fn(t){return typeof t.constructor=="function"&&!V(t)?le(Pt(t)):{}}var Dr=Fn;var Mn="[object Map]";function Rn(t){return S(t)&&it(t)==Mn}var zr=Rn;var Kr=F&&F.isMap,Nn=Kr?Y(Kr):zr,Gr=Nn;var Ln="[object Set]";function Bn(t){return S(t)&&it(t)==Ln}var Wr=Bn;var $r=F&&F.isSet,kn=$r?Y($r):Wr,Hr=kn;var Un=1,Dn=2,zn=4,Vr="[object Arguments]",Kn="[object Array]",Gn="[object Boolean]",Wn="[object Date]",$n="[object Error]",qr="[object Function]",Hn="[object GeneratorFunction]",Vn="[object Map]",qn="[object Number]",Yr="[object Object]",Yn="[object RegExp]",Zn="[object Set]",Jn="[object String]",Xn="[object Symbol]",Qn="[object WeakMap]",tf="[object ArrayBuffer]",ef="[object DataView]",rf="[object Float32Array]",of="[object Float64Array]",af="[object Int8Array]",sf="[object Int16Array]",nf="[object Int32Array]",ff="[object Uint8Array]",pf="[object Uint8ClampedArray]",lf="[object Uint16Array]",mf="[object Uint32Array]",c={};c[Vr]=c[Kn]=c[tf]=c[ef]=c[Gn]=c[Wn]=c[rf]=c[of]=c[af]=c[sf]=c[nf]=c[Vn]=c[qn]=c[Yr]=c[Yn]=c[Zn]=c[Jn]=c[Xn]=c[ff]=c[pf]=c[lf]=c[mf]=!0;c[$n]=c[qr]=c[Qn]=!1;function Et(t,e,r,o,a,s){var n,i=e&Un,f=e&Dn,m=e&zn;if(r&&(n=a?r(t,o,a,s):r(t)),n!==void 0)return n;if(!j(t))return t;var x=w(t);if(x){if(n=Fr(t),!i)return ue(t,n)}else{var v=it(t),O=v==qr||v==Hn;if(vt(t))return vr(t,i);if(v==Yr||v==Vr||O&&!a){if(n=f||O?{}:Dr(t),!i)return f?Ar(t,hr(n,t)):Pr(t,cr(n,t))}else{if(!c[v])return a?t:{};n=Ur(t,v,i)}}s||(s=new dr);var P=s.get(t);if(P)return P;s.set(t,n),Hr(t)?t.forEach(function(b){n.add(Et(b,e,r,b,t,s))}):Gr(t)&&t.forEach(function(b,p){n.set(p,Et(b,e,r,p,t,s))});var y=m?f?jr:Or:f?J:Z,_=x?void 0:y(t);return ge(_||t,function(b,p){_&&(p=b,b=t[p]),$(n,p,Et(b,e,r,p,t,s))}),n}var Zr=Et;var uf=1,df=4;function cf(t){return Zr(t,uf|df)}var kt=cf;function hf(t,e){return t!=null&&e in Object(t)}var Jr=hf;function xf(t,e,r){e=U(e,t);for(var o=-1,a=e.length,s=!1;++o<a;){var n=et(e[o]);if(!(s=t!=null&&r(t,n)))break;t=t[n]}return s||++o!=a?s:(a=t==null?0:t.length,!!a&&H(a)&&W(n,a)&&(w(t)||q(t)))}var Xr=xf;function gf(t,e){return t!=null&&Xr(t,e,Jr)}var Qr=gf;function yf(t,e,r,o){if(!j(t))return t;e=U(e,t);for(var a=-1,s=e.length,n=s-1,i=t;i!=null&&++a<s;){var f=et(e[a]),m=r;if(f==="__proto__"||f==="constructor"||f==="prototype")return t;if(a!=n){var x=i[f];m=o?o(x,f,i):void 0,m===void 0&&(m=j(x)?x:W(e[a+1])?[]:{})}$(i,f,m),i=i[f]}return t}var to=yf;function bf(t,e,r){for(var o=-1,a=e.length,s={};++o<a;){var n=e[o],i=er(t,n);r(i,n)&&to(s,U(n,t),i)}return s}var eo=bf;function vf(t,e){return eo(t,e,function(r,o){return Qr(t,o)})}var ro=vf;var wf=nr(function(t,e){return t==null?{}:ro(t,e)}),Ct=wf;function oo(t){return{all:t=t||new Map,on:function(e,r){var o=t.get(e);o?o.push(r):t.set(e,[r])},off:function(e,r){var o=t.get(e);o&&(r?o.splice(o.indexOf(r)>>>0,1):t.set(e,[]))},emit:function(e,r){var o=t.get(e);o&&o.slice().map(function(a){a(r)}),(o=t.get("*"))&&o.slice().map(function(a){a(e,r)})}}}var ao="useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";var Ut=(t=21)=>{let e="",r=crypto.getRandomValues(new Uint8Array(t));for(;t--;)e+=ao[r[t]&63];return e};var Tf="array",Pf="bit",io="bits",Af="byte",so="bytes",nt="",Of="exponent",jf="function",no="iec",Sf="Invalid number",If="Invalid rounding method",Dt="jedec",_f="object",fo=".",Ef="round",Cf="s",Ff="si",Mf="kbit",Rf="kB",Nf=" ",Lf="string",Bf="0",zt={symbol:{iec:{bits:["bit","Kibit","Mibit","Gibit","Tibit","Pibit","Eibit","Zibit","Yibit"],bytes:["B","KiB","MiB","GiB","TiB","PiB","EiB","ZiB","YiB"]},jedec:{bits:["bit","Kbit","Mbit","Gbit","Tbit","Pbit","Ebit","Zbit","Ybit"],bytes:["B","KB","MB","GB","TB","PB","EB","ZB","YB"]}},fullform:{iec:["","kibi","mebi","gibi","tebi","pebi","exbi","zebi","yobi"],jedec:["","kilo","mega","giga","tera","peta","exa","zetta","yotta"]}};function po(t,{bits:e=!1,pad:r=!1,base:o=-1,round:a=2,locale:s=nt,localeOptions:n={},separator:i=nt,spacer:f=Nf,symbols:m={},standard:x=nt,output:v=Lf,fullform:O=!1,fullforms:P=[],exponent:y=-1,roundingMethod:_=Ef,precision:b=0}={}){let p=y,u=Number(t),l=[],E=0,Ft=nt;x===Ff?(o=10,x=Dt):x===no||x===Dt?o=2:o===2?x=no:(o=10,x=Dt);let ut=o===10?1e3:1024,lo=O===!0,Gt=u<0,Wt=Math[_];if(typeof t!="bigint"&&isNaN(t))throw new TypeError(Sf);if(typeof Wt!==jf)throw new TypeError(If);if(Gt&&(u=-u),(p===-1||isNaN(p))&&(p=Math.floor(Math.log(u)/Math.log(ut)),p<0&&(p=0)),p>8&&(b>0&&(b+=8-p),p=8),v===Of)return p;if(u===0)l[0]=0,Ft=l[1]=zt.symbol[x][e?io:so][p];else{E=u/(o===2?Math.pow(2,p*10):Math.pow(1e3,p)),e&&(E=E*8,E>=ut&&p<8&&(E=E/ut,p++));let ft=Math.pow(10,p>0?a:0);l[0]=Wt(E*ft)/ft,l[0]===ut&&p<8&&y===-1&&(l[0]=1,p++),Ft=l[1]=o===10&&p===1?e?Mf:Rf:zt.symbol[x][e?io:so][p]}if(Gt&&(l[0]=-l[0]),b>0&&(l[0]=l[0].toPrecision(b)),l[1]=m[l[1]]||l[1],s===!0?l[0]=l[0].toLocaleString():s.length>0?l[0]=l[0].toLocaleString(s,n):i.length>0&&(l[0]=l[0].toString().replace(fo,i)),r&&Number.isInteger(l[0])===!1&&a>0){let ft=i||fo,$t=l[0].toString().split(ft),Ht=$t[1]||nt,Vt=Ht.length,mo=a-Vt;l[0]=`${$t[0]}${ft}${Ht.padEnd(Vt+mo,Bf)}`}return lo&&(l[1]=P[p]?P[p]:zt.fullform[x][p]+(e?Pf:Af)+(l[0]===1?nt:Cf)),v===Tf?l:v===_f?{value:l[0],symbol:l[1],exponent:p,unit:Ft}:l.join(f)}var D=class t{constructor(e){d(this,"_tera");d(this,"id");d(this,"name");d(this,"icon");d(this,"path");d(this,"url");d(this,"teraUrl");d(this,"parsedName");d(this,"created");d(this,"createdFormatted");d(this,"modified");d(this,"modifiedFormatted");d(this,"accessed");d(this,"accessedFormatted");d(this,"size");d(this,"sizeFormatted");d(this,"mime");d(this,"meta",{});if(!e.tera)throw new Error("Basic file requires a `tera` key to access the Tera instance");Object.assign(this,e);let r=this.tera;Object.defineProperty(this,"_tera",{enumerable:!1,configurable:!1,get(){return r}}),delete this.tera,this.teraUrl=this.url.replace(/^https?:\/\/(?:.+?)\/projects\/(?:.+?)\/project\/(.+)$/,"/project/$1"),this.sizeFormatted=po(this.size||0,{spacer:""}),this.createdFormatted=this.created?this.created.toLocaleDateString():"Unknown created date",this.modifiedFormatted=this.modified?this.modified.toLocaleDateString():"Unknown modified date",this.accessedFormatted=this.accessed?this.accessed.toLocaleDateString():"Unknown access date"}getContents(e){return this._tera.getProjectFileContents(this.id,e)}setContents(e){return this._tera.setProjectFileContents(this.id,e)}getRefs(){return this._tera.getProjectLibrary(this.id)}setRefs(e){return this._tera.setProjectLibrary(this.id,e)}serialize(){return Ct(this,["id","name","icon","path","url","parsedName","created","modified","accessed","size","mime","meta"])}static deserialize(e){return new t(Ct(e,["tera","id","name","icon","path","url","parsedName","created","modified","accessed","size","mime","meta"]))}};var Kt=class{constructor(e){d(this,"settings",{session:null,devMode:!1,verbosity:1,mode:"detect",modeTimeout:300,modeFallback:"child",modeOverrides:{child(e){e.siteUrl=="https://tera-tools.com/embed"&&(e.siteUrl="https://dev.tera-tools.com/embed")}},siteUrl:"https://tera-tools.com/embed",restrictOrigin:"*",frameSandbox:["allow-forms","allow-modals","allow-orientation-lock","allow-pointer-lock","allow-popups","allow-popups-to-escape-sandbox","allow-presentation","allow-same-origin","allow-scripts","allow-top-navigation"],handshakeInterval:1e3,handshakeTimeout:1e4,debugPaths:null});d(this,"events",oo());d(this,"dom",{el:null,iframe:null,popup:null,stylesheet:null});d(this,"methods",["handshake","setServerVerbosity","getUser","requireUser","bindProject","getProject","getProjects","setActiveProject","requireProject","selectProject","getProjectState","setProjectState","setProjectStateDefaults","setProjectStateFlush","setProjectStateRefresh","saveProjectState","replaceProjectState","getProjectFileContents","deleteProjectFile","setProjectFileContents","selectProjectLibrary","getProjectLibrary","setProjectLibrary","projectLog","setPage","uiAlert","uiConfirm","uiPanic","uiProgress","uiPrompt","uiThrow","uiSplat","uiWindow"]);d(this,"plugins",[]);d(this,"acceptPostboxes",{});e&&this.set(e)}send(e){let r=Ut();return this.acceptPostboxes[r]={},this.acceptPostboxes[r].promise=new Promise((o,a)=>{Object.assign(this.acceptPostboxes[r],{resolve:o,reject:a}),this.sendRaw({id:r,...e})}),this.acceptPostboxes[r].promise}sendRaw(e){let r;try{if(r={TERA:1,id:e.id||Ut(),...kt(e)},this.settings.mode=="parent")window.parent.postMessage(r,this.settings.restrictOrigin);else if(this.settings.mode=="child")this.dom.iframe.contentWindow.postMessage(r,this.settings.restrictOrigin);else if(this.settings.mode=="popup")this.dom.popup.postMessage(r,this.settings.restrictOrigin);else throw this.settings.mode=="detect"?new Error("Call init() or detectMode() before trying to send data to determine the mode"):new Error(`Unknown TERA communication mode "${this.settings.mode}"`)}catch(o){throw this.debug("ERROR",1,"Message compose client->server:",o),this.debug("ERROR",1,"Attempted to dispatch payload client->server",r),o}}rpc(e,...r){return this.send({action:"rpc",method:e,args:r})}acceptMessage(e){if(e.origin==window.location.origin)return Promise.resolve();let r=e.data;return!r.TERA||!r.id?Promise.resolve():(this.debug("INFO",3,"Recieved message",r),(r==null?void 0:r.action)=="response"&&this.acceptPostboxes[r.id]?(r.isError===!0?this.acceptPostboxes[r.id].reject(r.response):this.acceptPostboxes[r.id].resolve(r.response),Promise.resolve()):(r==null?void 0:r.action)=="rpc"?Promise.resolve().then(()=>this[r.method].apply(this,r.args)).then(o=>this.sendRaw({id:r.id,action:"response",response:o})).catch(o=>{console.warn(`TERA-FY client threw on RPC:${r.method}:`,o),this.sendRaw({id:r.id,action:"response",isError:!0,response:o&&o.toString()})}):(r==null?void 0:r.action)=="event"?Promise.resolve().then(()=>this.events.emit(r.event,...r.payload)).catch(o=>{throw console.warn(`TERA-FY client threw while handling emitted event "${r.event}"`,{message:r}),o}):r!=null&&r.id?(this.debug("INFO",3,`Ignoring message ID ${r.id} - was meant for someone else?`),Promise.resolve()):(this.debug("INFO",3,"Unexpected incoming TERA-FY CLIENT message",{message:r}),Promise.resolve()))}createProjectStatePatch(e,r){let o=qt(r,e);return this.debug("INFO",3,"Created project patch",{patch:o,newState:e,oldState:r}),this.applyProjectStatePatch(o)}applyProjectStatePatch(e){if(this.settings.devMode&&this.settings.debugPaths){if(!Array.isArray(this.settings.debugPaths))throw new Error("teraFyClient.settings.debugPaths should be either null or an Array<String>");let r=e.filter(o=>this.settings.debugPaths.some(a=>o.path.join(".").slice(0,a.length)==a)).map(o=>o.path.join("."));if(r.length>0){console.info("Detected writes to",r,"- entering debugging mode");debugger}}return this.rpc("applyProjectStatePatch",e,{session:this.settings.session})}applyProjectStatePatchLocal(e){throw new Error("applyProjectStatePatchLocal() has not been sub-classed by a plugin")}init(e){if(e&&this.set(e),this.init.promise)return this.init.promise;window.addEventListener("message",this.acceptMessage.bind(this));let r=this;return this.init.promise=Promise.resolve().then(()=>{var o;return(o=this.settings).session||(o.session="tfy-"+this.getEntropicString(16))}).then(()=>this.debug("INFO",4,"[0/6] Init","Session",this.settings.session,"against",this.settings.siteUrl)).then(()=>{this.settings.devMode&&(this.settings.debugPaths=this.settings.debugPaths?Array.isArray(this.settings.debugPaths)?this.settings.debugPaths.map(o=>Array.isArray(o)?o.join("."):typeof o=="string"?o:(()=>{throw new Error("Unknown path type - should be an array or string in dotted notation")})()):(()=>{throw new Error("Unknown terafyClient.settings.debugPaths type")})():null,this.debug("INFO",0,"Watching state paths",this.settings.debugPaths))}).then(()=>this.detectMode()).then(o=>{if(this.debug("INFO",4,"[1/6] Setting client mode to",o),this.settings.mode=o,this.settings.modeOverrides[o])return this.debug("INFO",4,"[1/6] Applying specific config overrides for mode",o),this.settings.modeOverrides[o](this.settings)}).then(()=>this.debug("INFO",4,"[2/6] Injecting comms + styles + methods")).then(()=>Promise.all([this.injectComms(),this.injectStylesheet(),this.injectMethods()])).then(()=>{if(this.settings.verbosity<=1){this.debug("INFO",4,"[3/6] Skip - Server verbosity is already at 1");return}else return this.debug("INFO",4,`[3/6] Set server verbosity to ${this.settings.verbosity}`),this.rpc("setServerVerbosity",this.settings.verbosity)}).then(()=>this.debug("INFO",4,`[4/6] Set server mode to "${this.settings.mode}"`)).then(()=>this.rpc("setServerMode",this.settings.mode=="child"?"embedded":this.settings.mode=="parent"?"frame":this.settings.mode=="popup"?"popup":(()=>{throw`Unknown server mode "${this.settings.mode}"`})())).then(()=>this.debug("INFO",4,"[5/6] Run client plugins")).then(()=>Promise.all(this.plugins.map(o=>o.init.call(r,this.settings)))).then(()=>this.debug("INFO",4,"[6/6] Init complete")).catch(o=>this.debug("WARN",0,"Init process fault",o))}detectMode(){return this.settings.mode!="detect"?Promise.resolve(this.settings.mode):window.self===window.parent?Promise.resolve(this.settings.modeFallback):Promise.resolve().then(()=>this.settings.mode="parent").then(()=>new Promise((e,r)=>{let o=setTimeout(()=>r(),this.settings.modeTimeout);this.rpc("handshake").then(()=>clearTimeout(o)).then(()=>e())})).then(()=>"parent").catch(()=>this.settings.modeFallback)}injectComms(){switch(this.settings.mode){case"child":return Promise.resolve().then(()=>new Promise(e=>{this.debug("INFO",2,"Injecting TERA site as iFrame child"),this.dom.el=document.createElement("div"),this.dom.el.id="tera-fy",this.dom.el.classList.toggle("dev-mode",this.settings.devMode),this.dom.el.classList.add("minimized"),document.body.append(this.dom.el),this.dom.el.addEventListener("click",()=>this.dom.el.classList.toggle("minimized")),this.dom.iframe=document.createElement("iframe"),this.dom.iframe.setAttribute("sandbox",this.settings.frameSandbox.join(" ")),this.dom.iframe.addEventListener("load",()=>{this.debug("INFO",3,"Embeded iframe ready"),e()}),this.dom.iframe.src=this.settings.siteUrl,this.dom.el.append(this.dom.iframe)})).then(()=>this.handshakeLoop());case"parent":return this.debug("INFO",2,"Using TERA window parent"),Promise.resolve();case"popup":return this.debug("INFO",2,"Injecting TERA site as a popup window"),this.dom.popup=window.open(this.settings.siteUrl,"_blank","popup=1, location=0, menubar=0, status=0, scrollbars=0, width=500, height=600"),this.handshakeLoop().then(()=>this.debug("INFO",3,"Popup window accepted handshake"));default:throw new Error(`Unsupported mode "${this.settings.mode}" when calling injectComms()`)}}handshakeLoop(e){let r={handshakeInterval:this.settings.handshakeInterval,handshakeTimeout:this.settings.handshakeTimeout,...e};return new Promise((o,a)=>{let s=0,n,i=setTimeout(()=>{clearTimeout(n),a("TIMEOUT")},r.handshakeTimeout),f=()=>{this.debug("INFO",4,"Trying handshake",++s),clearTimeout(n),n=setTimeout(f,r.handshakeInterval),this.rpc("handshake").then(()=>{clearTimeout(i),clearTimeout(n)}).then(()=>o()).catch(a)};f()})}injectStylesheet(){switch(this.settings.mode){case"child":this.dom.stylesheet=document.createElement("style"),this.dom.stylesheet.innerHTML=[":root {","--TERA-accent: #4d659c;","}","#tera-fy {","display: none;","position: fixed;","right: 50px;","bottom: 50px;","width: 300px;","height: 150px;","background: transparent;","body:not(.tera-fy-focus) &.minimized.dev-mode {","background: var(--TERA-accent) !important;","opacity: 0.5;","right: 0px;","bottom: 0px;","width: 30px;","height: 30px;","transition: opacity 0.2s ease-out;","cursor: pointer;","border: none;","border-top-left-radius: 30px;","border-top: 2px solid var(--TERA-accent);","border-left: 2px solid var(--TERA-accent);","display: flex;","justify-content: center;","align-items: center;","&::before {","margin: 2px 0 0 0;",'content: "\u{1F300}";',"color: #FFF;","}","&:hover {","opacity: 1;","}","& > iframe {","display: none;","}","}","body:not(.tera-fy-focus) &:not(.minimized) {","&::before {","display: flex;","align-items: center;","justify-content: center;","cursor: pointer;","background: var(--TERA-accent) !important;","opacity: 0.5;","transition: opacity 0.2s ease-out;","position: absolute;","right: 0px;","bottom: 0px;","width: 20px;","height: 20px;","margin: 2px 0 0 0;",'content: "\u2B68";',"color: #FFF;","border: none;","border-top-left-radius: 30px;","border-top: 2px solid var(--TERA-accent);","border-left: 2px solid var(--TERA-accent);","}","&:hover::before {","opacity: 1;","}","}","&.dev-mode {","display: flex;","border: 5px solid var(--TERA-accent);","background: #FFF;","}","& > iframe {","width: 100%;","height: 100%;","}","}","body.tera-fy-focus {","overflow: hidden;","& #tera-fy {","display: flex !important;","position: fixed !important;","top: 0px !important;","width: 100vw !important;","height: 100vh !important;","left: 0px !important;","z-index: 10000 !important;","}","}"].join(`
`),document.head.appendChild(this.dom.stylesheet);break;case"parent":case"popup":break;default:throw new Error(`Unsupported mode "${this.settings.mode}" when injectStylesheet()`)}return Promise.resolve()}injectMethods(){this.methods.forEach(e=>this[e]=this.rpc.bind(this,e))}debug(...e){if(!this.settings.devMode||this.settings.verbosity<1)return;let r="log",o=1;typeof e[0]=="string"&&["INFO","LOG","WARN","ERROR"].includes(e[0])&&(r=e.shift().toLowerCase()),typeof e[0]=="number"&&(o=e[0],e.shift()),!(this.settings.verbosity<o)&&console[r]("%c[TERA-FY CLIENT]","font-weight: bold; color: #ff5722;",...e)}set(e,r,o){let a={ignoreNullish:!0,...o};return typeof e=="string"?(!a.ignoreNullish||r!=null)&&(this.settings[e]=r):Object.assign(this.settings,e),this.toggleDevMode(this.settings.devMode)}setIfDev(e,r,o){return!this.settings.devMode||r===void 0?this:this.set(e,r,o)}use(e,r){let o=typeof e=="function"?new e(this,r):typeof e=="object"?e:typeof e=="string"?(()=>{throw new Error("use(String) is not yet supported")})():(()=>{throw new Error("Expected use() call to be provided with a class initalizer")})();return this.mixin(this,o),this.plugins.push(o),this}mixin(e,r){Object.getOwnPropertyNames(Object.getPrototypeOf(r)).filter(o=>!["constructor","prototype","name"].includes(o)).filter(o=>o!="init").forEach(o=>{Object.defineProperty(e,o,{value:r[o].bind(e),enumerable:!1})})}toggleDevMode(e="toggle"){var r;return e==="toggle"?this.settings.devMode=!this.settings.devMode:e==="proxy"?Object.assign(this.settings,{devMode:!0,siteUrl:"http://localhost:7334/embed",mode:"child"}):this.settings.devMode=!!e,this.settings.devMode&&(this.settings.restrictOrigin="*"),(r=this.dom)!=null&&r.el&&this.dom.el.classList.toggle("dev-mode",this.settings.devMode),this}toggleFocus(e="toggle"){this.debug("INFO",2,"Request focus",{isFocused:e}),globalThis.document.body.classList.toggle("tera-fy-focus",e==="toggle"?void 0:e)}getEntropicString(e=32){let r=new Uint32Array(4);return window.crypto.getRandomValues(r),btoa(String.fromCharCode(...new Uint8Array(r.buffer))).replace(/[+/]/g,"").slice(0,e)}selectProjectFile(e){return this.rpc("selectProjectFile",e).then(r=>r&&new D({tera:this,...r}))}getProjectFiles(e){return this.rpc("getProjectFiles",e).then(r=>r.map(o=>new D({tera:this,...o})))}getProjectFile(e,r){return this.rpc("getProjectFile",e,r).then(o=>o&&new D({tera:this,...o}))}createProjectFile(e){return this.rpc("createProjectFile",e).then(r=>r&&new D({tera:this,...r}))}};export{Kt as default};
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
