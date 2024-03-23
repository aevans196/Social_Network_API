// Importing necessary modules from mongoose library
const { Schema, model } = require('mongoose');
const reactionSchema = require('./reaction'); // Import the reaction schema

// Define the schema for creating a Thought model
const thoughtSchema = new Schema(
    {
        // Text content of the thought
        thoughtText: {
            type: String, // String type
            required: true, // Mandatory field
            minLength: 1, // Minimum length allowed is 1 character
            maxLength: 280, // Maximum length allowed is 280 characters
        },
        // Timestamp for when the thought was created
        createdAt: {
            type: Date, // Date type
            default: Date.now, // Default value is the current date/time
        },
        // Name of the user who posted the thought
        userName: {
            type: String, // String type
            required: true, // Mandatory field
        },
        // Array of nested documents representing reactions, defined by the reactionSchema
        reactions: [reactionSchema], // array of nested documents created using the reactionSchema
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

// Define a virtual field to get the count of reactions for a thought
thoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length; // Return the length of the reactions array
});

// Initialize the Thought model using the thoughtSchema
const Thought = model('thought', thoughtSchema);

module.exports = Thought; // Export the Thought model for use in other modules
