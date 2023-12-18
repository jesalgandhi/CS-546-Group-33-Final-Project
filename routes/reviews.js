import express from 'express';
const router = express.Router();
import validation from '../helpers.js';
import xss from 'xss';

import {groupsData} from '../data/index.js';
import {usersData} from '../data/index.js';
import {messagesData} from '../data/index.js';
import {reviewsData} from '../data/index.js';


router
  .route('/:groupId')
  .get(async (req, res) => {
    /* Retrieve userId from the session */
    if (!(req.session.user && req.session.user.id)) {
      return res.redirect('/login');
    }
    const userId = req.session.user.id;

    let groupId = req.params.groupId;
    let groupInfo = undefined;
    
    /* Get groupData using id from params */
    try {
      groupInfo = await groupsData.get(groupId);
    } catch (e) {
      return res.status(400).render('reviews', {error: e});
    }

    let reviews = []
    for (let eachReview of groupInfo.reviews) {
      let reviewerGroup = undefined;
      try {
        reviewerGroup = await groupsData.get(eachReview._id.toString());
      } catch (e) {
        return res.status(500).render('reviews', {error: e});
      }
      let reviewObj = {
        score: eachReview.score,
        review: eachReview.review,
        reviewer: reviewerGroup.groupName,
        groupId: groupId
      }
      reviews.push(reviewObj);
    }

    let noReviews = false;
    if (reviews.length === 0) noReviews = true;

    return res.render('reviews', {
      title: `Reviews of ${groupInfo.groupName}`,
      reviews: reviews,
      noReviews: noReviews
    })
  });

router
  .route('/create/:groupId')
  .get(async (req, res) => {
    if (!req.session.user || !req.session.user.id) {
      return res.redirect('/login');
    }
    const receivingGroupId = req.params.groupId;
    const userId = req.session.user.id;
    let thisGroupId;
    try {
      thisGroupId = await groupsData.getGroupByUserId(userId);
    } catch (e) {
      return res.status(400).render('error', {error: e, title: "Add a review"});
    }
    let groupExists;
    try {
      groupExists = await groupsData.get(thisGroupId);
    } catch (e) {
      return res.status(400).render('error', {error: e, title: "Add a review"});
    }
    try {
      await reviewsData.checkForDuplicateReview(thisGroupId, receivingGroupId)
    } catch (e) {
      return res.status(400).render('error', {error: e, title: "Add a review"});
    }

    return res.render('addReview', {title: "Add a review"});
  })
  .post(async (req, res) => {
    let groupId = req.params.groupId;
    try {
      groupId = validation.checkId(groupId, 'groupId');
    } catch (e) {
      return res.status(500).render('error', {error: e});
    }
    let groupInfo = undefined;
    try {
      groupInfo = await groupsData.get(groupId);
    } catch (e) {
      return res.status(400).render('error', {error: e});
    }
    let {ratingInput, reviewInput} = req.body;
    reviewInput = reviewInput.trim();
    reviewInput = xss(reviewInput);
    ratingInput = ratingInput.trim();
    ratingInput = parseInt(ratingInput);
    const userId = req.session.user.id;
    let reviewerId;
    let reviewerInfo;
    try {
      reviewerId = await groupsData.getGroupByUserId(userId);
    } catch (e) {
      return res.status(400).render('error', {error: e});
    }
    try {
      reviewerInfo = await groupsData.get(reviewerId);
    } catch (e) {
      return res.status(400).render('error', {error: e});
    }

    let createNewReview;
    try {
      createNewReview = await reviewsData.createReview(groupId, reviewerId, reviewerInfo.groupName, reviewInput, ratingInput)
    } catch (e) {
      return res.status(500).render('addReview', {
        error: e,
        reviewInput: reviewInput
      })
    }

    return res.redirect('/matches');

  });

export default router;
