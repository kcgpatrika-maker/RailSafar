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

    const data =
      await response.json();

    console.log(
      "Rail API:",
      data
    );

    return data;

  }catch(error){

    console.log(
      "Rail API Error:",
      error
    );

    return null;
  }
}
