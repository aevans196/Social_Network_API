const connection = require('../config/connection'); // to connect to database
const { User, Thought } = require('../models');

connection.on('error', (err) => err); // handle errors after connecting (listen for events on the connection)

const userData = [
    {
        userName: 'Alysa',
        email: 'alysa@email.com',
    },
    {
        userName: 'Mark',
        email: 'mark@email.com' 
    },
    {
        userName: 'Patriece',
        email: 'patriece@email.com' 
    },
    {
        userName: 'Alex',
        email: 'alex@email.com' 
    }
];

const thoughtTexts = [ 
    'That thing is cool.',
    'I need a vacation!',
    'The weekend needs to hurry!',
    'The weather is changing.',
    'School is cool.',
    'That movie is cool.'
];

const reactionTexts = [
    'Well said!',
    'No way!',
    'LOL',
    'Not feeling it.',
    'Disagree',
    'Love it!',
    'Boooooo'
];

// Function to retrieve a random item from an array
const getRandomArrItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Function to generate random reactions for each thought
const getReactions = () => {
    const results = []; // Array to store reactions
    for(let i = 0; i < 2; i++){
        results.push({
            reactionBody: getRandomArrItem(reactionTexts), // Random reaction text
            userName: getRandomArrItem(userData).userName, // Random user
        });
    };
    return results; // Returns an array of 2 reactions with random texts from random users
}

connection.once('open', async () => {

    console.log("Database connection successful. Ready to seed!");

    // Deleting collections to avoid duplicate data

    let userCheck = await connection.db.listCollections({ name: 'users' }).toArray();
    if (userCheck.length) {
      await connection.dropCollection('users');
    }

    let thoughtCheck = await connection.db.listCollections({ name: 'thoughts' }).toArray();
    if (thoughtCheck.length) {
      await connection.dropCollection('thoughts');
    }

    // Creating Thoughts
    const thoughts = []; // Array to hold thoughts

    for (let i = 0; i < thoughtTexts.length; i++) { 
        const thoughtText = thoughtTexts[i];
        const userName = getRandomArrItem(userData).userName; // Random user
        const reactions = getReactions(); // Random reactions

        thoughts.push({
            thoughtText,
            userName,
            reactions,
        });
    }

    // Adding thoughts to the collection
    const thoughtData = await Thought.insertMany(thoughts);

    // Creating Users

    const users = []; // Array to hold user data

    for (let i = 0; i < userData.length; i++) { 
        const userName = userData[i].userName;
        const email = userData[i].email;
        const thoughts = [];
        for (let j = 0; j < thoughtData.length; j++ ) {
            if (userName == thoughtData[j].userName) { 
                thoughts.push(thoughtData[j]._id);
            }
        }
        users.push({
            userName,
            email,
            thoughts,
        });
    }; 
    
    // Inserting user data into the collection
    const allUserData = await User.insertMany(users);

    // Establishing friendships between users

    for(let i = 0; i < (await allUserData).length; i++ ) { 

        const friends = [];
        let randomNumFriends = Math.floor(Math.random() * userData.length); 

        for(let j = 0; j < randomNumFriends; j++){
            if (allUserData[i].userName != userData[j].userName){ 
                friends.push(allUserData[j]._id);
            }
        };

        // Updating the user's friends list

       await User.findOneAndUpdate({_id: allUserData[i]._id}, {friends: friends} )

    }; 

    console.log("Seeding successful!");
    process.exit(0); // Exiting
});