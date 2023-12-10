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
    if (!req.session.user.id) {
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

    /* Get conversations from the group the user is a part of + pass thru */
    const conversations = messagesData.getAllConversations(groupId);
    return res.render('messages', {
      // error: false, 
      title: "Your Conversations", 
      conversations: conversations
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
  .route('/:groupId')
  .get(async (req, res) => {
  //TODO
  })
  .post(async (req, res) => {
    //TODO
  });


export default router;
