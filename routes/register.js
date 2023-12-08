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
    const requiredFields = ['firstNameInput', 'lastNameInput', 'emailAddressInput', 'passwordInput', 'confirmPasswordInput', 'biographyinput', 'ageInput', 'interestsInput', 'pictureInput'];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).render("register", { title: "User Registration", error: missingFields.map(field => `${field.replace('Input', '')} is required`) });
    }

    const { firstNameInput, lastNameInput, emailAddressInput, passwordInput, confirmPasswordInput, biographyInput, ageInput, interestsInput, pictureInput} = req.body;

    const errors = [];
    if (!/^[a-zA-Z]{2,25}$/.test(firstNameInput)) errors.push("Invalid First Name");
    if (!/^[a-zA-Z]{2,25}$/.test(lastNameInput)) errors.push("Invalid Last Name");
    if (!/\S+@\S+\.\S+/.test(emailAddressInput.toLowerCase())) errors.push("Invalid Email Address");
    if (!/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/.test(passwordInput)) errors.push("Invalid Password");
    if (passwordInput !== confirmPasswordInput) errors.push("Either the email address or password is invalid");
    if (typeof biographyInput !== 'string' || biographyInput.trim().length === 0 || biographyInput.trim().length > 200) errors.push("Invalid Biography");
    if (!Number.isInteger(parseInt(ageInput)) || ageInput < 18 || ageInput > 120) errors.push("Invalid Age");
    if (!Array.isArray(interestsInput) || interestsInput.length === 0) errors.push("Interests are required");

    if (errors.length > 0) {
      return res.status(400).render("register", { title: "Registration Form", error: errors });
    }

    try {
      const newUser = await usersData.createUser(firstNameInput, lastNameInput, emailAddressInput.toLowerCase(), passwordInput, biographyInput, ageInput, interestsInput, pictureInput);
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
