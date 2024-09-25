const Conversation = require("../models/conversation.model");
const Message = require("../models/message.model");

const { getReceiverSocketId , io} = require("../socket/socket");

const sendMessage = async (req, res) => {
    console.log(req.user);
    const { message } = req.body;
    const { receiverId } = req.params; // Ensure this is correctly coming from the route parameters
    console.log(message);
    console.log( receiverId)
    const senderId = req.user._id;

    if (!message || !receiverId) {
        return res.status(400).json({ error: "Message and receiverId are required" });
    }

    try {
        // Check if a conversation exists between the sender and receiver
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        // If no conversation exists, create a new one
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }

        // Create a new message object
        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        });

        // Push the new message ID to the conversation's messages array
        conversation.messages.push(newMessage._id);

        // Save both the conversation and the new message in parallel
        await Promise.all([conversation.save(), newMessage.save()]);

        // SOCKET IO FUNCTIONALITY WILL GO HERE
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            // Emit the new message event to the receiver's socket
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);

    } catch (err) {
        console.log("Error in sendMessage controller: ", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
};


const getMessage=async( req ,res)=>{
    const {userToChatId} = req.params;
    // console.log(userToChatId);
    const senderId= req.user._id;
    // console.log(senderId)
    try {
        const conversation = await Conversation.findOne({
            participants:{$all:[senderId , userToChatId]},
        }).populate("messages");
        console.log(conversation);
        if(!conversation) return res.status(200).json([]);
        const messages = conversation.messages;
        return res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
    }
};


module.exports ={
    sendMessage , getMessage
}