/* New entry point: keeps your existing worker.js untouched and adds worker-extra.js routes in front of it. */
import base from "./worker.js";
import {handleExtra} from "./worker-extra.js";
export * from "./worker.js";
export default {
  ...base,
  async fetch(req,env,ctx){
    const x=await handleExtra(req,env,ctx,base);
    return x||base.fetch(req,env,ctx);
  }
};
