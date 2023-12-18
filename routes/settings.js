import express from 'express';
const router = express.Router();
import validation from '../helpers.js';

import {groupsData} from '../data/index.js';
import {usersData} from '../data/index.js';
import {messagesData} from '../data/index.js';
import {reviewsData} from '../data/index.js';
import {matchesData} from '../data/index.js';
import {phone} from 'phone';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import xss from 'xss';


router.route('/')
  .get(async (req, res) => {
    let userId = req.session.user.id;
    let admin = req.session.user.admin;
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
      biography: userInfo.biography,
      picture: userInfo.picture,
      admin: admin
    });
  })
  .post(async (req, res) => {
    let { 
      firstNameInput, lastNameInput, emailAddressInput, 
      phonenumberInput, passwordInput, confirmPasswordInput, 
      biographyInput, ageInput, interestsInput, pictureInput
    } = req.body;
    firstNameInput = xss(firstNameInput);
    lastNameInput = xss(lastNameInput);
    emailAddressInput = xss(emailAddressInput);
    phonenumberInput = xss(phonenumberInput);
    passwordInput = xss(passwordInput);
    confirmPasswordInput = xss(confirmPasswordInput);
    biographyInput = xss(biographyInput);
    ageInput = xss(ageInput);
    // interestsInput = xss(interestsInput);
    pictureInput = xss(pictureInput);


    const id = req.session.user.id;
    let userId = new ObjectId(id);
    let userInfo = await usersData.getUser(id);
    let admin = req.session.user.admin;

    // console.log(req.body);

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
    if (interestsInput && interestsInput.length === 0) {
      // Do nothing if the length is 0
    } else if (interestsInput && (interestsInput.length !== 5 || !Array.isArray(interestsInput) || !interestsInput.every(interest => typeof interest === 'string'))) {
      errors.push("Interests must be a list of exactly 5 strings");
    }
    if (phonenumberInput) {
      phonenumberInput = phone(phonenumberInput);
      if (!phonenumberInput.isValid) errors.push('Invalid phone number!');
      phonenumberInput = phonenumberInput.phoneNumber;
    }
    const pictureUrlIsValid = await usersData.isImageUrl(pictureInput);
        if (!pictureUrlIsValid) {
            errors.push('Picture must be a valid image URL');
        }

    if (errors.length > 0) {
      return res.status(400).render("settings", {
        title: "Settings", 
        error: errors,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        emailAddress: userInfo.emailAddress,
        phoneNumber: userInfo.phoneNumber,
        age: userInfo.age,
        interests: userInfo.interests,
        biography: userInfo.biography,
        picture: userInfo.picture,
        admin: admin 
      });
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
        ...(pictureInput && { picture: pictureInput })
      };

      const updatedUser = await usersData.updateUser(userId, updatedFields);
      
      if (updatedUser) {
        return res.redirect("/logout");
      } else {
        return res.status(500).render("settings", { 
          title: "Settings", 
          error: "Internal Server Error", 
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          emailAddress: userInfo.emailAddress,
          phoneNumber: userInfo.phoneNumber,
          age: userInfo.age,
          interests: userInfo.interests,
          biography: userInfo.biography,
          picture: userInfo.picture,
          admin: admin 
        });
      }
    } catch (e) {
      return res.status(500).render("settings", { 
        title: "Settings", 
        error: e.toString(), 
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        emailAddress: userInfo.emailAddress,
        phoneNumber: userInfo.phoneNumber,
        age: userInfo.age,
        interests: userInfo.interests,
        biography: userInfo.biography,
        picture: userInfo.picture,
        admin: admin 
      });
    }
    
  }
  
  )
  .delete(async (req, res) => {
    let userId = req.session.user.id;
    userId = validation.checkId(userId, "userId");
    let groupId;
    try {
      groupId = await groupsData.getGroupByUserId(userId);
    } catch (e) {
      return res.status(500).render('error', {error: e});
    }
    

    let deletedUser;
    try {
      deletedUser = await usersData.removeUser(userId);
    } catch (e) {
      return res.status(500).render('error', {error: e});
    }

    /* If the user is an admin, we delete the user first (which removes them from their group), then delete the group */
    if (req.session.user.admin) {
      try {
        await groupsData.remove(groupId);
      } catch (e) {
        return res.status(500).render('error', {error: e});
      }
    }
    
    if (deletedUser) {
      // return res.redirect("/logout");
      return res.json({ success: true, redirectTo: '/logout' });
    } else {
      // return res.status(500).render("settings", { title: "Settings", error: "Internal Server Error" });
      return res.status(500).json({ success: false, redirectTo: '/error' });
    }
  });

  
 
  router.route('/admin')
  .get(async (req, res) => {
    let userId = req.session.user.id;
    userId = validation.checkId(userId, "userId");
    const groupId = await groupsData.getGroupByUserId(userId);
    const groupInfo = await groupsData.get(groupId);
    let femalePref = groupInfo.genderPreference === 'F';
    let malePref = groupInfo.genderPreference === 'M';
    let smallestRadius = groupInfo.radius === 1;
    let smallRadius = groupInfo.radius === 5;
    let mediumRadius = groupInfo.radius === 10;
    let moremediumRadius = groupInfo.radius === 25;
    let evenMoremediumRadius = groupInfo.radius === 50;
    let largeRadius = groupInfo.radius === 100;
    let largerRadius = groupInfo.radius === 250;
    let evenLargerRadius = groupInfo.radius === 500;
    let largestRadius = groupInfo.radius === 1000;
    let oneRoommate = groupInfo.numRoommates === 1;
    let twoRoommates = groupInfo.numRoommates === 2;
    let threeRoommates = groupInfo.numRoommates === 3;
    let fourRoommates = groupInfo.numRoommates === 4;

    res.render("adminSettings", { 
      title: "Admin Settings",
      admin: true,
      groupInfo: groupInfo,
      malePref: malePref,
      femalePref: femalePref,
      smallestRadius: smallestRadius,
      smallRadius: smallRadius,
      mediumRadius: mediumRadius,
      moremediumRadius: moremediumRadius,
      evenMoremediumRadius: evenMoremediumRadius,
      largeRadius: largeRadius,
      largerRadius: largerRadius,
      evenLargerRadius: evenLargerRadius,
      largestRadius: largestRadius,
      oneRoommate: oneRoommate,
      twoRoommates: twoRoommates,
      threeRoommates: threeRoommates,
      fourRoommates: fourRoommates
    });
  })
  .post(async (req, res) => {
    let {
      groupNameInput,
      groupUsernameInput,
      groupDescriptionInput,
      radiusInput,
      budgetInput,
      numRoommatesInput,
      genderPreferenceInput,
      groupPasswordInput,
      groupConfirmPasswordInput,
      groupPictureInput
    }
    = req.body;
    groupNameInput = xss(groupNameInput);
    groupUsernameInput = xss(groupUsernameInput);
    groupDescriptionInput = xss(groupDescriptionInput);
    radiusInput = xss(radiusInput);
    budgetInput = xss(budgetInput);
    numRoommatesInput = xss(numRoommatesInput);
    genderPreferenceInput = xss(genderPreferenceInput);
    groupPasswordInput = xss(groupPasswordInput);
    groupConfirmPasswordInput = xss(groupConfirmPasswordInput);
    groupPictureInput = xss(groupPictureInput);

    
    let userId = req.session.user.id;
    userId = validation.checkId(userId, "userId");
    const groupId = await groupsData.getGroupByUserId(userId);
    const groupInfo = await groupsData.get(groupId);
    budgetInput = parseInt(budgetInput);
    radiusInput = parseInt(radiusInput);
    numRoommatesInput = parseInt(numRoommatesInput);

    const errors = [];
    let newPassword = true;
    if (groupPasswordInput.length >= 8 && groupConfirmPasswordInput.length >= 8) newPassword = true;
    if (typeof groupNameInput !== "string") errors.push("Invalid Group Name");
    if (typeof groupUsernameInput !== "string") errors.push("Invalid Group Username");
    if (typeof groupDescriptionInput !== "string") errors.push("Invalid Group Description");
    if (typeof budgetInput !== "number") errors.push("Invalid Budget");
    if (typeof genderPreferenceInput !== "string") errors.push("Invalid Gender Preference")
    if (newPassword && typeof groupPasswordInput !== "string") {
      newPassword = false;
      errors.push("Invalid Group Password");
    }
    if (newPassword && (groupConfirmPasswordInput !== groupPasswordInput)) { 
      newPassword = false;
      errors.push("Passwords do not Match");
    }
    // don't push an error; user did not type in password so it stays the same
    if (newPassword && groupPasswordInput.length === 0) newPassword = false;


    groupNameInput = groupNameInput.trim();
    groupDescriptionInput = groupDescriptionInput.trim();
    groupUsernameInput = groupUsernameInput.trim();
    groupPasswordInput = groupPasswordInput.trim();
    groupConfirmPasswordInput = groupConfirmPasswordInput.trim();
    if (groupNameInput.length === 0) errors.push('The groupName field is empty.');
    if (groupDescriptionInput.length === 0) errors.push('The groupDescription field is empty.');
    if (groupUsernameInput.length === 0) errors.push('The groupUsername field is empty.');
    // if (groupPasswordInput.length === 0) errors.push('The groupPassword field is empty.');
    // if (groupConfirmPasswordInput.length === 0) errors.push('The groupConfirmPasswordInput field is empty.');
    let usernameSpaces = groupUsernameInput.split(" ");
    if (usernameSpaces.length > 1) errors.push(`${groupUsernameInput} contains spaces, invalid!`);
    if (newPassword && (groupPasswordInput.length < 8 || groupPasswordInput.length > 50)) {
      newPassword = false;
      errors.push(`groupPasswordInput must be > 8 characters and < 50 characters long.`);
    } 
    if (groupDescriptionInput.length > 1000) errors.push('The description has exceeded the 1000 character limit.');
    if (budgetInput <= 0 || budgetInput > 50000) errors.push('The budget must be nonnegative and below 50k.');
    genderPreferenceInput = genderPreferenceInput.toUpperCase();
    if ( (genderPreferenceInput !== 'M') && (genderPreferenceInput !== 'F') && (genderPreferenceInput !== 'O') ) errors.push('The genderPreference must be either M, F, or O');
    if (radiusInput <= 0 || radiusInput > 1000) errors.push('The radius must be nonnegative and below 1000.');
    if (numRoommatesInput <= 0 || numRoommatesInput > 4) errors.push('The numRoommates must be nonnegative and below 10.');
    const pictureUrlIsValid = await usersData.isImageUrl(groupPictureInput);
    if (!pictureUrlIsValid) {
        errors.push('Picture must be a valid image URL');
    }

    // // Check if the conversion was successful
    // if (isNaN(radiusValue)) {
    //     errors.push('Radius input is not a valid number');
    // } else {
    //     // Perform validation on the numeric value
    //     let valid_radii = [1, 5, 10, 25, 50, 100, 250, 500, 1000];
    //     if (!valid_radii.includes(radiusValue)) {
    //         errors.push('Invalid radius. Please provide a radius from the following list: [1, 5, 10, 25, 50, 100, 250, 500, 1000]');
    //     }
    // }
    if (errors.length > 0) {
      return res.status(400).render("settings", { title: "Admin Settings", error: errors });
    }



    let hashedPass = groupInfo.groupPassword;
    if (newPassword) {
      const saltRounds = await bcrypt.genSalt(8);
      hashedPass = await bcrypt.hash(groupPasswordInput, saltRounds);
    }
    
    try {

      const updatedGroup = await groupsData.update(
        groupId, 
        groupNameInput,
        groupUsernameInput,
        groupDescriptionInput,
        groupInfo.groupLocation.coordinates,
        radiusInput,
        budgetInput,
        numRoommatesInput,
        genderPreferenceInput,
        groupInfo.users,
        hashedPass,
        groupPictureInput,
        groupInfo.matches,
        groupInfo.suggestedMatches,
        groupInfo.reviews,
      );
      
      if (updatedGroup) {
        return res.redirect("/");
      } else {
        return res.status(500).render("adminSettings", { title: "Admin Settings", error: "Internal Server Error", groupInfo: groupInfo });
      }
    }
    catch (e) {
      return res.status(500).render("adminSettings", { title: "Admin Settings", error: e.toString(), groupInfo: groupInfo });
    }
  }
  
  )
  .delete(async (req, res) => {
    let userId = req.session.user.id;
    userId = validation.checkId(userId, "userId");
    const groupId = await groupsData.getGroupByUserId(userId);
    const groupInfo = await groupsData.get(groupId);
    
    // delete matches associated with group
    await matchesData.deleteGroupIdFromMatches(groupId);

    // delete convos associated with group
    await messagesData.removeAllConversationsByGroup(groupId);

    // delete reviews associated with group
    await reviewsData.removeAllReviewsByGroup(groupId);

    //update user to not be an admin anymore
    let updatedUser;
    try {
      updatedUser = await usersData.updateUser(userId, {admin: false});
    } catch (e) {
      return res.status(500).render('error', {error: e});
    }

    let deletedGroup;
    try {
      deletedGroup = await groupsData.remove(groupId);
    } catch (e) {
      return res.status(500).render('error', {error: e});
    }
    if (deletedGroup) {
      return res.json({ success: true, redirectTo: '/logout' });
    } else {
      return res.status(500).json({ success: false, redirectTo: '/error' });

    }
  }
  );



export default router;
