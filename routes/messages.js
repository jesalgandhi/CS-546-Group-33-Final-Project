import express from 'express';
const router = express.Router();
import validation from '../helpers.js';

import {groupsData} from '../data/index.js';
import {usersData} from '../data/index.js';
import {messagesData} from '../data/index.js';


router
  .route('/')
  .get(async (req, res) => {
    /* Retrieve userId from the session */
    if (!(req.session.user && req.session.user.id)) {
      return res.redirect('/login');
    }
    const userId = req.session.user.id;
    
    /* Check if user is part of a group - if not, prompt to create/join */
    let groupId = undefined;
    try {
      groupId = await groupsData.getGroupByUserId(userId);
    } catch (e) {
      return res.render('messages', {error: "Please Create or Join a group first!"});
    }

    /* Get conversations from the group the user is a part of */
    let conversations = undefined;
    try {
      conversations = await messagesData.getAllConversations(groupId);
    } catch (e) {
      return res.render('messages', {error: e});
    }
    
    /* Populate conversationsAndGroupNames with conversationId as key, groupName as val */
    let conversationsAndGroupNames = {};
    // conversations.forEach(async convo => {
    //   // filter out participant that is currently logged in - participants will
    //   // now contain one participant id of the other group
    //   let participants = convo.participants.filter(p => p.toString() !== groupId);
    //   let groupData = undefined;
    //   try {
    //     groupData = await groupsData.get(participants[0].toString());
    //   } catch (e) {
    //     return res.render('messages', {error:e});
    //   }
    //   conversationsAndGroupNames[convo._id.toString()] = groupData.groupName;
    // });

    /* Create array of promises of conversations to be retrieved */
    let fetchGroupNamesPromises = conversations.map(async convo => {
      let participants = convo.participants.filter(p => p.toString() !== groupId);
      let groupData = await groupsData.get(participants[0].toString());
      conversationsAndGroupNames[convo._id.toString()] = groupData.groupName;
    });

    /* Attempt to fulfill all promises */
    try {
      await Promise.all(fetchGroupNamesPromises);
    } catch (e) {
      return res.render('messages', {error: e});
    }    
    
    let noConversations = (conversations.length === 0) ? true : false;
    return res.render('messages', {
      // error: false, 
      title: "Your Conversations", 
      conversationsAndGroupNames: conversationsAndGroupNames,
      noConversations: noConversations
    });
  })
  .post(async (req, res) => {
    //TODO
  });

router
  .route('/create')
  .get(async (req, res) => {
  //TODO
  })
  .post(async (req, res) => {
    //TODO
  });

router
  .route('/:conversationId')
  .get(async (req, res) => {
  //TODO
  })
  .post(async (req, res) => {
    //TODO
  });


export default router;
