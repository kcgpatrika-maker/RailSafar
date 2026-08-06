// MIC SHOW
function showMic(){
  document.getElementById("mic-overlay").style.display = "flex";
}

// MIC HIDE
function hideMic(){
  document.getElementById("mic-overlay").style.display = "none";
}

// SPEAK
function speakText(text){
  const cleanText = text
    .replace("📡","")
    .replace("⏱️","")
    .replace("✅","")
    .replace("❌","")
    .replace("🚨","");

  const speech = new SpeechSynthesisUtterance(cleanText);
  speech.lang = "hi-IN";
  speech.rate = 1;
  speech.pitch = 1;
  window.speechSynthesis.speak(speech);
}

// ==========================================================
// FIXED TEMPLATE PARSER
// अपेक्षित वाक्य-रचना:
// "[गंतव्य] स्टेशन को जाने वाली [ट्रेन नाम] एक्सप्रेस/पैसेंजर [स्टेशन] स्टेशन पर कब आएगी"
// उदाहरण:
// "अजमेर स्टेशन को जाने वाली मरुधर एक्सप्रेस जयपुर स्टेशन पर कब आएगी"
// ==========================================================
function parseFixedTemplate(text){

  text = text.trim();

  // "को" वैकल्पिक रखा है (कई बार वॉइस रिकॉग्निशन इसे छोड़ देता है)
  // आगमन क्रिया के कई रूप भी स्वीकार किए हैं (आएगी/आयेगी/पहुंचेगी/पहुँचेगी)
  const pattern =
    /^(.+?)\s*स्टेशन\s*(?:को\s*)?जाने\s*वाली\s+(.+?)\s*(एक्सप्रेस|पैसेंजर)(?:\s*ट्रेन)?\s+(.+?)\s*स्टेशन\s*पर\s*कब\s*(?:आएगी|आयेगी|पहुंचेगी|पहुँचेगी)/;

  const match = text.match(pattern);

  if(!match){
    return null;
  }

  return {
    destination: match[1].trim(),
    trainName: (match[2].trim() + " " + match[3].trim()).trim(),
    startStation: match[4].trim()
  };
}

// फॉर्मेट-मदद कार्ड (जब पैटर्न मैच न हो)
// spokenText यहां इसलिए दिखाया जा रहा है ताकि यह पता चल सके
// कि वॉइस रिकग्निशन ने असल में क्या टेक्स्ट पहचाना — डिबगिंग के लिए
function showFormatHelp(spokenText){

  const box = document.getElementById("output-box");

  box.innerHTML = `
    <div class="train-card">
      <div class="card-body" style="text-align:center;">

        <div style="font-size:17px;font-weight:bold;margin-bottom:10px;">
          ❌ समझ नहीं आया
        </div>

        <div style="background:#eef4ff;padding:10px;border-radius:10px;font-size:14px;color:#2563eb;margin-bottom:10px;text-align:left;">
          <b>पहचाना गया टेक्स्ट:</b><br>${spokenText}
        </div>

        <div style="background:#fff7ed;padding:14px;border-radius:12px;font-size:15px;line-height:1.7;text-align:left;">
          कृपया इस तरह पूछिये:<br><br>
          <b>"[गंतव्य] स्टेशन को जाने वाली [ट्रेन नाम] एक्सप्रेस/पैसेंजर [स्टेशन] स्टेशन पर कब आएगी"</b>
          <br><br>
          उदाहरण:<br>
          "अजमेर स्टेशन को जाने वाली मरुधर एक्सप्रेस जयपुर स्टेशन पर कब आएगी"
        </div>

        <button class="action-btn" style="margin-top:16px;" onclick="askTrainName()">
          🎤 फिर से बोलिये
        </button>

      </div>
    </div>
  `;
}

// TRAIN BUTTON
function askTrainName(){
  if('webkitSpeechRecognition' in window){
    showMic();
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.start();

    recognition.onresult = function(event){
      hideMic();
      const spokenText = event.results[0][0].transcript.trim();
      const box = document.getElementById("output-box");

      // फिक्स्ड टेम्पलेट से तीनों जानकारी निकालें
      const parts = parseFixedTemplate(spokenText);

      // पैटर्न मैच नहीं हुआ — सीधा फॉर्मेट बताएं, वेरिफाई कार्ड मत दिखाएं
      if(!parts){
        showFormatHelp(spokenText);
        return;
      }

      // VERIFY CARD
      box.innerHTML = `
        <div class="train-card">
          <div class="card-body">
            <div style="font-size:18px;font-weight:bold;margin-bottom:15px;text-align:center;">
              🎤 क्या आपने यही कहा?
            </div>

            <div style="background:#eef4ff;padding:14px;border-radius:12px;text-align:center;font-size:18px;line-height:1.6;">
              ${spokenText}
            </div>

            <div style="margin-top:12px;font-size:16px;color:#2563eb;text-align:left;">
              <div><b>Destination:</b> ${parts.destination}</div>
              <div><b>Train Name:</b> ${parts.trainName}</div>
              <div><b>Departure Station:</b> ${parts.startStation}</div>
            </div>

            <div class="card-actions" style="margin-top:20px;text-align:center;">
              <button class="action-btn" id="confirm-train-btn">✅ हाँ</button>
              <button class="action-btn" onclick="askTrainName()">❌ नहीं</button>
            </div>
          </div>
        </div>
      `;

      // BUTTON EVENT
      setTimeout(() => {
        const confirmBtn = document.getElementById("confirm-train-btn");
        if(confirmBtn){
          confirmBtn.addEventListener("click", () => {

            // backend को साफ़, पहले से पार्स्ड फ़ील्ड्स भेजें
            const queryLine = {
              destination: parts.destination,
              train: parts.trainName,
              station: parts.startStation
            };

            confirmTrainQuery(queryLine);
          });
        }
      }, 100);
    };

    recognition.onerror = function(){
      hideMic();
      alert("आवाज़ समझने में समस्या हुई");
    };

    recognition.onend = hideMic;
  }else{
    alert("Voice Support उपलब्ध नहीं है");
  }
}


// DIRECTIONS BUTTON
function askDirections(){
  if('webkitSpeechRecognition' in window){
    showMic();
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.start();

    recognition.onresult = function(event){
      hideMic();
      const spokenText = event.results[0][0].transcript.trim();
      const box = document.getElementById("output-box");

      box.innerHTML = `
        <div class="train-card">
          <div class="card-body">
            <div style="font-size:18px;font-weight:bold;margin-bottom:15px;text-align:center;">
              🧭 क्या आपको यही जगह जाना है?
            </div>

            <div style="background:#fff7ed;padding:14px;border-radius:12px;text-align:center;font-size:18px;line-height:1.6;">
              ${spokenText}
            </div>

            <div class="card-actions" style="margin-top:20px;">
              <button class="action-btn" onclick="confirmDirection('${spokenText}')">✅ हाँ</button>
              <button class="action-btn" onclick="askDirections()">❌ नहीं</button>
            </div>
          </div>
        </div>
      `;
    };

    recognition.onerror = function(){
      hideMic();
      alert("आवाज़ समझने में समस्या हुई");
    };

    recognition.onend = hideMic;
  }
}
