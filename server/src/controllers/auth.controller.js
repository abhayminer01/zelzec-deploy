const User = require("../models/user.model");
const bcrypt = require('bcrypt');

const checkAuth = async (req, res) => {
    try {
        if(!req.session || !req.session.user) {
            return res.status(400).json({ success : false, message : "Not Authenticated" });
        }

        res.status(200).json({ success : true, message : "User is Authenticated" });
    } catch (error) {
        res.status(500).json({ success : false, err : error });
    }
}

const registerUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password) {
            return res.status(400).json({ success : false, message : "All Fields are required!" });
        }

        let user = await User.findOne({ email });
        if(user) {
            return res.status(400).json({ success : false, message : "User already exist" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user = await User.create({
            email : email,
            password : hashedPassword
        });

        req.session.user = { id : user._id };
        res.status(200).json({ success : true });

    } catch (error) {
        res.status(500).json({ success : false, err : error });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password) {
            return res.status(400).json({ success : false, message : "All Fields are required!" });
        }

        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({ success : false, message : "User not found" });
        }

        const compare = await bcrypt.compare(password, user.password);
        if(!compare) {
            return res.status(400).json({ success : false, message : "password missmatch" });
        }

        req.session.user = { id : user._id };
        res.status(200).json({ success : true });
    } catch (error) {
        res.status(500).json({ success : false, err : error });
    }
}

module.exports = {
    checkAuth,
    registerUser,
    loginUser
}