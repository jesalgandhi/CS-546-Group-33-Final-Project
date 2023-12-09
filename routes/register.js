import express from 'express';
const router = express.Router();
import validation from '../helpers.js';

import {groupsData} from '../data/index.js';
import {usersData} from '../data/index.js';
import {messagesData} from '../data/index.js';


router
  .route('/')
  .get((req, res) => {
    res.render("register", { title: "Register" });
  })
  .post(async (req, res) => {
    const requiredFields = ['firstNameInput', 'lastNameInput', 'emailAddressInput','phonenumberInput', 'passwordInput', 'confirmPasswordInput', 'biographyInput', 'ageInput', 'interestsInput']; //'pictureInput'];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).render("register", { title: "User Registration", error: missingFields.map(field => `${field.replace('Input', '')} is required`) });
    }

    let { firstNameInput, lastNameInput, emailAddressInput, phonenumberInput, passwordInput, confirmPasswordInput, biographyInput, ageInput, interestsInput} = req.body; //pictureInput} = req.body;

    const errors = [];
    if (!/^[a-zA-Z]{2,25}$/.test(firstNameInput)) errors.push("Invalid First Name");
    if (!/^[a-zA-Z]{2,25}$/.test(lastNameInput)) errors.push("Invalid Last Name");
    if (!/\S+@\S+\.\S+/.test(emailAddressInput.toLowerCase())) errors.push("Invalid Email Address");
    if (!/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/.test(passwordInput)) errors.push("Invalid Password");
    if (passwordInput !== confirmPasswordInput) errors.push("Either the email address or password is invalid");
    if (!/^.{0,200}$/.test(biographyInput)) errors.push("Invalid Biography");
    let age = typeof ageInput === 'number' ? ageInput : parseInt(ageInput);
    if (!Number.isInteger(age) || age < 18 || age > 120) errors.push("Invalid Age");
    if (typeof interestsInput === 'string') {
      interestsInput = interestsInput.split(',').map(interest => interest.trim());
    }
    
    if (!Array.isArray(interestsInput) || !interestsInput.every(interest => typeof interest === 'string')) {
      errors.push("Interests must be a list of strings");
    }
    if (!/^[0-9]{10}$/.test(phonenumberInput)) errors.push("Invalid Phone Number");
    if (errors.length > 0) {
      return res.status(400).render("register", { title: "Registration Form", error: errors });
    }

    try {
      const newUser = await usersData.createUser(firstNameInput, lastNameInput, emailAddressInput.toLowerCase(), phonenumberInput, passwordInput, biographyInput, ageInput, interestsInput); //pictureInput);
      if (newUser.insertedUser) {
        return res.redirect("/login");
      } else {
        return res.status(500).render("register", { title: "Registration Form", error: "Internal Server Error" });
      }
    } catch (e) {
      return res.status(400).render("register", { title: "Registration Form", error: e.toString() });
    }
  });


export default router;
