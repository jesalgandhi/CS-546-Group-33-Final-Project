import {dbConnection, closeConnection} from '../config/mongoConnection.js';
// import attendees from '../data/attendees.js';
// import events from '../data/events.js';
import {eventsData, attendeesData} from '../data/index.js';

const db = await dbConnection();
await db.dropDatabase();

/* TODO */


console.log('Done seeding database');

await closeConnection();