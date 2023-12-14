import express from 'express';
const router = express.Router();
import validation from '../helpers.js';

import {groupsData} from '../data/index.js';
import {usersData} from '../data/index.js';
import {messagesData} from '../data/index.js';


router
  .route('/')
  .get(async (req, res) => {

    console.log(req.session.user);
    
    if (!req.session.user)
      return res.render('login');
      
    else if (req.session.user.groupID == undefined)
      return res.render('addGroup');

    else
    //return res.render('homepage', {title: "Home", user: req.session.user, group: req.session.user.group, groupMembers: req.session.user.groupMembers});
    
    //TESTING PURPOSES ONLY
      return res.render('homepage', {title: "Home", user: req.session.user, group: req.session.user.groupInfo, groupMembers: req.session.user.groupMembers, suggestedMatches: await groupsData.getAll() });


    // return res.json("homepage", {group: req.session.user.group, title: "Homepage"})
  })
  .post(async (req, res) => {
    //TODO
    let filter = req.body.filter;

    console.log(filter);

    let filteredUsers = [];

      //For each filter:
      //1. Get all users 
      //2. Filter users based on user dropdown menu value
      //3. Return groups of other users based on applied filter

    /*if (filter == age)
    {

    }*/

    /*else if (filter = male)
    {

    }*/

    /*else if (filter = female)
    {

    }*/

    /*else if (filter = other)
    {

    }*/

    /*else if (filter = budget)
    {

    }*/

    // return res.json("homepage", {group: req.session.user.group, title: "Homepage", suggestedMatches: filteredUsers});

  });

/* IMPORTANT:
When redirecting to /error, make sure to set req.session.errorCode and req.session.errorMessage appropriately ! 
*/
router
  .route('/error')
  .get(async (req, res) => {
    let errorCode = 400;
  let errorMessage = "An error has occurred";

  /* If session code and message were set, reassign variables */
  if (req.session.errorCode) errorCode = req.session.errorCode;
  if (req.session.errorMessage) errorMessage = req.session.errorMessage;

  return res.status(errorCode).render('error', {title: "Error", error: errorMessage});
  })

export default router;
