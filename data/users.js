// This data file should export all functions using the ES6 standard as shown in the lecture code
import {groups} from '../config/mongoCollections.js'
import {conversations} from '../config/mongoCollections.js'
import {validate} from 'email-validator'; // for emails
import {phone} from 'phone'; // for normalizing phone numbers
import {ObjectId} from 'mongodb';
import {users} from '../config/mongoCollections.js';
import {groupsData} from './index.js';
import {usersData} from './index.js';
import {messagesData} from './index.js';

import validation from '../helpers.js';

const groupsCollection = await groups(); // will be used a lot, so making it a global variable
const usersCollection = await users();

const exportedMethods = {

  /* ALL FUNCTIONS BELOW NEED TO BE DONE */

  async createUser(firstName, lastName, emailAddress, phoneNumber, biography, age, interests, picture) {
    // function isValidPhoneNumber(phoneNumber) {
    //   const regex = /^\d{10}$/;
    //   return regex.test(phoneNumber);
    // }
    
    if (typeof firstName !== 'string' || firstName.trim().length === 0) 
    { throw 'firstName must be a non-empty string'; } 
    if (typeof lastName !== 'string' || lastName.trim().length === 0) 
    { throw 'lastName must be a non-empty string'; }
    if (!validate(emailAddress)) 
    { throw 'You must provide a valid contact email'; }
    // if (!isValidPhoneNumber(phoneNumber)) 
    // { throw 'You must provide a valid phone number'; }

    phoneNumber = phone(phoneNumber);
    // checking the what the boolean was set to to determine if phone number is valid
    if (!phoneNumber.isValid) throw 'Invalid phone number!';
    // setting the phone number to be the normalized phone number with country code and all
    phoneNumber = phoneNumber.phoneNumber;

    if (typeof biography !== 'string' || biography.trim().length === 0 || biography.trim().length > 200)
    { throw 'biography must be a non-empty string over the lentgh of 200'; }
    if (typeof age !== 'number' || age < 18 || age > 121)
    { throw 'age must be a number over the age of 18 and under the age of 121'; }
    if (!Array.isArray(interests)) 
    { throw 'Interests must be a list'; }

    const usersCollection = await users();
    const user = await usersCollection.findOne({ _id: new ObjectId() }); 
    if (!user) { throw 'No group'; } 
    let users = user.users || [];
    const existingUser = users.find((user) => user.emailAddress === emailAddress);
    if (existingUser)
    { throw `An user with email address ${emailAddress} already exists for this group`; } 
    if (!Array.isArray(interests)) 
    { throw 'Interests must be a list'; }

    let newUser = { 
      _id: new ObjectId(),
      firstName: firstName.trim(),
      lastName: lastName.trim(), 
      emailAddress: emailAddress.trim(),
      phoneNumber: phoneNumber.trim(),
      biography: biography.trim(),
      age: age.trim(),
      interests: interests.trim(),
      picture: picture.trim()
    };
    users[users.length] = newUser;

    const updatedInfo = await usersCollection.findOneAndUpdate( 
      { _id: new ObjectId() },
      { $push: { users: newUser } ,
        $inc: { totalNumberOfUsers: 1 } } ,
        { returnDocument: 'after' });

    if (updatedInfo.modifiedCount === 0) 
    { throw 'Could not add user'; } 
    user.totalNumberOfUsers++;
    return user; 
    
  }, 

  async getAllUsers(groupId) {
    if (!groupId) throw 'You must provide an id to search for'; 
    const groupsCollection = await groups(); 
    const group = await groupsCollection.findOne({ _id: new ObjectId(groupId) }); 
    if (!group) { throw 'No group'; }

    const Theusers = group.Theusers || [];

    return Theusers;; 


  },

    async getAllhelper() {
    const groupCollection = await groups();
    const groupList = await groupCollection.find({}).toArray();
    if (!groupList) {
      throw 'No group found';
    }
    const groupListStringIds = groupList.map(group => {
      group._id = group._id.toString();
      return group;
    });
    return groupListStringIds;
  },

  async getUser(UserId) {
    if (!UserId) throw 'You must provide an id to search for';
    if (typeof UserId !== 'string') {
      UserId = UserId.toString();
    }
    if (UserId.trim().length === 0) {
      throw 'UserId must be a non-empty string';
    }
    const _id = ObjectId.isValid(UserId) ? new ObjectId(UserId) : null;
    if (!_id) throw 'Invalid ObjectId';
  
    const allUsers = await this.getAllhelper();
    let theUser = null;
  
    for (let i = 0; i < allUsers.length; i++) {
      const currentUser = allUsers[i];
      const user = currentUser.users.find(user => user._id.toString() === UserId);
      if (user) {
        theUser = user;
        break;
      }
    }
  
    if (!theUser) {
      throw `No user with id ${UserId} found in the group`;
    }
    return theUser;
  },
  
  async removeUser(UserId) {
    if (!UserId) {
        throw 'You must provide a UserId to remove a user';
    }
    const groupsCollection = await groups();
    const group = await groupsCollection.findOne({ "users._id": new ObjectId(UserId) });
  
    if (!group) {
        throw 'No group found for the provided UserId';
    }
    const userToRemove = group.users.find(user => user._id.toString() === UserId.toString());
    if (!userToRemove) {
        throw 'User not found in the group';
    }
    const updatedInfo = await groupsCollection.findOneAndUpdate(
        { _id: group._id },
        {
            $pull: { users: { _id: new ObjectId(UserId) } },
        },
        { returnDocument: "after" }
    );
  
    if (updatedInfo.modifiedCount === 0) {
        throw 'Could not remove user';
    }  
    return updatedInfo;
  }
};

export default exportedMethods;