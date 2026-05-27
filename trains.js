// TRAIN DATABASE

const trains = [

  {

    number:"14864",

    hindi:"मरुधर एक्सप्रेस",

    english:"Marudhar Express",

    aliases:[
      "मरुधर",
      "मरुधर ट्रेन"
    ],

    stations:{

      "जयपुर":{

        aliases:[
          "जयपुर",
          "जयपुर जंक्शन",
          "JP"
        ],

        code:"JP",

        arrival:"01:15 AM",

        departure:"01:25 AM"
      },

      "अजमेर":{

        aliases:[
          "अजमेर",
          "अजमेर जंक्शन",
          "AII"
        ],

        code:"AII",

        arrival:"11:20 PM",

        departure:"11:30 PM"
      }

    }

  },

  {

    number:"12413",

    hindi:"पूजा एक्सप्रेस",

    english:"Pooja Express",

    aliases:[
      "पूजा",
      "पूजा एक्सप्रेस",
      "अमृतसर",
      "अमृतसर एक्सप्रेस"
    ],

    stations:{

      "जयपुर":{

        aliases:[
          "जयपुर",
          "जयपुर जंक्शन",
          "JP"
        ],

        code:"JP",

        arrival:"07:45 PM",

        departure:"07:50 PM"
      },

      "अलवर":{

        aliases:[
          "अलवर",
          "AWR"
        ],

        code:"AWR",

        arrival:"09:20 PM",

        departure:"09:22 PM"
      }

    }

  }

];

// QUERY PARSER

function parseTrainQuery(text){

  text = text.trim();

  let intent = "arrival";

  // ARRIVAL

  if(

    text.includes("आएगी") ||

    text.includes("आगमन") ||

    text.includes("पहुंचेगी") ||

    text.includes("टाइम") ||

    text.includes("स्टेटस")

  ){

    intent = "arrival";
  }

  // DEPARTURE

  if(

    text.includes("जाएगी") ||

    text.includes("निकलेगी") ||

    text.includes("प्रस्थान")

  ){

    intent = "departure";
  }

  // TRAIN MATCH

  let matchedTrain = null;

  for(const train of trains){

    if(

      text.includes(
        train.hindi
      )

    ){

      matchedTrain = train;

      break;
    }

    if(

      text.includes(
        train.english
      )

    ){

      matchedTrain = train;

      break;
    }

    for(const alias of train.aliases){

      if(
        text.includes(alias)
      ){

        matchedTrain = train;

        break;
      }
    }

    if(matchedTrain) break;
  }

  // STATION MATCH

  let matchedStation = null;

  if(matchedTrain){

    for(const stationName in matchedTrain.stations){

      const stationData =

        matchedTrain
        .stations[stationName];

      // NAME

      if(
        text.includes(stationName)
      ){

        matchedStation =
          stationName;

        break;
      }

      // ALIAS

      for(const alias of stationData.aliases){

        if(
          text.includes(alias)
        ){

          matchedStation =
            stationName;

          break;
        }
      }

      if(matchedStation) break;
    }
  }

  // DEFAULT STATION

  if(
    !matchedStation &&
    matchedTrain
  ){

    matchedStation =

      Object.keys(
        matchedTrain.stations
      )[0];
  }

  return{

    train:matchedTrain,

    station:matchedStation,

    intent:intent
  };
}

// TIME CALCULATOR

function addDelayToTime(

  timeStr,
  delayMinutes

){

  // INVALID

  if(

    !timeStr ||

    timeStr === "--"

  ){

    return "--";
  }

  let [time, modifier] =

    timeStr.split(" ");

  let [hours, minutes] =

    time.split(":");

  hours =
    parseInt(hours);

  minutes =
    parseInt(minutes);

  // PM

  if(

    modifier === "PM" &&

    hours !== 12

  ){

    hours += 12;
  }

  // 12 AM

  if(

    modifier === "AM" &&

    hours === 12

  ){

    hours = 0;
  }

  const date = new Date();

  date.setHours(hours);

  date.setMinutes(minutes);

  // ADD DELAY

  date.setMinutes(

    date.getMinutes() +

    delayMinutes

  );

  let newHours =

    date.getHours();

  let newMinutes =

    date.getMinutes();

  let ampm = "AM";

  if(newHours >= 12){

    ampm = "PM";
  }

  newHours =
    newHours % 12;

  if(newHours === 0){

    newHours = 12;
  }

  newMinutes =

    newMinutes
    .toString()
    .padStart(2,'0');

  return `

    ${newHours}:${newMinutes} ${ampm}

  `.trim();
}
