// Global cache variable to store background pre-fetched data
window.preFetchedTrainData = null;

// MIC SHOW
function showMic(){
  const overlay = document.getElementById("mic-overlay");
  if(overlay) overlay.style.display = "flex";
}

// MIC HIDE
function hideMic(){
  const overlay = document.getElementById("mic-overlay");
  if(overlay) overlay.style.display = "none";
}

// SPEAK TEXT
function speakText(text){
  const cleanText = text.replace(/[📡⏱️✅❌🚨🧭🎫]/g, "");
  const speech = new SpeechSynthesisUtterance(cleanText);
  speech.lang = "hi-IN";
  speech.rate = 1;
  speech.pitch = 1;
  window.speechSynthesis.speak(speech);
}

// Foolproof Part Extractor (Cleans "पर" and extracts destination, train, station)
function extractQueryParts(text){
  let cleanText = text.trim();

  cleanText = cleanText.replace(/(?:पर\s+)?कितने\s+बजे.*$/gi, "").trim();
  cleanText = cleanText.replace(/(?:कब|कहाँ|कहां|आएगी|आयेगी|पहुंचेगी|जाएगी|जायेगी|बताओ|देखनी\s+है).*$/gi, "").trim();

  let destination = "उपलब्ध नहीं";
  let station = "जयपुर";
  let train = "";

  const destMatch = cleanText.match(/(.*?)\s+(?:जाने\s+वाली|जानेवाला|going\s+to|bound\s+for)\s+(.*)/i);
  if(destMatch){
    destination = destMatch[1].trim();
    cleanText = destMatch[2].trim();
  }

  const stationMatch = cleanText.match(/(.*?)\s+([^\s]+)\s+(?:स्टेशन|Station)\s*(.*)/i);
  if(stationMatch){
    train = stationMatch[1].trim();
    station = stationMatch[2].trim();
  } else {
    const fallbackStn = cleanText.match(/(.*?)\s+([^\s]{3,})\s+पर\s*(.*)/i);
    if(fallbackStn && fallbackStn[2] !== destination){
      train = fallbackStn[1].trim();
      station = fallbackStn[2].trim();
    } else {
      train = cleanText;
    }
  }

  if(station){
    station = station.replace(/पर$/i, "").trim();
  }

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

// BACKGROUND PRE-FETCH FUNCTION (बिना यूजर के रोके चुपचाप डेटा लाना)
async function preFetchTrainData(parts){
  window.preFetchedTrainData = { status: "fetching" };
  try {
    // यहाँ आप अपनी असली API या mock query कॉल कर सकते हैं
    // उदाहरण के लिए रेलयात्री या पब्लिक API का एंडपॉइंट
    const queryStr = encodeURIComponent(parts.train);
    const response = await fetch(`https://api.example.com/search?q=${queryStr}`);
    const data = await response.json();
    window.preFetchedTrainData = { status: "success", data: data };
  } catch (err) {
    // अगर API फेल हो, तो फॉलबैक डेटा ताकि ऐप रुके नहीं
    window.preFetchedTrainData = { 
      status: "ready", 
      trainName: parts.train, 
      trainNumber: "12413", 
      stationName: parts.station,
      statusMessage: "सुचारू रूप से संचालित (On Time)",
      destination: parts.destination
    };
  }
}

// TRAIN BUTTON VOICE TRIGGER
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

      // 🚀 BACKGROUND PRE-FETCHING START (जैसे ही वैरीफाई कार्ड आया, बैकएंड एक्टिव)
      preFetchTrainData(parts);

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
              <div><b>गंतव्य (Destination):</b> ${parts.destination}</div>
              <div><b>ट्रेन (Train):</b> ${parts.train}</div>
              <div><b>स्टेशन (Station):</b> ${parts.station}</div>
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
            // जब यूजर हाँ दबाए, तब pre-fetched डेटा के साथ फाइनल कार्ड रेंडर हो
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
