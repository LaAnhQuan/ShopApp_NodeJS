import db from '../models';
import * as argon2 from 'argon2';
import { UserRole } from '../constants';
import jwt from 'jsonwebtoken';
import { generateOTP, sendOTP } from '../utils/email';
import ResponseUser from '../dtos/responses/user/ResponseUser';
import { Op } from 'sequelize';
import { date } from 'joi';

module.exports = {
    // Gửi OTP đến email để đăng ký
    register: async (req, res) => {
        const { email, password, name, phone } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const t = await db.sequelize.transaction();
        try {
            // Kiểm tra user đã tồn tại và xác thực chưa
            let user = await db.User.findOne({ where: { email }, transaction: t });

            if (user && user.is_verified) {
                await t.rollback();
                return res.status(409).json({ message: 'Email already registered and verified' });
            }

            // Nếu chưa có user, tạo mới
            if (!user) {
                user = await db.User.create({
                    email,
                    name: name,
                    phone: phone || null,
                    password: await argon2.hash(password),
                    role: UserRole.User,
                    is_verified: false
                }, { transaction: t });
            }

            // Xoá OTP cũ nếu có
            await db.EmailVerification.destroy({ where: { email }, transaction: t });

            // Tạo OTP mới
            const otp = generateOTP();
            const expires_at = new Date(Date.now() + 2 * 60 * 1000); // 2 phút

            await db.EmailVerification.create({
                email,
                otp,
                expires_at
            }, { transaction: t });

            await t.commit();

            await sendOTP(email, otp);

            return res.status(200).json({
                message: 'OTP has been sent to your email. Please verify to activate your account.',
                data: new ResponseUser(user)

            });

        } catch (error) {
            await t.rollback();
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },


    // Xác thực OTP và tạo tài khoản
    verifyOTP: async (req, res) => {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }

        const record = await db.EmailVerification.findOne({ where: { email, otp } });
        if (!record) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        const now = new Date();
        const expires = new Date(record.expires_at);
        if (now > expires) {
            return res.status(400).json({ message: 'OTP has expired' });
        }

        const t = await db.sequelize.transaction();
        try {
            const user = await db.User.findOne({ where: { email }, transaction: t });

            if (!user) {
                await t.rollback();
                return res.status(404).json({ message: 'User not found' });
            }

            if (user.is_verified) {
                await t.rollback();
                return res.status(400).json({ message: 'Account already verified' });
            }

            await db.User.update(
                { is_verified: true },
                { where: { email }, transaction: t }
            );

            await db.EmailVerification.destroy({ where: { id: record.id }, transaction: t });

            await t.commit();

            return res.status(200).json({
                message: 'Account verified successfully',
                data: new ResponseUser(user)
            });

        } catch (error) {
            await t.rollback();
            console.error(error);
            return res.status(500).json({ message: 'Failed to verify account' });
        }
    },


    resendOTP: async (req, res) => {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await db.User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ message: `Email wasn't registered` });
        }

        if (user.is_verified) {
            return res.status(400).json({ message: 'Account is already verified. No need to resend OTP.' });
        }

        const otp = generateOTP();

        const t = await db.sequelize.transaction();
        try {
            // Xoá OTP cũ
            await db.EmailVerification.destroy({ where: { email } }, { transaction: t });

            // Tạo mới OTP
            const expires_at = new Date(Date.now() + 2 * 60 * 1000);
            await db.EmailVerification.create({
                email,
                otp,
                expires_at
            }, { transaction: t });

            await t.commit();

            await sendOTP(email, otp);

            return res.status(200).json({
                message: 'A new OTP has been sent to your email.',
                data: {
                    email
                }
            });

        } catch (error) {
            await t.rollback();
            console.error('Error during resend OTP:', error);
            return res.status(500).json({ message: 'Failed to resend OTP' });
        }
    },




    // Đăng nhập
    login: async (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await db.User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.is_verified) {
            return res.status(403).json({
                message: 'Account not verified. Please verify OTP.',
            });
        }

        const valid = await argon2.verify(user.password, password);
        if (!valid) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION || '1d' }
        );

        return res.status(200).json({
            message: 'Login successful',
            data: {
                user: new ResponseUser(user),
                token
            }
        });
    },

};
