// Importing required modules
const express = require('express'); // Import Express.js module
const db = require('./config/connection'); // Import database connection module
const routes = require('./routes'); // Import routes module

// Setting current working directory
const cwd = process.cwd();

// Setting up the port for the server to listen on, defaulting to 3001 if not specified
const PORT = process.env.PORT || 3001;

// Creating an Express application instance
const app = express();

// Middleware to parse incoming request bodies as JSON
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.json()); // Parse JSON bodies

// Using defined routes
app.use(routes);

// Event listener for when the database connection is established
db.once('open', () => {
  // Starting the server to listen on the specified port
  app.listen(PORT, () => {
    // Logging a message indicating that the server is running
    console.log(`Server running on port ${PORT}!`);
  });
});