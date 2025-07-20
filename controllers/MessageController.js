import { Model, Sequelize } from "sequelize";
const { Op } = Sequelize;
import db from "../models";
import { getAvatarURL } from "../helpers/imageHelper";
import MessageStatus from "../constants/MessageStatus";

module.exports = {
    getMessages: async (req, res) => {
        const { userId, search = '' } = req.query; // Lấy userId để lọc tin nhắn

        let whereClause = {};
        if (search.trim() !== '') {
            whereClause = {
                [Op.or]: [
                    { message: { [Op.like]: `%${search}%` } }
                ]
            };
        }
        if (userId) {
            whereClause[Op.or] = [
                { sender_id: userId },
                { receiver_id: userId }
            ];
        }

        // Fetch all messages related to userId with a max limit
        const messages = await db.messages.findAll({
            where: whereClause,
            include: [
                {
                    model: db.user_status,
                    as: 'sender_status',
                    attributes: ['is_online', 'last_seen', 'avatar']
                },
                {
                    model: db.user_status,
                    as: 'receiver_status',
                    attributes: ['is_online', 'last_seen', 'avatar']
                }
            ],
            order: [['created_at', 'DESC']], // Sắp xếp theo thời gian mới nhất
            limit: 1000 // Giới hạn tối đa để tránh tải quá nhiều (có thể điều chỉnh)
        });

        if (!messages.length) {
            return res.status(200).json({
                message: 'No messages found',
                data: []
            });
        }

        // Send the response
        return res.status(200).json({
            message: 'Get messages successfully',
            data: messages.map(message => ({
                ...message.get({ plain: true }),
                sender_avatar: getAvatarURL(message.sender_status?.avatar),
                receiver_avatar: getAvatarURL(message.receiver_status?.avatar)
            }))
        });
    },

    getMessageById: async (req, res) => {
        const { id } = req.params;
        const message = await db.messages.findByPk(id, {
            include: [
                {
                    model: db.user_status,
                    as: 'sender_status',
                    attributes: ['is_online', 'last_seen', 'avatar']
                },
                {
                    model: db.user_status,
                    as: 'receiver_status',
                    attributes: ['is_online', 'last_seen', 'avatar']
                }
            ]
        });

        if (!message) {
            return res.status(404).json({
                message: 'Message not found'
            });
        }
        return res.status(200).json({
            message: 'Get a message successfully',
            data: {
                ...message.get({ plain: true }),
                sender_avatar: getAvatarURL(message.sender_status?.avatar),
                receiver_avatar: getAvatarURL(message.receiver_status?.avatar)
            }
        });
    },

    createMessage: async (req, res) => {
        const transaction = await db.sequelize.transaction();
        try {
            const { sender_id, receiver_id, message, status = MessageStatus.SENT } = req.body;
            const newMessage = await db.Message.create({
                sender_id,
                receiver_id,
                message,
                status
            }, { transaction });

            await transaction.commit();

            res.status(201).json({
                message: 'Message created successfully!',
                data: {
                    ...newMessage.get({ plain: true })
                }
            });
        } catch (error) {
            await transaction.rollback();
            res.status(500).json({
                message: 'Unable to create message',
                error: error.message
            });
        }
    },

    updateMessage: async (req, res) => {
        const { id } = req.params;
        const { message, status } = req.body;

        const existingMessage = await db.messages.findOne({
            where: { id }
        });

        if (!existingMessage) {
            return res.status(404).json({
                message: 'Message not found'
            });
        }

        const updatedMessage = await db.messages.update(
            { message, status, updated_at: new Date() },
            { where: { id } }
        );

        if (updatedMessage[0] > 0) {
            return res.status(200).json({
                message: 'Message updated successfully'
            });
        }
        return res.status(500).json({
            message: 'Failed to update message'
        });
    },

    deleteMessage: async (req, res) => {
        const { id } = req.params;
        const transaction = await db.sequelize.transaction();

        try {
            const deleted = await db.messages.destroy({
                where: { id },
                transaction
            });

            if (deleted) {
                await transaction.commit();
                return res.status(200).json({
                    message: 'Message deleted successfully'
                });
            } else {
                await transaction.rollback();
                return res.status(404).json({
                    message: 'Message not found'
                });
            }
        } catch (error) {
            await transaction.rollback();
            return res.status(500).json({
                message: 'An error occurred while deleting the message',
                error: error.message
            });
        }
    }
};