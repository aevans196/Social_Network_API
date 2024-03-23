const { Thought } = require('../models');

module.exports = {
    // Get all thoughts
    async getAllThoughts(req, res) {
        try {
            // Retrieve all thoughts from the database and exclude the '__v' field
            const thoughts = await Thought.find().select('-__v');
            res.json(thoughts); // Send the retrieved thoughts as a JSON response
        } catch (err) {
            res.status(500).json(err); // Handle server errors
        }
    },

    // Get a single thought
    async getOneThought(req, res) {
        try {
            // Find a single thought by its id, populate its 'reactions' field, and exclude the '__v' field
            const thought = await Thought.findOne({ _id: req.params.thoughtId }).populate('reactions').select('-__v');

            if (!thought) {
                return res.status(404).json({ message: 'No thought was found!' }); // Handle not found scenario
            }

            res.json(thought); // Send the retrieved thought as a JSON response
        } catch (err) {
            res.status(500).json(err); // Handle server errors
        }
    },

    // Create a thought
    async createThought(req, res) {
        try {
            // Create a new thought using the request body and save it to the database
            const thought = await Thought.create(req.body);
            res.json(thought); // Send the created thought as a JSON response
        } catch (err) {
            console.log(err);
            return res.status(500).json(err); // Handle server errors
        }
    },

    // Update a thought
    async updateThought(req, res) {
        try {
            // Find and update a thought by its id, apply validation rules, and return the updated thought
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $set: req.body },
                { runValidators: true, new: true }
            );

            if (!thought) {
                res.status(404).json({ message: 'No thought found with this id!' }); // Handle not found scenario
            }

            res.json(thought); // Send the updated thought as a JSON response
        } catch (err) {
            res.status(500).json(err); // Handle server errors
        }
    },

    // Delete a thought
    async deleteThought(req, res) {
        try {
            // Find and delete a thought by its id, and delete its associated reactions
            const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });

            if (!thought) {
                res.status(404).json({ message: 'No thought found with this id!' }); // Handle not found scenario
            }

            await Thought.deleteMany({ _id: { $in: thought.reactions } });
            res.json({ message: 'Thought and its reactions were deleted' }); // Send a success message
        } catch (err) {
            res.status(500).json(err); // Handle server errors
        }
    },

    // Add a reaction
    async addReaction(req, res) {
        try {
            // Add a reaction to a thought by its id
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $addToSet: { reactions: req.body } },
                { runValidators: true, new: true }
            );

            if (!thought) {
                res.status(404).json({ message: 'No thought found with this id!' }); // Handle not found scenario
            }

            res.json(thought); // Send the updated thought as a JSON response
        } catch (err) {
            res.status(500).json(err); // Handle server errors
        }
    },

    // Delete a reaction
    async deleteReaction(req, res) {
        try {
            // Delete a reaction from a thought by its id
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: { _id: req.params.reactionId } } },
                { runValidators: true, new: true }
            );

            if (!thought) {
                res.status(404).json({ message: 'No thought found with this id!' }); // Handle not found scenario
            }

            res.json(thought); // Send the updated thought as a JSON response
        } catch (err) {
            res.status(500).json(err); // Handle server errors
        }
    },
};