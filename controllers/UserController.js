import { Sequelize, where } from "sequelize"
const { Op } = Sequelize;
import db from "../models"
import InsertUserRequest from "../dtos/requests/user/InsertUserRequest";
import ResponseUser from "../dtos/responses/user/ResponseUser";
import * as argon2 from "argon2";
import { UserRole } from "../constants";
import jwt from 'jsonwebtoken'
import os from 'os'
import { getAvatarURL } from "../helpers/imageHelper";
require('dotenv').config();


module.exports = {
    registerUser: async (req, res) => {
        const { email, phone, password } = req.body;
        // Validate that either email or phone is provided
        if (!email && !phone) {
            return res.status(400).json({
                message: 'Please provide email or phone number'
            })
        }
        // Check for existing user by email or phone
        const condition = {};
        if (email) condition.email = email;
        if (phone) condition.phone = phone;

        const existingUser = await db.User.findOne({ where: condition });
        if (existingUser) {
            return res.status(409).json({
                message: 'Email or phone number already exists'
            });
        }
        const hashedPassword = password ? await argon2.hash(password) : null;
        // Create user 
        const user = await db.User.create({
            ...req.body,
            email,
            phone,
            role: UserRole.User,
            password: hashedPassword,

        })
        return res.status(201).json({
            message: 'Register a user successfully',
            data: new ResponseUser(user)
        })

    },

    login: async (req, res) => {
        const { email, phone, password } = req.body;

        // Validate that either email or phone is provided
        if (!email && !phone) {
            return res.status(400).json({
                message: 'Email or phone number is required'
            });
        }

        // Check for existing user by email or phone
        const condition = {};
        if (email) condition.email = email;
        if (phone) condition.phone = phone;

        const user = await db.User.findOne({ where: condition });
        if (!user) {
            return res.status(404).json({
                message: 'Incorrect name or password '
            });
        }

        // Verify the password
        const passwordValid = password && await argon2.verify(user.password, password);
        if (!passwordValid) {
            return res.status(401).json({
                message: 'Incorrect name or password '
            });
        }

        // Generate a JWT token

        const token = jwt.sign(
            {
                id: user.id, //most important
                //role: user.role
                iat: Math.floor(Date.now() / 1000) // Thêm thời điểm tạo token 
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION }
        );


        // Return user information and token
        return res.status(200).json({
            message: 'Login successful',
            data: {
                user: new ResponseUser(user),
                token
            }
        });

    },

    updateUser: async (req, res) => {
        const { id } = req.params;
        const { name, avatar, old_password, new_password } = req.body;

        //Kiểm tra xem người dùng có đang cố gắng cập nhật thông tin của người khác hay không
        if (req.user.id != id) {
            return res.status(403).json({
                message: `Not allowed to update another user's information`
            })
        }
        const user = await db.User.findByPk(id);
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        // Update password if needed
        if (new_password && old_password) {
            // Verify old password
            const passwordValid = await argon2.verify(user.password, old_password);
            if (!passwordValid) {
                return res.status(401).json({
                    message: 'Old password is incorrect'
                });
            }

            // Hash new password
            user.password = await argon2.hash(new_password);
            user.password_changed_at = new Date(); // Cập nhật thời gian thay đổi mật khẩu
        } else if (new_password || old_password) {
            // Only one of the password fields is provided
            return res.status(400).json({
                message: 'Both new password and old password are required to password'
            });
        }

        // Update personal information
        user.name = name || user.name;      // Update name if provided
        user.avatar = avatar || user.avatar; // Update avatar if provided

        await user.save();
        //Nếu avatar không phải là một URL HTTP, nối nó với API_PREFIX để tạo URL đầy đủ
        // user.avatar = getAvatarURL(user.avatar)

        return res.status(200).json({
            message: 'User updated successfully',
            data: {
                ...user.get({ plain: true }), // Lấy thông tin người dùng và loại bỏ metadata của Sequelize
                avatar: getAvatarURL(user.avatar)
            }
        });
    },
    getUserById: async (req, res) => {
        const { id } = req.params;

        //Chỉ cho phép người dùng xem thông tin của chính họ hoặc nếu họ có vai trò là admin
        if (req.user.id != id && req.user.role !== UserRole.Admin) {
            return res.status(403).json({
                message: "Only users or administrators have access to this information "
            })
        }

        // Find user waiting db.User.findByPk(id,
        const user = await db.User.findByPk(id, {
            attributes: { exclude: ['password'] } // Remove the password field from the response
        });

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        return res.status(200).json({
            message: 'Successfully retrieved user information',
            data: {
                ...user.get({ plain: true }), // Retrieve user information and remove metadata from Sequelize
                avatar: getAvatarURL(user.avatar) // Update the avatar URL before returning it in the response
            }
        });
    },
}
