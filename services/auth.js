const jwt = require("jsonwebtoken");
require("dotenv").config();

const sessionTime = '1h';  // Session expiration time for JWT
// const secret="guddu";
const secret=process.env.SECRET;
function setUser(user) {
    // console.log(process.env.SECRET);
    const payload = {
        _id: user._id,
        email: user.email,
    };
    return jwt.sign(payload,secret, { expiresIn: sessionTime });
}

function getUser(token) {
    if (!token) return null;
    console.log('get',token)
    try {
        const decoded = jwt.verify(token, secret); 
        console.log("Decoded Token:", decoded);
        return decoded;
    } catch (err) {
        console.log("JWT verification error:", err.message);
        return null;
    }
}

module.exports = {
    getUser,
    setUser
};
