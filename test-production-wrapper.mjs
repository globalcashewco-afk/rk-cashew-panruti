// Production-wrapper smoke test. Reuses the existing deterministic worker test suite.
// Usage: node test-production-wrapper.mjs
import { spawnSync } from "node:child_process";
const r=spawnSync(process.execPath,["test-worker.mjs","worker-wrapped.js"],{stdio:"inherit"});
process.exit(r.status??1);
