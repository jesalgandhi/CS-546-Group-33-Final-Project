import express from 'express';
const router = express.Router();
import validation from '../helpers.js';

import {groupsData} from '../data/index.js';
import {usersData} from '../data/index.js';
import {messagesData} from '../data/index.js';


router
  .route('/')
  .get(async (req, res) => {
    return res.render('register', {title: 'Register'});
  })
  .post(async (req, res) => {
    //TODO
  });


export default router;
