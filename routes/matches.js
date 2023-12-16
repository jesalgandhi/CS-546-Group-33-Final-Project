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

  console.log(req.session.user);

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
    matches = await matchesData.getMatches(userId);
  } catch (e) {
    return res.render('matches', {error: e});
  }
  let matchesWithConversations = [];

  //TEMPORARY TESTING PURPOSES **********************************************
  try {
    // Get all group IDs
    matches = await groupsData.getAll();

    
    // Iterate over the matches array
    for (let i = 0; i < matches.length; i++) {
        let conversationId;
        let users = [];

        // Get the conversation ID for the current group ID and the matched group ID
        try {
          conversationId = await messagesData.getConversationIdByGroupIds(groupId, matches[i]._id.toString());
        } catch (error) {
          console.error(`Error getting conversation ID for match ${i}:`, error);
        }

        // Get user data for each userid in users array
        for (let j = 0; j < matches[i].users.length; j++) {
          try {
            let user = await usersData.getUser(matches[i].users[j].toString());
            users.push(user);
          } catch (error) {
            console.error(`Error getting user data for user ${j} in match ${i}:`, error);
          }
        }


        //Get location data for each match
        // Get the latitude and longitude
        let latitude = matches[i].groupLocation.coordinates[1];
        let longitude = matches[i].groupLocation.coordinates[0];

        // Use cities.gpsLookup to get the city
        let city = cities.gps_lookup(latitude, longitude);
        //console.log(city);


        // Create an object with the match and conversation ID
        let matchWithConversation = {
          match: matches[i],
          conversationId: conversationId,
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

  console.log(req.session.user.groupInfo);





  return res.redirect('/');

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
