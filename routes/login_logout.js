import express from 'express';
const router = express.Router();
import validation from '../helpers.js';

import {groupsData} from '../data/index.js';
import {usersData} from '../data/index.js';
import {messagesData} from '../data/index.js';
import {users} from '../config/mongoCollections.js'

import bcrypt from 'bcrypt';



router
  .route('/login')
  .get(async (req, res) => {
    return res.render('login', {title: 'Login'});
  })
  .post(async (req, res) => 
  {
    const requiredFields = ['emailAddressInput', 'passwordInput'];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).render("login", { title: "Login", error: missingFields.map(field => `${field.replace('Input', '')} is required`) });
    }

    let {emailAddressInput, passwordInput} = req.body;

   if (emailAddressInput.trim().length == 0 || passwordInput.trim().length == 0)
   return res.render('error', {title: "Error", error: "Email or password must not be empty"});

    emailAddressInput = emailAddressInput.trim();

    let usersCollection = await users();

    const user = await usersCollection.findOne({emailAddress: emailAddressInput}); 

    //Basing this off fact that each user is logging in with own information (email, password)
    if (!user)
    return res.render('error', {title: "Error", error: "Email or password is incorrect"});

    let passwordCheck = await bcrypt.compare(passwordInput, user.password);

    if (!passwordCheck)
      return res.render('error', {title: "Error", error: "Email or password is incorrect"});

      var groupID;

    try
    {
      groupID = await groupsData.getGroupByUserId(user._id.toString());
    } 
    catch
    {
      groupID = undefined;
    }
      
    //console.log("Group ID: " + groupID);
      
    var group;

    try
    {
        group = await groupsData.get(groupID);
    }
    catch
    {
      group = undefined;
    }
      
     let groupMembers = [];

    if (group)
    {
      for (let x = 0; x < group.users.length; x++)
      {
          //console.log(user._id.toString() + "vs. " + group.users[x]);
          if (user._id.toString() != group.users[x])
          {
            let this_user = await usersData.getUser(group.users[x]);
            groupMembers.push(this_user);
          }
      }
    }
       
    //Basing this off user being logged in rather than group being logged in
    req.session.user = {
      firstName: user.firstName, 
      lastName: user.lastName, 
      emailAddress: user.emailAddress,
      phoneNumber: user.phoneNumber, 
      biography: user.biography, 
      age: user.age, 
      interests: user.interests,
      picture: user.picture, 
      admin: user.admin,
      id: user._id.toString(),
      groupID: groupID,
      groupInfo: group,
      groupMembers: groupMembers
    };

    //console.log(req.session.user);

    return res.redirect('/');
  });

router
  .route('/logout')
  .get(async (req, res) => {
    /* Expire the cookie + render logout successful page */
    const anHourAgo = new Date();
    anHourAgo.setHours(anHourAgo.getHours() - 1);
    res.cookie('AuthState', '', {expires: anHourAgo});
    res.clearCookie('AuthState');
    req.session.destroy();
    return res.render('logout', {title: 'Logout Successful'});
  })

export default router;
