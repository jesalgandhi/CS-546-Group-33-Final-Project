import express from 'express';
const router = express.Router();
import validation from '../helpers.js';

import {groupsData} from '../data/index.js';
import {usersData} from '../data/index.js';
import {messagesData} from '../data/index.js';


router.route('/settings')
  .get(async (req, res) => {
    // try {
    //   const userId = req.session.user._id;
    //   const userSettings = await usersData.getUserById(userId);
    //   res.json(userSettings);
    // } catch (e) {
    //   res.status(500).json({ error: e.toString() });
    // }
    return res.render('settings', {title: 'Settings'});
  })
  // .post(async (req, res) => {
  // })
  .put(async (req, res) => {
    try {
      const userId = req.session.user._id;
      const updatedSettings = req.body;

      if (updatedSettings.firstName && (typeof updatedSettings.firstName !== 'string' || updatedSettings.firstName.trim().length === 0)) {
        return res.status(400).json({ error: 'Invalid first name' });
      }

      if (updatedSettings.emailAddress && !validate(updatedSettings.emailAddress)) {
        return res.status(400).json({ error: 'Invalid email address' });
      }

      if (updatedSettings.phoneNumber) {
        let phoneNumber = phone(updatedSettings.phoneNumber);
        if (!phoneNumber.isValid) {
          return res.status(400).json({ error: 'Invalid phone number' });
        }
        updatedSettings.phoneNumber = phoneNumber.phoneNumber;
      }

      const updatedUser = await usersData.updateUser(userId, updatedSettings);
      res.json(updatedUser);
    } catch (e) {
      res.status(500).json({ error: e.toString() });
    }
  });


export default router;
