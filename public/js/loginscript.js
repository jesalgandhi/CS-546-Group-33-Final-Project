document.addEventListener('DOMContentLoaded', function() {
    let registrationForm = document.getElementById('login-form');

    function isValidEmail(email) {
        return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
    }

    function isValidPassword(password) {
        return /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/.test(password);
    }

    registrationForm.addEventListener('submit', function(event) {
        let errors = [];

        if (!isValidEmail(document.getElementById('emailAddressInput').value)) {
            errors.push("Invalid Email Address");
        }
        if (!isValidPassword(document.getElementById('passwordInput').value)) {
            errors.push("Invalid Password");
        }

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