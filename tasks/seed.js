import { groups } from '../config/mongoCollections.js';
import {dbConnection, closeConnection} from '../config/mongoConnection.js';
import {groupsData, usersData, messagesData} from '../data/index.js';

const db = await dbConnection();
await db.dropDatabase();

try {
    /* USERS */
    /* Create 12 users - user1 will be deleted for demonstration */
    const user1 = await usersData.createUser(
        "John", "Smith", "johnsmith@example.com", "Test123$", "2015554516", "I am eager to make and meet new roommates", 23, 
        ["Biking", "Movies", "Painting"], "picture url with be here i guess"
    );
    
    const user2 = await usersData.createUser(
        "Emily", "Johnson", "emilyjohnson@example.com", "Test123$", "2015557845", "Love hiking and outdoor adventures", 27, 
        ["Hiking", "Photography", "Cooking"], "picture url goes here"
    );
    
    const user3 = await usersData.createUser(
        "Miguel", "Hernandez", "miguelhernandez@example.com", "Test123$", "2015558964", "A tech enthusiast and bookworm", 30, 
        ["Technology", "Reading", "Chess"], "picture url will be inserted here"
    );
    
    const user4 = await usersData.createUser(
        "Sara", "Khan", "sarakhan@example.com", "Test123$", "2015556732", "Passionate about music and traveling", 25, 
        ["Music", "Traveling", "Yoga"], "image url will be here"
    );
    
    const user5 = await usersData.createUser(
        "Alex", "Tanaka", "alextanaka@example.com", "Test123$", "2015554321", "Gamer and aspiring chef", 22, 
        ["Gaming", "Cooking", "Anime"], "URL for the picture here"
    );

    const user6 = await usersData.createUser(
        "Miguel", "Garcia", "miguelgarcia@example.com", "Test123$", "2015557890", "Avid reader and history buff", 28,
        ["Reading", "History", "Hiking"], "URL for the picture here"
    );
    
    const user7 = await usersData.createUser(
        "Aisha", "Patel", "aishapatel@example.com", "Test123$", "2015551234", "Tech enthusiast and amateur photographer", 24,
        ["Technology", "Photography", "Blogging"], "URL for the picture here"
    );

    const user8 = await usersData.createUser(
        "Elena", "Rodriguez", "elenarodriguez@example.com", "Test123$", "2015552468", "Fitness lover and outdoor enthusiast", 26,
        ["Fitness", "Hiking", "Kayaking"], "URL for the picture here"
    );
    
    const user9 = await usersData.createUser(
        "Liam", "Nguyen", "liamnguyen@example.com", "Test123$", "2015551357", "Movie fanatic and amateur playwright", 30,
        ["Movies", "Theater", "Writing"], "URL for the picture here"
    );
    
    const user10 = await usersData.createUser(
        "Zoe", "Smith", "zoesmith@example.com", "Test123$", "2015558642", "Passionate about sustainable living and gardening", 27,
        ["Sustainability", "Gardening", "Cooking"], "URL for the picture here"
    );

    const user11 = await usersData.createUser(
        "Noah", "Lee", "noahlee@example.com", "Test123$", "2015559473", "Enthusiastic about digital art and animation", 23,
        ["Digital Art", "Animation", "Video Games"], "URL for the picture here"
    );
    
    const user12 = await usersData.createUser(
        "Emma", "Johnson", "emmajohnson@example.com", "Test123$", "2015557621", "Lover of classical music and playing the violin", 29,
        ["Classical Music", "Violin", "Reading"], "URL for the picture here"
    );

    
    /* Update user2's bio and number */
    const updatedFields = {
        biography: "Updated biography text",
        phoneNumber: "2025559876", 
    };
    await usersData.updateUser(user2._id, updatedFields);
    const updatedUser = await usersData.getUser(user2._id);
    // console.log("User after update:", updatedUser);
    

    /* Remove user1 */
    const removedUser = await usersData.removeUser(user1._id);
    // console.log("User removed:", removedUser);

    const allUsers = await usersData.getAllUsers();
    console.log('All users:', allUsers);
        

    /* GROUPS */
    /* Create group1 with users 2-4 */
    const group1 = await groupsData.create(
        "The Cool Kids", 
        "We're the coolest kids on the block!", 
        [-73.971623, 40.850708], // 1615-1593 Gerome Ave, Fort Lee, NJ 07024
        1500,
        "M",
        [user2._id, user3._id, user4._id]
    )

    // create group2 with user5 in it
    const group2 = await groupsData.create(
        "The Lame Adults", 
        "We're the WORST ADULTS on O'block!", 
        [-74.043181, 40.883850], // 17-1 Mercer St, Hackensack, NJ 07601
        1,
        "F",
        [user5._id]
    )

    // create group3 with user6 and user7
    const group3 = await groupsData.create(
        "The Boring Fellas", 
        "We're the most boring fellas on the planet", 
        [-74.184897, 40.732781], // 186-158 Howard St, Newark, NJ 07103
        25000,
        "O",
        [user6._id, user7._id]
    )

    // create group3 with users 8-11
    const group4 = await groupsData.create(
        "Garden State Explorers", 
        "Looking for roommates in NJ Hit us up", 
        [-74.278195, 40.924945],  // 118 Whitmore Ave, Wayne, NJ 07470
        45000,
        "F",
        [user8._id, user9._id, user10._id, user11._id]
    )
    
    // create group5 with user12
    const group5 = await groupsData.create(
        "Jersey Jazz Enthusiasts", 
        "Jazz lovers sharing who love music and need roommates", 
        [-74.0713, 40.7357],  // 73 Broadway, Jersey City, NJ 07306
        50000,
        "O",
        [user12._id]
    )

    // groups getGroupByUserId()
    const found = await groupsData.getGroupByUserId(user3._id.toString());
    // console.log(`The group that has userId ${user3._id} is groupId ${found}`);

    // groups getAll()
    let allGroups = await groupsData.getAll();
    // console.log('All groups:\n', allGroups);

    // groups get()
    const only_group2 = await groupsData.get(group2._id.toString());
    // console.log('ONLY group2:\n', only_group2);

    // groups update()
    const updated_group1 = await groupsData.update(group1._id.toString(), 'The Sleepy Joes', 'Sleeping on the job', [2.124872, 13.239743], 1265, "O", [user1._id, user2._id], group1.matches, group1.reviews);
    // console.log('UPDATED group1:\n', updated_group1);

    // groups remove() - Removing group5 instead
    const removed_group2 = await groupsData.remove(group5._id.toString());
    // console.log('Result of trying to remove group2: ', removed_group2);

    // groups getAll()
    allGroups = await groupsData.getAll();
    console.log('All groups:', allGroups);
    // console.log('All groups after deleting group5:\n', allGroups);

    
    // MESSAGES
    /* Create a conversation between group 1 and 2 */
    const conversation1 = await messagesData.createNewConversation(group1._id.toString(), group2._id.toString());

    /* Create a conversation between group 3 and 4 */
    const conversation2 = await messagesData.createNewConversation(group3._id.toString(), group4._id.toString());

    /* Create a conversation between group 1 and 3 */
    const conversation3 = await messagesData.createNewConversation(group1._id.toString(), group3._id.toString());

    /* Create messages among groups */
    await messagesData.createMessage(conversation1.toString(), group1._id.toString(), "Yo how ya doing ?     ");
    await messagesData.createMessage(conversation1.toString(), group2._id.toString(), "      How u doing gang?");
    await messagesData.createMessage(conversation1.toString(), group1._id.toString(), " im well brody thx  ");

    await messagesData.createMessage(conversation2.toString(), group3._id.toString(), "   do you want to meet up? ");
    await messagesData.createMessage(conversation2.toString(), group4._id.toString(), "   ya im down");
    await messagesData.createMessage(conversation2.toString(), group4._id.toString(), "   btw bring cookies...    ");

    await messagesData.createMessage(conversation3.toString(), group3._id.toString(), "   what u upto gng?    ");
    await messagesData.createMessage(conversation3.toString(), group1._id.toString(), "   nm hbu    ");
    await messagesData.createMessage(conversation3.toString(), group3._id.toString(), "   jus chillin    ");


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