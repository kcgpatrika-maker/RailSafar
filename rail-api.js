// SHARE APP

function shareApp(){

  if(navigator.share){

    navigator.share({

      title:'RailSafar',

      text:'RailSafar - आपकी यात्रा का स्मार्ट साथी',

      url:window.location.href

    });

  }else{

    alert(
      "Sharing not supported in this browser."
    );
  }
}

// FETCH LIVE RAIL DATA

async function fetchRailData(query){

  try{

    // REQUEST

    const response =

      await fetch(

        "https://railsafar-backend.onrender.com/rail-query",

        {

          method:"POST",

          headers:{
            "Content-Type":"application/json"
          },

          body:JSON.stringify({

            query:query
          })
        }
      );

    // INVALID RESPONSE

    if(!response.ok){

      console.log(

        "Server Error:",
        response.status

      );

      return null;
    }

    // JSON

    const data =

      await response.json();

    console.log(
      "Rail API:",
      data
    );

    // EMPTY

    if(!data){

      return null;
    }

    return data;

  }catch(error){

    console.log(

      "Rail API Error:",
      error
    );

    return null;
  }
}

// OPEN LIVE STATUS

function openLiveStatus(trainNumber){

  window.open(

    `https://www.railyatri.in/live-train-status/${trainNumber}`,

    "_blank"

  );
}

// OPEN PNR

function openPNR(){

  window.open(

    "https://www.railyatri.in/pnr-status",

    "_blank"

  );
}

// OPEN TICKET

function openTicketBooking(){

  window.open(

    "https://www.irctc.co.in/nget/train-search",

    "_blank"

  );
}

// OPEN TIME TABLE

function openTimeTable(){

  window.open(

    "https://enquiry.indianrail.gov.in/mntes/",

    "_blank"

  );
}

// OPEN RAILWAY WIKI

function openRailWiki(){

  const box =

    document.getElementById(
      "output-box"
    );

  box.innerHTML = `

    <div class="train-card">

      <div class="card-top">

        <div class="train-name">

          📘 रेलवे का विकीपीडिया

        </div>

        </div>

      <div class="card-body">

        <div class="wiki-list">

          <button
            class="wiki-item"
            onclick="openWikiPage('Indian_Railways')"
          >

            🇮🇳 Indian Railways

          </button>

          <button
            class="wiki-item"
            onclick="openWikiPage('North_Western_Railway')"
          >

            🚆 North Western Railway

          </button>

          <button
            class="wiki-item"
            onclick="openWikiPage('Western_Railway_zone')"
          >

            🚉 Western Railway

          </button>

          <button
            class="wiki-item"
            onclick="openWikiPage('North_Central_Railway')"
          >

            🛤️ North Central Railway

          </button>

          <button
            class="wiki-item"
            onclick="openWikiPage('Jaipur_railway_division')"
          >

            📍 Jaipur Division

          </button>

          <button
            class="wiki-item"
            onclick="openWikiPage('Ajmer_railway_division')"
          >

            📍 Ajmer Division

          </button>

          <button
            class="wiki-item"
            onclick="openWikiPage('Railway_Board_(India)')"
          >

            🏛️ Railway Board

          </button>

          <button
            class="wiki-item"
            onclick="openWikiPage('IRCTC')"
          >

            🎫 IRCTC

          </button>

          <button
            class="wiki-item"
            onclick="openWikiPage('Dedicated_Freight_Corridor_Corporation_of_India')"
          >

            🚛 Freight Corridor

          </button>

        </div>

      </div>

    </div>

  `;
}

// OPEN WIKI PAGE

function openWikiPage(page){

  window.open(

    `https://en.wikipedia.org/wiki/${page}`,

    "_blank"
  );
}
