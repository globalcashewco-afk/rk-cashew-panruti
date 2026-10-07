# RK Cashew Panruti production checks

- CI: API worker tests and production wrapper tests run on pushes and pull requests to `main`.
- Runtime entry point: `worker-wrapped.js`.
- Cloudflare deploy command: `npx wrangler deploy`.
- Payment: Razorpay order creation, signature verification and webhook signature/amount checks are covered by `test-worker.mjs`.
- Admin: session cookie and optional TOTP are covered by tests.
- Order integrity: server-side price/tax/delivery recalculation, duplicate order protection, consent and tracking checks are covered by tests.
- Screenshot uploads: order-phone verification is enforced by `worker-extra.js`.
