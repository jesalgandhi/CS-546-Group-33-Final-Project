import { groups } from '../config/mongoCollections.js';
import {dbConnection, closeConnection} from '../config/mongoConnection.js';
import {groupsData, usersData, messagesData} from '../data/index.js';

const db = await dbConnection();
await db.dropDatabase();

/* USERS */
/* Create 5 users */
const user1 = await usersData.createUser(
    "John", "Smith", "johnsmith@example.com", "2015554516", "I am eager to make and meet new roommates", 23, 
    ["Biking", "Movies", "Painting"], "picture url with be here i guess"
);

const user2 = await usersData.createUser(
    "Emily", "Johnson", "emilyjohnson@example.com", "2025557845", "Love hiking and outdoor adventures", 27, 
    ["Hiking", "Photography", "Cooking"], "picture url goes here"
);

const user3 = await usersData.createUser(
    "Miguel", "Hernandez", "miguelhernandez@example.com", "2035558964", "A tech enthusiast and bookworm", 30, 
    ["Technology", "Reading", "Chess"], "picture url will be inserted here"
);

const user4 = await usersData.createUser(
    "Sara", "Khan", "sarakhan@example.com", "2045556732", "Passionate about music and traveling", 25, 
    ["Music", "Traveling", "Yoga"], "image url will be here"
);

const user5 = await usersData.createUser(
    "Alex", "Tanaka", "alextanaka@example.com", "2055554321", "Gamer and aspiring chef", 22, 
    ["Gaming", "Cooking", "Anime"], "URL for the picture here"
);

/* Update user2's bio and number */
const updatedFields = {
    biography: "Updated biography text",
    phoneNumber: "2025559876", 
};
await usersData.updateUser(user2._id, updatedFields);
const updatedUser = await usersData.getUser(user2._id);
console.log("User after update:", updatedUser);

/* Remove user1 */
const removedUser = await usersData.removeUser(user1._id);
console.log("User removed:", removedUser);







console.log('Done seeding database');

await closeConnection();