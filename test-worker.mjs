// Run: node test-worker.mjs [path-to-worker.js]   (no network, no Cloudflare needed)
import {createHmac} from "node:crypto";
import {pathToFileURL} from "node:url";
import fs from "node:fs";
const src=process.argv[2]||"./worker.js";
fs.copyFileSync(src,"/tmp/_w.mjs");
const W=(await import(pathToFileURL("/tmp/_w.mjs").href+"?"+Date.now())).default;
let pass=0,fail=0;const ok=(c,m)=>{c?pass++:fail++;console.log((c?"PASS ":"FAIL ")+m)};
class KV{constructor(){this.m=new Map()}async get(k){return this.m.has(k)?this.m.get(k):null}async put(k,v){this.m.set(k,String(v))}
 async list({prefix="",limit=1000}={}){return{keys:[...this.m.keys()].filter(k=>k.startsWith(prefix)).sort().slice(0,limit).map(name=>({name}))}}}
const env={KV:new KV(),ADMIN_USER:"admin",ADMIN_PASS:"pw123",SESSION_SECRET:"sess",RZP_KEY_ID:"rzp_test_x",RZP_KEY_SECRET:"secret1",RZP_WEBHOOK_SECRET:"whsec",
 ADMIN_TOTP:"GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ"};
let rzpN=0;const realFetch=globalThis.fetch;
globalThis.fetch=async(u,o)=>{u=String(u);if(u.includes("api.razorpay.com/v1/orders")){const b=JSON.parse(o.body);rzpN++;return new Response(JSON.stringify({id:"order_T"+rzpN,amount:b.amount}),{status:200})}
 if(u.includes("postalpincode"))return new Response(JSON.stringify([{PostOffice:[{District:"Cuddalore",State:"Tamil Nadu"}]}]));return new Response("{}")};
const ctx={waitUntil(){}};
let ipN=0;
async function call(method,path,body,{cookie,ip,raw,headers}={}){
 const h={"content-type":"application/json","cf-connecting-ip":ip||"1.1.1."+(++ipN),...(headers||{})};if(cookie)h.cookie=cookie;
 const r=await W.fetch(new Request("https://x.test"+path,{method,headers:h,body:raw!==undefined?raw:(body?JSON.stringify(body):undefined)}),env,ctx);
 let j=null;try{j=await r.clone().json()}catch(e){}return{s:r.status,j,r}}
// --- TOTP (RFC 6238 vector: time 59s -> 287082)
const realNow=Date.now;Date.now=()=>59000+ (0);
let r=await call("POST","/api/login",{u:"admin",p:"pw123",c:"287082"});ok(r.s===200,"TOTP: RFC6238 vector 287082 accepted");
r=await call("POST","/api/login",{u:"admin",p:"pw123",c:"000000"});ok(r.s===401,"TOTP: wrong code rejected");
r=await call("POST","/api/login",{u:"admin",p:"pw123"});ok(r.s===401,"TOTP: missing code rejected");
r=await call("POST","/api/login",{u:"admin",p:"bad",c:"287082"});ok(r.s===401,"Login: wrong password rejected");
Date.now=realNow;
// real login with current code
function totpNow(sec){const A="ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";let b="";for(const c of sec)b+=A.indexOf(c).toString(2).padStart(5,"0");const k=Buffer.from(b.match(/.{8}/g).map(x=>parseInt(x,2)));
 const t=Buffer.alloc(8);t.writeUInt32BE(Math.floor(Date.now()/30000),4);const h=createHmac("sha1",k).update(t).digest();const o=h[19]&15;return String(((h[o]&127)<<24|h[o+1]<<16|h[o+2]<<8|h[o+3])%1e6).padStart(6,"0")}
r=await call("POST","/api/login",{u:"admin",p:"pw123",c:totpNow(env.ADMIN_TOTP)});ok(r.s===200,"Login: live TOTP accepted");
const cookie=r.r.headers.get("set-cookie").split(";")[0];
r=await call("GET","/api/orders",null,{cookie});ok(r.s===200,"Admin session cookie works");
r=await call("GET","/api/orders");ok(r.s===401,"Orders require login");
// --- settings / GSTIN / coupons
r=await call("PUT","/api/settings",{gstin:"33ABCDE1234F1Z5",biz:"RK"},{cookie});ok(r.s===400,"GSTIN: bad checksum rejected");
r=await call("PUT","/api/settings",{gstin:"27AAPFU0939F1ZV",biz:"RK Cashew",freeAbove:5000,coupons:"RK10 pct 10 2099-12-31\nOFF50 flat 50\nOLD pct 20 2020-01-01"},{cookie});ok(r.s===200,"GSTIN: valid 15-char accepted");
r=await call("GET","/api/settings",null,{cookie});ok((r.j.coupons||"").split("\n").length===3,"Coupons keep one-per-line after save (3 lines)");
r=await call("GET","/api/settings");ok(r.j.coupons===undefined,"Coupons hidden from public");
r=await call("GET","/api/coupon?code=rk10");ok(r.j.ok===1&&r.j.type==="pct","Coupon 1st line works");
r=await call("GET","/api/coupon?code=OFF50");ok(r.j.ok===1&&r.j.type==="flat","Coupon 2nd line works");
r=await call("GET","/api/coupon?code=OLD");ok(r.j.ok===0,"Expired coupon rejected");
r=await call("GET","/api/coupon?code=NOPE");ok(r.j.ok===0,"Unknown coupon rejected");
// --- prices
r=await call("PUT","/api/prices",{prices:{W320:900,SP:700},stock:{W320:true,SP:true}},{cookie});ok(r.s===200,"Prices saved");
// --- order maths
const mk=(id,extra={})=>({id,name:"Test User",phone:"9876543210",pin:"607106",addr:"12 Main Street, Panruti",lines:[{id:"W320",q:1,price:900}],sub:900,gst:45,dlv:70,total:1015,consent:true,paid:false,...extra});
r=await call("POST","/api/order",mk("RK-T-0001"));ok(r.s===200,"Order placed");
let o=(await call("GET","/api/orders",null,{cookie})).j.orders.find(x=>x.id==="RK-T-0001");
ok(o&&o.total===1015&&o.gst===45&&o.disc===0,"Total no coupon: 900+45 GST+70 = 1015");
r=await call("POST","/api/order",mk("RK-T-0002",{coupon:"RK10",total:1015}));
o=(await call("GET","/api/orders",null,{cookie})).j.orders.find(x=>x.id==="RK-T-0002");
ok(o.disc===90&&o.gst===40.5&&o.total===920.5,"10% coupon: 900-90=810, GST 40.50, +70 = 920.50 (got "+o.total+")");
r=await call("POST","/api/order",mk("RK-T-0003",{coupon:"OFF50"}));
o=(await call("GET","/api/orders",null,{cookie})).j.orders.find(x=>x.id==="RK-T-0003");
ok(o.disc===50&&o.gst===42.5&&o.total===962.5,"Flat 50: 850, GST 42.50, +70 = 962.50 (got "+o.total+")");
r=await call("POST","/api/order",mk("RK-T-0004",{lines:[{id:"W320",q:6,price:900}],dlv:200}));
o=(await call("GET","/api/orders",null,{cookie})).j.orders.find(x=>x.id==="RK-T-0004");
ok(o.dlv===0&&o.sub===5400,"Free delivery above 5000 forced by server");
r=await call("POST","/api/order",mk("RK-T-0005",{lines:[{id:"W320",q:1,price:1}],total:100}));
o=(await call("GET","/api/orders",null,{cookie})).j.orders.find(x=>x.id==="RK-T-0005");
ok(o.total===1015&&o.priceMismatch,"Tampered price/total corrected by server");
r=await call("POST","/api/order",mk("RK-T-0006",{lines:[{id:"W320",q:0,price:900}]}));ok(r.s===400,"Zero-quantity line rejected");
r=await call("POST","/api/order",mk("RK-T-0007",{consent:false}));ok(r.s===400,"No consent rejected");
r=await call("POST","/api/order",mk("RK-T-0001"));ok(r.s===409,"Duplicate order id rejected");
r=await call("POST","/api/order",mk("RK-T-0008",{lines:[{id:"ZZZ",q:1,price:900}]}));o=(await call("GET","/api/orders",null,{cookie})).j.orders.find(x=>x.id==="RK-T-0008");
// --- manual paid + invoice
let ord=(await call("GET","/api/orders",null,{cookie})).j.orders.find(x=>x.id==="RK-T-0001");
r=await call("PATCH","/api/order",{k:ord.k,status:"Paid"},{cookie});ok(r.s===200&&/^RK\/\d{4}-\d\d\/0001$/.test(r.j.order.inv||""),"Mark Paid gives invoice number ("+(r.j.order&&r.j.order.inv)+")");
r=await call("PATCH","/api/order",{k:ord.k,status:"Paid"},{cookie});ok(r.j.order.inv&&r.j.order.inv.endsWith("0001"),"Paid twice keeps same invoice no.");
r=await call("GET","/api/track?id=RK-T-0001&phone=9876543210");ok(r.s===200&&r.j.status==="Paid","Track works with id+phone");
r=await call("GET","/api/track?id=RK-T-0001&phone=9000000000");ok(r.s===404,"Track blocks wrong phone");
// --- screenshot
const img="data:image/jpeg;base64,/9j/4AAQSkZJRg==";
r=await call("POST","/api/shot?id=RK-T-0002",{img});ok(r.s===200,"Screenshot upload");
r=await call("GET","/api/shot?id=RK-T-0002",null,{cookie});ok(r.j.img===img,"Admin can open screenshot");
r=await call("GET","/api/shot?id=RK-T-0002");ok(r.s===401,"Screenshot private");
r=await call("POST","/api/shot?id=RK-T-0002",{img:"data:text/html;base64,AAAA"});ok(r.s!==200,"Non-image upload refused");
// --- Razorpay
r=await call("GET","/api/config");ok(r.j.rzp===true&&r.j.key==="rzp_test_x"&&!JSON.stringify(r.j).includes("secret1"),"Config exposes only key id");
r=await call("POST","/api/order",mk("RK-R-0001"));r=await call("POST","/api/pay/create",{id:"RK-R-0001"});ok(r.j.rzpOrder&&r.j.amount===101500,"Razorpay order amount from server total (paise)");
const rz1=r.j.rzpOrder;
r=await call("POST","/api/pay/create",{id:"RK-R-0001"});ok(r.j.rzpOrder===rz1,"Second click reuses same Razorpay order");
const sig=(oid,pid,s="secret1")=>createHmac("sha256",s).update(oid+"|"+pid).digest("hex");
r=await call("POST","/api/pay/verify",{id:"RK-R-0001",razorpay_order_id:rz1,razorpay_payment_id:"pay_1",razorpay_signature:"bad"});ok(r.s===400,"Verify: forged signature rejected");
r=await call("POST","/api/pay/verify",{id:"RK-R-0001",razorpay_order_id:rz1,razorpay_payment_id:"pay_1",razorpay_signature:sig(rz1,"pay_1")});ok(r.j.ok===1,"Verify: real signature accepted");
o=(await call("GET","/api/orders",null,{cookie})).j.orders.find(x=>x.id==="RK-R-0001");ok(o.status==="Paid"&&o.payId==="pay_1"&&o.inv,"Order auto-Paid with invoice");
// webhook
r=await call("POST","/api/order",mk("RK-R-0002"));r=await call("POST","/api/pay/create",{id:"RK-R-0002"});const rz2=r.j.rzpOrder;
const ev=JSON.stringify({event:"payment.captured",payload:{payment:{entity:{id:"pay_2",order_id:rz2,amount:101500,notes:{}}}}});
r=await call("POST","/api/pay/webhook",null,{raw:ev,headers:{"x-razorpay-signature":"bad"}});ok(r.s===400,"Webhook: bad signature rejected");
r=await call("POST","/api/pay/webhook",null,{raw:ev,headers:{"x-razorpay-signature":createHmac("sha256","whsec").update(ev).digest("hex")}});
o=(await call("GET","/api/orders",null,{cookie})).j.orders.find(x=>x.id==="RK-R-0002");ok(o.status==="Paid","Webhook marks Paid even when notes are missing");
const ev2=JSON.stringify({event:"payment.captured",payload:{payment:{entity:{id:"pay_3",order_id:"order_T99",amount:1,notes:{order_id:"RK-R-0002"}}}}});
// underpay webhook must not pay
await call("POST","/api/order",mk("RK-R-0003"));r=await call("POST","/api/pay/create",{id:"RK-R-0003"});
const ev3=JSON.stringify({event:"payment.captured",payload:{payment:{entity:{id:"pay_4",order_id:r.j.rzpOrder,amount:100,notes:{}}}}});
await call("POST","/api/pay/webhook",null,{raw:ev3,headers:{"x-razorpay-signature":createHmac("sha256","whsec").update(ev3).digest("hex")}});
o=(await call("GET","/api/orders",null,{cookie})).j.orders.find(x=>x.id==="RK-R-0003");ok(o.status!=="Paid","Webhook with wrong amount does NOT mark Paid");
// unknown-price orders cannot pay online
env.KV.m.delete("prices");await call("POST","/api/order",mk("RK-R-0004",{total:1}));r=await call("POST","/api/pay/create",{id:"RK-R-0004"});ok(r.s!==200,"Online payment refused when server has no price list (tampered total)");
await call("PUT","/api/prices",{prices:{W320:900,SP:700}},{cookie});
// misc
r=await call("POST","/api/order",mk("RK-O-0001"),{headers:{origin:"null"}});ok(r.s>=400&&r.s<500,"Origin 'null' handled without crash (got "+r.s+")");
r=await call("POST","/api/order",mk("RK-O-0002"),{headers:{origin:"https://evil.test"}});ok(r.s===403,"Cross-site origin blocked");
let last;for(let i=0;i<40;i++){last=await call("GET","/api/coupon?code=X"+i,null,{ip:"9.9.9.9"})}ok(last.s===429,"Coupon guessing is rate-limited");
console.log(`\n${pass} passed, ${fail} failed`);process.exit(fail?1:0);
