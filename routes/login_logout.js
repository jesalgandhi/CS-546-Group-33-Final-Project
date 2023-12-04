import express from 'express';
const router = express.Router();
import validation from '../helpers.js';

import {groupsData} from '../data/index.js';
import {usersData} from '../data/index.js';
import {messagesData} from '../data/index.js';


router
  .route('/login')
  .get(async (req, res) => {
    return res.render('login', {title: 'Login'});
  })
  .post(async (req, res) => {
    //TODO
  });

router
  .route('/logout')
  .get(async (req, res) => {
    /* Expire the cookie + render logout successful page */
    const anHourAgo = new Date();
    anHourAgo.setHours(anHourAgo.getHours() - 1);
    res.cookie('AuthState', '', {expires: anHourAgo});
    res.clearCookie('AuthState');
    return res.render('logout', {title: 'Logout Successful'});
  })

export default router;
