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
    let group = await groupsData.get(req.params.groupId);

    if (group == null)
      return res.redirect("/error");

    //console.log(group);
    //console.log(group.users);

    let users = {};

    for (let i = 0; i < Object.keys(group.users).length; i++)
    {
      users[i] = await usersData.getUser(group.users[i]);
    }

   // console.log(users);

    //let group_members = await

      return res.render("groupbyID",{group: group, groupMembers: users, title: group.groupName});
  });

export default router;