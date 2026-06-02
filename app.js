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

  <div
    class="card-top"
    style="
      position:relative;
    "
  >

    <button
      onclick="
        document.getElementById('output-box').innerHTML='';
      "
      style="
        position:absolute;
        top:10px;
        right:12px;
        border:none;
        background:none;
        color:white;
        font-size:22px;
        cursor:pointer;
      "
    >
      ✖
    </button>

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
        top:10px;
        right:48px;
        border:none;
        background:none;
        color:white;
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

  <div
    class="card-body"
    style="
      background:#f8fafc;
    "
  >

    <!-- LIVE STATUS -->

    <div
      style="
        display:flex;
        align-items:center;
        gap:8px;
        font-size:17px;
        font-weight:bold;
        margin-bottom:12px;
      "
    >
      <span>🟢 लाइव स्थिति:</span>
      <span>${liveStatus}</span>
    </div>

    <!-- LIVE LOCATION -->

    <div
      style="
        background:#eef4ff;
        border-radius:12px;
        padding:12px;
        margin-bottom:14px;
        line-height:1.8;
      "
    >

      <div>
        📍 वर्तमान:
        <b>
          ${currentLocation || "उपलब्ध नहीं"}
        </b>
      </div>

      <div>
        🚉 अगला स्टेशन:
        <b>
          ${nextStation || "उपलब्ध नहीं"}
        </b>
      </div>

    </div>

    <!-- LIVE BUTTON -->

    <div
      style="
        text-align:center;
        margin-bottom:16px;
      "
    >

      <button
        onclick="
          window.open(
            'https://www.railyatri.in/live-train-status/${train.number}',
            '_blank'
          )
        "
        style="
          border:none;
          border-radius:12px;
          padding:12px 24px;
          font-size:16px;
          font-weight:bold;
          color:white;
          background:#f97316;
          box-shadow:0 4px 10px rgba(0,0,0,.15);
          cursor:pointer;
        "
      >
        🚉 लाइव ट्रेन देखें
      </button>

    </div>

    <!-- STATION INFO -->

    <div
      style="
        text-align:center;
        font-size:18px;
        font-weight:bold;
        color:#1e3a8a;
        margin-bottom:14px;
      "
    >
      📍 ${station.name}
    </div>

    <!-- ARRIVAL / DEPARTURE -->

    <div
      style="
        background:white;
        border-radius:12px;
        padding:14px;
        line-height:2;
        box-shadow:0 1px 4px rgba(0,0,0,.08);
      "
    >

      <div>

        🟢 आगमन:

        <b>
          ${arrivalTime}
        </b>

        <span
          style="
            color:#dc2626;
            font-weight:bold;
            margin-left:8px;
          "
        >
          ${expectedArrival}
        </span>

      </div>

      <div>

        🔴 प्रस्थान:

        <b>
          ${departureTime}
        </b>

        <span
          style="
            color:#dc2626;
            font-weight:bold;
            margin-left:8px;
          "
        >
          ${expectedDeparture}
        </span>

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
