document.addEventListener('DOMContentLoaded', function() {
    // Form and input elements
    let myForm = document.getElementById('login-form');
    let myForm2 = document.getElementById('registration-form');
    let emailAddress = document.getElementById('emailAddressInput');
    let password = document.getElementById('passwordInput');
    let interestsInput = document.getElementById('interestsInput');
    let selectedInterestsDiv = document.getElementById('selectedInterests');
    let errorCheck = document.getElementById('client-error');
    let formLabel = document.getElementById('formLabel');

    // Client-side validation functions
    function isValidName(name) {
        return /^[a-zA-Z]{2,25}$/.test(name);
    }

    function isValidEmail(email) {
        return/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
    }

    function isValidPassword(password) {
        return /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/.test(password);
    }

    function isValidPhoneNumber(phoneNumber) {
        return /^[0-9]{10}$/.test(phoneNumber);
    }

    function isValidBiography(biography) {
        return typeof biography === 'string' && biography.trim().length > 0 && biography.trim().length <= 200;
    }

    function isValidAge(age) {
        let parsedAge = parseInt(age);
        return !isNaN(parsedAge) && parsedAge >= 18 && parsedAge <= 120;
    }

    function isValidInterests(interests) {
        return Array.isArray(interests) && interests.every(interest => typeof interest === 'string');
    }
    
    function isValidPictures(picture) {
        return /^(http(s)?:\/\/)?([w|W]{3}\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/.*)?$/.test(picture);
    }

    // Update selected interests
    function updateSelectedInterests() {
        let selectedOptions = Array.from(interestsInput.options)
                                  .filter(option => option.selected)
                                  .map(option => parseInt(option.value));
        selectedInterestsDiv.innerHTML = selectedOptions.join(', ');
    }

    // Event listeners for interest selection
    interestsInput.addEventListener('change', function() {
        updateSelectedInterests();
    });

    // Login form submission event listener
    if (myForm) {
        myForm.addEventListener('submit', (event) => {
            if (emailAddress.value.trim().length === 0 || password.value.trim().length === 0) {
                formLabel.classList.add('error');
                errorCheck.hidden = false;
                errorCheck.innerHTML = 'Email Address and/or Password must not be empty';
                event.preventDefault();
            } else {
                errorCheck.hidden = true;
                formLabel.classList.remove('error');
            }
        });
    }

    // Registration form submission event listener with validation
    if (myForm2) {
        myForm2.addEventListener('submit', (event) => {
            let errors = [];

            // Validate each field
            let firstNameInput = document.getElementById('firstNameInput');
            let lastNameInput = document.getElementById('lastNameInput');
            let emailAddressInput = document.getElementById('emailAddressInput');
            let passwordInput = document.getElementById('passwordInput');
            let phoneNumberInput = document.getElementById('phoneNumberInput');
            let biographyInput = document.getElementById('biographyInput');
            let ageInput = document.getElementById('ageInput');
            let interestsInput = document.getElementById('interestsInput');
            let pictureInput = document.getElementById('pictureInput');


            if (!isValidName(firstNameInput.value)) errors.push("Invalid First Name");
            if (!isValidName(lastNameInput.value)) errors.push("Invalid Last Name");
            if (!isValidEmail(emailAddressInput.value)) errors.push("Invalid Email Address");
            if (!isValidPassword(passwordInput.value)) errors.push("Invalid Password");
            if (!isValidPhoneNumber(phoneNumberInput.value)) errors.push("Invalid Phone Number");
            if (!isValidBiography(biographyInput.value)) errors.push("Invalid Biography");
            if (!isValidAge(ageInput.value)) errors.push("Invalid Age");
            if (!isValidInterests(interestsInput.value)) errors.push("Invalid Interests");
            if (!isValidPictures(pictureInput.value)) errors.push("Invalid Picture");

            if (errors.length > 0) {
                // Prevent form submission
                event.preventDefault();
                // Display errors
                errorCheck.innerHTML = errors.join('<br>');
                errorCheck.hidden = false;
            } else {
                errorCheck.hidden = true;
            }
        });
    }
});

$(document).ready(function () {
    // Initialize an array to store previously selected interests
    const previousInterests = [];
    
    // When the page loads, populate previousInterests with the user's interests
    $('input[name="interestsInput"]:checked').each(function () {
        previousInterests.push($(this).val());
    });

    // Disable other checkboxes if the limit is reached
    $('input[name="interestsInput"]').on('change', function () {
        let checkedCount = $('input[name="interestsInput"]:checked').length;

        if (checkedCount === 5) {
            $('input[name="interestsInput"]:not(:checked)').prop('disabled', true);
        } else {
            $('input[name="interestsInput"]').prop('disabled', false);
        }
    });

    // Set the checked attribute based on the values in previousInterests
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
