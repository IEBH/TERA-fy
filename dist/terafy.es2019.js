var mr=Object.defineProperty;var ur=(t,e,r)=>e in t?mr(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r;var F=(t,e,r)=>(ur(t,typeof e!="symbol"?e+"":e,r),r);function St(t,e,r){if(!t||typeof t!="object"||!e||typeof e!="object")throw new Error("both arguments must be objects or arrays");r||(r=function(s){return s});function o({obj1:s,obj2:p,basePath:m,basePathForRemoves:w,diffs:h}){var y=Object.keys(s),b=y.length,c=Object.keys(p),L=c.length,g,v=s.length-p.length;if(cr(s,p)){for(var d=0;d<b;d++){var D=Array.isArray(s)?Number(y[d]):y[d];D in p||(g=w.concat(D),h.remove.push({op:"remove",path:r(g)}))}for(var d=0;d<L;d++){var D=Array.isArray(p)?Number(c[d]):c[d];i({key:D,obj1:s,obj2:p,path:m.concat(D),pathForRemoves:m.concat(D),diffs:h})}}else{for(var d=0;d<v;d++)g=w.concat(d),h.remove.push({op:"remove",path:r(g)});for(var lr=s.slice(v),d=0;d<L;d++)i({key:d,obj1:lr,obj2:p,path:m.concat(d),pathForRemoves:m.concat(d+v),diffs:h})}}var a={remove:[],replace:[],add:[]};return o({obj1:t,obj2:e,basePath:[],basePathForRemoves:[],diffs:a}),a.remove.reverse().concat(a.replace).concat(a.add);function i({key:s,obj1:p,obj2:m,path:w,pathForRemoves:h,diffs:y}){var b=p[s],c=m[s];if(!(s in p)&&s in m){var L=c;y.add.push({op:"add",path:r(w),value:L})}else b!==c&&(Object(b)!==b||Object(c)!==c||dr(b,c)||!Object.keys(b).length&&!Object.keys(c).length&&String(b)!=String(c)?f(w,y,c):o({obj1:p[s],obj2:m[s],basePath:w,basePathForRemoves:h,diffs:y}))}function f(s,p,m){p.replace.push({op:"replace",path:r(s),value:m})}}function Pt(t){return[""].concat(t).join("/")}function dr(t,e){return Object.prototype.toString.call(t)!=Object.prototype.toString.call(e)}function cr(t,e){var r=t.length-e.length;if(Array.isArray(t)&&Array.isArray(e)&&r>0){for(var o=0,a=0,i=0;i<e.length&&String(t[i])===String(e[i]);i++)o++;for(var f=e.length;f>0&&String(t[f+r])===String(e[f]);f--)a++;return o>=a}return!0}var xr=typeof global=="object"&&global&&global.Object===Object&&global,Z=xr;var hr=typeof self=="object"&&self&&self.Object===Object&&self,gr=Z||hr||Function("return this")(),u=gr;var yr=u.Symbol,A=yr;var It=Object.prototype,br=It.hasOwnProperty,vr=It.toString,J=A?A.toStringTag:void 0;function wr(t){var e=br.call(t,J),r=t[J];try{t[J]=void 0;var o=!0}catch{}var a=vr.call(t);return o&&(e?t[J]=r:delete t[J]),a}var Ct=wr;var jr=Object.prototype,Tr=jr.toString;function Ar(t){return Tr.call(t)}var Et=Ar;var Or="[object Null]",_r="[object Undefined]",Mt=A?A.toStringTag:void 0;function Sr(t){return t==null?t===void 0?_r:Or:Mt&&Mt in Object(t)?Ct(t):Et(t)}var O=Sr;function Pr(t){return t!=null&&typeof t=="object"}var j=Pr;var Ir=Array.isArray,k=Ir;function Cr(t){var e=typeof t;return t!=null&&(e=="object"||e=="function")}var T=Cr;var Er="[object AsyncFunction]",Mr="[object Function]",Rr="[object GeneratorFunction]",Lr="[object Proxy]";function Fr(t){if(!T(t))return!1;var e=O(t);return e==Mr||e==Rr||e==Er||e==Lr}var Q=Fr;var Br=u["__core-js_shared__"],tt=Br;var Rt=function(){var t=/[^.]+$/.exec(tt&&tt.keys&&tt.keys.IE_PROTO||"");return t?"Symbol(src)_1."+t:""}();function Dr(t){return!!Rt&&Rt in t}var Lt=Dr;var kr=Function.prototype,Ur=kr.toString;function Nr(t){if(t!=null){try{return Ur.call(t)}catch{}try{return t+""}catch{}}return""}var _=Nr;var Wr=/[\\^$.*+?()[\]{}|]/g,Gr=/^\[object .+?Constructor\]$/,Kr=Function.prototype,zr=Object.prototype,Hr=Kr.toString,Vr=zr.hasOwnProperty,qr=RegExp("^"+Hr.call(Vr).replace(Wr,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");function $r(t){if(!T(t)||Lt(t))return!1;var e=Q(t)?qr:Gr;return e.test(_(t))}var Ft=$r;function Yr(t,e){return t==null?void 0:t[e]}var Bt=Yr;function Jr(t,e){var r=Bt(t,e);return Ft(r)?r:void 0}var x=Jr;var Xr=x(u,"WeakMap"),et=Xr;var Dt=Object.create,Zr=function(){function t(){}return function(e){if(!T(e))return{};if(Dt)return Dt(e);t.prototype=e;var r=new t;return t.prototype=void 0,r}}(),kt=Zr;function Qr(t,e){var r=-1,o=t.length;for(e||(e=Array(o));++r<o;)e[r]=t[r];return e}var Ut=Qr;var to=function(){try{var t=x(Object,"defineProperty");return t({},"",{}),t}catch{}}(),bt=to;function eo(t,e){for(var r=-1,o=t==null?0:t.length;++r<o&&e(t[r],r,t)!==!1;);return t}var Nt=eo;var ro=9007199254740991,oo=/^(?:0|[1-9]\d*)$/;function ao(t,e){var r=typeof t;return e=e==null?ro:e,!!e&&(r=="number"||r!="symbol"&&oo.test(t))&&t>-1&&t%1==0&&t<e}var Wt=ao;function so(t,e,r){e=="__proto__"&&bt?bt(t,e,{configurable:!0,enumerable:!0,value:r,writable:!0}):t[e]=r}var rt=so;function fo(t,e){return t===e||t!==t&&e!==e}var ot=fo;var io=Object.prototype,no=io.hasOwnProperty;function po(t,e,r){var o=t[e];(!(no.call(t,e)&&ot(o,r))||r===void 0&&!(e in t))&&rt(t,e,r)}var at=po;function lo(t,e,r,o){var a=!r;r||(r={});for(var i=-1,f=e.length;++i<f;){var s=e[i],p=o?o(r[s],t[s],s,r,t):void 0;p===void 0&&(p=t[s]),a?rt(r,s,p):at(r,s,p)}return r}var I=lo;var mo=9007199254740991;function uo(t){return typeof t=="number"&&t>-1&&t%1==0&&t<=mo}var st=uo;function co(t){return t!=null&&st(t.length)&&!Q(t)}var ft=co;var xo=Object.prototype;function ho(t){var e=t&&t.constructor,r=typeof e=="function"&&e.prototype||xo;return t===r}var U=ho;function go(t,e){for(var r=-1,o=Array(t);++r<t;)o[r]=e(r);return o}var Gt=go;var yo="[object Arguments]";function bo(t){return j(t)&&O(t)==yo}var vt=bo;var Kt=Object.prototype,vo=Kt.hasOwnProperty,wo=Kt.propertyIsEnumerable,jo=vt(function(){return arguments}())?vt:function(t){return j(t)&&vo.call(t,"callee")&&!wo.call(t,"callee")},zt=jo;function To(){return!1}var Ht=To;var $t=typeof exports=="object"&&exports&&!exports.nodeType&&exports,Vt=$t&&typeof module=="object"&&module&&!module.nodeType&&module,Ao=Vt&&Vt.exports===$t,qt=Ao?u.Buffer:void 0,Oo=qt?qt.isBuffer:void 0,_o=Oo||Ht,it=_o;var So="[object Arguments]",Po="[object Array]",Io="[object Boolean]",Co="[object Date]",Eo="[object Error]",Mo="[object Function]",Ro="[object Map]",Lo="[object Number]",Fo="[object Object]",Bo="[object RegExp]",Do="[object Set]",ko="[object String]",Uo="[object WeakMap]",No="[object ArrayBuffer]",Wo="[object DataView]",Go="[object Float32Array]",Ko="[object Float64Array]",zo="[object Int8Array]",Ho="[object Int16Array]",Vo="[object Int32Array]",qo="[object Uint8Array]",$o="[object Uint8ClampedArray]",Yo="[object Uint16Array]",Jo="[object Uint32Array]",l={};l[Go]=l[Ko]=l[zo]=l[Ho]=l[Vo]=l[qo]=l[$o]=l[Yo]=l[Jo]=!0;l[So]=l[Po]=l[No]=l[Io]=l[Wo]=l[Co]=l[Eo]=l[Mo]=l[Ro]=l[Lo]=l[Fo]=l[Bo]=l[Do]=l[ko]=l[Uo]=!1;function Xo(t){return j(t)&&st(t.length)&&!!l[O(t)]}var Yt=Xo;function Zo(t){return function(e){return t(e)}}var N=Zo;var Jt=typeof exports=="object"&&exports&&!exports.nodeType&&exports,X=Jt&&typeof module=="object"&&module&&!module.nodeType&&module,Qo=X&&X.exports===Jt,wt=Qo&&Z.process,ta=function(){try{var t=X&&X.require&&X.require("util").types;return t||wt&&wt.binding&&wt.binding("util")}catch{}}(),S=ta;var Xt=S&&S.isTypedArray,ea=Xt?N(Xt):Yt,Zt=ea;var ra=Object.prototype,oa=ra.hasOwnProperty;function aa(t,e){var r=k(t),o=!r&&zt(t),a=!r&&!o&&it(t),i=!r&&!o&&!a&&Zt(t),f=r||o||a||i,s=f?Gt(t.length,String):[],p=s.length;for(var m in t)(e||oa.call(t,m))&&!(f&&(m=="length"||a&&(m=="offset"||m=="parent")||i&&(m=="buffer"||m=="byteLength"||m=="byteOffset")||Wt(m,p)))&&s.push(m);return s}var nt=aa;function sa(t,e){return function(r){return t(e(r))}}var pt=sa;var fa=pt(Object.keys,Object),Qt=fa;var ia=Object.prototype,na=ia.hasOwnProperty;function pa(t){if(!U(t))return Qt(t);var e=[];for(var r in Object(t))na.call(t,r)&&r!="constructor"&&e.push(r);return e}var te=pa;function la(t){return ft(t)?nt(t):te(t)}var W=la;function ma(t){var e=[];if(t!=null)for(var r in Object(t))e.push(r);return e}var ee=ma;var ua=Object.prototype,da=ua.hasOwnProperty;function ca(t){if(!T(t))return ee(t);var e=U(t),r=[];for(var o in t)o=="constructor"&&(e||!da.call(t,o))||r.push(o);return r}var re=ca;function xa(t){return ft(t)?nt(t,!0):re(t)}var G=xa;var ha=x(Object,"create"),P=ha;function ga(){this.__data__=P?P(null):{},this.size=0}var oe=ga;function ya(t){var e=this.has(t)&&delete this.__data__[t];return this.size-=e?1:0,e}var ae=ya;var ba="__lodash_hash_undefined__",va=Object.prototype,wa=va.hasOwnProperty;function ja(t){var e=this.__data__;if(P){var r=e[t];return r===ba?void 0:r}return wa.call(e,t)?e[t]:void 0}var se=ja;var Ta=Object.prototype,Aa=Ta.hasOwnProperty;function Oa(t){var e=this.__data__;return P?e[t]!==void 0:Aa.call(e,t)}var fe=Oa;var _a="__lodash_hash_undefined__";function Sa(t,e){var r=this.__data__;return this.size+=this.has(t)?0:1,r[t]=P&&e===void 0?_a:e,this}var ie=Sa;function K(t){var e=-1,r=t==null?0:t.length;for(this.clear();++e<r;){var o=t[e];this.set(o[0],o[1])}}K.prototype.clear=oe;K.prototype.delete=ae;K.prototype.get=se;K.prototype.has=fe;K.prototype.set=ie;var jt=K;function Pa(){this.__data__=[],this.size=0}var ne=Pa;function Ia(t,e){for(var r=t.length;r--;)if(ot(t[r][0],e))return r;return-1}var C=Ia;var Ca=Array.prototype,Ea=Ca.splice;function Ma(t){var e=this.__data__,r=C(e,t);if(r<0)return!1;var o=e.length-1;return r==o?e.pop():Ea.call(e,r,1),--this.size,!0}var pe=Ma;function Ra(t){var e=this.__data__,r=C(e,t);return r<0?void 0:e[r][1]}var le=Ra;function La(t){return C(this.__data__,t)>-1}var me=La;function Fa(t,e){var r=this.__data__,o=C(r,t);return o<0?(++this.size,r.push([t,e])):r[o][1]=e,this}var ue=Fa;function z(t){var e=-1,r=t==null?0:t.length;for(this.clear();++e<r;){var o=t[e];this.set(o[0],o[1])}}z.prototype.clear=ne;z.prototype.delete=pe;z.prototype.get=le;z.prototype.has=me;z.prototype.set=ue;var E=z;var Ba=x(u,"Map"),M=Ba;function Da(){this.size=0,this.__data__={hash:new jt,map:new(M||E),string:new jt}}var de=Da;function ka(t){var e=typeof t;return e=="string"||e=="number"||e=="symbol"||e=="boolean"?t!=="__proto__":t===null}var ce=ka;function Ua(t,e){var r=t.__data__;return ce(e)?r[typeof e=="string"?"string":"hash"]:r.map}var R=Ua;function Na(t){var e=R(this,t).delete(t);return this.size-=e?1:0,e}var xe=Na;function Wa(t){return R(this,t).get(t)}var he=Wa;function Ga(t){return R(this,t).has(t)}var ge=Ga;function Ka(t,e){var r=R(this,t),o=r.size;return r.set(t,e),this.size+=r.size==o?0:1,this}var ye=Ka;function H(t){var e=-1,r=t==null?0:t.length;for(this.clear();++e<r;){var o=t[e];this.set(o[0],o[1])}}H.prototype.clear=de;H.prototype.delete=xe;H.prototype.get=he;H.prototype.has=ge;H.prototype.set=ye;var be=H;function za(t,e){for(var r=-1,o=e.length,a=t.length;++r<o;)t[a+r]=e[r];return t}var lt=za;var Ha=pt(Object.getPrototypeOf,Object),mt=Ha;function Va(){this.__data__=new E,this.size=0}var ve=Va;function qa(t){var e=this.__data__,r=e.delete(t);return this.size=e.size,r}var we=qa;function $a(t){return this.__data__.get(t)}var je=$a;function Ya(t){return this.__data__.has(t)}var Te=Ya;var Ja=200;function Xa(t,e){var r=this.__data__;if(r instanceof E){var o=r.__data__;if(!M||o.length<Ja-1)return o.push([t,e]),this.size=++r.size,this;r=this.__data__=new be(o)}return r.set(t,e),this.size=r.size,this}var Ae=Xa;function V(t){var e=this.__data__=new E(t);this.size=e.size}V.prototype.clear=ve;V.prototype.delete=we;V.prototype.get=je;V.prototype.has=Te;V.prototype.set=Ae;var Oe=V;function Za(t,e){return t&&I(e,W(e),t)}var _e=Za;function Qa(t,e){return t&&I(e,G(e),t)}var Se=Qa;var Ee=typeof exports=="object"&&exports&&!exports.nodeType&&exports,Pe=Ee&&typeof module=="object"&&module&&!module.nodeType&&module,ts=Pe&&Pe.exports===Ee,Ie=ts?u.Buffer:void 0,Ce=Ie?Ie.allocUnsafe:void 0;function es(t,e){if(e)return t.slice();var r=t.length,o=Ce?Ce(r):new t.constructor(r);return t.copy(o),o}var Me=es;function rs(t,e){for(var r=-1,o=t==null?0:t.length,a=0,i=[];++r<o;){var f=t[r];e(f,r,t)&&(i[a++]=f)}return i}var Re=rs;function os(){return[]}var ut=os;var as=Object.prototype,ss=as.propertyIsEnumerable,Le=Object.getOwnPropertySymbols,fs=Le?function(t){return t==null?[]:(t=Object(t),Re(Le(t),function(e){return ss.call(t,e)}))}:ut,q=fs;function is(t,e){return I(t,q(t),e)}var Fe=is;var ns=Object.getOwnPropertySymbols,ps=ns?function(t){for(var e=[];t;)lt(e,q(t)),t=mt(t);return e}:ut,dt=ps;function ls(t,e){return I(t,dt(t),e)}var Be=ls;function ms(t,e,r){var o=e(t);return k(t)?o:lt(o,r(t))}var ct=ms;function us(t){return ct(t,W,q)}var De=us;function ds(t){return ct(t,G,dt)}var ke=ds;var cs=x(u,"DataView"),xt=cs;var xs=x(u,"Promise"),ht=xs;var hs=x(u,"Set"),gt=hs;var Ue="[object Map]",gs="[object Object]",Ne="[object Promise]",We="[object Set]",Ge="[object WeakMap]",Ke="[object DataView]",ys=_(xt),bs=_(M),vs=_(ht),ws=_(gt),js=_(et),B=O;(xt&&B(new xt(new ArrayBuffer(1)))!=Ke||M&&B(new M)!=Ue||ht&&B(ht.resolve())!=Ne||gt&&B(new gt)!=We||et&&B(new et)!=Ge)&&(B=function(t){var e=O(t),r=e==gs?t.constructor:void 0,o=r?_(r):"";if(o)switch(o){case ys:return Ke;case bs:return Ue;case vs:return Ne;case ws:return We;case js:return Ge}return e});var $=B;var Ts=Object.prototype,As=Ts.hasOwnProperty;function Os(t){var e=t.length,r=new t.constructor(e);return e&&typeof t[0]=="string"&&As.call(t,"index")&&(r.index=t.index,r.input=t.input),r}var ze=Os;var _s=u.Uint8Array,Tt=_s;function Ss(t){var e=new t.constructor(t.byteLength);return new Tt(e).set(new Tt(t)),e}var Y=Ss;function Ps(t,e){var r=e?Y(t.buffer):t.buffer;return new t.constructor(r,t.byteOffset,t.byteLength)}var He=Ps;var Is=/\w*$/;function Cs(t){var e=new t.constructor(t.source,Is.exec(t));return e.lastIndex=t.lastIndex,e}var Ve=Cs;var qe=A?A.prototype:void 0,$e=qe?qe.valueOf:void 0;function Es(t){return $e?Object($e.call(t)):{}}var Ye=Es;function Ms(t,e){var r=e?Y(t.buffer):t.buffer;return new t.constructor(r,t.byteOffset,t.length)}var Je=Ms;var Rs="[object Boolean]",Ls="[object Date]",Fs="[object Map]",Bs="[object Number]",Ds="[object RegExp]",ks="[object Set]",Us="[object String]",Ns="[object Symbol]",Ws="[object ArrayBuffer]",Gs="[object DataView]",Ks="[object Float32Array]",zs="[object Float64Array]",Hs="[object Int8Array]",Vs="[object Int16Array]",qs="[object Int32Array]",$s="[object Uint8Array]",Ys="[object Uint8ClampedArray]",Js="[object Uint16Array]",Xs="[object Uint32Array]";function Zs(t,e,r){var o=t.constructor;switch(e){case Ws:return Y(t);case Rs:case Ls:return new o(+t);case Gs:return He(t,r);case Ks:case zs:case Hs:case Vs:case qs:case $s:case Ys:case Js:case Xs:return Je(t,r);case Fs:return new o;case Bs:case Us:return new o(t);case Ds:return Ve(t);case ks:return new o;case Ns:return Ye(t)}}var Xe=Zs;function Qs(t){return typeof t.constructor=="function"&&!U(t)?kt(mt(t)):{}}var Ze=Qs;var tf="[object Map]";function ef(t){return j(t)&&$(t)==tf}var Qe=ef;var tr=S&&S.isMap,rf=tr?N(tr):Qe,er=rf;var of="[object Set]";function af(t){return j(t)&&$(t)==of}var rr=af;var or=S&&S.isSet,sf=or?N(or):rr,ar=sf;var ff=1,nf=2,pf=4,sr="[object Arguments]",lf="[object Array]",mf="[object Boolean]",uf="[object Date]",df="[object Error]",fr="[object Function]",cf="[object GeneratorFunction]",xf="[object Map]",hf="[object Number]",ir="[object Object]",gf="[object RegExp]",yf="[object Set]",bf="[object String]",vf="[object Symbol]",wf="[object WeakMap]",jf="[object ArrayBuffer]",Tf="[object DataView]",Af="[object Float32Array]",Of="[object Float64Array]",_f="[object Int8Array]",Sf="[object Int16Array]",Pf="[object Int32Array]",If="[object Uint8Array]",Cf="[object Uint8ClampedArray]",Ef="[object Uint16Array]",Mf="[object Uint32Array]",n={};n[sr]=n[lf]=n[jf]=n[Tf]=n[mf]=n[uf]=n[Af]=n[Of]=n[_f]=n[Sf]=n[Pf]=n[xf]=n[hf]=n[ir]=n[gf]=n[yf]=n[bf]=n[vf]=n[If]=n[Cf]=n[Ef]=n[Mf]=!0;n[df]=n[fr]=n[wf]=!1;function yt(t,e,r,o,a,i){var f,s=e&ff,p=e&nf,m=e&pf;if(r&&(f=a?r(t,o,a,i):r(t)),f!==void 0)return f;if(!T(t))return t;var w=k(t);if(w){if(f=ze(t),!s)return Ut(t,f)}else{var h=$(t),y=h==fr||h==cf;if(it(t))return Me(t,s);if(h==ir||h==sr||y&&!a){if(f=p||y?{}:Ze(t),!s)return p?Be(t,Se(f,t)):Fe(t,_e(f,t))}else{if(!n[h])return a?t:{};f=Xe(t,h,s)}}i||(i=new Oe);var b=i.get(t);if(b)return b;i.set(t,f),ar(t)?t.forEach(function(g){f.add(yt(g,e,r,g,t,i))}):er(t)&&t.forEach(function(g,v){f.set(v,yt(g,e,r,v,t,i))});var c=m?p?ke:De:p?G:W,L=w?void 0:c(t);return Nt(L||t,function(g,v){L&&(v=g,g=t[v]),at(f,v,yt(g,e,r,v,t,i))}),f}var nr=yt;var Rf=1,Lf=4;function Ff(t){return nr(t,Rf|Lf)}var At=Ff;function pr(t){return{all:t=t||new Map,on:function(e,r){var o=t.get(e);o?o.push(r):t.set(e,[r])},off:function(e,r){var o=t.get(e);o&&(r?o.splice(o.indexOf(r)>>>0,1):t.set(e,[]))},emit:function(e,r){var o=t.get(e);o&&o.slice().map(function(a){a(r)}),(o=t.get("*"))&&o.slice().map(function(a){a(e,r)})}}}var Ot=(t=21)=>crypto.getRandomValues(new Uint8Array(t)).reduce((e,r)=>(r&=63,r<36?e+=r.toString(36):r<62?e+=(r-26).toString(36).toUpperCase():r>62?e+="-":e+="_",e),"");var _t=class{constructor(e){F(this,"settings",{devMode:!0,mode:"detect",modeTimeout:300,modeFallback:"child",siteUrl:"https://tera-tools.com/embed",restrictOrigin:"*",frameSandbox:["allow-forms","allow-modals","allow-orientation-lock","allow-pointer-lock","allow-popups","allow-popups-to-escape-sandbox","allow-presentation","allow-same-origin","allow-scripts","allow-top-navigation"],handshakeInterval:1e3});F(this,"events",pr());F(this,"dom",{el:null,iframe:null,popup:null,stylesheet:null});F(this,"methods",["handshake","getUser","requireUser","bindProject","getProject","getProjects","setActiveProject","requireProject","selectProject","getProjectState","setProjectState","setProjectStateDefaults","saveProjectState","replaceProjectState","applyProjectStatePatch","selectProjectFile","getProjectFiles","selectProjectLibrary","parseProjectLibrary","setProjectLibrary","uiAlert","uiSplat","uiWindow"]);F(this,"plugins",[]);F(this,"acceptPostboxes",{});e&&this.set(e)}send(e){let r=Ot();return this.acceptPostboxes[r]={},this.acceptPostboxes[r].promise=new Promise((o,a)=>{Object.assign(this.acceptPostboxes[r],{resolve:o,reject:a}),this.sendRaw({id:r,...e})}),this.acceptPostboxes[r].promise}sendRaw(e){let r;try{if(r={TERA:1,id:e.id||Ot(),...At(e)},this.settings.mode=="parent")window.parent.postMessage(r,this.settings.restrictOrigin);else if(this.settings.mode=="child")this.dom.iframe.contentWindow.postMessage(r,this.settings.restrictOrigin);else if(this.settings.mode=="popup")this.dom.popup.postMessage(r,this.settings.restrictOrigin);else throw this.settings.mode=="detect"?new Error("Call init() or detectMode() before trying to send data to determine the mode"):new Error(`Unknown TERA communication mode "${this.settings.mode}"`)}catch(o){throw this.debug("ERROR","Message compose client->server:",o),this.debug("ERROR","Attempted to dispatch payload client->server",r),o}}rpc(e,...r){return this.send({action:"rpc",method:e,args:r})}acceptMessage(e){if(e.origin==window.location.origin)return;let r=e.data;if(!(!r.TERA||!r.id))if(this.debug("Recieved",r),(r==null?void 0:r.action)=="response"&&this.acceptPostboxes[r.id])r.isError===!0?this.acceptPostboxes[r.id].reject(r.response):this.acceptPostboxes[r.id].resolve(r.response);else{if((r==null?void 0:r.action)=="rpc")return Promise.resolve().then(()=>this[r.method].apply(this,r.args)).then(o=>this.sendRaw({id:r.id,action:"response",response:o})).catch(o=>{console.warn(`TERA-FY client threw on RPC:${r.method}:`,o),this.sendRaw({id:r.id,action:"response",isError:!0,response:o.toString()})});if((r==null?void 0:r.action)=="event")return Promise.resolve().then(()=>this.events.emit(r.event,...r.payload)).catch(o=>{throw console.warn(`TERA-FY client threw while handling emitted event "${r.event}"`,{message:r}),o});r!=null&&r.id?this.debug(`Ignoring message ID ${r.id} - was meant for someone else?`):this.debug("Unexpected incoming TERA-FY CLIENT message",{message:r})}}createProjectStatePatch(e,r){let o=St(r,e,Pt);return this.debug("INFO","Created project patch",{newState:e,oldState:r}),this.applyProjectStatePatch(o)}applyProjectStatePatchLocal(e){throw new Error("applyProjectStatePatchLocal() has not been sub-classed by a plugin")}init(e){if(e&&this.set(e),this.init.promise)return this.init.promise;window.addEventListener("message",this.acceptMessage.bind(this));let r=this;return this.init.promise=Promise.resolve().then(()=>this.detectMode()).then(o=>this.settings.mode=o).then(()=>Promise.all([this.injectComms(),this.injectStylesheet(),this.injectMethods()])).then(()=>this.rpc("setServerMode",this.settings.mode=="child"?"embedded":this.settings.mode=="parent"?"frame":this.settings.mode=="popup"?"popup":(()=>{throw`Unknown server mode "${this.settings.mode}"`})())).then(()=>Promise.all(this.plugins.map(o=>o.init.call(r,this.settings))))}detectMode(){return this.settings.mode!="detect"?this.settings.mode:window.self===window.parent?this.settings.modeFallback:Promise.resolve().then(()=>this.settings.mode="parent").then(()=>new Promise((e,r)=>{let o=setTimeout(()=>r(),this.settings.modeTimeout);this.rpc("handshake").then(()=>clearTimeout(o)).then(()=>e())})).then(()=>"parent").catch(()=>this.settings.modeFallback)}injectComms(){return new Promise(e=>{switch(this.settings.mode){case"child":this.debug("Injecting TERA site as iFrame child"),this.dom.el=document.createElement("div"),this.dom.el.id="tera-fy",this.dom.el.classList.toggle("dev-mode",this.settings.devMode),document.body.append(this.dom.el),this.dom.iframe=document.createElement("iframe"),this.dom.iframe.setAttribute("sandbox",this.settings.frameSandbox.join(" ")),this.dom.iframe.addEventListener("load",()=>{this.debug("Embed frame ready"),e()}),this.dom.iframe.src=this.settings.siteUrl,this.dom.el.append(this.dom.iframe);break;case"parent":this.debug("Using TERA window parent"),e();break;case"popup":this.debug("Injecting TERA site as a popup window"),this.dom.popup=window.open(this.settings.siteUrl,"_blank","popup=1, location=0, menubar=0, status=0, scrollbars=0, width=500, height=600"),(()=>{let r=0,o,a=()=>{this.debug("Trying handshake",++r),clearTimeout(o),o=setTimeout(a,this.settings.handshakeInterval),this.rpc("handshake").then(()=>{clearTimeout(o),this.debug("Popup window accepted handshake"),e()})};a()})();break;default:throw new Error(`Unsupported mode "${this.settings.mode}" when calling injectComms()`)}})}injectStylesheet(){switch(this.settings.mode){case"child":this.dom.stylesheet=document.createElement("style"),this.dom.stylesheet.innerHTML=[":root {","--TERA-accent: #4d659c;","}","#tera-fy {","display: none;","position: fixed;","right: 50px;","bottom: 50px;","width: 300px;","height: 150px;","background: transparent;","&.dev-mode {","display: flex;","border: 5px solid var(--TERA-accent);","background: #FFF;","}","& > iframe {","width: 100%;","height: 100%;","}","}","body.tera-fy-focus {","overflow: hidden;","& #tera-fy {","display: flex !important;","position: fixed !important;","top: 0px !important;","width: 100vw !important;","height: 100vh !important;","left: 0px !important;","z-index: 10000 !important;","}","}"].join(`
`),document.head.appendChild(this.dom.stylesheet);break;case"parent":case"popup":break;default:throw new Error(`Unsupported mode "${this.settings.mode}" when injectStylesheet()`)}}injectMethods(){this.methods.forEach(e=>this[e]=this.rpc.bind(this,e))}debug(...e){let r="log";typeof e[0]=="string"&&["INFO","LOG","WARN","ERROR"].includes(e[0])&&(r=e.shift().toLowerCase()),!(["INFO","LOG"].includes(r)&&!this.settings.devMode)&&console[r]("%c[TERA-FY CLIENT]","font-weight: bold; color: #ff5722;",...e)}set(e,r){return typeof e=="string"?this.settings[e]=r:Object.assign(this.settings,e),this.toggleDevMode(this.settings.devMode)}setIfDev(e,r){return!this.settings.devMode||r===void 0?this:this.set(e,r)}use(e,r){if(typeof e!="function")throw new Error("Expected use() call to be provided with a class initalizer");let o=new e(this,r);return this.mixin(this,o),this.plugins.push(o),this}mixin(e,r){Object.getOwnPropertyNames(Object.getPrototypeOf(r)).filter(o=>!["constructor","prototype","name"].includes(o)).filter(o=>o!="init").forEach(o=>{Object.defineProperty(e,o,{value:r[o].bind(e),enumerable:!1})})}toggleDevMode(e="toggle"){return this.settings.devMode=e==="toggle"?!this.settings.devMode:e,this.dom.el&&this.dom.el.classList.toggle("dev-mode",this.settings.devMode),this}toggleFocus(e="toggle"){this.debug("Request focus",{isFocused:e}),globalThis.document.body.classList.toggle("tera-fy-focus",e==="toggle"?void 0:e)}};export{_t as default};
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
