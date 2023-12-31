// matches.js
import { ObjectId } from 'mongodb';
import { groups } from '../config/mongoCollections.js';
import helpers from '../helpers.js';
import * as data from './index.js'



const exportedMethods = {

  /**
   * Checks if two groups are compatible based on criteria such as interests and locations.
   * If they are compatible, adds each group's ID to the other's matches array.
   * @param {string} firstGroupId - The ID of the first group.
   * @param {string} secondGroupId - The ID of the second group.
   */
  async matchGroups(firstGroupId, secondGroupId) {
    const groupsCollection = await groups(); // this retrieves the groups collection

    // Validate group IDs.
    firstGroupId = helpers.checkId(firstGroupId, 'firstGroupId');
    secondGroupId = helpers.checkId(secondGroupId, 'secondGroupId');

    //  Retrieve both groups from the database.
    const group1 = data.groupsData.get(firstGroupId)
    const group2 = data.groupsData.get(secondGroupId)
    // Check if genderPreferences, location, and budget are compatible.
    if (group1.genderPreference !== group2.genderPreference) {
      throw 'Gender preferences do not match.';
    }

    //Location calculation add here **********************

    if (Math.abs(group1.budget - group2.budget) > 1000) {
      throw 'Budgets are not similar enough.'
    }

    //From the groups we need to retrieve all the userids 
    const users1 = await data.usersData.getAllUsers(firstGroupId)
    const users2 = await data.usersData.getAllUsers(secondGroupId)

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
    const groupsCollection = await groups(); // this retrieves the groups collection

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

    //4. Ensure that you cannot match with yourself
    if (group === suggestedGroup)
      throw "You cannot match with yourself";


   

    // 4. Check if suggestedGroupId is in the suggestedMatches of groupId.
    if (!group.suggestedMatches.includes(suggestedGroupId)) {
      throw 'The group is not in the suggested matches.'
    }

    // 5. Check if the groups are not already in each other's confirmedMatches.
    if (group.matches.includes(suggestedGroupId) || suggestedGroup.matches.includes(groupId)) {
      throw 'The groups are already matched.'
    }

    // 6. Move the suggestedGroupId from suggestedMatches to confirmedMatches for both groups.
    //This effectively matches the groups
    //confirmedMatches will hold the final list of matches that are used to message eachother
    const confirmMatch1 = await groupsCollection.updateMany(
      { _id: new ObjectId(groupId) },
      { 
        $pull: { suggestedMatches: new ObjectId(suggestedGroupId)},
        $addToSet: { matches: new ObjectId(suggestedGroupId)},
      }
    );
    
    const confirmMatch2 = await groupsCollection.updateMany(
      { _id: new ObjectId(suggestedGroupId) },
      { 
        $pull: { suggestedMatches: new ObjectId(groupId.toString()) },
/*        $addToSet: { matches: new ObjectId(groupId) }, 
 */      }
    );

    const confirmMatch3 = await groupsCollection.updateOne(
      { _id: new ObjectId(groupId) },
      { 
        $pull: { suggestedMatches: suggestedGroupId.toString() },
      }
    );
    
    
    const confirmMatch4 = await groupsCollection.updateOne(
      { _id: new ObjectId(suggestedGroupId) },
      { 
        $pull: { suggestedMatches: groupId.toString() },
      }
    );
    

    //console.log(confirmMatch1);

    

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
  const groupsCollection = await groups(); // this retrieves the groups collection

  // 1. Validate group IDs.
  firstGroupId = helpers.checkId(firstGroupId, 'firstGroupId');
  secondGroupId = helpers.checkId(secondGroupId, 'secondGroupId');

  // 2. Retrieve both groups from the database.
  const group1 = await data.groupsData.get(firstGroupId.toString());
  const group2 = await data.groupsData.get(secondGroupId.toString());

  // 3. Check if both groups exist.
  if (!group1 || !group2) {
    throw 'One or both groups do not exist.'
  } 

  // 4. Check if the groups are currently matched.
  if (!group1.matches.map(String).includes(secondGroupId) || !group2.matches.map(String).includes(firstGroupId)) {
  // Groups are not matched, so no need to unmatch. You could return false or throw an error, depending on your preference.
    throw 'Groups are not matched.'
  }

  // 5. Remove the match from each group's confirmedMatches array.
  const unmatchGroup1 = await groupsCollection.updateOne(
    { _id: new ObjectId(firstGroupId) },
    { $pull: { matches: new ObjectId(secondGroupId) } }
  );
  const unmatchGroup2 = await groupsCollection.updateOne(
    { _id: new ObjectId(secondGroupId) },
    { $pull: { matches: new ObjectId(firstGroupId) } }
  );
  console.log(unmatchGroup1);
  console.log(unmatchGroup2);

  const bothUpdatesSuccessful = unmatchGroup1.modifiedCount === 1 && unmatchGroup2.modifiedCount === 1;
  
  //return true if both successful and false if failed
  return bothUpdatesSuccessful;

  },



  async getMatches(groupId) {
    const groupsCollection = await groups(); // this retrieves the groups collection

    // Validate group ID.
    groupId = helpers.checkId(groupId, 'groupId');

    //  Retrieve group from the database.
    const group = await data.groupsData.get(groupId);

    //Check if group exists
    if (!group) {
      throw 'Group does not exist.'
    }

    //Return matches array
    return group.matches;

  },

  async getSuggestedMatches(groupId) {
    const groupsCollection = await groups(); // this retrieves the groups collection

    //Validate group ID
    groupId = helpers.checkId(groupId, 'groupId');

    //Retrieve group from database
    const group = await data.groupsData.get(groupId);

    //check if group exists
    if (!group) {
      throw 'Group does not exist.'
    }

    return group.suggestedMatches;
  },

  //This function will be called when a group is created
  //It will suggest matches for the group based on all users in our current DB with matching filters
  async suggestAllMatches(currentGroupId)
  {
    const groupsCollection = await groups(); // this retrieves the groups collection

    //Validate group ID
    let groupId = helpers.checkId(currentGroupId.toString(), 'groupId');

    // Get the current group
    const currentGroup = await data.groupsData.get(currentGroupId.toString());
    
    //Get all groups
    let allGroups = await data.groupsData.getAll();

    let excludedValues = currentGroup.matches.map(match => match.toString()); 
    allGroups = allGroups.filter(group => !excludedValues.includes(group._id.toString())); 



    //console.log(currentGroup);


    let suggestedMatches = [];

    //Iterate over all groups
    for (let i = 0; i < allGroups.length; i++)
    {
      if (allGroups[i]._id.toString() != currentGroupId.toString())
      {
        //Get groupData for other group
        let otherGroup = await data.groupsData.get(allGroups[i]._id.toString());


        if (currentGroup.numRoommates == otherGroup.users.length) 
        {
          suggestedMatches.push(allGroups[i]._id);
          //console.log(otherGroup.users.length);
        

          //Gender Preference Check
          if (currentGroup.genderPreference == otherGroup.genderPreference)
          {
            console.log("Gender Match");
            suggestedMatches.push(allGroups[i]._id);
          }
        

          //Budget Check (+/- $500 for now)
          else if (Math.abs(currentGroup.budget - otherGroup.budget) <= 500) 
          {
            console.log("Budget Match");
            suggestedMatches.push(allGroups[i]._id);
          }

          else 
          {
            // Interest Check
            let users1 = [];
            let users2 = [];

          // Assuming currentGroup.users is an array of user IDs
          for (let userId of currentGroup.users) 
          {
            try 
            {
              let this_user = await data.usersData.getUser(userId);
              console.log(this_user);
              users1.push(this_user);
            } 
            catch (e) 
            {
              console.log(e);
            }
          } 
          console.log(otherGroup);
          for (let userObj of otherGroup.users) 
          {
            try 
            {
              let this_user = await data.usersData.getUser(userObj._id);
              users2.push(this_user);
            } 
            catch (e) 
            {
              console.log(e);
            }
          }
                
            console.log(users1);
            console.log(users2);
          
            // Create two sets to track unique interests
            let interests1 = new Set(users1.flatMap(user => user.interests));
            let interests2 = new Set(users2.flatMap(user => user.interests));
          
            // Find the intersection of the two sets (common interests)
            let commonInterests = [...interests1].filter(interest => interests2.has(interest));
          
            // If there are common interests and they are not matched, create the match
            // If there are common interests and the groups are not already suggested or matched, suggest the match        
            if (commonInterests.length >= 3) {
              suggestedMatches.push(otherGroup._id);
            }
          }
        }
           
      }   
    }

    //Check if each group is equal to current groups' num of desiredNumRoommates
    let uniqueArray = suggestedMatches.filter((value, index, self) => self.indexOf(value) === index);
    return uniqueArray;


  },

  //gets pending matches for a group (matches that have not been confirmed or rejected)
  async getPendingMatches(groupId) {
    const groupsCollection = await groups(); // this retrieves the groups collection

    //Validate group ID
    groupId = helpers.checkId(groupId, 'groupId');

    //Retrieve group from database
    const group = await data.groupsData.get(groupId);

    //check if group exists
    if (!group) {
      throw 'Group does not exist.'
    }

    const pendingMatches = []

    for(const matchId of group.matches){
      const matchGroup = await data.groupsData.get(matchId.toString());
      if(!matchGroup.matches.includes(groupId)){
        pendingMatches.push(matchId); 
      }
      
    }
    console.log('pending matches: ', pendingMatches)
    //Return matches array
    return pendingMatches;
  },

  //Delete a groupid from all matches of all groups
  async deleteGroupIdFromMatches(groupId) {

    //validate group ID
    groupId = helpers.checkId(groupId, 'groupId');

    //retrieve all groups from db
    const allGroups = await data.groupsData.getAll();

    //iterate over each 
    for(const group of allGroups){
      //Check if the group's matches array includes the groupId
      if(group.matches.includes(groupId.toString())){
        // If it does, remove the groupId from the matches array
        const index = group.matches.indexOf(groupId.toString());
        if (index > -1) {
          group.matches.splice(index, 1);
        }

      //Check if the group's suggestedMatches array includes the groupId
      if(group.suggestedMatches.includes(groupId.toString())){
        // If it does, remove the groupId from the suggestedMatches array
        const index = group.suggestedMatches.indexOf(groupId.toString());
        if (index > -1) {
          group.suggestedMatches.splice(index, 1);
        }
      }
        //update the group in database
        await data.groupsData.update(group._id,
          group.groupName,
          group.groupUsername,
          group.groupDescription,
          group.groupLocation,
          group.radius,
          group.budget,
          group.numRoommates,
          group.genderPreference,
          group.users,
          group.groupPassword,
          group.matches,
          group.suggestedMatches,
          group.reviews);
      }
    }

  },



  /**
   * Handles the superlike feature, where one group can superlike another, possibly notifying them.
   * @param {string} groupId - The ID of the group giving the superlike.
   * @param {string} superlikedGroupId - The ID of the group receiving the superlike.
   * @returns {Promise<boolean>} - Promise resolving to true if the operation was successful.
   */
  async superlikeGroup(groupId, superlikedGroupId) {
    const groupsCollection = await groups(); // this retrieves the groups collection

    // Validate group IDs.

    //  Increment the superlikes counter for the superliked group.

    //  Optionally, handle notification for the superliked group.

    // Return true if successful.
  }
};

export default exportedMethods;