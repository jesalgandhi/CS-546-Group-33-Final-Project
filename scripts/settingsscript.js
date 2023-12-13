// settings.js

document.addEventListener('DOMContentLoaded', () => {
    const settingsForm = document.getElementById('settings-form');
    const firstName = document.getElementById('firstNameInput');
    const lastName = document.getElementById('lastNameInput');
    const emailAddress = document.getElementById('emailAddressInput');
    const phoneNumber = document.getElementById('phoneNumberInput');
    const biography = document.getElementById('biographyInput');
    const age = document.getElementById('ageInput');
    const interests = document.getElementById('interestsInput');
    const errorCheck = document.getElementById('error');

    // Function to validate form data
    function validateForm() {
        if (!firstName.value.trim()) {
            return 'First name cannot be empty.';
        }
        if (!lastName.value.trim()) {
            return 'Last name cannot be empty.';
        }
        if (!emailAddress.value.trim()) {
            return 'Email address cannot be empty.';
        }
        // Additional validations as needed...
        return '';
    }

    if (settingsForm) {
        settingsForm.addEventListener('submit', (event) => {
            const errorMessage = validateForm();
            if (errorMessage) {
                errorCheck.hidden = false;
                errorCheck.textContent = errorMessage;
                event.preventDefault();
            } else {
                errorCheck.hidden = true;
            }
        });
    }
});
