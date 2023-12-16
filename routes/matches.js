import express from 'express';
const router = express.Router();
import validation from '../helpers.js';
const require = createRequire(import.meta.url);
import { createRequire } from 'module';
const cities = require('cities');
import {groupsData} from '../data/index.js';
import {usersData} from '../data/index.js';
import {messagesData} from '../data/index.js';
import {matchesData} from '../data/index.js';
import {groups} from '../config/mongoCollections.js'
import { ObjectId } from 'mongodb';


router
  .route('/')
  .get(async (req, res) => {
  //TODO
  /* Retrieve userId from the session */
  console.log("In matches route")
  if (!(req.session.user && req.session.user.id)) {
    return res.redirect('/login');
  }
  const userId = req.session.user.id;

  /* Check if user is part of a group - if not, prompt to create/join */
  let groupId = undefined;
  try {
    groupId = await groupsData.getGroupByUserId(userId);
  } catch (e) {
    return res.render('matches', {error: "Please Create or Join a group first!"});
  }

  /* Get matches from the group the user is a part of */
  let matches = undefined;
  try {
    matches = await matchesData.getMatches(groupId); //list of groupids
  } catch (e) {
    return res.render('matches', {error: e});
  }
  let matchesWithConversations = [];
  let matchedgroups = [];
  //we need the entire group info for each match
  if(matches && Array.isArray(matches) && matches.length > 0){
    try {
      matchedgroups = await Promise.all(matches.map(match => groupsData.get(match.toString())));
    } catch (error) {
      return res.render('matches', {error: error});
    }
  }

  try {

    // Iterate over the matches array
    for (let i = 0; i < matchedgroups.length; i++) {
        let conversationId;
        let users = [];

        // Get the conversation ID for the current group ID and the matched group ID
        try {
          conversationId = await messagesData.getConversationIdByGroupIds(groupId, matchedgroups[i]._id.toString());
        } catch (error) {
          console.error(`Error getting conversation ID for match ${i}:`, error);
        }

        let otherGroupId = undefined;
        if (!conversationId) otherGroupId = matchedgroups[i]._id.toString();

        // Get user data for each userid in users array
        for (let j = 0; j < matchedgroups[i].users.length; j++) {
          try {
            let user = await usersData.getUser(matchedgroups[i].users[j].toString());
            users.push(user);
          } catch (error) {
            console.error(`Error getting user data for user ${j} in match ${i}:`, error);
          }
        }


        //Get location data for each match
        // Get the latitude and longitude
        let latitude = matchedgroups[i].groupLocation.coordinates[1];
        let longitude = matchedgroups[i].groupLocation.coordinates[0];

        // Use cities.gpsLookup to get the city
        let city = cities.gps_lookup(latitude, longitude);
        //console.log(city);


        // Create an object with the match and conversation ID
        let matchWithConversation = {
          match: matchedgroups[i],
          conversationId: conversationId,
          otherGroupId: otherGroupId,
          users: users,
          city: city
        };

        // Add the object to the matchesWithConversations array
        matchesWithConversations.push(matchWithConversation);
  }
  //console.log("MatchesWithCOnversationS:",matchesWithConversations);


  } catch (e) {
    return res.render('matches', {error: e});
  }

  

  

 
  return res.render('matches', {matchesWithConversations});
  // *************************************************************************

  //return res.render('matches', { matches });
})

.post(async(req,res) =>
{
  console.log("In matches post route");
  console.log(req.body);
  let user_id = req.body.user_id;
  let suggested_id = req.body.suggested_id;


  //console.log(req.session.user);
  let groupsCollection = await groups();

  let this_group = await groupsData.get(user_id);
  let suggestedGroup = await groupsData.get(suggested_id);

  console.log(this_group._id);
  console.log(suggestedGroup._id);




try
  {
    let confirmedMatch = await matchesData.confirmMatch(user_id, suggested_id);
  }

  catch(e)
  {
    console.log(e);
  }

  
  let this_city = cities.gps_lookup(req.session.user.groupInfo.groupLocation.coordinates[0], req.session.user.groupInfo.groupLocation.coordinates[1]);
  
  /*let suggestedMatches = [];

  
  //Gets all filtered match info WITHOUT RE-RENDERING HOMEPAGE
  for (let x = 0; x < req.session.user.groupInfo.suggestedMatches.length; x++)
      {
        let thisGroup = req.session.user.groupInfo.suggestedMatches[x]
        if (thisGroup != suggested_id)
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
      }

  for (let x = 0; x < suggestedMatches.length; x++) 
      {
        try 
        {
            let groupInfo = await groupsData.get(suggestedMatches[x]._id.toString());
            suggestedMatches[x].groupInfo = groupInfo;
            suggestedMatches[x].this_userID = req.session.user.groupID;
            let city = cities.gps_lookup(suggestedMatches[x].groupInfo.groupLocation.coordinates[0], suggestedMatches[x].groupInfo.groupLocation.coordinates[1]);
            suggestedMatches[x].groupLocation.city = city;
            console.log(city);
        } 
        catch (e) 
        {
            console.log(e);
        }
    
        for (let i = 0; i < suggestedMatches[x].users.length; i++) 
        {
          try 
          {
            let this_user = await usersData.getUser(suggestedMatches[x].users[i]);
            suggestedMatches[x].users[i] = this_user;
          } 
          catch (e) 
          {
            console.log(e);
          }
        }
      }*/
  
  
  //return res.render('homepage', {title: "Home", currentUser: req.session.user, user: req.session.user, group: req.session.user.groupInfo, location: this_city, groupMembers: req.session.user.groupMembers, suggestedMatches: suggestedMatches});

  return res.redirect('/');
  
  //return res.render()


});



router
  .route('/suggestedMatches')
  .get(async (req, res) => {
    if (!(req.session.user && req.session.user.id)) {
      return res.redirect('/login');
    }

    const userId = req.session.user.id;

    // Get the group ID for the current user
    let groupId;
    try {
      groupId = await groupsData.getGroupByUserId(userId);
    } catch (e) {
      return res.render('matches', {error: "Please Create or Join a group first!"});
    }

    // Call suggestAllMatches for the current group
    try {
      await matchesData.suggestAllMatches(groupId);
      res.redirect('/'); // Redirect to the homepage or wherever you want
    } catch (e) {
      console.error(e);
      res.status(500).send('An error occurred while suggesting matches.');
    }
  });


export default router;
