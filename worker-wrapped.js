/* RK Cashew production entry point. Adds security headers to every response. */
import base from "./worker.js";
import {handleExtra} from "./worker-extra.js";
export * from "./worker.js";

function secureResponse(res) {
  const h = new Headers(res.headers);
  h.set("X-Content-Type-Options", "nosniff");
  h.set("X-Frame-Options", "DENY");
  h.set("Referrer-Policy", "strict-origin-when-cross-origin");
  h.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(self https://checkout.razorpay.com)");
  h.set("Cross-Origin-Resource-Policy", "same-origin");
  h.set("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  h.set("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline' https://checkout.razorpay.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https:; connect-src 'self' https://checkout.razorpay.com https://api.razorpay.com; frame-src 'self' https://checkout.razorpay.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests");
  return new Response(res.body, {status: res.status, statusText: res.statusText, headers: h});
}

export default {
  ...base,
  async fetch(req, env, ctx) {
    try {
      const x = await handleExtra(req, env, ctx, base);
      return secureResponse(x || await base.fetch(req, env, ctx));
    } catch (e) {
      return secureResponse(new Response(JSON.stringify({error:"Internal server error"}), {status:500, headers:{"content-type":"application/json","cache-control":"no-store"}}));
    }
  }
};
