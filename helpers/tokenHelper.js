import jwt from 'jsonwebtoken';
import db from '../models'; // Adjust this path to your models directory

const JWT_SECRET = process.env.JWT_SECRET;

// Function to verify and extract user info from token
export async function getUserFromToken(req, res) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new Error('No token provided');
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await db.User.findByPk(decoded.id);

        if (!user) {
            throw new Error('User not found');
        }

        if (user.password_changed_at &&
            decoded.iat < new Date(user.password_changed_at).getTime() / 1000) {
            throw new Error('Token is invalid because the password was changed');
        }

        return user;
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
}
