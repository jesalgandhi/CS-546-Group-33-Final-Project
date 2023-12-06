import express from 'express';
const router = express.Router();
import validation from '../helpers.js';

import {groupsData} from '../data/index.js';
import {usersData} from '../data/index.js';
import {messagesData} from '../data/index.js';


router
  .route('/create')
  .get(async (req, res) => {
    return res.json("groups/create route");
  })
  .post(async (req, res) => {
    //todo
  });

router
  .route('/join')
  .get(async (req, res) => {
    return res.json("groups/join route");
  })
  .post(async (req, res) => {
    //todo
  });

router
  .route('/:groupId')
  .get(async (req, res) => 
  {
    let group = groupsData.get(req.params.groupId);

    if (group == null)
      return res.redirect("/error");

    else
      return res.render("groupbyID",{group: group, title: group.groupName});
  });

export default router;