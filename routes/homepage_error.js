import express from 'express';
const router = express.Router();
import validation from '../helpers.js';

import {groupsData} from '../data/index.js';
import {usersData} from '../data/index.js';
import {messagesData} from '../data/index.js';
import {matchesData} from '../data/index.js';
import {ObjectId} from 'mongodb';

import { createRequire } from 'module';
import { groups } from '../config/mongoCollections.js';
import { users } from '../config/mongoCollections.js';
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
    {
      if (!req.session.user.groupInfo)
      {
        req.session.user.groupInfo = await groupsData.get(req.session.user.groupID);
      }

      console.log("grah");
      console.log(req.session.user);
      

      //Gets location data for USER GROUPS
      let city = cities.gps_lookup(req.session.user.groupInfo.groupLocation.coordinates[1], req.session.user.groupInfo.groupLocation.coordinates[0]);
      
      //Empty suggestedMatches array
      var updatedInfo;

    
      req.session.user.groupInfo = await groupsData.get(req.session.user.groupID);


      console.log(req.session.user);



      //Pre-populate suggestedMatches array if length = 0 with Adarsh's createMatches function
      if (req.session.user.groupInfo.suggestedMatches.length == 0 && req.session.user.groupInfo.matches.length == 0)
      {
        console.log("Entered here");
        let allGroups =  await matchesData.suggestAllMatches(req.session.user.groupID);
        //console.log(allGroups);


        let groupsDataCollection = await groups();

        //let allGroups = await groupsData.getAll();


  

        //
          try 
          {
            let groupIDs = [];

            for (let i = 0; i < allGroups.length; i++)
            {
                if(req.session.user.groupID != allGroups[i]._id)
                  groupIDs.push(allGroups[i].toString());
            }
                       
            updatedInfo = await groupsDataCollection.updateMany(
              {_id: new ObjectId(req.session.user.groupID)},
              {$set: {suggestedMatches: groupIDs}},
              {returnDocument: 'after'}
            );
          }

          catch(e)
          {
            console.log(e);
          }
      }



      let currentGroup = await groupsData.get(req.session.user.groupID);
      //console.log(currentGroup);

      //With suggested matches group IDs, get their info before rendering homepage
      let suggestedMatchInfo = [];

      for (let i = 0; i < currentGroup.suggestedMatches.length; i++)
      {
          try
          {
            let groupData = await groupsData.get(currentGroup.suggestedMatches[i].toString());
            //console.log(groupData);
            suggestedMatchInfo.push(groupData);
          }

          catch(e)
          {
            console.log(e);
          }
         
      }

      //console.log(suggestedMatchInfo);
      
      for (let i = 0; i < suggestedMatchInfo.length; i++)
      {
          suggestedMatchInfo[i].this_userID = req.session.user.groupID;
          suggestedMatchInfo[i].groupLocation.city = cities.gps_lookup(suggestedMatchInfo[i].groupLocation.coordinates[1],suggestedMatchInfo[i].groupLocation.coordinates[0]);
          //console.log(suggestedMatchInfo[i].city);

          for (let x = 0; x < suggestedMatchInfo[i].users.length; x++)
          {
            try
            {
              let userData = await usersData.getUser(suggestedMatchInfo[i].users[x].toString());
              suggestedMatchInfo[i].users[x] = userData;
            }

            catch(e)
            {
              console.log(e);
              suggestedMatchInfo[i].users.splice(x, 1);
            }
            
          }
      }
      return res.render('homepage', {title: "Home", currentUser: req.session.user, user: req.session.user, group: req.session.user.groupInfo, location: city, groupMembers: req.session.user.groupMembers, suggestedMatches: suggestedMatchInfo});
    }
  })
  .post(async (req, res) => 
  {
    //TODO
    let filter = req.body.filter;

    console.log(filter);

    let filteredUsers = [];
    if (!req.session.user)
      return res.redirect('/login');

    if (req.session.user.groupInfo.suggestedMatches.length == 0)
      return res.redirect('/');

      //For each filter:
      //1. Get all users 
      //2. Filter users based on user dropdown menu value
      //3. Return groups of other users based on applied filter

    if (filter == "reset")
    {
      console.log(req.session.user)
      return res.redirect('/');
    }

    else if (filter == "genderPreference")
    {
      //Get req.session.user.groupID
      let groupID = req.session.user.groupID;

      //Get req.session.user.groupInfo.genderPreference
      let genderPreference = req.session.user.groupInfo.genderPreference;

      let suggestedMatches = [];

      //Get all suggestedMatches
      for (let x = 0; x < req.session.user.groupInfo.suggestedMatches.length; x++)
      {
        try
        {
          let this_group = await groupsData.get(req.session.user.groupInfo.suggestedMatches[x]);
          suggestedMatches.push(this_group);
        }
        catch(e)
        {
          console.log(e);
        }
      }


      //Check if each fulfills criteria
      for (let match in suggestedMatches)
      {
        if (genderPreference = suggestedMatches[match].genderPreference)
        {
          filteredUsers.push(suggestedMatches[match]);
        }
      }
    }

    else if (filter == "age")
    {

    }

    else if (filter == "budget")
    {
      console.log("Entered budget filter");
      let suggestedMatches = [];


    for (let x = 0; x < req.session.user.groupInfo.suggestedMatches.length; x++) 
    {
      try 
      {
        let this_group = await groupsData.get(req.session.user.groupInfo.suggestedMatches[x]);
        suggestedMatches.push(this_group);
      } 
      catch (e) 
      {
          console.log(e);
      }
    }

      let userBudget = req.session.user.groupInfo.budget;
      let filteredUsers = [];

      for (let match of suggestedMatches) 
      {
          let matchBudget = match.budget;

          if (Math.abs(userBudget - matchBudget) <= 500) 
          {
              filteredUsers.push(match);
          }
      }
    }

    else if (filter == "interests")
    {

    }

    if (filteredUsers.length == 0)
    {
      let this_city = cities.gps_lookup(req.session.user.groupInfo.groupLocation.coordinates[1], req.session.user.groupInfo.groupLocation.coordinates[0]);
      return res.render('homepage', {title: "Home", currentUser: req.session.user, user: req.session.user, group: req.session.user.groupInfo, location: this_city, groupMembers: req.session.user.groupMembers, suggestedMatches: filteredUsers});
    }

      for (let x = 0; x < filteredUsers.length; x++) 
      {
        try 
        {
            let groupInfo = await groupsData.get(filteredUsers[x]._id.toString());
            filteredUsers[x].groupInfo = groupInfo;
            let city = cities.gps_lookup(filteredUsers[x].groupInfo.groupLocation.coordinates[1], filteredUsers[x].groupInfo.groupLocation.coordinates[0]);
            filteredUsers[x].groupLocation.city = city;
            console.log(city);
        } 
        catch (e) 
        {
            console.log(e);
        }
    
        for (let i = 0; i < filteredUsers[x].users.length; i++) 
        {
          try 
          {
            let this_user = await usersData.getUser(filteredUsers[x].users[i]);
            filteredUsers[x].users[i] = this_user;
          } 
          catch (e) 
          {
            console.log(e);
          }
        }
    
    
    
    
    let this_city = cities.gps_lookup(req.session.user.groupInfo.groupLocation.coordinates[1], req.session.user.groupInfo.groupLocation.coordinates[0]);
     return res.render('homepage', {title: "Home", currentUser: req.session.user, user: req.session.user, group: req.session.user.groupInfo, location: this_city, groupMembers: req.session.user.groupMembers, suggestedMatches: filteredUsers});
     
    }
     

    // return res.json("homepage", {group: req.session.user.group, title: "Homepage", suggestedMatches: filteredUsers});

    return res.redirect('/');

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
