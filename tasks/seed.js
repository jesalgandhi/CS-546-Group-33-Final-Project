import { groups } from '../config/mongoCollections.js';
import {dbConnection, closeConnection} from '../config/mongoConnection.js';
import {groupsData, usersData, messagesData} from '../data/index.js';

const db = await dbConnection();
await db.dropDatabase();

/* issues with createUser - please fix so we can seed */
// const user1 = await usersData.createUser(
//     "John", "Smith", "johnsmith@example.com", "2015554516", "I am eager to make and meet new roommates", 23, 
//     ["Biking", "Movies", "Painting"], "picture url with be here i guess"
// );
// console.log(user1);

console.log('Done seeding database');

await closeConnection();