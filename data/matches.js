// matches.js
import { ObjectId } from 'mongodb';
import { groups } from '../config/mongoCollections.js';
import helpers from '../helpers.js';
import * as data from './index.js'


const groupsCollection = await groups(); // this retrieves the groups collection

const exportedMethods = {

  /**
   * Checks if two groups are compatible based on criteria such as interests and locations.
   * If they are compatible, adds each group's ID to the other's matches array.
   * @param {string} firstGroupId - The ID of the first group.
   * @param {string} secondGroupId - The ID of the second group.
   */
  async matchGroups(firstGroupId, secondGroupId) {
    // Validate group IDs.
    firstGroupId = helpers.checkId(firstGroupId, 'firstGroupId');
    secondGroupId = helpers.checkId(secondGroupId, 'secondGroupId');

    //  Retrieve both groups from the database.
    const group1 = data.groupsData.get(firstGroupId)
    const group2 = data.groupsData.get(secondGroupId)

    //From the groups we need to retrieve all the userids 
    const users1 = data.usersData.getAllUsers(firstGroupId)
    const users2 = data.usersData.getAllUsers(secondGroupId)

    //Create two sets to track unique interests
    const interests1 = new Set();
    const interests2 = new Set();

    //---For each of the arrays of userids, get interests and add them to a set---//
    //We will get two sets of unique interests, one for each group
    for (const userId of users1) {
      const user = await data.usersData.getUser(userId); 
      user.interests.forEach(interest => interests1.add(interest));
    }
    for (const userId of users2) {
      const user = await data.usersData.getUser(userId); 
      user.interests.forEach(interest => interests2.add(interest));
    }

    //---Lets compare the groups to see if we should create a match---//
    
    // Find the intersection of the two sets (common interests)
    const commonInterests = [...interests1].filter(interest => interests2.has(interest));

    //If there are common interests and they are not matched, create the match
    // If there are common interests and the groups are not already suggested or matched, suggest the match
    if (commonInterests.length > 0) {
      // Check if the groups are already in each other's suggestedMatches or confirmedMatches
      const alreadySuggestedOrMatched = group1.suggestedMatches.includes(secondGroupId) || group2.suggestedMatches.includes(firstGroupId) || group1.confirmedMatches.includes(secondGroupId) || group2.confirmedMatches.includes(firstGroupId);

      if (!alreadySuggestedOrMatched) {
        // Update each group's suggestedMatches array to include the other's ID.
        const updateSuggestedMatches1 = groupsCollection.updateOne(
          { _id: new ObjectId(firstGroupId) },
          { $addToSet: { suggestedMatches: new ObjectId(secondGroupId) } }
        );
        const updateSuggestedMatches2 = groupsCollection.updateOne(
          { _id: new ObjectId(secondGroupId) },
          { $addToSet: { suggestedMatches: new ObjectId(firstGroupId) } }
        );

        // Check if both updates were successful
        if (updateSuggestedMatches1.modifiedCount === 1 && updateSuggestedMatches2.modifiedCount === 1) {
          return true; // Both updates were successful
        } else {
          return false; // One or both updates were not successful
        }
    }
    return false //already suggested or matched
  }
  return false // no common interests
  },





  




  
  async confirmMatch(groupId, suggestedGroupId) {
    // 1. Validate group IDs.
    groupId = helpers.checkId(groupId, 'groupId');
    suggestedGroupId = helpers.checkId(suggestedGroupId, 'suggestedGroupId');


    // 2. Retrieve both groups from the database.
    const group = await data.groupsData.get(groupId);
    const suggestedGroup = await data.groupsData.get(suggestedGroupId);

    // 3. Check if both groups exist.
    if (!group || !suggestedGroup) {
      throw 'One or both groups do not exist.'
    }

    // 4. Check if suggestedGroupId is in the suggestedMatches of groupId.
    if (!group.suggestedMatches.includes(suggestedGroupId)) {
      throw 'The group is not in the suggested matches.'
    }

    // 5. Check if the groups are not already in each other's confirmedMatches.
    if (group.confirmedMatches.includes(suggestedGroupId) || suggestedGroup.confirmedMatches.includes(groupId)) {
      throw 'The groups are already matched.'
    }

    // 6. Move the suggestedGroupId from suggestedMatches to confirmedMatches for both groups.
    //This effectively matches the groups
    //confirmedMatches will hold the final list of matches that are used to message eachother
    const confirmMatch1 = groupsCollection.updateOne(
      { _id: new ObjectId(groupId) },
      { 
        $pull: { suggestedMatches: new ObjectId(suggestedGroupId) },
        $addToSet: { confirmedMatches: new ObjectId(suggestedGroupId) } 
      }
    );
    const confirmMatch2 = groupsCollection.updateOne(
      { _id: new ObjectId(suggestedGroupId) },
      { 
        $pull: { suggestedMatches: new ObjectId(groupId) },
        $addToSet: { confirmedMatches: new ObjectId(groupId) } 
      }
    );

    //Check if updates were successful
    const bothUpdatesSuccessful = confirmMatch1.modifiedCount === 1 && confirmMatch2.modifiedCount === 1;
    
    //return true if both successful and false if failed
    return bothUpdatesSuccessful;
  },










  /**
   * Removes the match between two groups.
   * @param {string} firstGroupId - The ID of the first group.
   * @param {string} secondGroupId - The ID of the second group.
   * @returns {Promise<boolean>} - Promise resolving to true if the operation was successful.
   */
  async unmatchGroups(firstGroupId, secondGroupId) {
    // 1. Validate group IDs.
    firstGroupId = helpers.checkId(firstGroupId, 'firstGroupId');
    secondGroupId = helpers.checkId(secondGroupId, 'secondGroupId');

    // 2. Retrieve both groups from the database.
    const group1 = await data.groupsData.get(firstGroupId);
    const group2 = await data.groupsData.get(secondGroupId);

    // 3. Check if both groups exist.
    if (!group1 || !group2) {
      throw 'One or both groups do not exist.'
    } 

    // 4. Check if the groups are currently matched.
    if (!group1.confirmedMatches.includes(secondGroupId) || !group2.confirmedMatches.includes(firstGroupId)) {
    // Groups are not matched, so no need to unmatch. You could return false or throw an error, depending on your preference.
    return false;
    }

    // 5. Remove the match from each group's confirmedMatches array.
    const unmatchGroup1 = groupsCollection.updateOne(
      { _id: new ObjectId(firstGroupId) },
      { $pull: { confirmedMatches: new ObjectId(secondGroupId) } }
    );
    const unmatchGroup2 = groupsCollection.updateOne(
      { _id: new ObjectId(secondGroupId) },
      { $pull: { confirmedMatches: new ObjectId(firstGroupId) } }
    );

    const bothUpdatesSuccessful = unmatchGroup1.modifiedCount === 1 && unmatchGroup2.modifiedCount === 1;
    
    //return true if both successful and false if failed
    return bothUpdatesSuccessful;

  },





  




  /**
   * Handles the superlike feature, where one group can superlike another, possibly notifying them.
   * @param {string} groupId - The ID of the group giving the superlike.
   * @param {string} superlikedGroupId - The ID of the group receiving the superlike.
   * @returns {Promise<boolean>} - Promise resolving to true if the operation was successful.
   */
  async superlikeGroup(groupId, superlikedGroupId) {
    // Validate group IDs.

    //  Increment the superlikes counter for the superliked group.

    //  Optionally, handle notification for the superliked group.

    // Return true if successful.
  }
};

export default exportedMethods;