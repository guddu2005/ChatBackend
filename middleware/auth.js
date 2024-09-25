const { getUser } = require("../services/auth");

const restrictToLoggedUserOnly = async (req, res, next) => {
    // console.log(req.cookies); // Log cookies for debugging
    const userUid = req.cookies?.jwt; // Access the token from cookies
    // console.log(userUid);

    if (!userUid) {
        return res.status(401).json({ error: "Token is not found" });
    }
    try {
        // Retrieve the user details based on userUid
        const user = await getUser(userUid);
        console.log(user);
        if (!user) {
            return res.status(403).json({ message: "Not Authorized" });
        }
        req.user = user; // Attach user information to the request object
        next(); 
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const checkAuth =async(req, res, next) =>{
    const userUid = req.cookies?.jwt;
    
    try {
        if (userUid) {
            // Retrieve the user details based on userUid
            const user = await getUser(userUid);
            
            // If user is found, attach it to req.user, otherwise set null
            req.user = user || null;
        } else {
            req.user = null;
        }
    } catch (err) {
        console.error('Error in checkAuth: ', err);
        req.user = null; // If there's an error, set user to null
    }
    
    next(); // Proceed to the next middleware or route handler
}

module.exports = {
    restrictToLoggedUserOnly,
    checkAuth
};
