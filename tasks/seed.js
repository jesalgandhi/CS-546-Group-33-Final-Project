import { groups } from '../config/mongoCollections.js';
import {dbConnection, closeConnection} from '../config/mongoConnection.js';
import {groupsData, usersData, messagesData} from '../data/index.js';

const db = await dbConnection();
await db.dropDatabase();

/* USERS */
/* Create 5 users */

try {
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
    
    // console.log(`\n\nHERE ARE THE USERIDs!! user 2: ${user2._id} | user 3: ${user3._id} | user 4: ${user4._id}`);
    
    /* GROUPS */
    /* Create group1 with users 2-4 */

    // groups create()
    const group1 = await groupsData.create(
        "The Cool Kids", 
        "We're the coolest kids on the block!", 
        [40.743256, -74.027768], 
        [user2._id, user3._id, user4._id]
    )
    console.log("Group 1:\n", group1);

    // groups create()
    const group2 = await groupsData.create(
        "The Lame Adults", 
        "We're the WORST ADULTS on O'block!", 
        [7.524024, -12.583203], 
        [user1._id]
    )
    console.log("Group 2:\n", group2);

    // groups getGroupByUserId()
    const found = await groupsData.getGroupByUserId(user3._id.toString());
    console.log(`The group that has userId ${user3._id} is groupId ${found}`);

    // groups getAll()
    let allGroups = await groupsData.getAll();
    console.log('All groups:\n', allGroups);

    // groups get()
    const only_group2 = await groupsData.get(group2._id.toString());
    console.log('ONLY group2:\n', only_group2);

    // groups update()
    const updated_group1 = await groupsData.update(group1._id.toString(), 'The Sleepy Joes', 'Sleeping on the job', [2.124872, 13.239743], [user1._id, user2._id], group1.reviews);
    console.log('UPDATED group1:\n', updated_group1);

    // groups remove()
    const removed_group2 = await groupsData.remove(group2._id.toString());
    console.log('Result of trying to remove group2: ', removed_group2);

    // groups getAll()
    allGroups = await groupsData.getAll();
    console.log('All groups after deleting group2:\n', allGroups);




    console.log('Done seeding database');

} catch (e) {
    console.log(e);
}




/*
I'm thinking for the locations to have coordinates of random locations scattered around hoboken. 
Then for each user, it'll show the closest users relative to their location 
    (e.g. user from 
    1st st. would see user from 3rd st. then 8th st. and user from 8th st. would see user from
    3rd st. first then 1st st.)
*/

await closeConnection();