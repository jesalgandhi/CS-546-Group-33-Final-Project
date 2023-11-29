import { groups } from '../config/mongoCollections.js';
import {dbConnection, closeConnection} from '../config/mongoConnection.js';
import {groupsData, usersData, messagesData} from '../data/index.js';

const db = await dbConnection();
await db.dropDatabase();

// groupsData.create()
// groupsData.remove()
// groupsData.update()

console.log('Done seeding database');

await closeConnection();