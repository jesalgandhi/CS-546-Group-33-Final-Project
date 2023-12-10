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
      return res.render('messages', {error: true});
    }

    /* Get conversations from the group the user is a part of */
    const conversations = await messagesData.getAllConversations(groupId);
    
    /* Populate conversationsAndGroupNames with conversationId as key, groupName as val */
    let conversationsAndGroupNames = {};
    conversations.forEach(async convoId => {
      // get participants of convo
      let participants = await messagesData.getParticipants(convoId);
      // filter out participant that is currently logged in - participants will
      // now contain one participant id of the other group
      participants = participants.filter(p => p !== groupId);
      const groupData = groupsData.get(participants[0]);
      conversationsAndGroupNames[convoId] = groupData.name;
    });

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
