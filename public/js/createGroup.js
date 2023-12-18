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



// CLIENT SIDE VALIDATION
$(document).ready(function() {
    $('#create-form').submit(function(event) {
        // console.log("Validation triggered");
        event.preventDefault();

        // Getting the form inputs
        let groupName = $('#groupName').val().trim();
        let groupUsername = $('#groupUsername').val().trim();
        let groupDescription = $('#groupDescription').val().trim();
        let zipCode = $('#zipCode').val();
        let radius = $('#radius').val();
        let budget = $('#budget').val();
        let numRoommates = $('#numRoommates').val();
        let genderPreference = $('#genderPreference').val().trim().toUpperCase();
        let groupPassword = $('#groupPassword').val().trim();

        // console.log(groupName);
        // console.log(groupUsername);
        // console.log(groupDescription);
        // console.log(zipCode);
        // console.log(radius);
        // console.log(budget);
        // console.log(numRoommates);
        // console.log(genderPreference);
        // console.log(groupPassword);


        let valid_radii = [1, 5, 10, 25, 50, 100, 250, 500, 1000];

        let isValid = true; // will decide if there are NO errors or not

        $('#alert').hide().text('');

        while(isValid) {

            // ensuring inputs are there and are strings
            if ( (!groupName) || (!groupUsername) || (!groupDescription) || (!zipCode) || (!radius) || (!budget) || (!numRoommates) || (!genderPreference) || (!groupPassword) ) {
                $('#alert').text('Please provide all of the required inputs.').show(); isValid = false; continue;
            } 

            if (!Number(zipCode)) {
                $('#alert').text('Zipcode must be a number.').show(); isValid = false; continue;
            }

            if (!Number(radius))  {
                $('#alert').text('Radius must be a number').show(); isValid = false; continue;
            } 

            if (!Number(budget)) {
                $('#alert').text('Budget must be a number.').show(); isValid = false; continue;
            }  

            if (!Number(numRoommates)) {
                $('#alert').text('Number of roommates must be a number.').show(); isValid = false; continue;
            } 

            if ( !valid_radii.includes(radius) ) {
                $('#alert').text('Invalid radius.').show(); isValid = false; continue;
            } 

            if (budget <= 0 || budget > 50000) {
                console.log('bro');
                $('#alert').text('The budget must be nonnegative and below 50k.').show(); isValid = false; continue;
            } 

            if (numRoommates < 1 || numRoommates > 4) {
                $('#alert').text('The number of roommates must be 1-4.').show(); isValid = false; continue;
            } 

            if ( (genderPreference !== 'M') && (genderPreference !== 'F') && (genderPreference !== 'O') ) {
                $('#alert').text('The gender preference must be either M, F, or O').show(); isValid = false; continue;
            } 

            if (groupName.length === 0) {
                $('#alert').text('The group name field is empty.').show(); isValid = false; continue;
            } 

            if (groupDescription.length === 0) {
                $('#alert').text('The group description field is empty.').show(); isValid = false; continue;
            } 

            if (groupUsername.length === 0) {
                $('#alert').text('The group username field is empty.').show(); isValid = false; continue;
            } 

            if (groupPassword.length === 0) {
                $('#alert').text('The group password field is empty.').show(); isValid = false; continue;
            } 

            if (groupDescription.length > 1000) {
                $('#alert').text('The description exceeds the 1000 character limit.').show(); isValid = false; continue;
            } 

            if (groupUsername.split(" ").length > 1) {
                $('#alert').text(`${groupUsername} contains spaces, invalid!`).show(); isValid = false; continue;
            } 

            if (groupPassword.length < 8 || groupPassword.length > 50) {
                $('#alert').text(`Group password must be > 8 characters and < 50 characters long.`).show(); isValid = false; continue;
            } 

            isValid = false;
        
        }
        // console.log('bro');
        this.submit();
        
    });
});
