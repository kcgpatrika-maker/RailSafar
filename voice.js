// MIC SHOW

function showMic(){

  document
    .getElementById("mic-overlay")
    .style.display = "flex";
}

// MIC HIDE

function hideMic(){

  document
    .getElementById("mic-overlay")
    .style.display = "none";
}

// SPEAK

function speakText(text){

  const cleanText =

    text
      .replace("📡","")
      .replace("⏱️","")
      .replace("✅","")
      .replace("❌","")
      .replace("🚨","");

  const speech =

    new SpeechSynthesisUtterance(
      cleanText
    );

  speech.lang = "hi-IN";

  speech.rate = 1;

  speech.pitch = 1;

  window.speechSynthesis.speak(speech);
}

// TRAIN BUTTON

function askTrainName(){

  if(
    'webkitSpeechRecognition' in window
  ){

    showMic();

    const recognition =

      new webkitSpeechRecognition();

    recognition.lang = 'hi-IN';

    recognition.interimResults = false;

    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = function(event){

      hideMic();

      const spokenText =

        event.results[0][0]
        .transcript
        .trim();
      let prefetchedResult = null;

fetchRailData(spokenText)
  .then(data => {

    prefetchedResult = data;

  })
  .catch(err => {

    console.log(
      "Prefetch Error:",
      err
    );

  });

      const box =

        document.getElementById(
          "output-box"
        );

      // VERIFY CARD

      box.innerHTML = `

        <div class="train-card">

          <div class="card-body">

            <div style="
              font-size:18px;
              font-weight:bold;
              margin-bottom:15px;
              text-align:center;
            ">

              🎤 क्या आपने यही कहा?

            </div>

            <div style="
              background:#eef4ff;
              padding:14px;
              border-radius:12px;
              text-align:center;
              font-size:18px;
              line-height:1.6;
            ">

              ${spokenText}

            </div>

            <div
              class="card-actions"
              style="margin-top:20px;"
            >

              <button
                class="action-btn"
                id="confirm-train-btn"
              >

                ✅ हाँ

              </button>

              <button
                class="action-btn"
                onclick="askTrainName()"
              >

                ❌ नहीं

              </button>

            </div>

          </div>

        </div>

      `;

     // BUTTON EVENT

      setTimeout(() => {

        const confirmBtn =

          document.getElementById(
            "confirm-train-btn"
          );

        if(confirmBtn){

          confirmBtn.addEventListener(
  "click",
  () => {

    if(prefetchedResult){

      confirmTrainQuery(
        spokenText,
        prefetchedResult
      );

    }else{

      confirmTrainQuery(
        spokenText
      );

    }

  }
);

      }, 100);

    };

    recognition.onerror = function(){

      hideMic();

      alert(
        "आवाज़ समझने में समस्या हुई"
      );
    };

    recognition.onend = hideMic;

  }else{

    alert(
      "Voice Support उपलब्ध नहीं है"
    );
  }
}

// DIRECTIONS BUTTON

function askDirections(){

  if(
    'webkitSpeechRecognition' in window
  ){

    showMic();

    const recognition =

      new webkitSpeechRecognition();

    recognition.lang = 'hi-IN';

    recognition.start();

    recognition.onresult = function(event){

      hideMic();

      const spokenText =

        event.results[0][0]
        .transcript
        .trim();

      const box =

        document.getElementById(
          "output-box"
        );

      box.innerHTML = `

        <div class="train-card">

          <div class="card-body">

            <div style="
              font-size:18px;
              font-weight:bold;
              margin-bottom:15px;
              text-align:center;
            ">

              🧭 क्या आपको यही जगह जाना है?

            </div>

            <div style="
              background:#fff7ed;
              padding:14px;
              border-radius:12px;
              text-align:center;
              font-size:18px;
              line-height:1.6;
            ">

              ${spokenText}

            </div>

            <div
              class="card-actions"
              style="margin-top:20px;"
            >

              <button
                class="action-btn"
                onclick="confirmDirection('${spokenText}')"
              >

                ✅ हाँ

              </button>

              <button
                class="action-btn"
                onclick="askDirections()"
              >

                ❌ नहीं

              </button>

            </div>

          </div>

        </div>

      `;
    };

    recognition.onerror = function(){

      hideMic();

      alert(
        "आवाज़ समझने में समस्या हुई"
      );
    };

    recognition.onend = hideMic;
  }
}
