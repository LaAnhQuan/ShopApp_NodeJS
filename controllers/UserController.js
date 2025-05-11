import { Sequelize, where } from "sequelize"
const { Op } = Sequelize;
import db from "../models"
import InsertUserRequest from "../dtos/requests/user/InsertUserRequest";
import ResponseUser from "../dtos/responses/user/ResponseUser";
import * as argon2 from "argon2";
import { UserRole } from "../constants";
import jwt from 'jsonwebtoken'
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
