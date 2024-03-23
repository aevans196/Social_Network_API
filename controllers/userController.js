const { User, Thought } = require('../models');
const { ObjectId } = require('mongoose').Types;

module.exports = {
    // Get all Users
    async getAllUsers(req, res) {
        try {
            // Retrieve all users from the database and exclude the '__v' field
            const users = await User.find().select('-__v');
            res.json(users); // Send the retrieved users as a JSON response
        } catch (err) {
            res.status(500).json(err); // Handle server errors
        }
    },

    // Get a single user
    async getOneUser(req, res) {
        try {
            // Find a single user by its id, populate its 'thoughts' and 'friends' fields, and exclude the '__v' field
            const user = await User.findOne({ _id: req.params.userId }).populate('thoughts').populate('friends').select('-__v');

            if (!user) {
                return res.status(404).json({ message: 'User not found!' }); // Handle not found scenario
            }

            res.json(user); // Send the retrieved user as a JSON response
        } catch (err) {
            res.status(500).json(err); // Handle server errors
        }
    },

    // Create a user
    async createUser(req, res) {
        try {
            // Create a new user using the request body and save it to the database
            const user = await User.create(req.body);
            res.json(user); // Send the created user as a JSON response
        } catch (err) {
            console.log(err);
            return res.status(500).json(err); // Handle server errors
        }
    },

    // Update a user
    async updateUser(req, res) {
        try {
            // Find and update a user by its id, apply validation rules, and return the updated user
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $set: req.body },
                { runValidators: true, new: true }
            );

            if (!user) {
                res.status(404).json({ message: 'No user found with this id!' }); // Handle not found scenario
            }

            res.json(user); // Send the updated user as a JSON response
        } catch (err) {
            res.status(500).json(err); // Handle server errors
        }
    },

    // Delete a user
    async deleteUser(req, res) {
        try {
            // Find and delete a user by its id, and delete their associated thoughts
            const user = await User.findOneAndDelete({ _id: req.params.userId });

            if (!user) {
                res.status(404).json({ message: 'No user found with this id!' }); // Handle not found scenario
            }

            await User.deleteMany({ _id: { $in: user.thoughts } });
            res.json({ message: 'User and their thoughts are deleted' }); // Send a success message
        } catch (err) {
            res.status(500).json(err); // Handle server errors
        }
    },

    // Add a friend
    async addFriend(req, res) {
        try {
            // Add a friend to a user by their id
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $addToSet: { friends: req.params.friendId } },
                { runValidators: true, new: true }
            );

            if (!user) {
                res.status(404).json({ message: 'No user found with this id!' }); // Handle not found scenario
            }

            res.json(user); // Send the updated user as a JSON response
        } catch (err) {
            res.status(500).json(err); // Handle server errors
        }
    },

    // Delete a friend
    async deleteFriend(req, res) {
        try {
            // Delete a friend from a user by their id
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $pull: { friends: req.params.friendId } },
                { new: true }
            );

            if (!user) {
                res.status(404).json({ message: 'No user found with this id!' }); // Handle not found scenario
            }

            res.json(user); // Send the updated user as a JSON response
        } catch (err) {
            res.status(500).json(err); // Handle server errors
        }
    },
};