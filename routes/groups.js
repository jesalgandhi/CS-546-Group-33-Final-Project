import express from 'express';
const router = express.Router();
import validation from '../helpers.js';

import {groupsData} from '../data/index.js';
import {usersData} from '../data/index.js';
import {messagesData} from '../data/index.js';
import {groups} from '../config/mongoCollections.js'


import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { lookUpRaw } = require("geojson-places");

const cities = require('cities');

import { ObjectId } from 'mongodb';


router
  .route('/create')
  .get(async (req, res) => {
    //return res.json("groups/create route");

    /* Retrieve userId from the session */
    if (!(req.session.user && req.session.user.id)) {
      return res.redirect('/login');
    }



    return res.render("createGroup", {title: 'Create a Group'});
  })
  .post(async (req, res) => {
      console.log('we in /create post mayne');
      
      // all the input fields
      const groupInfo = req.body;
      let groupName = groupInfo.groupName;
      let groupUsername = groupInfo.groupUsername;
      let groupDescription = groupInfo.groupDescription;
      let zipCode = groupInfo.zipCode;
      let radius = groupInfo.radius;
      let budget = groupInfo.budget;
      let numRoommates = groupInfo.numRoommates;
      let genderPreference = groupInfo.genderPreference;
      let groupPassword = groupInfo.groupPassword;

      console.log('printing stuff');
      console.log(groupName)
      console.log(groupUsername)
      console.log(groupDescription)
      console.log(zipCode)
      console.log(radius)
      console.log(budget)
      console.log(numRoommates)
      console.log(genderPreference)
      console.log(groupPassword);


      try {
        
          // ensuring inputs are there and are strings
          if ( (!groupName) || (!groupUsername) || (!groupDescription) || (!zipCode) || (!radius) || (!budget) || (!numRoommates) || (!genderPreference) || (!groupPassword) ) throw 'Please provide all of the required inputs.';

          radius = Number(radius);
          budget = Number(budget);
          numRoommates = Number(numRoommates);
          // zipCode = Number(zipCode);

          // radius
          let valid_radii = [1, 5, 10, 25, 50, 100, 250, 500, 1000];
          if ( !valid_radii.includes(radius) ) throw 'Invalid radius.';

          // budget
          if (budget <= 0 || budget > 50000) throw 'The budget must be nonnegative and below 50k.';

          // numRoommates
          if (numRoommates < 1 || numRoommates > 4) throw 'The numRoommates must be 1-4.';

          let coordinates = undefined; // will be in the form [latitude, longitude]

          try {
            // using the OSM nominatim API with the zip code to get all the matches
            // https://nominatim.org/release-docs/develop/api/Lookup/
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(zipCode)}`);
            const data = await response.json(); // parsing it as json in order to actually be able to iterate over it

            for (const place of data) {
                // this will be the format of the display_name field
                // display_name: "Elmwood Park, Bergen County, 07407, New Jersey, United States",
                let country = place.display_name.split(" ").slice(-2) // looking for the option where the zip code is in the United States
                if (country[0] === "United" && country[1] === "States") {
                    // lat and lon coords are strings, so have to convert it into a floating point number
                    coordinates = [
                      parseFloat(place.lat), 
                      parseFloat(place.lon)
                    ];
                }
            }

          } catch (e) {
              console.log("inside of zipcode stuff\n", e);
          }
          console.log(coordinates);


          // making it uppercase just to avoid cases where it's lowercase 
          genderPreference = genderPreference.toUpperCase();
          // if genderPreference is neither M, F, or O, throw error
          if ( (genderPreference !== 'M') && (genderPreference !== 'F') && (genderPreference !== 'O') ) throw 'The genderPreference must be either M, F, or O';


          // trimming as necessary
          groupName = groupName.trim();
          groupDescription = groupDescription.trim();
          groupUsername = groupUsername.trim();
          groupPassword = groupPassword.trim();

          // ensure groupName/groupDescription/groupUsername/groupPassword is nonempty
          if (groupName.length === 0) throw 'The groupName field is empty.';
          if (groupDescription.length === 0) throw 'The groupDescription field is empty.';
          if (groupUsername.length === 0) throw 'The groupUsername field is empty.';
          if (groupPassword.length === 0) throw 'The groupPassword field is empty.';

          const groupsCollection = await groups();

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
          if (groupPassword.length < 8 || groupPassword.length > 50) throw `${groupPassword} must be > 8 characters and < 50 characters long.`;

          let group = await groupsData.create(groupName, groupUsername, groupDescription, coordinates, radius, budget, numRoommates, genderPreference, [new ObjectId(req.session.user.id)], groupPassword);

          req.session.user.groupInfo = group;
          req.session.user.groupID = group._id.toString();
          req.session.user.admin = true; // updating user's session to reflect their new admin status

          let updatedFields = {
            admin: true
          };
          await usersData.updateUser(req.session.user.id, updatedFields);

      } catch (e) {
          console.log('----------\n', e);
          return res.render('error', {error: e});
      }





      return res.redirect('/');

  });

router
  .route('/join')
  .get(async (req, res) => {

      /* Retrieve userId from the session */
      if (!(req.session.user && req.session.user.id)) {
        return res.redirect('/login');
      }


      //return res.json("groups/join route");
      return res.render("joinGroup", {title: 'Join a Group'});
  })
  .post(async (req, res) => {
      console.log('we in /join post mayne');

      const groupInfo = req.body;
      let groupUsername = groupInfo.groupUsername;
      console.log(groupUsername);

      let groupPassword = groupInfo.groupPassword;
      console.log(groupPassword);
      // // let errors = [];

      let group = undefined;
      try {
        if (!groupUsername) throw "A group username must be provided.";
        if (typeof groupUsername !== "string") throw "The group username must be a string.";
        groupUsername = groupUsername.trim();
        if (groupUsername.length === 0) throw "An empty spaces group username is not valid.";

        if (!groupPassword) throw "A group password must be provided.";
        if (typeof groupPassword !== "string") throw "The group password must be a string.";
        groupPassword = groupPassword.trim();
        if (groupPassword.length === 0) throw "An empty spaces group password is not valid.";


        let groupId = await groupsData.getGroupByGroupUsername(groupUsername);
        let groupId2 = await groupsData.getGroupByGroupPassword(groupPassword);

        if (groupId !== groupId2) throw 'Incorrect group username or group password.';
      
        group = await groupsData.get(groupId);
        if (group.users.length === 4) throw 'Cannot join group. Max amount of 4 users!';

        console.log('-----');
        console.log(group.groupName);
        console.log(group.groupUsername);
        console.log(group.groupDescription);
        console.log(group.groupLocation.coordinates);
        console.log(group.budget);
        console.log(group.genderPreference);
        console.log(group.users.concat(new ObjectId(req.session.user.id)));
        console.log(group.groupPassword);
        console.log(group.matches);
        console.log(group.reviews);
        console.log('-----');


        let addedGroup = await groupsData.update(
          groupId,
          group.groupName,
          group.groupUsername,
          group.groupDescription,
          group.groupLocation.coordinates,
          group.budget,
          group.genderPreference,
          group.users.concat( new ObjectId(req.session.user.id)),
          group.groupPassword,
          group.matches,
          group.suggestedMatches,
          group.reviews
          );


      } catch (e) {
          // console.log(e);
          return res.render('joinGroup', {error: e});
        }

      req.session.user.group = group;
      req.session.user.groupID = group._id;

      return res.redirect('/');
      // return res.render('homepage', {title: "Home", user: req.session.user, group: req.session.user.group});

  });

router
  .route('/:groupId')
  .get(async (req, res) => 
  {
    let group;
    
    try
    {
      group = await groupsData.get(req.params.groupId);

    }
    catch (e)
    {
      return res.render('error', {title: "Error", error: e});
    }
 
    console.log(group);
    //console.log(group.users);

    let users = [];

    for (let i = 0; i < Object.keys(group.users).length; i++)
    {
      try
      {
        users[i] = await usersData.getUser(group.users[i].toString());
        users[i].lastName = users[i].lastName[0] + ".";
      }

      catch(e)
      {
        // calvin made the bottom line of code, i commented it out atm and im keeping it here for my memory
        // return res.render('error', {title: "Error", error: e});
        console.log(e);
      }
    }



    /*const result = lookUpRaw(group.groupLocation.coordinates[0],group.groupLocation.coordinates[1] );

    console.log(result.features);*/

    let city = cities.gps_lookup(group.groupLocation.coordinates[0],group.groupLocation.coordinates[1]);

    console.log(city);

    //let city2 = cities.gps_lookup(14.5995, 120.9842);

    //console.log(city2);

   // console.log(users);

    //let group_members = await

      return res.render("groupbyID",{group: group, groupMembers: users, title: group.groupName, location: city});
  });



// THE BELOW IS NOT WORKING ATM, WE'RE DOING FINE WITHOUT IT I THINK BUT JUST AN FYI THE BOTTOM DOESNT WORK AT ALL
/* Route from which the client-side JS will retrieve coordinates */
router
  .route('/create/coords')
  .post(async (req, res) => {
    let coords = [req.body.latitude, req.body.longitude];
    req.session.user.coords = coords;
    console.log(coords);
  });


export default router;