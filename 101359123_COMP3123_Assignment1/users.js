const express = require("express");
const User = require('./modules/usersSchema'); // Updated import
const { body, validationResult } = require("express-validator");

const router = express.Router();

router.post('/signup', 
    [
        body("_id").isInt().withMessage("Has to be int grrr"),
        body("userName").isString().withMessage("Has to be string"),
        body("email").isEmail().withMessage("Has to be email"),
        body("password").notEmpty().withMessage("Has to be password")
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        try {
            const newUser = new User(req.body);
            await newUser.save();
            res.status(201).json({ message: 'User created', user: newUser, status: true });
        } catch (e) {
            res.status(500).json({ MESSAGE: e.message, status: false });
        }
    }
);

router.post('/login', async (req, res) => {
    try {
        const { userName, email, password } = req.body;
        
        const found = await User.findOne({
            userName: userName,
            email: email,
            password: password,
        });

        if (found) {
            res.status(200).json({ message: 'Welcome!', user: found });
        } else {
            res.status(401).json(`${userName} doesn't exist or invalid credentials.`);
        }
    } catch (e) {
        res.status(500).json("Couldn't login user: " + e.message);
    }
});

module.exports = router;
