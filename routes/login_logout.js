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
    //TODO
    let email = req.body.emailAddressInput;
    let password = req.body.passwordInput;

   if (email.trim().length == 0 || password.trim().length == 0)
    throw "Email/Password must not be empty";

    email = email.trim();

    let users = await users();

    const user = await usersCollection.findOne({emailAddress: email}); 

    //Basing this off fact that each user is logging in with own information (email, password)
    if (user === null)
      throw "Invalid username or password";

    let passwordCheck = await bcrypt.compare(password, user.password);

    if (!passwordCheck)
      throw "Invalid username or password";
  
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
      id: user._id.toString()
    };

    return req.session.user;
  });

router
  .route('/logout')
  .get(async (req, res) => {
    /* Expire the cookie + render logout successful page */
    const anHourAgo = new Date();
    anHourAgo.setHours(anHourAgo.getHours() - 1);
    res.cookie('AuthState', '', {expires: anHourAgo});
    res.clearCookie('AuthState');
    return res.render('logout', {title: 'Logout Successful'});
  })

export default router;
