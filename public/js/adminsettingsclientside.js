document.addEventListener('DOMContentLoaded', function() {
    let adminSettingsForm = document.getElementById('register-form');

    function isValidGroupName(name) {
        return name === '' || (/^[a-zA-Z0-9 ]{1,50}$/.test(name) && !name.includes('  '));
    }
    
    function isValidGroupDescription(description) {
        return description === '' || (typeof description === 'string' && description.trim().length > 0 && description.trim().length <= 1000);
    }
    
    function isValidGroupUsername(username) {
        return username === '' || /^[a-zA-Z0-9]{1,50}$/.test(username);
    }
    
    function isValidBudget(budget) {
        return budget === '' || (!isNaN(parseInt(budget)) && parseInt(budget) > 0 && parseInt(budget) <= 50000);
    }
    
    function isValidGenderPreference(gender) {
        return gender === '' || ['M', 'F', 'O'].includes(gender.toUpperCase());
    }
    
    function isValidPassword(password) {
        return password === '' || /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,50}$/.test(password);
    }
    
    function isValidRadius(radius) {
        return radius === '' || (!isNaN(parseInt(radius)) && parseInt(radius) > 0 && parseInt(radius) <= 1000);
    }
    
    function isValidRoommates(numRoommates) {
        return numRoommates === '' || (!isNaN(parseInt(numRoommates)) && parseInt(numRoommates) >= 1 && parseInt(numRoommates) <= 4);
    }
    
    // function isValidPicture(picture) {
    //     return picture === '' || /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)*[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(#[-a-z\d_]*)?$/i.test(picture);
    // }
    

    adminSettingsForm.addEventListener('submit', function(event) {
        let errors = [];
        let newPassword = true;

        let groupNameInput = document.getElementById('groupNameInput').value;
        let groupDescriptionInput = document.getElementById('groupDescriptionInput').value;
        let groupUsernameInput = document.getElementById('groupUsernameInput').value;
        let budgetInput = document.getElementById('budgetInput').value;
        let genderPreferenceInput = document.getElementById('genderPreferenceInput').value;
        let groupPasswordInput = document.getElementById('groupPasswordInput').value;
        let groupConfirmPasswordInput = document.getElementById('groupConfirmPasswordInput').value;
        let radiusInput = document.getElementById('radiusInput').value;
        let numRoommatesInput = document.getElementById('numRoommatesInput').value;
        // let groupPictureInput = document.getElementById('groupPictureInput').value;

        if (!isValidGroupName(groupNameInput)) errors.push("Invalid Group Name");
        if (!isValidGroupDescription(groupDescriptionInput)) errors.push("Invalid Group Description");
        if (!isValidGroupUsername(groupUsernameInput)) errors.push("Invalid Group Username");
        if (!isValidBudget(budgetInput)) errors.push("Invalid Budget");
        if (!isValidGenderPreference(genderPreferenceInput)) errors.push("Invalid Gender Preference");
        if (newPassword && !isValidPassword(groupPasswordInput)) errors.push("Invalid Group Password");
        if (newPassword && (groupConfirmPasswordInput !== groupPasswordInput)) errors.push("Passwords do not Match");
        if (!isValidRadius(radiusInput)) errors.push("Invalid Radius");
        if (!isValidRoommates(numRoommatesInput)) errors.push("Invalid Number of Roommates");
        // if (!isValidPicture(groupPictureInput)) errors.push("Invalid Picture URL");
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
