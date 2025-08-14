(()=>{var e={};e.id=931,e.ids=[931],e.modules={7849:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external")},2934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},5403:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external")},4580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},4749:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external")},5869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},8535:(e,t,s)=>{"use strict";s.r(t),s.d(t,{GlobalError:()=>l.a,__next_app__:()=>d,originalPathname:()=>x,pages:()=>c,routeModule:()=>p,tree:()=>f});var i=s(482),a=s(9108),o=s(2563),l=s.n(o),r=s(8300),n={};for(let e in r)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(n[e]=()=>r[e]);s.d(t,n);let f=["",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(s.bind(s,751)),"/Users/JoaquinNam/Desktop/MENTE_MAESTRA/web3/sozucash/app/page.tsx"]}]},{layout:[()=>Promise.resolve().then(s.bind(s,2917)),"/Users/JoaquinNam/Desktop/MENTE_MAESTRA/web3/sozucash/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(s.t.bind(s,9361,23)),"next/dist/client/components/not-found-error"]}],c=["/Users/JoaquinNam/Desktop/MENTE_MAESTRA/web3/sozucash/app/page.tsx"],x="/page",d={require:s,loadChunk:()=>Promise.resolve()},p=new i.AppPageRouteModule({definition:{kind:a.x.APP_PAGE,page:"/page",pathname:"/",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:f}})},129:()=>{},1082:(e,t,s)=>{Promise.resolve().then(s.bind(s,4438))},6139:(e,t,s)=>{Promise.resolve().then(s.t.bind(s,2583,23)),Promise.resolve().then(s.t.bind(s,6840,23)),Promise.resolve().then(s.t.bind(s,8771,23)),Promise.resolve().then(s.t.bind(s,3225,23)),Promise.resolve().then(s.t.bind(s,9295,23)),Promise.resolve().then(s.t.bind(s,3982,23))},4438:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>m});var i=s(2295),a=s(2254),o=s(3729),l=s.n(o),r=s(8373),n=s(6934),f=s(6955);let c=`
varying vec2 vUv;
uniform float time;
uniform vec4 resolution;

void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
}
`,x=`
precision highp float;
varying vec2 vUv;
uniform float time;
uniform vec4 resolution;

float PI = 3.141592653589793238;

mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
    mat4 m = rotationMatrix(axis, angle);
    return (m * vec4(v, 1.0)).xyz;
}

float smin( float a, float b, float k ) {
    k *= 6.0;
    float h = max( k-abs(a-b), 0.0 )/k;
    return min(a,b) - h*h*h*k*(1.0/6.0);
}

float sphereSDF(vec3 p, float r) {
    return length(p) - r;
}

float sdf(vec3 p) {
    vec3 p1 = rotate(p, vec3(0.0, 0.0, 1.0), time/5.0);
    vec3 p2 = rotate(p, vec3(1.), -time/5.0);
    vec3 p3 = rotate(p, vec3(1., 1., 0.), -time/4.5);
    vec3 p4 = rotate(p, vec3(0., 1., 0.), -time/4.0);
    
    float final = sphereSDF(p1 - vec3(-0.5, 0.0, 0.0), 0.35);
    float nextSphere = sphereSDF(p2 - vec3(0.55, 0.0, 0.0), 0.3);
    final = smin(final, nextSphere, 0.1);
    nextSphere = sphereSDF(p2 - vec3(-0.8, 0.0, 0.0), 0.2);
    final = smin(final, nextSphere, 0.1);
    nextSphere = sphereSDF(p3 - vec3(1.0, 0.0, 0.0), 0.15);
    final = smin(final, nextSphere, 0.1);
    nextSphere = sphereSDF(p4 - vec3(0.45, -0.45, 0.0), 0.15);
    final = smin(final, nextSphere, 0.1);
    
    return final;
}

vec3 getNormal(vec3 p) {
    float d = 0.001;
    return normalize(vec3(
        sdf(p + vec3(d, 0.0, 0.0)) - sdf(p - vec3(d, 0.0, 0.0)),
        sdf(p + vec3(0.0, d, 0.0)) - sdf(p - vec3(0.0, d, 0.0)),
        sdf(p + vec3(0.0, 0.0, d)) - sdf(p - vec3(0.0, 0.0, d))
    ));
}

float rayMarch(vec3 rayOrigin, vec3 ray) {
    float t = 0.0;
    for (int i = 0; i < 100; i++) {
        vec3 p = rayOrigin + ray * t;
        float d = sdf(p);
        if (d < 0.001) return t;
        t += d;
        if (t > 100.0) break;
    }
    return -1.0;
}

void main() {
    vec2 newUV = (vUv - vec2(0.5)) * resolution.zw + vec2(0.5);
    vec3 cameraPos = vec3(0.0, 0.0, 5.0);
    vec3 ray = normalize(vec3((vUv - vec2(0.5)) * resolution.zw, -1));
    vec3 color = vec3(1.0);
    
    float t = rayMarch(cameraPos, ray);
    if (t > 0.0) {
        vec3 p = cameraPos + ray * t;
        vec3 normal = getNormal(p);
        float fresnel = pow(1.0 + dot(ray, normal), 3.0);
        color = vec3(fresnel);
        gl_FragColor = vec4(color, 1.0);
    } else {
        gl_FragColor = vec4(1.0);
    }
}
`;function d(){let e=(0,o.useRef)(null),{size:t}=(0,r.D)(),s=(0,o.useMemo)(()=>({time:{value:0},resolution:{value:new f.Vector4}}),[]);return l().useEffect(()=>{let e,i;let{width:a,height:o}=t;o/a>1?(e=a/o*1,i=1):(e=1,i=o/a/1),s.resolution.value.set(a,o,e,i)},[t,s]),(0,r.F)(t=>{e.current&&(s.time.value=t.clock.elapsedTime)}),(0,i.jsxs)("mesh",{ref:e,children:[i.jsx("planeGeometry",{args:[5,5]}),i.jsx("shaderMaterial",{uniforms:s,vertexShader:c,fragmentShader:x})]})}function p(){return i.jsx("div",{className:"fixed inset-0 w-full h-full z-0",style:{zIndex:0},children:i.jsx(n.Xz,{camera:{left:-.5,right:.5,top:.5,bottom:-.5,near:-1e3,far:1e3,position:[0,0,2]},orthographic:!0,gl:{antialias:!0},children:i.jsx(d,{})})})}function m(){let e=(0,a.useRouter)(),[t,s]=(0,o.useState)(0);return(0,o.useEffect)(()=>{let e=()=>{s(Math.round(window.scrollY/window.innerHeight))};return window.addEventListener("scroll",e),()=>window.removeEventListener("scroll",e)},[]),(0,i.jsxs)("div",{className:"relative w-full h-screen overflow-y-scroll snap-y snap-mandatory",style:{isolation:"isolate"},children:[i.jsx(p,{}),(0,i.jsxs)("div",{className:"relative z-30 w-full",children:[i.jsx("div",{className:"h-screen flex items-center justify-center snap-start",children:(0,i.jsxs)("div",{className:`text-center max-w-4xl mx-auto px-6 transition-opacity duration-1000 ${0===t?"opacity-100":"opacity-0"}`,children:[i.jsx("div",{className:"mb-8",children:i.jsx("img",{src:"/sozu-logo.svg",alt:"Sozu Cash",width:300,height:112,style:{mixBlendMode:"difference",color:"#ffffff",WebkitTextFillColor:"#ffffff",textShadow:"none",fontFamily:"'Helvetica', sans-serif",fontWeight:600}})}),i.jsx("h1",{className:"text-4xl md:text-6xl font-bold mb-6",style:{mixBlendMode:"difference",color:"#ffffff",WebkitTextFillColor:"#ffffff",textShadow:"2px 2px 4px rgba(0, 0, 0, 0.3)",fontFamily:"'Helvetica', sans-serif",fontWeight:600},children:"Free. Permissionless. Instant."}),i.jsx("p",{className:"text-xl md:text-2xl mb-8 text-white/90",style:{mixBlendMode:"difference",color:"#ffffff",WebkitTextFillColor:"#ffffff",textShadow:"2px 2px 4px rgba(0, 0, 0, 0.3)",fontFamily:"'Helvetica', sans-serif",fontWeight:400},children:"No banks. No borders. No fees."}),i.jsx("button",{onClick:()=>e.push("/locked-screen"),className:"bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold py-4 px-8 rounded-2xl text-lg shadow-2xl hover:shadow-white/10 hover:scale-105 active:scale-95 transition-all duration-300",children:"\uD83D\uDE80 Open App"})]})}),i.jsx("div",{className:"h-screen flex items-center justify-center snap-start",children:(0,i.jsxs)("div",{className:`max-w-4xl mx-auto px-6 transition-opacity duration-1000 ${1===t?"opacity-100":"opacity-0"}`,children:[i.jsx("h2",{className:"text-3xl md:text-4xl font-bold mb-8 text-center",style:{mixBlendMode:"difference",color:"#ffffff",WebkitTextFillColor:"#ffffff",textShadow:"2px 2px 4px rgba(0, 0, 0, 0.3)",fontFamily:"'Helvetica', sans-serif",fontWeight:600},children:"Why SozuCash?"}),i.jsx("div",{className:"grid md:grid-cols-2 gap-6",children:[{title:"Free Forever",desc:"No transaction fees, no maintenance costs."},{title:"Permissionless Access",desc:"Anyone can open an account instantly."},{title:"Instant Final Settlement",desc:"Transactions are confirmed in seconds."},{title:"Anonymous by Design",desc:"Your funds, your privacy, your control."},{title:"On-Chain Yield",desc:"Earn from your deposits while you spend."}].map((e,t)=>(0,i.jsxs)("div",{className:"bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6",children:[i.jsx("h3",{className:"text-xl font-semibold mb-2",style:{mixBlendMode:"difference",color:"#ffffff",WebkitTextFillColor:"#ffffff",textShadow:"1px 1px 2px rgba(0, 0, 0, 0.3)",fontFamily:"'Helvetica', sans-serif",fontWeight:600},children:e.title}),i.jsx("p",{className:"text-white/80",style:{mixBlendMode:"difference",color:"#ffffff",WebkitTextFillColor:"#ffffff",textShadow:"1px 1px 2px rgba(0, 0, 0, 0.3)",fontFamily:"'Helvetica', sans-serif",fontWeight:400},children:e.desc})]},t))})]})}),i.jsx("div",{className:"h-screen flex items-center justify-center snap-start",children:(0,i.jsxs)("div",{className:`max-w-4xl mx-auto px-6 text-center transition-opacity duration-1000 ${2===t?"opacity-100":"opacity-0"}`,children:[i.jsx("h2",{className:"text-3xl md:text-4xl font-bold mb-6",style:{mixBlendMode:"difference",color:"#ffffff",WebkitTextFillColor:"#ffffff",textShadow:"2px 2px 4px rgba(0, 0, 0, 0.3)",fontFamily:"'Helvetica', sans-serif",fontWeight:600},children:"Powered by Mantle Network"}),i.jsx("p",{className:"text-xl mb-8 text-white/90",style:{mixBlendMode:"difference",color:"#ffffff",WebkitTextFillColor:"#ffffff",textShadow:"2px 2px 4px rgba(0, 0, 0, 0.3)",fontFamily:"'Helvetica', sans-serif",fontWeight:400},children:"SozuCash runs on Mantle Network — a next-gen EVM-compatible blockchain delivering:"}),i.jsx("div",{className:"grid md:grid-cols-3 gap-6 mb-8",children:["Ultra-low costs","High scalability","Global reach"].map((e,t)=>i.jsx("div",{className:"bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6",children:i.jsx("p",{className:"text-lg font-semibold",style:{mixBlendMode:"difference",color:"#ffffff",WebkitTextFillColor:"#ffffff",textShadow:"1px 1px 2px rgba(0, 0, 0, 0.3)",fontFamily:"'Helvetica', sans-serif",fontWeight:600},children:e})},t))}),i.jsx("p",{className:"text-lg text-white/80",style:{mixBlendMode:"difference",color:"#ffffff",WebkitTextFillColor:"#ffffff",textShadow:"2px 2px 4px rgba(0, 0, 0, 0.3)",fontFamily:"'Helvetica', sans-serif",fontWeight:400},children:"By leveraging Mantle, we bring USDC (digital dollars) to anyone, anywhere — with the speed and smoothness of Google Pay, but fully self-custodial and trustless."})]})}),i.jsx("div",{className:"h-screen flex items-center justify-center snap-start",children:(0,i.jsxs)("div",{className:`max-w-4xl mx-auto px-6 text-center transition-opacity duration-1000 ${3===t?"opacity-100":"opacity-0"}`,children:[i.jsx("h2",{className:"text-3xl md:text-4xl font-bold mb-8",style:{mixBlendMode:"difference",color:"#ffffff",WebkitTextFillColor:"#ffffff",textShadow:"2px 2px 4px rgba(0, 0, 0, 0.3)",fontFamily:"'Helvetica', sans-serif",fontWeight:600},children:"How It Works"}),i.jsx("div",{className:"grid md:grid-cols-3 gap-8",children:[{step:"1",title:"Open the app",desc:"instantly get your free EVM wallet."},{step:"2",title:"Start transacting",desc:"send and receive USDC in seconds."},{step:"3",title:"Earn while you hold",desc:"your balance generates yield automatically."}].map((e,t)=>(0,i.jsxs)("div",{className:"bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-8",children:[i.jsx("div",{className:"text-4xl font-bold mb-4",style:{mixBlendMode:"difference",color:"#ffffff",WebkitTextFillColor:"#ffffff",textShadow:"2px 2px 4px rgba(0, 0, 0, 0.3)",fontFamily:"'Helvetica', sans-serif",fontWeight:600},children:e.step}),i.jsx("h3",{className:"text-xl font-semibold mb-2",style:{mixBlendMode:"difference",color:"#ffffff",WebkitTextFillColor:"#ffffff",textShadow:"1px 1px 2px rgba(0, 0, 0, 0.3)",fontFamily:"'Helvetica', sans-serif",fontWeight:600},children:e.title}),i.jsx("p",{className:"text-white/80",style:{mixBlendMode:"difference",color:"#ffffff",WebkitTextFillColor:"#ffffff",textShadow:"1px 1px 2px rgba(0, 0, 0, 0.3)",fontFamily:"'Helvetica', sans-serif",fontWeight:400},children:e.desc})]},t))})]})}),i.jsx("div",{className:"h-screen flex items-center justify-center snap-start",children:(0,i.jsxs)("div",{className:`max-w-4xl mx-auto px-6 text-center transition-opacity duration-1000 ${4===t?"opacity-100":"opacity-0"}`,children:[i.jsx("h2",{className:"text-3xl md:text-4xl font-bold mb-6",style:{mixBlendMode:"difference",color:"#ffffff",WebkitTextFillColor:"#ffffff",textShadow:"2px 2px 4px rgba(0, 0, 0, 0.3)",fontFamily:"'Helvetica', sans-serif",fontWeight:600},children:"The Future of Money is Here"}),i.jsx("p",{className:"text-xl text-white/90 mb-8",style:{mixBlendMode:"difference",color:"#ffffff",WebkitTextFillColor:"#ffffff",textShadow:"2px 2px 4px rgba(0, 0, 0, 0.3)",fontFamily:"'Helvetica', sans-serif",fontWeight:400},children:"SozuCash is the most competitive, permissionless, and borderless way to trade goods and services — giving everyone the right to transact freely."}),i.jsx("button",{onClick:()=>e.push("/locked-screen"),className:"bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold py-4 px-8 rounded-2xl text-lg shadow-2xl hover:shadow-white/10 hover:scale-105 active:scale-95 transition-all duration-300",children:"\uD83D\uDE80 Launch SozuCash App"})]})}),i.jsx("div",{className:"h-screen flex items-center justify-center snap-start",children:(0,i.jsxs)("div",{className:`max-w-4xl mx-auto px-6 text-center transition-opacity duration-1000 ${5===t?"opacity-100":"opacity-0"}`,children:[i.jsx("h2",{className:"text-3xl md:text-4xl font-bold mb-8",style:{mixBlendMode:"difference",color:"#ffffff",WebkitTextFillColor:"#ffffff",textShadow:"2px 2px 4px rgba(0, 0, 0, 0.3)",fontFamily:"'Helvetica', sans-serif",fontWeight:600},children:"Contact & Links"}),i.jsx("div",{className:"grid md:grid-cols-3 gap-6",children:[{icon:"\uD83D\uDCE9",label:"Email",link:"hello@sozu.cash",href:"mailto:hello@sozu.cash"},{icon:"\uD83D\uDCBB",label:"GitHub",link:"github.com/sozu-cash",href:"https://github.com/sozu-cash"},{icon:"\uD83D\uDC26",label:"Twitter/X",link:"@SozuCash",href:"https://twitter.com/SozuCash"}].map((e,t)=>(0,i.jsxs)("a",{href:e.href,target:"_blank",rel:"noopener noreferrer",className:"bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300",children:[i.jsx("div",{className:"text-3xl mb-2",style:{mixBlendMode:"difference",color:"#ffffff",WebkitTextFillColor:"#ffffff",textShadow:"1px 1px 2px rgba(0, 0, 0, 0.3)",fontFamily:"'Helvetica', sans-serif",fontWeight:600},children:e.icon}),i.jsx("h3",{className:"text-lg font-semibold mb-1",style:{mixBlendMode:"difference",color:"#ffffff",WebkitTextFillColor:"#ffffff",textShadow:"1px 1px 2px rgba(0, 0, 0, 0.3)",fontFamily:"'Helvetica', sans-serif",fontWeight:600},children:e.label}),i.jsx("p",{className:"text-white/80",style:{mixBlendMode:"difference",color:"#ffffff",WebkitTextFillColor:"#ffffff",textShadow:"1px 1px 2px rgba(0, 0, 0, 0.3)",fontFamily:"'Helvetica', sans-serif",fontWeight:400},children:e.link})]},t))})]})})]})]})}},2295:(e,t,s)=>{"use strict";e.exports=s(6372).vendored["react-ssr"].ReactJsxRuntime},2254:(e,t,s)=>{e.exports=s(4767)},2917:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>r,metadata:()=>l});var i=s(5036),a=s(8592),o=s.n(a);s(7272);let l={title:"Sozu Cash — Tap to Pay",description:"NFC-first payments with one-tap flows on Mantle Network",manifest:"/manifest.json",themeColor:"#8b5cf6",viewport:"width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",appleWebApp:{capable:!0,statusBarStyle:"default",title:"Sozu Cash"},formatDetection:{telephone:!1}};function r({children:e}){return(0,i.jsxs)("html",{lang:"en",children:[(0,i.jsxs)("head",{children:[i.jsx("link",{rel:"icon",href:"/favicon.ico"}),i.jsx("link",{rel:"apple-touch-icon",href:"/icon-192x192.png"}),i.jsx("meta",{name:"apple-mobile-web-app-capable",content:"yes"}),i.jsx("meta",{name:"apple-mobile-web-app-status-bar-style",content:"default"})]}),i.jsx("body",{className:o().className,children:e})]})}},751:(e,t,s)=>{"use strict";s.r(t),s.d(t,{$$typeof:()=>o,__esModule:()=>a,default:()=>l});let i=(0,s(6843).createProxy)(String.raw`/Users/JoaquinNam/Desktop/MENTE_MAESTRA/web3/sozucash/app/page.tsx`),{__esModule:a,$$typeof:o}=i,l=i.default},7272:()=>{}};var t=require("../webpack-runtime.js");t.C(e);var s=e=>t(t.s=e),i=t.X(0,[242,934],()=>s(8535));module.exports=i})();