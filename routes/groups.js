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
    let group;
    
    try
    {
      group = await groupsData.get(req.params.groupId);

    }
    catch
    {
      return res.redirect('/error');
    }
 
    console.log(group);
    //console.log(group.users);

    let users = {};

    for (let i = 0; i < Object.keys(group.users).length; i++)
    {
      users[i] = await usersData.getUser(group.users[i]);
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