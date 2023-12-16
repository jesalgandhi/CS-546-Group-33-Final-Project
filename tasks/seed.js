import { groups } from '../config/mongoCollections.js';
import { users } from '../config/mongoCollections.js';
import {dbConnection, closeConnection} from '../config/mongoConnection.js';
import {groupsData, usersData, messagesData} from '../data/index.js';
import {ObjectId} from 'mongodb';

let usersCollection = await users();

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
        ["Gaming", "Cooking", "Anime"], "https://mario.wiki.gallery/images/b/b8/SMBW_Yoshi.png"
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
        age: 32,
        phoneNumber: "2025559876", 
    };
    await usersData.updateUser(user2._id, updatedFields);
    const updatedUser = await usersData.getUser(user2._id);
    console.log("User after update:", updatedUser);
    

   
    // console.log("User removed:", removedUser);

    const allUsers = await usersData.getAllUsers();
    console.log('All users:', allUsers);
        

    /* GROUPS */
    /* Create group1 with users 2-4 */
    const group1 = await groupsData.create(
        "The Cool Kids",
        "Username1", 
        "We're the coolest kids on the block!", 
        //[-73.971623, 40.850708], // 1615-1593 Gerome Ave, Fort Lee, NJ 07024
        [40.850708, -73.971623 ],
        1500,
        "M",
        [user2._id, user3._id, user4._id],
        "Password1"
    )
     /* Remove user2 */
     const removedUser = await usersData.removeUser(user2._id);
     console.log("User removed:", removedUser);
     console.log(group1);
    //  console.log(group1);

    // create group2 with user5 in it
    const group2 = await groupsData.create(
        "The Lame Adults",
        "Username2",  
        "We're the WORST ADULTS on O'block!", 
        [-74.043181, 40.883850], // 17-1 Mercer St, Hackensack, NJ 07601
        5000,
        "F",
        [user5._id],
        "Password2"
    )

    // create group3 with user6 and user7
    const group3 = await groupsData.create(
        "The Boring Fellas", 
        "Username3", 
        "We're the most boring fellas on the planet", 
        [-74.184897, 40.732781], // 186-158 Howard St, Newark, NJ 07103
        25000,
        "O",
        [user6._id, user7._id],
        "Password3"
    )

    // create group3 with users 8-11
    const group4 = await groupsData.create(
        "Garden State Explorers", 
        "Username4",
        "Looking for roommates in NJ Hit us up", 
        [-74.278195, 40.924945],  // 118 Whitmore Ave, Wayne, NJ 07470
        5000,
        "F",
        [user8._id, user9._id, user10._id, user11._id],
        "Password4"
    )
    
    // create group5 with user12
    const group5 = await groupsData.create(
        "Jersey Jazz Enthusiasts", 
        "Username5",
        "Jazz lovers sharing who love music and need roommates", 
        [-74.0713, 40.7357],  // 73 Broadway, Jersey City, NJ 07306
        50000,
        "O",
        [user12._id],
        "Password5"
    )

    // console.log('HEREEEE');
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
    // console.log('HEREEE');
    const updated_group1 = await groupsData.update(group1._id.toString(), 'The Sleepy Joes', group1.groupUsername, 'Sleeping on the job', [2.124872, 13.239743], 1265, "O", [user1._id, user2._id], group1.groupPassword, group1.matches, group1.reviews);
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


// ... (your existing code)
let generatedPhoneNumbers = new Set();


const generateUniquePhoneNumber = () => {
    const maxAttempts = 1000000; // To avoid infinite loop in case of duplicates
    let phoneNumber;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        phoneNumber = `201555${Math.floor(1000 + Math.random() * 9000)}`;

        if (!generatedPhoneNumbers.has(phoneNumber)) {
            generatedPhoneNumbers.add(phoneNumber);
            return phoneNumber;
        }
    }

    throw new Error("Unable to generate a unique phone number after multiple attempts.");
};

// Function to generate random user data
const generateRandomUserData = () => {
    const firstNames = ["Alice", "Bob", "Charlie", "David", "Emma", "Frank", "Grace", "Henry", "Ivy", "Jack", "Kate", "Liam", "Mia", "Noah", "Olivia", "Paul", "Quinn", "Ryan", "Sophia", "Thomas", "Uma", "Victor", "Willow", "Xander", "Yara", "Zach", "Amelia", "Ben", "Cora", "Dylan", "Eva", "Finn", "Georgia", "Harrison", "Isabel", "Jasper", "Kylie", "Lucas", "Nora", "Owen", "Penelope", "Quentin", "Rose", "Sebastian", "Tessa", "Ulysses", "Violet", "Wesley", "Xena", "Yasmine", "Zane", "Ava", "Braden", "Chloe", "Daniel", "Eliza", "Felix", "Giselle", "Hudson", "Isla", "Jace", "Katherine", "Leo", "Madison", "Nathan", "Oliver", "Paige", "Quincy", "Riley", "Savannah", "Theodore", "Ursula", "Vincent", "Willa", "Xavi", "Yasmin", "Zara", "Aaron", "Bella", "Connor", "Delilah", "Elijah", "Freya", "Gabriel", "Harper", "Isaac", "Julia", "Emily", "Alex", "Sophie", "David", "Zoe", "Leo", "Eva", "Logan", "Mila", "Andrew", "Luna", "Ethan", "Aria", "Mason", "Aurora", "Emma", "Nathan", "Avery", "Wyatt", "Zoey", "Jackson", "Grace", "Grace", "Oliver", "Lily", "Sophia", "Leo", "Ella", "Mia", "Lucas", "Liam", "Scarlett", "Elijah", "Chloe", "Benjamin", "Aiden", "Isabella", "Amelia", "Carter", "Maddison", "Gabriel", "Emily", "Olivia", "Zachary", "Ava", "Ella", "Samuel", "Abigail", "Hannah", "Jackson", "Logan", "Natalie", "Isaac", "Evelyn", "Grace", "Zoe", "Aiden", "Addison", "Harper", "Brooklyn", "Charlotte", "Lily", "Madison", "Ella", "Ethan", "Aria", "Aurora", "Wyatt", "Nora", "Liam", "Sophia", "Henry", "Emma", "Mia", "Olivia", "Chloe", "Amelia", "Isabella", "Ella", "Lily", "Grace", "Ava", "Emily", "Scarlett", "Sophie", "Zoe", "Charlotte", "Liam", "Oliver", "Mia", "Emma", "Isabella", "Sophia", "Ella", "Amelia", "Harper", "Lily", "Ava", "Aria", "Evelyn", "Nora", "Zoe", "Addison", "Scarlett", "Grace", "Chloe", "Liam", "Noah", "Ethan", "Oliver", "Jackson", "Lucas", "Aiden", "Mia", "Sophia", "Olivia", "Emma", "Isabella", "Ava", "Lily", "Zoe", "Chloe", "Ella", "Grace", "Liam", "Noah", "Oliver", "Ethan", "Jackson", "Lucas", "Aiden", "Mia", "Sophia", "Olivia", "Emma", "Isabella", "Ava", "Lily", "Zoe", "Chloe", "Ella", "Grace"];
    const lastNames = ["Johnson", "Smith", "Lee", "Wang", "Garcia", "Taylor", "Brown", "Lopez", "Chen", "Clark", "Anderson", "Jackson", "Harris", "Davis", "Martinez", "White", "Hall", "Miller", "Walker", "Turner", "Allen", "Hill", "Moore", "Wright", "Evans", "Perez", "Hall", "Cooper", "Bailey", "Rogers", "Reed", "Bennett", "Cruz", "Fisher", "Diaz", "Bell", "Collins", "Wood", "Howard", "Watson", "Parker", "Stewart", "Cooper", "Morgan", "Carter", "Gomez", "Murphy", "Fletcher", "Gray", "Simmons", "Russell", "Barnes", "Duncan", "Kelly", "Gordon", "Bishop", "Frazier", "Harrison", "Fields", "Porter", "Ward", "Hudson", "Dixon", "Spencer", "Riley", "Fleming", "Black", "Hansen", "Nichols", "Tucker", "Ortega", "Vargas", "Frost", "Mendez", "Duffy", "Hogan", "Erickson", "Lambert", "Mathews", "Hobbs", "Huffman", "Hayes", "McLaughlin", "Ramirez", "Gill", "Dickson", "Barker", "Nelson", "Hammond", "Hicks", "Fleming", "Harper", "Abbott", "Carter", "Fischer", "Lindsey", "Mendez", "Owens", "Roach", "Sharp", "Torres", "Weber", "Gardner", "Mann", "Quinn", "Brewer", "Hess", "Keller", "Newton", "Pope", "Saunders", "Vaughn", "Ward", "Hudson", "Dixon", "Spencer", "Riley", "Fleming", "Black", "Hansen", "Nichols", "Tucker", "Ortega", "Vargas", "Frost", "Mendez", "Duffy", "Hogan", "Erickson", "Lambert", "Mathews", "Hobbs", "Huffman", "Hayes", "McLaughlin", "Ramirez", "Gill", "Dickson", "Barker", "Nelson", "Hammond", "Hicks"];
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];


    let email
    do {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        email = `${firstName.toLowerCase()}${lastName.toLowerCase()}@example.com`;
    } while (usedEmails.includes(email));


    const password = "Test123$";
    const words = ["apple", "banana", "chocolate", "guitar", "mountain", "ocean", "book", "sunshine", "adventure", "happiness", "cloud", "coffee", "dream", "forest", "laughter", "moon", "silence", "sparkle", "serenity", "whisper", "wonder", "breeze", "candle", "charisma", "delight", "enigma", "freedom", "harmony", "inspire", "jubilee", "lullaby", "mystic", "novel", "orchestra", "puzzle", "quasar", "rhapsody", "serendipity", "tranquil", "utopia", "vivid", "wanderlust", "zenith", "aurora", "bliss", "cascade", "dazzle", "effervescent", "fantasia", "gossamer", "halcyon", "incandescent", "juxtapose", "kaleidoscope", "labyrinth", "mellifluous", "nebula", "opulent", "quintessence", "resplendent", "seraphic", "talisman", "umbrella", "vestige", "whimsical", "xanadu", "yearning", "zephyr"];

    const getRandomWords = (words, count) => {
  const shuffledWords = words.sort(() => 0.5 - Math.random());
  return shuffledWords.slice(0, count);
};

const randomWords = getRandomWords(words, 10);
const randomBioText = randomWords.join(' ');

//console.log(randomBioText);

    const bio = randomBioText
    const age = Math.floor(Math.random() * 20) + 20; // Random age between 20 and 39
    const interests = ["Music", "Movies", "Reading", "Traveling", "Hiking", "Cooking", "Baking", "Fitness", "Yoga", "Meditation", "Gardening", "Photography", "Art", "Crafting", "DIY Projects", "Technology", "Gaming", "Sports", "Cycling", "Running", "Dancing"];
 // Update with actual URL or logic

    var random_number = Math.floor(Math.random() * 1011);
    //console.log(random_number);

    if (random_number < 100)
        random_number = "0" + random_number;

     
    let pictureUrl = "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/" + random_number + ".png";




    

const getRandomInterests = (interests, count) => {
  const shuffledInterests = interests.sort(() => 0.5 - Math.random());
  return Array.from(new Set(shuffledInterests)).slice(0, count);
};

const randomInterests = getRandomInterests(interests, 5);

//console.log(randomInterests);


    return {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        biography: bio,
        age: age,
        interests : randomInterests,
        picture: pictureUrl,
        admin: false
    };
};

// Function to generate random group data
const generateRandomGroupData = () => {
    //const groupNames = ["Adventure Seekers", "Tech Enthusiasts", "Book Club", "Fitness Fanatics", "Foodies"];
    const generateRandomGroupUsername = () => {
        const adjectives = ["Adventurous", "Techy", "Bookish", "Fit", "Foodie", "Creative", "Innovative", "Energetic", "Lively", "Spirited", "Dynamic", "Vibrant", "Ambitious", "Bold", "Daring", "Imaginative", "Clever", "Resourceful", "Witty", "Smart", "Savvy", "Curious", "Insightful", "Intrepid", "Fearless", "Determined", "Resilient", "Persistent", "Brave", "Courageous", "Friendly", "Social", "Amiable", "Kind", "Affable", "Caring", "Warm", "Supportive", "Harmonious", "Cooperative", "Enthusiastic", "Passionate", "Zealous", "Joyful", "Cheerful", "Positive", "Optimistic", "Radiant", "Upbeat", "Sunny"];
        const nouns = ["Explorers", "Enthusiasts", "Readers", "Fanatics", "Friends", "Pioneers", "Masters", "Innovators", "Trailblazers", "Achievers", "Dreamers", "Visionaries", "Creators", "Artists", "Craftsmen", "Wizards", "Maestros", "Connoisseurs", "Scholars", "Thinkers", "Adventurers", "Navigators", "Voyagers", "Wanderers", "Travelers", "Dreamweavers", "Builders", "Architects", "Engineers", "Designers", "Collaborators", "Harmony", "Alliance", "Unity", "Fellowship", "Companions", "Partners", "Allies", "Champions", "Associates", "Exploration", "Discovery", "Quest", "Journey", "Adventure", "Pursuit", "Expedition", "Mission", "Enterprise", "Campaign"];
        
        const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    
        return `${randomAdjective}${randomNoun}${Math.floor(Math.random() * 100)}`;
    };
    
    const groupName = generateRandomGroupUsername();

    const groupUsername = generateRandomGroupUsername(); // You can add logic for a unique username
    const groupDescription = "Random group description";
    /*const groupLocation = [
        -74.0320 + Math.random() * 0.01, // Random longitude within Hoboken
        40.7436 + Math.random() * 0.01,  // Random latitude within Hoboken
    ];*/

    const getRandomLocationInNewJerseyGeoJSON = () => {
        // New Jersey coordinates
        const njLongitude = -74.4057; // Approximate center of New Jersey
        const njLatitude = 40.0583;
    
        // Define a range (adjust as needed)
        const range = 0.5;
    
        // Generate random coordinates within the range
        const randomLatitude = njLatitude + (Math.random() * 2 - 1) * range;
        const randomLongitude = njLongitude + (Math.random() * 2 - 1) * range;
    
        // Create a GeoJSON Point feature
        const geojson = {
            type: "Point",
            coordinates: [randomLatitude, randomLongitude],
        };
    
        return geojson;
    };
    
      
      // Example usage
      const groupLocation = getRandomLocationInNewJerseyGeoJSON();
      //console.log(groupLocation);
      
    const genderPreference = ["M", "F", "O"][Math.floor(Math.random() * 3)]; // Random gender
    const groupPassword = "RandomPassword"; // Update with actual logic or generate a random password
    const getRandomBudget = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Usage example:
    const budget = getRandomBudget(500, 5000);

    return {
        groupName: groupName,
        groupUsername: groupUsername,
        groupDescription: groupDescription,
        groupLocation: groupLocation,
        budget: budget,
        genderPreference: genderPreference,
        groupPassword: groupPassword,
    };
};

const usedEmails = [];
const usedPhoneNumbers = [];

let user_ids = [];
// Create 50 more users
console.log("Generating user data");
for (let i = 1; i <= 60; i++) {
    let userData = generateRandomUserData();
    let phone = generateUniquePhoneNumber();
    generatedPhoneNumbers.add(phone);
    
    let admin = (i - 1) % 3 === 0;
  
    try {
        const user = await usersData.createUser(
            userData.firstName,
            userData.lastName,
            userData.email,
            userData.password,
            phone,
            userData.biography,
            userData.age,
            userData.interests,
            userData.picture,
            admin
        );
        user_ids.push(user._id);
        //console.log(user);
        //console.log(`User ${i} created: ${user._id}`);
    } catch (e) {
        console.log(e);
    }
}

// Create 20 more groups
console.log("Generating group data");
const groupSize = 3;

for (let i = 0; i < user_ids.length; i += groupSize) {
 // Replace with your actual function

    // Extract user IDs for the current group
    let userIds = user_ids.slice(i, i + groupSize);

    
    // Fetch user data for the current group
    let users = await Promise.all(userIds.map(async (userId) => {
        try {
            const user = await usersData.getUser(userId);
            return user;  // No need for toString() if getUser returns a user object
        } catch (e) {
            console.log(`Error fetching user with ID ${userId}: ${e}`);
            return null;
        }
    }));

    //console.log("Users!");
    //console.log(users);

    let groupData = generateRandomGroupData();
    //console.log("Group Data:" + groupData.groupUsername); // Log the groupData

    let getUser = await usersData.getUser(userIds[0]);
   

    const updateResult = await usersCollection.updateOne(
        { _id: new ObjectId(userIds[0]) },
        { $set: { admin: true } }
    );
    
    
    try
    {
        let group = await groupsData.create(
            groupData.groupName,
            groupData.groupUsername,
            groupData.groupDescription,
            groupData.groupLocation.coordinates,
            groupData.budget, // Update to use groupBudget property
            groupData.genderPreference, // Update to use groupGender property
            userIds,
            groupData.groupPassword
        );
    }
    catch(e)
    {
        console.log(e);
    }
    
    
    //console.log(`Group created: ${group._id}`);
    
}




// ... (remaining code)

await closeConnection();



    
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