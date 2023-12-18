// CLIENT SIDE VALIDATION
$(document).ready(function() {
    $('#join-form').submit(function(event) {
        event.preventDefault();

        // Getting the form inputs
        let groupUsername = $('#groupUsername').val().trim();
        let groupPassword = $('#groupPassword').val().trim();


        let isValid = true; // will decide if there are NO errors or not

        $('.create-join-error').hide().text('');

        // ensuring inputs are there and are strings
        if ( (!groupUsername) || (!groupPassword) ) {
            $('.create-join-error').text('Please provide all of the required inputs.').show(); isValid = false;
        } 

        else if (groupUsername.length === 0) {
            $('.create-join-error').text('The group username field is empty.').show(); isValid = false;
        } 

        else if (groupPassword.length === 0) {
            $('.create-join-error').text('The group password field is empty.').show(); isValid = false;
        } 

        else if (groupUsername.split(" ").length > 1) {
            $('.create-join-error').text(`${groupUsername} contains spaces, invalid!`).show(); isValid = false;
        } 

        else if (groupPassword.length < 8 || groupPassword.length > 50) {
            $('.create-join-error').text(`Group password must be > 8 characters and < 50 characters long.`).show(); isValid = false;
        } 

        if (isValid) {
            this.submit();
        }
    });
});