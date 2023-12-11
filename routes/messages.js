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
    /* Retrieve userId from the session */
    if (!(req.session.user && req.session.user.id)) {
      return res.redirect('/login');
    }
    const userId = req.session.user.id;
    let conversationId = req.params.conversationId;

    /* Ensure the conversationId is a valid id */
    try {
      conversationId = validation.checkId(conversationId, 'conversationId');
    } catch (e) {
      res.status(400).render('conversation', {error: e});
    }

    /* Create variables that represent this group and the other group's ids and names */
    let thisGroupId = undefined;
    let thisGroupName = undefined;
    let otherGroupId = undefined;
    let otherGroupName = undefined;
    try {
      thisGroupId = await groupsData.getGroupByUserId(userId);
    } catch (e) {
      return res.status(400).render('conversation', {error: e});
    }
    try {
      thisGroupName = await groupsData.get(thisGroupId);
      thisGroupName = thisGroupName.groupName;
    } catch (e) {
      return res.status(400).render('conversation', {error: e});
    }
    try {
      let participants = await messagesData.getParticipants(conversationId);
      let participant = participants.filter(p => p.toString() !== thisGroupId);
      otherGroupId = participant[0];
    } catch (e) {
      return res.status(400).render('conversation', {error: e});
    }
    try {
      otherGroupName = await groupsData.get(otherGroupId.toString());
      otherGroupName = otherGroupName.groupName;
    } catch (e) {
      return res.status(400).render('conversation', {error: e});
    }

    return res.render('conversation', {
      conversationId: conversationId, 
      thisGroupId: thisGroupId,
      otherGroupId: otherGroupId,
      thisGroupName: thisGroupName,
      otherGroupName: otherGroupName
    });

  })
  .post(async (req, res) => {
    let conversationId = req.body.conversationId;
    let message = req.body.text;
    let senderId = req.body.senderId;
    let attemptedMessageInsert = undefined;
    try {
      attemptedMessageInsert = await messagesData.createMessage(conversationId, senderId, message);
    } catch (e) {
      return res.status(500).render('conversation', {error: e});
    }

    return res.json({message: attemptedMessageInsert});

  });

/* Route from which the client-side JS will retrieve messages periodically */
router
  .route('/:conversationId/content')
  .get(async (req, res) => {
    const conversationId = req.params.conversationId;
    try {
      const messages = await messagesData.getAllMessages(conversationId);
      return res.json(messages);
    } catch (e) {
      return res.status(500).json({error: e});
    }
  });


export default router;
