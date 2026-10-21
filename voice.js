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

// Foolproof Part Extractor (Strips questions first, then extracts Dest, Train & Station)
function extractQueryParts(text){
  let cleanText = text.trim();

  // 1. सबसे पहले पीछे के सभी सवालिया और फालतू शब्द पूरी तरह हटा दें
  cleanText = cleanText.replace(/(?:पर\s+)?कितने\s+बजे.*$/gi, "").trim();
  cleanText = cleanText.replace(/(?:कब|कहाँ|कहां|आएगी|आयेगी|पहुंचेगी|जाएगी|जायेगी|बताओ|देखनी\s+है).*$/gi, "").trim();

  let destination = "उपलब्ध नहीं";
  let station = "जयपुर";
  let train = "";

  // 2. गंतव्य (Destination) निकालना - जैसे "बांदीकुई जाने वाली"
  const destMatch = cleanText.match(/(.*?)\s+(?:जाने\s+वाली|जानेवाला|going\s+to|bound\s+for)\s+(.*)/i);
  if(destMatch){
    destination = destMatch[1].trim();
    cleanText = destMatch[2].trim(); // गंतव्य हटाने के बाद बचा हुआ हिस्सा
  }

  // 3. स्टेशन (Station) निकालना - जैसे "जयपुर स्टेशन" या "जयपुर पर"
  const stationMatch = cleanText.match(/(.*?)\s+([^\s]+)\s+(?:स्टेशन|Station)\s*(.*)/i);
  if(stationMatch){
    train = stationMatch[1].trim();
    station = stationMatch[2].trim();
    if(stationMatch[3]){
      train += " " + stationMatch[3].trim();
    }
  } else {
    // अगर 'स्टेशन' शब्द नहीं है लेकिन 'जयपुर पर' या ऐसा कुछ है
    const fallbackStn = cleanText.match(/(.*?)\s+([^\s]{3,})\s+पर\s*(.*)/i);
    if(fallbackStn && fallbackStn[2] !== destination){
      train = fallbackStn[1].trim();
      station = fallbackStn[2].trim();
    } else {
      train = cleanText;
    }
  }

  // सफाई
  train = train.replace(/^(?:की|का|के)\s+/i, "").trim();
  if(!train){
    train = cleanText;
  }

  return {
    destination: destination,
    train: train || "एक्सप्रेस ट्रेन",
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
