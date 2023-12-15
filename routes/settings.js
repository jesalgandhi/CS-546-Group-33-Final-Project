import express from 'express';
const router = express.Router();
import validation from '../helpers.js';

import {groupsData} from '../data/index.js';
import {usersData} from '../data/index.js';
import {messagesData} from '../data/index.js';
import {phone} from 'phone';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';


router.route('/')
  .get(async (req, res) => {
    res.render("settings", { title: "Settings" });
  })
  .post(async (req, res) => {
    let { 
      firstNameInput, lastNameInput, emailAddressInput, 
      phonenumberInput, passwordInput, confirmPasswordInput, 
      biographyInput, ageInput, interestsInput 
    } = req.body;

    const id = req.session.user.id;
    let userId = new ObjectId(id);

    console.log(req.body);

    const errors = [];
    if (firstNameInput && !/^[a-zA-Z]{2,25}$/.test(firstNameInput)) errors.push("Invalid First Name");
    if (lastNameInput && !/^[a-zA-Z]{2,25}$/.test(lastNameInput)) errors.push("Invalid Last Name");
    if (emailAddressInput && !/\S+@\S+\.\S+/.test(emailAddressInput.toLowerCase())) errors.push("Invalid Email Address");
    if (passwordInput && !/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/.test(passwordInput)) errors.push("Invalid Password");
    if (passwordInput && passwordInput !== confirmPasswordInput) errors.push("Passwords do not match");
    if (biographyInput && !/^.{2,200}$/.test(biographyInput)) errors.push("Invalid Biography");
    if (ageInput) {
      let age = typeof ageInput === 'number' ? ageInput : parseInt(ageInput);
      if (!Number.isInteger(age) || age < 18 || age > 120) errors.push("Invalid Age");
    }
    if (interestsInput) {
      if (typeof interestsInput === 'string') {
        interestsInput = interestsInput.split(',').map(interest => interest.trim());
      }
      if (!Array.isArray(interestsInput) || !interestsInput.every(interest => typeof interest === 'string')) {
        errors.push("Interests must be a list of strings");
      }
    }
    if (phonenumberInput) {
      phonenumberInput = phone(phonenumberInput);
      if (!phonenumberInput.isValid) errors.push('Invalid phone number!');
      phonenumberInput = phonenumberInput.phoneNumber;
    }
    

    if (errors.length > 0) {
      return res.status(400).render("settings", { title: "Settings", error: errors, userData: req.body });
    }

    const saltRounds = await bcrypt.genSalt(8);
    const hashedPass = await bcrypt.hash(passwordInput, saltRounds);

    try {
      const updatedFields = {
        ...(firstNameInput && { firstName: firstNameInput }),
        ...(lastNameInput && { lastName: lastNameInput }),
        ...(emailAddressInput && { emailAddress: emailAddressInput }),
        ...(phonenumberInput && { phoneNumber: phonenumberInput }),
        ...(passwordInput && { password: hashedPass }),
        ...(biographyInput && { biography: biographyInput }),
        ...(ageInput && { age: parseInt(ageInput) }),
        ...(interestsInput && { interests: interestsInput }),
      };

      const updatedUser = await usersData.updateUser(userId, updatedFields);
      
      if (updatedUser) {
        return res.redirect("/logout");
      } else {
        return res.status(500).render("settings", { title: "Settings", error: "Internal Server Error", userData: req.body });
      }
    } catch (e) {
      return res.status(500).render("settings", { title: "Settings", error: e.toString(), userData: req.body });
    }
  });


export default router;
