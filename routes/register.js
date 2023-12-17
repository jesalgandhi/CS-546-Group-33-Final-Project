import express from 'express';
const router = express.Router();
import validation from '../helpers.js';
import {phone} from 'phone';
import fetch from 'node-fetch';
import {groupsData} from '../data/index.js';
import {usersData} from '../data/index.js';
import {messagesData} from '../data/index.js';


router
  .route('/')
  .get((req, res) => {
    res.render("register", { title: "Register" });
  })
  .post(async (req, res) => {
    // const selectedOptions = req.body.options;
    // console.log(selectedOptions);
    let { firstNameInput, lastNameInput, emailAddressInput, phonenumberInput, passwordInput, confirmPasswordInput, biographyInput, ageInput, interestsInput, pictureInput} = req.body;

    const requiredFields = ['firstNameInput', 'lastNameInput', 'emailAddressInput','phonenumberInput', 'passwordInput', 'confirmPasswordInput', 'biographyInput', 'ageInput', 'interestsInput'];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).render("register", { title: "User Registration", error: missingFields.map(field => `${field.replace('Input', '')} is required`), formData: req.body });
    }

    
    // console.log(ageInput)
    // console.log(biographyInput)

    const errors = [];
    if (!/^[a-zA-Z]{2,25}$/.test(firstNameInput)) errors.push("Invalid First Name");
    if (!/^[a-zA-Z]{2,25}$/.test(lastNameInput)) errors.push("Invalid Last Name");
    if (!/\S+@\S+\.\S+/.test(emailAddressInput.toLowerCase())) errors.push("Invalid Email Address");
    if (!/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/.test(passwordInput)) errors.push("Invalid Password");
    if (passwordInput !== confirmPasswordInput) errors.push("Either the email address or password is invalid");
    if (!/^.{2,200}$/.test(biographyInput)) errors.push("Invalid Biography");
    let age = typeof ageInput === 'number' ? ageInput : parseInt(ageInput);
    if (!Number.isInteger(age) || age < 18 || age > 120) errors.push("Invalid Age");

    // console.log(interestsInput);
    
    if (interestsInput.length !== 5 || !Array.isArray(interestsInput) || !interestsInput.every(interest => typeof interest === 'string')) {
      errors.push("Interests must be a list of exactly 5 strings");
    }
    phonenumberInput = phone(phonenumberInput);
    if (!phonenumberInput.isValid) errors.push('Invalid phone number!');
    phonenumberInput = phonenumberInput.phoneNumber;
    const defaultImages = [
      'https://pistolsfiringblog.com/wp-content/uploads/2016/07/Screen-Shot-2016-07-12-at-10.04.40-PM.png',//diglett
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRWZ5AWNBwejH7qrNaM00Vio-oIhSYjUr8Wg&usqp=CAU',//squirtle
      'https://esi.si.com/.image/t_share/MjAxNzM0MTAzODY1NzYzNDcx/gengar.jpg', //gengar
      'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/hostedimages/1379727070i/3130.png',// the little penguin
      'https://c02.purpledshub.com/uploads/sites/62/2022/05/psyduck-249ddf6.jpg?webp=1'//some duck idek
      // ... more image URLs ...
  ];

  // Validate or assign default picture URL
  let pictureUrl = pictureInput;
  const pictureUrlIsValid = pictureInput && await usersData.isImageUrl(pictureInput);
  if (!pictureUrlIsValid) {
      // If no valid picture is provided, select a random one from the default list
      const randomIndex = Math.floor(Math.random() * defaultImages.length);
      pictureUrl = defaultImages[randomIndex];
  }

    // console.log(phonenumberInput);
    if (errors.length > 0) {
      return res.status(400).render("register", { 
        title: "Registration Form", 
        error: errors,
        formData: req.body
      });
    }

    try {
      const newUser = await usersData.createUser(firstNameInput, lastNameInput, emailAddressInput.toLowerCase(), passwordInput, phonenumberInput, biographyInput, age, interestsInput, pictureUrl);
      if (newUser) {
        return res.redirect("/login");
      } else {
        return res.status(500).render("register", { title: "Registration Form", error: "Internal Server Error" });
      }
    } catch (e) {
      return res.status(400).render("register", { title: "Registration Form", error: e.toString() });
    }
  });


export default router;
