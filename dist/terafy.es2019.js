var uo=Object.defineProperty;var co=(t,e,r)=>e in t?uo(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r;var u=(t,e,r)=>co(t,typeof e!="symbol"?e+"":e,r);function qt(t,e,r){if(!t||typeof t!="object"||!e||typeof e!="object")throw new Error("both arguments must be objects or arrays");r||(r=function(s){return s});function o({obj1:s,obj2:f,basePath:m,basePathForRemoves:g,diffs:v}){var O=Object.keys(s),P=O.length,y=Object.keys(f),_=y.length,b,p=s.length-f.length;if(go(s,f)){for(var d=0;d<P;d++){var l=Array.isArray(s)?Number(O[d]):O[d];l in f||(b=g.concat(l),v.remove.push({op:"remove",path:r(b)}))}for(var d=0;d<_;d++){var l=Array.isArray(f)?Number(y[d]):y[d];n({key:l,obj1:s,obj2:f,path:m.concat(l),pathForRemoves:m.concat(l),diffs:v})}}else{for(var d=0;d<p;d++)b=g.concat(d),v.remove.push({op:"remove",path:r(b)});for(var E=s.slice(p),d=0;d<_;d++)n({key:d,obj1:E,obj2:f,path:m.concat(d),pathForRemoves:m.concat(d+p),diffs:v})}}var a={remove:[],replace:[],add:[]};return o({obj1:t,obj2:e,basePath:[],basePathForRemoves:[],diffs:a}),a.remove.reverse().concat(a.replace).concat(a.add);function n({key:s,obj1:f,obj2:m,path:g,pathForRemoves:v,diffs:O}){var P=f[s],y=m[s];if(!(s in f)&&s in m){var _=y;O.add.push({op:"add",path:r(g),value:_})}else P!==y&&(Object(P)!==P||Object(y)!==y||ho(P,y)||!Object.keys(P).length&&!Object.keys(y).length&&String(P)!=String(y)?i(g,O,y):o({obj1:f[s],obj2:m[s],basePath:g,basePathForRemoves:v,diffs:O}))}function i(s,f,m){f.replace.push({op:"replace",path:r(s),value:m})}}function ho(t,e){return Object.prototype.toString.call(t)!=Object.prototype.toString.call(e)}function go(t,e){var r=t.length-e.length;if(Array.isArray(t)&&Array.isArray(e)&&r>0){for(var o=0,a=0,n=0;n<e.length&&String(t[n])===String(e[n]);n++)o++;for(var i=e.length;i>0&&String(t[i+r])===String(e[i]);i--)a++;return o>=a}return!0}var xo=typeof global=="object"&&global&&global.Object===Object&&global,dt=xo;var yo=typeof self=="object"&&self&&self.Object===Object&&self,bo=dt||yo||Function("return this")(),x=bo;var vo=x.Symbol,T=vo;var Yt=Object.prototype,wo=Yt.hasOwnProperty,To=Yt.toString,pt=T?T.toStringTag:void 0;function Po(t){var e=wo.call(t,pt),r=t[pt];try{t[pt]=void 0;var o=!0}catch{}var a=To.call(t);return o&&(e?t[pt]=r:delete t[pt]),a}var Zt=Po;var Ao=Object.prototype,Oo=Ao.toString;function jo(t){return Oo.call(t)}var Jt=jo;var So="[object Null]",Io="[object Undefined]",Xt=T?T.toStringTag:void 0;function _o(t){return t==null?t===void 0?Io:So:Xt&&Xt in Object(t)?Zt(t):Jt(t)}var I=_o;function Eo(t){return t!=null&&typeof t=="object"}var S=Eo;var Fo="[object Symbol]";function Co(t){return typeof t=="symbol"||S(t)&&I(t)==Fo}var K=Co;function No(t,e){for(var r=-1,o=t==null?0:t.length,a=Array(o);++r<o;)a[r]=e(t[r],r,t);return a}var Qt=No;var Ro=Array.isArray,w=Ro;var Mo=1/0,te=T?T.prototype:void 0,ee=te?te.toString:void 0;function re(t){if(typeof t=="string")return t;if(w(t))return Qt(t,re)+"";if(K(t))return ee?ee.call(t):"";var e=t+"";return e=="0"&&1/t==-Mo?"-0":e}var oe=re;function Lo(t){var e=typeof t;return t!=null&&(e=="object"||e=="function")}var j=Lo;function Bo(t){return t}var ae=Bo;var ko="[object AsyncFunction]",Uo="[object Function]",Do="[object GeneratorFunction]",zo="[object Proxy]";function Ko(t){if(!j(t))return!1;var e=I(t);return e==Uo||e==Do||e==ko||e==zo}var ct=Ko;var Go=x["__core-js_shared__"],ht=Go;var ie=function(){var t=/[^.]+$/.exec(ht&&ht.keys&&ht.keys.IE_PROTO||"");return t?"Symbol(src)_1."+t:""}();function Wo(t){return!!ie&&ie in t}var se=Wo;var $o=Function.prototype,Ho=$o.toString;function Vo(t){if(t!=null){try{return Ho.call(t)}catch{}try{return t+""}catch{}}return""}var F=Vo;var qo=/[\\^$.*+?()[\]{}|]/g,Yo=/^\[object .+?Constructor\]$/,Zo=Function.prototype,Jo=Object.prototype,Xo=Zo.toString,Qo=Jo.hasOwnProperty,ta=RegExp("^"+Xo.call(Qo).replace(qo,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");function ea(t){if(!j(t)||se(t))return!1;var e=ct(t)?ta:Yo;return e.test(F(t))}var ne=ea;function ra(t,e){return t==null?void 0:t[e]}var fe=ra;function oa(t,e){var r=fe(t,e);return ne(r)?r:void 0}var A=oa;var aa=A(x,"WeakMap"),gt=aa;var pe=Object.create,ia=function(){function t(){}return function(e){if(!j(e))return{};if(pe)return pe(e);t.prototype=e;var r=new t;return t.prototype=void 0,r}}(),le=ia;function sa(t,e,r){switch(r.length){case 0:return t.call(e);case 1:return t.call(e,r[0]);case 2:return t.call(e,r[0],r[1]);case 3:return t.call(e,r[0],r[1],r[2])}return t.apply(e,r)}var me=sa;function na(t,e){var r=-1,o=t.length;for(e||(e=Array(o));++r<o;)e[r]=t[r];return e}var ue=na;var fa=800,pa=16,la=Date.now;function ma(t){var e=0,r=0;return function(){var o=la(),a=pa-(o-r);if(r=o,a>0){if(++e>=fa)return arguments[0]}else e=0;return t.apply(void 0,arguments)}}var de=ma;function ua(t){return function(){return t}}var ce=ua;var da=function(){try{var t=A(Object,"defineProperty");return t({},"",{}),t}catch{}}(),G=da;var ca=G?function(t,e){return G(t,"toString",{configurable:!0,enumerable:!1,value:ce(e),writable:!0})}:ae,he=ca;var ha=de(he),ge=ha;function ga(t,e){for(var r=-1,o=t==null?0:t.length;++r<o&&e(t[r],r,t)!==!1;);return t}var xe=ga;var xa=9007199254740991,ya=/^(?:0|[1-9]\d*)$/;function ba(t,e){var r=typeof t;return e=e==null?xa:e,!!e&&(r=="number"||r!="symbol"&&ya.test(t))&&t>-1&&t%1==0&&t<e}var W=ba;function va(t,e,r){e=="__proto__"&&G?G(t,e,{configurable:!0,enumerable:!0,value:r,writable:!0}):t[e]=r}var xt=va;function wa(t,e){return t===e||t!==t&&e!==e}var yt=wa;var Ta=Object.prototype,Pa=Ta.hasOwnProperty;function Aa(t,e,r){var o=t[e];(!(Pa.call(t,e)&&yt(o,r))||r===void 0&&!(e in t))&&xt(t,e,r)}var $=Aa;function Oa(t,e,r,o){var a=!r;r||(r={});for(var n=-1,i=e.length;++n<i;){var s=e[n],f=o?o(r[s],t[s],s,r,t):void 0;f===void 0&&(f=t[s]),a?xt(r,s,f):$(r,s,f)}return r}var R=Oa;var ye=Math.max;function ja(t,e,r){return e=ye(e===void 0?t.length-1:e,0),function(){for(var o=arguments,a=-1,n=ye(o.length-e,0),i=Array(n);++a<n;)i[a]=o[e+a];a=-1;for(var s=Array(e+1);++a<e;)s[a]=o[a];return s[e]=r(i),me(t,this,s)}}var be=ja;var Sa=9007199254740991;function Ia(t){return typeof t=="number"&&t>-1&&t%1==0&&t<=Sa}var H=Ia;function _a(t){return t!=null&&H(t.length)&&!ct(t)}var bt=_a;var Ea=Object.prototype;function Fa(t){var e=t&&t.constructor,r=typeof e=="function"&&e.prototype||Ea;return t===r}var V=Fa;function Ca(t,e){for(var r=-1,o=Array(t);++r<t;)o[r]=e(r);return o}var ve=Ca;var Na="[object Arguments]";function Ra(t){return S(t)&&I(t)==Na}var Nt=Ra;var we=Object.prototype,Ma=we.hasOwnProperty,La=we.propertyIsEnumerable,Ba=Nt(function(){return arguments}())?Nt:function(t){return S(t)&&Ma.call(t,"callee")&&!La.call(t,"callee")},q=Ba;function ka(){return!1}var Te=ka;var Oe=typeof exports=="object"&&exports&&!exports.nodeType&&exports,Pe=Oe&&typeof module=="object"&&module&&!module.nodeType&&module,Ua=Pe&&Pe.exports===Oe,Ae=Ua?x.Buffer:void 0,Da=Ae?Ae.isBuffer:void 0,za=Da||Te,vt=za;var Ka="[object Arguments]",Ga="[object Array]",Wa="[object Boolean]",$a="[object Date]",Ha="[object Error]",Va="[object Function]",qa="[object Map]",Ya="[object Number]",Za="[object Object]",Ja="[object RegExp]",Xa="[object Set]",Qa="[object String]",ti="[object WeakMap]",ei="[object ArrayBuffer]",ri="[object DataView]",oi="[object Float32Array]",ai="[object Float64Array]",ii="[object Int8Array]",si="[object Int16Array]",ni="[object Int32Array]",fi="[object Uint8Array]",pi="[object Uint8ClampedArray]",li="[object Uint16Array]",mi="[object Uint32Array]",h={};h[oi]=h[ai]=h[ii]=h[si]=h[ni]=h[fi]=h[pi]=h[li]=h[mi]=!0;h[Ka]=h[Ga]=h[ei]=h[Wa]=h[ri]=h[$a]=h[Ha]=h[Va]=h[qa]=h[Ya]=h[Za]=h[Ja]=h[Xa]=h[Qa]=h[ti]=!1;function ui(t){return S(t)&&H(t.length)&&!!h[I(t)]}var je=ui;function di(t){return function(e){return t(e)}}var Y=di;var Se=typeof exports=="object"&&exports&&!exports.nodeType&&exports,lt=Se&&typeof module=="object"&&module&&!module.nodeType&&module,ci=lt&&lt.exports===Se,Rt=ci&&dt.process,hi=function(){try{var t=lt&&lt.require&&lt.require("util").types;return t||Rt&&Rt.binding&&Rt.binding("util")}catch{}}(),C=hi;var Ie=C&&C.isTypedArray,gi=Ie?Y(Ie):je,_e=gi;var xi=Object.prototype,yi=xi.hasOwnProperty;function bi(t,e){var r=w(t),o=!r&&q(t),a=!r&&!o&&vt(t),n=!r&&!o&&!a&&_e(t),i=r||o||a||n,s=i?ve(t.length,String):[],f=s.length;for(var m in t)(e||yi.call(t,m))&&!(i&&(m=="length"||a&&(m=="offset"||m=="parent")||n&&(m=="buffer"||m=="byteLength"||m=="byteOffset")||W(m,f)))&&s.push(m);return s}var wt=bi;function vi(t,e){return function(r){return t(e(r))}}var Tt=vi;var wi=Tt(Object.keys,Object),Ee=wi;var Ti=Object.prototype,Pi=Ti.hasOwnProperty;function Ai(t){if(!V(t))return Ee(t);var e=[];for(var r in Object(t))Pi.call(t,r)&&r!="constructor"&&e.push(r);return e}var Fe=Ai;function Oi(t){return bt(t)?wt(t):Fe(t)}var Z=Oi;function ji(t){var e=[];if(t!=null)for(var r in Object(t))e.push(r);return e}var Ce=ji;var Si=Object.prototype,Ii=Si.hasOwnProperty;function _i(t){if(!j(t))return Ce(t);var e=V(t),r=[];for(var o in t)o=="constructor"&&(e||!Ii.call(t,o))||r.push(o);return r}var Ne=_i;function Ei(t){return bt(t)?wt(t,!0):Ne(t)}var J=Ei;var Fi=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,Ci=/^\w*$/;function Ni(t,e){if(w(t))return!1;var r=typeof t;return r=="number"||r=="symbol"||r=="boolean"||t==null||K(t)?!0:Ci.test(t)||!Fi.test(t)||e!=null&&t in Object(e)}var Re=Ni;var Ri=A(Object,"create"),N=Ri;function Mi(){this.__data__=N?N(null):{},this.size=0}var Me=Mi;function Li(t){var e=this.has(t)&&delete this.__data__[t];return this.size-=e?1:0,e}var Le=Li;var Bi="__lodash_hash_undefined__",ki=Object.prototype,Ui=ki.hasOwnProperty;function Di(t){var e=this.__data__;if(N){var r=e[t];return r===Bi?void 0:r}return Ui.call(e,t)?e[t]:void 0}var Be=Di;var zi=Object.prototype,Ki=zi.hasOwnProperty;function Gi(t){var e=this.__data__;return N?e[t]!==void 0:Ki.call(e,t)}var ke=Gi;var Wi="__lodash_hash_undefined__";function $i(t,e){var r=this.__data__;return this.size+=this.has(t)?0:1,r[t]=N&&e===void 0?Wi:e,this}var Ue=$i;function X(t){var e=-1,r=t==null?0:t.length;for(this.clear();++e<r;){var o=t[e];this.set(o[0],o[1])}}X.prototype.clear=Me;X.prototype.delete=Le;X.prototype.get=Be;X.prototype.has=ke;X.prototype.set=Ue;var Mt=X;function Hi(){this.__data__=[],this.size=0}var De=Hi;function Vi(t,e){for(var r=t.length;r--;)if(yt(t[r][0],e))return r;return-1}var M=Vi;var qi=Array.prototype,Yi=qi.splice;function Zi(t){var e=this.__data__,r=M(e,t);if(r<0)return!1;var o=e.length-1;return r==o?e.pop():Yi.call(e,r,1),--this.size,!0}var ze=Zi;function Ji(t){var e=this.__data__,r=M(e,t);return r<0?void 0:e[r][1]}var Ke=Ji;function Xi(t){return M(this.__data__,t)>-1}var Ge=Xi;function Qi(t,e){var r=this.__data__,o=M(r,t);return o<0?(++this.size,r.push([t,e])):r[o][1]=e,this}var We=Qi;function Q(t){var e=-1,r=t==null?0:t.length;for(this.clear();++e<r;){var o=t[e];this.set(o[0],o[1])}}Q.prototype.clear=De;Q.prototype.delete=ze;Q.prototype.get=Ke;Q.prototype.has=Ge;Q.prototype.set=We;var L=Q;var ts=A(x,"Map"),B=ts;function es(){this.size=0,this.__data__={hash:new Mt,map:new(B||L),string:new Mt}}var $e=es;function rs(t){var e=typeof t;return e=="string"||e=="number"||e=="symbol"||e=="boolean"?t!=="__proto__":t===null}var He=rs;function os(t,e){var r=t.__data__;return He(e)?r[typeof e=="string"?"string":"hash"]:r.map}var k=os;function as(t){var e=k(this,t).delete(t);return this.size-=e?1:0,e}var Ve=as;function is(t){return k(this,t).get(t)}var qe=is;function ss(t){return k(this,t).has(t)}var Ye=ss;function ns(t,e){var r=k(this,t),o=r.size;return r.set(t,e),this.size+=r.size==o?0:1,this}var Ze=ns;function tt(t){var e=-1,r=t==null?0:t.length;for(this.clear();++e<r;){var o=t[e];this.set(o[0],o[1])}}tt.prototype.clear=$e;tt.prototype.delete=Ve;tt.prototype.get=qe;tt.prototype.has=Ye;tt.prototype.set=Ze;var mt=tt;var fs="Expected a function";function Lt(t,e){if(typeof t!="function"||e!=null&&typeof e!="function")throw new TypeError(fs);var r=function(){var o=arguments,a=e?e.apply(this,o):o[0],n=r.cache;if(n.has(a))return n.get(a);var i=t.apply(this,o);return r.cache=n.set(a,i)||n,i};return r.cache=new(Lt.Cache||mt),r}Lt.Cache=mt;var Je=Lt;var ps=500;function ls(t){var e=Je(t,function(o){return r.size===ps&&r.clear(),o}),r=e.cache;return e}var Xe=ls;var ms=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,us=/\\(\\)?/g,ds=Xe(function(t){var e=[];return t.charCodeAt(0)===46&&e.push(""),t.replace(ms,function(r,o,a,n){e.push(a?n.replace(us,"$1"):o||r)}),e}),Qe=ds;function cs(t){return t==null?"":oe(t)}var tr=cs;function hs(t,e){return w(t)?t:Re(t,e)?[t]:Qe(tr(t))}var U=hs;var gs=1/0;function xs(t){if(typeof t=="string"||K(t))return t;var e=t+"";return e=="0"&&1/t==-gs?"-0":e}var et=xs;function ys(t,e){e=U(e,t);for(var r=0,o=e.length;t!=null&&r<o;)t=t[et(e[r++])];return r&&r==o?t:void 0}var er=ys;function bs(t,e){for(var r=-1,o=e.length,a=t.length;++r<o;)t[a+r]=e[r];return t}var rt=bs;var rr=T?T.isConcatSpreadable:void 0;function vs(t){return w(t)||q(t)||!!(rr&&t&&t[rr])}var or=vs;function ar(t,e,r,o,a){var n=-1,i=t.length;for(r||(r=or),a||(a=[]);++n<i;){var s=t[n];e>0&&r(s)?e>1?ar(s,e-1,r,o,a):rt(a,s):o||(a[a.length]=s)}return a}var ir=ar;function ws(t){var e=t==null?0:t.length;return e?ir(t,1):[]}var sr=ws;function Ts(t){return ge(be(t,void 0,sr),t+"")}var nr=Ts;var Ps=Tt(Object.getPrototypeOf,Object),Pt=Ps;function As(){this.__data__=new L,this.size=0}var fr=As;function Os(t){var e=this.__data__,r=e.delete(t);return this.size=e.size,r}var pr=Os;function js(t){return this.__data__.get(t)}var lr=js;function Ss(t){return this.__data__.has(t)}var mr=Ss;var Is=200;function _s(t,e){var r=this.__data__;if(r instanceof L){var o=r.__data__;if(!B||o.length<Is-1)return o.push([t,e]),this.size=++r.size,this;r=this.__data__=new mt(o)}return r.set(t,e),this.size=r.size,this}var ur=_s;function ot(t){var e=this.__data__=new L(t);this.size=e.size}ot.prototype.clear=fr;ot.prototype.delete=pr;ot.prototype.get=lr;ot.prototype.has=mr;ot.prototype.set=ur;var dr=ot;function Es(t,e){return t&&R(e,Z(e),t)}var cr=Es;function Fs(t,e){return t&&R(e,J(e),t)}var hr=Fs;var br=typeof exports=="object"&&exports&&!exports.nodeType&&exports,gr=br&&typeof module=="object"&&module&&!module.nodeType&&module,Cs=gr&&gr.exports===br,xr=Cs?x.Buffer:void 0,yr=xr?xr.allocUnsafe:void 0;function Ns(t,e){if(e)return t.slice();var r=t.length,o=yr?yr(r):new t.constructor(r);return t.copy(o),o}var vr=Ns;function Rs(t,e){for(var r=-1,o=t==null?0:t.length,a=0,n=[];++r<o;){var i=t[r];e(i,r,t)&&(n[a++]=i)}return n}var wr=Rs;function Ms(){return[]}var At=Ms;var Ls=Object.prototype,Bs=Ls.propertyIsEnumerable,Tr=Object.getOwnPropertySymbols,ks=Tr?function(t){return t==null?[]:(t=Object(t),wr(Tr(t),function(e){return Bs.call(t,e)}))}:At,at=ks;function Us(t,e){return R(t,at(t),e)}var Pr=Us;var Ds=Object.getOwnPropertySymbols,zs=Ds?function(t){for(var e=[];t;)rt(e,at(t)),t=Pt(t);return e}:At,Ot=zs;function Ks(t,e){return R(t,Ot(t),e)}var Ar=Ks;function Gs(t,e,r){var o=e(t);return w(t)?o:rt(o,r(t))}var jt=Gs;function Ws(t){return jt(t,Z,at)}var Or=Ws;function $s(t){return jt(t,J,Ot)}var jr=$s;var Hs=A(x,"DataView"),St=Hs;var Vs=A(x,"Promise"),It=Vs;var qs=A(x,"Set"),_t=qs;var Sr="[object Map]",Ys="[object Object]",Ir="[object Promise]",_r="[object Set]",Er="[object WeakMap]",Fr="[object DataView]",Zs=F(St),Js=F(B),Xs=F(It),Qs=F(_t),tn=F(gt),z=I;(St&&z(new St(new ArrayBuffer(1)))!=Fr||B&&z(new B)!=Sr||It&&z(It.resolve())!=Ir||_t&&z(new _t)!=_r||gt&&z(new gt)!=Er)&&(z=function(t){var e=I(t),r=e==Ys?t.constructor:void 0,o=r?F(r):"";if(o)switch(o){case Zs:return Fr;case Js:return Sr;case Xs:return Ir;case Qs:return _r;case tn:return Er}return e});var it=z;var en=Object.prototype,rn=en.hasOwnProperty;function on(t){var e=t.length,r=new t.constructor(e);return e&&typeof t[0]=="string"&&rn.call(t,"index")&&(r.index=t.index,r.input=t.input),r}var Cr=on;var an=x.Uint8Array,Bt=an;function sn(t){var e=new t.constructor(t.byteLength);return new Bt(e).set(new Bt(t)),e}var st=sn;function nn(t,e){var r=e?st(t.buffer):t.buffer;return new t.constructor(r,t.byteOffset,t.byteLength)}var Nr=nn;var fn=/\w*$/;function pn(t){var e=new t.constructor(t.source,fn.exec(t));return e.lastIndex=t.lastIndex,e}var Rr=pn;var Mr=T?T.prototype:void 0,Lr=Mr?Mr.valueOf:void 0;function ln(t){return Lr?Object(Lr.call(t)):{}}var Br=ln;function mn(t,e){var r=e?st(t.buffer):t.buffer;return new t.constructor(r,t.byteOffset,t.length)}var kr=mn;var un="[object Boolean]",dn="[object Date]",cn="[object Map]",hn="[object Number]",gn="[object RegExp]",xn="[object Set]",yn="[object String]",bn="[object Symbol]",vn="[object ArrayBuffer]",wn="[object DataView]",Tn="[object Float32Array]",Pn="[object Float64Array]",An="[object Int8Array]",On="[object Int16Array]",jn="[object Int32Array]",Sn="[object Uint8Array]",In="[object Uint8ClampedArray]",_n="[object Uint16Array]",En="[object Uint32Array]";function Fn(t,e,r){var o=t.constructor;switch(e){case vn:return st(t);case un:case dn:return new o(+t);case wn:return Nr(t,r);case Tn:case Pn:case An:case On:case jn:case Sn:case In:case _n:case En:return kr(t,r);case cn:return new o;case hn:case yn:return new o(t);case gn:return Rr(t);case xn:return new o;case bn:return Br(t)}}var Ur=Fn;function Cn(t){return typeof t.constructor=="function"&&!V(t)?le(Pt(t)):{}}var Dr=Cn;var Nn="[object Map]";function Rn(t){return S(t)&&it(t)==Nn}var zr=Rn;var Kr=C&&C.isMap,Mn=Kr?Y(Kr):zr,Gr=Mn;var Ln="[object Set]";function Bn(t){return S(t)&&it(t)==Ln}var Wr=Bn;var $r=C&&C.isSet,kn=$r?Y($r):Wr,Hr=kn;var Un=1,Dn=2,zn=4,Vr="[object Arguments]",Kn="[object Array]",Gn="[object Boolean]",Wn="[object Date]",$n="[object Error]",qr="[object Function]",Hn="[object GeneratorFunction]",Vn="[object Map]",qn="[object Number]",Yr="[object Object]",Yn="[object RegExp]",Zn="[object Set]",Jn="[object String]",Xn="[object Symbol]",Qn="[object WeakMap]",tf="[object ArrayBuffer]",ef="[object DataView]",rf="[object Float32Array]",of="[object Float64Array]",af="[object Int8Array]",sf="[object Int16Array]",nf="[object Int32Array]",ff="[object Uint8Array]",pf="[object Uint8ClampedArray]",lf="[object Uint16Array]",mf="[object Uint32Array]",c={};c[Vr]=c[Kn]=c[tf]=c[ef]=c[Gn]=c[Wn]=c[rf]=c[of]=c[af]=c[sf]=c[nf]=c[Vn]=c[qn]=c[Yr]=c[Yn]=c[Zn]=c[Jn]=c[Xn]=c[ff]=c[pf]=c[lf]=c[mf]=!0;c[$n]=c[qr]=c[Qn]=!1;function Et(t,e,r,o,a,n){var i,s=e&Un,f=e&Dn,m=e&zn;if(r&&(i=a?r(t,o,a,n):r(t)),i!==void 0)return i;if(!j(t))return t;var g=w(t);if(g){if(i=Cr(t),!s)return ue(t,i)}else{var v=it(t),O=v==qr||v==Hn;if(vt(t))return vr(t,s);if(v==Yr||v==Vr||O&&!a){if(i=f||O?{}:Dr(t),!s)return f?Ar(t,hr(i,t)):Pr(t,cr(i,t))}else{if(!c[v])return a?t:{};i=Ur(t,v,s)}}n||(n=new dr);var P=n.get(t);if(P)return P;n.set(t,i),Hr(t)?t.forEach(function(b){i.add(Et(b,e,r,b,t,n))}):Gr(t)&&t.forEach(function(b,p){i.set(p,Et(b,e,r,p,t,n))});var y=m?f?jr:Or:f?J:Z,_=g?void 0:y(t);return xe(_||t,function(b,p){_&&(p=b,b=t[p]),$(i,p,Et(b,e,r,p,t,n))}),i}var Zr=Et;var uf=1,df=4;function cf(t){return Zr(t,uf|df)}var kt=cf;function hf(t,e){return t!=null&&e in Object(t)}var Jr=hf;function gf(t,e,r){e=U(e,t);for(var o=-1,a=e.length,n=!1;++o<a;){var i=et(e[o]);if(!(n=t!=null&&r(t,i)))break;t=t[i]}return n||++o!=a?n:(a=t==null?0:t.length,!!a&&H(a)&&W(i,a)&&(w(t)||q(t)))}var Xr=gf;function xf(t,e){return t!=null&&Xr(t,e,Jr)}var Qr=xf;function yf(t,e,r,o){if(!j(t))return t;e=U(e,t);for(var a=-1,n=e.length,i=n-1,s=t;s!=null&&++a<n;){var f=et(e[a]),m=r;if(f==="__proto__"||f==="constructor"||f==="prototype")return t;if(a!=i){var g=s[f];m=o?o(g,f,s):void 0,m===void 0&&(m=j(g)?g:W(e[a+1])?[]:{})}$(s,f,m),s=s[f]}return t}var to=yf;function bf(t,e,r){for(var o=-1,a=e.length,n={};++o<a;){var i=e[o],s=er(t,i);r(s,i)&&to(n,U(i,t),s)}return n}var eo=bf;function vf(t,e){return eo(t,e,function(r,o){return Qr(t,o)})}var ro=vf;var wf=nr(function(t,e){return t==null?{}:ro(t,e)}),Ft=wf;function oo(t){return{all:t=t||new Map,on:function(e,r){var o=t.get(e);o?o.push(r):t.set(e,[r])},off:function(e,r){var o=t.get(e);o&&(r?o.splice(o.indexOf(r)>>>0,1):t.set(e,[]))},emit:function(e,r){var o=t.get(e);o&&o.slice().map(function(a){a(r)}),(o=t.get("*"))&&o.slice().map(function(a){a(e,r)})}}}var ao="useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";var Ut=(t=21)=>{let e="",r=crypto.getRandomValues(new Uint8Array(t|=0));for(;t--;)e+=ao[r[t]&63];return e};var Tf="array",Pf="bit",io="bits",Af="byte",so="bytes",nt="",Of="exponent",jf="function",no="iec",Sf="Invalid number",If="Invalid rounding method",Dt="jedec",_f="object",fo=".",Ef="round",Ff="s",Cf="si",Nf="kbit",Rf="kB",Mf=" ",Lf="string",Bf="0",zt={symbol:{iec:{bits:["bit","Kibit","Mibit","Gibit","Tibit","Pibit","Eibit","Zibit","Yibit"],bytes:["B","KiB","MiB","GiB","TiB","PiB","EiB","ZiB","YiB"]},jedec:{bits:["bit","Kbit","Mbit","Gbit","Tbit","Pbit","Ebit","Zbit","Ybit"],bytes:["B","KB","MB","GB","TB","PB","EB","ZB","YB"]}},fullform:{iec:["","kibi","mebi","gibi","tebi","pebi","exbi","zebi","yobi"],jedec:["","kilo","mega","giga","tera","peta","exa","zetta","yotta"]}};function po(t,{bits:e=!1,pad:r=!1,base:o=-1,round:a=2,locale:n=nt,localeOptions:i={},separator:s=nt,spacer:f=Mf,symbols:m={},standard:g=nt,output:v=Lf,fullform:O=!1,fullforms:P=[],exponent:y=-1,roundingMethod:_=Ef,precision:b=0}={}){let p=y,d=Number(t),l=[],E=0,Ct=nt;g===Cf?(o=10,g=Dt):g===no||g===Dt?o=2:o===2?g=no:(o=10,g=Dt);let ut=o===10?1e3:1024,lo=O===!0,Gt=d<0,Wt=Math[_];if(typeof t!="bigint"&&isNaN(t))throw new TypeError(Sf);if(typeof Wt!==jf)throw new TypeError(If);if(Gt&&(d=-d),(p===-1||isNaN(p))&&(p=Math.floor(Math.log(d)/Math.log(ut)),p<0&&(p=0)),p>8&&(b>0&&(b+=8-p),p=8),v===Of)return p;if(d===0)l[0]=0,Ct=l[1]=zt.symbol[g][e?io:so][p];else{E=d/(o===2?Math.pow(2,p*10):Math.pow(1e3,p)),e&&(E=E*8,E>=ut&&p<8&&(E=E/ut,p++));let ft=Math.pow(10,p>0?a:0);l[0]=Wt(E*ft)/ft,l[0]===ut&&p<8&&y===-1&&(l[0]=1,p++),Ct=l[1]=o===10&&p===1?e?Nf:Rf:zt.symbol[g][e?io:so][p]}if(Gt&&(l[0]=-l[0]),b>0&&(l[0]=l[0].toPrecision(b)),l[1]=m[l[1]]||l[1],n===!0?l[0]=l[0].toLocaleString():n.length>0?l[0]=l[0].toLocaleString(n,i):s.length>0&&(l[0]=l[0].toString().replace(fo,s)),r&&Number.isInteger(l[0])===!1&&a>0){let ft=s||fo,$t=l[0].toString().split(ft),Ht=$t[1]||nt,Vt=Ht.length,mo=a-Vt;l[0]=`${$t[0]}${ft}${Ht.padEnd(Vt+mo,Bf)}`}return lo&&(l[1]=P[p]?P[p]:zt.fullform[g][p]+(e?Pf:Af)+(l[0]===1?nt:Ff)),v===Tf?l:v===_f?{value:l[0],symbol:l[1],exponent:p,unit:Ct}:l.join(f)}var D=class t{constructor(e){u(this,"_tera");u(this,"id");u(this,"name");u(this,"icon");u(this,"path");u(this,"url");u(this,"teraUrl");u(this,"parsedName");u(this,"created");u(this,"createdFormatted");u(this,"modified");u(this,"modifiedFormatted");u(this,"accessed");u(this,"accessedFormatted");u(this,"size");u(this,"sizeFormatted");u(this,"mime");u(this,"meta",{});if(!e.tera)throw new Error("Basic file requires a `tera` key to access the Tera instance");Object.assign(this,e);let r=this.tera;Object.defineProperty(this,"_tera",{enumerable:!1,configurable:!1,get(){return r}}),delete this.tera,this.teraUrl=this.url.replace(/^https?:\/\/(?:.+?)\/projects\/(?:.+?)\/project\/(.+)$/,"/project/$1"),this.sizeFormatted=po(this.size||0,{spacer:""}),this.createdFormatted=this.created?this.created.toLocaleDateString():"Unknown created date",this.modifiedFormatted=this.modified?this.modified.toLocaleDateString():"Unknown modified date",this.accessedFormatted=this.accessed?this.accessed.toLocaleDateString():"Unknown access date"}getContents(e){return this._tera.getProjectFileContents(this.id,e)}setContents(e){return this._tera.setProjectFileContents(this.id,e,{})}getRefs(){return this._tera.getProjectLibrary(this.id)}setRefs(e){return this._tera.setProjectLibrary(this.id,e)}serialize(){return Ft(this,["id","name","icon","path","url","parsedName","created","modified","accessed","size","mime","meta"])}static deserialize(e){return new t(Ft(e,["tera","id","name","icon","path","url","parsedName","created","modified","accessed","size","mime","meta"]))}};var Kt=class{constructor(e){u(this,"settings",{session:null,devMode:!1,verbosity:1,mode:"detect",modeTimeout:300,modeFallback:"child",modeOverrides:{child(e){e.siteUrl=="https://tera-tools.com/embed"&&(e.siteUrl="https://dev.tera-tools.com/embed")}},siteUrl:"https://tera-tools.com/embed",restrictOrigin:"*",frameSandbox:["allow-forms","allow-modals","allow-orientation-lock","allow-pointer-lock","allow-popups","allow-popups-to-escape-sandbox","allow-presentation","allow-same-origin","allow-scripts","allow-top-navigation"],handshakeInterval:1e3,handshakeTimeout:1e4,debugPaths:null});u(this,"events",oo());u(this,"dom",{el:null,iframe:null,popup:null,stylesheet:null});u(this,"methods",["handshake","setServerVerbosity","getUser","requireUser","getCredentials","bindProject","getProject","getProjects","setActiveProject","requireProject","selectProject","getNamespace","setNamespace","listNamespaces","getProjectState","setProjectState","setProjectStateDefaults","setProjectStateRefresh","saveProjectState","replaceProjectState","getProjectFileContents","deleteProjectFile","setProjectFileContents","selectProjectLibrary","getProjectLibrary","setProjectLibrary","projectLog","setPage","uiAlert","uiConfirm","uiPanic","uiProgress","uiPrompt","uiThrow","uiSplat","uiWindow"]);u(this,"plugins",[]);u(this,"namespaces",{});u(this,"acceptPostboxes",{});e&&this.set(e)}send(e){let r=Ut();return this.acceptPostboxes[r]={},this.acceptPostboxes[r].promise=new Promise((o,a)=>{Object.assign(this.acceptPostboxes[r],{resolve:o,reject:a}),this.sendRaw({id:r,...e})}),this.acceptPostboxes[r].promise}sendRaw(e){let r;try{if(r={TERA:1,id:e.id||Ut(),...kt(e)},this.settings.mode=="parent")window.parent.postMessage(r,this.settings.restrictOrigin);else if(this.settings.mode=="child")this.dom.iframe.contentWindow.postMessage(r,this.settings.restrictOrigin);else if(this.settings.mode=="popup")this.dom.popup.postMessage(r,this.settings.restrictOrigin);else throw this.settings.mode=="detect"?new Error("Call init() or detectMode() before trying to send data to determine the mode"):new Error(`Unknown TERA communication mode "${this.settings.mode}"`)}catch(o){throw this.debug("ERROR",1,"Message compose client->server:",o),this.debug("ERROR",1,"Attempted to dispatch payload client->server",r),o}}rpc(e,...r){return this.send({action:"rpc",method:e,args:r})}acceptMessage(e){if(e.origin==window.location.origin)return Promise.resolve();let r=e.data;return!r.TERA||!r.id?Promise.resolve():(this.debug("INFO",3,"Recieved message",r),(r==null?void 0:r.action)=="response"&&this.acceptPostboxes[r.id]?(r.isError===!0?this.acceptPostboxes[r.id].reject(r.response):this.acceptPostboxes[r.id].resolve(r.response),Promise.resolve()):(r==null?void 0:r.action)=="rpc"?Promise.resolve().then(()=>this[r.method].apply(this,r.args)).then(o=>this.sendRaw({id:r.id,action:"response",response:o})).catch(o=>{console.warn(`TERA-FY client threw on RPC:${r.method}:`,o),this.sendRaw({id:r.id,action:"response",isError:!0,response:o&&o.toString()})}):(r==null?void 0:r.action)=="event"?Promise.resolve().then(()=>this.events.emit(r.event,...r.payload)).catch(o=>{throw console.warn(`TERA-FY client threw while handling emitted event "${r.event}"`,{message:r}),o}):r!=null&&r.id?(this.debug("INFO",3,`Ignoring message ID ${r.id} - was meant for someone else?`),Promise.resolve()):(this.debug("INFO",3,"Unexpected incoming TERA-FY CLIENT message",{message:r}),Promise.resolve()))}mountNamespace(e){if(!/^[\w-]+$/.test(e))throw new Error("Namespaces must be alphanumeric + hyphens + underscores");return this.namespaces[e]?Promise.resolve(this.namespaces[e]):Promise.resolve().then(()=>this._mountNamespace(e)).then(()=>this.namespaces[e]||Promise.reject(`teraFy.mountNamespace('${e}') resolved but no namespace has been mounted`))}_mountNamespace(e){throw console.warn("teraFy._mountNamespace() has not been overriden by a TERA-fy plugin, load one to add this functionality for your preferred framework"),new Error("teraFy._mountNamespace() is not supported")}unmountNamespace(e){return this.namespaces[e]?this._unmountNamespace(e):Promise.resolve()}_unmountNamespace(e){console.warn("teraFy.unbindNamespace() has not been overriden by a TERA-fy plugin, load one to add this functionality for your preferred framework")}createProjectStatePatch(e,r){let o=qt(r,e);return o.length==0?(this.debug("INFO",4,"Skipping empty project patch",{patch:o,newState:e,oldState:r}),Promise.resolve()):(this.debug("INFO",3,"Created project patch",{patch:o,newState:e,oldState:r}),this.applyProjectStatePatch(o))}applyProjectStatePatch(e){if(this.settings.devMode&&this.settings.debugPaths){if(!Array.isArray(this.settings.debugPaths))throw new Error("teraFyClient.settings.debugPaths should be either null or an Array<String>");let r=e.filter(o=>this.settings.debugPaths.some(a=>o.path.join(".").slice(0,a.length)==a)).map(o=>o.path.join("."));if(r.length>0){console.info("Detected writes to",r,"- entering debugging mode");debugger}}return this.rpc("applyProjectStatePatch",e,{session:this.settings.session})}applyProjectStatePatchLocal(e){throw new Error("applyProjectStatePatchLocal() has not been sub-classed by a plugin")}init(e){if(e&&this.set(e),this.init.promise)return this.init.promise;window.addEventListener("message",this.acceptMessage.bind(this));let r=this;return this.init.promise=Promise.resolve().then(()=>{var o;return(o=this.settings).session||(o.session="tfy-"+this.getEntropicString(16))}).then(()=>this.debug("INFO",4,"[0/6] Init","Session",this.settings.session,"against",this.settings.siteUrl)).then(()=>{this.settings.devMode&&(this.settings.debugPaths=this.settings.debugPaths?Array.isArray(this.settings.debugPaths)?this.settings.debugPaths.map(o=>Array.isArray(o)?o.join("."):typeof o=="string"?o:(()=>{throw new Error("Unknown path type - should be an array or string in dotted notation")})()):(()=>{throw new Error("Unknown terafyClient.settings.debugPaths type")})():null,this.debug("INFO",0,"Watching state paths",this.settings.debugPaths))}).then(()=>this.detectMode()).then(o=>{if(this.debug("INFO",4,"[1/6] Setting client mode to",o),this.settings.mode=o,this.settings.modeOverrides[o])return this.debug("INFO",4,"[1/6] Applying specific config overrides for mode",o),this.settings.modeOverrides[o](this.settings)}).then(()=>this.debug("INFO",4,"[2/6] Injecting comms + styles + methods")).then(()=>Promise.all([this.injectComms(),this.injectStylesheet(),this.injectMethods()])).then(()=>{if(this.settings.verbosity<=1){this.debug("INFO",4,"[3/6] Skip - Server verbosity is already at 1");return}else return this.debug("INFO",4,`[3/6] Set server verbosity to ${this.settings.verbosity}`),this.rpc("setServerVerbosity",this.settings.verbosity)}).then(()=>this.debug("INFO",4,`[4/6] Set server mode to "${this.settings.mode}"`)).then(()=>this.rpc("setServerMode",this.settings.mode=="child"?"embedded":this.settings.mode=="parent"?"frame":this.settings.mode=="popup"?"popup":(()=>{throw`Unknown server mode "${this.settings.mode}"`})())).then(()=>this.debug("INFO",4,"[5/6] Run client plugins")).then(()=>Promise.all(this.plugins.map(o=>o.init.call(r,this.settings)))).then(()=>this.debug("INFO",4,"[6/6] Init complete")).catch(o=>this.debug("WARN",0,"Init process fault",o))}detectMode(){return this.settings.mode!="detect"?Promise.resolve(this.settings.mode):window.self===window.parent?Promise.resolve(this.settings.modeFallback):Promise.resolve().then(()=>this.settings.mode="parent").then(()=>new Promise((e,r)=>{let o=setTimeout(()=>r(),this.settings.modeTimeout);this.rpc("handshake").then(()=>clearTimeout(o)).then(()=>e())})).then(()=>"parent").catch(()=>this.settings.modeFallback)}injectComms(){switch(this.settings.mode){case"child":return Promise.resolve().then(()=>new Promise(e=>{this.debug("INFO",2,"Injecting TERA site as iFrame child"),this.dom.el=document.createElement("div"),this.dom.el.id="tera-fy",this.dom.el.classList.toggle("dev-mode",this.settings.devMode),this.dom.el.classList.add("minimized"),document.body.append(this.dom.el),this.dom.el.addEventListener("click",()=>this.dom.el.classList.toggle("minimized")),this.dom.iframe=document.createElement("iframe"),this.dom.iframe.setAttribute("sandbox",this.settings.frameSandbox.join(" ")),this.dom.iframe.addEventListener("load",()=>{this.debug("INFO",3,"Embeded iframe ready"),e()}),this.dom.iframe.src=this.settings.siteUrl,this.dom.el.append(this.dom.iframe)})).then(()=>this.handshakeLoop());case"parent":return this.debug("INFO",2,"Using TERA window parent"),Promise.resolve();case"popup":return this.debug("INFO",2,"Injecting TERA site as a popup window"),this.dom.popup=window.open(this.settings.siteUrl,"_blank","popup=1, location=0, menubar=0, status=0, scrollbars=0, width=500, height=600"),this.handshakeLoop().then(()=>this.debug("INFO",3,"Popup window accepted handshake"));default:throw new Error(`Unsupported mode "${this.settings.mode}" when calling injectComms()`)}}handshakeLoop(e){let r={handshakeInterval:this.settings.handshakeInterval,handshakeTimeout:this.settings.handshakeTimeout,...e};return new Promise((o,a)=>{let n=0,i,s=setTimeout(()=>{clearTimeout(i),a("TIMEOUT")},r.handshakeTimeout),f=()=>{this.debug("INFO",4,"Trying handshake",++n),clearTimeout(i),i=setTimeout(f,r.handshakeInterval),this.rpc("handshake").then(()=>{clearTimeout(s),clearTimeout(i)}).then(()=>o()).catch(a)};f()})}injectStylesheet(){switch(this.settings.mode){case"child":this.dom.stylesheet=document.createElement("style"),this.dom.stylesheet.innerHTML=[":root {","--TERA-accent: #4d659c;","}","#tera-fy {","display: none;","position: fixed;","right: 50px;","bottom: 50px;","width: 300px;","height: 150px;","background: transparent;","body:not(.tera-fy-focus) &.minimized.dev-mode {","background: var(--TERA-accent) !important;","opacity: 0.5;","right: 0px;","bottom: 0px;","width: 30px;","height: 30px;","transition: opacity 0.2s ease-out;","cursor: pointer;","border: none;","border-top-left-radius: 30px;","border-top: 2px solid var(--TERA-accent);","border-left: 2px solid var(--TERA-accent);","display: flex;","justify-content: center;","align-items: center;","&::before {","margin: 2px 0 0 0;",'content: "\u{1F300}";',"color: #FFF;","}","&:hover {","opacity: 1;","}","& > iframe {","display: none;","}","}","body:not(.tera-fy-focus) &:not(.minimized) {","&::before {","display: flex;","align-items: center;","justify-content: center;","cursor: pointer;","background: var(--TERA-accent) !important;","opacity: 0.5;","transition: opacity 0.2s ease-out;","position: absolute;","right: 0px;","bottom: 0px;","width: 20px;","height: 20px;","margin: 2px 0 0 0;",'content: "\u2B68";',"color: #FFF;","border: none;","border-top-left-radius: 30px;","border-top: 2px solid var(--TERA-accent);","border-left: 2px solid var(--TERA-accent);","}","&:hover::before {","opacity: 1;","}","}","&.dev-mode {","display: flex;","border: 5px solid var(--TERA-accent);","background: #FFF;","}","& > iframe {","width: 100%;","height: 100%;","}","}","body.tera-fy-focus {","overflow: hidden;","& #tera-fy {","display: flex !important;","position: fixed !important;","top: 0px !important;","width: 100vw !important;","height: 100vh !important;","left: 0px !important;","z-index: 10000 !important;","}","}"].join(`
`),document.head.appendChild(this.dom.stylesheet);break;case"parent":case"popup":break;default:throw new Error(`Unsupported mode "${this.settings.mode}" when injectStylesheet()`)}return Promise.resolve()}injectMethods(){this.methods.forEach(e=>this[e]=this.rpc.bind(this,e))}debug(...e){if(!this.settings.devMode||this.settings.verbosity<1)return;let r="log",o=1;typeof e[0]=="string"&&["INFO","LOG","WARN","ERROR"].includes(e[0])&&(r=e.shift().toLowerCase()),typeof e[0]=="number"&&(o=e[0],e.shift()),!(this.settings.verbosity<o)&&console[r]("%c[TERA-FY CLIENT]","font-weight: bold; color: #ff5722;",...e)}set(e,r,o){let a={ignoreNullish:!0,...o};return typeof e=="string"?(!a.ignoreNullish||r!=null)&&(this.settings[e]=r):Object.assign(this.settings,e),this.toggleDevMode(this.settings.devMode)}setIfDev(e,r,o){return!this.settings.devMode||r===void 0?this:this.set(e,r,o)}use(e,r){let o=typeof e=="function"?new e(this,r):typeof e=="object"?e:typeof e=="string"?(()=>{throw new Error("use(String) is not yet supported")})():(()=>{throw new Error("Expected use() call to be provided with a class initalizer")})();return this.mixin(this,o),this.plugins.push(o),this}mixin(e,r){let o=[],a=r;do o.unshift(a);while(a=Object.getPrototypeOf(a));o.forEach(n=>Object.getOwnPropertyNames(n).filter(i=>!["constructor","init","prototype","name"].includes(i)&&!i.startsWith("__")).forEach(i=>{typeof r[i]=="function"?Object.defineProperty(e,i,{enumerable:!1,value:r[i].bind(e)}):e[i]=r[i]}))}toggleDevMode(e="toggle"){var r;return e==="toggle"?this.settings.devMode=!this.settings.devMode:e==="proxy"?Object.assign(this.settings,{devMode:!0,siteUrl:"http://localhost:7334/embed",mode:"child"}):this.settings.devMode=!!e,this.settings.devMode&&(this.settings.restrictOrigin="*"),(r=this.dom)!=null&&r.el&&this.dom.el.classList.toggle("dev-mode",this.settings.devMode),this}toggleFocus(e="toggle"){this.debug("INFO",2,"Request focus",{isFocused:e}),globalThis.document.body.classList.toggle("tera-fy-focus",e==="toggle"?void 0:e)}getEntropicString(e=32){let r=new Uint32Array(4);return window.crypto.getRandomValues(r),btoa(String.fromCharCode(...new Uint8Array(r.buffer))).replace(/[+/]/g,"").slice(0,e)}selectProjectFile(e){return this.rpc("selectProjectFile",e).then(r=>r&&new D({tera:this,...r}))}getProjectFiles(e){return this.rpc("getProjectFiles",e).then(r=>r.map(o=>new D({tera:this,...o})))}getProjectFile(e,r){return this.rpc("getProjectFile",e,r).then(o=>o&&new D({tera:this,...o}))}createProjectFile(e){return this.rpc("createProjectFile",e).then(r=>r&&new D({tera:this,...r}))}};export{Kt as default};
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
