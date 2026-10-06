/* RK Cashew production entry point. Adds security headers and a small responsive/secure browser layer. */
import base from "./worker.js";
import {handleExtra} from "./worker-extra.js";
export * from "./worker.js";

const RESPONSIVE_CSS=`
*,*::before,*::after{box-sizing:border-box}
html,body{max-width:100%;overflow-x:hidden}
img,svg,video,canvas{max-width:100%;height:auto}
button,input,textarea,select{max-width:100%;min-width:0}
.modalCard,.pay,.formgrid,.cartLine,.sectionHead,.festIn{min-width:0}
@media (max-width:1100px){.container{width:min(var(--max,1180px),calc(100% - 28px))}.heroGrid{grid-template-columns:1fr .9fr;gap:28px}.grades{grid-template-columns:repeat(3,minmax(0,1fr))}.navlinks{gap:14px}}
@media (max-width:820px){
  .navin{height:62px;gap:8px}.navlinks{display:none}.logoText strong{font-size:18px}.logoText small{font-size:10px}.logoMark{width:38px;height:38px}
  .heroGrid{grid-template-columns:1fr;min-height:0;padding:48px 0 44px;text-align:center}.heroCopy{margin-inline:auto;font-size:16px}.heroBtns,.trustRow{justify-content:center}.heroVisual{min-height:320px;order:2}.orbit{width:min(330px,78vw)}.productHero{width:67%}
  section{padding:56px 0}.sectionHead{display:block;margin-bottom:22px}.sectionHead p{max-width:none}.grades{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.gradeTop{height:145px}.gradeBody{padding:14px}.gradeBody h3{font-size:22px}.price{font-size:21px}
  .guideGrid{grid-template-columns:1fr}.guideVisual{min-height:280px}.festival .festIn{display:block}.festCountdown{text-align:left;margin-top:5px}
  .formgrid{grid-template-columns:1fr!important}.full{grid-column:auto!important}.modalCard{width:min(100%,520px)!important;max-height:calc(100dvh - 24px)!important;overflow:auto!important}.pay img{max-width:210px}.row{flex-wrap:wrap}.row>.btn,.row>a.btn{flex:1 1 160px}
}
@media (max-width:520px){
  .container{width:calc(100% - 20px)}body{font-size:15px}.topbar{font-size:11px;padding:7px 10px}.navin{height:58px}.navActions{gap:5px}.iconbtn,.langbtn{padding:8px 9px;border-radius:10px}.logo{gap:7px}.logoText small{display:none}
  .hero h1{font-size:clamp(34px,11vw,48px);letter-spacing:-.8px}.heroCopy{font-size:15px}.heroBtns{display:grid;grid-template-columns:1fr;width:100%;margin:22px 0}.heroBtns .btn{width:100%}.trust{font-size:11px;padding:7px 9px}.heroVisual{min-height:270px}.productHero{width:72%;border-radius:26px}.orbit{width:260px}
  section{padding:44px 0}.sectionHead h2{font-size:31px}.grades{grid-template-columns:1fr;gap:14px}.gradeTop{height:180px}.gradeBody h3{font-size:24px}.priceRow{align-items:center}.qty button{width:40px;height:40px}.add{min-height:46px}
  .guideVisual{min-height:230px;border-radius:24px}.card{border-radius:20px}.festival{font-size:12px}.festIn{padding:10px 0}
  .modalCard{border-radius:18px!important;padding-bottom:max(14px,env(safe-area-inset-bottom))!important}.modalHead{gap:10px}.close{flex:0 0 auto}.btn{min-height:44px;padding:11px 14px}.formgrid input,.formgrid textarea,.formgrid select,.modalCard input,.modalCard textarea{width:100%;min-height:46px}.row{gap:8px}.row>.btn,.row>a.btn{flex-basis:100%}
}
@media (max-width:360px){.logoText{display:none}.hero h1{font-size:32px}.heroVisual{min-height:230px}.orbit{width:220px}.productHero{width:68%}.sectionHead h2{font-size:28px}}
@media (prefers-reduced-motion:reduce){*,*::before,*::after{scroll-behavior:auto!important;animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important}}
`;

const CATALOG_BRIDGE=`<script>(function(){function boot(){try{fetch("/api/catalog",{cache:"no-store"}).then(function(r){return r.ok?r.json():null}).then(function(c){if(!c||!Array.isArray(c.products)||!c.products.length)return;try{if(window.data){window.data.products=c.products;localStorage.setItem("rkCashewData",JSON.stringify(window.data));if(window.renderProducts)window.renderProducts()}}catch(e){};if(location.search.indexOf("admin=1")>=0)installAdmin(c.products)}).catch(function(){})}catch(e){}}function installAdmin(products){var tries=0;function go(){tries++;var box=document.getElementById("admin-prices");if(!box){if(tries<30)setTimeout(go,500);return}if(document.getElementById("liveCatalogManager"))return;var wrap=document.createElement("div");wrap.id="liveCatalogManager";wrap.style.cssText="margin-top:14px;padding:14px;border:1px solid #ddd;border-radius:14px;background:#fff";wrap.innerHTML="<h4 style=\"margin:0 0 10px\">Add product</h4><div class=\"formgrid\"><div><label>Product name / code</label><input id=\"livePid\" placeholder=\"e.g. Roasted Cashew\"></div><div><label>Starting price / kg</label><input id=\"livePprice\" type=\"number\" min=\"1\" placeholder=\"₹\"></div><div class=\"full\"><label>Description</label><input id=\"livePdesc\" placeholder=\"Short product description\"></div><div class=\"full\"><label>Image path / URL (optional)</label><input id=\"livePimage\" placeholder=\"images/product.webp\"></div></div><button class=\"btn gold\" id=\"liveAddProduct\" style=\"margin-top:10px;width:100%\">Add product to website</button><p style=\"font-size:11px;color:#65708c\">New products are saved server-side and appear on the public shop.</p>";box.appendChild(wrap);document.getElementById("liveAddProduct").onclick=function(){var id=(document.getElementById("livePid").value||"").trim().toUpperCase(),price=Number(document.getElementById("livePprice").value),desc=(document.getElementById("livePdesc").value||"").trim(),image=(document.getElementById("livePimage").value||"").trim();if(!/^[A-Z0-9][A-Z0-9 _-]{0,29}$/.test(id))return alert("Enter a valid product name/code");if(!(price>0&&price<100000))return alert("Enter a valid price");var current=products.slice();if(current.some(function(p){return p.id===id}))return alert("Product already exists");current.push({id:id,price:price,desc:desc,stock:true,image:image,category:"Cashew"});fetch("/api/catalog",{method:"PUT",headers:{"content-type":"application/json"},body:JSON.stringify({products:current})}).then(function(r){return r.json()}).then(function(d){if(d&&d.error)throw new Error(d.error);alert(id+" added. Refreshing shop.");location.reload()}).catch(function(e){alert(e.message||"Could not add product")})};}go()}boot();window.addEventListener("load",boot)})();</script>`;
const SHOT_BRIDGE=`<script>(function(){try{var nativeFetch=window.fetch.bind(window);window.fetch=function(input,init){var u=typeof input==='string'?input:(input&&input.url)||'';var cfg=init||{};if(typeof u==='string'&&u.indexOf('/api/order')>=0&&cfg.body&&cfg.method==='POST'){try{var b=JSON.parse(cfg.body);if(b&&b.id&&b.phone)sessionStorage.setItem('rkShotPhone:'+b.id,String(b.phone).replace(/\\D/g,'').slice(-10))}catch(e){}}if(typeof u==='string'&&u.indexOf('/api/shot')>=0&&cfg.method==='POST'){try{var x=new URL(u,location.href),id=x.searchParams.get('id'),ph=sessionStorage.getItem('rkShotPhone:'+id);if(ph)x.searchParams.set('phone',ph);u=x.toString()}catch(e){}}return nativeFetch(u,cfg)}}catch(e){}})();</script>`;

async function secureResponse(res) {
  const h = new Headers(res.headers);
  h.set("X-Content-Type-Options", "nosniff");
  h.set("X-Frame-Options", "DENY");
  h.set("Referrer-Policy", "strict-origin-when-cross-origin");
  h.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(self https://checkout.razorpay.com)");
  h.set("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  h.set("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline' https://checkout.razorpay.com https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https:; connect-src 'self' https://checkout.razorpay.com https://api.razorpay.com https://api.postalpincode.in https://api.telegram.org https://graph.facebook.com; frame-src 'self' https://checkout.razorpay.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests");

  const ct=h.get("content-type")||"";
  if(ct.includes("text/html")){
    try{
      const text=await res.text();
      const injected=text.replace("</head>","<style id=\"rk-responsive\">"+RESPONSIVE_CSS+"</style></head>").replace("</body>",CATALOG_BRIDGE+SHOT_BRIDGE+"</body>");
      h.delete("content-length");
      h.set("content-type","text/html; charset=UTF-8");
      return new Response(injected,{status:res.status,statusText:res.statusText,headers:h});
    }catch(e){}
  }
  return new Response(res.body, {status: res.status, statusText: res.statusText, headers: h});
}

export default {
  ...base,
  async fetch(req, env, ctx) {
    try {
      const x = await handleExtra(req, env, ctx, base);
      return await secureResponse(x || await base.fetch(req, env, ctx));
    } catch (e) {
      return await secureResponse(new Response(JSON.stringify({error:"Internal server error"}), {status:500, headers:{"content-type":"application/json","cache-control":"no-store"}}));
    }
  }
};
