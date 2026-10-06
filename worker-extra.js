/* RK Cashew Panruti – worker-extra.js
   Server routes: add/delete extra products, mark orders Delivered, delete Delivered/Cancelled orders.
   Uses your existing admin login by asking your original worker (GET /api/orders) – no auth code duplicated. */
const PKEY="rk:extra-products";
const J=(o,s=200,h={})=>new Response(JSON.stringify(o),{status:s,headers:{"content-type":"application/json","cache-control":"no-store",...h}});
function findKV(env){for(const k of Object.keys(env||{})){const v=env[k];if(v&&typeof v.get==="function"&&typeof v.put==="function"&&typeof v.delete==="function"&&typeof v.list==="function")return v}return null}
async function isAdmin(req,env,ctx,base){try{const u=new URL(req.url);u.pathname="/api/orders";u.search="";const r=await base.fetch(new Request(u.toString(),{method:"GET",headers:req.headers}),env,ctx);return r.status===200}catch(e){return false}}
const clean=(s,n)=>String(s==null?"":s).replace(/[\u0000-\u001f<>]/g,"").trim().slice(0,n);
async function shotUpload(req,env){
  const url=new URL(req.url),origin=req.headers.get("origin");
  if(origin){try{if(new URL(origin).host!==url.host)return J({error:"Bad origin"},403)}catch(e){return J({error:"Bad origin"},403)}}
  const kv=findKV(env);if(!kv)return J({error:"Storage not configured"},503);
  const ip=req.headers.get("cf-connecting-ip")||"x",rlk="rl:shot:"+ip,n=+(await kv.get(rlk)||0);
  if(n>=10)return J({error:"Too many"},429);
  await kv.put(rlk,String(n+1),{expirationTtl:3600});
  const id=clean(url.searchParams.get("id"),30),phone=String(url.searchParams.get("phone")||"").replace(/\D/g,"").slice(-10);
  if(!/^[6-9]\d{9}$/.test(phone))return J({error:"Order verification required"},401);
  const k=await kv.get("id:"+id);if(!k)return J({error:"No order"},404);
  const o=await kv.get(k,"json").catch(()=>null);if(!o||o.phone!==phone)return J({error:"Order verification failed"},403);
  if(await kv.get("shot:"+id))return J({error:"Already uploaded"},409);
  const raw=await req.text();if(raw.length>500000)return J({error:"Image too large"},413);
  const b=JSON.parse(raw||"{}");
  const im=b.img;
  if(!/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+\/=]+$/.test(im||""))return J({error:"Bad image"},400);
  await kv.put("shot:"+id,im,{expirationTtl:5184000});o.hasShot=true;await kv.put(k,JSON.stringify(o));
  return J({ok:1});
}
export async function handleExtra(req,env,ctx,base){
  const url=new URL(req.url),p=url.pathname,m=req.method;
  if(p==="/api/shot"&&m==="POST")return shotUpload(req,env);
  if(p==="/api/products-extra"){
    const kv=findKV(env);if(!kv)return J({error:"No KV storage binding found on this worker"},501);
    const list=async()=>{try{const a=await kv.get(PKEY,"json");return Array.isArray(a)?a:[]}catch(e){return[]}};
    if(m==="GET")return J({products:await list()});
    if(m!=="POST"&&m!=="DELETE")return J({error:"Method not allowed"},405);
    if(!(await isAdmin(req,env,ctx,base)))return J({error:"Admin login required"},401);
    const arr=await list();
    if(m==="DELETE"){const id=clean(url.searchParams.get("id"),12).toUpperCase();await kv.put(PKEY,JSON.stringify(arr.filter(x=>x.id!==id)));return J({ok:true})}
    const b=await req.json().catch(()=>null);if(!b)return J({error:"Bad request"},400);
    const id=clean(b.id,12).toUpperCase(),name=clean(b.name,60),price=Math.round(Number(b.price)*100)/100;
    if(!/^[A-Z0-9-]{2,12}$/.test(id))return J({error:"Invalid product code"},400);
    if(name.length<2)return J({error:"Name required"},400);
    if(!(price>0&&price<=100000))return J({error:"Invalid price"},400);
    const rec={id,name,price,desc:clean(b.desc,120),stock:b.stock!==false&&b.stock!==0&&b.stock!=="0"},i=arr.findIndex(x=>x.id===id);
    if(i>-1)arr[i]=rec;else{if(arr.length>=100)return J({error:"Limit of 100 extra products reached"},400);arr.push(rec)}
    await kv.put(PKEY,JSON.stringify(arr));return J({ok:true,product:rec});
  }
  if(p==="/api/order"&&(m==="DELETE"||m==="PATCH")){
    let k,body=null;
    if(m==="PATCH"){body=await req.clone().json().catch(()=>null);if(!body||body.status!=="Delivered")return null;k=body.k}
    else k=url.searchParams.get("k");
    if(typeof k!=="string"||!k||k.length>200)return J({error:"Bad order key"},400);
    if(!(await isAdmin(req,env,ctx,base)))return J({error:"Admin login required"},401);
    const kv=findKV(env);if(!kv)return J({error:"No KV storage binding found on this worker"},501);
    const o=await kv.get(k,"json").catch(()=>null);if(!o||typeof o!=="object")return J({error:"Order not found"},404);
    if(m==="PATCH"){o.status="Delivered";o.deliveredAt=Date.now();await kv.put(k,JSON.stringify(o));return J({ok:true})}
    if(o.status!=="Delivered"&&o.status!=="Cancelled")return J({error:"Only Delivered or Cancelled orders can be deleted"},400);
    await kv.delete(k);return J({ok:true});
  }
  return null;
}
