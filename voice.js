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
  const cleanText = text.replace(/[📡⏱️✅❌🚨]/g, "");
  const speech = new SpeechSynthesisUtterance(cleanText);
  speech.lang = "hi-IN";
  speech.rate = 1;
  speech.pitch = 1;
  window.speechSynthesis.speak(speech);
}

// Advanced Part Extractor (Clean & Precise)
function extractQueryParts(text){
  let cleanText = text.trim();

  let destination = "";
  let train = "";
  let station = "";

  // 1. गंतव्य (Destination) निकालना - जैसे "बांदीकुई जाने वाली"
  const destMatch = cleanText.match(/(.*?)\s+(?:जाने\s+वाली|जानेवाला|going\s+to|bound\s+for)\s+/i);
  if(destMatch){
    destination = destMatch[1].trim();
    cleanText = cleanText.replace(destMatch[0], "").trim();
  }

  // 2. स्टेशन (Station) निकालना - जैसे "जयपुर स्टेशन" या "जयपुर पर"
  const stationMatch = cleanText.match(/([^\s]+)\s+(?:स्टेशन|Station|स्टेशन\s+पर|Station\s+at)\s*/i);
  if(stationMatch){
    station = stationMatch[1].trim();
    cleanText = cleanText.replace(stationMatch[0], "").trim();
  } else {
    const fallbackStationMatch = cleanText.match(/([^\s+]{3,})\s+पर\s+/i);
    if(fallbackStationMatch){
      station = fallbackStationMatch[1].trim();
      cleanText = cleanText.replace(fallbackStationMatch[0], "").trim();
    }
  }

  // 3. ट्रेन का नाम - "पर कितने बजे", "कितने बजे" और अन्य सवालिया शब्दों को जड़ से साफ करना
  let trainPart = cleanText;
  trainPart = trainPart.replace(/(?:पर\s+)?कितने\s+बजे.*$/i, "").trim();
  trainPart = trainPart.replace(/(?:कब|कहाँ|कहां|आएगी|आयेगी|पहुंचेगी|जाएगी|जायेगी|बताओ|देखनी\s+है).*$/i, "").trim();
  trainPart = trainPart.replace(/^(?:की|का|के)\s+/i, "").trim();

  train = trainPart.trim();
  if(!train){
    train = text.trim();
  }

  return {
    destination: destination || "उपलब्ध नहीं",
    train: train,
    station: station || "जयपुर"
  };
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

      const parts = extractQueryParts(spokenText);

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
              <div><b>Train Name:</b> ${parts.train}</div>
              <div><b>Departure Station:</b> ${parts.station}</div>
            </div>
            <div class="card-actions" style="margin-top:20px;text-align:center;">
              <button class="action-btn" id="confirm-train-btn">✅ हाँ</button>
              <button class="action-btn" onclick="askTrainName()">❌ नहीं</button>
            </div>
          </div>
        </div>
      `;

      setTimeout(() => {
        const confirmBtn = document.getElementById("confirm-train-btn");
        if(confirmBtn){
          confirmBtn.addEventListener("click", () => {
            confirmTrainQuery(parts);
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
