/* RK Cashew final entry: production wrapper + OCR/manual automation */
import wrapped from "./worker-wrapped.js";
import { automation } from "./worker-automation.js";
import { ewaybill } from "./worker-ewaybill.js";

const ROYAL_CSS = `
/* ===== RK CASHEW ROYAL ADMIN + INVOICE UI ===== */
:root{--rk-navy:#071126;--rk-navy2:#102552;--rk-gold:#d6aa4b;--rk-gold2:#f1d58a;--rk-cream:#fffaf0;--rk-ink:#14203a;--rk-line:#cfd6e4;--rk-muted:#59677f}
html{background:#071126}
body{color:var(--rk-ink)!important}
label{color:#17243e!important;font-weight:800!important;letter-spacing:.05px}
input,textarea,select{background:#fff!important;color:#111c33!important;border:1.5px solid #aeb9cc!important;border-radius:13px!important;min-height:46px!important;box-shadow:inset 0 1px 2px rgba(7,17,38,.04)!important;opacity:1!important}
textarea{min-height:82px!important;line-height:1.5!important}
input::placeholder,textarea::placeholder{color:#6b778c!important;opacity:1!important}
select{color:#111c33!important}
select option{background:#fff!important;color:#111c33!important}
input:focus,textarea:focus,select:focus{outline:3px solid rgba(214,170,75,.20)!important;border-color:#b98b2e!important;box-shadow:0 0 0 1px #b98b2e,inset 0 1px 2px rgba(7,17,38,.04)!important}
#admin-billing .adminProduct{background:linear-gradient(145deg,#fff,#fffaf0)!important;border:1px solid #d8c58f!important;box-shadow:0 14px 40px rgba(7,17,38,.10)!important;border-radius:22px!important;color:#17243e!important}
#admin-billing h3,#admin-billing h4{color:#071126!important}
#admin-billing .adminTabs{background:#eef2f8!important;border:1px solid #d4dce9!important;border-radius:16px!important;padding:6px!important;gap:6px!important}
#admin-billing .adminTabs button{background:#fff!important;color:#26344d!important;border:1px solid #d2d9e5!important;border-radius:11px!important;font-weight:800!important;padding:10px 12px!important}
#admin-billing .adminTabs button.active{background:linear-gradient(135deg,#071126,#17336c)!important;color:#f7d982!important;border-color:#071126!important}
#rkBillLines{display:grid;gap:12px}
#rkBillLines>.billLine,#rkBillLines>.adminProduct,#rkBillLines>div{background:#f8fafc!important;color:#14203a!important;border:1px solid #d7deea!important;border-radius:18px!important;padding:14px!important}
#rkBillTotals{background:linear-gradient(135deg,#071126,#17336c)!important;color:#fff!important;border:1px solid #cfa84f!important;box-shadow:0 10px 26px rgba(7,17,38,.16)!important}
#rkBillMsg,#rkOcrReview,#stMsg{font-weight:700!important}
#rkBill-seller{background:linear-gradient(145deg,#fff,#fbf4df)!important}
#rkSellerList,#rkInvoiceList{color:#17243e!important}
#rkSellerList table,#rkInvoiceList table{width:100%!important;border-collapse:separate!important;border-spacing:0!important;background:#fff!important;border:1px solid #d4dce8!important;border-radius:16px!important;overflow:hidden!important}
#rkSellerList th,#rkInvoiceList th{background:#071126!important;color:#f4d98d!important;padding:12px!important;text-align:left!important;font-weight:800!important;white-space:nowrap!important}
#rkSellerList td,#rkInvoiceList td{background:#fff!important;color:#17243e!important;padding:11px!important;border-top:1px solid #e3e7ee!important;vertical-align:top!important}
#rkSellerList tr:nth-child(even) td,#rkInvoiceList tr:nth-child(even) td{background:#f8fafc!important}
#admin-billing .btn.gold{background:linear-gradient(135deg,#f1d58a,#b98427)!important;color:#1c1507!important;border:1px solid #a9781f!important}
#admin-billing .btn.ghost{background:#071126!important;color:#fff!important;border-color:#071126!important}
/* Professional invoice HTML */
body:has(.inv){background:radial-gradient(circle at 15% 0,#182e63 0,transparent 34%),linear-gradient(135deg,#071126,#101f45)!important;padding:28px!important;color:#17243e!important}
.inv{max-width:980px!important;margin:20px auto!important;background:#fff!important;border:0!important;border-radius:24px!important;padding:0!important;overflow:hidden!important;box-shadow:0 30px 80px rgba(0,0,0,.30)!important}
.inv .head{padding:30px 34px!important;background:linear-gradient(135deg,#071126 0%,#17336c 70%,#9a6b20 150%)!important;color:#fff!important;position:relative!important}
.inv .head:after{content:"RK CASHEW • PANRUTI";position:absolute;right:28px;bottom:20px;color:rgba(255,255,255,.16);font-size:11px;font-weight:900;letter-spacing:2px}
.inv .head h1{margin:0 0 7px!important;color:#f3d88f!important;font-size:32px!important;letter-spacing:.2px!important}
.inv .head .right{background:rgba(255,255,255,.10)!important;border:1px solid rgba(255,255,255,.20)!important;border-radius:16px!important;padding:14px 16px!important;color:#fff!important;min-width:270px!important}
.inv .head .right h2{color:#fff!important;margin:0 0 8px!important;letter-spacing:1.5px!important}
.inv>hr{border:0!important;border-top:1px solid #e0e5ed!important;margin:0!important}
.inv>h3,.inv>table,.inv>.tot,.inv>p{margin-left:34px!important;margin-right:34px!important}
.inv>h3{color:#071126!important;margin-top:24px!important;margin-bottom:8px!important;font-size:17px!important}
.inv>h3+div{background:#f8fafc!important;border:1px solid #dbe1eb!important;border-left:5px solid #c89b3c!important;border-radius:14px!important;padding:13px 15px!important;line-height:1.7!important}
.inv table{margin-top:22px!important;border-collapse:separate!important;border-spacing:0!important;border:1px solid #cfd7e4!important;border-radius:15px!important;overflow:hidden!important}
.inv th{background:#071126!important;color:#f1d58a!important;padding:12px 10px!important;border:0!important;font-weight:800!important;text-align:left!important}
.inv td{padding:11px 10px!important;border:0!important;border-top:1px solid #e4e8ef!important;color:#17243e!important;background:#fff!important}
.inv tbody tr:nth-child(even) td{background:#f8fafc!important}
.inv .tot{margin-top:20px!important;background:#f8fafc!important;border:1px solid #d9e0eb!important;border-radius:16px!important;padding:12px 16px!important}
.inv .tot div{padding:7px 2px!important;color:#34415a!important}
.inv .tot .grand{border-top:2px solid #b98b2e!important;margin-top:8px!important;padding-top:12px!important;font-size:20px!important;color:#071126!important}
.inv>p{color:#59677f!important;border-top:1px solid #e3e7ee!important;padding-top:12px!important}
.print{right:28px!important;top:20px!important;background:#f1d58a!important;color:#171004!important;border:1px solid #a9781f!important;border-radius:12px!important;font-weight:800!important;box-shadow:0 8px 24px rgba(0,0,0,.18)!important}
@media(max-width:700px){body:has(.inv){padding:10px!important}.inv{margin:10px auto!important;border-radius:16px!important}.inv .head{padding:22px 18px!important;display:block!important}.inv .head .right{margin-top:16px!important;min-width:0!important}.inv>h3,.inv>table,.inv>.tot,.inv>p{margin-left:16px!important;margin-right:16px!important}.inv table{font-size:12px!important}.inv th,.inv td{padding:8px 6px!important}.inv .head:after{display:none!important}.print{position:static!important;margin:0 0 10px 0!important}}
@media print{body:has(.inv){background:#fff!important;padding:0!important}.inv{box-shadow:none!important;border-radius:0!important}.print{display:none!important}.inv .head{print-color-adjust:exact;-webkit-print-color-adjust:exact}.inv th{print-color-adjust:exact;-webkit-print-color-adjust:exact}}
`;

function styleHtmlResponse(resp, req){
  const ct=resp.headers.get("content-type")||"";
  if(!ct.includes("text/html")) return resp;
  let rewriter = new HTMLRewriter().on("head",{element(el){el.append(`<style>${ROYAL_CSS}</style>`,{html:true})}});
  try {
    const u = new URL(req.url);
    if (u.pathname === "/" && u.searchParams.get("admin") === "1") {
      rewriter = rewriter.on("body", { element(el) {
        el.append('<script src="/ewaybill-admin.js" defer></script>', { html: true });
      }});
    }
  } catch {}
  return rewriter.transform(resp);
}

export default {
  ...wrapped,
  async fetch(req, env, ctx) {
    try {
      const e = await ewaybill(req, env, ctx, wrapped);
      if (e) return styleHtmlResponse(e, req);
      const r = await automation(req, env, ctx, wrapped);
      if (r) return styleHtmlResponse(r, req);
    } catch (e) {
      return new Response(JSON.stringify({error:"Internal server error"}), {status:500, headers:{"content-type":"application/json","cache-control":"no-store"}});
    }
    const r = await wrapped.fetch(req, env, ctx);
    return styleHtmlResponse(r);
  }
};
