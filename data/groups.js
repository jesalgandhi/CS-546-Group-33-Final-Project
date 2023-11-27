import {groups} from '../config/mongoCollections.js'
import {messages} from '../config/mongoCollections.js'
import {validate} from 'email-validator'; // for emails
import { ObjectId } from 'mongodb';
import validation from '../helpers.js';
import { groups } from '../config/mongoCollections.js';

const groupsCollection = await groups(); // will be used a lot, so making it a global variable

const exportedMethods = {

  /* ALL FUNCTIONS BELOW NEED TO BE DONE */

  async create(
    groupName,
    groupDescription,
    groupLocation,
    users,
    reviews,
  ) {
    // shouldnt reviews NOT be passed as an input? should it not instead be made upon group creation, and are initialized to empty since a new group will have 0 reviews?

      // ensuring inputs are there and are strings
      if ( (!groupName) || (!groupDescription) || (!groupLocation) || (!users) || (!reviews) ) throw 'Please provide all of the required inputs.';
      if ( (typeof groupName !== "string") || (typeof groupDescription !== "string") || (typeof groupLocation !== "string")) throw "All the required inputs must be strings.";
      // trimming as necessary
      groupName = groupName.trim();
      groupDescription = groupDescription.trim();
      groupLocation = groupLocation.trim();

      // seeing if the groupName already exists in the database, meaning a diff group already has the name
      const usedGroupName = await groupsCollection.findOne({ groupName: groupName });
      if (usedGroupName) throw `A group with the name ${groupName} already exists.`;

      if (groupDescription.length > 500) throw 'The description exceeds the 500 character limit.';

      // ... the groupLocation, user, and reviews checking ...

      let group = {'groupName': groupName, 'groupDescription': groupDescription, 'groupLocation': groupLocation, 'users': users, 'reviews': reviews};
      const insertInfo = await eventCollection.insertOne(group);
      if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Could not add group.';

      return group;

    
  },
  
  async getAll() {
      let allGroups = await groupsCollection.find({}).toArray(); // an array of all the groups in the DB
      if (!allGroups) throw 'Failed to get all of the groups';
      return allGroups;
  },
  
  async get(groupId) {
      let id = validation.checkId(groupId, "group ID");

      const group = await groupsCollection.findOne({_id: new ObjectId(groupId)}); // converting the string groupId into an Object Id before querying database
      if (!group) throw `No group with a groupId of ${groupId} was found`;
      return group;
  },
  
  async remove(groupId) {
      groupId = validation.checkId(groupId, "group ID");
      let result = {groupId, 'deleted': false};


      const deleted = await groupsCollection.deleteOne({_id: new ObjectId(groupId)});
      // if deleting the event was unsuccessful
      if (deleted.acknowledged === false) throw `Failed to delete group ${groupId}`;
      else result.deleted = true;

      return result;
  },
  
  async update(
    groupId,
    groupName,
    groupDescription,
    groupLocation,
    users,
    reviews,
  ) {
      groupId = validation.checkId(groupId, "group ID");
      // ensuring inputs are there and are strings
      if ( (!groupName) || (!groupDescription) || (!groupLocation) || (!users) || (!reviews) ) throw 'Please provide all of the required inputs.';
      if ( (typeof groupName !== "string") || (typeof groupDescription !== "string") || (typeof groupLocation !== "string")) throw "All the required inputs must be strings.";
      // trimming as necessary
      groupName = groupName.trim();
      groupDescription = groupDescription.trim();
      groupLocation = groupLocation.trim();

      // seeing if the groupName already exists in the database, meaning a diff group already has the name
      const usedGroupName = await groupsCollection.findOne({ groupName: groupName });
      if (usedGroupName) throw `A group with the name ${groupName} already exists.`;

      if (groupDescription.length > 500) throw 'The description has exceeded the 500 character limit.';

      // ... the groupLocation, user, and reviews checking ...

      // the new updated group object
      let group = {'groupName': groupName, 'groupDescription': groupDescription, 'groupLocation': groupLocation, 'users': users, 'reviews': reviews};
      const updateInfo = await eventCollection.findOneAndReplace(
        { _id: new ObjectId(eventId)},
        group,
        {returnDocument: 'after'}
      );
      // if updating was unsuccessful
      if (!updateInfo) throw `Error: Update failed! Could not update group with group id ${groupId}.`;
      return updateInfo;



  }
};

export default exportedMethods;
