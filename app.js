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
const platformNumber =
  result.platformNumber || "";

const statusAsOf =
  result.statusAsOf || "";

const distanceInfo =
  result.distanceInfo || "";
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
    margin-bottom:12px;
    font-weight:600;
    flex-wrap:wrap;
  "
>
  <span>🟢 लाइव स्थिति:</span>
  <span>${liveStatus}</span>
</div>

<div
  style="
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:8px;
    margin-bottom:14px;
  "
>

  <div
    style="
      background:white;
      border-radius:10px;
      padding:10px;
      text-align:center;
    "
  >
    <div style="font-size:12px;color:#666;">
      📍 वर्तमान स्थिति
    </div>

    <div
      style="
        font-weight:bold;
        margin-top:4px;
      "
    >
      ${currentLocation}
    </div>

    ${platformNumber
      ? `<div style="font-size:12px;color:#666;">प्लेटफॉर्म ${platformNumber}</div>`
      : ""
    }

  </div>

  <div
    style="
      background:white;
      border-radius:10px;
      padding:10px;
      text-align:center;
    "
  >
    <div style="font-size:12px;color:#666;">
      🚉 अगला स्टेशन
    </div>

    <div
      style="
        font-weight:bold;
        margin-top:4px;
      "
    >
      ${nextStation}
    </div>

    ${distanceInfo
      ? `<div style="font-size:12px;color:#666;">${distanceInfo}</div>`
      : ""
    }

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
    display:block;
    margin:0 auto 14px auto;
    width:70%;
    border:none;
    border-radius:12px;
    padding:12px;
    font-weight:bold;
    color:white;
    background:linear-gradient(135deg,#2563eb,#0ea5e9);
    cursor:pointer;
  "
>
  🚉 लाइव ट्रेन देखें
</button>

${statusAsOf
  ? `
<div
  style="
    text-align:center;
    font-size:12px;
    color:#666;
    margin-bottom:12px;
  "
>
  अपडेट: ${statusAsOf}
</div>
`
  : ""
}

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
