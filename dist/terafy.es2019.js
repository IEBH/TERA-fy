var Er=Object.defineProperty;var Cr=(t,e,r)=>e in t?Er(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r;var h=(t,e,r)=>(Cr(t,typeof e!="symbol"?e+"":e,r),r);function Ut(t,e,r){if(!t||typeof t!="object"||!e||typeof e!="object")throw new Error("both arguments must be objects or arrays");r||(r=function(s){return s});function o({obj1:s,obj2:l,basePath:c,basePathForRemoves:x,diffs:v}){var T=Object.keys(s),w=T.length,b=Object.keys(l),P=b.length,y,i=s.length-l.length;if(Rr(s,l)){for(var m=0;m<w;m++){var f=Array.isArray(s)?Number(T[m]):T[m];f in l||(y=x.concat(f),v.remove.push({op:"remove",path:r(y)}))}for(var m=0;m<P;m++){var f=Array.isArray(l)?Number(b[m]):b[m];p({key:f,obj1:s,obj2:l,path:c.concat(f),pathForRemoves:c.concat(f),diffs:v})}}else{for(var m=0;m<i;m++)y=x.concat(m),v.remove.push({op:"remove",path:r(y)});for(var S=s.slice(i),m=0;m<P;m++)p({key:m,obj1:S,obj2:l,path:c.concat(m),pathForRemoves:c.concat(m+i),diffs:v})}}var a={remove:[],replace:[],add:[]};return o({obj1:t,obj2:e,basePath:[],basePathForRemoves:[],diffs:a}),a.remove.reverse().concat(a.replace).concat(a.add);function p({key:s,obj1:l,obj2:c,path:x,pathForRemoves:v,diffs:T}){var w=l[s],b=c[s];if(!(s in l)&&s in c){var P=b;T.add.push({op:"add",path:r(x),value:P})}else w!==b&&(Object(w)!==w||Object(b)!==b||Mr(w,b)||!Object.keys(w).length&&!Object.keys(b).length&&String(w)!=String(b)?n(x,T,b):o({obj1:l[s],obj2:c[s],basePath:x,basePathForRemoves:v,diffs:T}))}function n(s,l,c){l.replace.push({op:"replace",path:r(s),value:c})}}function Gt(t){return[""].concat(t).join("/")}function Mr(t,e){return Object.prototype.toString.call(t)!=Object.prototype.toString.call(e)}function Rr(t,e){var r=t.length-e.length;if(Array.isArray(t)&&Array.isArray(e)&&r>0){for(var o=0,a=0,p=0;p<e.length&&String(t[p])===String(e[p]);p++)o++;for(var n=e.length;n>0&&String(t[n+r])===String(e[n]);n--)a++;return o>=a}return!0}var Br=typeof global=="object"&&global&&global.Object===Object&&global,ot=Br;var Lr=typeof self=="object"&&self&&self.Object===Object&&self,Fr=ot||Lr||Function("return this")(),g=Fr;var Nr=g.Symbol,_=Nr;var Kt=Object.prototype,Dr=Kt.hasOwnProperty,kr=Kt.toString,tt=_?_.toStringTag:void 0;function Ur(t){var e=Dr.call(t,tt),r=t[tt];try{t[tt]=void 0;var o=!0}catch{}var a=kr.call(t);return o&&(e?t[tt]=r:delete t[tt]),a}var Wt=Ur;var Gr=Object.prototype,Kr=Gr.toString;function Wr(t){return Kr.call(t)}var zt=Wr;var zr="[object Null]",Vr="[object Undefined]",Vt=_?_.toStringTag:void 0;function qr(t){return t==null?t===void 0?Vr:zr:Vt&&Vt in Object(t)?Wt(t):zt(t)}var I=qr;function Hr(t){return t!=null&&typeof t=="object"}var A=Hr;var $r=Array.isArray,U=$r;function Yr(t){var e=typeof t;return t!=null&&(e=="object"||e=="function")}var O=Yr;var Zr="[object AsyncFunction]",Jr="[object Function]",Xr="[object GeneratorFunction]",Qr="[object Proxy]";function to(t){if(!O(t))return!1;var e=I(t);return e==Jr||e==Xr||e==Zr||e==Qr}var at=to;var eo=g["__core-js_shared__"],st=eo;var qt=function(){var t=/[^.]+$/.exec(st&&st.keys&&st.keys.IE_PROTO||"");return t?"Symbol(src)_1."+t:""}();function ro(t){return!!qt&&qt in t}var Ht=ro;var oo=Function.prototype,ao=oo.toString;function so(t){if(t!=null){try{return ao.call(t)}catch{}try{return t+""}catch{}}return""}var E=so;var io=/[\\^$.*+?()[\]{}|]/g,fo=/^\[object .+?Constructor\]$/,no=Function.prototype,po=Object.prototype,lo=no.toString,mo=po.hasOwnProperty,uo=RegExp("^"+lo.call(mo).replace(io,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");function co(t){if(!O(t)||Ht(t))return!1;var e=at(t)?uo:fo;return e.test(E(t))}var $t=co;function ho(t,e){return t==null?void 0:t[e]}var Yt=ho;function xo(t,e){var r=Yt(t,e);return $t(r)?r:void 0}var j=xo;var go=j(g,"WeakMap"),it=go;var Zt=Object.create,bo=function(){function t(){}return function(e){if(!O(e))return{};if(Zt)return Zt(e);t.prototype=e;var r=new t;return t.prototype=void 0,r}}(),Jt=bo;function yo(t,e){var r=-1,o=t.length;for(e||(e=Array(o));++r<o;)e[r]=t[r];return e}var Xt=yo;var vo=function(){try{var t=j(Object,"defineProperty");return t({},"",{}),t}catch{}}(),Ot=vo;function wo(t,e){for(var r=-1,o=t==null?0:t.length;++r<o&&e(t[r],r,t)!==!1;);return t}var Qt=wo;var jo=9007199254740991,To=/^(?:0|[1-9]\d*)$/;function Ao(t,e){var r=typeof t;return e=e==null?jo:e,!!e&&(r=="number"||r!="symbol"&&To.test(t))&&t>-1&&t%1==0&&t<e}var te=Ao;function Oo(t,e,r){e=="__proto__"&&Ot?Ot(t,e,{configurable:!0,enumerable:!0,value:r,writable:!0}):t[e]=r}var ft=Oo;function Po(t,e){return t===e||t!==t&&e!==e}var nt=Po;var So=Object.prototype,_o=So.hasOwnProperty;function Io(t,e,r){var o=t[e];(!(_o.call(t,e)&&nt(o,r))||r===void 0&&!(e in t))&&ft(t,e,r)}var pt=Io;function Eo(t,e,r,o){var a=!r;r||(r={});for(var p=-1,n=e.length;++p<n;){var s=e[p],l=o?o(r[s],t[s],s,r,t):void 0;l===void 0&&(l=t[s]),a?ft(r,s,l):pt(r,s,l)}return r}var R=Eo;var Co=9007199254740991;function Mo(t){return typeof t=="number"&&t>-1&&t%1==0&&t<=Co}var lt=Mo;function Ro(t){return t!=null&&lt(t.length)&&!at(t)}var mt=Ro;var Bo=Object.prototype;function Lo(t){var e=t&&t.constructor,r=typeof e=="function"&&e.prototype||Bo;return t===r}var G=Lo;function Fo(t,e){for(var r=-1,o=Array(t);++r<t;)o[r]=e(r);return o}var ee=Fo;var No="[object Arguments]";function Do(t){return A(t)&&I(t)==No}var Pt=Do;var re=Object.prototype,ko=re.hasOwnProperty,Uo=re.propertyIsEnumerable,Go=Pt(function(){return arguments}())?Pt:function(t){return A(t)&&ko.call(t,"callee")&&!Uo.call(t,"callee")},oe=Go;function Ko(){return!1}var ae=Ko;var fe=typeof exports=="object"&&exports&&!exports.nodeType&&exports,se=fe&&typeof module=="object"&&module&&!module.nodeType&&module,Wo=se&&se.exports===fe,ie=Wo?g.Buffer:void 0,zo=ie?ie.isBuffer:void 0,Vo=zo||ae,ut=Vo;var qo="[object Arguments]",Ho="[object Array]",$o="[object Boolean]",Yo="[object Date]",Zo="[object Error]",Jo="[object Function]",Xo="[object Map]",Qo="[object Number]",ta="[object Object]",ea="[object RegExp]",ra="[object Set]",oa="[object String]",aa="[object WeakMap]",sa="[object ArrayBuffer]",ia="[object DataView]",fa="[object Float32Array]",na="[object Float64Array]",pa="[object Int8Array]",la="[object Int16Array]",ma="[object Int32Array]",ua="[object Uint8Array]",da="[object Uint8ClampedArray]",ca="[object Uint16Array]",ha="[object Uint32Array]",d={};d[fa]=d[na]=d[pa]=d[la]=d[ma]=d[ua]=d[da]=d[ca]=d[ha]=!0;d[qo]=d[Ho]=d[sa]=d[$o]=d[ia]=d[Yo]=d[Zo]=d[Jo]=d[Xo]=d[Qo]=d[ta]=d[ea]=d[ra]=d[oa]=d[aa]=!1;function xa(t){return A(t)&&lt(t.length)&&!!d[I(t)]}var ne=xa;function ga(t){return function(e){return t(e)}}var K=ga;var pe=typeof exports=="object"&&exports&&!exports.nodeType&&exports,et=pe&&typeof module=="object"&&module&&!module.nodeType&&module,ba=et&&et.exports===pe,St=ba&&ot.process,ya=function(){try{var t=et&&et.require&&et.require("util").types;return t||St&&St.binding&&St.binding("util")}catch{}}(),C=ya;var le=C&&C.isTypedArray,va=le?K(le):ne,me=va;var wa=Object.prototype,ja=wa.hasOwnProperty;function Ta(t,e){var r=U(t),o=!r&&oe(t),a=!r&&!o&&ut(t),p=!r&&!o&&!a&&me(t),n=r||o||a||p,s=n?ee(t.length,String):[],l=s.length;for(var c in t)(e||ja.call(t,c))&&!(n&&(c=="length"||a&&(c=="offset"||c=="parent")||p&&(c=="buffer"||c=="byteLength"||c=="byteOffset")||te(c,l)))&&s.push(c);return s}var dt=Ta;function Aa(t,e){return function(r){return t(e(r))}}var ct=Aa;var Oa=ct(Object.keys,Object),ue=Oa;var Pa=Object.prototype,Sa=Pa.hasOwnProperty;function _a(t){if(!G(t))return ue(t);var e=[];for(var r in Object(t))Sa.call(t,r)&&r!="constructor"&&e.push(r);return e}var de=_a;function Ia(t){return mt(t)?dt(t):de(t)}var W=Ia;function Ea(t){var e=[];if(t!=null)for(var r in Object(t))e.push(r);return e}var ce=Ea;var Ca=Object.prototype,Ma=Ca.hasOwnProperty;function Ra(t){if(!O(t))return ce(t);var e=G(t),r=[];for(var o in t)o=="constructor"&&(e||!Ma.call(t,o))||r.push(o);return r}var he=Ra;function Ba(t){return mt(t)?dt(t,!0):he(t)}var z=Ba;var La=j(Object,"create"),M=La;function Fa(){this.__data__=M?M(null):{},this.size=0}var xe=Fa;function Na(t){var e=this.has(t)&&delete this.__data__[t];return this.size-=e?1:0,e}var ge=Na;var Da="__lodash_hash_undefined__",ka=Object.prototype,Ua=ka.hasOwnProperty;function Ga(t){var e=this.__data__;if(M){var r=e[t];return r===Da?void 0:r}return Ua.call(e,t)?e[t]:void 0}var be=Ga;var Ka=Object.prototype,Wa=Ka.hasOwnProperty;function za(t){var e=this.__data__;return M?e[t]!==void 0:Wa.call(e,t)}var ye=za;var Va="__lodash_hash_undefined__";function qa(t,e){var r=this.__data__;return this.size+=this.has(t)?0:1,r[t]=M&&e===void 0?Va:e,this}var ve=qa;function V(t){var e=-1,r=t==null?0:t.length;for(this.clear();++e<r;){var o=t[e];this.set(o[0],o[1])}}V.prototype.clear=xe;V.prototype.delete=ge;V.prototype.get=be;V.prototype.has=ye;V.prototype.set=ve;var _t=V;function Ha(){this.__data__=[],this.size=0}var we=Ha;function $a(t,e){for(var r=t.length;r--;)if(nt(t[r][0],e))return r;return-1}var B=$a;var Ya=Array.prototype,Za=Ya.splice;function Ja(t){var e=this.__data__,r=B(e,t);if(r<0)return!1;var o=e.length-1;return r==o?e.pop():Za.call(e,r,1),--this.size,!0}var je=Ja;function Xa(t){var e=this.__data__,r=B(e,t);return r<0?void 0:e[r][1]}var Te=Xa;function Qa(t){return B(this.__data__,t)>-1}var Ae=Qa;function ts(t,e){var r=this.__data__,o=B(r,t);return o<0?(++this.size,r.push([t,e])):r[o][1]=e,this}var Oe=ts;function q(t){var e=-1,r=t==null?0:t.length;for(this.clear();++e<r;){var o=t[e];this.set(o[0],o[1])}}q.prototype.clear=we;q.prototype.delete=je;q.prototype.get=Te;q.prototype.has=Ae;q.prototype.set=Oe;var L=q;var es=j(g,"Map"),F=es;function rs(){this.size=0,this.__data__={hash:new _t,map:new(F||L),string:new _t}}var Pe=rs;function os(t){var e=typeof t;return e=="string"||e=="number"||e=="symbol"||e=="boolean"?t!=="__proto__":t===null}var Se=os;function as(t,e){var r=t.__data__;return Se(e)?r[typeof e=="string"?"string":"hash"]:r.map}var N=as;function ss(t){var e=N(this,t).delete(t);return this.size-=e?1:0,e}var _e=ss;function is(t){return N(this,t).get(t)}var Ie=is;function fs(t){return N(this,t).has(t)}var Ee=fs;function ns(t,e){var r=N(this,t),o=r.size;return r.set(t,e),this.size+=r.size==o?0:1,this}var Ce=ns;function H(t){var e=-1,r=t==null?0:t.length;for(this.clear();++e<r;){var o=t[e];this.set(o[0],o[1])}}H.prototype.clear=Pe;H.prototype.delete=_e;H.prototype.get=Ie;H.prototype.has=Ee;H.prototype.set=Ce;var Me=H;function ps(t,e){for(var r=-1,o=e.length,a=t.length;++r<o;)t[a+r]=e[r];return t}var ht=ps;var ls=ct(Object.getPrototypeOf,Object),xt=ls;function ms(){this.__data__=new L,this.size=0}var Re=ms;function us(t){var e=this.__data__,r=e.delete(t);return this.size=e.size,r}var Be=us;function ds(t){return this.__data__.get(t)}var Le=ds;function cs(t){return this.__data__.has(t)}var Fe=cs;var hs=200;function xs(t,e){var r=this.__data__;if(r instanceof L){var o=r.__data__;if(!F||o.length<hs-1)return o.push([t,e]),this.size=++r.size,this;r=this.__data__=new Me(o)}return r.set(t,e),this.size=r.size,this}var Ne=xs;function $(t){var e=this.__data__=new L(t);this.size=e.size}$.prototype.clear=Re;$.prototype.delete=Be;$.prototype.get=Le;$.prototype.has=Fe;$.prototype.set=Ne;var De=$;function gs(t,e){return t&&R(e,W(e),t)}var ke=gs;function bs(t,e){return t&&R(e,z(e),t)}var Ue=bs;var ze=typeof exports=="object"&&exports&&!exports.nodeType&&exports,Ge=ze&&typeof module=="object"&&module&&!module.nodeType&&module,ys=Ge&&Ge.exports===ze,Ke=ys?g.Buffer:void 0,We=Ke?Ke.allocUnsafe:void 0;function vs(t,e){if(e)return t.slice();var r=t.length,o=We?We(r):new t.constructor(r);return t.copy(o),o}var Ve=vs;function ws(t,e){for(var r=-1,o=t==null?0:t.length,a=0,p=[];++r<o;){var n=t[r];e(n,r,t)&&(p[a++]=n)}return p}var qe=ws;function js(){return[]}var gt=js;var Ts=Object.prototype,As=Ts.propertyIsEnumerable,He=Object.getOwnPropertySymbols,Os=He?function(t){return t==null?[]:(t=Object(t),qe(He(t),function(e){return As.call(t,e)}))}:gt,Y=Os;function Ps(t,e){return R(t,Y(t),e)}var $e=Ps;var Ss=Object.getOwnPropertySymbols,_s=Ss?function(t){for(var e=[];t;)ht(e,Y(t)),t=xt(t);return e}:gt,bt=_s;function Is(t,e){return R(t,bt(t),e)}var Ye=Is;function Es(t,e,r){var o=e(t);return U(t)?o:ht(o,r(t))}var yt=Es;function Cs(t){return yt(t,W,Y)}var Ze=Cs;function Ms(t){return yt(t,z,bt)}var Je=Ms;var Rs=j(g,"DataView"),vt=Rs;var Bs=j(g,"Promise"),wt=Bs;var Ls=j(g,"Set"),jt=Ls;var Xe="[object Map]",Fs="[object Object]",Qe="[object Promise]",tr="[object Set]",er="[object WeakMap]",rr="[object DataView]",Ns=E(vt),Ds=E(F),ks=E(wt),Us=E(jt),Gs=E(it),D=I;(vt&&D(new vt(new ArrayBuffer(1)))!=rr||F&&D(new F)!=Xe||wt&&D(wt.resolve())!=Qe||jt&&D(new jt)!=tr||it&&D(new it)!=er)&&(D=function(t){var e=I(t),r=e==Fs?t.constructor:void 0,o=r?E(r):"";if(o)switch(o){case Ns:return rr;case Ds:return Xe;case ks:return Qe;case Us:return tr;case Gs:return er}return e});var Z=D;var Ks=Object.prototype,Ws=Ks.hasOwnProperty;function zs(t){var e=t.length,r=new t.constructor(e);return e&&typeof t[0]=="string"&&Ws.call(t,"index")&&(r.index=t.index,r.input=t.input),r}var or=zs;var Vs=g.Uint8Array,It=Vs;function qs(t){var e=new t.constructor(t.byteLength);return new It(e).set(new It(t)),e}var J=qs;function Hs(t,e){var r=e?J(t.buffer):t.buffer;return new t.constructor(r,t.byteOffset,t.byteLength)}var ar=Hs;var $s=/\w*$/;function Ys(t){var e=new t.constructor(t.source,$s.exec(t));return e.lastIndex=t.lastIndex,e}var sr=Ys;var ir=_?_.prototype:void 0,fr=ir?ir.valueOf:void 0;function Zs(t){return fr?Object(fr.call(t)):{}}var nr=Zs;function Js(t,e){var r=e?J(t.buffer):t.buffer;return new t.constructor(r,t.byteOffset,t.length)}var pr=Js;var Xs="[object Boolean]",Qs="[object Date]",ti="[object Map]",ei="[object Number]",ri="[object RegExp]",oi="[object Set]",ai="[object String]",si="[object Symbol]",ii="[object ArrayBuffer]",fi="[object DataView]",ni="[object Float32Array]",pi="[object Float64Array]",li="[object Int8Array]",mi="[object Int16Array]",ui="[object Int32Array]",di="[object Uint8Array]",ci="[object Uint8ClampedArray]",hi="[object Uint16Array]",xi="[object Uint32Array]";function gi(t,e,r){var o=t.constructor;switch(e){case ii:return J(t);case Xs:case Qs:return new o(+t);case fi:return ar(t,r);case ni:case pi:case li:case mi:case ui:case di:case ci:case hi:case xi:return pr(t,r);case ti:return new o;case ei:case ai:return new o(t);case ri:return sr(t);case oi:return new o;case si:return nr(t)}}var lr=gi;function bi(t){return typeof t.constructor=="function"&&!G(t)?Jt(xt(t)):{}}var mr=bi;var yi="[object Map]";function vi(t){return A(t)&&Z(t)==yi}var ur=vi;var dr=C&&C.isMap,wi=dr?K(dr):ur,cr=wi;var ji="[object Set]";function Ti(t){return A(t)&&Z(t)==ji}var hr=Ti;var xr=C&&C.isSet,Ai=xr?K(xr):hr,gr=Ai;var Oi=1,Pi=2,Si=4,br="[object Arguments]",_i="[object Array]",Ii="[object Boolean]",Ei="[object Date]",Ci="[object Error]",yr="[object Function]",Mi="[object GeneratorFunction]",Ri="[object Map]",Bi="[object Number]",vr="[object Object]",Li="[object RegExp]",Fi="[object Set]",Ni="[object String]",Di="[object Symbol]",ki="[object WeakMap]",Ui="[object ArrayBuffer]",Gi="[object DataView]",Ki="[object Float32Array]",Wi="[object Float64Array]",zi="[object Int8Array]",Vi="[object Int16Array]",qi="[object Int32Array]",Hi="[object Uint8Array]",$i="[object Uint8ClampedArray]",Yi="[object Uint16Array]",Zi="[object Uint32Array]",u={};u[br]=u[_i]=u[Ui]=u[Gi]=u[Ii]=u[Ei]=u[Ki]=u[Wi]=u[zi]=u[Vi]=u[qi]=u[Ri]=u[Bi]=u[vr]=u[Li]=u[Fi]=u[Ni]=u[Di]=u[Hi]=u[$i]=u[Yi]=u[Zi]=!0;u[Ci]=u[yr]=u[ki]=!1;function Tt(t,e,r,o,a,p){var n,s=e&Oi,l=e&Pi,c=e&Si;if(r&&(n=a?r(t,o,a,p):r(t)),n!==void 0)return n;if(!O(t))return t;var x=U(t);if(x){if(n=or(t),!s)return Xt(t,n)}else{var v=Z(t),T=v==yr||v==Mi;if(ut(t))return Ve(t,s);if(v==vr||v==br||T&&!a){if(n=l||T?{}:mr(t),!s)return l?Ye(t,Ue(n,t)):$e(t,ke(n,t))}else{if(!u[v])return a?t:{};n=lr(t,v,s)}}p||(p=new De);var w=p.get(t);if(w)return w;p.set(t,n),gr(t)?t.forEach(function(y){n.add(Tt(y,e,r,y,t,p))}):cr(t)&&t.forEach(function(y,i){n.set(i,Tt(y,e,r,i,t,p))});var b=c?l?Je:Ze:l?z:W,P=x?void 0:b(t);return Qt(P||t,function(y,i){P&&(i=y,y=t[i]),pt(n,i,Tt(y,e,r,i,t,p))}),n}var wr=Tt;var Ji=1,Xi=4;function Qi(t){return wr(t,Ji|Xi)}var Et=Qi;function jr(t){return{all:t=t||new Map,on:function(e,r){var o=t.get(e);o?o.push(r):t.set(e,[r])},off:function(e,r){var o=t.get(e);o&&(r?o.splice(o.indexOf(r)>>>0,1):t.set(e,[]))},emit:function(e,r){var o=t.get(e);o&&o.slice().map(function(a){a(r)}),(o=t.get("*"))&&o.slice().map(function(a){a(e,r)})}}}var Ct=(t=21)=>crypto.getRandomValues(new Uint8Array(t)).reduce((e,r)=>(r&=63,r<36?e+=r.toString(36):r<62?e+=(r-26).toString(36).toUpperCase():r>62?e+="-":e+="_",e),"");var tf="array",ef="bit",Tr="bits",rf="byte",Ar="bytes",X="",of="exponent",af="function",Or="iec",sf="Invalid number",ff="Invalid rounding method",Mt="jedec",nf="object",Pr=".",pf="round",lf="s",mf="si",uf="kbit",df="kB",cf=" ",hf="string",xf="0",Rt={symbol:{iec:{bits:["bit","Kibit","Mibit","Gibit","Tibit","Pibit","Eibit","Zibit","Yibit"],bytes:["B","KiB","MiB","GiB","TiB","PiB","EiB","ZiB","YiB"]},jedec:{bits:["bit","Kbit","Mbit","Gbit","Tbit","Pbit","Ebit","Zbit","Ybit"],bytes:["B","KB","MB","GB","TB","PB","EB","ZB","YB"]}},fullform:{iec:["","kibi","mebi","gibi","tebi","pebi","exbi","zebi","yobi"],jedec:["","kilo","mega","giga","tera","peta","exa","zetta","yotta"]}};function Sr(t,{bits:e=!1,pad:r=!1,base:o=-1,round:a=2,locale:p=X,localeOptions:n={},separator:s=X,spacer:l=cf,symbols:c={},standard:x=X,output:v=hf,fullform:T=!1,fullforms:w=[],exponent:b=-1,roundingMethod:P=pf,precision:y=0}={}){let i=b,m=Number(t),f=[],S=0,At=X;x===mf?(o=10,x=Mt):x===Or||x===Mt?o=2:o===2?x=Or:(o=10,x=Mt);let rt=o===10?1e3:1024,_r=T===!0,Lt=m<0,Ft=Math[P];if(typeof t!="bigint"&&isNaN(t))throw new TypeError(sf);if(typeof Ft!==af)throw new TypeError(ff);if(Lt&&(m=-m),(i===-1||isNaN(i))&&(i=Math.floor(Math.log(m)/Math.log(rt)),i<0&&(i=0)),i>8&&(y>0&&(y+=8-i),i=8),v===of)return i;if(m===0)f[0]=0,At=f[1]=Rt.symbol[x][e?Tr:Ar][i];else{S=m/(o===2?Math.pow(2,i*10):Math.pow(1e3,i)),e&&(S=S*8,S>=rt&&i<8&&(S=S/rt,i++));let Q=Math.pow(10,i>0?a:0);f[0]=Ft(S*Q)/Q,f[0]===rt&&i<8&&b===-1&&(f[0]=1,i++),At=f[1]=o===10&&i===1?e?uf:df:Rt.symbol[x][e?Tr:Ar][i]}if(Lt&&(f[0]=-f[0]),y>0&&(f[0]=f[0].toPrecision(y)),f[1]=c[f[1]]||f[1],p===!0?f[0]=f[0].toLocaleString():p.length>0?f[0]=f[0].toLocaleString(p,n):s.length>0&&(f[0]=f[0].toString().replace(Pr,s)),r&&Number.isInteger(f[0])===!1&&a>0){let Q=s||Pr,Nt=f[0].toString().split(Q),Dt=Nt[1]||X,kt=Dt.length,Ir=a-kt;f[0]=`${Nt[0]}${Q}${Dt.padEnd(kt+Ir,xf)}`}return _r&&(f[1]=w[i]?w[i]:Rt.fullform[x][i]+(e?ef:rf)+(f[0]===1?X:lf)),v===tf?f:v===nf?{value:f[0],symbol:f[1],exponent:i,unit:At}:f.join(l)}var k=class{constructor(e){h(this,"tera");h(this,"id");h(this,"name");h(this,"path");h(this,"parsedName");h(this,"created");h(this,"createdFormatted");h(this,"modified");h(this,"modifiedFormatted");h(this,"accessed");h(this,"accessedFormatted");h(this,"size");h(this,"sizeFormatted");h(this,"mime");if(!e.tera)throw new Error("Basic file requires a `tera` key to access the Tera instance");Object.assign(this,e),this.sizeFormatted=Sr(this.size||0,{spacer:""}),this.createdFormatted=this.created?this.created.toLocaleDateString():"Unknown created date",this.modifiedFormatted=this.modified?this.modified.toLocaleDateString():"Unknown modified date",this.accessedFormatted=this.accessed?this.accessed.toLocaleDateString():"Unknown access date"}getContents(){return this.tera.getProjectFile(this.path)}setContents(e){return this.tera.setProjectFile(this.path,e)}getRefs(){return this.tera.getProjectLibrary(this.path)}setRefs(e){return this.tera.setProjectLibrary(this.path,e)}};var Bt=class{constructor(e){h(this,"settings",{devMode:!0,mode:"detect",modeTimeout:300,modeFallback:"child",siteUrl:"https://tera-tools.com/embed",restrictOrigin:"*",frameSandbox:["allow-forms","allow-modals","allow-orientation-lock","allow-pointer-lock","allow-popups","allow-popups-to-escape-sandbox","allow-presentation","allow-same-origin","allow-scripts","allow-top-navigation"],handshakeInterval:1e3});h(this,"events",jr());h(this,"dom",{el:null,iframe:null,popup:null,stylesheet:null});h(this,"methods",["handshake","getUser","requireUser","bindProject","getProject","getProjects","setActiveProject","requireProject","selectProject","getProjectState","setProjectState","setProjectStateDefaults","saveProjectState","replaceProjectState","applyProjectStatePatch","setProjectFile","selectProjectLibrary","getProjectLibrary","setProjectLibrary","uiAlert","uiSplat","uiWindow"]);h(this,"plugins",[]);h(this,"acceptPostboxes",{});e&&this.set(e)}send(e){let r=Ct();return this.acceptPostboxes[r]={},this.acceptPostboxes[r].promise=new Promise((o,a)=>{Object.assign(this.acceptPostboxes[r],{resolve:o,reject:a}),this.sendRaw({id:r,...e})}),this.acceptPostboxes[r].promise}sendRaw(e){let r;try{if(r={TERA:1,id:e.id||Ct(),...Et(e)},this.settings.mode=="parent")window.parent.postMessage(r,this.settings.restrictOrigin);else if(this.settings.mode=="child")this.dom.iframe.contentWindow.postMessage(r,this.settings.restrictOrigin);else if(this.settings.mode=="popup")this.dom.popup.postMessage(r,this.settings.restrictOrigin);else throw this.settings.mode=="detect"?new Error("Call init() or detectMode() before trying to send data to determine the mode"):new Error(`Unknown TERA communication mode "${this.settings.mode}"`)}catch(o){throw this.debug("ERROR","Message compose client->server:",o),this.debug("ERROR","Attempted to dispatch payload client->server",r),o}}rpc(e,...r){return this.send({action:"rpc",method:e,args:r})}acceptMessage(e){if(e.origin==window.location.origin)return;let r=e.data;if(!(!r.TERA||!r.id))if(this.debug("Recieved",r),(r==null?void 0:r.action)=="response"&&this.acceptPostboxes[r.id])r.isError===!0?this.acceptPostboxes[r.id].reject(r.response):this.acceptPostboxes[r.id].resolve(r.response);else{if((r==null?void 0:r.action)=="rpc")return Promise.resolve().then(()=>this[r.method].apply(this,r.args)).then(o=>this.sendRaw({id:r.id,action:"response",response:o})).catch(o=>{console.warn(`TERA-FY client threw on RPC:${r.method}:`,o),this.sendRaw({id:r.id,action:"response",isError:!0,response:o&&o.toString()})});if((r==null?void 0:r.action)=="event")return Promise.resolve().then(()=>this.events.emit(r.event,...r.payload)).catch(o=>{throw console.warn(`TERA-FY client threw while handling emitted event "${r.event}"`,{message:r}),o});r!=null&&r.id?this.debug(`Ignoring message ID ${r.id} - was meant for someone else?`):this.debug("Unexpected incoming TERA-FY CLIENT message",{message:r})}}createProjectStatePatch(e,r){let o=Ut(r,e,Gt);return this.debug("INFO","Created project patch",{newState:e,oldState:r}),this.applyProjectStatePatch(o)}applyProjectStatePatchLocal(e){throw new Error("applyProjectStatePatchLocal() has not been sub-classed by a plugin")}init(e){if(e&&this.set(e),this.init.promise)return this.init.promise;window.addEventListener("message",this.acceptMessage.bind(this));let r=this;return this.init.promise=Promise.resolve().then(()=>this.detectMode()).then(o=>this.settings.mode=o).then(()=>Promise.all([this.injectComms(),this.injectStylesheet(),this.injectMethods()])).then(()=>this.rpc("setServerMode",this.settings.mode=="child"?"embedded":this.settings.mode=="parent"?"frame":this.settings.mode=="popup"?"popup":(()=>{throw`Unknown server mode "${this.settings.mode}"`})())).then(()=>Promise.all(this.plugins.map(o=>o.init.call(r,this.settings))))}detectMode(){return this.settings.mode!="detect"?this.settings.mode:window.self===window.parent?this.settings.modeFallback:Promise.resolve().then(()=>this.settings.mode="parent").then(()=>new Promise((e,r)=>{let o=setTimeout(()=>r(),this.settings.modeTimeout);this.rpc("handshake").then(()=>clearTimeout(o)).then(()=>e())})).then(()=>"parent").catch(()=>this.settings.modeFallback)}injectComms(){return new Promise(e=>{switch(this.settings.mode){case"child":this.debug("Injecting TERA site as iFrame child"),this.dom.el=document.createElement("div"),this.dom.el.id="tera-fy",this.dom.el.classList.toggle("dev-mode",this.settings.devMode),document.body.append(this.dom.el),this.dom.iframe=document.createElement("iframe"),this.dom.iframe.setAttribute("sandbox",this.settings.frameSandbox.join(" ")),this.dom.iframe.addEventListener("load",()=>{this.debug("Embed frame ready"),e()}),this.dom.iframe.src=this.settings.siteUrl,this.dom.el.append(this.dom.iframe);break;case"parent":this.debug("Using TERA window parent"),e();break;case"popup":this.debug("Injecting TERA site as a popup window"),this.dom.popup=window.open(this.settings.siteUrl,"_blank","popup=1, location=0, menubar=0, status=0, scrollbars=0, width=500, height=600"),(()=>{let r=0,o,a=()=>{this.debug("Trying handshake",++r),clearTimeout(o),o=setTimeout(a,this.settings.handshakeInterval),this.rpc("handshake").then(()=>{clearTimeout(o),this.debug("Popup window accepted handshake"),e()})};a()})();break;default:throw new Error(`Unsupported mode "${this.settings.mode}" when calling injectComms()`)}})}injectStylesheet(){switch(this.settings.mode){case"child":this.dom.stylesheet=document.createElement("style"),this.dom.stylesheet.innerHTML=[":root {","--TERA-accent: #4d659c;","}","#tera-fy {","display: none;","position: fixed;","right: 50px;","bottom: 50px;","width: 300px;","height: 150px;","background: transparent;","&.dev-mode {","display: flex;","border: 5px solid var(--TERA-accent);","background: #FFF;","}","& > iframe {","width: 100%;","height: 100%;","}","}","body.tera-fy-focus {","overflow: hidden;","& #tera-fy {","display: flex !important;","position: fixed !important;","top: 0px !important;","width: 100vw !important;","height: 100vh !important;","left: 0px !important;","z-index: 10000 !important;","}","}"].join(`
`),document.head.appendChild(this.dom.stylesheet);break;case"parent":case"popup":break;default:throw new Error(`Unsupported mode "${this.settings.mode}" when injectStylesheet()`)}}injectMethods(){this.methods.forEach(e=>this[e]=this.rpc.bind(this,e))}debug(...e){let r="log";typeof e[0]=="string"&&["INFO","LOG","WARN","ERROR"].includes(e[0])&&(r=e.shift().toLowerCase()),!(["INFO","LOG"].includes(r)&&!this.settings.devMode)&&console[r]("%c[TERA-FY CLIENT]","font-weight: bold; color: #ff5722;",...e)}set(e,r){return typeof e=="string"?this.settings[e]=r:Object.assign(this.settings,e),this.toggleDevMode(this.settings.devMode)}setIfDev(e,r){return!this.settings.devMode||r===void 0?this:this.set(e,r)}use(e,r){if(typeof e!="function")throw new Error("Expected use() call to be provided with a class initalizer");let o=new e(this,r);return this.mixin(this,o),this.plugins.push(o),this}mixin(e,r){Object.getOwnPropertyNames(Object.getPrototypeOf(r)).filter(o=>!["constructor","prototype","name"].includes(o)).filter(o=>o!="init").forEach(o=>{Object.defineProperty(e,o,{value:r[o].bind(e),enumerable:!1})})}toggleDevMode(e="toggle"){return this.settings.devMode=e==="toggle"?!this.settings.devMode:e,this.dom.el&&this.dom.el.classList.toggle("dev-mode",this.settings.devMode),this}toggleFocus(e="toggle"){this.debug("Request focus",{isFocused:e}),globalThis.document.body.classList.toggle("tera-fy-focus",e==="toggle"?void 0:e)}selectProjectFile(e){return this.rpc("selectProjectFile",e).then(r=>r&&new k({tera:this,...r}))}getProjectFiles(e){return this.rpc("getProjectFiles",e).then(r=>r.map(o=>new k({tera:this,...o})))}getProjectFile(e){return this.rpc("getProjectFile",e).then(r=>r&&new k({tera:this,...r}))}};export{Bt as default};
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
   * @version 10.1.1
   *)
*/
