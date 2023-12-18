import {groups} from '../config/mongoCollections.js'
import {conversations} from '../config/mongoCollections.js'
import {validate} from 'email-validator'; // for emails
import {ObjectId} from 'mongodb';
import validation from '../helpers.js';
import bcrypt from 'bcrypt';

import {usersData} from './index.js';

const groupsCollection = await groups(); // will be used a lot, so making it a global variable

const exportedMethods = {

  /* ALL FUNCTIONS BELOW NEED TO BE DONE */

  async create(
    groupName,
    groupUsername,
    groupDescription,
    groupLocation,
    radius,
    budget,
    numRoommates,
    genderPreference,
    users,
    groupPassword,
    groupPicture
  ) {

        // ensuring inputs are there and are strings
        if ( (!groupName) || (!groupUsername) || (!groupDescription) || (!groupLocation) || (!radius) || (!budget) || (!numRoommates) || (!genderPreference) || (!users) || (!groupPassword)) throw 'Please provide all of the required inputs.';
        if (typeof groupName !== "string") throw "Group name must be a string";
        if (typeof groupUsername !== "string") throw "Group username must be a string";
        if (typeof groupDescription !== "string") throw "Group description must be a string";
        if (typeof radius !== "number") throw "Radius must be a number";
        if (typeof budget !== "number") throw "Budget must be a number";
        if (typeof numRoommates !== "number") throw "Number of roommates must be a number";
        if (typeof genderPreference !== "string") throw "Gender preference must be a string";
        if (!Array.isArray(groupLocation)) throw "Group location must be a list of 2 coordinates";
        if (!Array.isArray(users)) throw "Users must be a list of up to 4 users";
        if (typeof groupPassword !== "string") throw "Group password must be a string";
        // if (typeof groupPicture !== "string") throw "Group picture must be a string";


        // check that groupLocation is a valid list of exactly 2 coordinates ....
        // check that users contains a max of 4 valid ObjectIds ....

      if (groupLocation.length !== 2) throw 'There MUST be only 2 coordinates in the groupLocation array.';

      // the latitude gets stored first, so checking that to start
      // latitude can be [-180, 180]
      if (groupLocation[0] < -90 || groupLocation[0] > 90) throw 'The latitude is not between [-90, 90] (inclusive of both ends).';
      
      // the longitude gets stored second, so checking that now
      // longitude can be [-90, 90]
      if (groupLocation[1] < -180 || groupLocation[1] > 180) throw 'The longitude is not between [-180, 180] (inclusive of both ends).';


      // budget
      if (budget <= 0 || budget > 50000) throw 'The budget must be nonnegative and below 50k.';

      // radius
      let valid_radii = [1, 5, 10, 25, 50, 100, 250, 500, 1000];
      if ( !valid_radii.includes(radius) ) throw 'Invalid radius.';

      // numRoommates
      if (numRoommates < 1 || numRoommates > 4) throw 'The number of roommates must be 1-4.';

      // making it uppercase just to avoid cases where it's lowercase 
      genderPreference = genderPreference.toUpperCase();
      // if genderPreference is neither M, F, or O, throw error
      if ( (genderPreference !== 'M') && (genderPreference !== 'F') && (genderPreference !== 'O') ) throw 'The gender preference must be either M, F, or O';

      // ensuring there are MAX 4 users in the group
      if (users.length > 4) throw 'There are more than 4 users in this group. Not allowed.';
      // checking the userIds of each user in this group
      for (const user of users) {
        // console.log('the userId: ' + user._id);
          if (!ObjectId.isValid(user)) throw `${user} is not a valid ObjectId.`;
      }
      
      
      
      // trimming as necessary
      groupName = groupName.trim();
      groupDescription = groupDescription.trim();
      groupUsername = groupUsername.trim();
      groupPassword = groupPassword.trim();

      // ensure groupName/groupDescription/groupUsername/groupPassword is nonempty
      if (groupName.length === 0) throw 'The group name field is empty.';
      if (groupDescription.length === 0) throw 'The group description field is empty.';
      if (groupUsername.length === 0) throw 'The group username field is empty.';
      if (groupPassword.length === 0) throw 'The group password field is empty.';

      // seeing if the groupName already exists in the database, meaning a diff group already has the name
      const usedGroupName = await groupsCollection.findOne({ groupName: groupName });
      if (usedGroupName) throw `A group with the name ${groupName} already exists.`;

      if (groupDescription.length > 1000) throw 'The description exceeds the 1000 character limit.';

      // seeing if the groupUsername already exists in the database, meaning a diff group already has the name, or if it contains spaces
      let usernameSpaces = groupUsername.split(" ");
      if (usernameSpaces.length > 1) throw `${groupUsername} contains spaces, invalid!`;

      // console.log('here is the groupUsername: ', groupUsername);
      const usedUsername = await groupsCollection.findOne( {groupUsername: groupUsername} );
      if (usedUsername) 
        {
          // console.log('here is the groupUsername: ', groupUsername);
          throw `A group with the username ${groupUsername} already exists.`;
        }

      // ensuring the length of password follows protocol
      if (groupPassword.length < 8 || groupPassword.length > 75) throw `Group password must be > 8 characters and < 50 characters long.`;


      const defaultImages = [
        'https://cdn.ecommercedns.uk/files/0/251420/6/27315606/c6241w2.jpg',
        'https://lookintonature.files.wordpress.com/2016/07/landscape-1456483171-pokemon2.jpg',
        'https://pbs.twimg.com/media/Ewky_WZVgAEFVlM.jpg:large', 
        'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/388555c9-52a2-4541-857a-27a37bc2a83d/dba5qjk-dc2f0c5e-7f59-4e19-ac47-357d60be8d0f.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzM4ODU1NWM5LTUyYTItNDU0MS04NTdhLTI3YTM3YmMyYTgzZFwvZGJhNXFqay1kYzJmMGM1ZS03ZjU5LTRlMTktYWM0Ny0zNTdkNjBiZThkMGYuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.qmcuIIivi9p3WFZ9UDCXDRHngxRxNaga10IMpFh-0SM',
        'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/cefe8db8-531a-4c46-94d9-181b154d4d87/dedgrkf-cc6d1506-d984-41cc-9053-f22b8581d46c.png/v1/fill/w_1280,h_830,q_80,strp/pokemon_25__my_gen_4_team_by_1meengreenie_dedgrkf-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9ODMwIiwicGF0aCI6IlwvZlwvY2VmZThkYjgtNTMxYS00YzQ2LTk0ZDktMTgxYjE1NGQ0ZDg3XC9kZWRncmtmLWNjNmQxNTA2LWQ5ODQtNDFjYy05MDUzLWYyMmI4NTgxZDQ2Yy5wbmciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.GlXW2Xzr2LH0dN3ASUe_R6e-cWRCtRloGAJbN8eK87Q'
        // ... more image URLs ...
      ];

      // Validate or assign default picture URL
      let pictureUrl = groupPicture;
      const pictureUrlIsValid = groupPicture && await usersData.isImageUrl(groupPicture);
      if (!pictureUrlIsValid) {
          // If no valid picture is provided, select a random one from the default list
          const randomIndex = Math.floor(Math.random() * defaultImages.length);
          pictureUrl = defaultImages[randomIndex];
      }


      // CHANGE SALT TO 16 BEFORE SUBMITTING (might not have to for group password)
      const saltRounds = await bcrypt.genSalt(8);
      const hashedPass = await bcrypt.hash(groupPassword, saltRounds);

      /* Reviews is initialized to an empty list like you suggested */
      let group = {
        'groupName': groupName, 
        'groupUsername': groupUsername,
        'groupDescription': groupDescription, 

        // https://www.mongodb.com/docs/manual/geospatial-queries/ 
        // I'm not sure if mongo is recognizing this as GeoJSON tbh
        'groupLocation': {
          type: "Point", 
          coordinates: groupLocation
        },
        'radius': radius,
        'budget': budget,
        'numRoommates': numRoommates,
        'genderPreference': genderPreference, 
        'users': users,
        'groupPassword': hashedPass,
        'groupPicture': pictureUrl.trim(),
        'matches': [], 
        'suggestedMatches': [],
        'reviews': []
      };
      const insertInfo = await groupsCollection.insertOne(group);
      if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Could not add group.';

      return group;
  },
  
  async getAll() {
      let allGroups = await groupsCollection.find({}).toArray(); // an array of all the groups in the DB
      if (!allGroups) throw 'Failed to get all of the groups';
      return allGroups;
  },
  
  async get(groupId) {
      groupId = validation.checkId(groupId, "group ID");

      const group = await groupsCollection.findOne({_id: new ObjectId(groupId)}); // converting the string groupId into an Object Id before querying database
      if (!group) throw `No group with a groupId of ${groupId} was found`;
      return group;
  },

  // returns the groupId of the group that contains a user with userId. throws error if nothing was found
  async getGroupByUserId(userId) {
      userId = validation.checkId(userId, "user ID");

      // getting all the groups
      const allGroups = await groupsCollection.find({}).toArray();

      // iterating over all the groups
      for (const group of allGroups) {
          // console.log(group.users);
          // console.log(group.users[1]);
          // console.log(new ObjectId(userId));

          // if this group's users array contains a user that matches userId, return that group's groupId as a string
          let found = group.users.find((user) => user.toString() === userId);
          // console.log(found);
          if (found) return group._id.toString();
      }
      throw `No group has a user with userId ${userId}`;

  },

    // returns the groupId of the group that has a groupPassword of groupPassword. throws error if nothing was found
    async getGroupByGroupPassword(groupPassword) {
      // userId = validation.checkId(userId, "user ID");
      if (!groupPassword) throw `Error: You must provide a group password`;
      if (typeof groupPassword !== 'string') throw `Error: group password must be a string`;
      groupPassword = groupPassword.trim();
      if (groupPassword.length === 0)
        throw `Error: group password cannot be an empty string or just spaces`;

      // getting all the groups
      const allGroups = await groupsCollection.find({}).toArray();

      // iterating over all the groups
      for (const group of allGroups) {
          // console.log(group.users);
          // console.log(group.users[1]);
          // console.log(new ObjectId(userId));

          // if this group's groupPassword matches groupPassword, return that group's groupId as a string
          let same_pass = await bcrypt.compare(groupPassword, group.groupPassword);


          if (same_pass) {
              return group._id.toString();
          }
      }
      throw 'Invalid group username or group password. GROUP PASS!';

  },

      // returns the groupId of the group that has a groupUsername of groupUsername. throws error if nothing was found
      async getGroupByGroupUsername(groupUsername) {
        // userId = validation.checkId(userId, "user ID");
        if (!groupUsername) throw `Error: You must provide a group username`;
        if (typeof groupUsername !== 'string') throw `Error: group username must be a string`;
        groupUsername = groupUsername.trim();
        if (groupUsername.length === 0)
          throw `Error: group username cannot be an empty string or just spaces`;
  
        // getting all the groups
        const allGroups = await groupsCollection.find({}).toArray();
  
        // iterating over all the groups
        for (const group of allGroups) {
            // console.log(group.users);
            // console.log(group.users[1]);
            // console.log(new ObjectId(userId));
  
            // if this group's groupUsername matches groupUsername, return that group's groupId as a string
            if (group.groupUsername === groupUsername) {
                return group._id.toString();
            }
        }
        throw 'Invalid group username or group password. GROUP USERNAME!';
  
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
  async updateGroupUsers(groupId, updatedUsers) {
    const updateInfo = await groupsCollection.updateOne(
        { _id: new ObjectId(groupId) },
        { $set: { users: updatedUsers } }
    );

    if (!updateInfo.modifiedCount) {
        throw 'Could not update the group';
    }

    return updateInfo;
}
,

  
  async update(
    groupId,
    groupName,
    groupUsername,
    groupDescription,
    groupLocation,
    radius,
    budget,
    numRoommates,
    genderPreference,
    users,
    groupPassword,
    groupPicture,
    matches,
    suggestedMatches,
    reviews, 
  ) {
      groupId = validation.checkId(groupId, "group ID");
        // ensuring inputs are there and are strings
        if ( (!groupName) || (!groupUsername) || (!groupDescription) || (!groupLocation) || (!budget) || (!numRoommates) || (!genderPreference) || (!users) || (!groupPassword)) throw 'Please provide all of the required inputs.';
        if (typeof groupName !== "string") throw "Group name must be a string";
        if (typeof groupUsername !== "string") throw "Group username must be a string";
        if (typeof groupDescription !== "string") throw "Group description must be a string";
        if (typeof radius !== "number") throw "Radius must be a number";
        if (typeof budget !== "number") throw "Budget must be a number";
        if (typeof numRoommates !== "number") throw "Number of roommates must be a number";
        if (typeof genderPreference !== "string") throw "Gender preference must be a string";
        if (!Array.isArray(groupLocation)) throw "Group location must be a list of 2 coordinates";
        if (!Array.isArray(users)) throw "Users must be a list of up to 4 users";
        if (typeof groupPassword !== "string") throw "Group password must be a string";
        // if (typeof groupPicture !== "string") throw "Group picture must be a string";
        if (!Array.isArray(matches)) throw "Matches must be a list of object Id's";
        if (!Array.isArray(suggestedMatches)) throw "Suggested matches must be a list of object Id's";


      // trimming as necessary
      groupName = groupName.trim();
      groupDescription = groupDescription.trim();
      groupUsername = groupUsername.trim();
      groupPassword = groupPassword.trim();
      // groupLocation = groupLocation.trim();

      // ensure groupName/groupDescription/groupUsername/groupPassword is nonempty
      if (groupName.length === 0) throw 'The group name field is empty.';
      if (groupDescription.length === 0) throw 'The group description field is empty.';
      if (groupUsername.length === 0) throw 'The group username field is empty.';
      if (groupPassword.length === 0) throw 'The group password field is empty.';

      const checkGroup = await this.get(groupId);
      if (checkGroup.groupName !== groupName) {
          // seeing if the groupName already exists in the database, meaning a diff group already has the name
          const usedGroupName = await groupsCollection.findOne({ groupName: groupName });
          if (usedGroupName) throw `A group with the name ${groupName} already exists.`;
      }

      // seeing if the groupUsername already exists in the database, meaning a diff group already has the name, or if it contains spaces
      let usernameSpaces = groupUsername.split(" ");
      if (usernameSpaces.length > 1) throw `${groupUsername} contains spaces, invalid!`;


      if (checkGroup.groupUsername !== groupUsername) {
          const usedUsername = await groupsCollection.findOne( {groupUsername: groupUsername} );
          if (usedUsername) throw `A group with the username ${groupUsername} already exists.`;
    }


      // ensuring the length of password follows protocol
      if (groupPassword.length < 8 || groupPassword.length > 75) throw `Group password must be > 8 characters and < 50 characters long.`;


      const defaultImages = [
        'https://cdn.ecommercedns.uk/files/0/251420/6/27315606/c6241w2.jpg',
        'https://lookintonature.files.wordpress.com/2016/07/landscape-1456483171-pokemon2.jpg',
        'https://pbs.twimg.com/media/Ewky_WZVgAEFVlM.jpg:large', 
        'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/388555c9-52a2-4541-857a-27a37bc2a83d/dba5qjk-dc2f0c5e-7f59-4e19-ac47-357d60be8d0f.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzM4ODU1NWM5LTUyYTItNDU0MS04NTdhLTI3YTM3YmMyYTgzZFwvZGJhNXFqay1kYzJmMGM1ZS03ZjU5LTRlMTktYWM0Ny0zNTdkNjBiZThkMGYuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.qmcuIIivi9p3WFZ9UDCXDRHngxRxNaga10IMpFh-0SM',
        'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/cefe8db8-531a-4c46-94d9-181b154d4d87/dedgrkf-cc6d1506-d984-41cc-9053-f22b8581d46c.png/v1/fill/w_1280,h_830,q_80,strp/pokemon_25__my_gen_4_team_by_1meengreenie_dedgrkf-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9ODMwIiwicGF0aCI6IlwvZlwvY2VmZThkYjgtNTMxYS00YzQ2LTk0ZDktMTgxYjE1NGQ0ZDg3XC9kZWRncmtmLWNjNmQxNTA2LWQ5ODQtNDFjYy05MDUzLWYyMmI4NTgxZDQ2Yy5wbmciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.GlXW2Xzr2LH0dN3ASUe_R6e-cWRCtRloGAJbN8eK87Q'
        // ... more image URLs ...
      ];

      // Validate or assign default picture URL
      let pictureUrl = groupPicture;
      const pictureUrlIsValid = groupPicture && await usersData.isImageUrl(groupPicture);
      if (!pictureUrlIsValid) {
          // If no valid picture is provided, select a random one from the default list
          const randomIndex = Math.floor(Math.random() * defaultImages.length);
          pictureUrl = defaultImages[randomIndex];
      }


      let curr_group = await this.get(groupId);  
      let same_pass = await bcrypt.compare(groupPassword, curr_group.groupPassword);
      let hashedPass = undefined;
      if (!same_pass) {
          // CHANGE SALT TO 16 BEFORE SUBMITTING (might not have to for group password)
          const saltRounds = await bcrypt.genSalt(8);
          hashedPass = await bcrypt.hash(groupPassword, saltRounds);
      }
      else {
          hashedPass = curr_group.groupPassword;
      }



      if (groupDescription.length > 1000) throw 'The description has exceeded the 1000 character limit.';

      // ... the groupLocation and user checking ...

      if (groupLocation.length !== 2) throw 'There MUST be only 2 coordinates in the groupLocation array.';

      // the latitude gets stored first, so checking that to start
      // latitude can be [-180, 180]
      if (groupLocation[0] < -90 || groupLocation[0] > 90) throw 'The latitude is not between [-90, 90] (inclusive of both ends).';
      
      // the longitude gets stored second, so checking that now
      // longitude can be [-90, 90]
      if (groupLocation[1] < -180 || groupLocation[1] > 180) throw 'The longitude is not between [-180, 180] (inclusive of both ends).';

      // budget
      if (budget <= 0 || budget > 50000) throw 'The budget must be nonnegative and below 50k.';

      // radius
      let valid_radii = [1, 5, 10, 25, 50, 100, 250, 500, 1000];
      if ( !valid_radii.includes(radius) ) throw 'Invalid radius.';

      // numRoommates
      if (numRoommates < 1 || numRoommates > 4) throw 'The number of roommates must be 1-4.';

      // making it uppercase just to avoid cases where it's lowercase 
      genderPreference = genderPreference.toUpperCase();
      // if genderPreference is neither M, F, or O, throw error
      if ( (genderPreference !== 'M') && (genderPreference !== 'F') && (genderPreference !== 'O') ) throw 'The gender preference must be either M, F, or O';


      // ensuring there are MAX 4 users in the group
      if (users.length > 4) throw 'There are more than 4 users in this group. Not allowed.';
      // checking the userIds of each user in this group
      for (const user of users) {
          if (!ObjectId.isValid(user)) throw `${user} is not a valid ObjectId.`;
      }


      // running get(match) on each groupId in matches. if there's no group with that groupId, get() will throw the appropriate not found error
      for (const match of matches) {
          let valid_group = await this.get(match.toString());
      }
      for (const match of suggestedMatches) {
        let valid_group = await this.get(match.toString());
      }

      // checking the _id, score, and description of each review
      for (const review of reviews) {
          // the review's _id
          // calling get(id) on the review._id to ensure a review is being made by an existing group (that isn't the same group ofc)
          let _id = review._id;
          if (typeof _id !== 'string') throw "The review's id must be a string.";
          // if (!ObjectId.isValid(_id)) throw "The review's id must be a valid objectId.";
          let valid_group = await this.get(id);
          if (_id === groupId) throw "The review's id CANNOT be the same as the group you're leaving the review on.";

          // the review's score
          let score = review.score;
          if (typeof score !== 'number') throw "The review's score must be a number.";
          if (score < 0 || score > 5) throw "The review's score must be between [0, 5].";

          // the review's description
          let description = review.description;
          if (typeof description !== 'string') throw "The review's description must be a string.";
          if (description.length > 1000) throw "The review exceeds the 1000 character limit.";          

      }


      // the new updated group object
      let group = {
        'groupName': groupName, 
        'groupUsername': groupUsername,
        'groupDescription': groupDescription, 
        'groupLocation': {type: 'Point', coordinates: groupLocation}, 
        'radius': radius,
        'budget': budget, 
        'numRoommates': numRoommates,
        'genderPreference': genderPreference, 
        'users': users, 
        'groupPassword': hashedPass,
        'groupPicture': pictureUrl.trim(),
        'matches': matches, 
        'suggestedMatches': suggestedMatches,
        'reviews': reviews};
      const updateInfo = await groupsCollection.findOneAndReplace(
        { _id: new ObjectId(groupId)},
        group,
        {returnDocument: 'after'}
      );

      // if updating was unsuccessful
      if (!updateInfo) throw `Error: Update failed! Could not update group with group id ${groupId}.`;
      return updateInfo;




  }
};

export default exportedMethods;
