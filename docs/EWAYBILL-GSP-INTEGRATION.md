# RK Cashew E-Way Bill GSP integration status

## Current state

The E-Way Bill module is deliberately fail-closed. It provides admin-authenticated endpoints to inspect readiness and save/retrieve dispatch details against a finalized invoice. The generate endpoint returns `503 GSP_SPEC_NOT_VERIFIED` and does not make a network call or claim an EBN.

The supplied label **“Crunch cashew co”** has not been verified as the legal name of an approved GST Suvidha Provider (GSP). It is stored only as a user-provided provider label, not treated as proof of API access.

## API routes

All routes require the existing admin session:

- `GET /api/automation/ewaybill/status` — readiness and missing setup indicators; never returns secrets.
- `PUT /api/automation/ewaybill/dispatch` — save validated dispatch data. JSON body includes `invoiceId`, `transporterName`, optional `transporterGstin` or `transporterId`, `transportMode` (`Road`, `Rail`, `Air`, `Ship`), `transDocNo`, `transDocDate` (YYYY-MM-DD), optional `vehicleNumber` / `vehicleType`, dispatch-from address/PIN, ship-to address/PIN and optional `distanceKm`.
- `GET /api/automation/ewaybill/dispatch?invoiceId=...` — retrieve saved dispatch details.
- `POST /api/automation/ewaybill/generate` — intentionally blocked until provider contract and access are verified.

Saving dispatch details is not official generation. No E-Way Bill Number (EBN), validity, or government status is fabricated.

## Required before connecting the provider

Ask the provider for its legal GSP name and official integration pack containing:

1. Current API specification/version and official sandbox/production base URLs.
2. Authentication and token lifecycle, request signing/encryption requirements, public keys/certificates and rotation process.
3. Generate EWB request/response schemas and error codes; Part-B/vehicle update, status/get, cancellation, and idempotency behavior.
4. Sandbox credentials and test process, then written confirmation of production enablement, whitelisted outbound IP requirements and account/GSTIN onboarding steps.
5. Provider support contact and rate limits/retry guidance.

Do not put secrets in GitHub or chat. Once the provider confirms its API contract, configure secrets as Cloudflare Worker secrets and implement only the documented adapter. Do not set `EWB_GSP_API_SPEC_VERIFIED` to a truthy value until the reviewed specification matches the adapter and sandbox tests pass.

## Official references

- NIC/GSTN onboarding: https://docs.ewaybillgst.gov.in/apidocs/on-boarding-process.html
- Official E-Way Bill API portal and current version notices: https://docs.ewaybillgst.gov.in/apidocs/
- NIC overview of the E-Way Bill system and GSP/API modes: https://www.nic.gov.in/project/gst-e-way-bill-system/

The official onboarding documentation says GSP users must register/select their GSP under the E-Way Bill portal's “For GSP” registration flow and complete the applicable pre-production testing and production formalities. The current official portal should be checked again before implementing payloads because API versions and validations can change.
