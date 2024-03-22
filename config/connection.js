// Importing the necessary modules from Mongoose library
const { connect, connection } = require('mongoose');

// Defining the MongoDB connection string
const connectionString = 'mongodb://127.0.0.1:27017/socialNetworkDB';

// Establishing the connection to the MongoDB database using the connection string
connect(connectionString);

// Exporting the connection object for use in other parts of the application
module.exports = connection;