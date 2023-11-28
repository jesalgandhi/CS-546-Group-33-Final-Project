// This data file should export all functions using the ES6 standard as shown in the lecture code
import {groups} from '../config/mongoCollections.js'
import {conversations} from '../config/mongoCollections.js'
import {validate} from 'email-validator'; // for emails
import {phone} from 'phone'; // for normalizing phone numbers
import {ObjectId} from 'mongodb';
import {groupsData} from './index.js';
import {usersData} from './index.js';
import {messagesData} from './index.js';
import validation from '../helpers.js';
import groupsData from './index.js';

const groupsCollection = await groups(); // will be used a lot, so making it a global variable

const exportedMethods = {

  /* ALL FUNCTIONS BELOW NEED TO BE DONE */

  async createUser(groupId, firstName, lastName, emailAddress, phoneNumber, biography, age, interests, picture) {
      if ( (!groupId) || (!firstName) || (!lastName) || (!emailAddress) || (!phoneNumber) || (!biography) || (!age) || (!interests) || (!picture) ) throw 'Please provide all of the required inputs.';
      groupId = validation.checkId(groupId, "group ID");

      if ( (typeof firstName !== "string") || (typeof lastName !== "string") || (typeof emailAddress !== "string") || (typeof phoneNumber !== "string") || (typeof biography !== "string") || (typeof interests !== "string") || (typeof picture !== "string") ) throw "All the required inputs must be strings.";
      firstName = firstName.trim();
      lastName = lastName.trim();
      emailAddress = emailAddress.trim();
      phoneNumber = phoneNumber.trim();
      biography = biography.trim();
      interests = interests.trim();
      picture = picture.trim(); // again, the picture stuff might be uneccesary to do?

      if ( (firstName.length === 0) || (lastName.length === 0) || (emailAddress.length === 0) || (phoneNumber.length === 0) || (biography.length === 0) || (interests.length === 0) || (picture.length === 0) ) throw "All the required inputs must NOT be empty space strings.";

      if (!validate.validate(email)) throw `${emailAddress} is not a valid email.`; // checking email

      // checking if another user in the same group already has that email
      const group = await groupsData.get(groupId);
      for (const user of group.users) {
        if (user.emailAddress === emailAddress) throw `A user with the email address ${emailAddress} already exists in the users array for the groupId ${groupId}.`;
    }

      // https://www.npmjs.com/package/phone
      // returns an object of this format if its a valid OR invalid phoneNumber:
      // { isValid: true, phoneNumber: '+18175698900', countryIso2: 'US', countryIso3: 'USA', countryCode: '+1'}
      // { isValid: false }
      phoneNumber = phone(phoneNumber);
      if (!phoneNumber.isValid) throw `${phoneNumber} is not a valid phone number.`;
      phoneNumber = phoneNumber.phoneNumber;

      if (biography.length > 200) throw 'The biography exceeds the 200 character limit.';

      if (typeof age !== 'number') throw 'The age must be a number.';
      // using 122 because thats the oldest a person has ever lived in history, obviously we can change this value as need be
      if (age < 18 || age > 122) throw 'You cannot be younger than 18 years old or older than 122 years old.';

      // ... interests and picture stuff ...

      // the user object
      const user = {'_id': new ObjectId(), 'firstName': firstName, 'lastName': lastName, 'emailAddress': emailAddress, 'phoneNumber': phoneNumber, 'biography': biography, 'age': age, 'interests': interests, 'picture': picture};
      const updated_group = await groupsCollection.findOneAndUpdate(
        { _id: new ObjectId(groupId) },
        { 
            $push: { users: user }
        },
        { returnDocument: 'after' }
    );
    // if updating the group was unsuccessful
    if (!updated_group) throw 'Unable to update group with the added user.';

    return updated_event;

  }, 

  async getAllUsers(groupId) {
      groupId = validation.checkId(groupId, 'group ID');
      // getting the group, and then just returning the entire users sub collection within it
      const group = await groupsData.get(groupId);
      return group.users;
  },

  async getUser(UserId) {
      UserId = validation.checkId(UserId, "user ID");
      // getting all the groups
      const allGroups = await groupsData.getAll();
      // iterating over every group's users sub-collection, and checking if any of the users in them have the same UserId. if so, return user
      for (const group of allGroups) {
        let group_users = await this.getAllUsers(group._id.toString());

        let found = group_users.find((user) => user._id.toString() === UserId) // finding a user with userId of UserId in the users sub-collection of the current group
        if (found) return found;
    }
    throw `Could not find user with the userId ${UserId}.`;
  }, 

  async removeUser(UserId) {
      UserId = validation.checkId(UserId, "user ID");

      const user = await this.getUser(UserId); // this is just to ensure there exists a user with UserId in the DB
      let group_with_UserId = undefined; // will store the groupId of the group that has the user with UserId inside of it

      // iterating over every group's users sub-collection, and checking if any of the users in them have the same UserId. if so, get the group that has that user's groupId
      const allGroups = await groupsData.getAll();
      for (const group of allGroups) {
        let group_users = await this.getAllUsers(group._id.toString()); // all the users of the current group

        let found = group_users.find((user) => user._id.toString() === UserId) // finding a user with userId of UserId in the users sub-collection of the current group
        if (found) {
            group_with_UserId = group._id.toString(); // setting the groupId of the group that has the user
            break;
        }    
      }
  
      // removing the user from the group with groupId group_with_UserId
      const removed_user = await groupsCollection.findOneAndUpdate(
        { _id: new ObjectId(group_with_UserId) }, 
        { 
        $pull: { users: { _id: new ObjectId(UserId) } }
        },
        { returnDocument: 'after' }
      );
      // if removing the user was unsuccessful
      if (!removed_user) throw `Failed to remove the user with the UserId ${UserId}.`;


  }
};

export default exportedMethods;