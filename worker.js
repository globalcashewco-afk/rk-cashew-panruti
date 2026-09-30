// RK Cashew Panruti - API Worker. Static site is served by the assets binding; only /api/* runs here.
const J=(o,s=200,h={})=>new Response(JSON.stringify(o),{status:s,headers:{"content-type":"application/json","cache-control":"no-store",...h}});
const enc=new TextEncoder();
async function sign(s,k){const key=await crypto.subtle.importKey("raw",enc.encode(k),{name:"HMAC",hash:"SHA-256"},false,["sign"]);const b=await crypto.subtle.sign("HMAC",key,enc.encode(s));return btoa(String.fromCharCode(...new Uint8Array(b))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=/g,"")}
async function same(a,b){return (await sign(String(a),"cmp"))===(await sign(String(b),"cmp"))}
async function isAdmin(req,env){
  if(!env.SESSION_SECRET)return false;
  const m=(req.headers.get("cookie")||"").match(/(?:^|;\s*)rkS=(\d+)\.([\w-]+)/);
  if(!m||+m[1]<Date.now())return false;
  return same(m[2],await sign(m[1],env.SESSION_SECRET));
}
async function rl(env,key,max,ttl){const n=+(await env.KV.get(key)||0);if(n>=max)return false;await env.KV.put(key,String(n+1),{expirationTtl:ttl});return true}
const clean=(s,n)=>String(s==null?"":s).replace(/[\u0000-\u001f]/g," ").trim().slice(0,n);
function gstOk(g){if(!/^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(g))return false;const C="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";let s=0;for(let i=0;i<14;i++){const v=C.indexOf(g[i])*(i%2?2:1);s+=Math.floor(v/36)+v%36}return C[(36-s%36)%36]===g[14]}
function b32(s){const A="ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";let b="";for(const c of s.replace(/=+$/,"").toUpperCase()){const i=A.indexOf(c);if(i>=0)b+=i.toString(2).padStart(5,"0")}const o=[];for(let i=0;i+8<=b.length;i+=8)o.push(parseInt(b.slice(i,i+8),2));return new Uint8Array(o)}
async function totp(sec,t){const k=await crypto.subtle.importKey("raw",b32(sec),{name:"HMAC",hash:"SHA-1"},false,["sign"]);const d=new DataView(new ArrayBuffer(8));d.setUint32(4,t);const h=new Uint8Array(await crypto.subtle.sign("HMAC",k,d.buffer));const o=h[19]&15;return String((((h[o]&127)<<24)|(h[o+1]<<16)|(h[o+2]<<8)|h[o+3])%1e6).padStart(6,"0")}
function coupon(S,code){const c=String(code||"").trim().toUpperCase();if(!c)return null;const today=new Date().toISOString().slice(0,10);
  for(const ln of String(S.coupons||"").split("\n")){const [cd,ty,vl,ex]=ln.trim().split(/\s+/);if(cd&&cd.toUpperCase()===c&&(ty==="pct"||ty==="flat")&&+vl>0&&(!ex||ex>=today))return{code:c,type:ty,val:+vl}}return null}
function notify(env,ctx,o,text){const j=[];
  if(env.TG_TOKEN&&env.TG_CHAT)j.push(fetch("https://api.telegram.org/bot"+env.TG_TOKEN+"/sendMessage",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({chat_id:env.TG_CHAT,text})}));
  if(env.WA_TOKEN&&env.WA_PHONE_ID)j.push(fetch("https://graph.facebook.com/v20.0/"+env.WA_PHONE_ID+"/messages",{method:"POST",headers:{"content-type":"application/json",authorization:"Bearer "+env.WA_TOKEN},
    body:JSON.stringify({messaging_product:"whatsapp",to:"91"+o.phone,type:"template",template:{name:env.WA_TEMPLATE||"order_update",language:{code:"en"},components:[{type:"body",parameters:[o.name,o.id,o.status].map(t=>({type:"text",text:String(t)}))}]}})}));
  if(j.length){const p=Promise.allSettled(j);ctx&&ctx.waitUntil?ctx.waitUntil(p):0}}
async function hmacHex(k,d){const key=await crypto.subtle.importKey("raw",enc.encode(k),{name:"HMAC",hash:"SHA-256"},false,["sign"]);return [...new Uint8Array(await crypto.subtle.sign("HMAC",key,enc.encode(d)))].map(b=>b.toString(16).padStart(2,"0")).join("")}
async function getOrder(env,id){const k=await env.KV.get("id:"+id);if(!k)return[null,null];return[k,JSON.parse(await env.KV.get(k)||"null")]}
async function markPaid(env,k,o,ref){
  if(o.status==="Paid")return o;o.status="Paid";o.payId=ref;o.payVia="razorpay";o.paidAt=Date.now();(o.hist=o.hist||[]).push(["Paid",o.paidAt]);
  const S=JSON.parse(await env.KV.get("settings")||"{}");
  if(S.gstin&&gstOk(S.gstin)&&!o.inv){const d=new Date(),y=d.getMonth()>=3?d.getFullYear():d.getFullYear()-1,fy=y+"-"+String(y+1).slice(2),n=(+(await env.KV.get("invseq:"+fy)||0))+1;
    await env.KV.put("invseq:"+fy,String(n));o.inv="RK/"+fy+"/"+String(n).padStart(4,"0");o.invDate=Date.now()}
  await env.KV.put(k,JSON.stringify(o));return o}
const STAT=["Enquiry","Payment Pending","Paid","Packed","Shipped","Cancelled"];
async function body(req){const t=await req.text();if(t.length>8000)throw 0;return JSON.parse(t)}

export default {
  async fetch(req,env,ctx){
    const url=new URL(req.url),p=url.pathname;
    if(!p.startsWith("/api/"))return env.ASSETS?env.ASSETS.fetch(req):new Response("Not found",{status:404});
    if(!env.KV)return J({error:"Storage not configured"},503);
    const ip=req.headers.get("cf-connecting-ip")||"x";
    if(req.method!=="GET"){const o=req.headers.get("origin");let oh="";try{oh=new URL(o).host}catch(e){oh="bad"}if(o&&oh!==url.host)return J({error:"Bad origin"},403)}
    try{
      if(p==="/api/prices"&&req.method==="GET"){return J(JSON.parse(await env.KV.get("prices")||'{"prices":{},"updated":0}'))}
      if(p==="/api/settings"&&req.method==="GET"){const S=JSON.parse(await env.KV.get("settings")||"{}");if(!await isAdmin(req,env))delete S.coupons;return J(S)}
      if(p==="/api/coupon"&&req.method==="GET"){if(!await rl(env,"rl:cp:"+ip,30,3600))return J({error:"Too many tries"},429);const c=coupon(JSON.parse(await env.KV.get("settings")||"{}"),url.searchParams.get("code"));return J(c?{ok:1,...c}:{ok:0})}
      if(p==="/api/shot"&&req.method==="POST"){
        if(!await rl(env,"rl:shot:"+ip,10,3600))return J({error:"Too many"},429);
        const id=clean(url.searchParams.get("id"),30),k=await env.KV.get("id:"+id);if(!k)return J({error:"No order"},404);
        if(await env.KV.get("shot:"+id))return J({error:"Already uploaded"},409);
        const t=await req.text();if(t.length>500000)return J({error:"Image too large"},413);
        const im=JSON.parse(t).img;if(!/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+\/=]+$/.test(im||""))return J({error:"Bad image"},400);
        await env.KV.put("shot:"+id,im,{expirationTtl:5184000});const o=JSON.parse(await env.KV.get(k));o.hasShot=true;await env.KV.put(k,JSON.stringify(o));return J({ok:1});
      }
      if(p==="/api/config"&&req.method==="GET"){return J({rzp:!!(env.RZP_KEY_ID&&env.RZP_KEY_SECRET),key:env.RZP_KEY_ID||""})}
      if(p==="/api/pay/create"&&req.method==="POST"){
        if(!env.RZP_KEY_ID||!env.RZP_KEY_SECRET)return J({error:"Online payment not enabled"},503);
        if(!await rl(env,"rl:pay:"+ip,30,3600))return J({error:"Too many attempts"},429);
        const b=await body(req),[k,o]=await getOrder(env,clean(b.id,30));if(!o)return J({error:"Order not found"},404);if(o.status==="Paid"||o.status==="Cancelled")return J({error:"Order already "+o.status},409);
        if(!o.known)return J({error:"Prices not synced yet. Please pay by UPI QR, or try again shortly."},409);
        const amount=Math.round(o.total*100);
        if(o.rzpOrder)return J({rzpOrder:o.rzpOrder,amount});
        const r=await fetch("https://api.razorpay.com/v1/orders",{method:"POST",headers:{"content-type":"application/json",authorization:"Basic "+btoa(env.RZP_KEY_ID+":"+env.RZP_KEY_SECRET)},body:JSON.stringify({amount,currency:"INR",receipt:o.id,notes:{order_id:o.id}})});
        const d=await r.json();if(!r.ok||!d.id)return J({error:"Payment could not start"},502);
        o.rzpOrder=d.id;if(o.status==="Enquiry"){o.status="Payment Pending";(o.hist=o.hist||[]).push(["Payment Pending",Date.now()])}
        await env.KV.put("rzp:"+d.id,o.id);await env.KV.put(k,JSON.stringify(o));return J({rzpOrder:d.id,amount});
      }
      if(p==="/api/pay/verify"&&req.method==="POST"){
        if(!env.RZP_KEY_SECRET)return J({error:"Online payment not enabled"},503);
        if(!await rl(env,"rl:vfy:"+ip,60,3600))return J({ok:0},429);
        const b=await body(req),[k,o]=await getOrder(env,clean(b.id,30));if(!o||!o.rzpOrder||o.rzpOrder!==b.razorpay_order_id)return J({ok:0},400);
        if(!await same(b.razorpay_signature,await hmacHex(env.RZP_KEY_SECRET,o.rzpOrder+"|"+b.razorpay_payment_id)))return J({ok:0},400);
        const was=o.status;await markPaid(env,k,o,clean(b.razorpay_payment_id,40));if(was!=="Paid")notify(env,ctx,o,"PAID online: order "+o.id+" - "+o.name+" - Rs "+o.total);
        return J({ok:1});
      }
      if(p==="/api/pay/webhook"&&req.method==="POST"){
        if(!env.RZP_WEBHOOK_SECRET)return J({error:"Not configured"},503);
        const raw=await req.text();if(!await same(req.headers.get("x-razorpay-signature")||"",await hmacHex(env.RZP_WEBHOOK_SECRET,raw)))return J({error:"Bad signature"},400);
        const ev=JSON.parse(raw),pe=ev&&ev.payload&&ev.payload.payment&&ev.payload.payment.entity;
        if((ev.event==="payment.captured"||ev.event==="order.paid")&&pe&&pe.order_id){const oid=await env.KV.get("rzp:"+pe.order_id);const [k,o]=oid?await getOrder(env,oid):[null,null];
          if(o&&o.rzpOrder===pe.order_id&&pe.amount===Math.round(o.total*100)&&o.status!=="Paid"){await markPaid(env,k,o,clean(pe.id,40));notify(env,ctx,o,"PAID online: order "+o.id+" - "+o.name+" - Rs "+o.total)}}
        return J({ok:1});
      }
      if(p==="/api/pin"&&req.method==="GET"){
        const c=String(url.searchParams.get("code")||"");if(!/^\d{6}$/.test(c))return J({ok:false});
        if(!await rl(env,"rl:pin:"+ip,60,3600))return J({ok:null});
        const hit=await env.KV.get("pin:"+c);if(hit)return J(JSON.parse(hit));
        try{const r=await fetch("https://api.postalpincode.in/pincode/"+c,{cf:{cacheTtl:86400}});const d=await r.json(),po=d&&d[0]&&d[0].PostOffice&&d[0].PostOffice[0];
          const out=po?{ok:true,district:po.District,state:po.State}:{ok:false};await env.KV.put("pin:"+c,JSON.stringify(out),{expirationTtl:2592000});return J(out)}catch(e){return J({ok:null})}
      }
      if(p==="/api/track"&&req.method==="GET"){
        if(!await rl(env,"rl:trk:"+ip,60,3600))return J({error:"Too many tries. Try later."},429);
        const k=await env.KV.get("id:"+clean(url.searchParams.get("id"),40));if(!k)return J({error:"Not found"},404);
        const o=JSON.parse(await env.KV.get(k)||"null"),ph=String(url.searchParams.get("phone")||"").replace(/\D/g,"").slice(-10);
        if(!o||o.phone!==ph)return J({error:"Not found"},404);
        return J({id:o.id,status:o.status,track:o.track||"",total:o.total});
      }
      if(p==="/api/login"&&req.method==="POST"){
        if(!env.ADMIN_USER||!env.ADMIN_PASS||!env.SESSION_SECRET)return J({error:"Admin not configured"},503);
        if(!await rl(env,"rl:login:"+ip,5,900))return J({error:"Too many attempts. Try after 15 minutes."},429);
        const b=await body(req);
        const ok=(await same(b.u,env.ADMIN_USER))&(await same(b.p,env.ADMIN_PASS));
        if(!ok)return J({error:"Login details not accepted."},401);
        if(env.ADMIN_TOTP){const n=Math.floor(Date.now()/30000);let good=false;for(const d of [-1,0,1])if(await same(String(b.c||"").replace(/\D/g,""),await totp(env.ADMIN_TOTP,n+d)))good=true;if(!good)return J({error:"Enter the 6-digit code from your authenticator app."},401)}
        const exp=String(Date.now()+8*3600e3);
        return J({ok:1},200,{"set-cookie":`rkS=${exp}.${await sign(exp,env.SESSION_SECRET)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=28800`});
      }
      if(p==="/api/logout"){return J({ok:1},200,{"set-cookie":"rkS=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0"})}
      if(p==="/api/order"&&req.method==="POST"){
        if(!await rl(env,"rl:order:"+ip,20,3600))return J({error:"Too many orders"},429);
        const b=await body(req);
        const id=clean(b.id,30),phone=String(b.phone||"").replace(/\D/g,"").slice(-10),pin=String(b.pin||"").replace(/\D/g,"");
        const name=clean(b.name,80),addr=clean(b.addr,300),total=Number(b.total);
        if(!/^[A-Za-z0-9-]{4,30}$/.test(id)||!/^[6-9]\d{9}$/.test(phone)||!/^\d{6}$/.test(pin)||name.length<2||addr.length<5||!(total>0&&total<1e6)||!Array.isArray(b.lines)||!b.lines.length||b.lines.length>20)return J({error:"Invalid order"},400);
        if(b.consent!==true)return J({error:"Consent required"},400);
        if(b.lines.some(l=>!l||!(+l.q>=0.5)))return J({error:"Minimum 0.5 kg per grade"},400);
        if(await env.KV.get("id:"+id))return J({error:"Duplicate"},409);
        const utr=String(b.utr||"").replace(/\D/g,"");let dupUtr=false;
        if(/^\d{12}$/.test(utr)){dupUtr=!!await env.KV.get("utr:"+utr);await env.KV.put("utr:"+utr,id)}
        const pj=JSON.parse(await env.KV.get("prices")||"{}"),sp=pj.prices||{},sk=pj.stock||{};
        if(b.lines.some(l=>sk[clean(l.id,20)]===false))return J({error:"A grade in your order is out of stock"},409);
        const ps=JSON.parse(await env.KV.get("pin:"+pin)||"{}");let known=true,mis=false;
        const lines=b.lines.map(l=>{const id2=clean(l.id,20),q=Math.min(Math.max(+l.q||0,0),500);let pr=+l.price||0;
          if(sp[id2]){if(sp[id2]!==pr)mis=true;pr=sp[id2]}else known=false;return{id:id2,q,price:pr,amt:Math.round(q*pr*100)/100}});
        const SS=JSON.parse(await env.KV.get("settings")||"{}"),cp=coupon(SS,b.coupon),sub=lines.reduce((a,l)=>a+l.amt,0);
        let dlv=Math.min(Math.max(+b.dlv||0,0),3000);if(SS.freeAbove>0&&sub>=SS.freeAbove)dlv=0;
        const disc=cp?(cp.type==="pct"?Math.round(sub*cp.val)/100:Math.min(cp.val,sub)):0,gst=Math.round((sub-disc)*5)/100;
        const stotal=Math.round((sub-disc+gst+dlv)*100)/100;if(known&&Math.abs(stotal-total)>1)mis=true;
        const o={id,name,phone,pin,addr,total:known?stotal:total,known,browserTotal:total,priceMismatch:mis,sub:known?sub:(+b.sub||0),gst:known?gst:(+b.gst||0),dlv,disc:known?disc:0,coupon:cp?cp.code:"",
          lines,
          utr:/^\d{12}$/.test(utr)?utr:"",dupUtr,state:ps.state||"",consentAt:Date.now(),lang:clean(b.lang,5),
          status:b.paid?"Payment Pending":"Enquiry",t:Date.now()};
        const k="o:"+String(9e12-o.t).padStart(13,"0")+":"+id;
        await env.KV.put(k,JSON.stringify(o));await env.KV.put("id:"+id,k);
        notify(env,ctx,o,"New order "+id+" - "+name+" - Rs "+o.total+" - "+o.status);
        return J({ok:1,id});
      }
      if(!await isAdmin(req,env))return J({error:"Login required"},401);
      if(p==="/api/shot"&&req.method==="GET"){const im=await env.KV.get("shot:"+clean(url.searchParams.get("id"),30));return im?J({img:im}):J({error:"None"},404)}
      if(p==="/api/orders"&&req.method==="GET"){
        const l=await env.KV.list({prefix:"o:",limit:40});
        const rows=await Promise.all(l.keys.map(async x=>{const o=JSON.parse(await env.KV.get(x.name)||"null");if(o)o.k=x.name;return o}));
        return J({orders:rows.filter(Boolean)});
      }
      if(p==="/api/order"&&req.method==="PATCH"){
        const b=await body(req),k=clean(b.k,80);if(!k.startsWith("o:"))return J({error:"Bad key"},400);
        const o=JSON.parse(await env.KV.get(k)||"null");if(!o)return J({error:"Not found"},404);
        if(b.status){if(!STAT.includes(b.status))return J({error:"Bad status"},400);
          if(b.status==="Paid"&&!o.inv){const s=JSON.parse(await env.KV.get("settings")||"{}");
            if(!s.gstin||!gstOk(s.gstin))return J({error:"Save a valid GSTIN in the Store tab first, then mark Paid."},400);
            const d=new Date(),y=d.getMonth()>=3?d.getFullYear():d.getFullYear()-1,fy=y+"-"+String(y+1).slice(2),n=(+(await env.KV.get("invseq:"+fy)||0))+1;
            await env.KV.put("invseq:"+fy,String(n));o.inv="RK/"+fy+"/"+String(n).padStart(4,"0");o.invDate=Date.now()}o.status=b.status;(o.hist=o.hist||[]).push([b.status,Date.now()])}
        if(b.track!=null)o.track=clean(b.track,60);
        await env.KV.put(k,JSON.stringify(o));if(b.status)notify(env,ctx,o,"Order "+o.id+" is now "+o.status);return J({ok:1,order:o});
      }
      if(p==="/api/prices"&&req.method==="PUT"){
        const b=await body(req),out={},st={};
        for(const [id,v] of Object.entries(b.prices||{})){const n=Number(v);if(/^[A-Za-z0-9 -]{1,20}$/.test(id)&&n>0&&n<100000){out[id]=n;st[id]=(b.stock||{})[id]!==false}}
        await env.KV.put("prices",JSON.stringify({prices:out,stock:st,updated:Date.now()}));return J({ok:1});
      }
      if(p==="/api/settings"&&req.method==="PUT"){
        const b=await body(req),old=JSON.parse(await env.KV.get("settings")||"{}"),g=b.gstin!=null?clean(b.gstin,15).toUpperCase():String(old.gstin||"");
        if(g&&!gstOk(g))return J({error:"GSTIN is not valid (15 characters, e.g. 33ABCDE1234F1Z5). Please check it."},400);
        const val=(key,max,fallback="")=>b[key]!=null?clean(b[key],max):String(old[key]||fallback);
        const coupons=b.coupons!=null?String(b.coupons||"").replace(/\r/g,"").replace(/;/g,"\n").split("\n").map(x=>clean(x,80)).filter(Boolean).slice(0,50).join("\n"):String(old.coupons||"");
        const freeAbove=b.freeAbove!=null?Math.max(0,+b.freeAbove||0):Math.max(0,+old.freeAbove||0);
        await env.KV.put("settings",JSON.stringify({freeAbove,coupons,biz:val("biz",80),addr:val("addr",200),phone:val("phone",20),wa:val("wa",20),tagline:val("tagline",160),fssai:val("fssai",20),gstin:g,hsn:val("hsn",8,"0801")||"0801",upi:val("upi",120),upiName:val("upiName",80)}));return J({ok:1});
      }
      return J({error:"Not found"},404);
    }catch(e){return J({error:"Bad request"},400)}
  }
};
