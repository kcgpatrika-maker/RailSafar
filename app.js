// CONFIRM TRAIN QUERY

async function confirmTrainQuery(
  spokenText
){

  const box =

    document.getElementById(
      "output-box"
    );

  // LOADING

  box.innerHTML = `

    <div class="train-card">

      <div class="card-body"
        style="
          text-align:center;
          padding:25px;
        "
      >

        जानकारी प्राप्त की जा रही है...

      </div>

    </div>

  `;

  // FETCH DATA

  const result =

    await fetchRailData(
      spokenText
    );

  // API ERROR

  if(!result){

    box.innerHTML = `

      <div class="train-card">

        <div class="card-body">

          ❌ सर्वर से जानकारी नहीं मिली

        </div>

      </div>

    `;

    return;
  }

  // TRAIN NOT FOUND

  if(!result.train){

    box.innerHTML = `

      <div class="train-card">

        <div class="card-body">

          ❌ ट्रेन पहचान में नहीं आई

        </div>

      </div>

    `;

    return;
  }

  // TRAIN

  const train =
    result.train;

  // STATION

  const station =
    result.station || {};

  // LIVE STATUS

  const liveStatus =

    result.liveStatus ||

    "📡 लाइव स्थिति उपलब्ध नहीं है";
  const currentLocation =
  result.currentLocation ||
  "उपलब्ध नहीं";

const nextStation =
  result.nextStation ||
  "उपलब्ध नहीं";

  // DELAY

  const delayMinutes =

    result.delayMinutes || 0;

  // TIMES

  const arrivalTime =

    station.arrival ||
    "--";

  const departureTime =

    station.departure ||
    "--";

  // EXPECTED TIMES

  let expectedArrival =
    "--";

  let expectedDeparture =
    "--";

  if(arrivalTime !== "--"){

    expectedArrival =

      addDelayToTime(
        arrivalTime,
        delayMinutes
      );
  }

  if(departureTime !== "--"){

    expectedDeparture =

      addDelayToTime(
        departureTime,
        delayMinutes
      );
  }

  // FINAL CARD

  box.innerHTML = `

<div class="train-card">

  <div class="card-top">

    <button
      onclick="
        navigator.share({
          title:'RailSafar',
          text:'${train.hindi} ${liveStatus}',
          url:window.location.href
        })
      "
      style="
        position:absolute;
        top:12px;
        right:12px;
        border:none;
        background:none;
        font-size:20px;
        cursor:pointer;
      "
    >
      📤
    </button>

    <div class="train-name">
  🚆 ${train.hindi} (${train.number})
</div>
  </div>

  <div class="card-body">

    <div
  style="
    display:flex;
    align-items:center;
    gap:8px;
    margin-bottom:15px;
    font-size:16px;
    font-weight:600;
  "
>
  <span>🟢 लाइव स्थिति:</span>
  <span>${liveStatus}</span>
</div>
</div>
    </div>

    <button
      onclick="
        window.open(
          'https://www.railyatri.in/live-train-status/${train.number}',
          '_blank'
        )
      "
      style="
        width:75%;
        margin:0 auto 18px auto;
        display:block;
        border:none;
        border-radius:14px;
        padding:14px;
        font-size:17px;
        font-weight:bold;
        color:white;
        background:
        linear-gradient(
          135deg,
          #2563eb,
          #0ea5e9
        );
        box-shadow:
        0 4px 12px rgba(0,0,0,.18);
        margin-bottom:18px;
        cursor:pointer;
      "
    >
      🚉 लाइव ट्रेन देखें
    </button>

    <div
  style="
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:10px;
    margin-bottom:15px;
  "
>

  <div
    style="
      background:#eef4ff;
      border-radius:12px;
      padding:12px;
      text-align:center;
    "
  >
    <div style="font-size:13px;color:#666;">
      📍 वर्तमान
    </div>

    <div
      style="
        margin-top:5px;
        font-weight:bold;
        font-size:16px;
      "
    >
      ${currentLocation || "—"}
    </div>
  </div>

  <div
    style="
      background:#eef4ff;
      border-radius:12px;
      padding:12px;
      text-align:center;
    "
  >
    <div style="font-size:13px;color:#666;">
      🚉 अगला
    </div>

    <div
      style="
        margin-top:5px;
        font-weight:bold;
        font-size:16px;
      "
    >
      ${nextStation || "—"}
    </div>
  </div>

</div>
        <div
          style="
            font-size:18px;
            font-weight:bold;
          "
        >
          ${currentLocation || "जानकारी उपलब्ध नहीं"}
        </div>
      </div>

      <div>
        <div
          style="
            font-size:13px;
            color:#666;
          "
        >
          🚉 अगला स्टेशन
        </div>

        <div
          style="
            font-size:18px;
            font-weight:bold;
          "
        >
          ${nextStation || "जानकारी उपलब्ध नहीं"}
        </div>
      </div>

    </div>

    <div class="time-grid">

      <div class="time-box">

        <div class="time-title">
          🟢 आगमन
        </div>

        <div class="time-value">
          ${arrivalTime}
        </div>

        <div
          style="
            margin-top:6px;
            color:#d97706;
            font-weight:bold;
          "
        >
          ${expectedArrival}
        </div>

      </div>

      <div class="time-box">

        <div class="time-title">
          🔴 प्रस्थान
        </div>

        <div class="time-value">
          ${departureTime}
        </div>

        <div
          style="
            margin-top:6px;
            color:#d97706;
            font-weight:bold;
          "
        >
          ${expectedDeparture}
        </div>

      </div>

    </div>
    
  </div>

</div>

`;

  // VOICE

    const cleanVoice =

    liveStatus
    .replace("⏱️","")
    .replace("✅","")
    .replace("❌","")
    .replace("🚨","")
    .replace("📡","");

      speakText(

    `${train.hindi}
     ${cleanVoice}`

  );

}

// CONFIRM DIRECTION

function confirmDirection(place){

  const mapsUrl =

    `https://www.google.com/maps/dir/?api=1&origin=Current+Location&destination=${encodeURIComponent(place)}&travelmode=walking`;

  window.open(
    mapsUrl,
    "_blank"
  );

}
