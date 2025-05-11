import jwt from 'jsonwebtoken';
import db from '../models'; // Adjust this path to your models directory

const JWT_SECRET = process.env.JWT_SECRET;

// Function to verify and extract user info from token
export async function getUserFromToken(req, res) {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Token not provided' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await db.User.findByPk(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return user; // Return user info if valid
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token', error });
        return null;
    }
}
