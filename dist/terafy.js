function qt(t,e,r){if(!t||typeof t!="object"||!e||typeof e!="object")throw new Error("both arguments must be objects or arrays");r||(r=function(i){return i});function o({obj1:i,obj2:f,basePath:m,basePathForRemoves:h,diffs:b}){var A=Object.keys(i),w=A.length,g=Object.keys(f),I=g.length,y,p=i.length-f.length;if(uo(i,f)){for(var u=0;u<w;u++){var l=Array.isArray(i)?Number(A[u]):A[u];l in f||(y=h.concat(l),b.remove.push({op:"remove",path:r(y)}))}for(var u=0;u<I;u++){var l=Array.isArray(f)?Number(g[u]):g[u];s({key:l,obj1:i,obj2:f,path:m.concat(l),pathForRemoves:m.concat(l),diffs:b})}}else{for(var u=0;u<p;u++)y=h.concat(u),b.remove.push({op:"remove",path:r(y)});for(var _=i.slice(p),u=0;u<I;u++)s({key:u,obj1:_,obj2:f,path:m.concat(u),pathForRemoves:m.concat(u+p),diffs:b})}}var a={remove:[],replace:[],add:[]};return o({obj1:t,obj2:e,basePath:[],basePathForRemoves:[],diffs:a}),a.remove.reverse().concat(a.replace).concat(a.add);function s({key:i,obj1:f,obj2:m,path:h,pathForRemoves:b,diffs:A}){var w=f[i],g=m[i];if(!(i in f)&&i in m){var I=g;A.add.push({op:"add",path:r(h),value:I})}else w!==g&&(Object(w)!==w||Object(g)!==g||mo(w,g)||!Object.keys(w).length&&!Object.keys(g).length&&String(w)!=String(g)?n(h,A,g):o({obj1:f[i],obj2:m[i],basePath:h,basePathForRemoves:b,diffs:A}))}function n(i,f,m){f.replace.push({op:"replace",path:r(i),value:m})}}function mo(t,e){return Object.prototype.toString.call(t)!=Object.prototype.toString.call(e)}function uo(t,e){var r=t.length-e.length;if(Array.isArray(t)&&Array.isArray(e)&&r>0){for(var o=0,a=0,s=0;s<e.length&&String(t[s])===String(e[s]);s++)o++;for(var n=e.length;n>0&&String(t[n+r])===String(e[n]);n--)a++;return o>=a}return!0}var co=typeof global=="object"&&global&&global.Object===Object&&global,ut=co;var ho=typeof self=="object"&&self&&self.Object===Object&&self,xo=ut||ho||Function("return this")(),x=xo;var go=x.Symbol,T=go;var Vt=Object.prototype,yo=Vt.hasOwnProperty,bo=Vt.toString,ft=T?T.toStringTag:void 0;function vo(t){var e=yo.call(t,ft),r=t[ft];try{t[ft]=void 0;var o=!0}catch{}var a=bo.call(t);return o&&(e?t[ft]=r:delete t[ft]),a}var Yt=vo;var To=Object.prototype,wo=To.toString;function Oo(t){return wo.call(t)}var Zt=Oo;var Ao="[object Null]",jo="[object Undefined]",Jt=T?T.toStringTag:void 0;function Po(t){return t==null?t===void 0?jo:Ao:Jt&&Jt in Object(t)?Yt(t):Zt(t)}var S=Po;function So(t){return t!=null&&typeof t=="object"}var P=So;var Io="[object Symbol]";function _o(t){return typeof t=="symbol"||P(t)&&S(t)==Io}var z=_o;function Eo(t,e){for(var r=-1,o=t==null?0:t.length,a=Array(o);++r<o;)a[r]=e(t[r],r,t);return a}var Xt=Eo;var Fo=Array.isArray,v=Fo;var Co=1/0,Qt=T?T.prototype:void 0,te=Qt?Qt.toString:void 0;function ee(t){if(typeof t=="string")return t;if(v(t))return Xt(t,ee)+"";if(z(t))return te?te.call(t):"";var e=t+"";return e=="0"&&1/t==-Co?"-0":e}var re=ee;function Ro(t){var e=typeof t;return t!=null&&(e=="object"||e=="function")}var j=Ro;function Mo(t){return t}var oe=Mo;var No="[object AsyncFunction]",Lo="[object Function]",Bo="[object GeneratorFunction]",ko="[object Proxy]";function Do(t){if(!j(t))return!1;var e=S(t);return e==Lo||e==Bo||e==No||e==ko}var dt=Do;var Uo=x["__core-js_shared__"],ct=Uo;var ae=function(){var t=/[^.]+$/.exec(ct&&ct.keys&&ct.keys.IE_PROTO||"");return t?"Symbol(src)_1."+t:""}();function zo(t){return!!ae&&ae in t}var ie=zo;var Ko=Function.prototype,Go=Ko.toString;function Wo(t){if(t!=null){try{return Go.call(t)}catch{}try{return t+""}catch{}}return""}var E=Wo;var $o=/[\\^$.*+?()[\]{}|]/g,Ho=/^\[object .+?Constructor\]$/,qo=Function.prototype,Vo=Object.prototype,Yo=qo.toString,Zo=Vo.hasOwnProperty,Jo=RegExp("^"+Yo.call(Zo).replace($o,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");function Xo(t){if(!j(t)||ie(t))return!1;var e=dt(t)?Jo:Ho;return e.test(E(t))}var se=Xo;function Qo(t,e){return t?.[e]}var ne=Qo;function ta(t,e){var r=ne(t,e);return se(r)?r:void 0}var O=ta;var ea=O(x,"WeakMap"),ht=ea;var fe=Object.create,ra=function(){function t(){}return function(e){if(!j(e))return{};if(fe)return fe(e);t.prototype=e;var r=new t;return t.prototype=void 0,r}}(),pe=ra;function oa(t,e,r){switch(r.length){case 0:return t.call(e);case 1:return t.call(e,r[0]);case 2:return t.call(e,r[0],r[1]);case 3:return t.call(e,r[0],r[1],r[2])}return t.apply(e,r)}var le=oa;function aa(t,e){var r=-1,o=t.length;for(e||(e=Array(o));++r<o;)e[r]=t[r];return e}var me=aa;var ia=800,sa=16,na=Date.now;function fa(t){var e=0,r=0;return function(){var o=na(),a=sa-(o-r);if(r=o,a>0){if(++e>=ia)return arguments[0]}else e=0;return t.apply(void 0,arguments)}}var ue=fa;function pa(t){return function(){return t}}var de=pa;var la=function(){try{var t=O(Object,"defineProperty");return t({},"",{}),t}catch{}}(),K=la;var ma=K?function(t,e){return K(t,"toString",{configurable:!0,enumerable:!1,value:de(e),writable:!0})}:oe,ce=ma;var ua=ue(ce),he=ua;function da(t,e){for(var r=-1,o=t==null?0:t.length;++r<o&&e(t[r],r,t)!==!1;);return t}var xe=da;var ca=9007199254740991,ha=/^(?:0|[1-9]\d*)$/;function xa(t,e){var r=typeof t;return e=e??ca,!!e&&(r=="number"||r!="symbol"&&ha.test(t))&&t>-1&&t%1==0&&t<e}var G=xa;function ga(t,e,r){e=="__proto__"&&K?K(t,e,{configurable:!0,enumerable:!0,value:r,writable:!0}):t[e]=r}var xt=ga;function ya(t,e){return t===e||t!==t&&e!==e}var gt=ya;var ba=Object.prototype,va=ba.hasOwnProperty;function Ta(t,e,r){var o=t[e];(!(va.call(t,e)&&gt(o,r))||r===void 0&&!(e in t))&&xt(t,e,r)}var W=Ta;function wa(t,e,r,o){var a=!r;r||(r={});for(var s=-1,n=e.length;++s<n;){var i=e[s],f=o?o(r[i],t[i],i,r,t):void 0;f===void 0&&(f=t[i]),a?xt(r,i,f):W(r,i,f)}return r}var R=wa;var ge=Math.max;function Oa(t,e,r){return e=ge(e===void 0?t.length-1:e,0),function(){for(var o=arguments,a=-1,s=ge(o.length-e,0),n=Array(s);++a<s;)n[a]=o[e+a];a=-1;for(var i=Array(e+1);++a<e;)i[a]=o[a];return i[e]=r(n),le(t,this,i)}}var ye=Oa;var Aa=9007199254740991;function ja(t){return typeof t=="number"&&t>-1&&t%1==0&&t<=Aa}var $=ja;function Pa(t){return t!=null&&$(t.length)&&!dt(t)}var yt=Pa;var Sa=Object.prototype;function Ia(t){var e=t&&t.constructor,r=typeof e=="function"&&e.prototype||Sa;return t===r}var H=Ia;function _a(t,e){for(var r=-1,o=Array(t);++r<t;)o[r]=e(r);return o}var be=_a;var Ea="[object Arguments]";function Fa(t){return P(t)&&S(t)==Ea}var Ct=Fa;var ve=Object.prototype,Ca=ve.hasOwnProperty,Ra=ve.propertyIsEnumerable,Ma=Ct(function(){return arguments}())?Ct:function(t){return P(t)&&Ca.call(t,"callee")&&!Ra.call(t,"callee")},q=Ma;function Na(){return!1}var Te=Na;var Ae=typeof exports=="object"&&exports&&!exports.nodeType&&exports,we=Ae&&typeof module=="object"&&module&&!module.nodeType&&module,La=we&&we.exports===Ae,Oe=La?x.Buffer:void 0,Ba=Oe?Oe.isBuffer:void 0,ka=Ba||Te,bt=ka;var Da="[object Arguments]",Ua="[object Array]",za="[object Boolean]",Ka="[object Date]",Ga="[object Error]",Wa="[object Function]",$a="[object Map]",Ha="[object Number]",qa="[object Object]",Va="[object RegExp]",Ya="[object Set]",Za="[object String]",Ja="[object WeakMap]",Xa="[object ArrayBuffer]",Qa="[object DataView]",ti="[object Float32Array]",ei="[object Float64Array]",ri="[object Int8Array]",oi="[object Int16Array]",ai="[object Int32Array]",ii="[object Uint8Array]",si="[object Uint8ClampedArray]",ni="[object Uint16Array]",fi="[object Uint32Array]",c={};c[ti]=c[ei]=c[ri]=c[oi]=c[ai]=c[ii]=c[si]=c[ni]=c[fi]=!0;c[Da]=c[Ua]=c[Xa]=c[za]=c[Qa]=c[Ka]=c[Ga]=c[Wa]=c[$a]=c[Ha]=c[qa]=c[Va]=c[Ya]=c[Za]=c[Ja]=!1;function pi(t){return P(t)&&$(t.length)&&!!c[S(t)]}var je=pi;function li(t){return function(e){return t(e)}}var V=li;var Pe=typeof exports=="object"&&exports&&!exports.nodeType&&exports,pt=Pe&&typeof module=="object"&&module&&!module.nodeType&&module,mi=pt&&pt.exports===Pe,Rt=mi&&ut.process,ui=function(){try{var t=pt&&pt.require&&pt.require("util").types;return t||Rt&&Rt.binding&&Rt.binding("util")}catch{}}(),F=ui;var Se=F&&F.isTypedArray,di=Se?V(Se):je,Ie=di;var ci=Object.prototype,hi=ci.hasOwnProperty;function xi(t,e){var r=v(t),o=!r&&q(t),a=!r&&!o&&bt(t),s=!r&&!o&&!a&&Ie(t),n=r||o||a||s,i=n?be(t.length,String):[],f=i.length;for(var m in t)(e||hi.call(t,m))&&!(n&&(m=="length"||a&&(m=="offset"||m=="parent")||s&&(m=="buffer"||m=="byteLength"||m=="byteOffset")||G(m,f)))&&i.push(m);return i}var vt=xi;function gi(t,e){return function(r){return t(e(r))}}var Tt=gi;var yi=Tt(Object.keys,Object),_e=yi;var bi=Object.prototype,vi=bi.hasOwnProperty;function Ti(t){if(!H(t))return _e(t);var e=[];for(var r in Object(t))vi.call(t,r)&&r!="constructor"&&e.push(r);return e}var Ee=Ti;function wi(t){return yt(t)?vt(t):Ee(t)}var Y=wi;function Oi(t){var e=[];if(t!=null)for(var r in Object(t))e.push(r);return e}var Fe=Oi;var Ai=Object.prototype,ji=Ai.hasOwnProperty;function Pi(t){if(!j(t))return Fe(t);var e=H(t),r=[];for(var o in t)o=="constructor"&&(e||!ji.call(t,o))||r.push(o);return r}var Ce=Pi;function Si(t){return yt(t)?vt(t,!0):Ce(t)}var Z=Si;var Ii=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,_i=/^\w*$/;function Ei(t,e){if(v(t))return!1;var r=typeof t;return r=="number"||r=="symbol"||r=="boolean"||t==null||z(t)?!0:_i.test(t)||!Ii.test(t)||e!=null&&t in Object(e)}var Re=Ei;var Fi=O(Object,"create"),C=Fi;function Ci(){this.__data__=C?C(null):{},this.size=0}var Me=Ci;function Ri(t){var e=this.has(t)&&delete this.__data__[t];return this.size-=e?1:0,e}var Ne=Ri;var Mi="__lodash_hash_undefined__",Ni=Object.prototype,Li=Ni.hasOwnProperty;function Bi(t){var e=this.__data__;if(C){var r=e[t];return r===Mi?void 0:r}return Li.call(e,t)?e[t]:void 0}var Le=Bi;var ki=Object.prototype,Di=ki.hasOwnProperty;function Ui(t){var e=this.__data__;return C?e[t]!==void 0:Di.call(e,t)}var Be=Ui;var zi="__lodash_hash_undefined__";function Ki(t,e){var r=this.__data__;return this.size+=this.has(t)?0:1,r[t]=C&&e===void 0?zi:e,this}var ke=Ki;function J(t){var e=-1,r=t==null?0:t.length;for(this.clear();++e<r;){var o=t[e];this.set(o[0],o[1])}}J.prototype.clear=Me;J.prototype.delete=Ne;J.prototype.get=Le;J.prototype.has=Be;J.prototype.set=ke;var Mt=J;function Gi(){this.__data__=[],this.size=0}var De=Gi;function Wi(t,e){for(var r=t.length;r--;)if(gt(t[r][0],e))return r;return-1}var M=Wi;var $i=Array.prototype,Hi=$i.splice;function qi(t){var e=this.__data__,r=M(e,t);if(r<0)return!1;var o=e.length-1;return r==o?e.pop():Hi.call(e,r,1),--this.size,!0}var Ue=qi;function Vi(t){var e=this.__data__,r=M(e,t);return r<0?void 0:e[r][1]}var ze=Vi;function Yi(t){return M(this.__data__,t)>-1}var Ke=Yi;function Zi(t,e){var r=this.__data__,o=M(r,t);return o<0?(++this.size,r.push([t,e])):r[o][1]=e,this}var Ge=Zi;function X(t){var e=-1,r=t==null?0:t.length;for(this.clear();++e<r;){var o=t[e];this.set(o[0],o[1])}}X.prototype.clear=De;X.prototype.delete=Ue;X.prototype.get=ze;X.prototype.has=Ke;X.prototype.set=Ge;var N=X;var Ji=O(x,"Map"),L=Ji;function Xi(){this.size=0,this.__data__={hash:new Mt,map:new(L||N),string:new Mt}}var We=Xi;function Qi(t){var e=typeof t;return e=="string"||e=="number"||e=="symbol"||e=="boolean"?t!=="__proto__":t===null}var $e=Qi;function ts(t,e){var r=t.__data__;return $e(e)?r[typeof e=="string"?"string":"hash"]:r.map}var B=ts;function es(t){var e=B(this,t).delete(t);return this.size-=e?1:0,e}var He=es;function rs(t){return B(this,t).get(t)}var qe=rs;function os(t){return B(this,t).has(t)}var Ve=os;function as(t,e){var r=B(this,t),o=r.size;return r.set(t,e),this.size+=r.size==o?0:1,this}var Ye=as;function Q(t){var e=-1,r=t==null?0:t.length;for(this.clear();++e<r;){var o=t[e];this.set(o[0],o[1])}}Q.prototype.clear=We;Q.prototype.delete=He;Q.prototype.get=qe;Q.prototype.has=Ve;Q.prototype.set=Ye;var lt=Q;var is="Expected a function";function Nt(t,e){if(typeof t!="function"||e!=null&&typeof e!="function")throw new TypeError(is);var r=function(){var o=arguments,a=e?e.apply(this,o):o[0],s=r.cache;if(s.has(a))return s.get(a);var n=t.apply(this,o);return r.cache=s.set(a,n)||s,n};return r.cache=new(Nt.Cache||lt),r}Nt.Cache=lt;var Ze=Nt;var ss=500;function ns(t){var e=Ze(t,function(o){return r.size===ss&&r.clear(),o}),r=e.cache;return e}var Je=ns;var fs=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,ps=/\\(\\)?/g,ls=Je(function(t){var e=[];return t.charCodeAt(0)===46&&e.push(""),t.replace(fs,function(r,o,a,s){e.push(a?s.replace(ps,"$1"):o||r)}),e}),Xe=ls;function ms(t){return t==null?"":re(t)}var Qe=ms;function us(t,e){return v(t)?t:Re(t,e)?[t]:Xe(Qe(t))}var k=us;var ds=1/0;function cs(t){if(typeof t=="string"||z(t))return t;var e=t+"";return e=="0"&&1/t==-ds?"-0":e}var tt=cs;function hs(t,e){e=k(e,t);for(var r=0,o=e.length;t!=null&&r<o;)t=t[tt(e[r++])];return r&&r==o?t:void 0}var tr=hs;function xs(t,e){for(var r=-1,o=e.length,a=t.length;++r<o;)t[a+r]=e[r];return t}var et=xs;var er=T?T.isConcatSpreadable:void 0;function gs(t){return v(t)||q(t)||!!(er&&t&&t[er])}var rr=gs;function or(t,e,r,o,a){var s=-1,n=t.length;for(r||(r=rr),a||(a=[]);++s<n;){var i=t[s];e>0&&r(i)?e>1?or(i,e-1,r,o,a):et(a,i):o||(a[a.length]=i)}return a}var ar=or;function ys(t){var e=t==null?0:t.length;return e?ar(t,1):[]}var ir=ys;function bs(t){return he(ye(t,void 0,ir),t+"")}var sr=bs;var vs=Tt(Object.getPrototypeOf,Object),wt=vs;function Ts(){this.__data__=new N,this.size=0}var nr=Ts;function ws(t){var e=this.__data__,r=e.delete(t);return this.size=e.size,r}var fr=ws;function Os(t){return this.__data__.get(t)}var pr=Os;function As(t){return this.__data__.has(t)}var lr=As;var js=200;function Ps(t,e){var r=this.__data__;if(r instanceof N){var o=r.__data__;if(!L||o.length<js-1)return o.push([t,e]),this.size=++r.size,this;r=this.__data__=new lt(o)}return r.set(t,e),this.size=r.size,this}var mr=Ps;function rt(t){var e=this.__data__=new N(t);this.size=e.size}rt.prototype.clear=nr;rt.prototype.delete=fr;rt.prototype.get=pr;rt.prototype.has=lr;rt.prototype.set=mr;var ur=rt;function Ss(t,e){return t&&R(e,Y(e),t)}var dr=Ss;function Is(t,e){return t&&R(e,Z(e),t)}var cr=Is;var yr=typeof exports=="object"&&exports&&!exports.nodeType&&exports,hr=yr&&typeof module=="object"&&module&&!module.nodeType&&module,_s=hr&&hr.exports===yr,xr=_s?x.Buffer:void 0,gr=xr?xr.allocUnsafe:void 0;function Es(t,e){if(e)return t.slice();var r=t.length,o=gr?gr(r):new t.constructor(r);return t.copy(o),o}var br=Es;function Fs(t,e){for(var r=-1,o=t==null?0:t.length,a=0,s=[];++r<o;){var n=t[r];e(n,r,t)&&(s[a++]=n)}return s}var vr=Fs;function Cs(){return[]}var Ot=Cs;var Rs=Object.prototype,Ms=Rs.propertyIsEnumerable,Tr=Object.getOwnPropertySymbols,Ns=Tr?function(t){return t==null?[]:(t=Object(t),vr(Tr(t),function(e){return Ms.call(t,e)}))}:Ot,ot=Ns;function Ls(t,e){return R(t,ot(t),e)}var wr=Ls;var Bs=Object.getOwnPropertySymbols,ks=Bs?function(t){for(var e=[];t;)et(e,ot(t)),t=wt(t);return e}:Ot,At=ks;function Ds(t,e){return R(t,At(t),e)}var Or=Ds;function Us(t,e,r){var o=e(t);return v(t)?o:et(o,r(t))}var jt=Us;function zs(t){return jt(t,Y,ot)}var Ar=zs;function Ks(t){return jt(t,Z,At)}var jr=Ks;var Gs=O(x,"DataView"),Pt=Gs;var Ws=O(x,"Promise"),St=Ws;var $s=O(x,"Set"),It=$s;var Pr="[object Map]",Hs="[object Object]",Sr="[object Promise]",Ir="[object Set]",_r="[object WeakMap]",Er="[object DataView]",qs=E(Pt),Vs=E(L),Ys=E(St),Zs=E(It),Js=E(ht),U=S;(Pt&&U(new Pt(new ArrayBuffer(1)))!=Er||L&&U(new L)!=Pr||St&&U(St.resolve())!=Sr||It&&U(new It)!=Ir||ht&&U(new ht)!=_r)&&(U=function(t){var e=S(t),r=e==Hs?t.constructor:void 0,o=r?E(r):"";if(o)switch(o){case qs:return Er;case Vs:return Pr;case Ys:return Sr;case Zs:return Ir;case Js:return _r}return e});var at=U;var Xs=Object.prototype,Qs=Xs.hasOwnProperty;function tn(t){var e=t.length,r=new t.constructor(e);return e&&typeof t[0]=="string"&&Qs.call(t,"index")&&(r.index=t.index,r.input=t.input),r}var Fr=tn;var en=x.Uint8Array,Lt=en;function rn(t){var e=new t.constructor(t.byteLength);return new Lt(e).set(new Lt(t)),e}var it=rn;function on(t,e){var r=e?it(t.buffer):t.buffer;return new t.constructor(r,t.byteOffset,t.byteLength)}var Cr=on;var an=/\w*$/;function sn(t){var e=new t.constructor(t.source,an.exec(t));return e.lastIndex=t.lastIndex,e}var Rr=sn;var Mr=T?T.prototype:void 0,Nr=Mr?Mr.valueOf:void 0;function nn(t){return Nr?Object(Nr.call(t)):{}}var Lr=nn;function fn(t,e){var r=e?it(t.buffer):t.buffer;return new t.constructor(r,t.byteOffset,t.length)}var Br=fn;var pn="[object Boolean]",ln="[object Date]",mn="[object Map]",un="[object Number]",dn="[object RegExp]",cn="[object Set]",hn="[object String]",xn="[object Symbol]",gn="[object ArrayBuffer]",yn="[object DataView]",bn="[object Float32Array]",vn="[object Float64Array]",Tn="[object Int8Array]",wn="[object Int16Array]",On="[object Int32Array]",An="[object Uint8Array]",jn="[object Uint8ClampedArray]",Pn="[object Uint16Array]",Sn="[object Uint32Array]";function In(t,e,r){var o=t.constructor;switch(e){case gn:return it(t);case pn:case ln:return new o(+t);case yn:return Cr(t,r);case bn:case vn:case Tn:case wn:case On:case An:case jn:case Pn:case Sn:return Br(t,r);case mn:return new o;case un:case hn:return new o(t);case dn:return Rr(t);case cn:return new o;case xn:return Lr(t)}}var kr=In;function _n(t){return typeof t.constructor=="function"&&!H(t)?pe(wt(t)):{}}var Dr=_n;var En="[object Map]";function Fn(t){return P(t)&&at(t)==En}var Ur=Fn;var zr=F&&F.isMap,Cn=zr?V(zr):Ur,Kr=Cn;var Rn="[object Set]";function Mn(t){return P(t)&&at(t)==Rn}var Gr=Mn;var Wr=F&&F.isSet,Nn=Wr?V(Wr):Gr,$r=Nn;var Ln=1,Bn=2,kn=4,Hr="[object Arguments]",Dn="[object Array]",Un="[object Boolean]",zn="[object Date]",Kn="[object Error]",qr="[object Function]",Gn="[object GeneratorFunction]",Wn="[object Map]",$n="[object Number]",Vr="[object Object]",Hn="[object RegExp]",qn="[object Set]",Vn="[object String]",Yn="[object Symbol]",Zn="[object WeakMap]",Jn="[object ArrayBuffer]",Xn="[object DataView]",Qn="[object Float32Array]",tf="[object Float64Array]",ef="[object Int8Array]",rf="[object Int16Array]",of="[object Int32Array]",af="[object Uint8Array]",sf="[object Uint8ClampedArray]",nf="[object Uint16Array]",ff="[object Uint32Array]",d={};d[Hr]=d[Dn]=d[Jn]=d[Xn]=d[Un]=d[zn]=d[Qn]=d[tf]=d[ef]=d[rf]=d[of]=d[Wn]=d[$n]=d[Vr]=d[Hn]=d[qn]=d[Vn]=d[Yn]=d[af]=d[sf]=d[nf]=d[ff]=!0;d[Kn]=d[qr]=d[Zn]=!1;function _t(t,e,r,o,a,s){var n,i=e&Ln,f=e&Bn,m=e&kn;if(r&&(n=a?r(t,o,a,s):r(t)),n!==void 0)return n;if(!j(t))return t;var h=v(t);if(h){if(n=Fr(t),!i)return me(t,n)}else{var b=at(t),A=b==qr||b==Gn;if(bt(t))return br(t,i);if(b==Vr||b==Hr||A&&!a){if(n=f||A?{}:Dr(t),!i)return f?Or(t,cr(n,t)):wr(t,dr(n,t))}else{if(!d[b])return a?t:{};n=kr(t,b,i)}}s||(s=new ur);var w=s.get(t);if(w)return w;s.set(t,n),$r(t)?t.forEach(function(y){n.add(_t(y,e,r,y,t,s))}):Kr(t)&&t.forEach(function(y,p){n.set(p,_t(y,e,r,p,t,s))});var g=m?f?jr:Ar:f?Z:Y,I=h?void 0:g(t);return xe(I||t,function(y,p){I&&(p=y,y=t[p]),W(n,p,_t(y,e,r,p,t,s))}),n}var Yr=_t;var pf=1,lf=4;function mf(t){return Yr(t,pf|lf)}var Bt=mf;function uf(t,e){return t!=null&&e in Object(t)}var Zr=uf;function df(t,e,r){e=k(e,t);for(var o=-1,a=e.length,s=!1;++o<a;){var n=tt(e[o]);if(!(s=t!=null&&r(t,n)))break;t=t[n]}return s||++o!=a?s:(a=t==null?0:t.length,!!a&&$(a)&&G(n,a)&&(v(t)||q(t)))}var Jr=df;function cf(t,e){return t!=null&&Jr(t,e,Zr)}var Xr=cf;function hf(t,e,r,o){if(!j(t))return t;e=k(e,t);for(var a=-1,s=e.length,n=s-1,i=t;i!=null&&++a<s;){var f=tt(e[a]),m=r;if(f==="__proto__"||f==="constructor"||f==="prototype")return t;if(a!=n){var h=i[f];m=o?o(h,f,i):void 0,m===void 0&&(m=j(h)?h:G(e[a+1])?[]:{})}W(i,f,m),i=i[f]}return t}var Qr=hf;function xf(t,e,r){for(var o=-1,a=e.length,s={};++o<a;){var n=e[o],i=tr(t,n);r(i,n)&&Qr(s,k(n,t),i)}return s}var to=xf;function gf(t,e){return to(t,e,function(r,o){return Xr(t,o)})}var eo=gf;var yf=sr(function(t,e){return t==null?{}:eo(t,e)}),Et=yf;function ro(t){return{all:t=t||new Map,on:function(e,r){var o=t.get(e);o?o.push(r):t.set(e,[r])},off:function(e,r){var o=t.get(e);o&&(r?o.splice(o.indexOf(r)>>>0,1):t.set(e,[]))},emit:function(e,r){var o=t.get(e);o&&o.slice().map(function(a){a(r)}),(o=t.get("*"))&&o.slice().map(function(a){a(e,r)})}}}var oo="useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";var kt=(t=21)=>{let e="",r=crypto.getRandomValues(new Uint8Array(t));for(;t--;)e+=oo[r[t]&63];return e};var bf="array",vf="bit",ao="bits",Tf="byte",io="bytes",st="",wf="exponent",Of="function",so="iec",Af="Invalid number",jf="Invalid rounding method",Dt="jedec",Pf="object",no=".",Sf="round",If="s",_f="si",Ef="kbit",Ff="kB",Cf=" ",Rf="string",Mf="0",Ut={symbol:{iec:{bits:["bit","Kibit","Mibit","Gibit","Tibit","Pibit","Eibit","Zibit","Yibit"],bytes:["B","KiB","MiB","GiB","TiB","PiB","EiB","ZiB","YiB"]},jedec:{bits:["bit","Kbit","Mbit","Gbit","Tbit","Pbit","Ebit","Zbit","Ybit"],bytes:["B","KB","MB","GB","TB","PB","EB","ZB","YB"]}},fullform:{iec:["","kibi","mebi","gibi","tebi","pebi","exbi","zebi","yobi"],jedec:["","kilo","mega","giga","tera","peta","exa","zetta","yotta"]}};function fo(t,{bits:e=!1,pad:r=!1,base:o=-1,round:a=2,locale:s=st,localeOptions:n={},separator:i=st,spacer:f=Cf,symbols:m={},standard:h=st,output:b=Rf,fullform:A=!1,fullforms:w=[],exponent:g=-1,roundingMethod:I=Sf,precision:y=0}={}){let p=g,u=Number(t),l=[],_=0,Ft=st;h===_f?(o=10,h=Dt):h===so||h===Dt?o=2:o===2?h=so:(o=10,h=Dt);let mt=o===10?1e3:1024,po=A===!0,Kt=u<0,Gt=Math[I];if(typeof t!="bigint"&&isNaN(t))throw new TypeError(Af);if(typeof Gt!==Of)throw new TypeError(jf);if(Kt&&(u=-u),(p===-1||isNaN(p))&&(p=Math.floor(Math.log(u)/Math.log(mt)),p<0&&(p=0)),p>8&&(y>0&&(y+=8-p),p=8),b===wf)return p;if(u===0)l[0]=0,Ft=l[1]=Ut.symbol[h][e?ao:io][p];else{_=u/(o===2?Math.pow(2,p*10):Math.pow(1e3,p)),e&&(_=_*8,_>=mt&&p<8&&(_=_/mt,p++));let nt=Math.pow(10,p>0?a:0);l[0]=Gt(_*nt)/nt,l[0]===mt&&p<8&&g===-1&&(l[0]=1,p++),Ft=l[1]=o===10&&p===1?e?Ef:Ff:Ut.symbol[h][e?ao:io][p]}if(Kt&&(l[0]=-l[0]),y>0&&(l[0]=l[0].toPrecision(y)),l[1]=m[l[1]]||l[1],s===!0?l[0]=l[0].toLocaleString():s.length>0?l[0]=l[0].toLocaleString(s,n):i.length>0&&(l[0]=l[0].toString().replace(no,i)),r&&Number.isInteger(l[0])===!1&&a>0){let nt=i||no,Wt=l[0].toString().split(nt),$t=Wt[1]||st,Ht=$t.length,lo=a-Ht;l[0]=`${Wt[0]}${nt}${$t.padEnd(Ht+lo,Mf)}`}return po&&(l[1]=w[p]?w[p]:Ut.fullform[h][p]+(e?vf:Tf)+(l[0]===1?st:If)),b===bf?l:b===Pf?{value:l[0],symbol:l[1],exponent:p,unit:Ft}:l.join(f)}var D=class t{_tera;id;name;icon;path;url;teraUrl;parsedName;created;createdFormatted;modified;modifiedFormatted;accessed;accessedFormatted;size;sizeFormatted;mime;meta={};constructor(e){if(!e.tera)throw new Error("Basic file requires a `tera` key to access the Tera instance");Object.assign(this,e);let r=this.tera;Object.defineProperty(this,"_tera",{enumerable:!1,configurable:!1,get(){return r}}),delete this.tera,this.teraUrl=this.url.replace(/^https:\/\/tera-tools.com\/projects\/(?:.+?)\/project\/(.+)$/,"/project/$1"),this.sizeFormatted=fo(this.size||0,{spacer:""}),this.createdFormatted=this.created?this.created.toLocaleDateString():"Unknown created date",this.modifiedFormatted=this.modified?this.modified.toLocaleDateString():"Unknown modified date",this.accessedFormatted=this.accessed?this.accessed.toLocaleDateString():"Unknown access date"}getContents(e){return this._tera.getProjectFileContents(this.id,e)}setContents(e){return this._tera.setProjectFile(this.id,e)}getRefs(){return this._tera.getProjectLibrary(this.id)}setRefs(e){return this._tera.setProjectLibrary(this.id,e)}serialize(){return Et(this,["id","name","icon","path","url","parsedName","created","modified","accessed","size","mime","meta"])}static deserialize(e){return new t(Et(e,["tera","id","name","icon","path","url","parsedName","created","modified","accessed","size","mime","meta"]))}};var zt=class{settings={devMode:!0,verbosity:1,mode:"detect",modeTimeout:300,modeFallback:"child",siteUrl:"https://tera-tools.com/embed",restrictOrigin:"*",frameSandbox:["allow-forms","allow-modals","allow-orientation-lock","allow-pointer-lock","allow-popups","allow-popups-to-escape-sandbox","allow-presentation","allow-same-origin","allow-scripts","allow-top-navigation"],handshakeInterval:1e3,handshakeTimeout:1e4};events=ro();dom={el:null,iframe:null,popup:null,stylesheet:null};methods=["handshake","setServerVerbosity","getUser","requireUser","bindProject","getProject","getProjects","setActiveProject","requireProject","selectProject","getProjectState","setProjectState","setProjectStateDefaults","setProjectStateFlush","setProjectStateRefresh","saveProjectState","replaceProjectState","applyProjectStatePatch","getProjectFileContents","deleteProjectFile","setProjectFile","selectProjectLibrary","getProjectLibrary","setProjectLibrary","projectLog","setPageUrl","setPageTitle","uiAlert","uiProgress","uiSplat","uiWindow"];plugins=[];send(e){let r=kt();return this.acceptPostboxes[r]={},this.acceptPostboxes[r].promise=new Promise((o,a)=>{Object.assign(this.acceptPostboxes[r],{resolve:o,reject:a}),this.sendRaw({id:r,...e})}),this.acceptPostboxes[r].promise}sendRaw(e){let r;try{if(r={TERA:1,id:e.id||kt(),...Bt(e)},this.settings.mode=="parent")window.parent.postMessage(r,this.settings.restrictOrigin);else if(this.settings.mode=="child")this.dom.iframe.contentWindow.postMessage(r,this.settings.restrictOrigin);else if(this.settings.mode=="popup")this.dom.popup.postMessage(r,this.settings.restrictOrigin);else throw this.settings.mode=="detect"?new Error("Call init() or detectMode() before trying to send data to determine the mode"):new Error(`Unknown TERA communication mode "${this.settings.mode}"`)}catch(o){throw this.debug("ERROR",1,"Message compose client->server:",o),this.debug("ERROR",1,"Attempted to dispatch payload client->server",r),o}}rpc(e,...r){return this.send({action:"rpc",method:e,args:r})}acceptMessage(e){if(e.origin==window.location.origin)return;let r=e.data;if(!(!r.TERA||!r.id))if(this.debug("INFO",3,"Recieved message",r),r?.action=="response"&&this.acceptPostboxes[r.id])r.isError===!0?this.acceptPostboxes[r.id].reject(r.response):this.acceptPostboxes[r.id].resolve(r.response);else{if(r?.action=="rpc")return Promise.resolve().then(()=>this[r.method].apply(this,r.args)).then(o=>this.sendRaw({id:r.id,action:"response",response:o})).catch(o=>{console.warn(`TERA-FY client threw on RPC:${r.method}:`,o),this.sendRaw({id:r.id,action:"response",isError:!0,response:o&&o.toString()})});if(r?.action=="event")return Promise.resolve().then(()=>this.events.emit(r.event,...r.payload)).catch(o=>{throw console.warn(`TERA-FY client threw while handling emitted event "${r.event}"`,{message:r}),o});r?.id?this.debug("INFO",3,`Ignoring message ID ${r.id} - was meant for someone else?`):this.debug("INFO",3,"Unexpected incoming TERA-FY CLIENT message",{message:r})}}acceptPostboxes={};createProjectStatePatch(e,r){let o=qt(r,e);return this.debug("INFO",3,"Created project patch",{patch:o,newState:e,oldState:r}),this.applyProjectStatePatch(o)}applyProjectStatePatchLocal(e){throw new Error("applyProjectStatePatchLocal() has not been sub-classed by a plugin")}constructor(e){e&&this.set(e)}init(e){if(e&&this.set(e),this.init.promise)return this.init.promise;window.addEventListener("message",this.acceptMessage.bind(this));let r=this;return this.init.promise=Promise.resolve().then(()=>this.debug("INFO",4,"[0/6] Init using server",this.settings.siteUrl)).then(()=>this.detectMode()).then(o=>{this.debug("INFO",4,"[1/6] Setting client mode to",o),this.settings.mode=o}).then(()=>this.debug("INFO",4,"[2/6] Injecting comms + styles + methods")).then(()=>Promise.all([this.injectComms(),this.injectStylesheet(),this.injectMethods()])).then(()=>{if(this.settings.verbosity<=1){this.debug("INFO",4,"[3/6] Skip - Server verbosity is already at 1");return}else return this.debug("INFO",4,`[3/6] Set server verbosity to ${this.settings.verbosity}`),this.rpc("setServerVerbosity",this.settings.verbosity)}).then(()=>this.debug("INFO",4,`[4/6] Set server mode to "${this.settings.mode}"`)).then(()=>this.rpc("setServerMode",this.settings.mode=="child"?"embedded":this.settings.mode=="parent"?"frame":this.settings.mode=="popup"?"popup":(()=>{throw`Unknown server mode "${this.settings.mode}"`})())).then(()=>this.debug("INFO",4,"[5/6] Run client plugins")).then(()=>Promise.all(this.plugins.map(o=>o.init.call(r,this.settings)))).then(()=>this.debug("INFO",4,"[6/6] Init complete")).catch(o=>this.debug("WARN",0,"Init process fault",o))}detectMode(){return this.settings.mode!="detect"?Promise.resolve(this.settings.mode):window.self===window.parent?Promise.resolve(this.settings.modeFallback):Promise.resolve().then(()=>this.settings.mode="parent").then(()=>new Promise((e,r)=>{let o=setTimeout(()=>r(),this.settings.modeTimeout);this.rpc("handshake").then(()=>clearTimeout(o)).then(()=>e())})).then(()=>"parent").catch(()=>this.settings.modeFallback)}injectComms(){switch(this.settings.mode){case"child":return Promise.resolve().then(()=>new Promise(e=>{this.debug("INFO",2,"Injecting TERA site as iFrame child"),this.dom.el=document.createElement("div"),this.dom.el.id="tera-fy",this.dom.el.classList.toggle("dev-mode",this.settings.devMode),this.dom.el.classList.add("minimized"),document.body.append(this.dom.el),this.dom.el.addEventListener("click",()=>this.dom.el.classList.toggle("minimized")),this.dom.iframe=document.createElement("iframe"),this.dom.iframe.setAttribute("sandbox",this.settings.frameSandbox.join(" ")),this.dom.iframe.addEventListener("load",()=>{this.debug("INFO",3,"Embeded iframe ready"),e()}),this.dom.iframe.src=this.settings.siteUrl,this.dom.el.append(this.dom.iframe)})).then(()=>this.handshakeLoop());case"parent":this.debug("INFO",2,"Using TERA window parent");break;case"popup":return this.debug("INFO",2,"Injecting TERA site as a popup window"),this.dom.popup=window.open(this.settings.siteUrl,"_blank","popup=1, location=0, menubar=0, status=0, scrollbars=0, width=500, height=600"),this.handshakeLoop().then(()=>this.debug("INFO",3,"Popup window accepted handshake"));default:throw new Error(`Unsupported mode "${this.settings.mode}" when calling injectComms()`)}}handshakeLoop(e){let r={handshakeInterval:this.settings.handshakeInterval,handshakeTimeout:this.settings.handshakeTimeout,...e};return new Promise((o,a)=>{let s=0,n,i=setTimeout(()=>a("TIMEOUT"),r.handshakeTimeout),f=()=>{this.debug("INFO",4,"Trying handshake",++s),clearTimeout(n),n=setTimeout(f,r.handshakeInterval),this.rpc("handshake").then(()=>{clearTimeout(i),clearTimeout(n)}).then(()=>o()).catch(a)};f()})}injectStylesheet(){switch(this.settings.mode){case"child":this.dom.stylesheet=document.createElement("style"),this.dom.stylesheet.innerHTML=[":root {","--TERA-accent: #4d659c;","}","#tera-fy {","display: none;","position: fixed;","right: 50px;","bottom: 50px;","width: 300px;","height: 150px;","background: transparent;","&.minimized.dev-mode {","background: var(--TERA-accent) !important;","opacity: 0.5;","right: 0px;","bottom: 0px;","width: 30px;","height: 30px;","transition: opacity 0.2s ease-out;","cursor: pointer;","border: none;","border-top-left-radius: 30px;","border-top: 2px solid var(--TERA-accent);","border-left: 2px solid var(--TERA-accent);","display: flex;","justify-content: center;","align-items: center;","&::before {","margin: 2px 0 0 0;",'content: "\u{1F300}";',"color: #FFF;","}","&:hover {","opacity: 1;","}","& > iframe {","display: none;","}","}","&:not(.minimized) {","&::before {","display: flex;","align-items: center;","justify-content: center;","cursor: pointer;","background: var(--TERA-accent) !important;","opacity: 0.5;","transition: opacity 0.2s ease-out;","position: absolute;","right: 0px;","bottom: 0px;","width: 20px;","height: 20px;","margin: 2px 0 0 0;",'content: "\u2B68";',"color: #FFF;","border: none;","border-top-left-radius: 30px;","border-top: 2px solid var(--TERA-accent);","border-left: 2px solid var(--TERA-accent);","}","&:hover::before {","opacity: 1;","}","}","&.dev-mode {","display: flex;","border: 5px solid var(--TERA-accent);","background: #FFF;","}","& > iframe {","width: 100%;","height: 100%;","}","}","body.tera-fy-focus {","overflow: hidden;","& #tera-fy {","display: flex !important;","position: fixed !important;","top: 0px !important;","width: 100vw !important;","height: 100vh !important;","left: 0px !important;","z-index: 10000 !important;","}","}"].join(`
`),document.head.appendChild(this.dom.stylesheet);break;case"parent":case"popup":break;default:throw new Error(`Unsupported mode "${this.settings.mode}" when injectStylesheet()`)}return Promise.resolve()}injectMethods(){this.methods.forEach(e=>this[e]=this.rpc.bind(this,e))}debug(...e){if(!this.settings.devMode||this.settings.verbosity<1)return;let r="log",o=1;typeof e[0]=="string"&&["INFO","LOG","WARN","ERROR"].includes(e[0])&&(r=e.shift().toLowerCase()),typeof e[0]=="number"&&(o=e[0],e.shift()),!(this.settings.verbosity<o)&&console[r]("%c[TERA-FY CLIENT]","font-weight: bold; color: #ff5722;",...e)}set(e,r,o){let a={ignoreNullish:!0,...o};return typeof e=="string"?(!a.ignoreNullish||r!=null)&&(this.settings[e]=r):Object.assign(this.settings,e),this.toggleDevMode(this.settings.devMode)}setIfDev(e,r,o){return!this.settings.devMode||r===void 0?this:this.set(e,r,o)}use(e,r){if(typeof e!="function")throw new Error("Expected use() call to be provided with a class initalizer");let o=new e(this,r);return this.mixin(this,o),this.plugins.push(o),this}mixin(e,r){Object.getOwnPropertyNames(Object.getPrototypeOf(r)).filter(o=>!["constructor","prototype","name"].includes(o)).filter(o=>o!="init").forEach(o=>{Object.defineProperty(e,o,{value:r[o].bind(e),enumerable:!1})})}toggleDevMode(e="toggle"){return e==="toggle"?this.settings.devMode=!this.settings.devMode:e==="proxy"?Object.assign(this.settings,{devMode:!0,siteUrl:"http://localhost:7334/embed",mode:"child"}):this.settings.devMode=!!e,this.dom.el&&this.dom.el.classList.toggle("dev-mode",this.settings.devMode),this}toggleFocus(e="toggle"){this.debug("INFO",2,"Request focus",{isFocused:e}),globalThis.document.body.classList.toggle("tera-fy-focus",e==="toggle"?void 0:e)}selectProjectFile(e){return this.rpc("selectProjectFile",e).then(r=>r&&new D({tera:this,...r}))}getProjectFiles(e){return this.rpc("getProjectFiles",e).then(r=>r.map(o=>new D({tera:this,...o})))}getProjectFile(e){return this.rpc("getProjectFile",e).then(r=>r&&new D({tera:this,...r}))}createProjectFile(e){return this.rpc("createProjectFile",e).then(r=>r&&new D({tera:this,...r}))}};export{zt as default};
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
   * @version 10.1.2
   *)
*/
