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
    let userId = req.session.user.id;
    userId = validation.checkId(userId, "userId");
    const userInfo = await usersData.getUser(userId);
    res.render("settings", { 
      title: "Settings",
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      emailAddress: userInfo.emailAddress,
      phoneNumber: userInfo.phoneNumber,
      age: userInfo.age,
      interests: userInfo.interests,
      biography: userInfo.biography
    });
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

  router.route('/admin')
  .get(async (req, res) => {
    res.render("settings", { 
      title: "Settings",
      admin: true
    });
  })
  .post(async (req, res) => {
    let {
      groupNameInput,
      groupUsernameInput,
      groupDescriptionInput,
      budgetInput,
      genderPreferenceInput,
      groupPasswordInput
    }
    = req.body;
    
    const id = req.session.user.id;
    let groupId = new ObjectId(id);

    const errors = [];
    if (typeof groupNameInput !== "string") errors.push("Invalid Group Name");
    if (typeof groupUsernameInput !== "string") errors.push("Invalid Group Username");
    if (typeof groupDescriptionInput !== "string") errors.push("Invalid Group Description");
    if (typeof budgetInput !== "number") errors.push("Invalid Budget");
    if (typeof genderPreferenceInput !== "string") errors.push("Invalid Gender Preference")
    if (typeof groupPasswordInput !== "string") errors.push("Invalid Group Password");

groupNameInput = groupNameInput.trim();
groupDescriptionInput = groupDescriptionInput.trim();
groupUsernameInput = groupUsernameInput.trim();
groupPasswordInput = groupPasswordInput.trim();
if (groupNameInput.length === 0) errors.push('The groupName field is empty.');
if (groupDescriptionInput.length === 0) errors.push('The groupDescription field is empty.');
if (groupUsernameInput.length === 0) errors.push('The groupUsername field is empty.');
if (groupPasswordInput.length === 0) errors.push('The groupPassword field is empty.');
let usernameSpaces = groupUsernameInput.split(" ");
if (usernameSpaces.length > 1) errors.push(`${groupUsernameInput} contains spaces, invalid!`);
if (groupPasswordInput.length < 8 || groupPasswordInput.length > 50) errors.push(`${groupPassword} must be > 8 characters and < 50 characters long.`);
if (groupDescriptionInput.length > 1000) errors.push('The description has exceeded the 1000 character limit.');
if (groupLocationInput.length !== 2) errors.push('There MUST be only 2 coordinates in the groupLocation array.');
if (budget <= 0 || budget > 50000) errors.push('The budget must be nonnegative and below 50k.');
genderPreferenceInput = genderPreferenceInput.toUpperCase();
if ( (genderPreferenceInput !== 'M') && (genderPreferenceInput !== 'F') && (genderPreferenceInput !== 'O') ) errors.push('The genderPreference must be either M, F, or O');

    if (errors.length > 0) {
      return res.status(400).render("settings", { title: "Settings", error: errors, userData: req.body });
    }

    const saltRounds = await bcrypt.genSalt(8);
    const hashedPass = await bcrypt.hash(groupPasswordInput, saltRounds);

    try {
      const updatedFields = {
        ...(groupNameInput && { groupName: groupNameInput }),
        ...(groupUsernameInput && { groupUsername: groupUsernameInput }),
        ...(groupDescriptionInput && { groupDescription: groupDescriptionInput }),
        ...(budgetInput && { budget: budgetInput }),
        ...(genderPreferenceInput && { genderPreference: genderPreferenceInput }),
        ...(groupPasswordInput && { groupPassword: hashedPass }),
      };

      const updatedGroup = await groupsData.update(groupId, updatedFields);
      
      if (updatedGroup) {
        return res.redirect("/logout");
      } else {
        return res.status(500).render("settings", { title: "Settings", error: "Internal Server Error", userData: req.body });
      }
    }
    catch (e) {
      return res.status(500).render("settings", { title: "Settings", error: e.toString(), userData: req.body });
    }
  }
  );



export default router;
