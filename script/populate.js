function requestAlbum() {
    var req = new XMLHttpRequest();
    
    req.onreadystatechange = function() { 
       if (req.readyState == 4 && req.status == 200) {
         processRequest(req.responseText);
       } else {
         console.log(“Error with Imgur Request.”);
       }
    }
    req.open(“GET”, request_url, true); // true for asynchronous     
    req.setRequestHeader(‘Authorization’, ‘Client-ID ‘ + clientId);
    req.send(null);
  }
  function processRequest(response_text) {
    if (response_text == “Not found”) {
      console.log(“Imgur album not found.”);
    } else {
      var json = JSON.parse(response_text);
      // You got your response back!
      // Do your thing here.
    }
  }

  requestAlbum();