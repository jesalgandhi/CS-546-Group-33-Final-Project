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

// const groupsCollection = await groups(); // will be used a lot, so making it a global variable
// const usersCollection = await users();

const exportedMethods = {

  /* ALL FUNCTIONS BELOW NEED TO BE DONE */

  async createUser(firstName, lastName, emailAddress, phoneNumber, biography, age, interests, picture) {
    if (typeof firstName !== 'string' || firstName.trim().length === 0) 
    { throw 'firstName must be a non-empty string'; } 
    if (typeof lastName !== 'string' || lastName.trim().length === 0) 
    { throw 'lastName must be a non-empty string'; }
    if (!validate(emailAddress)) 
    { throw 'You must provide a valid contact email'; }

    phoneNumber = phone(phoneNumber);
    if (!phoneNumber.isValid) throw 'Invalid phone number!';
    phoneNumber = phoneNumber.phoneNumber;

    if (typeof biography !== 'string' || biography.trim().length === 0 || biography.trim().length > 200)
    { throw 'biography must be a non-empty string over the lentgh of 200'; }
    if (typeof age !== 'number' || age < 18 || age > 121)
    { throw 'age must be a number over the age of 18 and under the age of 121'; }
    if (!Array.isArray(interests)) 
    { throw 'Interests must be a list'; }

    const usersCollection = await users();

    let newUser = { 
      _id: new ObjectId(),
      firstName: firstName.trim(),
      lastName: lastName.trim(), 
      emailAddress: emailAddress.trim(),
      phoneNumber: phoneNumber,
      biography: biography.trim(),
      age: age,
      interests: interests,
      picture: picture
    };

    const insertResult = await usersCollection.insertOne(newUser);
    if (!insertResult.acknowledged || insertResult.insertedCount === 0) 
    { throw 'Could not add user'; } 

    return newUser; 
},


async  getAllUsers() {
  const usersCollection = await users();
  const usersList = await usersCollection.find({}).toArray();

  if (!usersList || usersList.length === 0) {
      throw 'No users found';
  }

  return usersList;
},


  async getUser(userId) {
    if (!ObjectId.isValid(userId)) {
        throw 'You must provide a valid user ID';
    }

    const usersCollection = await users();
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

    if (!user) {
        throw 'User not found';
    }

    return user;
},

  
async removeUser(userId) {
  if (!ObjectId.isValid(userId)) {
      throw 'You must provide a valid user ID';
  }

  const usersCollection = await users();
  const deletionResult = await usersCollection.deleteOne({ _id: new ObjectId(userId) });

  if (deletionResult.deletedCount === 0) {
      throw 'Could not delete user or user not found';
  }

  return { deleted: true, userId: userId };
},


  async updateUser(userId, updatedFields) {
    if (!ObjectId.isValid(userId)) { 
        throw 'Invalid user ID'; 
    }

    const usersCollection = await users();
    const userToUpdate = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!userToUpdate) {
        throw 'User not found';
    }
    if (updatedFields.emailAddress && !validate(updatedFields.emailAddress)) {
        throw 'You must provide a valid contact email';
    }
    if (updatedFields.phoneNumber) {
        let phoneNumber = phone(updatedFields.phoneNumber);
        if (!phoneNumber.isValid) throw 'Invalid phone number!';
        updatedFields.phoneNumber = phoneNumber.phoneNumber;
    }
    const updateData = {};
    for (const [key, value] of Object.entries(updatedFields)) {
        if (value !== undefined && value !== null) {
            updateData[key] = value;
        }
    }

    const updateResult = await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: updateData }
    );

    if (updateResult.modifiedCount === 0) {
        throw 'Could not update user';
    }

    return await usersCollection.findOne({ _id: new ObjectId(userId) });
}

};



export default exportedMethods;