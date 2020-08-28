function initMap() {
    var map = new google.maps.Map( document.getElementById( "map" ), {
                  center: { lat: 34.2393, lng: -118.5297 },
                  zoom: 16.6,
                  disableDefaultUI: true,
                  gestureHandling: 'none',
                  zoomControl: false,
                  scaleControl: false,
                  // Hide all labels on the maps
                  styles: [{ "featureType": "poi", "stylers": [{ "visibility": "off" }]},
                          { "featureType": "transit", "stylers": [{ "visibility": "off"}]},
                          { "featureType": "road", "elementType": "labels", "stylers": [{ "visibility": "off" }]}, 
                          { "featureType": "landscape", "elementType": "labels", "stylers": [{ "visibility": "off" }]}
                          ]});     
    // Querry all elements hoolding 5 Q&A and the results
    const q1 = document.querySelector("#q1");
    const a1 = document.querySelector("#a1");
    const q2 = document.querySelector("#q2");
    const a2 = document.querySelector("#a2");
    const q3 = document.querySelector("#q3");
    const a3 = document.querySelector("#a3"); 
    const q4 = document.querySelector("#q4");
    const a4 = document.querySelector("#a4");
    const q5 = document.querySelector("#q5");
    const a5 = document.querySelector("#a5");
    const re = document.querySelector("#re");
    // Two dimensional-array to hold all tested locations info
    const quiz = [ [ "Oviatt Library?", 34.24040, 34.23965, -118.5286, -118.5300, q1, a1 ],
                   [ "Klotz Health Center?", 34.238308, 34.238080, -118.525995, -118.526668, q2, a2 ],  
                   [ "Cypress Hall?", 34.236715, 34.236043, -118.529287, -118.530081, q3, a3 ],
                   [ "Lilac Hall?", 34.242616, 34.242390, -118.529342, -118.529744, q4, a4 ],
                   [ "Police Services", 34.238898, 34.238567, -118.532800, -118.533562, q5, a5 ] ] 
    /* Function verify a click point in the window of the tested location then
     * draw a rectangle for the tested location */
    var i = 0,          // click sequence order, strating from 0
        c = 0;          // number of correct answers
    q1.innerHTML = "Where is the " + quiz[0][0];
    // 5 flags to indicate the program needs to stop listening a click event
    var disableListener = [ false, false, false, false, false ]; 
    function drw(e, i) {
        // Block the event if it has been previously called
        if (disableListener[i])
          return;
        // Verify a click point in the window of the tested location
        let belowNorth = e.latLng.lat() <= quiz[i][1],
            aboveSouth = e.latLng.lat() >= quiz[i][2],
            leftEast   = e.latLng.lng() <= quiz[i][3],
            rightWest  = e.latLng.lng() >= quiz[i][4];
        // Default color of the rectangle
        let color = "green";          
        // Determine the click is a correct or an incorrect point
        if (belowNorth && aboveSouth && leftEast && rightWest) {
          quiz[i][6].innerHTML = "Your answer is " + "correct!";
          c++;
        }
        else {
          // Change the default color of the rectangle and the answer text to "red"
          quiz[i][6].style.color = color = "red";
          quiz[i][6].innerHTML = "Your answer is " + "incorrect!"; 
        }
        // Draw the rectangle for the tested location
        var r_1 = new google.maps.Rectangle({
            strokeColor: color,                 // changed by how correctly users click
            strokeOpacity: 1,
            strokeWeight: 4,
            fillColor: color,                   // changed by how correctly users click
            fillOpacity: 0.5,
            map: map,
            bounds: { north: quiz[i][1], south: quiz[i][2], east: quiz[i][3], west: quiz[i][4] } 
        });
        // Flag to indicate the function should stop listening the event
        disableListener[i] = true;
    } 
    /* An ordered sequence of double clicks will enable the function call for each of 5 questions */
    /* Play question 1 */
    google.maps.event.addListener(map, "dblclick", function(e) { 
        drw(e, 0);
        /* Play question 2 */
        q2.innerHTML = "Where is the " + quiz[1][0];
        google.maps.event.addListener(map, "dblclick", function(e) {
            drw(e, 1);
            /* Play question 3 */
            q3.innerHTML = "Where is the " + quiz[2][0];
            google.maps.event.addListener(map, "dblclick", function(e) {
                drw(e, 2);
                /* Play question 4 */
                q4.innerHTML = "Where is the " + quiz[3][0];
                google.maps.event.addListener(map, "dblclick", function(e) {
                    drw(e, 3);
                     /* Play question 5 */
                    q5.innerHTML = "Where is the " + quiz[4][0];
                    google.maps.event.addListener(map, "dblclick", function(e) {
                        drw(e, 4);
                        /* Show results */
                        re.innerHTML =  [ c, "Correct,", 5 - c, "Incorrect" ].join(" ");          
                    }) 
                }) 
            })       
        })
    }) 
}