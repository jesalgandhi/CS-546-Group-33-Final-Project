// Import the express router as shown in the lecture code
// Note: please do not forget to export the router!
import express from 'express';
const router = express.Router();
import validation from '../helpers.js';

import {groupsData} from '../data/index.js';
import {usersData} from '../data/index.js';
import {messagesData} from '../data/index.js';


router
  .route('/:groupId')
  .get(async (req, res) => {
  //TODO
  })
  .post(async (req, res) => {
    //TODO
  });


export default router;
