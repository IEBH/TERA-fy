function _t(t,e,r){if(!t||typeof t!="object"||!e||typeof e!="object")throw new Error("both arguments must be objects or arrays");r||(r=function(a){return a});function o({obj1:a,obj2:p,basePath:m,basePathForRemoves:w,diffs:h}){var y=Object.keys(a),b=y.length,c=Object.keys(p),L=c.length,g,v=a.length-p.length;if(mr(a,p)){for(var d=0;d<b;d++){var B=Array.isArray(a)?Number(y[d]):y[d];B in p||(g=w.concat(B),h.remove.push({op:"remove",path:r(g)}))}for(var d=0;d<L;d++){var B=Array.isArray(p)?Number(c[d]):c[d];i({key:B,obj1:a,obj2:p,path:m.concat(B),pathForRemoves:m.concat(B),diffs:h})}}else{for(var d=0;d<v;d++)g=w.concat(d),h.remove.push({op:"remove",path:r(g)});for(var pr=a.slice(v),d=0;d<L;d++)i({key:d,obj1:pr,obj2:p,path:m.concat(d),pathForRemoves:m.concat(d+v),diffs:h})}}var f={remove:[],replace:[],add:[]};return o({obj1:t,obj2:e,basePath:[],basePathForRemoves:[],diffs:f}),f.remove.reverse().concat(f.replace).concat(f.add);function i({key:a,obj1:p,obj2:m,path:w,pathForRemoves:h,diffs:y}){var b=p[a],c=m[a];if(!(a in p)&&a in m){var L=c;y.add.push({op:"add",path:r(w),value:L})}else b!==c&&(Object(b)!==b||Object(c)!==c||lr(b,c)||!Object.keys(b).length&&!Object.keys(c).length&&String(b)!=String(c)?s(w,y,c):o({obj1:p[a],obj2:m[a],basePath:w,basePathForRemoves:h,diffs:y}))}function s(a,p,m){p.replace.push({op:"replace",path:r(a),value:m})}}function St(t){return[""].concat(t).join("/")}function lr(t,e){return Object.prototype.toString.call(t)!=Object.prototype.toString.call(e)}function mr(t,e){var r=t.length-e.length;if(Array.isArray(t)&&Array.isArray(e)&&r>0){for(var o=0,f=0,i=0;i<e.length&&String(t[i])===String(e[i]);i++)o++;for(var s=e.length;s>0&&String(t[s+r])===String(e[s]);s--)f++;return o>=f}return!0}var ur=typeof global=="object"&&global&&global.Object===Object&&global,X=ur;var dr=typeof self=="object"&&self&&self.Object===Object&&self,cr=X||dr||Function("return this")(),u=cr;var xr=u.Symbol,A=xr;var Pt=Object.prototype,hr=Pt.hasOwnProperty,gr=Pt.toString,Y=A?A.toStringTag:void 0;function yr(t){var e=hr.call(t,Y),r=t[Y];try{t[Y]=void 0;var o=!0}catch{}var f=gr.call(t);return o&&(e?t[Y]=r:delete t[Y]),f}var It=yr;var br=Object.prototype,vr=br.toString;function wr(t){return vr.call(t)}var Ct=wr;var jr="[object Null]",Tr="[object Undefined]",Et=A?A.toStringTag:void 0;function Ar(t){return t==null?t===void 0?Tr:jr:Et&&Et in Object(t)?It(t):Ct(t)}var O=Ar;function Or(t){return t!=null&&typeof t=="object"}var j=Or;var _r=Array.isArray,D=_r;function Sr(t){var e=typeof t;return t!=null&&(e=="object"||e=="function")}var T=Sr;var Pr="[object AsyncFunction]",Ir="[object Function]",Cr="[object GeneratorFunction]",Er="[object Proxy]";function Mr(t){if(!T(t))return!1;var e=O(t);return e==Ir||e==Cr||e==Pr||e==Er}var Z=Mr;var Rr=u["__core-js_shared__"],Q=Rr;var Mt=function(){var t=/[^.]+$/.exec(Q&&Q.keys&&Q.keys.IE_PROTO||"");return t?"Symbol(src)_1."+t:""}();function Lr(t){return!!Mt&&Mt in t}var Rt=Lr;var Fr=Function.prototype,Br=Fr.toString;function Dr(t){if(t!=null){try{return Br.call(t)}catch{}try{return t+""}catch{}}return""}var _=Dr;var Nr=/[\\^$.*+?()[\]{}|]/g,Ur=/^\[object .+?Constructor\]$/,kr=Function.prototype,Wr=Object.prototype,Gr=kr.toString,Kr=Wr.hasOwnProperty,zr=RegExp("^"+Gr.call(Kr).replace(Nr,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");function Vr(t){if(!T(t)||Rt(t))return!1;var e=Z(t)?zr:Ur;return e.test(_(t))}var Lt=Vr;function qr(t,e){return t?.[e]}var Ft=qr;function Hr(t,e){var r=Ft(t,e);return Lt(r)?r:void 0}var x=Hr;var $r=x(u,"WeakMap"),tt=$r;var Bt=Object.create,Yr=function(){function t(){}return function(e){if(!T(e))return{};if(Bt)return Bt(e);t.prototype=e;var r=new t;return t.prototype=void 0,r}}(),Dt=Yr;function Jr(t,e){var r=-1,o=t.length;for(e||(e=Array(o));++r<o;)e[r]=t[r];return e}var Nt=Jr;var Xr=function(){try{var t=x(Object,"defineProperty");return t({},"",{}),t}catch{}}(),yt=Xr;function Zr(t,e){for(var r=-1,o=t==null?0:t.length;++r<o&&e(t[r],r,t)!==!1;);return t}var Ut=Zr;var Qr=9007199254740991,to=/^(?:0|[1-9]\d*)$/;function eo(t,e){var r=typeof t;return e=e??Qr,!!e&&(r=="number"||r!="symbol"&&to.test(t))&&t>-1&&t%1==0&&t<e}var kt=eo;function ro(t,e,r){e=="__proto__"&&yt?yt(t,e,{configurable:!0,enumerable:!0,value:r,writable:!0}):t[e]=r}var et=ro;function oo(t,e){return t===e||t!==t&&e!==e}var rt=oo;var ao=Object.prototype,fo=ao.hasOwnProperty;function so(t,e,r){var o=t[e];(!(fo.call(t,e)&&rt(o,r))||r===void 0&&!(e in t))&&et(t,e,r)}var ot=so;function io(t,e,r,o){var f=!r;r||(r={});for(var i=-1,s=e.length;++i<s;){var a=e[i],p=o?o(r[a],t[a],a,r,t):void 0;p===void 0&&(p=t[a]),f?et(r,a,p):ot(r,a,p)}return r}var I=io;var no=9007199254740991;function po(t){return typeof t=="number"&&t>-1&&t%1==0&&t<=no}var at=po;function lo(t){return t!=null&&at(t.length)&&!Z(t)}var ft=lo;var mo=Object.prototype;function uo(t){var e=t&&t.constructor,r=typeof e=="function"&&e.prototype||mo;return t===r}var N=uo;function co(t,e){for(var r=-1,o=Array(t);++r<t;)o[r]=e(r);return o}var Wt=co;var xo="[object Arguments]";function ho(t){return j(t)&&O(t)==xo}var bt=ho;var Gt=Object.prototype,go=Gt.hasOwnProperty,yo=Gt.propertyIsEnumerable,bo=bt(function(){return arguments}())?bt:function(t){return j(t)&&go.call(t,"callee")&&!yo.call(t,"callee")},Kt=bo;function vo(){return!1}var zt=vo;var Ht=typeof exports=="object"&&exports&&!exports.nodeType&&exports,Vt=Ht&&typeof module=="object"&&module&&!module.nodeType&&module,wo=Vt&&Vt.exports===Ht,qt=wo?u.Buffer:void 0,jo=qt?qt.isBuffer:void 0,To=jo||zt,st=To;var Ao="[object Arguments]",Oo="[object Array]",_o="[object Boolean]",So="[object Date]",Po="[object Error]",Io="[object Function]",Co="[object Map]",Eo="[object Number]",Mo="[object Object]",Ro="[object RegExp]",Lo="[object Set]",Fo="[object String]",Bo="[object WeakMap]",Do="[object ArrayBuffer]",No="[object DataView]",Uo="[object Float32Array]",ko="[object Float64Array]",Wo="[object Int8Array]",Go="[object Int16Array]",Ko="[object Int32Array]",zo="[object Uint8Array]",Vo="[object Uint8ClampedArray]",qo="[object Uint16Array]",Ho="[object Uint32Array]",l={};l[Uo]=l[ko]=l[Wo]=l[Go]=l[Ko]=l[zo]=l[Vo]=l[qo]=l[Ho]=!0;l[Ao]=l[Oo]=l[Do]=l[_o]=l[No]=l[So]=l[Po]=l[Io]=l[Co]=l[Eo]=l[Mo]=l[Ro]=l[Lo]=l[Fo]=l[Bo]=!1;function $o(t){return j(t)&&at(t.length)&&!!l[O(t)]}var $t=$o;function Yo(t){return function(e){return t(e)}}var U=Yo;var Yt=typeof exports=="object"&&exports&&!exports.nodeType&&exports,J=Yt&&typeof module=="object"&&module&&!module.nodeType&&module,Jo=J&&J.exports===Yt,vt=Jo&&X.process,Xo=function(){try{var t=J&&J.require&&J.require("util").types;return t||vt&&vt.binding&&vt.binding("util")}catch{}}(),S=Xo;var Jt=S&&S.isTypedArray,Zo=Jt?U(Jt):$t,Xt=Zo;var Qo=Object.prototype,ta=Qo.hasOwnProperty;function ea(t,e){var r=D(t),o=!r&&Kt(t),f=!r&&!o&&st(t),i=!r&&!o&&!f&&Xt(t),s=r||o||f||i,a=s?Wt(t.length,String):[],p=a.length;for(var m in t)(e||ta.call(t,m))&&!(s&&(m=="length"||f&&(m=="offset"||m=="parent")||i&&(m=="buffer"||m=="byteLength"||m=="byteOffset")||kt(m,p)))&&a.push(m);return a}var it=ea;function ra(t,e){return function(r){return t(e(r))}}var nt=ra;var oa=nt(Object.keys,Object),Zt=oa;var aa=Object.prototype,fa=aa.hasOwnProperty;function sa(t){if(!N(t))return Zt(t);var e=[];for(var r in Object(t))fa.call(t,r)&&r!="constructor"&&e.push(r);return e}var Qt=sa;function ia(t){return ft(t)?it(t):Qt(t)}var k=ia;function na(t){var e=[];if(t!=null)for(var r in Object(t))e.push(r);return e}var te=na;var pa=Object.prototype,la=pa.hasOwnProperty;function ma(t){if(!T(t))return te(t);var e=N(t),r=[];for(var o in t)o=="constructor"&&(e||!la.call(t,o))||r.push(o);return r}var ee=ma;function ua(t){return ft(t)?it(t,!0):ee(t)}var W=ua;var da=x(Object,"create"),P=da;function ca(){this.__data__=P?P(null):{},this.size=0}var re=ca;function xa(t){var e=this.has(t)&&delete this.__data__[t];return this.size-=e?1:0,e}var oe=xa;var ha="__lodash_hash_undefined__",ga=Object.prototype,ya=ga.hasOwnProperty;function ba(t){var e=this.__data__;if(P){var r=e[t];return r===ha?void 0:r}return ya.call(e,t)?e[t]:void 0}var ae=ba;var va=Object.prototype,wa=va.hasOwnProperty;function ja(t){var e=this.__data__;return P?e[t]!==void 0:wa.call(e,t)}var fe=ja;var Ta="__lodash_hash_undefined__";function Aa(t,e){var r=this.__data__;return this.size+=this.has(t)?0:1,r[t]=P&&e===void 0?Ta:e,this}var se=Aa;function G(t){var e=-1,r=t==null?0:t.length;for(this.clear();++e<r;){var o=t[e];this.set(o[0],o[1])}}G.prototype.clear=re;G.prototype.delete=oe;G.prototype.get=ae;G.prototype.has=fe;G.prototype.set=se;var wt=G;function Oa(){this.__data__=[],this.size=0}var ie=Oa;function _a(t,e){for(var r=t.length;r--;)if(rt(t[r][0],e))return r;return-1}var C=_a;var Sa=Array.prototype,Pa=Sa.splice;function Ia(t){var e=this.__data__,r=C(e,t);if(r<0)return!1;var o=e.length-1;return r==o?e.pop():Pa.call(e,r,1),--this.size,!0}var ne=Ia;function Ca(t){var e=this.__data__,r=C(e,t);return r<0?void 0:e[r][1]}var pe=Ca;function Ea(t){return C(this.__data__,t)>-1}var le=Ea;function Ma(t,e){var r=this.__data__,o=C(r,t);return o<0?(++this.size,r.push([t,e])):r[o][1]=e,this}var me=Ma;function K(t){var e=-1,r=t==null?0:t.length;for(this.clear();++e<r;){var o=t[e];this.set(o[0],o[1])}}K.prototype.clear=ie;K.prototype.delete=ne;K.prototype.get=pe;K.prototype.has=le;K.prototype.set=me;var E=K;var Ra=x(u,"Map"),M=Ra;function La(){this.size=0,this.__data__={hash:new wt,map:new(M||E),string:new wt}}var ue=La;function Fa(t){var e=typeof t;return e=="string"||e=="number"||e=="symbol"||e=="boolean"?t!=="__proto__":t===null}var de=Fa;function Ba(t,e){var r=t.__data__;return de(e)?r[typeof e=="string"?"string":"hash"]:r.map}var R=Ba;function Da(t){var e=R(this,t).delete(t);return this.size-=e?1:0,e}var ce=Da;function Na(t){return R(this,t).get(t)}var xe=Na;function Ua(t){return R(this,t).has(t)}var he=Ua;function ka(t,e){var r=R(this,t),o=r.size;return r.set(t,e),this.size+=r.size==o?0:1,this}var ge=ka;function z(t){var e=-1,r=t==null?0:t.length;for(this.clear();++e<r;){var o=t[e];this.set(o[0],o[1])}}z.prototype.clear=ue;z.prototype.delete=ce;z.prototype.get=xe;z.prototype.has=he;z.prototype.set=ge;var ye=z;function Wa(t,e){for(var r=-1,o=e.length,f=t.length;++r<o;)t[f+r]=e[r];return t}var pt=Wa;var Ga=nt(Object.getPrototypeOf,Object),lt=Ga;function Ka(){this.__data__=new E,this.size=0}var be=Ka;function za(t){var e=this.__data__,r=e.delete(t);return this.size=e.size,r}var ve=za;function Va(t){return this.__data__.get(t)}var we=Va;function qa(t){return this.__data__.has(t)}var je=qa;var Ha=200;function $a(t,e){var r=this.__data__;if(r instanceof E){var o=r.__data__;if(!M||o.length<Ha-1)return o.push([t,e]),this.size=++r.size,this;r=this.__data__=new ye(o)}return r.set(t,e),this.size=r.size,this}var Te=$a;function V(t){var e=this.__data__=new E(t);this.size=e.size}V.prototype.clear=be;V.prototype.delete=ve;V.prototype.get=we;V.prototype.has=je;V.prototype.set=Te;var Ae=V;function Ya(t,e){return t&&I(e,k(e),t)}var Oe=Ya;function Ja(t,e){return t&&I(e,W(e),t)}var _e=Ja;var Ce=typeof exports=="object"&&exports&&!exports.nodeType&&exports,Se=Ce&&typeof module=="object"&&module&&!module.nodeType&&module,Xa=Se&&Se.exports===Ce,Pe=Xa?u.Buffer:void 0,Ie=Pe?Pe.allocUnsafe:void 0;function Za(t,e){if(e)return t.slice();var r=t.length,o=Ie?Ie(r):new t.constructor(r);return t.copy(o),o}var Ee=Za;function Qa(t,e){for(var r=-1,o=t==null?0:t.length,f=0,i=[];++r<o;){var s=t[r];e(s,r,t)&&(i[f++]=s)}return i}var Me=Qa;function tf(){return[]}var mt=tf;var ef=Object.prototype,rf=ef.propertyIsEnumerable,Re=Object.getOwnPropertySymbols,of=Re?function(t){return t==null?[]:(t=Object(t),Me(Re(t),function(e){return rf.call(t,e)}))}:mt,q=of;function af(t,e){return I(t,q(t),e)}var Le=af;var ff=Object.getOwnPropertySymbols,sf=ff?function(t){for(var e=[];t;)pt(e,q(t)),t=lt(t);return e}:mt,ut=sf;function nf(t,e){return I(t,ut(t),e)}var Fe=nf;function pf(t,e,r){var o=e(t);return D(t)?o:pt(o,r(t))}var dt=pf;function lf(t){return dt(t,k,q)}var Be=lf;function mf(t){return dt(t,W,ut)}var De=mf;var uf=x(u,"DataView"),ct=uf;var df=x(u,"Promise"),xt=df;var cf=x(u,"Set"),ht=cf;var Ne="[object Map]",xf="[object Object]",Ue="[object Promise]",ke="[object Set]",We="[object WeakMap]",Ge="[object DataView]",hf=_(ct),gf=_(M),yf=_(xt),bf=_(ht),vf=_(tt),F=O;(ct&&F(new ct(new ArrayBuffer(1)))!=Ge||M&&F(new M)!=Ne||xt&&F(xt.resolve())!=Ue||ht&&F(new ht)!=ke||tt&&F(new tt)!=We)&&(F=function(t){var e=O(t),r=e==xf?t.constructor:void 0,o=r?_(r):"";if(o)switch(o){case hf:return Ge;case gf:return Ne;case yf:return Ue;case bf:return ke;case vf:return We}return e});var H=F;var wf=Object.prototype,jf=wf.hasOwnProperty;function Tf(t){var e=t.length,r=new t.constructor(e);return e&&typeof t[0]=="string"&&jf.call(t,"index")&&(r.index=t.index,r.input=t.input),r}var Ke=Tf;var Af=u.Uint8Array,jt=Af;function Of(t){var e=new t.constructor(t.byteLength);return new jt(e).set(new jt(t)),e}var $=Of;function _f(t,e){var r=e?$(t.buffer):t.buffer;return new t.constructor(r,t.byteOffset,t.byteLength)}var ze=_f;var Sf=/\w*$/;function Pf(t){var e=new t.constructor(t.source,Sf.exec(t));return e.lastIndex=t.lastIndex,e}var Ve=Pf;var qe=A?A.prototype:void 0,He=qe?qe.valueOf:void 0;function If(t){return He?Object(He.call(t)):{}}var $e=If;function Cf(t,e){var r=e?$(t.buffer):t.buffer;return new t.constructor(r,t.byteOffset,t.length)}var Ye=Cf;var Ef="[object Boolean]",Mf="[object Date]",Rf="[object Map]",Lf="[object Number]",Ff="[object RegExp]",Bf="[object Set]",Df="[object String]",Nf="[object Symbol]",Uf="[object ArrayBuffer]",kf="[object DataView]",Wf="[object Float32Array]",Gf="[object Float64Array]",Kf="[object Int8Array]",zf="[object Int16Array]",Vf="[object Int32Array]",qf="[object Uint8Array]",Hf="[object Uint8ClampedArray]",$f="[object Uint16Array]",Yf="[object Uint32Array]";function Jf(t,e,r){var o=t.constructor;switch(e){case Uf:return $(t);case Ef:case Mf:return new o(+t);case kf:return ze(t,r);case Wf:case Gf:case Kf:case zf:case Vf:case qf:case Hf:case $f:case Yf:return Ye(t,r);case Rf:return new o;case Lf:case Df:return new o(t);case Ff:return Ve(t);case Bf:return new o;case Nf:return $e(t)}}var Je=Jf;function Xf(t){return typeof t.constructor=="function"&&!N(t)?Dt(lt(t)):{}}var Xe=Xf;var Zf="[object Map]";function Qf(t){return j(t)&&H(t)==Zf}var Ze=Qf;var Qe=S&&S.isMap,ts=Qe?U(Qe):Ze,tr=ts;var es="[object Set]";function rs(t){return j(t)&&H(t)==es}var er=rs;var rr=S&&S.isSet,os=rr?U(rr):er,or=os;var as=1,fs=2,ss=4,ar="[object Arguments]",is="[object Array]",ns="[object Boolean]",ps="[object Date]",ls="[object Error]",fr="[object Function]",ms="[object GeneratorFunction]",us="[object Map]",ds="[object Number]",sr="[object Object]",cs="[object RegExp]",xs="[object Set]",hs="[object String]",gs="[object Symbol]",ys="[object WeakMap]",bs="[object ArrayBuffer]",vs="[object DataView]",ws="[object Float32Array]",js="[object Float64Array]",Ts="[object Int8Array]",As="[object Int16Array]",Os="[object Int32Array]",_s="[object Uint8Array]",Ss="[object Uint8ClampedArray]",Ps="[object Uint16Array]",Is="[object Uint32Array]",n={};n[ar]=n[is]=n[bs]=n[vs]=n[ns]=n[ps]=n[ws]=n[js]=n[Ts]=n[As]=n[Os]=n[us]=n[ds]=n[sr]=n[cs]=n[xs]=n[hs]=n[gs]=n[_s]=n[Ss]=n[Ps]=n[Is]=!0;n[ls]=n[fr]=n[ys]=!1;function gt(t,e,r,o,f,i){var s,a=e&as,p=e&fs,m=e&ss;if(r&&(s=f?r(t,o,f,i):r(t)),s!==void 0)return s;if(!T(t))return t;var w=D(t);if(w){if(s=Ke(t),!a)return Nt(t,s)}else{var h=H(t),y=h==fr||h==ms;if(st(t))return Ee(t,a);if(h==sr||h==ar||y&&!f){if(s=p||y?{}:Xe(t),!a)return p?Fe(t,_e(s,t)):Le(t,Oe(s,t))}else{if(!n[h])return f?t:{};s=Je(t,h,a)}}i||(i=new Ae);var b=i.get(t);if(b)return b;i.set(t,s),or(t)?t.forEach(function(g){s.add(gt(g,e,r,g,t,i))}):tr(t)&&t.forEach(function(g,v){s.set(v,gt(g,e,r,v,t,i))});var c=m?p?De:Be:p?W:k,L=w?void 0:c(t);return Ut(L||t,function(g,v){L&&(v=g,g=t[v]),ot(s,v,gt(g,e,r,v,t,i))}),s}var ir=gt;var Cs=1,Es=4;function Ms(t){return ir(t,Cs|Es)}var Tt=Ms;function nr(t){return{all:t=t||new Map,on:function(e,r){var o=t.get(e);o?o.push(r):t.set(e,[r])},off:function(e,r){var o=t.get(e);o&&(r?o.splice(o.indexOf(r)>>>0,1):t.set(e,[]))},emit:function(e,r){var o=t.get(e);o&&o.slice().map(function(f){f(r)}),(o=t.get("*"))&&o.slice().map(function(f){f(e,r)})}}}var At=(t=21)=>crypto.getRandomValues(new Uint8Array(t)).reduce((e,r)=>(r&=63,r<36?e+=r.toString(36):r<62?e+=(r-26).toString(36).toUpperCase():r>62?e+="-":e+="_",e),"");var Ot=class{settings={devMode:!0,mode:"detect",modeTimeout:300,siteUrl:"https://tera-tools.com/embed",restrictOrigin:"*",frameSandbox:["allow-forms","allow-modals","allow-orientation-lock","allow-pointer-lock","allow-popups","allow-popups-to-escape-sandbox","allow-presentation","allow-same-origin","allow-scripts","allow-top-navigation"]};events=nr();dom={el:null,iframe:null,stylesheet:null};methods=["handshake","getUser","requireUser","bindProject","getProject","getProjects","setActiveProject","requireProject","selectProject","getProjectState","setProjectState","setProjectStateDefaults","saveProjectState","replaceProjectState","applyProjectStatePatch","getProjectFiles","getProjectLibrary","setProjectLibrary","uiAlert"];plugins=[];send(e){let r=At();return this.acceptPostboxes[r]={},this.acceptPostboxes[r].promise=new Promise((o,f)=>{Object.assign(this.acceptPostboxes[r],{resolve:o,reject:f}),this.sendRaw({id:r,...e})}),this.acceptPostboxes[r].promise}sendRaw(e){let r;try{if(r={TERA:1,id:e.id||At(),...Tt(e)},this.settings.mode=="parent")window.parent.postMessage(r,this.settings.restrictOrigin);else if(this.settings.mode=="child")this.dom.iframe.contentWindow.postMessage(r,this.settings.restrictOrigin);else throw this.settings.mode=="detect"?new Error("Call init() or detectMode() before trying to send data to determine the mode"):new Error(`Unknown TERA communication mode "${this.settings.mode}"`)}catch(o){throw this.debug("ERROR","Message compose client->server:",o),this.debug("ERROR","Attempted to dispatch payload client->server",r),o}}rpc(e,...r){return this.send({action:"rpc",method:e,args:r})}acceptMessage(e){if(e.origin==window.location.origin)return;let r=e.data;if(!(!r.TERA||!r.id))if(this.debug("Recieved",r),r?.action=="response"&&this.acceptPostboxes[r.id])r.isError===!0?this.acceptPostboxes[r.id].reject(r.response):this.acceptPostboxes[r.id].resolve(r.response);else{if(r?.action=="rpc")return Promise.resolve().then(()=>this[r.method].apply(this,r.args)).then(o=>this.sendRaw({id:r.id,action:"response",response:o})).catch(o=>{console.warn(`TERA-FY client threw on RPC:${r.method}:`,o),this.sendRaw({id:r.id,action:"response",isError:!0,response:o.toString()})});if(r?.action=="event")return Promise.resolve().then(()=>this.events.emit(r.event,...r.payload)).catch(o=>{throw console.warn(`TERA-FY client threw while handling emitted event "${r.event}"`,{message:r}),o});r?.id?this.debug(`Ignoring message ID ${r.id} - was meant for someone else?`):this.debug("Unexpected incoming TERA-FY CLIENT message",{message:r})}}acceptPostboxes={};createProjectStatePatch(e,r){let o=_t(r,e,St);return this.debug("INFO","Created project patch",{newState:e,oldState:r}),this.applyProjectStatePatch(o)}applyProjectStatePatchLocal(e){throw new Error("applyProjectStatePatchLocal() has not been sub-classed by a plugin")}constructor(e){e&&this.set(e)}init(e){if(e&&this.set(e),this.init.promise)return this.init.promise;window.addEventListener("message",this.acceptMessage.bind(this));let r=this;return this.init.promise=Promise.resolve().then(()=>this.detectMode()).then(o=>this.settings.mode=o).then(()=>Promise.all([this.injectComms(),this.injectStylesheet(),this.injectMethods()])).then(()=>this.rpc("setServerMode",this.settings.mode=="child"?"embedded":this.settings.mode=="parent"?"window":(()=>{throw`Unknown server mode "${this.settings.mode}"`})())).then(()=>Promise.all(this.plugins.map(o=>o.init.call(r,this.settings))))}detectMode(){return this.settings.mode!="detect"?this.settings.mode:window.self===window.parent?"child":Promise.resolve().then(()=>this.settings.mode="parent").then(()=>new Promise((e,r)=>{let o=setTimeout(()=>r(),this.settings.modeTimeout);this.rpc("handshake").then(()=>clearTimeout(o)).then(()=>e())})).then(()=>"parent").catch(()=>"child")}injectComms(){return new Promise(e=>{switch(this.settings.mode){case"child":this.debug("Injecting TERA site as iFrame child"),this.dom.el=document.createElement("div"),this.dom.el.id="tera-fy",this.dom.el.classList.toggle("dev-mode",this.settings.devMode),document.body.append(this.dom.el),this.dom.iframe=document.createElement("iframe"),this.dom.iframe.setAttribute("sandbox",this.settings.frameSandbox.join(" ")),this.dom.iframe.addEventListener("load",()=>{this.debug("Embed frame ready"),e()}),this.dom.iframe.src=this.settings.siteUrl,this.dom.el.append(this.dom.iframe);break;case"parent":this.debug("Using TERA site stack parent"),e();break;default:throw new Error(`Unsupported mode "${this.settings.mode}" when calling injectComms()`)}})}injectStylesheet(){switch(this.settings.mode){case"child":this.dom.stylesheet=document.createElement("style"),this.dom.stylesheet.innerHTML=[":root {","--TERA-accent: #4d659c;","}","#tera-fy {","display: none;","position: fixed;","right: 50px;","bottom: 50px;","width: 300px;","height: 150px;","background: transparent;","&.dev-mode {","display: flex;","border: 5px solid var(--TERA-accent);","background: #FFF;","}","& > iframe {","width: 100%;","height: 100%;","}","}","body.tera-fy-focus {","overflow: hidden;","& #tera-fy {","display: flex !important;","position: fixed !important;","top: 0px !important;","width: 100vw !important;","height: 100vh !important;","left: 0px !important;","z-index: 10000 !important;","}","}"].join(`
`),document.head.appendChild(this.dom.stylesheet);break;case"parent":break;default:throw new Error(`Unsupported mode "${this.settings.mode}" when injectStylesheet()`)}}injectMethods(){this.methods.forEach(e=>this[e]=this.rpc.bind(this,e))}debug(...e){let r="log";typeof e[0]=="string"&&["INFO","LOG","WARN","ERROR"].includes(e[0])&&(r=e.shift().toLowerCase()),!(["INFO","LOG"].includes(r)&&!this.settings.devMode)&&console[r]("%c[TERA-FY CLIENT]","font-weight: bold; color: #ff5722;",...e)}set(e,r){return typeof e=="string"?this.settings[e]=r:Object.assign(this.settings,e),this.toggleDevMode(this.settings.devMode)}setIfDev(e,r){return this.settings.devMode?this.set(e,r):this}use(e,r){if(typeof e!="function")throw new Error("Expected use() call to be provided with a class initalizer");let o=new e(this,r);return this.mixin(this,o),this.plugins.push(o),this}mixin(e,r){Object.getOwnPropertyNames(Object.getPrototypeOf(r)).filter(o=>!["constructor","prototype","name"].includes(o)).filter(o=>o!="init").forEach(o=>{Object.defineProperty(e,o,{value:r[o].bind(e),enumerable:!1})})}toggleDevMode(e="toggle"){return this.settings.devMode=e==="toggle"?!this.settings.devMode:e,this.dom.el&&this.dom.el.classList.toggle("dev-mode",this.settings.devMode),this}toggleFocus(e="toggle"){this.debug("Request focus",{isFocused:e}),globalThis.document.body.classList.toggle("tera-fy-focus",e==="toggle"?void 0:e)}};export{Ot as default};
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
//# sourceMappingURL=terafy.js.map
