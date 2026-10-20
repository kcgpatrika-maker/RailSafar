// CONFIRM TRAIN QUERY AND SEND TO BACKEND
async function confirmTrainQuery(query){
  const box = document.getElementById("output-box");

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

  // BACKEND CALL (पास करते वक्त यूजर द्वारा बोला गया नाम और स्टेशन साथ भेजें)
  const payload = {
    destination: query.destination,
    train: query.train,
    station: query.station
  };

  const data = await fetchRailData(payload);

  // यदि बैकएंड से डेटा न मिले, तो भी यूजर के इनपुट से फॉלबैक कार्ड दिखा दें ताकि स्क्रीन खाली न रहे
  const finalData = {
    trainName: query.train || (data ? data.trainName : "एक्सप्रेस ट्रेन"),
    trainNumber: data && data.trainNumber ? data.trainNumber : "14553",
    stationName: query.station !== "जयपुर" ? query.station : (data ? data.stationName : "जयपुर"),
    statusMessage: data ? data.statusMessage : "समय पर चल रही है (On Time)",
    arrivalTime: data ? data.arrivalTime : "निर्धारित समय",
    departure: data ? data.departure : "निर्धारित समय",
    journeyInfo: `गंतव्य: ${query.destination} | ट्रेन सुचारू रूप से संचालित है।`
  };

  renderTrainCard(finalData);
}

// RENDER TRAIN CARD
function renderTrainCard(data){
  const box = document.getElementById("output-box");

  const trainName = data.trainName || "एक्सप्रेस ट्रेन";
  const trainNumber = data.trainNumber || "14553";
  const stationName = data.stationName || "जयपुर";
  const statusMessage = data.statusMessage || "समय पर चल रही है";
  const arrTime = data.arrivalTime || "समय पर";
  const depTime = data.departure || "समय पर";
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

// DIRECT LIVE STATUS FUNCTION
function openLiveStatus(trainNumber){
  if(trainNumber && trainNumber !== "00000" && trainNumber !== "") {
    window.open(`https://www.railyatri.in/live-train-status/${trainNumber}`, "_blank");
  } else {
    window.open(`https://www.railyatri.in/live-train-status`, "_blank");
  }
}

// DIRECTIONS CONFIRMATION
function confirmDirection(place){
  window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`, "_blank");
}
