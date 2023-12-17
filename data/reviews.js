// This data file should export all functions using the ES6 standard as shown in the lecture code
import {groups} from '../config/mongoCollections.js'
import {ObjectId} from 'mongodb';

import validation from '../helpers.js';

const groupsCollection = await groups(); // will be used a lot, so making it a global variable

const exportedMethods = {

  /* ALL FUNCTIONS BELOW NEED TO BE DONE */

  async createReview(groupId, reviewerId, reviewer, review, score) {
    // groupId is the group ID of the person they're leaving a review on
    if ( (!groupId) || (!reviewerId) || (!reviewer) || (!review) || (!score)) throw 'All the required inputs were not given';

    if ( (typeof reviewer !== 'string') || (typeof review !== 'string') || (typeof reviewerId !== 'string') || (typeof groupId !== 'string') || (typeof score !== 'number')){
      throw 'Every input must be a string.';
    } 
    reviewer = reviewer.trim();
    review = review.trim();
    groupId = validation.checkId(groupId, 'group ID');
    reviewerId = validation.checkId(reviewerId, 'reviewer ID');

    if ( (reviewer.length === 0) || (review.length === 0) ) 'The inputs cannot be empty space strings';

    if (review.length > 1000) throw 'The review has exceeded the 1000 character limit';

    // making sure there exists a group with the groupId, reviewerId
    const group = await groupsCollection.findOne({_id: new ObjectId(groupId)});
    const reviewerGroup = await groupsCollection.findOne({_id: new ObjectId(reviewerId)});
    if (!group) throw `No group with ${groupId} found`;
    if (!reviewerGroup) throw `No group with ${reviewerGroup} found`;
    

    // checking if this person has already left a review before
    let reviews = group.reviews || [];
    const existingReview = reviews.find((review) => review._id.toString() === reviewerId);
    if (existingReview) throw `You have already left a review on this group`;

    // making the review object
    const new_review = {
        _id: new ObjectId(reviewerId),
        score: score,
        review: review
    };
    // pushing the review into the reviews array
    const updatedInfo = await groupsCollection.findOneAndUpdate(
        { _id: new ObjectId(groupId) },
        { $push: { reviews: new_review } },
        {returnDocument: 'after'}
    );
    // if we failed to update the document
    if (updatedInfo.modifiedCount === 0) throw 'Could not add review';
    return updatedInfo;

    
  }, 

  async getAllReviews(groupId) {
    groupId = validation.checkId(groupId, 'group ID');
    const group = await groupsCollection.findOne({ _id: new ObjectId(groupId) }); 
    if (!group) { throw `No group with groupId ${groupId}`; }

    // const reviews = group.reviews || [];

    return group.reviews; 

  },

  async getReview(reviewId) {
    reviewId = validation.checkId(reviewId, 'review ID');
    // getting all the groups
    const allGroups = await groupsCollection.find({}).toArray();

    // iterating over all the groups to get their reviews
    for (const group of allGroups) {
        // seeing if any of the reviewId's in any of the group's reviews match reviewId
        let found = group.reviews.find((review) => review._id.toString() === reviewId);
        if (found) return found;
    }
    // if the review Id was not found
    throw `Could not find review with the reviewId ${reviewId}.`;
  
  },
  
  async removeReview(reviewId) {
    reviewId = validation.checkId(reviewId, 'review ID');

    // getting all the groups
    const allGroups = await groupsCollection.find({}).toArray();
    let group_with_reviewId = undefined;

    // iterating over all the groups to get their reviews
    for (const group of allGroups) {
        // seeing if any of the reviewId's in any of the group's reviews match reviewId
        let found = group.reviews.find((review) => review._id.toString() === reviewId);
        // if found, save the group._id of the group that has that review
        if (found) {
            group_with_reviewId = group._id;
            break;
        }
    }
    // if this runs, that means there was no group that had a review with reviewId
    if (!group_with_reviewId) throw `No group found with a review from ${reviewId}`

    // removing the review from that group
    const removed_review = await groupsCollection.findOneAndUpdate(
        { _id: new ObjectId(group_with_reviewId) },
        {
            $pull: { reviews: { _id: new ObjectId(reviewId) } } 
        },
        { returnDocument: 'after' }
    );
    // failed to remove it
    if (!removed_review) throw `Failed to remove review with reviewId ${reviewId}`;

    return removed_review;
  }
};

export default exportedMethods;