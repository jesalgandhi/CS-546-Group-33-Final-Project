document.addEventListener('DOMContentLoaded', function() {
    let registrationForm = document.getElementById('register-form');

    function isValidName(name) {
        return name === '' || /^[a-zA-Z]{2,25}$/.test(name);
    }
    
    function isValidEmail(email) {
        return email === '' || /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
    }
    
    function isValidPassword(password) {
        return password === '' || /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/.test(password);
    }
    
    function isValidPhoneNumber(phoneNumber) {
        return phoneNumber === '' || /^[0-9]{10}$/.test(phoneNumber);
    }
    
    function isValidBiography(biography) {
        return biography === '' || (typeof biography === 'string' && biography.trim().length > 0 && biography.trim().length <= 200);
    }
    
    function isValidAge(age) {
        return age === '' || (!isNaN(parseInt(age)) && parseInt(age) >= 18 && parseInt(age) <= 120);
    }
    
    function isValidInterests() {
        let checkboxes = document.querySelectorAll('input[name="interestsInput"]:checked');
        return checkboxes.length === 5 || checkboxes.length === 0;
    }
    
    function isValidPicture(picture) {
        return picture === '' || /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)*[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(#[-a-z\d_]*)?$/i.test(picture);
    }

    registrationForm.addEventListener('submit', function(event) {
        let errors = [];

        if (!isValidName(document.getElementById('firstNameInput').value)) errors.push("Invalid First Name");
        if (!isValidName(document.getElementById('lastNameInput').value)) errors.push("Invalid Last Name");
        if (!isValidEmail(document.getElementById('emailAddressInput').value)) errors.push("Invalid Email Address");
        if (!isValidPassword(document.getElementById('passwordInput').value)) errors.push("Invalid Password");
        if (!isValidPhoneNumber(document.getElementById('phonenumberInput').value)) errors.push("Invalid Phone Number");
        if (!isValidBiography(document.getElementById('biographyInput').value)) errors.push("Invalid Biography");
        if (!isValidAge(document.getElementById('ageInput').value)) errors.push("Invalid Age");
        if (!isValidInterests()) errors.push("Please select exactly 5 interests");
        if (!isValidPicture(document.getElementById('pictureInput').value)) errors.push("Invalid Picture URL");
       
       
        let clientSideErrorsDiv = document.getElementById('client-side-errors');

            if (errors.length > 0) {
                event.preventDefault();
                clientSideErrorsDiv.innerHTML = errors.join('<br>');
                clientSideErrorsDiv.hidden = false;
            } else {
                clientSideErrorsDiv.hidden = true;
            }
    });
});




$(document).ready(function () {
    // Initialize an array to store previously selected interests
    const previousInterests = [];
    
    // When the page loads, populate previousInterests with the user's interests
    $('input[name="interestsInput"]:checked').each(function () {
        previousInterests.push($(this).val());
    });

    $('input[name="interestsInput"]').on('change', function () {
        let checkedCount = $('input[name="interestsInput"]:checked').length;

        if (checkedCount === 5) {
            $('input[name="interestsInput"]:not(:checked)').prop('disabled', true);
        } else {
            $('input[name="interestsInput"]').prop('disabled', false);
        }
    });

    previousInterests.forEach(function (interest) {
        $(`input[name="interestsInput"][value="${interest}"]`).prop('checked', true);
    });

    $('#deleteButton').click(function(event) {
        event.preventDefault();

        $.ajax({
            url: '/settings', 
            type: 'DELETE',
            success: function(response) {
                if (response.success) window.location.href = response.redirectTo;
            },
            error: function() {
                console.log('Error deleting user');
                window.location.href = response.redirectTo;
            }
        });
    });
});
