/* RK Cashew final entry: production wrapper + OCR/manual automation */
import wrapped from "./worker-wrapped.js";
import { automation } from "./worker-automation.js";

export default {
  ...wrapped,
  async fetch(req, env, ctx) {
    try {
      const r = await automation(req, env, ctx, wrapped);
      if (r) return r;
    } catch (e) {
      return new Response(JSON.stringify({error:"Internal server error"}), {status:500, headers:{"content-type":"application/json","cache-control":"no-store"}});
    }
    return wrapped.fetch(req, env, ctx);
  }
};
