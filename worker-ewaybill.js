/* RK Cashew Panruti — fail-closed E-Way Bill GSP foundation.
 * Provider-specific network calls are intentionally absent until the approved GSP's
 * official API specification, environment, auth/encryption contract and credentials
 * are verified. Never report an EBN unless the provider's successful response returns it.
 */
const json = (body, status=200) => new Response(JSON.stringify(body), {
  status, headers: { "content-type":"application/json; charset=utf-8", "cache-control":"no-store" }
});
const clean = (v, max=240) => String(v ?? "").replace(/[\u0000-\u001f<>]/g, " ").trim().slice(0,max);
const validGstin = v => !v || /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(String(v).toUpperCase());
const allowedModes = new Set(["Road","Rail","Air","Ship"]);

// Verify the same signed rkS session cookie used by worker.js. Do not treat a
// successful public /api/orders response as proof of admin authorization.
async function sessionSignature(value, secret) {
  const key = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(secret),
    { name:"HMAC", hash:"SHA-256" }, false, ["sign"]
  );
  const sig = new Uint8Array(await crypto.subtle.sign(
    "HMAC", key, new TextEncoder().encode(String(value))
  ));
  return btoa(String.fromCharCode(...sig))
    .replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/g,"");
}
const isAdmin = async (req, env) => {
  try {
    if (!env.SESSION_SECRET) return false;
    const m = (req.headers.get("cookie") || "").match(/(?:^|;\s*)rkS=(\d+)\.([\w-]+)/);
    if (!m || !/^\d+$/.test(m[1]) || Number(m[1]) < Date.now()) return false;
    const expected = await sessionSignature(m[1], env.SESSION_SECRET);
    if (expected.length !== m[2].length) return false;
    let diff = 0;
    for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ m[2].charCodeAt(i);
    return diff === 0;
  } catch { return false; }
};
const storage = env => env.KV && typeof env.KV.get==="function" ? env.KV : null;
const providerStatus = env => ({
  providerLabel: "Crunch cashew co",
  mode: "not_configured",
  ready: false,
  reason: "Official GSP API documentation and production/sandbox access have not been verified. E-Way Bill generation is disabled.",
  missing: [
    ...(!env.EWB_GSP_BASE_URL ? ["EWB_GSP_BASE_URL (provider-confirmed environment base URL)"] : []),
    ...(!env.EWB_GSP_CLIENT_ID ? ["EWB_GSP_CLIENT_ID"] : []),
    ...(!env.EWB_GSP_CLIENT_SECRET ? ["EWB_GSP_CLIENT_SECRET (Cloudflare secret)"] : []),
    ...(!env.EWB_GSP_API_SPEC_VERIFIED ? ["provider API specification verification"] : [])
  ]
});

function validateDispatch(d) {
  const errors=[];
  if(!clean(d.transporterName,160)) errors.push("Courier/transporter name is required.");
  if(d.transporterGstin && !validGstin(clean(d.transporterGstin,15).toUpperCase())) errors.push("Transporter GSTIN format is invalid.");
  if(!allowedModes.has(d.transportMode)) errors.push("Select Road, Rail, Air, or Ship.");
  if(!clean(d.dispatchFromAddress,400)) errors.push("Dispatch-from address is required.");
  if(!/^\d{6}$/.test(clean(d.dispatchFromPincode,6))) errors.push("Dispatch-from PIN must be 6 digits.");
  if(!clean(d.shipToAddress,400)) errors.push("Ship-to address is required.");
  if(!/^\d{6}$/.test(clean(d.shipToPincode,6))) errors.push("Ship-to PIN must be 6 digits.");
  if(d.vehicleNumber && !/^[A-Z0-9 -]{5,20}$/i.test(clean(d.vehicleNumber,20))) errors.push("Vehicle number format needs review.");
  if(d.transDocDate && !/^\d{4}-\d{2}-\d{2}$/.test(String(d.transDocDate))) errors.push("Transport document date must use YYYY-MM-DD.");
  return errors;
}

export async function ewaybill(req, env, ctx, base) {
  const u=new URL(req.url), p=u.pathname, method=req.method;
  if(!p.startsWith("/api/automation/ewaybill")) return null;
  if(!(await isAdmin(req,env))) return json({error:"Admin login required"},401);
  const kv=storage(env);
  if(!kv) return json({error:"Storage not configured"},503);

  if(p==="/api/automation/ewaybill/status" && method==="GET") {
    return json({ok:true,integration:providerStatus(env),capabilities:{saveDispatchDetails:true,generateEwayBill:false,updateVehicle:false,cancel:false}});
  }

  if(p==="/api/automation/ewaybill/dispatch" && method==="PUT") {
    const b=await req.json().catch(()=>null);
    if(!b || !/^[A-Za-z0-9_-]{4,60}$/.test(String(b.invoiceId||""))) return json({error:"A valid invoiceId is required."},400);
    const invoice=await kv.get("invoice:"+b.invoiceId,"json").catch(()=>null);
    if(!invoice) return json({error:"Invoice not found."},404);
    const d={
      invoiceId: invoice.id,
      transporterName:clean(b.transporterName,160),
      transporterGstin:clean(b.transporterGstin,15).toUpperCase(),
      transporterId:clean(b.transporterId,30),
      transportMode:clean(b.transportMode,10),
      transDocNo:clean(b.transDocNo,40),
      transDocDate:clean(b.transDocDate,10),
      vehicleNumber:clean(b.vehicleNumber,20).toUpperCase(),
      vehicleType:clean(b.vehicleType,20),
      dispatchFromAddress:clean(b.dispatchFromAddress,400),
      dispatchFromPincode:clean(b.dispatchFromPincode,6),
      shipToAddress:clean(b.shipToAddress || invoice.shipTo || invoice.address,400),
      shipToPincode:clean(b.shipToPincode,6),
      distanceKm: Number.isFinite(Number(b.distanceKm)) && Number(b.distanceKm)>0 ? Math.min(Number(b.distanceKm),5000) : null,
      updatedAt:Date.now(),
      status:"dispatch_details_saved_not_submitted"
    };
    const errors=validateDispatch(d);
    if(errors.length) return json({error:"Dispatch details need correction.",errors},422);
    await kv.put("ewaybill:dispatch:"+invoice.id,JSON.stringify(d),{expirationTtl:31536000});
    await kv.put("ewaybill:audit:"+invoice.id,JSON.stringify([{at:Date.now(),action:"dispatch-details-saved",status:d.status}]),{expirationTtl:31536000});
    return json({ok:true,dispatch:d,status:d.status,note:"Saved locally only. No E-Way Bill was submitted or generated."});
  }

  if(p==="/api/automation/ewaybill/dispatch" && method==="GET") {
    const id=clean(u.searchParams.get("invoiceId"),60);
    if(!/^[A-Za-z0-9_-]{4,60}$/.test(id)) return json({error:"A valid invoiceId is required."},400);
    const invoice=await kv.get("invoice:"+id,"json").catch(()=>null);
    if(!invoice) return json({error:"Invoice not found."},404);
    const dispatch=await kv.get("ewaybill:dispatch:"+id,"json").catch(()=>null);
    return json({ok:true,dispatch:dispatch||null});
  }

  if(p==="/api/automation/ewaybill/generate" && method==="POST") {
    const b=await req.json().catch(()=>null);
    const id=clean(b&&b.invoiceId,60);
    if(!/^[A-Za-z0-9_-]{4,60}$/.test(id)) return json({error:"A valid invoiceId is required."},400);
    const invoice=await kv.get("invoice:"+id,"json").catch(()=>null);
    if(!invoice) return json({error:"Invoice not found."},404);
    const dispatch=await kv.get("ewaybill:dispatch:"+id,"json").catch(()=>null);
    if(!dispatch) return json({error:"Save and validate dispatch details first."},422);
    const status=providerStatus(env);
    // Fail closed even if secrets exist: endpoint/auth/payload/encryption are provider-specific.
    // Do not send invoices or credentials to an unverified endpoint.
    return json({
      error:"E-Way Bill generation is disabled until the GSP contract is verified.",
      code:"GSP_SPEC_NOT_VERIFIED",
      integration:status,
      invoiceId:id,
      dispatchStatus:dispatch.status,
      ewayBillNumber:null,
      generated:false
    },503);
  }

  return json({error:"Not found"},404);
}
