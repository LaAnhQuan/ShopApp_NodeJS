// googleController.js
const { OAuth2Client } = require('google-auth-library');
const db = require('../../models'); // Import Sequelize models
const jwt = require('jsonwebtoken');
import { UserRole } from "../../constants/UserRole";

require('dotenv').config();

const client = new OAuth2Client(process.env.GOOGLE_APP_CLIENT_ID);

exports.authenticateGoogle = async (req, res) => {
    const { idToken } = req.body; // Nhận idToken từ React Native
    if (!idToken) {
        return res.status(400).json({ success: false, error: 'No idToken provided' });
    }

    try {
        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: process.env.GOOGLE_APP_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture: avatar } = payload; // Lấy thông tin từ payload

        // Kiểm tra xem người dùng đã tồn tại trong database chưa
        let user = await db.User.findOne({ where: { email } });
        if (!user) {
            // Nếu không tồn tại, tạo người dùng mới
            user = await db.User.create({
                email,
                name,
                avatar,
                role: UserRole.User,
                password: null, // Google không cung cấp password, để null hoặc hash một giá trị mặc định
            });
        } else {
            // Cập nhật thông tin nếu cần (ví dụ: avatar)
            if (avatar && user.avatar !== avatar) {
                user.avatar = avatar;
                await user.save();
            }
        }

        // Tạo JWT token
        const token = jwt.sign(
            { id: user.id, iat: Math.floor(Date.now() / 1000) },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION }
        );

        // Trả về thông tin người dùng và token
        return res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    avatar: user.avatar,
                    role: user.role,
                },
                token,
            },
        });
    } catch (error) {
        console.error('Google auth error:', error);
        return res.status(401).json({ success: false, error: 'Invalid token' });
    }
};