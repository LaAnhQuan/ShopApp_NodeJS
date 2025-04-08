import { Sequelize, where } from "sequelize"
const { Op } = Sequelize;
import db from "../models"
import InsertUserRequest from "../dtos/requests/user/InsertUserRequest";
import ResponseUser from "../dtos/responses/user/ResponseUser";
import * as argon2 from "argon2";

module.exports = {
    insertUser: async (req, res) => {
        const existingUser = await db.User.findOne({ where: { email: req.body.email } });
        if (existingUser) {
            return res.status(409).json({ // 409 Conflict is often used for duplicate resource creation attempts
                message: 'Email already exists'
            });
        }
        const hashedPassword = await argon2.hash(req.body.password)
        const user = await db.User.create({
            ...req.body,
            password: hashedPassword
        })
        if (user) {
            return res.status(201).json({
                message: 'Insert a user successfully',
                data: new ResponseUser(user)
            })
        } else {
            return res.status(400).json({
                message: 'Failed to insert user',
                data: user
            })
        }

    },

    updateUser: async (req, res) => {
        const userId = req.params.id;
        const updatedUser = await db.User.update(req.body, {
            where: { id: userId }
        });

        if (updatedUser[0] > 0) {  // Sequelize `update` returns an array where the first element is the number of affected rows
            return res.status(200).json({
                message: 'User updated successfully',
            });
        } else {
            return res.status(404).json({
                message: 'User not found'
            });
        }
    },
}
