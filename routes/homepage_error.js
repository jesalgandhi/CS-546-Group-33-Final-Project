import express from 'express';
const router = express.Router();
import validation from '../helpers.js';

import {groupsData} from '../data/index.js';
import {usersData} from '../data/index.js';
import {messagesData} from '../data/index.js';


router
  .route('/')
  .get(async (req, res) => {
    return res.render('homepage', {title: "Home", user: req.session.user});
    // return res.json("homepage", {group: req.session.user.group, title: "Homepage"})
  })
  .post(async (req, res) => {
    //TODO
    let filter = req.body.filter;

    if (filter == age_desc)
    {
      //Get all groups

      //Get all users from each group

      //FIlter users based on ages?

      //Return groups of other users based on applied filter
    }

  });

/* IMPORTANT:
When redirecting to /error, make sure to set req.session.errorCode and req.session.errorMessage appropriately ! 
*/
router
  .route('/error')
  .get(async (req, res) => {
    let errorCode = 400;
  let errorMessage = "An error has occurred";

  /* If session code and message were set, reassign variables */
  if (req.session.errorCode) errorCode = req.session.errorCode;
  if (req.session.errorMessage) errorMessage = req.session.errorMessage;

  return res.status(errorCode).render('error', {title: "Error", error: errorMessage});
  })

export default router;
