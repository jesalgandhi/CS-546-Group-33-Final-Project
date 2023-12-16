document.addEventListener('DOMContentLoaded', function() {
    let myForm = document.getElementById('login-form');
    let myForm2 = document.getElementById('registration-form');
    let emailAddress = document.getElementById('emailAddressInput');
    let password = document.getElementById('passwordInput');
    let interestsInput = document.getElementById('interestsInput');
    let selectedInterestsDiv = document.getElementById('selectedInterests'); // Div to display selected interests
    let errorCheck = document.getElementById('error');
    let formLabel = document.getElementById('formLabel');

    function updateSelectedInterests() {
        let selectedOptions = Array.from(interestsInput.options)
                                  .filter(option => option.selected)
                                  .map(option => option.value);
        selectedInterestsDiv.innerHTML = selectedOptions.join(', ');
    }

    interestsInput.addEventListener('change', function() {
        updateSelectedInterests();
    });

    if (myForm) {
        myForm.addEventListener('submit', (event) => {
            console.log('Login form submission fired');

            if (emailAddress.value.trim().length === 0 || password.value.trim().length === 0) {
                formLabel.classList.add('error');
                errorCheck.hidden = false;
                errorCheck.innerHTML = 'Email Address and/or Password must not be empty';
                event.preventDefault();
            } else {
                errorCheck.hidden = true;
                formLabel.classList.remove('error');
                console.log("Login form submitted");
            }
        });
    }

    if (myForm2) {
        myForm2.addEventListener('submit', (event) => {
            console.log('Registration form submission fired');
            
            let selectedInterests = getSelectedInterests();
            console.log('Selected Interests: ', selectedInterests);

            // Add your validation or processing for registration form here
            // Example: if (!selectedInterests.length) {...}

            // Uncomment below if you need to prevent the form submission for specific conditions
            // event.preventDefault();
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
});
