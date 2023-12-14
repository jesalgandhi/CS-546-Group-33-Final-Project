import express from 'express';
const router = express.Router();
import validation from '../helpers.js';

import {groupsData} from '../data/index.js';
import {usersData} from '../data/index.js';
import {messagesData} from '../data/index.js';
import {ObjectId} from 'mongodb';

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const cities = require('cities');


router
  .route('/')
  .get(async (req, res) => {

    //console.log(req.session.user);
    
    if (!req.session.user)
      return res.render('login');
      
    else if (req.session.user.groupID == undefined)
      return res.render('addGroup');

    else
    //return res.render('homepage', {title: "Home", user: req.session.user, group: req.session.user.group, groupMembers: req.session.user.groupMembers});
    {
    //TESTING PURPOSES ONLY
      let allGroups = await groupsData.getAll();

      //console.log(allGroups);
      //GETS ALL USER DATA FOR GROUPS THAT AREN'T THE CURRENT USER'S
      for (let x = 0; x < allGroups.length; x++)
      {
        for (let i = 0; i < allGroups[x].users.length; i++)
        {   
          
          //If current group is last group in suggestMatches for some reason?
          if (req.session.user.groupID == allGroups[x]._id && x == allGroups.length - 1)
          {
            allGroups.splice(x, 1);
            break;
          }
          
          //Excludes current group from suggestedMatches array?
          else if (req.session.user.groupID == allGroups[x]._id)
              allGroups.splice(x, 1);
          
          try
          {
            let this_user = await usersData.getUser(allGroups[x].users[i].toString());
            allGroups[x].users[i] = this_user;
            //console.log(this_user);
          }

          catch(e)
          {

              //console.log("Current Array: " + x + " " + i);
              //console.log(allGroups);
              allGroups[x].users.splice(i, 1);  
              
          }
        }
      }

      //Gets location data for each group
      for (let group in allGroups)
      {
        let this_city = cities.gps_lookup(allGroups[group].groupLocation.coordinates[0], allGroups[group].groupLocation.coordinates[1]);
        allGroups[group].groupLocation.city = this_city;
        //console.log(this_city);
        //console.log(allGroups[group].groupLocation.coordinates[0], allGroups[group].groupLocation.coordinates[1]);
      }

      //Gets location data for USER GROUPS
      let city = cities.gps_lookup(req.session.user.groupInfo.groupLocation.coordinates[0], req.session.user.groupInfo.groupLocation.coordinates[1]);
      return res.render('homepage', {title: "Home", user: req.session.user, group: req.session.user.groupInfo, location: city, groupMembers: req.session.user.groupMembers, suggestedMatches: allGroups });
    }

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
