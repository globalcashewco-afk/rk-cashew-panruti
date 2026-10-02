/* RK Cashew Panruti – shop.js  (loaded after the main inline script; overrides older stubs) */
(function(){
"use strict";
window.openModal=window.openModal||function(id){document.getElementById(id).classList.add("open")};
var CFG={
  wa:"919791880911", phone:"+919791880911",
  upi:"ravichandranjeevitha300-1@oksbi", upiName:"Jeevitha Ravichandran",
  minKg:0.5, gstRate:0.05,
  // Delivery estimate (Rs). Edit numbers here to match your courier office.
  // zone: [base for first kg, extra per additional kg]
  zones:{local:[40,10],tn:[70,15],south:[110,25],india:[150,35],remote:[220,50]}
};
var LANGS=[["en","English"],["ta","தமிழ்"],["hi","हिन्दी"],["te","తెలుగు"],["kn","ಕನ್ನಡ"],["ml","മലയാളം"],["ar","العربية"]];
/* [en, ta, hi, te, kn, ml, ar] */
var D=[
["Grades","தரங்கள்","ग्रेड","గ్రేడ్లు","ಗ್ರೇಡ್‌ಗಳು","ഗ്രേഡുകൾ","الدرجات"],
["Guide","வழிகாட்டி","गाइड","గైడ్","ಮಾರ್ಗದರ್ಶಿ","ഗൈഡ്","الدليل"],
["Bulk","மொத்தம்","थोक","హోల్‌సేల్","ಸಗಟು","മൊത്തം","بالجملة"],
["Gallery","படங்கள்","गैलरी","గ్యాలరీ","ಗ್ಯಾಲರಿ","ഗാലറി","المعرض"],
["Reviews","மதிப்புரைகள்","समीक्षाएँ","సమీక్షలు","ವಿಮರ್ಶೆಗಳು","അവലോകനങ്ങൾ","التقييمات"],
["FAQ","கேள்விகள்","सवाल-जवाब","ప్రశ్నలు","ಪ್ರಶ್ನೆಗಳು","ചോദ്യങ്ങൾ","الأسئلة"],
["Call now","இப்போது அழைக்க","अभी कॉल करें","ఇప్పుడు కాల్ చేయండి","ಈಗ ಕರೆ ಮಾಡಿ","ഇപ്പോൾ വിളിക്കൂ","اتصل الآن"],
["Explore grades","தரங்களைப் பார்க்க","ग्रेड देखें","గ్రేడ్లు చూడండి","ಗ್ರೇಡ್ ನೋಡಿ","ഗ്രേഡുകൾ കാണുക","استعرض الدرجات"],
["Better Kaju.","சிறந்த முந்திரி.","बेहतर काजू।","మేలైన జీడిపప్పు.","ಉತ್ತಮ ಗೋಡಂಬಿ.","മികച്ച കശുവണ്ടി.","كاجو أفضل."],
["Better Choice.","சிறந்த தேர்வு.","बेहतर चुनाव।","మేలైన ఎంపిక.","ಉತ್ತಮ ಆಯ್ಕೆ.","മികച്ച തിരഞ്ഞെടുപ്പ്.","خيار أفضل."],
["Shop by grade","தரத்தின்படி வாங்குங்கள்","ग्रेड के अनुसार खरीदें","గ్రేడ్ ప్రకారం కొనండి","ಗ್ರೇಡ್ ಪ್ರಕಾರ ಖರೀದಿಸಿ","ഗ്രേഡ് അനുസരിച്ച് വാങ്ങൂ","تسوق حسب الدرجة"],
["Pick your cashew.","உங்கள் முந்திரியைத் தேர்ந்தெடுங்கள்.","अपना काजू चुनें।","మీ జీడిపప్పు ఎంచుకోండి.","ನಿಮ್ಮ ಗೋಡಂಬಿ ಆರಿಸಿ.","നിങ്ങളുടെ കശുവണ്ടി തിരഞ്ഞെടുക്കൂ.","اختر الكاجو الخاص بك."],
["Need a bigger quantity?","அதிக அளவு வேண்டுமா?","बड़ी मात्रा चाहिए?","ఎక్కువ పరిమాణం కావాలా?","ಹೆಚ್ಚು ಪ್ರಮಾಣ ಬೇಕೇ?","കൂടുതൽ അളവ് വേണോ?","تحتاج كمية أكبر؟"],
["Quick enquiry","விரைவு விசாரணை","त्वरित पूछताछ","త్వరిత విచారణ","ತ್ವರಿತ ವಿಚಾರಣೆ","ദ്രുത അന്വേഷണം","استفسار سريع"],
["Name","பெயர்","नाम","పేరు","ಹೆಸರು","പേര്","الاسم"],
["Phone","தொலைபேசி","फ़ोन","ఫోన్","ಫೋನ್","ഫോൺ","الهاتف"],
["Quantity","அளவு","मात्रा","పరిమాణం","ಪ್ರಮಾಣ","അളവ്","الكمية"],
["Location","இடம்","स्थान","స్థానం","ಸ್ಥಳ","സ്ഥലം","الموقع"],
["WhatsApp bulk enquiry","வாட்ஸ்அப் மொத்த விசாரணை","व्हाट्सऐप थोक पूछताछ","వాట్సాప్ బల్క్ విచారణ","ವಾಟ್ಸಾಪ್ ಸಗಟು ವಿಚಾರಣೆ","വാട്ട്സ്ആപ്പ് മൊത്ത അന്വേഷണം","استفسار الجملة عبر واتساب"],
["Customer reviews","வாடிக்கையாளர் மதிப்புரைகள்","ग्राहक समीक्षाएँ","కస్టమర్ సమీక్షలు","ಗ್ರಾಹಕ ವಿಮರ್ಶೆಗಳು","ഉപഭോക്തൃ അവലോകനങ്ങൾ","آراء العملاء"],
["Before you order.","ஆர்டர் செய்யும் முன்.","ऑर्डर से पहले।","ఆర్డర్ చేసే ముందు.","ಆರ್ಡರ್ ಮಾಡುವ ಮುನ್ನ.","ഓർഡർ ചെയ്യുംമുമ്പ്.","قبل الطلب."],
["View order","ஆர்டரைப் பார்க்க","ऑर्डर देखें","ఆర్డర్ చూడండి","ಆರ್ಡರ್ ನೋಡಿ","ഓർഡർ കാണുക","عرض الطلب"],
["Your order","உங்கள் ஆர்டர்","आपका ऑर्डर","మీ ఆర్డర్","ನಿಮ್ಮ ಆರ್ಡರ್","നിങ്ങളുടെ ഓർഡർ","طلبك"],
["Pincode","பின்கோடு","पिन कोड","పిన్‌కోడ్","ಪಿನ್‌ಕೋಡ್","പിൻകോഡ്","الرمز البريدي"],
["Delivery","டெலிவரி","डिलीवरी","డెలివరీ","ಡೆಲಿವರಿ","ഡെലിവറി","التوصيل"],
["Proceed to payment","பணம் செலுத்த தொடரவும்","भुगतान के लिए आगे बढ़ें","చెల్లింపుకు కొనసాగండి","ಪಾವತಿಗೆ ಮುಂದುವರಿಯಿರಿ","പേയ്മെന്റിലേക്ക് പോകൂ","المتابعة للدفع"],
["I have paid – send order on WhatsApp","நான் பணம் செலுத்தினேன் – வாட்ஸ்அப்பில் அனுப்பு","मैंने भुगतान किया – व्हाट्सऐप पर भेजें","నేను చెల్లించాను – వాట్సాప్‌లో పంపండి","ಪಾವತಿಸಿದ್ದೇನೆ – ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ಕಳುಹಿಸಿ","ഞാൻ അടച്ചു – വാട്ട്സ്ആപ്പിൽ അയയ്ക്കൂ","دفعت – أرسل الطلب عبر واتساب"],
["Payment problem? Call / WhatsApp us","பணம் செலுத்துவதில் சிக்கலா? அழைக்கவும்","भुगतान में समस्या? हमें कॉल करें","చెల్లింపు సమస్యనా? కాల్ చేయండి","ಪಾವತಿ ಸಮಸ್ಯೆಯೇ? ಕರೆ ಮಾಡಿ","പേയ്മെന്റ് പ്രശ്നമോ? വിളിക്കൂ","مشكلة في الدفع؟ اتصل بنا"],
["Minimum order is 500 g per grade","ஒவ்வொரு தரத்திற்கும் குறைந்தபட்சம் 500 கி","प्रति ग्रेड न्यूनतम 500 ग्राम","ప్రతి గ్రేడ్‌కు కనీసం 500 గ్రా","ಪ್ರತಿ ಗ್ರೇಡ್‌ಗೆ ಕನಿಷ್ಠ 500 ಗ್ರಾಂ","ഓരോ ഗ്രേഡിനും കുറഞ്ഞത് 500 ഗ്രാം","الحد الأدنى 500 جرام لكل درجة"],
["Gift the finest Panruti cashews to your loved ones.","உங்கள் அன்பானவர்களுக்கு பண்ருட்டியின் சிறந்த முந்திரியைப் பரிசளியுங்கள்.","अपनों को पनरुटी के बेहतरीन काजू उपहार में दें।","మీ ప్రియమైన వారికి పన్రుటి ఉత్తమ జీడిపప్పు బహుమతిగా ఇవ్వండి.","ನಿಮ್ಮ ಪ್ರೀತಿಪಾತ್ರರಿಗೆ ಪಣ್ರುಟಿಯ ಶ್ರೇಷ್ಠ ಗೋಡಂಬಿ ಉಡುಗೊರೆ ನೀಡಿ.","പ്രിയപ്പെട്ടവർക്ക് പണ്രുട്ടിയിലെ മികച്ച കശുവണ്ടി സമ്മാനിക്കൂ.","أهدِ أحبّاءك أجود كاجو بانروتي."],
["Order festival boxes","பண்டிகை ஆர்டர்","त्योहार ऑर्डर करें","పండుగ ఆర్డర్","ಹಬ್ಬದ ಆರ್ಡರ್","ഉത്സവ ഓർഡർ","اطلب الآن"]
];
var GREET={en:"Happy {f}!",ta:"{f} நல்வாழ்த்துகள்!",hi:"{f} की हार्दिक शुभकामनाएँ!",te:"{f} శుభాకాంక్షలు!",kn:"{f} ಶುಭಾಶಯಗಳು!",ml:"{f} ആശംസകൾ!",ar:"{f} مبارك!"};
var lang=localStorage.getItem("rkLang")||"en", li=function(){var i=LANGS.findIndex(function(l){return l[0]===lang});return i<0?0:i};
function t(en){var r=D.find(function(x){return x[0]===en});return r&&r[li()]||en}
var orig=new WeakMap();
function translate(root){
  var w=document.createTreeWalker(root||document.body,NodeFilter.SHOW_TEXT,null),n,i=li();
  while((n=w.nextNode())){
    var p=n.parentNode&&n.parentNode.nodeName; if(p==="SCRIPT"||p==="STYLE")continue;
    if(!orig.has(n))orig.set(n,n.nodeValue); var o=orig.get(n),v=o;
    for(var k=0;k<D.length;k++){var e=D[k][0],tv=o.trim();
      if(e.length<6?tv===e:o.indexOf(e)>-1){v=i?o.replace(e,D[k][i]):o;break}}
    if(v!==n.nodeValue)n.nodeValue=v;
  }
  document.querySelectorAll("input[placeholder],textarea[placeholder]").forEach(function(el){var pe=el.dataset.pe||(el.dataset.pe=el.placeholder);var r=D.find(function(x){return x[0]===pe});el.placeholder=r?r[i]:pe});
}
function setLanguage(c){
  lang=c;localStorage.setItem("rkLang",c);var l=LANGS[li()];
  document.documentElement.lang=c==="en"?"en-IN":c;document.documentElement.dir=c==="ar"?"rtl":"ltr";
  document.body.setAttribute("data-lang",c);translate();renderFest(true);
}
/* ---------- CSS ---------- */
var css=document.createElement("style");css.textContent=
"body[data-lang=ta]{font-family:'Noto Sans Tamil','DM Sans',sans-serif}body[data-lang=hi]{font-family:'Noto Sans Devanagari','DM Sans',sans-serif}body[data-lang=te]{font-family:'Noto Sans Telugu','DM Sans',sans-serif}body[data-lang=kn]{font-family:'Noto Sans Kannada','DM Sans',sans-serif}body[data-lang=ml]{font-family:'Noto Sans Malayalam','DM Sans',sans-serif}body[data-lang=ar]{font-family:'Noto Sans Arabic','DM Sans',sans-serif}"+
"body[data-lang]:not([data-lang=en]) h1,body[data-lang]:not([data-lang=en]) h2,body[data-lang]:not([data-lang=en]) h3{font-family:inherit}"+
".langsel{background:rgba(255,255,255,.12);color:inherit;border:1px solid rgba(229,191,101,.5);border-radius:12px;padding:8px 10px;font-weight:700;font-size:13px;max-width:120px}.langsel option{color:#111}"+
".dlv{font-size:12px;color:#65708c;margin-top:6px}.pay{text-align:center}.pay .amt{font-size:30px;font-weight:900;margin:6px 0}.pay #qrBox{display:flex;justify-content:center;margin:10px 0}.pay #qrBox img,.pay #qrBox canvas{width:210px;height:210px;border-radius:14px;border:1px solid var(--line);padding:8px;background:#fff}"+
".pay .row{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0}.pay .row .btn{flex:1;min-width:120px;text-align:center}.pay input{width:100%;margin-top:6px}.payhelp{background:#fff6e6;border:1px solid #f0d9a8;border-radius:14px;padding:10px;font-size:12.5px;margin-top:12px}"+
"#festPop{position:fixed;inset:0;z-index:120;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.6);padding:16px}#festPop.open{display:flex}#festPop .fc{max-width:460px;width:100%;border-radius:28px;padding:34px 24px;text-align:center;color:#fff;background:linear-gradient(150deg,var(--f1,#7a1020),var(--f2,#d4930a));box-shadow:0 30px 90px rgba(0,0,0,.5);position:relative;overflow:hidden}#festPop .em{font-size:64px;animation:fb 2.2s ease-in-out infinite}#festPop h2{font-size:32px;margin:8px 0;color:#fff}#festPop p{opacity:.95;margin:6px 0 18px}#festPop .btn{background:#fff;color:#222;font-weight:800}#festPop .x{position:absolute;top:10px;right:14px;background:none;border:0;color:#fff;font-size:26px;cursor:pointer}"+
"@keyframes fb{50%{transform:translateY(-10px) scale(1.06)}}.fpart{position:fixed;top:-40px;z-index:60;pointer-events:none;animation:fall linear forwards}@keyframes fall{to{transform:translateY(110vh) rotate(360deg)}}"+
"body.fest .festival{background:linear-gradient(100deg,var(--f1),var(--f2))!important}body.fest .hero{box-shadow:inset 0 0 0 9999px color-mix(in srgb,var(--f1) 22%,transparent)}body.fest .kicker{color:var(--f2)}";
document.head.appendChild(css);
var fl=document.createElement("link");fl.rel="stylesheet";fl.href="https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;700&family=Noto+Sans+Devanagari:wght@400;700&family=Noto+Sans+Telugu:wght@400;700&family=Noto+Sans+Kannada:wght@400;700&family=Noto+Sans+Malayalam:wght@400;700&family=Noto+Sans+Arabic:wght@400;700&display=swap";document.head.appendChild(fl);

/* ---------- Language selector (replaces the old stub button) ---------- */
var old=document.querySelector(".langbtn");
if(old){var s=document.createElement("select");s.className="langsel";s.setAttribute("aria-label","Language");
  LANGS.forEach(function(l){var o=document.createElement("option");o.value=l[0];o.textContent=l[1];s.appendChild(o)});
  s.value=lang;s.onchange=function(){setLanguage(s.value)};old.replaceWith(s)}
var _rp=window.renderProducts;window.renderProducts=function(){_rp.apply(this,arguments);translate(document.getElementById("gradeGrid"))};

/* ---------- Delivery estimate by pincode ---------- */
function zoneOf(p){
  if(!/^\d{6}$/.test(p))return null; var a=p.slice(0,3),b=+p.slice(0,2);
  if(a==="607"||a==="608")return"local";
  if(b>=60&&b<=64)return"tn";
  if((b>=50&&b<=59)||(b>=67&&b<=69))return"south";
  if(b===18||b===19||(b>=78&&b<=79)||b===74||b===73||b>=90)return"remote";
  return"india";
}
function delivery(pin,kg){var z=zoneOf(pin);if(!z)return null;var c=CFG.zones[z];return{zone:z,fee:Math.round(c[0]+Math.max(0,Math.ceil(kg)-1)*c[1])}}
var FREE=0,CP=null;
function calc(){
  var sub=0,kg=0,lines=[];
  data.products.forEach(function(p){var q=Number(cart[p.id]||0);if(q){sub=Math.round((sub+q*p.price)*100)/100;kg+=q;lines.push({id:p.id,q:q,price:p.price,amt:Math.round(q*p.price*100)/100})}});
  var pin=(document.getElementById("oPin")||{}).value||"",d=delivery(pin.trim(),kg),disc=(CP&&sub>0)?(CP.type==="pct"?Math.round(sub*CP.val)/100:Math.min(CP.val,sub)):0,gst=Math.round((sub-disc)*Math.round(CFG.gstRate*100))/100,fee=d?d.fee:0;
  if(FREE>0&&sub>=FREE)fee=0;
  return{lines:lines,sub:sub,kg:kg,disc:disc,gst:gst,dlv:fee,dOK:!!d,total:Math.round((sub-disc+gst+fee)*100)/100}
}
function inr(n){return"₹"+Number(n).toLocaleString("en-IN",{maximumFractionDigits:2})}
function drawTotals(){
  var c=calc(),el=document.getElementById("oTotals");if(!el)return;
  el.innerHTML='<div class="cartLine"><span>Subtotal</span><b>'+inr(c.sub)+'</b></div>'+(c.disc?'<div class="cartLine"><span>Discount ('+CP.code+')</span><b>−'+inr(c.disc)+'</b></div>':'')+'<div class="cartLine"><span>GST (5%)</span><b>'+inr(c.gst)+'</b></div><div class="cartLine"><span>'+t("Delivery")+'</span><b>'+(c.dOK?inr(c.dlv):"—")+'</b></div><div class="cartLine" style="font-size:18px;font-weight:900"><span>Total</span><span>'+inr(c.total)+'</span></div>'+(c.dOK?"":'<p class="dlv">'+t("Pincode")+' →</p>');
}
window.openCart=function(){
  CP=null;
  var m=document.querySelector("#cartModal .modalCard"),c=calc(),rows=c.lines.map(function(l){return'<div class="cartLine"><span><b>'+l.id+'</b> · '+l.q+' kg</span><b>'+inr(l.amt)+'</b></div>'}).join("");
  m.innerHTML='<div class="modalHead"><div><div class="kicker">'+t("Your order")+'</div><h2 style="margin:0">RK Cashew</h2><p class="dlv">'+t("Minimum order is 500 g per grade")+'</p></div><button class="close" onclick="closeModal(\'cartModal\')">×</button></div>'+
  (rows||'<p style="color:#65708c">—</p>')+'<div id="oTotals"></div><div class="formgrid"><div><label>'+t("Name")+'</label><input id="oName" autocomplete="name"></div><div><label>'+t("Phone")+'</label><input id="oPhone" type="tel" inputmode="numeric" maxlength="10" autocomplete="tel"></div><div><label>'+t("Pincode")+'</label><input id="oPin" inputmode="numeric" maxlength="6" autocomplete="postal-code"></div><div class="full"><label>Address</label><textarea id="oAddress" autocomplete="street-address"></textarea></div></div>'+
  '<button class="btn gold" style="margin-top:12px;width:100%" onclick="rkPay()">'+t("Proceed to payment")+'</button><p class="dlv">Delivery is an estimate by pincode from Cuddalore/Panruti; final courier charge is confirmed on WhatsApp. For bulk (25 kg+) use the <a href="#bulk" onclick="closeModal(\'cartModal\')">Bulk enquiry</a>.</p>';
  m.querySelector("#oPin").oninput=drawTotals;m.querySelector(".formgrid").insertAdjacentHTML("beforebegin",'<div class="row" style="margin:8px 0"><input id="oCoupon" placeholder="Coupon code" style="flex:1"><button class="btn" id="oCpBtn" type="button">Apply</button></div>');m.querySelector("#oCpBtn").onclick=function(){var cd=v("oCoupon");if(!cd){CP=null;drawTotals();return}fetch("/api/coupon?code="+encodeURIComponent(cd)).then(function(r){return r.json()}).then(function(d){if(d.ok){CP={code:d.code,type:d.type,val:d.val};toast("Coupon applied")}else{CP=null;toast("Invalid or expired coupon")}drawTotals()}).catch(function(){})};m.querySelector(".formgrid").insertAdjacentHTML("afterend",'<label style="display:block;margin:8px 0;font-size:13px"><input type="checkbox" id="oConsent" style="width:auto;margin-right:6px">I agree to the <a href="/privacy-policy/" target="_blank" rel="noopener">Privacy Policy</a> and <a href="/terms-conditions/" target="_blank" rel="noopener">Terms</a> and allow RK Cashew to contact me about this order.</label>');drawTotals();openModal("cartModal");
};
/* ---------- Payment ---------- */
var order=null;
function orderId(){var d=new Date();return"RK"+d.toISOString().slice(2,10).replace(/-/g,"")+Math.floor(1000+Math.random()*9000)}
window.rkPay=function(){
  var c=calc(),name=v("oName"),ph=v("oPhone").replace(/\D/g,""),pin=v("oPin"),ad=v("oAddress");
  if(!c.lines.length)return toast("Add a product first");
  if(c.lines.some(function(l){return l.q<CFG.minKg}))return toast(t("Minimum order is 500 g per grade"));
  if(!name||ph.length<10||!c.dOK||ad.length<8)return toast("Please enter name, 10-digit phone, 6-digit pincode and full address");
  order={id:orderId(),c:c,name:name,phone:ph,pin:pin,addr:ad,time:new Date()};
  var upi="upi://pay?pa="+CFG.upi+"&pn="+encodeURIComponent(CFG.upiName)+"&am="+c.total.toFixed(2)+"&cu=INR&tn="+order.id;
  var m=document.querySelector("#cartModal .modalCard");
  m.innerHTML='<div class="modalHead"><div><div class="kicker">'+order.id+'</div><h2 style="margin:0">UPI</h2></div><button class="close" onclick="closeModal(\'cartModal\')">×</button></div><div class="pay"><div class="amt">'+inr(c.total)+'</div><div id="qrBox"><img src="images/upi-qr.webp" alt="UPI QR"></div><p class="dlv">Scan with any UPI app · '+CFG.upi+'</p><div class="row"><a class="btn gold" href="'+upi+'">GPay / PhonePe / Paytm</a></div>'+
  '<input id="oUtr" placeholder="UPI Ref / UTR (12 digits)" inputmode="numeric" maxlength="12"><div class="dlv">Find your 12-digit UTR under "UPI Ref No" or "UTR" in your GPay / PhonePe / Paytm receipt.</div><button class="btn wa" style="margin-top:10px;width:100%" onclick="rkSend(true)">'+t("I have paid – send order on WhatsApp")+'</button>'+
  '<div class="payhelp">'+t("Payment problem? Call / WhatsApp us")+'<div class="row"><a class="btn" href="tel:'+CFG.phone+'">📞 9791880911</a><a class="btn wa" href="https://wa.me/'+CFG.wa+'?text='+encodeURIComponent("Payment problem for order "+order.id+" ("+inr(c.total)+"). Please help.")+'" target="_blank" rel="noopener">WhatsApp</a></div><button class="btn" style="width:100%" onclick="rkSend(false)">Send order without paying – confirm by call</button></div></div>';
  if(window.QRCode)qr(upi);else{var sc=document.createElement("script");sc.src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";sc.onload=function(){qr(upi)};document.head.appendChild(sc)}
};
function qr(u){try{var b=document.getElementById("qrBox");if(!b)return;var h=document.createElement("div");new QRCode(h,{text:u,width:210,height:210,correctLevel:QRCode.CorrectLevel.M});b.innerHTML="";b.appendChild(h)}catch(e){}}
function v(id){var e=document.getElementById(id);return e?e.value.trim():""}
/* ---------- Professional order slip (PNG) + WhatsApp ---------- */
function slip(o,paid,utr){
  var c=o.c,W=800,H=520+c.lines.length*44+180,cv=document.createElement("canvas");cv.width=W;cv.height=H;var x=cv.getContext("2d");
  var F='"Noto Sans Tamil","Noto Sans Devanagari","Noto Sans Telugu","Noto Sans Kannada","Noto Sans Malayalam","Noto Sans Arabic","DM Sans",Arial,sans-serif';
  x.fillStyle="#fff";x.fillRect(0,0,W,H);var g=x.createLinearGradient(0,0,W,0);g.addColorStop(0,"#0b1837");g.addColorStop(1,"#1d3a78");x.fillStyle=g;x.fillRect(0,0,W,110);
  x.fillStyle="#e5bf65";x.font="bold 34px "+F;x.fillText("RK CASHEW PANRUTI",30,52);x.fillStyle="#fff";x.font="16px "+F;x.fillText("Premium Kaju · Panruti, Tamil Nadu · +91 97918 80911",30,84);
  x.fillStyle="#111";x.font="bold 22px "+F;x.fillText("ORDER SLIP  #"+o.id,30,155);x.font="15px "+F;x.fillStyle="#555";x.fillText(o.time.toLocaleString("en-IN"),30,180);
  x.fillStyle="#b26a00";x.font="bold 16px "+F;x.fillText("UNPAID - Payment Pending Manual Verification"+(utr?" · UTR "+utr:""),30,206);
  x.fillStyle="#111";x.font="bold 16px "+F;x.fillText("CUSTOMER",30,245);x.font="16px "+F;x.fillText(o.name+" · "+o.phone,30,270);
  var words=(o.addr+" – "+o.pin).split(" "),ln="",y=294;words.forEach(function(w){var tt=ln+w+" ";if(x.measureText(tt).width>740){x.fillText(ln,30,y);y+=22;ln=w+" "}else ln=tt});x.fillText(ln,30,y);y+=34;
  x.fillStyle="#0b1837";x.fillRect(30,y,740,34);x.fillStyle="#fff";x.font="bold 15px "+F;x.fillText("GRADE",42,y+23);x.fillText("QTY",330,y+23);x.fillText("RATE/KG",460,y+23);x.fillText("AMOUNT",660,y+23);y+=34;
  x.font="16px "+F;c.lines.forEach(function(l,i){x.fillStyle=i%2?"#f6f7fb":"#fff";x.fillRect(30,y,740,44);x.fillStyle="#111";x.fillText(l.id,42,y+28);x.fillText(l.q+" kg",330,y+28);x.fillText(inr(l.price),460,y+28);x.fillText(inr(l.amt),660,y+28);y+=44});
  y+=30;[["Subtotal",c.sub]].concat(c.disc?[["Discount"+(order&&CP?" ("+CP.code+")":""),-c.disc]]:[],[["GST (5%)",c.gst],["Delivery",c.dlv]]).forEach(function(r){x.fillStyle="#333";x.font="16px "+F;x.fillText(r[0],460,y);x.textAlign="right";x.fillText(inr(r[1]),770,y);x.textAlign="left";y+=28});
  x.fillStyle="#0b1837";x.font="bold 22px "+F;x.fillText("TOTAL",460,y+8);x.textAlign="right";x.fillText(inr(c.total),770,y+8);x.textAlign="left";
  x.fillStyle="#888";x.font="13px "+F;x.fillText("Delivery charge is an estimate by pincode; final courier charge confirmed by RK Cashew. Thank you!",30,H-24);
  return new Promise(function(r){cv.toBlob(r,"image/png")});
}
function upShot(id,f){if(!f||!/^image\//.test(f.type))return;var r=new FileReader();r.onload=function(){var im=new Image();im.onload=function(){var k=Math.min(1,1000/Math.max(im.width,im.height)),c=document.createElement("canvas");c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext("2d").drawImage(im,0,0,c.width,c.height);
  fetch("/api/shot?id="+encodeURIComponent(id),{method:"POST",body:JSON.stringify({img:c.toDataURL("image/jpeg",0.6)})}).catch(function(){})};im.src=r.result};r.readAsDataURL(f)}
fetch("/api/settings").then(function(r){return r.json()}).then(function(S){FREE=+S.freeAbove||0}).catch(function(){});
window.rkGW=null;fetch("/api/config").then(function(r){return r.json()}).then(function(d){window.rkGW=d}).catch(function(){});
window.rkGateway=function(){
  var G=window.rkGW;if(!order||!G||!G.rzp)return;var c=order.c,P=function(u,b){return fetch(u,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(b)})};
  var pl={id:order.id,name:order.name,phone:order.phone,pin:order.pin,addr:order.addr,lines:c.lines.map(function(l){return{id:l.id,q:l.q,price:l.price,amt:l.amt}}),sub:c.sub,gst:c.gst,dlv:c.dlv,total:c.total,paid:false,consent:true,coupon:CP?CP.code:"",lang:lang};
  P("/api/order",pl).then(function(r){if(!r.ok&&r.status!==409)throw 0;return P("/api/pay/create",{id:order.id})}).then(function(r){return r.json()}).then(function(d){
    if(!d.rzpOrder)return toast(d.error||"Payment could not start");
    var run=function(){new Razorpay({key:G.key,amount:d.amount,currency:"INR",name:"RK Cashew Panruti",description:"Order "+order.id,order_id:d.rzpOrder,prefill:{name:order.name,contact:order.phone},theme:{color:"#e8a317"},
      handler:function(x){P("/api/pay/verify",{id:order.id,razorpay_order_id:x.razorpay_order_id,razorpay_payment_id:x.razorpay_payment_id,razorpay_signature:x.razorpay_signature}).then(function(r){return r.json()}).then(function(v){done(!!v.ok)}).catch(function(){done(false)})},
      modal:{ondismiss:function(){toast("Payment cancelled")}}}).open()};
    if(window.Razorpay)run();else{var sc=document.createElement("script");sc.src="https://checkout.razorpay.com/v1/checkout.js";sc.onload=run;sc.onerror=function(){toast("Payment page blocked – use the UPI QR")};document.head.appendChild(sc)}
  }).catch(function(){toast("Payment could not start – please use the UPI QR")});
  function done(ok){
    var m=document.querySelector("#cartModal .modalCard"),wa="https://wa.me/"+CFG.wa+"?text="+encodeURIComponent("Order "+order.id+" paid online "+inr(c.total)+". Name: "+order.name+", "+order.phone);
    m.innerHTML='<div class="modalHead"><h2 style="margin:0">'+(ok?"Payment received ✔":"Payment being confirmed")+'</h2><button class="close" onclick="closeModal(\'cartModal\')">×</button></div><div class="pay"><p>Order <b>'+order.id+'</b> · '+inr(c.total)+'</p><p>'+(ok?"Thank you! We will pack and ship your order.":"If money was deducted, it is confirmed automatically within a few minutes.")+'</p><a class="btn wa" href="'+wa+'" target="_blank" rel="noopener">Send order on WhatsApp</a> <a class="btn" href="/track-order/">Track order</a></div>';
    cart={};localStorage.setItem("rkCashewCart","{}");updateCartUI();renderProducts();
  }
};
window.rkSend=function(paid){
  if(!order)return;var utr=v("oUtr");
  if(paid){var u12=utr.replace(/\s/g,"");if(!/^\d{12}$/.test(u12)||/^(\d)\1{11}$/.test(u12)||"01234567890123456789".includes(u12)||"98765432109876543210".includes(u12))return toast("Enter the valid 12-digit UTR (UPI Ref No)");var sf=document.getElementById("oShot"),fz=sf&&sf.files&&sf.files[0];if(!fz)return toast("Please upload your payment screenshot");if(!/^image\/(jpeg|png)$/.test(fz.type)||fz.size<10240||fz.size>5242880)return toast("Screenshot must be JPG or PNG, 10 KB to 5 MB")}
  if(paid&&!order.srv){var c0=order.c;fetch("/api/order",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({id:order.id,name:order.name,phone:order.phone,pin:order.pin,addr:order.addr,lines:c0.lines.map(function(l){return{id:l.id,q:l.q,price:l.price,amt:l.amt}}),sub:c0.sub,gst:c0.gst,dlv:c0.dlv,total:c0.total,utr:utr.replace(/\s/g,""),paid:true,consent:true,coupon:CP?CP.code:"",lang:lang})}).then(function(r){return r.json().then(function(d){return{ok:r.ok,s:r.status,d:d}})}).then(function(x){if(!x.ok&&x.d&&x.d.error&&x.d.error!=="Duplicate"&&x.s<500){toast(x.d.error);return}order.srv=1;window.rkSend(true)}).catch(function(){order.srv=1;window.rkSend(true)});return}
  var c=order.c,txt="*NEW ORDER "+order.id+"*\n"+c.lines.map(function(l){return"• "+l.id+" – "+l.q+" kg × "+inr(l.price)+" = "+inr(l.amt)}).join("\n")+
   "\n\nSubtotal: "+inr(c.sub)+(c.disc?"\nDiscount"+(CP?" ("+CP.code+")":"")+": -"+inr(c.disc):"")+"\nGST 5%: "+inr(c.gst)+"\nDelivery: "+inr(c.dlv)+"\n*TOTAL: "+inr(c.total)+"*\n\n*Customer:* "+order.name+"\n*Phone:* "+order.phone+"\n*Address:* "+order.addr+" – "+order.pin+
   "\n*Payment Status:* UNPAID (Manual bank verification required)"+(utr?"\n*UTR / Ref No:* "+utr:"")+"\n*Language:* "+lang;
  try{var all=JSON.parse(localStorage.getItem("rkOrders")||"[]");all.push({id:order.id,total:c.total,t:Date.now()});localStorage.setItem("rkOrders",JSON.stringify(all))}catch(e){}
  var sf0=(document.getElementById("oShot")||{}).files,file0=sf0&&sf0[0];
  try{fetch("/api/order",{method:"POST",keepalive:true,headers:{"content-type":"application/json"},body:JSON.stringify({id:order.id,name:order.name,phone:order.phone,pin:order.pin,addr:order.addr,lines:c.lines.map(function(l){return{id:l.id,q:l.q,price:l.price,amt:l.amt}}),sub:c.sub,gst:c.gst,dlv:c.dlv,total:c.total,utr:(utr||"").replace(/\s/g,""),paid:!!paid,consent:true,coupon:CP?CP.code:"",lang:lang})}).then(function(){upShot(order.id,file0)}).catch(function(){})}catch(e){}
  var open=function(){window.open("https://wa.me/"+CFG.wa+"?text="+encodeURIComponent(txt),"_blank")};
  slip(order,paid,utr).then(function(b){
    var f=new File([b],"RK-Cashew-Order-"+order.id+".png",{type:"image/png"});
    if(navigator.canShare&&navigator.canShare({files:[f]})){navigator.share({files:[f],text:txt,title:"RK Cashew Order "+order.id}).catch(open)}
    else{var a=document.createElement("a");a.href=URL.createObjectURL(b);a.download=f.name;document.body.appendChild(a);a.click();a.remove();toast("Order slip saved – attach it in WhatsApp");setTimeout(open,700)}
    cart={};localStorage.setItem("rkCashewCart","{}");updateCartUI();renderProducts();
  });
};
/* ---------- Festival engine: every year, 10 days before → ends 12:00 AM after the day ---------- */
var FIX=[["New Year","01-01"],["Pongal / Makar Sankranti","01-14"],["Republic Day","01-26"],["Tamil New Year / Vishu","04-14"],["Independence Day","08-15"],["Gandhi Jayanti","10-02"],["Christmas","12-25"]];
var LUN={2026:[["Maha Shivaratri","02-15"],["Holi","03-04"],["Ugadi","03-19"],["Ramzan Id","03-21"],["Rama Navami","03-26"],["Bakrid","05-28"],["Raksha Bandhan","08-28"],["Onam","08-26"],["Janmashtami","09-04"],["Ganesh Chaturthi","09-14"],["Dussehra","10-20"],["Diwali","11-08"],["Guru Nanak Jayanti","11-24"]],
 2027:[["Maha Shivaratri","03-06"],["Ramzan Id","03-10"],["Holi","03-22"],["Ugadi","04-07"],["Rama Navami","04-15"],["Bakrid","05-17"],["Raksha Bandhan","08-17"],["Janmashtami","08-25"],["Ganesh Chaturthi","09-04"],["Onam","09-15"],["Dussehra","10-19"],["Diwali","10-29"],["Guru Nanak Jayanti","11-15"]]};
var TH=[[/Diwali/,"🪔","#5b0a1e","#e8a317"],[/Pongal|Sankranti/,"🌾","#0f5132","#f2b632"],[/Ganesh/,"🐘","#a4262c","#f4a300"],[/Onam/,"🌼","#b8860b","#f6e27a"],[/Holi/,"🎨","#c2185b","#00a5cf"],[/Ramzan|Bakrid/,"🌙","#064e3b","#d4af37"],[/Christmas/,"🎄","#7f1d1d","#166534"],[/Independence|Republic/,"🇮🇳","#ff9933","#138808"],[/Dussehra|Navratri/,"🏹","#8a1c0d","#f59e0b"],[/Tamil New|Vishu|Ugadi/,"🌺","#7a3e00","#e9b949"],[/New Year/,"🎆","#0b1837","#7c3aed"]];
function ist(){return new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Kolkata"}).format(new Date())}
function dd(s){return Date.parse(s+"T00:00:00Z")/864e5}
window.activeFestival=function(){
  var today=ist(),y=+today.slice(0,4),list=[];
  [y-1,y,y+1].forEach(function(yr){FIX.concat(LUN[yr]||[]).forEach(function(f){list.push({name:f[0],date:yr+"-"+f[1]})})});
  var f=list.filter(function(x){var left=dd(x.date)-dd(today);return left>=0&&left<=10}).sort(function(a,b){return dd(a.date)-dd(b.date)})[0];
  if(f)f.left=dd(f.date)-dd(today);
  if(!f&&data.festival&&data.festival.date){var e=data.festival,l=dd(e.date)-dd(today);if(l>=0&&l<=Number(e.before||10))f={name:e.name,date:e.date,left:l}}
  return f||null;
};
var popped=false;
function renderFest(redo){
  var f=window.activeFestival(),bar=document.getElementById("festivalBar");
  if(!f){bar.classList.remove("show");document.body.classList.remove("fest","festday");return}
  var th=TH.find(function(x){return x[0].test(f.name)})||[0,"🎉","#0b1837","#c9982f"];
  document.body.classList.add("fest");document.body.classList.toggle("festday",f.left===0);var tc=document.querySelector('meta[name="theme-color"]');if(tc)tc.content=f.left===0?th[2]:"#071126";document.body.style.setProperty("--f1",th[2]);document.body.style.setProperty("--f2",th[3]);
  var wish=GREET[lang].replace("{f}",f.name),sub=t("Gift the finest Panruti cashews to your loved ones."),days=f.left;
  bar.classList.add("show");document.getElementById("festName").textContent=th[1]+" "+wish;document.getElementById("festCopy").textContent=sub;
  document.getElementById("festCountdown").textContent=days?days+" day"+(days>1?"s":"")+" to go":"Today! 🎉";
  var p=document.getElementById("festPop");if(!p){p=document.createElement("div");p.id="festPop";document.body.appendChild(p)}
  p.style.setProperty("--f1",th[2]);p.style.setProperty("--f2",th[3]);
  p.innerHTML='<div class="fc"><button class="x" aria-label="Close" onclick="document.getElementById(\'festPop\').classList.remove(\'open\')">×</button><div class="em">'+th[1]+'</div><h2>'+wish+'</h2><p>'+sub+'</p><a class="btn" href="#grades" onclick="document.getElementById(\'festPop\').classList.remove(\'open\')">'+t("Order festival boxes")+'</a></div>';
  var key="rkFestSeen:"+f.name+":"+ist();
  if(!popped&&!redo&&!localStorage.getItem(key)){popped=true;localStorage.setItem(key,"1");setTimeout(function(){p.classList.add("open");confetti(th[1])},900)}
}
function confetti(e){if(matchMedia("(prefers-reduced-motion:reduce)").matches)return;for(var i=0;i<22;i++){var s=document.createElement("span");s.className="fpart";s.textContent=e;s.style.left=Math.random()*100+"vw";s.style.fontSize=14+Math.random()*18+"px";s.style.animationDuration=4+Math.random()*4+"s";s.style.animationDelay=Math.random()*2+"s";document.body.appendChild(s);setTimeout(function(n){n.remove()},10000,s)}}
window.renderFestival=renderFest;
/* touch ripple on every button */
document.addEventListener("pointerdown",function(e){var b=e.target.closest&&e.target.closest(".btn,.qty button,button.gold");if(!b)return;var r=b.getBoundingClientRect(),d=Math.max(r.width,r.height),s=document.createElement("span");s.className="rk-rip";s.style.cssText="width:"+d+"px;height:"+d+"px;left:"+(e.clientX-r.left-d/2)+"px;top:"+(e.clientY-r.top-d/2)+"px";b.appendChild(s);setTimeout(function(){s.remove()},650)},{passive:true});
if(navigator.vibrate)document.addEventListener("pointerdown",function(e){if(e.target.closest&&e.target.closest(".btn"))navigator.vibrate(8)},{passive:true});
renderFest();
setInterval(function(){renderFest(true)},60000); // rolls over automatically at 12:00 AM IST
if(lang!=="en")setLanguage(lang);else document.body.setAttribute("data-lang","en");
})();

/* ---------- Server prices + admin orders (uses /api, see worker.js) ---------- */
(function(){
"use strict";
function esc(t){return String(t==null?"":t).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function syncPrices(){
  fetch("/api/prices",{cache:"no-store"}).then(function(r){return r.ok?r.json():null}).then(function(d){
    if(!d||!d.prices||!d.updated)return;var ch=false;
    data.products.forEach(function(p){var n=Number(d.prices[p.id]);if(n>0&&n!==p.price){p.price=n;ch=true}if(d.stock&&typeof d.stock[p.id]==="boolean"&&d.stock[p.id]!==!!p.stock){p.stock=d.stock[p.id];ch=true}});
    if(ch){try{localStorage.setItem("rkCashewData",JSON.stringify(data))}catch(e){}renderProducts();updateCartUI()}
  }).catch(function(){});
}
function syncPublicSettings(){
  fetch("/api/settings",{cache:"no-store"}).then(function(r){return r.ok?r.json():null}).then(function(S){
    if(!S)return;
    if(S.wa)CFG.wa=String(S.wa).replace(/\D/g,"");
    if(S.phone)CFG.phone=String(S.phone);
    if(S.upi)CFG.upi=String(S.upi);
    if(S.upiName)CFG.upiName=String(S.upiName);
    if(S.phone)data.phone=S.phone;
    if(S.wa)data.wa=String(S.wa).replace(/\D/g,"");
    if(S.tagline)data.tagline=S.tagline;
    try{localStorage.setItem("rkCashewData",JSON.stringify(data))}catch(e){}
    if(window.syncContactLinks)window.syncContactLinks();
  }).catch(function(){});
}
syncPrices();syncPublicSettings();setInterval(syncPrices,60000);

var seen=null,timer=null,cur=[];
function beep(){try{var a=new (window.AudioContext||window.webkitAudioContext)(),o=a.createOscillator();o.connect(a.destination);o.frequency.value=880;o.start();setTimeout(function(){o.stop()},250)}catch(e){}}
var fq="",fs="All",allO=[];
function draw(all){
  allO=all;var b0=document.getElementById("ordersBox");if(!b0)return;
  if(!document.getElementById("ordBar")){
    b0.insertAdjacentHTML("beforebegin",'<div id="ordBar" style="margin:8px 0"><input id="ordQ" placeholder="Search Order ID, name or phone" style="width:100%;padding:8px;margin-bottom:6px"><div id="ordTabs"></div></div>');
    document.getElementById("ordQ").oninput=function(){fq=this.value;draw(allO)};
    document.getElementById("ordTabs").onclick=function(e){var s=e.target.getAttribute("data-f");if(s){fs=s;draw(allO)}};
  }
  document.getElementById("ordTabs").innerHTML=["All","Unpaid","Paid","Packed","Shipped","Cancelled"].map(function(s){return'<button class="btn" data-f="'+s+'" style="padding:4px 10px;margin:2px;'+(s===fs?"font-weight:900;outline:2px solid #e5bf65":"")+'">'+s+'</button>'}).join("");
  var q=fq.trim().toLowerCase(),qd=q.replace(/\D/g,"");
  drawRows(all.filter(function(o){
    if(fs==="Unpaid"?(o.status!=="Enquiry"&&o.status!=="Payment Pending"):(fs!=="All"&&o.status!==fs))return false;
    return !q||String(o.id).toLowerCase().indexOf(q)>-1||String(o.name).toLowerCase().indexOf(q)>-1||(qd&&String(o.phone).indexOf(qd)>-1)}));
}
function drawRows(list){
  cur=list;var box=document.getElementById("ordersBox");if(!box)return;
  if(!list.length){box.textContent="No orders yet.";return}
  box.innerHTML='<table style="width:100%;font-size:12px;border-collapse:collapse">'+list.map(function(o){
    var d=new Date(o.t).toLocaleString("en-IN"),items=o.lines.map(function(l){return esc(l.id)+" "+l.q+"kg"}).join(", ");
    var msg=encodeURIComponent("Hello "+o.name+", your RK Cashew order "+o.id+" status: "+o.status+(o.track?". Tracking: "+o.track:"")+". Track: "+location.origin+"/track-order/ . Thank you!");
    return '<tr style="border-top:1px solid #8884"><td style="padding:6px"><b>'+esc(o.id)+'</b><br>'+esc(d)+'<br><b>'+esc(o.status)+'</b>'+(o.dupUtr?'<br>⚠ duplicate UTR':'')+(o.priceMismatch?'<br>⚠ price/total corrected by server':'')+
    '</td><td style="padding:6px">'+esc(o.name)+'<br>'+esc(o.phone)+'<br>'+esc(o.addr)+' – '+esc(o.pin)+'</td><td style="padding:6px">'+items+'<br><b>₹'+esc(o.total)+'</b>'+(o.utr?'<br>UTR '+esc(o.utr):'')+(o.payId?'<br>Razorpay '+esc(o.payId):'')+
    '</td><td style="padding:6px">'+["Paid","Packed","Shipped","Cancelled"].map(function(s){return'<button class="btn" data-k="'+esc(o.k)+'" data-s="'+s+'" style="padding:4px 8px;margin:2px">'+s+'</button>'}).join("")+(o.hasShot?'<br><button class="btn" data-shot="'+esc(o.id)+'" style="padding:4px 8px;margin:2px">Screenshot</button>':"")+(o.inv?'<br><button class="btn gold" data-inv="'+esc(o.k)+'" style="padding:4px 8px;margin:2px">Invoice '+esc(o.inv)+'</button>':"")+
    '<br><a href="https://wa.me/91'+esc(o.phone)+'?text='+msg+'" target="_blank" rel="noopener">WhatsApp customer</a></td></tr>'}).join("")+'</table>';
  Array.prototype.forEach.call(box.querySelectorAll("button[data-shot]"),function(b){b.onclick=function(){var wd=window.open("","_blank");fetch("/api/shot?id="+encodeURIComponent(b.dataset.shot)).then(function(r){return r.json()}).then(function(d){wd.document.write('<img style="max-width:100%" src="'+String(d.img).replace(/[^A-Za-z0-9+\/=:;,]/g,"")+'">')}).catch(function(){wd.close()})}});
  Array.prototype.forEach.call(box.querySelectorAll("button[data-inv]"),function(b){b.onclick=function(){cur.forEach(function(o){if(o.k===b.dataset.inv)invoice(o)})}});
  Array.prototype.forEach.call(box.querySelectorAll("button[data-k]"),function(b){b.onclick=function(){
    var t="",wd=null,ord=cur.filter(function(x){return x.k===b.dataset.k})[0];if(b.dataset.s==="Shipped"){t=(prompt("Enter tracking ID, tracking link, or courier contact number:")||"").trim();if(!t)return;wd=window.open("","_blank")}else if(b.dataset.s==="Cancelled"){if(!confirm("Cancel order "+(ord?ord.id:"")+"?"))return;wd=window.open("","_blank")}
    fetch("/api/order",{method:"PATCH",headers:{"content-type":"application/json"},body:JSON.stringify({k:b.dataset.k,status:b.dataset.s,track:t})}).then(function(r){return r.json()}).then(function(d){if(d&&d.error){toast(d.error);if(wd)wd.close();return}if(wd&&ord){var m=b.dataset.s==="Shipped"?"Hello "+ord.name+", your RK Cashew order #"+ord.id+" has been shipped! 📦 Track your parcel here: "+t+". Thank you for shopping with RK Cashew Panruti!":"Hello "+ord.name+", your RK Cashew order #"+ord.id+" has been cancelled. If you have any questions or paid via UPI, please contact us at 9791880911.";wd.location="https://wa.me/91"+ord.phone+"?text="+encodeURIComponent(m)}load()})}});
}
function load(){
  fetch("/api/orders",{cache:"no-store"}).then(function(r){
    if(r.status===401){sessionStorage.removeItem("rkAdmin");toast("Session expired – login again");return null}
    return r.ok?r.json():null}).then(function(d){
    if(!d)return;if(seen!==null&&d.orders.length>seen){beep();toast("New order received")}
    seen=d.orders.length;draw(d.orders)}).catch(function(){});
}
function invoice(o){
  fetch("/api/settings").then(function(r){return r.json()}).then(function(S){
    var intra=(o.state||"")==="Tamil Nadu"&&String(S.gstin||"").slice(0,2)==="33",half=Math.round(o.gst*50)/100,f=function(n){return"₹"+Number(n).toFixed(2)};
    var rows=o.lines.map(function(l){return"<tr><td>"+esc(l.id)+" cashew kernels</td><td>"+esc(S.hsn||"0801")+"</td><td>"+l.q+" kg</td><td>"+f(l.price)+"</td><td>"+f(l.amt)+"</td></tr>"}).join("");
    var tax=intra?"<tr><td colspan=4>CGST 2.5%</td><td>"+f(half)+"</td></tr><tr><td colspan=4>SGST 2.5%</td><td>"+f(o.gst-half)+"</td></tr>":"<tr><td colspan=4>IGST 5%</td><td>"+f(o.gst)+"</td></tr>";
    var h="<!doctype html><meta charset=utf-8><title>Invoice "+esc(o.inv)+"</title><style>body{font-family:Arial;margin:24px;color:#111}table{width:100%;border-collapse:collapse;margin:12px 0}td,th{border:1px solid #999;padding:6px;font-size:13px;text-align:left}</style>"+
    "<h2>TAX INVOICE</h2><b>"+esc(S.biz||"RK Cashew Panruti")+"</b><br>"+esc(S.addr||"")+"<br>Phone: "+esc(S.phone||"")+"<br>GSTIN: "+esc(S.gstin||"")+" · FSSAI: "+esc(S.fssai||"")+
    "<p>Invoice No: <b>"+esc(o.inv)+"</b> · Date: "+esc(new Date(o.invDate||o.t).toLocaleDateString("en-IN"))+" · Order: "+esc(o.id)+"</p>"+
    "<p><b>Bill to:</b> "+esc(o.name)+", "+esc(o.phone)+"<br>"+esc(o.addr)+" – "+esc(o.pin)+"<br>Place of supply: "+esc(o.state||"—")+"</p>"+
    "<table><tr><th>Item</th><th>HSN</th><th>Qty</th><th>Rate</th><th>Amount</th></tr>"+rows+(o.disc?"<tr><td colspan=4>Discount "+esc(o.coupon)+"</td><td>-"+f(o.disc)+"</td></tr>":"")+"<tr><td colspan=4>Taxable value</td><td>"+f(o.sub-(o.disc||0))+"</td></tr>"+tax+"<tr><td colspan=4>Delivery charge</td><td>"+f(o.dlv)+"</td></tr><tr><th colspan=4>Total</th><th>"+f(o.total)+"</th></tr></table>"+
    "<p style='font-size:12px'>Computer generated invoice. <button onclick='print()'>Print / Save PDF</button></p>";
    var wd=window.open("","_blank");if(!wd)return toast("Allow pop-ups to view the invoice");wd.document.write(h);wd.document.close();
  }).catch(function(){toast("Could not load store details")});
}
window.rkLoadSettings=function(){fetch("/api/settings").then(function(r){return r.json()}).then(function(S){[["stBiz","biz"],["stPhone","phone"],["stAddr","addr"],["stGstin","gstin"],["stFssai","fssai"],["stHsn","hsn"],["stFree","freeAbove"],["stCoup","coupons"],["stUpi","upi"],["stUpiName","upiName"]].forEach(function(a){var e=document.getElementById(a[0]);if(e&&S[a[1]]!=null)e.value=S[a[1]]})}).catch(function(){})};
window.rkSaveSettings=function(){var g=function(i){return document.getElementById(i).value.trim()},m=document.getElementById("stMsg");
  fetch("/api/settings",{method:"PUT",headers:{"content-type":"application/json"},body:JSON.stringify({biz:g("stBiz"),phone:g("stPhone"),addr:g("stAddr"),gstin:g("stGstin"),fssai:g("stFssai"),hsn:g("stHsn"),freeAbove:g("stFree"),coupons:g("stCoup"),upi:g("stUpi"),upiName:g("stUpiName")})}).then(function(r){return r.json()}).then(function(d){m.textContent=d.error||"Saved ✔"}).catch(function(){m.textContent="Server not reachable"})};
window.rkLoadOrders=function(){load();clearInterval(timer);timer=setInterval(function(){if(sessionStorage.getItem("rkAdmin")==="1")load()},15000)};
})();

/* ---------- Checkout validation + pincode confirmation ---------- */
(function(){
"use strict";
var _pay=window.rkPay;
function shotUI(){var pp=document.querySelector("#cartModal .pay");if(pp&&window.rkGW&&window.rkGW.rzp&&!document.getElementById("oGw"))pp.insertAdjacentHTML("afterbegin",'<button class="btn gold" id="oGw" style="width:100%;margin-bottom:8px" onclick="rkGateway()">Pay securely – UPI / Card / NetBanking</button><p style="text-align:center;font-size:12px;margin:4px 0 10px">or pay by UPI QR below and enter the UTR</p>');var u=document.getElementById("oUtr");if(u&&!document.getElementById("oShot"))u.insertAdjacentHTML("beforebegin",'<label style="display:block;font-size:13px;margin-top:8px">Payment screenshot (required)<input type="file" id="oShot" accept="image/*"></label>')}
window.rkPay=function(){
  var g=function(i){var e=document.getElementById(i);return e?e.value.trim():""};
  var name=g("oName"),ph=g("oPhone").replace(/\D/g,""),pin=g("oPin");
  if(ph.length===12&&ph.slice(0,2)==="91")ph=ph.slice(2);
  if(!/^[A-Za-z .]{2,60}$/.test(name))return toast("Name: letters, spaces and dots only");
  if(data.products.some(function(p){return cart[p.id]&&!p.stock}))return toast("A grade in your order is out of stock");
  var cc=document.getElementById("oConsent");if(cc&&!cc.checked)return toast("Please tick the consent box");
  if(!/^[6-9]\d{9}$/.test(ph))return toast("Please enter a valid 10-digit mobile number");
  if(!/^\d{6}$/.test(pin))return toast("Please enter a 6-digit pincode");
  document.getElementById("oPhone").value=ph;
  fetch("/api/pin?code="+pin).then(function(r){return r.json()}).then(function(d){
    if(d&&d.ok===false)return toast("Pincode "+pin+" not found – please correct your pincode");
    _pay();shotUI();
  }).catch(function(){_pay();shotUI()});
};
})();
