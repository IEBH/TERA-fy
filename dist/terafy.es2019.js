var mr=Object.defineProperty;var ur=(t,e,r)=>e in t?mr(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r;var F=(t,e,r)=>(ur(t,typeof e!="symbol"?e+"":e,r),r);function St(t,e,r){if(!t||typeof t!="object"||!e||typeof e!="object")throw new Error("both arguments must be objects or arrays");r||(r=function(a){return a});function o({obj1:a,obj2:p,basePath:m,basePathForRemoves:j,diffs:h}){var y=Object.keys(a),b=y.length,c=Object.keys(p),L=c.length,g,v=a.length-p.length;if(cr(a,p)){for(var d=0;d<b;d++){var D=Array.isArray(a)?Number(y[d]):y[d];D in p||(g=j.concat(D),h.remove.push({op:"remove",path:r(g)}))}for(var d=0;d<L;d++){var D=Array.isArray(p)?Number(c[d]):c[d];i({key:D,obj1:a,obj2:p,path:m.concat(D),pathForRemoves:m.concat(D),diffs:h})}}else{for(var d=0;d<v;d++)g=j.concat(d),h.remove.push({op:"remove",path:r(g)});for(var lr=a.slice(v),d=0;d<L;d++)i({key:d,obj1:lr,obj2:p,path:m.concat(d),pathForRemoves:m.concat(d+v),diffs:h})}}var f={remove:[],replace:[],add:[]};return o({obj1:t,obj2:e,basePath:[],basePathForRemoves:[],diffs:f}),f.remove.reverse().concat(f.replace).concat(f.add);function i({key:a,obj1:p,obj2:m,path:j,pathForRemoves:h,diffs:y}){var b=p[a],c=m[a];if(!(a in p)&&a in m){var L=c;y.add.push({op:"add",path:r(j),value:L})}else b!==c&&(Object(b)!==b||Object(c)!==c||dr(b,c)||!Object.keys(b).length&&!Object.keys(c).length&&String(b)!=String(c)?s(j,y,c):o({obj1:p[a],obj2:m[a],basePath:j,basePathForRemoves:h,diffs:y}))}function s(a,p,m){p.replace.push({op:"replace",path:r(a),value:m})}}function Pt(t){return[""].concat(t).join("/")}function dr(t,e){return Object.prototype.toString.call(t)!=Object.prototype.toString.call(e)}function cr(t,e){var r=t.length-e.length;if(Array.isArray(t)&&Array.isArray(e)&&r>0){for(var o=0,f=0,i=0;i<e.length&&String(t[i])===String(e[i]);i++)o++;for(var s=e.length;s>0&&String(t[s+r])===String(e[s]);s--)f++;return o>=f}return!0}var xr=typeof global=="object"&&global&&global.Object===Object&&global,Z=xr;var hr=typeof self=="object"&&self&&self.Object===Object&&self,gr=Z||hr||Function("return this")(),u=gr;var yr=u.Symbol,A=yr;var It=Object.prototype,br=It.hasOwnProperty,vr=It.toString,J=A?A.toStringTag:void 0;function jr(t){var e=br.call(t,J),r=t[J];try{t[J]=void 0;var o=!0}catch{}var f=vr.call(t);return o&&(e?t[J]=r:delete t[J]),f}var Ct=jr;var wr=Object.prototype,Tr=wr.toString;function Ar(t){return Tr.call(t)}var Et=Ar;var Or="[object Null]",_r="[object Undefined]",Mt=A?A.toStringTag:void 0;function Sr(t){return t==null?t===void 0?_r:Or:Mt&&Mt in Object(t)?Ct(t):Et(t)}var O=Sr;function Pr(t){return t!=null&&typeof t=="object"}var w=Pr;var Ir=Array.isArray,N=Ir;function Cr(t){var e=typeof t;return t!=null&&(e=="object"||e=="function")}var T=Cr;var Er="[object AsyncFunction]",Mr="[object Function]",Rr="[object GeneratorFunction]",Lr="[object Proxy]";function Fr(t){if(!T(t))return!1;var e=O(t);return e==Mr||e==Rr||e==Er||e==Lr}var Q=Fr;var Br=u["__core-js_shared__"],tt=Br;var Rt=function(){var t=/[^.]+$/.exec(tt&&tt.keys&&tt.keys.IE_PROTO||"");return t?"Symbol(src)_1."+t:""}();function Dr(t){return!!Rt&&Rt in t}var Lt=Dr;var Nr=Function.prototype,Ur=Nr.toString;function Wr(t){if(t!=null){try{return Ur.call(t)}catch{}try{return t+""}catch{}}return""}var _=Wr;var kr=/[\\^$.*+?()[\]{}|]/g,Gr=/^\[object .+?Constructor\]$/,Kr=Function.prototype,zr=Object.prototype,Vr=Kr.toString,Hr=zr.hasOwnProperty,qr=RegExp("^"+Vr.call(Hr).replace(kr,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");function $r(t){if(!T(t)||Lt(t))return!1;var e=Q(t)?qr:Gr;return e.test(_(t))}var Ft=$r;function Yr(t,e){return t==null?void 0:t[e]}var Bt=Yr;function Jr(t,e){var r=Bt(t,e);return Ft(r)?r:void 0}var x=Jr;var Xr=x(u,"WeakMap"),et=Xr;var Dt=Object.create,Zr=function(){function t(){}return function(e){if(!T(e))return{};if(Dt)return Dt(e);t.prototype=e;var r=new t;return t.prototype=void 0,r}}(),Nt=Zr;function Qr(t,e){var r=-1,o=t.length;for(e||(e=Array(o));++r<o;)e[r]=t[r];return e}var Ut=Qr;var to=function(){try{var t=x(Object,"defineProperty");return t({},"",{}),t}catch{}}(),bt=to;function eo(t,e){for(var r=-1,o=t==null?0:t.length;++r<o&&e(t[r],r,t)!==!1;);return t}var Wt=eo;var ro=9007199254740991,oo=/^(?:0|[1-9]\d*)$/;function ao(t,e){var r=typeof t;return e=e==null?ro:e,!!e&&(r=="number"||r!="symbol"&&oo.test(t))&&t>-1&&t%1==0&&t<e}var kt=ao;function fo(t,e,r){e=="__proto__"&&bt?bt(t,e,{configurable:!0,enumerable:!0,value:r,writable:!0}):t[e]=r}var rt=fo;function so(t,e){return t===e||t!==t&&e!==e}var ot=so;var io=Object.prototype,no=io.hasOwnProperty;function po(t,e,r){var o=t[e];(!(no.call(t,e)&&ot(o,r))||r===void 0&&!(e in t))&&rt(t,e,r)}var at=po;function lo(t,e,r,o){var f=!r;r||(r={});for(var i=-1,s=e.length;++i<s;){var a=e[i],p=o?o(r[a],t[a],a,r,t):void 0;p===void 0&&(p=t[a]),f?rt(r,a,p):at(r,a,p)}return r}var I=lo;var mo=9007199254740991;function uo(t){return typeof t=="number"&&t>-1&&t%1==0&&t<=mo}var ft=uo;function co(t){return t!=null&&ft(t.length)&&!Q(t)}var st=co;var xo=Object.prototype;function ho(t){var e=t&&t.constructor,r=typeof e=="function"&&e.prototype||xo;return t===r}var U=ho;function go(t,e){for(var r=-1,o=Array(t);++r<t;)o[r]=e(r);return o}var Gt=go;var yo="[object Arguments]";function bo(t){return w(t)&&O(t)==yo}var vt=bo;var Kt=Object.prototype,vo=Kt.hasOwnProperty,jo=Kt.propertyIsEnumerable,wo=vt(function(){return arguments}())?vt:function(t){return w(t)&&vo.call(t,"callee")&&!jo.call(t,"callee")},zt=wo;function To(){return!1}var Vt=To;var $t=typeof exports=="object"&&exports&&!exports.nodeType&&exports,Ht=$t&&typeof module=="object"&&module&&!module.nodeType&&module,Ao=Ht&&Ht.exports===$t,qt=Ao?u.Buffer:void 0,Oo=qt?qt.isBuffer:void 0,_o=Oo||Vt,it=_o;var So="[object Arguments]",Po="[object Array]",Io="[object Boolean]",Co="[object Date]",Eo="[object Error]",Mo="[object Function]",Ro="[object Map]",Lo="[object Number]",Fo="[object Object]",Bo="[object RegExp]",Do="[object Set]",No="[object String]",Uo="[object WeakMap]",Wo="[object ArrayBuffer]",ko="[object DataView]",Go="[object Float32Array]",Ko="[object Float64Array]",zo="[object Int8Array]",Vo="[object Int16Array]",Ho="[object Int32Array]",qo="[object Uint8Array]",$o="[object Uint8ClampedArray]",Yo="[object Uint16Array]",Jo="[object Uint32Array]",l={};l[Go]=l[Ko]=l[zo]=l[Vo]=l[Ho]=l[qo]=l[$o]=l[Yo]=l[Jo]=!0;l[So]=l[Po]=l[Wo]=l[Io]=l[ko]=l[Co]=l[Eo]=l[Mo]=l[Ro]=l[Lo]=l[Fo]=l[Bo]=l[Do]=l[No]=l[Uo]=!1;function Xo(t){return w(t)&&ft(t.length)&&!!l[O(t)]}var Yt=Xo;function Zo(t){return function(e){return t(e)}}var W=Zo;var Jt=typeof exports=="object"&&exports&&!exports.nodeType&&exports,X=Jt&&typeof module=="object"&&module&&!module.nodeType&&module,Qo=X&&X.exports===Jt,jt=Qo&&Z.process,ta=function(){try{var t=X&&X.require&&X.require("util").types;return t||jt&&jt.binding&&jt.binding("util")}catch{}}(),S=ta;var Xt=S&&S.isTypedArray,ea=Xt?W(Xt):Yt,Zt=ea;var ra=Object.prototype,oa=ra.hasOwnProperty;function aa(t,e){var r=N(t),o=!r&&zt(t),f=!r&&!o&&it(t),i=!r&&!o&&!f&&Zt(t),s=r||o||f||i,a=s?Gt(t.length,String):[],p=a.length;for(var m in t)(e||oa.call(t,m))&&!(s&&(m=="length"||f&&(m=="offset"||m=="parent")||i&&(m=="buffer"||m=="byteLength"||m=="byteOffset")||kt(m,p)))&&a.push(m);return a}var nt=aa;function fa(t,e){return function(r){return t(e(r))}}var pt=fa;var sa=pt(Object.keys,Object),Qt=sa;var ia=Object.prototype,na=ia.hasOwnProperty;function pa(t){if(!U(t))return Qt(t);var e=[];for(var r in Object(t))na.call(t,r)&&r!="constructor"&&e.push(r);return e}var te=pa;function la(t){return st(t)?nt(t):te(t)}var k=la;function ma(t){var e=[];if(t!=null)for(var r in Object(t))e.push(r);return e}var ee=ma;var ua=Object.prototype,da=ua.hasOwnProperty;function ca(t){if(!T(t))return ee(t);var e=U(t),r=[];for(var o in t)o=="constructor"&&(e||!da.call(t,o))||r.push(o);return r}var re=ca;function xa(t){return st(t)?nt(t,!0):re(t)}var G=xa;var ha=x(Object,"create"),P=ha;function ga(){this.__data__=P?P(null):{},this.size=0}var oe=ga;function ya(t){var e=this.has(t)&&delete this.__data__[t];return this.size-=e?1:0,e}var ae=ya;var ba="__lodash_hash_undefined__",va=Object.prototype,ja=va.hasOwnProperty;function wa(t){var e=this.__data__;if(P){var r=e[t];return r===ba?void 0:r}return ja.call(e,t)?e[t]:void 0}var fe=wa;var Ta=Object.prototype,Aa=Ta.hasOwnProperty;function Oa(t){var e=this.__data__;return P?e[t]!==void 0:Aa.call(e,t)}var se=Oa;var _a="__lodash_hash_undefined__";function Sa(t,e){var r=this.__data__;return this.size+=this.has(t)?0:1,r[t]=P&&e===void 0?_a:e,this}var ie=Sa;function K(t){var e=-1,r=t==null?0:t.length;for(this.clear();++e<r;){var o=t[e];this.set(o[0],o[1])}}K.prototype.clear=oe;K.prototype.delete=ae;K.prototype.get=fe;K.prototype.has=se;K.prototype.set=ie;var wt=K;function Pa(){this.__data__=[],this.size=0}var ne=Pa;function Ia(t,e){for(var r=t.length;r--;)if(ot(t[r][0],e))return r;return-1}var C=Ia;var Ca=Array.prototype,Ea=Ca.splice;function Ma(t){var e=this.__data__,r=C(e,t);if(r<0)return!1;var o=e.length-1;return r==o?e.pop():Ea.call(e,r,1),--this.size,!0}var pe=Ma;function Ra(t){var e=this.__data__,r=C(e,t);return r<0?void 0:e[r][1]}var le=Ra;function La(t){return C(this.__data__,t)>-1}var me=La;function Fa(t,e){var r=this.__data__,o=C(r,t);return o<0?(++this.size,r.push([t,e])):r[o][1]=e,this}var ue=Fa;function z(t){var e=-1,r=t==null?0:t.length;for(this.clear();++e<r;){var o=t[e];this.set(o[0],o[1])}}z.prototype.clear=ne;z.prototype.delete=pe;z.prototype.get=le;z.prototype.has=me;z.prototype.set=ue;var E=z;var Ba=x(u,"Map"),M=Ba;function Da(){this.size=0,this.__data__={hash:new wt,map:new(M||E),string:new wt}}var de=Da;function Na(t){var e=typeof t;return e=="string"||e=="number"||e=="symbol"||e=="boolean"?t!=="__proto__":t===null}var ce=Na;function Ua(t,e){var r=t.__data__;return ce(e)?r[typeof e=="string"?"string":"hash"]:r.map}var R=Ua;function Wa(t){var e=R(this,t).delete(t);return this.size-=e?1:0,e}var xe=Wa;function ka(t){return R(this,t).get(t)}var he=ka;function Ga(t){return R(this,t).has(t)}var ge=Ga;function Ka(t,e){var r=R(this,t),o=r.size;return r.set(t,e),this.size+=r.size==o?0:1,this}var ye=Ka;function V(t){var e=-1,r=t==null?0:t.length;for(this.clear();++e<r;){var o=t[e];this.set(o[0],o[1])}}V.prototype.clear=de;V.prototype.delete=xe;V.prototype.get=he;V.prototype.has=ge;V.prototype.set=ye;var be=V;function za(t,e){for(var r=-1,o=e.length,f=t.length;++r<o;)t[f+r]=e[r];return t}var lt=za;var Va=pt(Object.getPrototypeOf,Object),mt=Va;function Ha(){this.__data__=new E,this.size=0}var ve=Ha;function qa(t){var e=this.__data__,r=e.delete(t);return this.size=e.size,r}var je=qa;function $a(t){return this.__data__.get(t)}var we=$a;function Ya(t){return this.__data__.has(t)}var Te=Ya;var Ja=200;function Xa(t,e){var r=this.__data__;if(r instanceof E){var o=r.__data__;if(!M||o.length<Ja-1)return o.push([t,e]),this.size=++r.size,this;r=this.__data__=new be(o)}return r.set(t,e),this.size=r.size,this}var Ae=Xa;function H(t){var e=this.__data__=new E(t);this.size=e.size}H.prototype.clear=ve;H.prototype.delete=je;H.prototype.get=we;H.prototype.has=Te;H.prototype.set=Ae;var Oe=H;function Za(t,e){return t&&I(e,k(e),t)}var _e=Za;function Qa(t,e){return t&&I(e,G(e),t)}var Se=Qa;var Ee=typeof exports=="object"&&exports&&!exports.nodeType&&exports,Pe=Ee&&typeof module=="object"&&module&&!module.nodeType&&module,tf=Pe&&Pe.exports===Ee,Ie=tf?u.Buffer:void 0,Ce=Ie?Ie.allocUnsafe:void 0;function ef(t,e){if(e)return t.slice();var r=t.length,o=Ce?Ce(r):new t.constructor(r);return t.copy(o),o}var Me=ef;function rf(t,e){for(var r=-1,o=t==null?0:t.length,f=0,i=[];++r<o;){var s=t[r];e(s,r,t)&&(i[f++]=s)}return i}var Re=rf;function of(){return[]}var ut=of;var af=Object.prototype,ff=af.propertyIsEnumerable,Le=Object.getOwnPropertySymbols,sf=Le?function(t){return t==null?[]:(t=Object(t),Re(Le(t),function(e){return ff.call(t,e)}))}:ut,q=sf;function nf(t,e){return I(t,q(t),e)}var Fe=nf;var pf=Object.getOwnPropertySymbols,lf=pf?function(t){for(var e=[];t;)lt(e,q(t)),t=mt(t);return e}:ut,dt=lf;function mf(t,e){return I(t,dt(t),e)}var Be=mf;function uf(t,e,r){var o=e(t);return N(t)?o:lt(o,r(t))}var ct=uf;function df(t){return ct(t,k,q)}var De=df;function cf(t){return ct(t,G,dt)}var Ne=cf;var xf=x(u,"DataView"),xt=xf;var hf=x(u,"Promise"),ht=hf;var gf=x(u,"Set"),gt=gf;var Ue="[object Map]",yf="[object Object]",We="[object Promise]",ke="[object Set]",Ge="[object WeakMap]",Ke="[object DataView]",bf=_(xt),vf=_(M),jf=_(ht),wf=_(gt),Tf=_(et),B=O;(xt&&B(new xt(new ArrayBuffer(1)))!=Ke||M&&B(new M)!=Ue||ht&&B(ht.resolve())!=We||gt&&B(new gt)!=ke||et&&B(new et)!=Ge)&&(B=function(t){var e=O(t),r=e==yf?t.constructor:void 0,o=r?_(r):"";if(o)switch(o){case bf:return Ke;case vf:return Ue;case jf:return We;case wf:return ke;case Tf:return Ge}return e});var $=B;var Af=Object.prototype,Of=Af.hasOwnProperty;function _f(t){var e=t.length,r=new t.constructor(e);return e&&typeof t[0]=="string"&&Of.call(t,"index")&&(r.index=t.index,r.input=t.input),r}var ze=_f;var Sf=u.Uint8Array,Tt=Sf;function Pf(t){var e=new t.constructor(t.byteLength);return new Tt(e).set(new Tt(t)),e}var Y=Pf;function If(t,e){var r=e?Y(t.buffer):t.buffer;return new t.constructor(r,t.byteOffset,t.byteLength)}var Ve=If;var Cf=/\w*$/;function Ef(t){var e=new t.constructor(t.source,Cf.exec(t));return e.lastIndex=t.lastIndex,e}var He=Ef;var qe=A?A.prototype:void 0,$e=qe?qe.valueOf:void 0;function Mf(t){return $e?Object($e.call(t)):{}}var Ye=Mf;function Rf(t,e){var r=e?Y(t.buffer):t.buffer;return new t.constructor(r,t.byteOffset,t.length)}var Je=Rf;var Lf="[object Boolean]",Ff="[object Date]",Bf="[object Map]",Df="[object Number]",Nf="[object RegExp]",Uf="[object Set]",Wf="[object String]",kf="[object Symbol]",Gf="[object ArrayBuffer]",Kf="[object DataView]",zf="[object Float32Array]",Vf="[object Float64Array]",Hf="[object Int8Array]",qf="[object Int16Array]",$f="[object Int32Array]",Yf="[object Uint8Array]",Jf="[object Uint8ClampedArray]",Xf="[object Uint16Array]",Zf="[object Uint32Array]";function Qf(t,e,r){var o=t.constructor;switch(e){case Gf:return Y(t);case Lf:case Ff:return new o(+t);case Kf:return Ve(t,r);case zf:case Vf:case Hf:case qf:case $f:case Yf:case Jf:case Xf:case Zf:return Je(t,r);case Bf:return new o;case Df:case Wf:return new o(t);case Nf:return He(t);case Uf:return new o;case kf:return Ye(t)}}var Xe=Qf;function ts(t){return typeof t.constructor=="function"&&!U(t)?Nt(mt(t)):{}}var Ze=ts;var es="[object Map]";function rs(t){return w(t)&&$(t)==es}var Qe=rs;var tr=S&&S.isMap,os=tr?W(tr):Qe,er=os;var as="[object Set]";function fs(t){return w(t)&&$(t)==as}var rr=fs;var or=S&&S.isSet,ss=or?W(or):rr,ar=ss;var is=1,ns=2,ps=4,fr="[object Arguments]",ls="[object Array]",ms="[object Boolean]",us="[object Date]",ds="[object Error]",sr="[object Function]",cs="[object GeneratorFunction]",xs="[object Map]",hs="[object Number]",ir="[object Object]",gs="[object RegExp]",ys="[object Set]",bs="[object String]",vs="[object Symbol]",js="[object WeakMap]",ws="[object ArrayBuffer]",Ts="[object DataView]",As="[object Float32Array]",Os="[object Float64Array]",_s="[object Int8Array]",Ss="[object Int16Array]",Ps="[object Int32Array]",Is="[object Uint8Array]",Cs="[object Uint8ClampedArray]",Es="[object Uint16Array]",Ms="[object Uint32Array]",n={};n[fr]=n[ls]=n[ws]=n[Ts]=n[ms]=n[us]=n[As]=n[Os]=n[_s]=n[Ss]=n[Ps]=n[xs]=n[hs]=n[ir]=n[gs]=n[ys]=n[bs]=n[vs]=n[Is]=n[Cs]=n[Es]=n[Ms]=!0;n[ds]=n[sr]=n[js]=!1;function yt(t,e,r,o,f,i){var s,a=e&is,p=e&ns,m=e&ps;if(r&&(s=f?r(t,o,f,i):r(t)),s!==void 0)return s;if(!T(t))return t;var j=N(t);if(j){if(s=ze(t),!a)return Ut(t,s)}else{var h=$(t),y=h==sr||h==cs;if(it(t))return Me(t,a);if(h==ir||h==fr||y&&!f){if(s=p||y?{}:Ze(t),!a)return p?Be(t,Se(s,t)):Fe(t,_e(s,t))}else{if(!n[h])return f?t:{};s=Xe(t,h,a)}}i||(i=new Oe);var b=i.get(t);if(b)return b;i.set(t,s),ar(t)?t.forEach(function(g){s.add(yt(g,e,r,g,t,i))}):er(t)&&t.forEach(function(g,v){s.set(v,yt(g,e,r,v,t,i))});var c=m?p?Ne:De:p?G:k,L=j?void 0:c(t);return Wt(L||t,function(g,v){L&&(v=g,g=t[v]),at(s,v,yt(g,e,r,v,t,i))}),s}var nr=yt;var Rs=1,Ls=4;function Fs(t){return nr(t,Rs|Ls)}var At=Fs;function pr(t){return{all:t=t||new Map,on:function(e,r){var o=t.get(e);o?o.push(r):t.set(e,[r])},off:function(e,r){var o=t.get(e);o&&(r?o.splice(o.indexOf(r)>>>0,1):t.set(e,[]))},emit:function(e,r){var o=t.get(e);o&&o.slice().map(function(f){f(r)}),(o=t.get("*"))&&o.slice().map(function(f){f(e,r)})}}}var Ot=(t=21)=>crypto.getRandomValues(new Uint8Array(t)).reduce((e,r)=>(r&=63,r<36?e+=r.toString(36):r<62?e+=(r-26).toString(36).toUpperCase():r>62?e+="-":e+="_",e),"");var _t=class{constructor(e){F(this,"settings",{devMode:!0,mode:"detect",modeTimeout:300,siteUrl:"https://tera-tools.com/embed",restrictOrigin:"*"});F(this,"events",pr());F(this,"dom",{el:null,iframe:null,stylesheet:null});F(this,"methods",["handshake","getUser","bindProject","getProject","getProjects","setActiveProject","requireProject","selectProject","getProjectState","setProjectState","setProjectStateDefaults","saveProjectState","replaceProjectState","applyProjectStatePatch","getProjectFiles","getProjectLibrary","setProjectLibrary"]);F(this,"plugins",[]);F(this,"acceptPostboxes",{});e&&this.set(e)}send(e){let r=Ot();return this.acceptPostboxes[r]={},this.acceptPostboxes[r].promise=new Promise((o,f)=>{Object.assign(this.acceptPostboxes[r],{resolve:o,reject:f}),this.sendRaw({id:r,...e})}),this.acceptPostboxes[r].promise}sendRaw(e){let r;try{if(r={TERA:1,id:e.id||Ot(),...At(e)},this.settings.mode=="parent")window.parent.postMessage(r,this.settings.restrictOrigin);else if(this.settings.mode=="child")this.dom.iframe.contentWindow.postMessage(r,this.settings.restrictOrigin);else throw this.settings.mode=="detect"?new Error("Call init() or detectMode() before trying to send data to determine the mode"):new Error(`Unknown TERA communication mode "${this.settings.mode}"`)}catch(o){throw this.debug("ERROR","Message compose client->server:",o),this.debug("ERROR","Attempted to dispatch payload client->server",r),o}}rpc(e,...r){return this.send({action:"rpc",method:e,args:r})}acceptMessage(e){if(e.origin==window.location.origin)return;let r=e.data;if(!(!r.TERA||!r.id))if(this.debug("Recieved",r),(r==null?void 0:r.action)=="response"&&this.acceptPostboxes[r.id])r.isError===!0?this.acceptPostboxes[r.id].reject(r.response):this.acceptPostboxes[r.id].resolve(r.response);else{if((r==null?void 0:r.action)=="rpc")return Promise.resolve().then(()=>this[r.method].apply(this,r.args)).then(o=>this.sendRaw({id:r.id,action:"response",response:o})).catch(o=>{console.warn(`TERA-FY client threw on RPC:${r.method}:`,o),this.sendRaw({id:r.id,action:"response",isError:!0,response:o.toString()})});if((r==null?void 0:r.action)=="event")return Promise.resolve().then(()=>this.events.emit(r.event,...r.payload)).catch(o=>{throw console.warn(`TERA-FY client threw while handling emitted event "${r.event}"`,{message:r}),o});r!=null&&r.id?this.debug(`Ignoring message ID ${r.id} - was meant for someone else?`):this.debug("Unexpected incoming TERA-FY CLIENT message",{message:r})}}createProjectStatePatch(e,r){let o=St(r,e,Pt);return this.debug("INFO","Created project patch",{newState:e,oldState:r}),this.applyProjectStatePatch(o)}applyProjectStatePatchLocal(e){throw new Error("applyProjectStatePatchLocal() has not been sub-classed by a plugin")}init(e){if(e&&this.set(e),this.init.promise)return this.init.promise;window.addEventListener("message",this.acceptMessage.bind(this));let r=this;return this.init.promise=Promise.resolve().then(()=>this.detectMode()).then(o=>this.settings.mode=o).then(()=>Promise.all([this.injectComms(),this.injectStylesheet(),this.injectMethods()])).then(()=>this.rpc("setServerMode",this.settings.mode=="child"?"embedded":this.settings.mode=="parent"?"window":(()=>{throw`Unknown server mode "${this.settings.mode}"`})())).then(()=>Promise.all(this.plugins.map(o=>o.init.call(r))))}detectMode(){return this.settings.mode!="detect"?this.settings.mode:window.self===window.parent?"child":Promise.resolve().then(()=>this.settings.mode="parent").then(()=>new Promise((e,r)=>{let o=setTimeout(()=>r(),this.settings.modeTimeout);this.rpc("handshake").then(()=>clearTimeout(o)).then(()=>e())})).then(()=>"parent").catch(()=>"child")}injectComms(){return new Promise(e=>{switch(this.settings.mode){case"child":this.debug("Injecting TERA site as iFrame child"),this.dom.el=document.createElement("div"),this.dom.el.id="tera-fy",this.dom.el.classList.toggle("dev-mode",this.settings.devMode),document.body.append(this.dom.el),this.dom.iframe=document.createElement("iframe"),this.dom.iframe.setAttribute("sandbox","allow-downloads allow-scripts allow-same-origin"),this.dom.iframe.addEventListener("load",()=>{this.debug("Embed frame ready"),e()}),this.dom.iframe.src=this.settings.siteUrl,this.dom.el.append(this.dom.iframe);break;case"parent":this.debug("Using TERA site stack parent"),e();break;default:throw new Error(`Unsupported mode "${this.settings.mode}" when calling injectComms()`)}})}injectStylesheet(){switch(this.settings.mode){case"child":this.dom.stylesheet=document.createElement("style"),this.dom.stylesheet.innerHTML=[":root {","--TERA-accent: #4d659c;","}","#tera-fy {","display: none;","position: fixed;","right: 50px;","bottom: 50px;","width: 300px;","height: 150px;","background: transparent;","&.dev-mode {","display: flex;","border: 5px solid var(--TERA-accent);","background: #FFF;","}","& > iframe {","width: 100%;","height: 100%;","}","}","body.tera-fy-focus {","overflow: hidden;","& #tera-fy {","display: flex !important;","position: fixed !important;","top: 0px !important;","width: 100vw !important;","height: 100vh !important;","left: 0px !important;","z-index: 10000 !important;","}","}"].join(`
`),document.head.appendChild(this.dom.stylesheet);break;case"parent":break;default:throw new Error(`Unsupported mode "${this.settings.mode}" when injectStylesheet()`)}}injectMethods(){this.methods.forEach(e=>this[e]=this.rpc.bind(this,e))}debug(...e){let r="log";typeof e[0]=="string"&&["INFO","LOG","WARN","ERROR"].includes(e[0])&&(r=e.shift().toLowerCase()),!(["INFO","LOG"].includes(r)&&!this.settings.devMode)&&console[r]("%c[TERA-FY CLIENT]","font-weight: bold; color: #ff5722;",...e)}set(e,r){return typeof e=="string"?this.settings[e]=r:Object.assign(this.settings,e),this.toggleDevMode(this.settings.devMode)}setIfDev(e,r){return this.settings.devMode?this.set(e,r):this}use(e,r){if(typeof e!="function")throw new Error("Expected use() call to be provided with a class initalizer");let o=new e(this,r);return this.mixin(this,o),this.plugins.push(o),this}mixin(e,r){Object.getOwnPropertyNames(Object.getPrototypeOf(r)).filter(o=>!["constructor","prototype","name"].includes(o)).filter(o=>o!="init").forEach(o=>{Object.defineProperty(e,o,{value:r[o].bind(e),enumerable:!1})})}toggleDevMode(e="toggle"){return this.settings.devMode=e==="toggle"?!this.settings.devMode:e,this.dom.el&&this.dom.el.classList.toggle("dev-mode",this.settings.devMode),this}toggleFocus(e="toggle"){this.debug("Request focus",{isFocused:e}),globalThis.document.body.classList.toggle("tera-fy-focus",e==="toggle"?void 0:e)}};export{_t as default};
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
//# sourceMappingURL=terafy.es2019.js.map
