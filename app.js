// CONFIRM TRAIN QUERY AND SEND TO BACKEND
async function confirmTrainQuery(query){
  const box = document.getElementById("output-box");

  // LOADING CARD
  box.innerHTML = `
    <div class="train-card">
      <div class="card-body" style="text-align:center; padding:30px;">
        <div style="font-size:20px; font-weight:bold; color:#1565c0; margin-bottom:10px;">
          📡 लाइव स्टेटस खोजा जा रहा है...
        </div>
        <div style="font-size:14px; color:#666;">
          कृपया थोड़ा इंतज़ार करें, ट्रेन की लाइव जानकारी लाई जा रही है।
        </div>
      </div>
    </div>
  `;

  // CALL BACKEND API
  const data = await fetchRailData(query);

  if(!data || data.error){
    box.innerHTML = `
      <div class="train-card">
        <div class="card-body" style="text-align:center; padding:20px;">
          <div style="font-size:18px; font-weight:bold; color:#d32f2f; margin-bottom:10px;">
            ❌ जानकारी नहीं पाई गई
          </div>
          <div style="font-size:14px; color:#555; line-height:1.5;">
            माफ़ कीजिए, इस ट्रेन या स्टेशन की लाइव स्थिति अभी उपलब्ध नहीं हो पाई। कृपया ट्रेन का नाम या स्टेशन दोबारा स्पष्ट बोलें।
          </div>
          <button class="action-btn" style="margin-top:15px;" onclick="askTrainName()">🔄 दोबारा कोशिश करें</button>
        </div>
      </div>
    `;
    speakText("माफ़ कीजिए, इस ट्रेन की जानकारी नहीं मिल पाई।");
    return;
  }

  // RENDER SUCCESS CARD
  renderTrainCard(data);
}

// RENDER TRAIN CARD
function renderTrainCard(data){
  const box = document.getElementById("output-box");

  const trainName = data.trainName || "ट्रेन";
  const trainNumber = data.trainNumber || "";
  const stationName = data.stationName || "स्टेशन";
  const statusMessage = data.statusMessage || "समय पर चल रही है";
  const arrTime = data.arrivalTime || "--";
  const depTime = data.departure || "--";
  const delay = data.delayMinutes || 0;
  const journeyInfo = data.journeyInfo || "यात्रा की जानकारी उपलब्ध है";

  box.innerHTML = `
    <div class="train-card">
      <div class="card-top">
        <div class="train-name">${trainName} (${trainNumber})</div>
        <div class="station-name">📍 ${stationName} स्टेशन</div>
        <div class="status-strip">
          ⚡ ${statusMessage}
        </div>
      </div>

      <div class="card-body">
        <div class="time-grid">
          <div class="time-box">
            <div class="time-title">आगमन (Arrival)</div>
            <div class="time-value">${arrTime}</div>
          </div>
          <div class="time-box">
            <div class="time-title">प्रस्थान (Departure)</div>
            <div class="time-value">${depTime}</div>
          </div>
        </div>

        <div class="journey-box">
          <div>यात्रा अपडेट</div>
          <div class="journey-line">${journeyInfo}</div>
        </div>

        <div class="card-actions">
          <button class="action-btn" onclick="openLiveStatus('${trainNumber}')">🌐 रेलयात्री लाइव</button>
          <button class="action-btn" onclick="openTicketBooking()">🎫 टिकट बुक करें</button>
        </div>
      </div>
    </div>
  `;

  // SPEAK RESULT
  const voiceMsg = `${trainName}, ${stationName} स्टेशन पर ${statusMessage}`;
  speakText(voiceMsg);
}

// DIRECTIONS CONFIRMATION (If used)
function confirmDirection(place){
  window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`, "_blank");
}
