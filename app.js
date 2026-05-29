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

        <div class="train-name">

          🚆 ${train.hindi}

          (${train.number})

        </div>

        <div class="station-name">

          📍 ${station.name || "स्टेशन"}

        </div>

        <div class="status-strip">

          ${liveStatus}

        </div>

      </div>

      <div class="card-body">

        <div class="time-grid">

          <div class="time-box">

            <div class="time-title">

              🟢 आगमन

            </div>

            <div class="time-value">

              ${arrivalTime}

            </div>

            <div style="
              margin-top:8px;
              font-size:14px;
              color:#d97706;
              font-weight:bold;
            ">

              अनुमानित:
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

            <div style="
              margin-top:8px;
              font-size:14px;
              color:#d97706;
              font-weight:bold;
            ">

              अनुमानित:
              ${expectedDeparture}

            </div>

          </div>

        </div>

        <div class="journey-box">

          🎤 आपने पूछा:

          <strong>

            ${spokenText}

          </strong>

          <div class="journey-line">

            लाइव रेलवे स्थिति प्राप्त

          </div>

        </div>

        <div class="card-actions">

          <button
            class="action-btn"
            onclick="
              window.open(
                'https://www.railyatri.in/live-train-status/${train.number}',
                '_blank'
              )
            "
          >

            🚉 लाइव स्रोत

          </button>

          <button
            class="action-btn"
            onclick="
              navigator.share({
                title:'RailSafar',
                text:'${train.hindi} ${liveStatus}',
                url:window.location.href
              })
            "
          >

            📤 शेयर

          </button>

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
// CONFIRM DIRECTION

function confirmDirection(place){

  const mapsUrl =

    `https://www.google.com/maps/dir/?api=1&origin=Current+Location&destination=${encodeURIComponent(place)}&travelmode=walking`;

  window.open(
    mapsUrl,
    "_blank"
  );
}
