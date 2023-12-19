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

        console.log(groupName);
        console.log(groupUsername);
        console.log(groupDescription);
        console.log(zipCode);
        console.log(radius);
        console.log(budget);
        console.log(numRoommates);
        console.log(genderPreference);
        console.log(groupPassword);


        let valid_radii = [1, 5, 10, 25, 50, 100, 250, 500, 1000];

        $('.create-join-error').hide().text('');

        if (!groupName) {
            showError('The group name field is empty.');
            return;
        }
        if (!groupUsername) {
            showError('The group username field is empty.');
            return;
        }
        if (!groupDescription) {
            showError('The group description field is empty.');
            return;
        }
        if (!zipCode || !isNumeric(zipCode) || zipCode.length < 5) {
            showError('Zipcode must be a 5-digit number.');
            return;
        }
        if (!radius || !isNumeric(radius) || !valid_radii.includes(Number(radius))) {
            showError('Invalid radius.');
            return;
        }
        if (!budget || !isNumeric(budget) || budget <= 0 || budget > 50000) {
            showError('The budget must be nonnegative and below 50k.');
            return;
        }
        if (!numRoommates || !isNumeric(numRoommates) || numRoommates < 1 || numRoommates > 4) {
            showError('The number of roommates must be 1-4.');
            return;
        }
        if (!['M', 'F', 'O'].includes(genderPreference)) {
            showError('The gender preference must be either M, F, or O.');
            return;
        }
        if (groupDescription.length > 1000) {
            showError('The description exceeds the 1000 character limit.');
            return;
        }
        if (groupUsername.includes(" ")) {
            showError(`${groupUsername} contains spaces, invalid!`);
            return;
        }
        if (groupPassword.length < 8 || groupPassword.length > 50) {
            showError('Group password must be between 8 and 50 characters long.');
            return;
        }

        this.submit();

        function showError(message) {
            $('.create-join-error').text(message).show();
        }

        function isNumeric(value) {
            return !isNaN(parseFloat(value)) && isFinite(value);
        }
        
    });
});
