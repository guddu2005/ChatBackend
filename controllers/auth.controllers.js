const User = require("../models/user.model");

const getUsersForSidebar = async(req, res)=>{
    const loggedInUserId = req.user._id;
    try {
        const filtereduser = await User.find({_id:{$ne:loggedInUserId}}).select("-password");
        return res.status(200).json(filtereduser);
    } catch (err) {
        console.error("Error in getUsersForSidebar: ", err.message);
		res.status(500).json({ error: "Internal server error" });
    }    
};

module.exports={
    getUsersForSidebar,
}