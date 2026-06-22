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

// Hindi → English transliteration helper
function extractQueryParts(text){
  const dictionary = {
    "जम्मू तवी":"Jammu Tawi",
    "मरुधर":"Marudhar",
    "पूजा":"Pooja",
    "रानीखेत":"Ranikhet",
    "एक्सप्रेस":"Express",
    "स्टेशन":"Station",
    "जयपुर":"Jaipur",
    "दिल्ली":"Delhi",
    "लखनऊ":"Lucknow",
    "काठगोदाम":"Kathgodam",
    "वाराणसी":"Varanasi"
  };

  let result = text;
  for(const key in dictionary){
    result = result.replace(new RegExp(key,"g"), dictionary[key]);
  }

  // Destination = 'जाने वाली' से पहले का हिस्सा
  let destination = "";
  let destMatch = result.match(/^(.*?) जाने वाली/);
  if(destMatch) destination = destMatch[1].trim();

  // Train Name = 'जाने वाली' के बाद के दो शब्द OR 'जाने वाली' और 'Station' के बीच
  let train = "";
  let trainMatch = result.match(/जाने वाली (.*?) Station/);
  if(trainMatch){
    let words = trainMatch[1].trim().split(" ");
    train = words.slice(0,2).join(" "); // सिर्फ़ दो शब्द लें
  }

  // Departure Station = 'Station' और उसके पहले का शब्द
  let station = "";
  let stationMatch = result.match(/(\w+)\sStation/);
  if(stationMatch){
    station = stationMatch[1].trim();
  }

  return { destination, train, station };
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

      // तीन values निकालें
      const parts = extractQueryParts(spokenText);

      // VERIFY CARD
      box.innerHTML = `
  <div class="train-card">
    <div class="card-body">
      <div style="font-size:18px;font-weight:bold;margin-bottom:15px;text-align:center;">
        🎤 क्या आपने यही कहा?
      </div>

      <!-- हिंदी लाइन -->
      <div style="background:#eef4ff;padding:14px;border-radius:12px;text-align:center;font-size:18px;line-height:1.6;">
        ${spokenText}
      </div>

      <!-- Categories -->
      <div style="margin-top:12px;font-size:16px;color:#2563eb;text-align:left;">
        <div><b>Destination:</b> ${parts.destination || "❓"}</div>
        <div><b>Train Name:</b> ${parts.train || "❓"}</div>
        <div><b>Departure Station:</b> ${parts.station || "❓"}</div>
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
            confirmTrainQuery(parts); // backend को साफ़ object भेजें
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
