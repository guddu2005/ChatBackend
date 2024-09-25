// signup, login, and logout controllers
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const { setUser } = require("../services/auth");

const signup = async (req, res) => {
    const { fullName, username, password, confirmPassword, email, gender } = req.body;
    console.log(req.body);
    try {
        if (password != confirmPassword) {
            return res.status(400).json({ error: "Password didn't match" });
        }

        // Checking if the username already exists
        const user = await User.findOne({ username });
        if (user) return res.status(400).json({ error: "Username Already exists" });

        // Hashing the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Setting profile pic based on gender
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User({
            email,
            fullName,
            username,
            password: hashedPassword,
            gender,
            profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
        });

        // if (newUser) {
            // const token = setUser(newUser);  // Generate the token
            // res.cookie("gid", token);        // Set the token in a cookie
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                email: newUser.email,
                fullName: newUser.fullName,
                username: newUser.username,
                profilePic: newUser.profilePic,
            });
        // } else {
            // res.status(400).json({ error: "Invalid user data" });
        // }
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ error: "Invalid username or password" });

        // Compare the provided password with the hashed one in DB
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid username or password" });
        }

        const token = setUser(user);
        return res.cookie('token', token, { httpOnly: true, secure: true }).status(200).json({
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic,
            token:token
        });
             
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const logout = async (req, res) => {
    console.log(req);
    try {
        res.clearCookie('jwt');  // Clear the cookie with the token
        res.status(200).json({ message: "Logout Successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    signup,
    login,
    logout
};
