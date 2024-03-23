// Importing necessary modules from mongoose library
const { Schema, model } = require('mongoose');

// Function to validate email addresses using regular expression
var validateEmail = function(email) {
    return /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(email);
};

// Schema to define the structure of a User Model
const userSchema = new Schema(
    {
        // Username of the user
        userName: {
            type: String, // Data type: String
            unique: true, // Username must be unique
            required: true, // Username is required
            trim: true, // Removes leading and trailing spaces from the string
        },
        // Email of the user
        email: {
            type: String, // Data type: String
            required: true, // Email is required
            unique: true, // Email must be unique
            validate: [validateEmail, 'Please use a valid email address!'], // Validator function to check for valid email format
        },
        // Array of ObjectIds referencing thoughts associated with the user
        thoughts: [
            {
                type: Schema.Types.ObjectId, // Data type: ObjectId
                ref: 'thought', // Reference to the 'thought' model
            },
        ],
        // Array of ObjectIds referencing friends associated with the user
        friends: [
            {
                type: Schema.Types.ObjectId, // Data type: ObjectId
                ref: 'user', // Reference to the 'user' model
            },
        ],
    },
    {
        // Define toJSON configuration
        toJSON: {
            virtuals: true, // Include virtual fields in the JSON representation
            getters: true, // Include getters in the JSON representation
        },
        // Disable virtual id
        id: false,
    }
);

// Define a virtual field to get the count of friends for a user
userSchema.virtual('friendCount').get(function() {
    return this.friends.length; // Return the length of the friends array
});

// Initialize the User model
const User = model('user', userSchema); // Create the User model
module.exports = User; // Export the User model for use in other modules