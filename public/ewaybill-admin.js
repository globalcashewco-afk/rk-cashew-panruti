/* RK Cashew Panruti — admin E-Way Bill dispatch UI.
 * The backend remains fail-closed until official GSP API access is verified.
 */
(() => {
  "use strict";
  const api = async (url, options = {}) => {
    const response = await fetch(url, {
      credentials: "same-origin",
      cache: "no-store",
      ...options,
      headers: { "content-type": "application/json", ...(options.headers || {}) }
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.error || `Request failed (${response.status})`);
    return body;
  };
  const el = (tag, attrs = {}, text = "") => {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
    if (text) node.textContent = text;
    return node;
  };
  function mount() {
    if (document.getElementById("rkEwbPanel")) return;
    const anchor = document.getElementById("admin-billing") || document.querySelector("main") || document.body;
    const panel = el("section", { id: "rkEwbPanel", "aria-labelledby": "rkEwbTitle" });
    panel.style.cssText = "margin:24px auto;padding:20px;max-width:1100px;border:1px solid #c9a34a;border-radius:18px;background:#fff;color:#17243e;box-shadow:0 12px 32px #07112618";
    panel.innerHTML = `
      <div style="display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap">
        <div><div style="font-size:11px;letter-spacing:1.5px;font-weight:800;color:#9a6b20">DISPATCH WORKFLOW</div><h2 id="rkEwbTitle" style="margin:4px 0 8px;color:#071126">E-Way Bill</h2></div>
        <span id="rkEwbStatus" role="status" style="font-size:12px;font-weight:800;padding:8px 12px;border-radius:999px;background:#fff3d0;color:#73510d">Checking API status…</span>
      </div>
      <p id="rkEwbNote" style="margin:0 0 16px;color:#59677f;line-height:1.5">Save dispatch details against a finalized invoice. No E-Way Bill is generated until official API access is verified.</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px">
        <label>Finalized invoice<select id="rkEwbInvoice" style="display:block;width:100%;margin-top:5px;padding:11px;border:1px solid #b9c3d2;border-radius:10px;background:#fff;color:#14203a"><option value="">Loading invoices…</option></select></label>
        <label>Transporter / courier name<input id="rkEwbTransporter" maxlength="160" style="display:block;width:100%;margin-top:5px;padding:11px;border:1px solid #b9c3d2;border-radius:10px" /></label>
        <label>Transport mode<select id="rkEwbMode" style="display:block;width:100%;margin-top:5px;padding:11px;border:1px solid #b9c3d2;border-radius:10px;background:#fff;color:#14203a"><option value="">Select mode</option><option>Road</option><option>Rail</option><option>Air</option><option>Ship</option></select></label>
        <label>Transporter GSTIN (optional)<input id="rkEwbGstin" maxlength="15" style="display:block;width:100%;margin-top:5px;padding:11px;border:1px solid #b9c3d2;border-radius:10px;text-transform:uppercase" /></label>
        <label>Transport document number<input id="rkEwbDoc" maxlength="40" style="display:block;width:100%;margin-top:5px;padding:11px;border:1px solid #b9c3d2;border-radius:10px" /></label>
        <label>Transport document date<input id="rkEwbDocDate" type="date" style="display:block;width:100%;margin-top:5px;padding:11px;border:1px solid #b9c3d2;border-radius:10px" /></label>
        <label>Vehicle number (optional)<input id="rkEwbVehicle" maxlength="20" style="display:block;width:100%;margin-top:5px;padding:11px;border:1px solid #b9c3d2;border-radius:10px;text-transform:uppercase" /></label>
        <label>Vehicle type (optional)<input id="rkEwbVehicleType" maxlength="20" placeholder="Regular / ODC, if applicable" style="display:block;width:100%;margin-top:5px;padding:11px;border:1px solid #b9c3d2;border-radius:10px" /></label>
        <label>Dispatch-from address<input id="rkEwbFrom" maxlength="400" required style="display:block;width:100%;margin-top:5px;padding:11px;border:1px solid #b9c3d2;border-radius:10px" /></label>
        <label>Dispatch-from PIN code<input id="rkEwbFromPin" inputmode="numeric" maxlength="6" required style="display:block;width:100%;margin-top:5px;padding:11px;border:1px solid #b9c3d2;border-radius:10px" /></label>
        <label>Ship-to address<input id="rkEwbTo" maxlength="400" required style="display:block;width:100%;margin-top:5px;padding:11px;border:1px solid #b9c3d2;border-radius:10px" /></label>
        <label>Ship-to PIN code<input id="rkEwbToPin" inputmode="numeric" maxlength="6" required style="display:block;width:100%;margin-top:5px;padding:11px;border:1px solid #b9c3d2;border-radius:10px" /></label>
        <label>Approx. distance in km (optional)<input id="rkEwbDistance" type="number" min="1" max="5000" style="display:block;width:100%;margin-top:5px;padding:11px;border:1px solid #b9c3d2;border-radius:10px" /></label>
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:16px">
        <button id="rkEwbSave" type="button" style="padding:12px 18px;border:0;border-radius:10px;background:#071126;color:#f1d58a;font-weight:800;cursor:pointer">Save dispatch details</button>
        <button id="rkEwbGenerate" type="button" style="padding:12px 18px;border:1px solid #c9a34a;border-radius:10px;background:#fff8e5;color:#6f4d0a;font-weight:800;cursor:pointer">Check generation readiness</button>
        <button id="rkEwbReload" type="button" style="padding:12px 18px;border:1px solid #cbd3df;border-radius:10px;background:#f8fafc;color:#17243e;font-weight:800;cursor:pointer">Refresh invoices</button>
      </div>
      <pre id="rkEwbMessage" role="status" style="white-space:pre-wrap;overflow-wrap:anywhere;margin-top:14px;padding:12px;border-radius:10px;background:#f5f7fb;color:#25334d;font:13px/1.5 system-ui">Loading…</pre>
    `;
    if (anchor.id === "admin-billing") anchor.appendChild(panel);
    else anchor.appendChild(panel);

    const $ = id => document.getElementById(id);
    const message = (text, bad = false) => {
      $("rkEwbMessage").textContent = text;
      $("rkEwbMessage").style.background = bad ? "#fff0ee" : "#f5f7fb";
      $("rkEwbMessage").style.color = bad ? "#8b2117" : "#25334d";
    };
    const selectedId = () => $("rkEwbInvoice").value;
    async function refreshInvoices() {
      $("rkEwbInvoice").replaceChildren(el("option", { value: "" }, "Loading invoices…"));
      try {
        const data = await api("/api/automation/invoices");
        const items = Array.isArray(data.invoices) ? data.invoices : [];
        $("rkEwbInvoice").replaceChildren(el("option", { value: "" }, "Select an invoice"));
        items.forEach(inv => {
          const opt = el("option", { value: inv.id }, `${inv.invoiceNo || inv.id} — ${inv.customerName || "Customer"} — ₹${Number(inv.total || 0).toLocaleString("en-IN")}`);
          $("rkEwbInvoice").appendChild(opt);
        });
        if (!items.length) message("No finalized invoices found. Finalize an invoice in Billing first.");
      } catch (e) {
        $("rkEwbInvoice").replaceChildren(el("option", { value: "" }, "Could not load invoices"));
        message(e.message, true);
      }
    }
    async function refreshStatus() {
      try {
        const data = await api("/api/automation/ewaybill/status");
        const ready = !!(data.integration && data.integration.ready);
        $("rkEwbStatus").textContent = ready ? "API configured" : "API access pending";
        $("rkEwbStatus").style.background = ready ? "#e4f7e9" : "#fff3d0";
        $("rkEwbStatus").style.color = ready ? "#176534" : "#73510d";
        $("rkEwbNote").textContent = ready ? "API settings are present. Generation remains subject to provider adapter and sandbox verification." : "Dispatch details can be saved, but official E-Way Bill generation is disabled until the GSP access route and API specification are verified.";
      } catch (e) {
        $("rkEwbStatus").textContent = "Admin login required";
        $("rkEwbNote").textContent = e.message;
      }
    }
    $("rkEwbSave").addEventListener("click", async () => {
      const invoiceId = selectedId();
      if (!invoiceId) return message("Select a finalized invoice first.", true);
      const payload = {
        invoiceId,
        transporterName: $("rkEwbTransporter").value.trim(),
        transporterGstin: $("rkEwbGstin").value.trim().toUpperCase(),
        transportMode: $("rkEwbMode").value,
        transDocNo: $("rkEwbDoc").value.trim(),
        transDocDate: $("rkEwbDocDate").value,
        vehicleNumber: $("rkEwbVehicle").value.trim().toUpperCase(),
        vehicleType: $("rkEwbVehicleType").value.trim(),
        dispatchFromAddress: $("rkEwbFrom").value.trim(),
        dispatchFromPincode: $("rkEwbFromPin").value.trim(),
        shipToAddress: $("rkEwbTo").value.trim(),
        shipToPincode: $("rkEwbToPin").value.trim(),
        distanceKm: $("rkEwbDistance").value ? Number($("rkEwbDistance").value) : null
      };
      $("rkEwbSave").disabled = true;
      try {
        const data = await api("/api/automation/ewaybill/dispatch", { method: "PUT", body: JSON.stringify(payload) });
        message("Dispatch details saved.\nStatus: " + data.status + "\nNo E-Way Bill has been generated.");
      } catch (e) { message(e.message, true); }
      finally { $("rkEwbSave").disabled = false; }
    });
    $("rkEwbGenerate").addEventListener("click", async () => {
      const invoiceId = selectedId();
      if (!invoiceId) return message("Select a finalized invoice first.", true);
      try {
        const data = await api("/api/automation/ewaybill/generate", { method: "POST", body: JSON.stringify({ invoiceId }) });
        message(JSON.stringify(data, null, 2));
      } catch (e) {
        message(e.message + "\nGeneration is intentionally disabled until the approved provider API is implemented and tested.", true);
      }
    });
    $("rkEwbReload").addEventListener("click", refreshInvoices);
    $("rkEwbInvoice").addEventListener("change", async () => {
      const id = selectedId();
      if (!id) return;
      try {
        const data = await api("/api/automation/ewaybill/dispatch?invoiceId=" + encodeURIComponent(id));
        const d = data.dispatch;
        if (!d) return;
        $("rkEwbTransporter").value = d.transporterName || "";
        $("rkEwbGstin").value = d.transporterGstin || "";
        $("rkEwbMode").value = d.transportMode || "";
        $("rkEwbDoc").value = d.transDocNo || "";
        $("rkEwbDocDate").value = d.transDocDate || "";
        $("rkEwbVehicle").value = d.vehicleNumber || "";
        $("rkEwbVehicleType").value = d.vehicleType || "";
        $("rkEwbFrom").value = d.dispatchFromAddress || "";
        $("rkEwbFromPin").value = d.dispatchFromPincode || "";
        $("rkEwbTo").value = d.shipToAddress || "";
        $("rkEwbToPin").value = d.shipToPincode || "";
        $("rkEwbDistance").value = d.distanceKm || "";
        message("Loaded saved dispatch details. Status: " + d.status);
      } catch (e) { message(e.message, true); }
    });
    refreshStatus();
    refreshInvoices();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
