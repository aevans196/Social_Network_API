// Importing necessary modules from mongoose library
const { Schema, Types } = require('mongoose');

// Define the schema for reactions
const reactionSchema = new Schema(
    {
        // Unique identifier for the reaction
        reactionId: {
            type: Schema.Types.ObjectId, // MongoDB ObjectID type
            default: () => new Types.ObjectId(), // Default value generator
        },
        // Body of the reaction
        reactionBody: {
            type: String, // String type
            required: true, // Mandatory field
            maxLength: 280, // Maximum length allowed
        },
        // Name of the user who posted the reaction
        userName: {
            type: String, // String type
            required: true, // Mandatory field
        },
        // Timestamp for when the reaction was created
        createdAt: {
            type: Date, // Date type
            default: Date.now, // Default value is the current date/time
        },
    },
    {
        // Define toJSON configuration
        toJSON: {
            getters: true, // Include getters in the JSON representation
        },
        // Disable virtual id
        id: false,
    }
);

module.exports = reactionSchema; // Export the reaction schema for use in other modules
