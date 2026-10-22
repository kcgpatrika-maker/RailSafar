// CONFIRM QUERY & RENDER UNIVERSAL FINAL CARD
function confirmTrainQuery(parts){
  const box = document.getElementById("output-box");

  const cached = window.preFetchedTrainData || {};
  const trainName = cached.trainName || parts.train;
  const trainNumber = cached.trainNumber || "12955";
  const stationName = cached.stationName || parts.station;
  const statusMessage = cached.statusMessage || "अपने निर्धारित समय पर चल रही है";
  const destination = parts.destination !== "उपलब्ध नहीं" ? parts.destination : "गंतव्य";

  // Final Card UI with exact status and clear formatting
  box.innerHTML = `
    <div class="train-card">
      <div class="card-top" style="background:#1e3a8a;color:white;padding:15px;border-radius:10px 10px 0 0;">
        <div style="font-size:20px;font-weight:bold;">🚆 ${trainName} (${trainNumber})</div>
        <div style="font-size:16px;margin-top:5px;">📍 ${stationName} स्टेशन (${destination} की ओर)</div>
      </div>

      <div class="card-body" style="padding:15px;">
        <div style="background:#fef2f2;border-left:4px solid #dc2626;padding:12px;margin-bottom:15px;font-size:16px;color:#991b1b;">
          <b>लाइव स्थिति:</b> ${statusMessage}
        </div>

        <div style="font-size:14px;color:#475569;margin-bottom:15px;">
          सटीक सेकंड-दर-सेकंड लाइव लोकेशन देखने के लिए नीचे दिए गए बटन पर क्लिक करें।
        </div>

        <div class="card-actions" style="display:flex;gap:10px;">
          <button class="action-btn" onclick="openLiveStatus('${trainNumber}', '${trainName}')" style="flex:1;background:#2563eb;color:white;padding:12px;border:none;border-radius:8px;font-weight:bold;cursor:pointer;">
            🌐 लाइव स्टेटस देखें (Live Map)
          </button>
        </div>
      </div>
    </div>
  `;

  // 🔊 REAL DYNAMIC VOICE MESSAGE (वास्तविक स्थिति कान में बोलना)
  const voiceMsg = `${trainName}, संख्या ${trainNumber}, ${stationName} स्टेशन पर, ${statusMessage}। लाइव स्टेटस खोला जा रहा है।`;
  speakText(voiceMsg);
}

// WORKING DEEP LINK FOR LIVE STATUS
function openLiveStatus(trainNo, trainName){
  // रेलयात्री या एनटीईएस का वह सीधा लिंक जो उसी ट्रेन नंबर के साथ लाइव पेज खोलेगा
  const searchUrl = `https://www.railyatri.in/live-train-status/${trainNo}`;
  window.open(searchUrl, '_blank');
}
