const msgModel = require("../models/msgModel");

module.exports.addMessage = async (req, res, next) => {
    try {
        const { from, to, message } = req.body;
        const data = await msgModel.create({
            message: { text: message },
            users: [from, to],
            sender: from,
        })
        if (data) {
            res.json({ msg: "Message Added Successfully" })
        } else {
            res.json({ msg: "Failed to add Message to Database" })
        }
    } catch (er) {
        next(er);
    }
}
module.exports.getAllMessages = async (req, res, next) => {
    try {
        const { from, to } = req.body;
        const messages = await msgModel.find({
            users: {
                $all: [from, to]
            },
        })
            .sort({
                updatedAt: 1
            })
        const projectMessages = messages.map((msg) => {
            return {
                fromSelf: msg.sender.toString() === from,
                message: msg.message.text,
            }
        }
        )
        res.json(projectMessages)
    } catch (er) {
        next(er);
    }
}