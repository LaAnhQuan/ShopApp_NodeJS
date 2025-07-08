import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export function generateOTP(length = 6) {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6 chữ số
}

export async function sendOTP(toEmail, otp) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: 'Mã OTP xác thực',
        text: `Mã OTP của bạn là: ${otp}. Mã này sẽ hết hạn trong 2 phút.`
    });
}
