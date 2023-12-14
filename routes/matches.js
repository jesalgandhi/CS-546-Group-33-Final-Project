import express from 'express';
const router = express.Router();
import validation from '../helpers.js';

import {groupsData} from '../data/index.js';
import {usersData} from '../data/index.js';
import {messagesData} from '../data/index.js';
import {matchesData} from '../data/index.js';


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
    matches = await matchesData.getMatches(groupId);
  } catch (e) {
    return res.render('matches', {error: e});
  }

  //TEMPORARY TESTING PURPOSES **********************************************
  try {
    // Get all group IDs
    matches = await groupsData.getAll();
  } catch (e) {
    return res.render('matches', {error: e});
  }

 
  return res.render('matches', {matches});
  // *************************************************************************

  //return res.render('matches', { matches });
})


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
