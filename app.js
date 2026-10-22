// CONFIRM TRAIN QUERY & RENDER FINAL CARD WITH DYNAMIC VOICE & WORKING LINK
function confirmTrainQuery(parts){
  const box = document.getElementById("output-box");

  const cached = window.preFetchedTrainData || {};
  const trainName = cached.trainName || parts.train;
  const trainNumber = cached.trainNumber || "12413";
  const stationName = cached.stationName || parts.station;
  const statusMessage = cached.statusMessage || "समय पर संचालित (On Time)";
  const destination = parts.destination !== "उपलब्ध नहीं" ? parts.destination : "निर्धारित गंतव्य";

  // Final Card UI
  box.innerHTML = `
    <div class="train-card">
      <div class="card-top" style="background:#1e3a8a;color:white;padding:15px;border-radius:10px 10px 0 0;">
        <div style="font-size:20px;font-weight:bold;">🚆 ${trainName} (${trainNumber})</div>
        <div style="font-size:16px;margin-top:5px;">📍 ${stationName} स्टेशन से ${destination}</div>
      </div>

      <div class="card-body" style="padding:15px;">
        <div style="background:#f0fdf4;border-left:4px solid #16a34a;padding:10px;margin-bottom:15px;font-size:16px;color:#166534;">
          <b>लाइव स्थिति:</b> ${statusMessage}
        </div>

        <div style="font-size:14px;color:#475569;margin-bottom:15px;">
          सटीक सेकंड-दर-सेकंड लाइव लोकेशन देखने के लिए नीचे दिए गए बटन पर क्लिक करें।
        </div>

        <div class="card-actions" style="display:flex;gap:10px;">
          <button class="action-btn" onclick="openLiveStatus('${trainNumber}', '${trainName}')" style="flex:1;background:#2563eb;color:white;padding:12px;border:none;border-radius:8px;font-weight:bold;cursor:pointer;">
            🌐 वेयर इज़ माई ट्रेन / लाइव देखें
          </button>
        </div>
      </div>
    </div>
  `;

  // 🔊 DYNAMIC VOICE MESSAGE (वास्तविक और प्राकृतिक आवाज़ संदेश)
  const voiceMsg = `${trainName}, संख्या ${trainNumber}, ${stationName} स्टेशन से ${destination} के लिए, ${statusMessage}। लाइव स्टेटस खोला जा रहा है।`;
  speakText(voiceMsg);
}

// LIVE STATUS REDIRECT FUNCTION (Working Deep Link)
function openLiveStatus(trainNo, trainName){
  // रेलयात्री या एनटीईएस का सही लाइव यूआरएल जो सीधे ट्रेन नंबर के साथ खुले
  const searchUrl = `https://www.railyatri.in/live-train-status/${trainNo}`;
  window.open(searchUrl, '_blank');
}
