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

    //  Compare their profiles based on matching criteria.
    //need an array for interests

    // If they match, update each group's matches array to include the other's ID.

    // Return true if successful.
  },

  /**
   * Removes the match between two groups.
   * @param {string} firstGroupId - The ID of the first group.
   * @param {string} secondGroupId - The ID of the second group.
   * @returns {Promise<boolean>} - Promise resolving to true if the operation was successful.
   */
  async unmatchGroups(firstGroupId, secondGroupId) {
    //  Validate group IDs.

    // Update each group's matches array to remove the other's ID.

    // Return true if successful.
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
  },

  /**
   * Suggests potential matches for a group based on matching criteria.
   * This could be a complex function that takes into account various factors.
   * @param {string} groupId - The ID of the group looking for matches.
   * @returns {Promise<Array>} - Promise resolving to an array of potential match group IDs.
   */
  async suggestMatches(groupId) {
    //  Validate group ID.

    //  Retrieve the group's profile from the database.

    //  Find groups with compatible profiles that are not yet matched.

    //  Return an array of suggested group IDs.
  }
};

export default exportedMethods;
