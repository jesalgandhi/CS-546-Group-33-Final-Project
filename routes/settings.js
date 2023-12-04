import express from 'express';
const router = express.Router();
import validation from '../helpers.js';

import {groupsData} from '../data/index.js';
import {usersData} from '../data/index.js';
import {messagesData} from '../data/index.js';


router
  .route('/')
  .get(async (req, res) => {
  //TODO
  return res.json("settings route");
  })
  .post(async (req, res) => {
    //TODO
  })
  .put(async (req, res) => {
    //TODO
  });


export default router;
