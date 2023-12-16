// THIS FILE IS NOT DOING WHAT ITS SUPPOSED TO ALL RN, DOESNT ASK FOR LOCATION UPON PAGE LOADING, DK HOW TO FIX

let latitude = undefined;
let longitude = undefined;

// https://www.w3schools.com/html/html5_geolocation.asp
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setLocation(), function (err) {
            console.log(err.message);
        });
    }
};

function setLocation(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
}


function sendCoordinatesToServer(latitude, longitude) {
    
    $.ajax({
        url: `/groups/create/coords`,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ latitude: latitude, longitude: longitude }),
    
        success: function(coords) {
            console.log(coords);
        },
        error: function() {
            console.error("Error getting location");
        }
    });

};



$(document).ready(function() {
    console.log('WE IN THE MF DOCUMENT READY');
    getLocation();

    if ((latitude) && (longitude)) {
        sendCoordinatesToServer(latitude, longitude);
    }





});