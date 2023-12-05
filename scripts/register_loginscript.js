let myForm = document.getElementById('login-form');
let myForm2 = document.getElementById('registration-form');
let emailAddress = document.getElementById('emailAddressInput');
let password = document.getElementById('passwordInput');
let errorCheck = document.getElementById('error');
let formLabel = document.getElementById('formLabel');

if (myForm && !myForm2)
{
    myForm.addEventListener('submit', (event) => 
    {   
        console.log('Form submission fired');
        //event.preventDefault();
        console.log('Has a form');

        if (emailAddress.value.trim().length == 0 || password.value.trim().length == 0) 
        {
            formLabel.classList.remove('error');
            emailAddress.value = '';
            passwordInput.value = '';
            errorCheck.hidden = false;
            errorCheck.innerHTML = 'Email Address and/or Password must not be empty';
            formLabel.className = 'error';
            passwordInput.className = 'inputClass';
            event.preventDefault();
            myForm.reset();
        }


        else
        {
            errorCheck.hidden = true;
            formLabel.classList.remove('error');
            console.log("Login form submitted");
        }
    });
}

else if (myForm2 && myForm)
{
    myForm2.addEventListener('submit', (event) => 
    {   
        console.log('Form submission fired');
        //event.preventDefault();
        console.log('Has a form');

       /* if (emailAddress.value.trim().length == 0 || password.value.trim().length == 0) 
        {
            formLabel.classList.remove('error');
            emailAddress.value = '';
            passwordInput.value = '';
            errorCheck.hidden = false;
            errorCheck.innerHTML = 'Email Address and/or Password must not be empty';
            formLabel.className = 'error';
            passwordInput.className = 'inputClass';
            event.preventDefault();
            myForm.reset();
        }


        else
        {
            errorCheck.hidden = true;
            formLabel.classList.remove('error');
            console.log("Login form submitted");
        }*/
    });
}