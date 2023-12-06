import express from 'express';
const router = express.Router();
import validation from '../helpers.js';

import {groupsData} from '../data/index.js';
import {usersData} from '../data/index.js';
import {messagesData} from '../data/index.js';


router.route('/')
  .get(async (req, res) => {
    try {
      const userId = req.session.user._id;
      const userSettings = await usersData.getUserById(userId);
      res.json(userSettings);
    } catch (e) {
      res.status(500).json({ error: e.toString() });
    }
  })
  // .post(async (req, res) => {
  // })
  .put(async (req, res) => {
    try {
      const userId = req.session.user._id;
      const updatedSettings = req.body;
      const updatedUser = await usersData.updateUser(userId, updatedSettings);
      res.json(updatedUser);
    } catch (e) {
      res.status(500).json({ error: e.toString() });
    }
  });


export default router;
