import express from 'express';
const router = express.Router();
import validation from '../helpers.js';

import {groupsData} from '../data/index.js';
import {usersData} from '../data/index.js';
import {messagesData} from '../data/index.js';

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { lookUpRaw } = require("geojson-places");

const cities = require('cities');


router
  .route('/create')
  .get(async (req, res) => {
    //return res.json("groups/create route");

    /* Retrieve userId from the session */
    if (!(req.session.user && req.session.user.id)) {
      return res.redirect('/login');
    }



    return res.render("createGroup", {title: 'Create a Group'});
  })
  .post(async (req, res) => {
    //todo
  });

router
  .route('/join')
  .get(async (req, res) => {

      /* Retrieve userId from the session */
      if (!(req.session.user && req.session.user.id)) {
        return res.redirect('/login');
      }


      //return res.json("groups/join route");
      return res.render("joinGroup", {title: 'Join a Group'});
  })
  .post(async (req, res) => {
      // const groupInfo = req.body;
      // let groupPassword = groupInfo.groupPassword;
      // console.log(groupPassword);
      // // let errors = [];

      // try {
      //   if (!groupPassword) throw "A group password must be provided.";
      //   if (typeof groupPassword !== "string") throw "The group password must be a string.";
      //   groupPassword = groupPassword.trim();
      //   if (groupPassword.length === 0) throw "An empty spaces group password is not valid.";
      // } catch (e) {
      //     // console.log(e);
      //     return res.render('joinGroup', {error: e});
      //   }

      // try {
      //     const group = await 
      // } catch (e) {
        
      // }

  });

router
  .route('/:groupId')
  .get(async (req, res) => 
  {
    let group;
    
    try
    {
      group = await groupsData.get(req.params.groupId);

    }
    catch (e)
    {
      return res.render('error', {title: "Error", error: e});
    }
 
    console.log(group);
    //console.log(group.users);

    let users = [];

    for (let i = 0; i < Object.keys(group.users).length; i++)
    {
      try
      {
        users[i] = await usersData.getUser(group.users[i].toString());
      }

      catch(e)
      {
        // calvin made the bottom line of code, i commented it out atm and im keeping it here for my memory
        // return res.render('error', {title: "Error", error: e});
        console.log(e);
      }
    }



    /*const result = lookUpRaw(group.groupLocation.coordinates[0],group.groupLocation.coordinates[1] );

    console.log(result.features);*/

    let city = cities.gps_lookup(group.groupLocation.coordinates[0],group.groupLocation.coordinates[1]);

    console.log(city);

    //let city2 = cities.gps_lookup(14.5995, 120.9842);

    //console.log(city2);

   // console.log(users);

    //let group_members = await

      return res.render("groupbyID",{group: group, groupMembers: users, title: group.groupName, location: city});
  });

export default router;