# RK Cashew - update 2 (checkout polish). Touches ONLY public/shop.js. Needs update 1 to be applied first.
import os, sys, shutil, subprocess, tempfile, time
S = 'public/shop.js'
if not os.path.isfile(S):
    print("STOP: cannot find", S, "- run from /workspaces/rk-cashew-panruti"); sys.exit(1)
s0 = open(S, encoding='utf-8').read()
if 'rkUpiPick' in s0:
    print("Already updated. Nothing to do."); sys.exit(0)

R = []
# 1. translations for all new messages (7 languages)
R.append((r'''var GREET={en:"Happy {f}!"''', r'''D.push(
["Select at least one grade to view your order.","உங்கள் ஆர்டரைப் பார்க்க குறைந்தது ஒரு தரத்தைத் தேர்ந்தெடுக்கவும்.","ऑर्डर देखने के लिए कम से कम एक ग्रेड चुनें।","మీ ఆర్డర్ చూడటానికి కనీసం ఒక గ్రేడ్ ఎంచుకోండి.","ನಿಮ್ಮ ಆರ್ಡರ್ ನೋಡಲು ಕನಿಷ್ಠ ಒಂದು ಗ್ರೇಡ್ ಆರಿಸಿ.","ഓർഡർ കാണാൻ ഒരു ഗ്രേഡെങ്കിലും തിരഞ്ഞെടുക്കൂ.","اختر درجة واحدة على الأقل لعرض طلبك."],
["Choose grade","தரத்தைத் தேர்வு செய்க","ग्रेड चुनें","గ్రేడ్ ఎంచుకోండి","ಗ್ರೇಡ್ ಆರಿಸಿ","ഗ്രേഡ് തിരഞ്ഞെടുക്കൂ","اختر الدرجة"],
["Choose your UPI app","உங்கள் UPI செயலியைத் தேர்ந்தெடுக்கவும்","अपना UPI ऐप चुनें","మీ UPI యాప్ ఎంచుకోండి","ನಿಮ್ಮ UPI ಆ್ಯಪ್ ಆರಿಸಿ","നിങ്ങളുടെ UPI ആപ്പ് തിരഞ്ഞെടുക്കൂ","اختر تطبيق UPI"],
["If the app does not open, scan the QR code with any UPI app or copy the UPI ID.","செயலி திறக்கவில்லை என்றால், QR குறியீட்டை எந்த UPI செயலியிலும் ஸ்கேன் செய்யவும் அல்லது UPI ஐடியை நகலெடுக்கவும்.","ऐप न खुले तो किसी भी UPI ऐप से QR कोड स्कैन करें या UPI ID कॉपी करें।","యాప్ తెరవకపోతే, ఏదైనా UPI యాప్‌తో QR కోడ్ స్కాన్ చేయండి లేదా UPI ID కాపీ చేయండి.","ಆ್ಯಪ್ ತೆರೆಯದಿದ್ದರೆ, ಯಾವುದೇ UPI ಆ್ಯಪ್‌ನಲ್ಲಿ QR ಕೋಡ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ ಅಥವಾ UPI ID ನಕಲಿಸಿ.","ആപ്പ് തുറന്നില്ലെങ്കിൽ, ഏതെങ്കിലും UPI ആപ്പിൽ QR കോഡ് സ്കാൻ ചെയ്യുക അല്ലെങ്കിൽ UPI ID കോപ്പി ചെയ്യുക.","إذا لم يفتح التطبيق، امسح رمز QR بأي تطبيق UPI أو انسخ معرّف UPI."],
["Copy UPI ID","UPI ஐடியை நகலெடு","UPI ID कॉपी करें","UPI ID కాపీ చేయండి","UPI ID ನಕಲಿಸಿ","UPI ID കോപ്പി ചെയ്യൂ","نسخ معرّف UPI"],
["UPI ID copied","UPI ஐடி நகலெடுக்கப்பட்டது","UPI ID कॉपी हो गई","UPI ID కాపీ అయింది","UPI ID ನಕಲಿಸಲಾಗಿದೆ","UPI ID കോപ്പി ചെയ്തു","تم نسخ معرّف UPI"],
["How to pay","பணம் செலுத்துவது எப்படி","भुगतान कैसे करें","చెల్లింపు ఎలా చేయాలి","ಪಾವತಿ ಹೇಗೆ ಮಾಡುವುದು","എങ്ങനെ പണമടയ്ക്കാം","كيفية الدفع"],
["1. Pay the amount shown using any UPI app.","1. காட்டப்பட்ட தொகையை ஏதேனும் UPI செயலியில் செலுத்தவும்.","1. दिखाई गई राशि किसी भी UPI ऐप से चुकाएँ।","1. చూపిన మొత్తాన్ని ఏదైనా UPI యాప్‌తో చెల్లించండి.","1. ತೋರಿಸಿದ ಮೊತ್ತವನ್ನು ಯಾವುದೇ UPI ಆ್ಯಪ್‌ನಲ್ಲಿ ಪಾವತಿಸಿ.","1. കാണിച്ച തുക ഏതെങ്കിലും UPI ആപ്പിൽ അടയ്ക്കുക.","1. ادفع المبلغ الظاهر عبر أي تطبيق UPI."],
["2. Copy the 12-digit UTR (UPI Ref No) from your payment receipt.","2. பணம் செலுத்திய ரசீதிலிருந்து 12 இலக்க UTR (UPI Ref No) ஐ நகலெடுக்கவும்.","2. भुगतान रसीद से 12 अंकों का UTR (UPI Ref No) कॉपी करें।","2. చెల్లింపు రసీదు నుండి 12 అంకెల UTR (UPI Ref No) కాపీ చేయండి.","2. ಪಾವತಿ ರಸೀದಿಯಿಂದ 12 ಅಂಕಿಯ UTR (UPI Ref No) ನಕಲಿಸಿ.","2. പേയ്മെന്റ് രസീതിൽ നിന്ന് 12 അക്ക UTR (UPI Ref No) കോപ്പി ചെയ്യുക.","2. انسخ رقم UTR المكوّن من 12 رقمًا (UPI Ref No) من إيصال الدفع."],
["3. Upload the screenshot, enter the UTR and tap the green button.","3. ஸ்கிரீன்ஷாட்டைப் பதிவேற்றி, UTR ஐ உள்ளிட்டு பச்சை பொத்தானை அழுத்தவும்.","3. स्क्रीनशॉट अपलोड करें, UTR दर्ज करें और हरा बटन दबाएँ।","3. స్క్రీన్‌షాట్ అప్‌లోడ్ చేసి, UTR నమోదు చేసి ఆకుపచ్చ బటన్ నొక్కండి.","3. ಸ್ಕ್ರೀನ್‌ಶಾಟ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ, UTR ನಮೂದಿಸಿ ಮತ್ತು ಹಸಿರು ಬಟನ್ ಒತ್ತಿ.","3. സ്ക്രീൻഷോട്ട് അപ്‌ലോഡ് ചെയ്ത്, UTR നൽകി പച്ച ബട്ടൺ അമർത്തുക.","3. ارفع لقطة الشاشة، أدخل رقم UTR واضغط الزر الأخضر."],
["Not paid yet? Send order – I will pay later","இன்னும் பணம் செலுத்தவில்லையா? ஆர்டரை அனுப்பு – பிறகு செலுத்துவேன்","अभी भुगतान नहीं किया? ऑर्डर भेजें – बाद में भुगतान करूँगा","ఇంకా చెల్లించలేదా? ఆర్డర్ పంపండి – తర్వాత చెల్లిస్తాను","ಇನ್ನೂ ಪಾವತಿಸಿಲ್ಲವೇ? ಆರ್ಡರ್ ಕಳುಹಿಸಿ – ನಂತರ ಪಾವತಿಸುತ್ತೇನೆ","ഇതുവരെ അടച്ചില്ലേ? ഓർഡർ അയയ്ക്കൂ – പിന്നീട് അടയ്ക്കാം","لم تدفع بعد؟ أرسل الطلب – سأدفع لاحقًا"],
["We will call you to confirm your order and payment.","உங்கள் ஆர்டர் மற்றும் பணம் செலுத்துதலை உறுதிப்படுத்த நாங்கள் அழைப்போம்.","आपके ऑर्डर और भुगतान की पुष्टि के लिए हम आपको कॉल करेंगे।","మీ ఆర్డర్ మరియు చెల్లింపు నిర్ధారణకు మేము మీకు కాల్ చేస్తాము.","ನಿಮ್ಮ ಆರ್ಡರ್ ಮತ್ತು ಪಾವತಿಯನ್ನು ದೃಢಪಡಿಸಲು ನಾವು ಕರೆ ಮಾಡುತ್ತೇವೆ.","നിങ്ങളുടെ ഓർഡറും പേയ്മെന്റും സ്ഥിരീകരിക്കാൻ ഞങ്ങൾ വിളിക്കും.","سنتصل بك لتأكيد طلبك والدفع."],
["Enter the valid 12-digit UTR (UPI Ref No)","சரியான 12 இலக்க UTR (UPI Ref No) ஐ உள்ளிடவும்","सही 12 अंकों का UTR (UPI Ref No) दर्ज करें","సరైన 12 అంకెల UTR (UPI Ref No) నమోదు చేయండి","ಸರಿಯಾದ 12 ಅಂಕಿಯ UTR (UPI Ref No) ನಮೂದಿಸಿ","ശരിയായ 12 അക്ക UTR (UPI Ref No) നൽകുക","أدخل رقم UTR صحيحًا من 12 رقمًا (UPI Ref No)"],
["Please upload your payment screenshot","உங்கள் பணம் செலுத்திய ஸ்கிரீன்ஷாட்டைப் பதிவேற்றவும்","कृपया अपना भुगतान स्क्रीनशॉट अपलोड करें","దయచేసి మీ చెల్లింపు స్క్రీన్‌షాట్ అప్‌లోడ్ చేయండి","ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪಾವತಿ ಸ್ಕ್ರೀನ್‌ಶಾಟ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ","ദയവായി പേയ്മെന്റ് സ്ക്രീൻഷോട്ട് അപ്‌ലോഡ് ചെയ്യുക","يرجى رفع لقطة شاشة الدفع"],
["Screenshot must be JPG or PNG, 10 KB to 5 MB","ஸ்கிரீன்ஷாட் JPG அல்லது PNG ஆக, 10 KB முதல் 5 MB வரை இருக்க வேண்டும்","स्क्रीनशॉट JPG या PNG हो, 10 KB से 5 MB के बीच","స్క్రీన్‌షాట్ JPG లేదా PNG, 10 KB నుండి 5 MB మధ్య ఉండాలి","ಸ್ಕ್ರೀನ್‌ಶಾಟ್ JPG ಅಥವಾ PNG, 10 KB ಯಿಂದ 5 MB ಒಳಗೆ ಇರಬೇಕು","സ്ക്രീൻഷോട്ട് JPG അല്ലെങ്കിൽ PNG ആയിരിക്കണം, 10 KB മുതൽ 5 MB വരെ","يجب أن تكون لقطة الشاشة JPG أو PNG بحجم 10 KB إلى 5 MB"],
["This UTR number has already been used.","இந்த UTR எண் ஏற்கனவே பயன்படுத்தப்பட்டுள்ளது.","यह UTR नंबर पहले ही इस्तेमाल हो चुका है।","ఈ UTR నంబర్ ఇప్పటికే ఉపయోగించబడింది.","ಈ UTR ಸಂಖ್ಯೆಯನ್ನು ಈಗಾಗಲೇ ಬಳಸಲಾಗಿದೆ.","ഈ UTR നമ്പർ ഇതിനകം ഉപയോഗിച്ചു.","رقم UTR هذا مستخدم من قبل."],
["Invalid UTR number.","தவறான UTR எண்.","अमान्य UTR नंबर।","చెల్లని UTR నంబర్.","ಅಮಾನ್ಯ UTR ಸಂಖ್ಯೆ.","അസാധുവായ UTR നമ്പർ.","رقم UTR غير صالح."],
["Payment screenshot (required)","பணம் செலுத்திய ஸ்கிரீன்ஷாட் (அவசியம்)","भुगतान स्क्रीनशॉट (ज़रूरी)","చెల్లింపు స్క్రీన్‌షాట్ (తప్పనిసరి)","ಪಾವತಿ ಸ್ಕ್ರೀನ್‌ಶಾಟ್ (ಕಡ್ಡಾಯ)","പേയ്മെന്റ് സ്ക്രീൻഷോട്ട് (നിർബന്ധം)","لقطة شاشة الدفع (مطلوبة)"],
["Find your 12-digit UTR under \"UPI Ref No\" or \"UTR\" in your GPay / PhonePe / Paytm receipt.","உங்கள் GPay / PhonePe / Paytm ரசீதில் \"UPI Ref No\" அல்லது \"UTR\" என்பதன் கீழ் 12 இலக்க UTR ஐக் காணலாம்.","अपनी GPay / PhonePe / Paytm रसीद में \"UPI Ref No\" या \"UTR\" के नीचे 12 अंकों का UTR मिलेगा।","మీ GPay / PhonePe / Paytm రసీదులో \"UPI Ref No\" లేదా \"UTR\" కింద 12 అంకెల UTR కనిపిస్తుంది.","ನಿಮ್ಮ GPay / PhonePe / Paytm ರಸೀದಿಯಲ್ಲಿ \"UPI Ref No\" ಅಥವಾ \"UTR\" ಅಡಿಯಲ್ಲಿ 12 ಅಂಕಿಯ UTR ಸಿಗುತ್ತದೆ.","നിങ്ങളുടെ GPay / PhonePe / Paytm രസീതിൽ \"UPI Ref No\" അല്ലെങ്കിൽ \"UTR\" എന്നതിന് താഴെ 12 അക്ക UTR കാണാം.","ستجد رقم UTR المكوّن من 12 رقمًا تحت \"UPI Ref No\" أو \"UTR\" في إيصال GPay / PhonePe / Paytm."]
);var GREET={en:"Happy {f}!"'''))
# 2. expose translate()
R.append((r'''window.renderFestival=renderFest;''', r'''window.renderFestival=renderFest;window.rkTranslate=translate;'''))
# 3. View order with nothing selected -> pop-up
R.append((r'''window.openCart=function(){''', r'''window.openCart=function(){if(!calc().lines.length){noGrade();return}'''))
# 4. GPay button -> app chooser, plus "How to pay" steps
R.append((r'''<a class="btn gold" href="'+upi+'">GPay / PhonePe / Paytm</a></div>''',
r'''<button class="btn gold" type="button" onclick="rkUpiPick()">GPay / PhonePe / Paytm</button></div><div class="payhelp" style="text-align:left"><b>How to pay</b><br>1. Pay the amount shown using any UPI app.<br>2. Copy the 12-digit UTR (UPI Ref No) from your payment receipt.<br>3. Upload the screenshot, enter the UTR and tap the green button.</div>'''))
# 5. "Not paid yet" button right under the green button; old hidden one removed
R.append((r"""onclick="rkSend(true)">'+t("I have paid – send order on WhatsApp")+'</button>'""",
r"""onclick="rkSend(true)">'+t("I have paid – send order on WhatsApp")+'</button><button class="btn" type="button" style="margin-top:8px;width:100%" onclick="rkSend(false)">Not paid yet? Send order – I will pay later</button><p class="dlv">We will call you to confirm your order and payment.</p>'"""))
R.append((r'''<button class="btn" style="width:100%" onclick="rkSend(false)">Send order without paying – confirm by call</button>''', ''))
# 6. new helper functions (pop-up, no-grade message, UPI app chooser)
R.append((r'''window.rkSend=function(paid){''', r'''function rkModal(inner){var o=document.getElementById("rkPop");if(o)o.remove();o=document.createElement("div");o.id="rkPop";o.style.cssText="position:fixed;inset:0;z-index:160;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;padding:16px";o.innerHTML='<div style="position:relative;background:#fff;color:#111;max-width:400px;width:100%;border-radius:20px;padding:22px 18px;text-align:center"><button type="button" aria-label="Close" style="position:absolute;top:6px;right:12px;background:none;border:0;font-size:26px;cursor:pointer" onclick="document.getElementById(\'rkPop\').remove()">×</button>'+inner+'</div>';o.addEventListener("click",function(e){if(e.target===o)o.remove()});document.body.appendChild(o);translate(o)}
function noGrade(){rkModal('<div style="font-size:42px">🥜</div><p style="font-size:16px;margin:8px 0 14px">Select at least one grade to view your order.</p><button class="btn gold" type="button" style="width:100%" onclick="document.getElementById(\'rkPop\').remove();var g=document.getElementById(\'grades\');if(g)g.scrollIntoView({behavior:\'smooth\'})">Choose grade</button>')}
window.rkUpiPick=function(){
  if(!order)return;
  var q="pa="+encodeURIComponent(CFG.upi)+"&pn="+encodeURIComponent(CFG.upiName)+"&am="+order.c.total.toFixed(2)+"&cu=INR&tn="+encodeURIComponent(order.id);
  var an=/Android/i.test(navigator.userAgent);
  var L=function(pkg,ios){return an?"intent://pay?"+q+"#Intent;scheme=upi;package="+pkg+";end":ios+q};
  var b=function(label,href){return'<a class="btn" style="display:block;margin:6px 0" href="'+href+'">'+label+'</a>'};
  rkModal('<h3 style="margin:0 0 10px">Choose your UPI app</h3>'+b("Google Pay",L("com.google.android.apps.nbu.paisa.user","tez://upi/pay?"))+b("PhonePe",L("com.phonepe.app","phonepe://pay?"))+b("Paytm",L("net.one97.paytm","paytmmp://pay?"))+b("BHIM / Other UPI app","upi://pay?"+q)+'<p class="dlv">If the app does not open, scan the QR code with any UPI app or copy the UPI ID.</p><button class="btn" type="button" style="width:100%" onclick="rkCopyUpi()">Copy UPI ID</button>');
};
window.rkCopyUpi=function(){var u=CFG.upi,done=function(){toast(t("UPI ID copied"))};if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(u).then(done,done);else{var i=document.createElement("input");i.value=u;document.body.appendChild(i);i.select();try{document.execCommand("copy")}catch(e){}i.remove();done()}};
window.rkSend=function(paid){'''))
# 7. warnings shown in the chosen language
R.append((r'''toast("Enter the valid 12-digit UTR (UPI Ref No)")''', r'''toast(t("Enter the valid 12-digit UTR (UPI Ref No)"))'''))
R.append((r'''toast("Please upload your payment screenshot")''', r'''toast(t("Please upload your payment screenshot"))'''))
R.append((r'''toast("Screenshot must be JPG or PNG, 10 KB to 5 MB")''', r'''toast(t("Screenshot must be JPG or PNG, 10 KB to 5 MB"))'''))
R.append((r'''{toast(x.d.error);return}''', r'''{toast(t(x.d.error));return}'''))
# 8. translate the payment screen after it is drawn
R.append((r'''id="oShot" accept="image/*"></label>')}''', r'''id="oShot" accept="image/*"></label>');if(window.rkTranslate)window.rkTranslate(document.getElementById("cartModal"))}'''))

bad = False
for i, (a, b) in enumerate(R, 1):
    n = s0.count(a)
    if n != 1:
        print("PROBLEM: part", i, "found", n, "times (need 1)"); bad = True
if bad:
    print("STOP: nothing was changed. (Update 1 must be applied first.)"); sys.exit(1)
s1 = s0
for a, b in R: s1 = s1.replace(a, b)

node = shutil.which('node')
if node:
    p = os.path.join(tempfile.mkdtemp(), 's.js'); open(p, 'w', encoding='utf-8').write(s1)
    r = subprocess.run([node, '--check', p], capture_output=True, text=True)
    if r.returncode:
        print("STOP: syntax check failed - nothing was changed.\n", r.stderr[:600]); sys.exit(1)
    print("Syntax check passed.")
bk = os.path.expanduser('~/rk-backup2-' + time.strftime('%Y%m%d-%H%M%S')); os.makedirs(bk); shutil.copy(S, bk)
open(S, 'w', encoding='utf-8').write(s1)
print("DONE. Changed ONLY:", S); print("Backup of original:", bk)
out = subprocess.run(['git', 'status', '--porcelain'], capture_output=True, text=True).stdout.splitlines()
other = [l for l in out if l[3:].strip() not in (S,) and 'apply_update' not in l]
print("Other changed files in repo:", other if other else "none")
