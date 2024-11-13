const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');

const getUserInfo = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const user = await User.findOne({ email }).lean();
        if (!user) {
            return res.status(404).json({ message: 'No User Found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error fetching user info:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

const addUser = asyncHandler(async (req, res) => {
    const { userName, password, email } = req.body;

    if (!userName || !password || !email) {
        return res.status(400).json({ message: 'User, password, and email are required' });
    }


    const duplicate = await User.findOne({ email }).lean().exec();
    if (duplicate) {
        return res.status(400).json({ message: 'User already exists with that email address' });
    }

    const hashedPwd = await bcrypt.hash(password, 10);

    const newUser = { username: userName, password: hashedPwd, email };

    const user = await User.create(newUser);

    if (user) {
        res.status(201).json({ message: `New user ${userName} created` });
    } else {
        res.status(400).json({ message: 'Invalid user data received' });
    }
});

const updateUser = asyncHandler(async (req, res) => {
    const { email, subscription } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    // Find user by email
    const user = await User.findOne({ email }).exec();
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Update the subscription field
    user.subscription = subscription;

    // Save the updated user document
    const updatedUser = await user.save();

    // Respond with a success message or the updated user data
    res.json({ message: `${updatedUser.username} updated`, user: updatedUser });
});



const deleteUser = asyncHandler(async (req, res) => {
    const { userName, email } = req.body;

    if (!userName || !email) {
        return res.status(400).json({ message: 'User and email are required' });
    }

    const user = await User.findOne({ email }).exec();
    if (!user || user.username !== userName) {
        return res.status(400).json({ message: 'User not found' });
    }

    await user.deleteOne();

    res.json({ message: `User ${userName} deleted` });
});

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        res.json({ message: 'Login successful', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = {
    getUserInfo,
    addUser,
    updateUser,
    deleteUser,
    loginUser
};
