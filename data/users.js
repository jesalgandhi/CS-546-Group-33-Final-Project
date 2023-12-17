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
import bcrypt from 'bcrypt';
import validation from '../helpers.js';
import fetch from 'node-fetch';
import * as helpers from '../helpers.js';

// const groupsCollection = await groups(); // will be used a lot, so making it a global variable
// const usersCollection = await users();

// const validatePassword = (password) => {
//   const passwordPattern = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$";
//   const passwordReg = new RegExp(passwordPattern);
//   if (!passwordReg.test(password)) {
//     throw "There needs to be at least one uppercase character, there has to be at least one number and there has to be at least one special character";
//   }
// };
const exportedMethods = {


    async isImageUrl(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            const contentType = response.headers.get('content-type');
            return contentType.startsWith('image/');
        } catch (error) {
            console.error('Error fetching image:', error);
            return false;
        }
      },


  /* ALL FUNCTIONS BELOW NEED TO BE DONE */

  async createUser(firstName, lastName, emailAddress, password, phoneNumber, biography, age, interests, picture) { //picture
    if (typeof firstName !== 'string' || firstName.trim().length === 0) 
    { throw 'firstName must be a non-empty string'; } 
    if (typeof lastName !== 'string' || lastName.trim().length === 0) 
    { throw 'lastName must be a non-empty string'; }
    if (!validate(emailAddress)) 
    { throw 'You must provide a valid contact email'; }
    // if (!/^[0-9]{10}$/.test(phoneNumber))
    // { throw 'phoneNumber must be a non-empty string'; }
    
    // CHANGE SALT TO 16 BEFORE SUBMITTING
    const saltRounds = await bcrypt.genSalt(8);
    const hashedPass = await bcrypt.hash(password, saltRounds);


    if (typeof biography !== 'string' || biography.trim().length === 0 || biography.trim().length > 200)
    { throw 'biography must be a non-empty string over the lentgh of 200'; }
    age = parseInt(age);
    if (isNaN(age) || age < 18 || age > 120) {
      throw 'age must be a number over the age of 18 and under the age of 121';
    }
    if (typeof interests === 'string') {
        interests = interests.split(',').map(interest => interest.trim());
      }
      
    if (!Array.isArray(interests) || !interests.every(interest => typeof interest === 'string')) {
        throw 'Interests must be a list of strings';
    }

    const usersCollection = await users();
    const existingEmail = await usersCollection.findOne({ emailAddress: emailAddress.trim() });
    if (existingEmail) {
        throw `User with email address ${emailAddress} already exists`;
    }
    let number = phone(phoneNumber);
    if (!number.isValid) throw 'This phone number is invalid!';
    number = number.phoneNumber;

    const existingPhone = await usersCollection.findOne({ phoneNumber: number });
    if (existingPhone) {
        throw `User with phone number ${number} already exists`;
    }
    const defaultImages = [
        'https://pistolsfiringblog.com/wp-content/uploads/2016/07/Screen-Shot-2016-07-12-at-10.04.40-PM.png',//diglett
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRWZ5AWNBwejH7qrNaM00Vio-oIhSYjUr8Wg&usqp=CAU',//squirtle
        'https://esi.si.com/.image/t_share/MjAxNzM0MTAzODY1NzYzNDcx/gengar.jpg', //gengar
        'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/hostedimages/1379727070i/3130.png',// the little penguin
        'https://c02.purpledshub.com/uploads/sites/62/2022/05/psyduck-249ddf6.jpg?webp=1'//some duck idek
        // ... more image URLs ...
    ];

    // Validate or assign default picture URL
    let pictureUrl = picture;
    const pictureUrlIsValid = picture && await this.isImageUrl(picture);
    if (!pictureUrlIsValid) {
        // If no valid picture is provided, select a random one from the default list
        const randomIndex = Math.floor(Math.random() * defaultImages.length);
        pictureUrl = defaultImages[randomIndex];
    }


    let newUser = { 
      _id: new ObjectId(),
      firstName: firstName.trim(),
      lastName: lastName.trim(), 
      emailAddress: emailAddress.trim(),
      password: hashedPass,
      phoneNumber: number,
      biography: biography.trim(),
      age: age,
      interests: interests,
      picture: pictureUrl.trim(), 
      admin: false
    };

    const insertResult = await usersCollection.insertOne(newUser);
    if (!insertResult.acknowledged || insertResult.insertedCount === 0) 
    { throw 'Could not add user'; } 

    return newUser; 
  },

async getAllUsers() {
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
  const userIdString = (userId instanceof ObjectId) ? userId.toString() : userId;

  if (!ObjectId.isValid(userIdString)) {
      throw 'You must provide a valid user ID';
  }

  const groupId = await groupsData.getGroupByUserId(userIdString);
  if (!groupId) {
      throw 'User not found in any group';
  }
  const group = await groupsData.get(groupId);
  if (!group) {
      throw 'Group not found';
  }

  const updatedUsers = group.users.filter(user => user.toString() !== userIdString);
  if (group.users.length !== updatedUsers.length) {
      await groupsData.updateGroupUsers(groupId, updatedUsers);
  }

  const usersCollection = await users();
  const deletionResult = await usersCollection.deleteOne({ _id: new ObjectId(userIdString) });

  if (deletionResult.deletedCount === 0) {
      throw 'Could not delete user or user not found';
  }

  return { deleted: true, userId: userIdString };
}
,


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
    
    // Check if a user with the same email or phone number already exists
    const existingUser = await usersCollection.findOne({
        $or: [
            { emailAddress: updatedFields.emailAddress },
            { phoneNumber: updatedFields.phoneNumber }
        ]
    });
    
    if (existingUser) {
        throw 'A user with this email or phone number already exists';
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