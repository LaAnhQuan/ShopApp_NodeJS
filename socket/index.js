import MessageStatus from "../constants/MessageStatus";
import db from "../models";

module.exports = function socketHandler(io) {
    io.on("connection", (socket) => {
        console.log("Client connected: " + socket.id);

        socket.on("joinRoom", async ({ userId, recipientId, lastReceivedMessageId }) => {
            if (!userId || !recipientId) return;

            const roomId = [userId, recipientId].sort().join("-");
            socket.join(roomId);
            socket.roomId = roomId;
            socket.userId = userId;

            console.log(`User ${userId} joined room ${roomId}`);

            try {
                const messageQuery = {
                    where: {
                        sender_id: recipientId,
                        receiver_id: userId,
                    },
                    order: [["created_at", "ASC"]],
                };

                // Lấy các tin nhắn mới hơn lastReceivedMessageId nếu có
                if (lastReceivedMessageId) {
                    messageQuery.where.id = { [Op.gt]: lastReceivedMessageId };
                }

                const missedMessages = await db.Message.findAll(messageQuery);

                missedMessages.forEach((msg) => {
                    socket.emit("message", {
                        senderId: msg.sender_id,
                        recipientId: msg.receiver_id,
                        message: msg.message,
                        roomId,
                        messageId: msg.id,
                        status: msg.status,
                        timestamp: msg.created_at, // Thêm thời gian gửi
                    });
                });
            } catch (err) {
                console.error(" Error fetching missed messages:", err);
            }
        });


        socket.on("sendMessage", async ({ recipientId, message }) => {
            const userId = socket.userId;
            if (!userId || !recipientId || !message) return;

            const roomId = socket.roomId || [userId, recipientId].sort().join("-");

            try {
                const newMessage = await db.Message.create({
                    sender_id: userId,
                    receiver_id: recipientId,
                    message,
                    status: MessageStatus.SENT,
                    created_at: new Date(),
                });

                io.to(roomId).emit("message", {
                    senderId: userId,
                    recipientId,
                    message,
                    roomId,
                    messageId: newMessage.id,
                    createdAt: newMessage.created_at,
                    status: newMessage.status,
                });

                console.log(`User ${userId} sent message to ${roomId}: ${message}`);
            } catch (error) {
                console.error(" Error sending message:", error);
                socket.emit("error", { message: "Lỗi gửi tin nhắn" });
            }
        });


        socket.on("disconnect", () => {
            console.log("Client disconnected: " + socket.id);
        });
    });
};
