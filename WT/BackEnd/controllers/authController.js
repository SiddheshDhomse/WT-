const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

// @desc Login
// @route POST /auth
// @access Public
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body; // Get email and password from request body

    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const foundUser = await User.findOne({ email }).exec();

    if (!foundUser) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const match = await bcrypt.compare(password, foundUser.password);

    if (!match) return res.status(401).json({ message: 'Unauthorized' });

    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "email": foundUser.email, // Use email instead of username
                "subscription": foundUser.subscription
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '5m' }
    );

    // Create refresh token
    const refreshToken = jwt.sign(
        { "email": foundUser.email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '15m' }
    );

    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ accessToken }); // Send the access token
});


// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh = (req, res) => {
    const cookies = req.cookies

    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })

            const foundUser = await User.findOne({ username: decoded.username }).exec()

            if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "email": foundUser.email,
                        "subscription": foundUser.subscription
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '5m' }
            )

            res.json({ accessToken })
        })
    )
}

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
const logout = (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) //No content
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.json({ message: 'Cookie cleared' })
}


// @desc Get Access Token
// @route POST /auth/getAccessToken
// @access Public
const getAccessToken = asyncHandler(async (req, res) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const foundUser = await User.findOne({ email: decoded.UserInfo.email }).exec();

        if (!foundUser) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        res.json({
            message: `Token is valid`,
            email: foundUser.email,
            subscription: foundUser.subscription,
        });
    });
});

module.exports = {
    login,
    refresh,
    logout,
    getAccessToken
}