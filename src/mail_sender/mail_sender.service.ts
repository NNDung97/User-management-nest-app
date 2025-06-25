import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailSenderService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT ?? '0', 10),
            secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }

    async sendMail(to: string, subject: string, text: string, html?: string): Promise<void> {
        const mailOptions: nodemailer.SendMailOptions = {
            from: `"Admin" <${process.env.SMTP_USER}>`, // sender address
            to, // list of receivers
            subject, // Subject line
            text, // plain text body
            html, // html body
        };

        try {
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Error sending email:', error);
            throw new Error('Failed to send email');
        }
    }

    async sendOTP(to: string, otp: string): Promise<void> {
        const subject = 'Your OTP Code to change password';
        const text = `Your OTP code is: ${otp}`;
        const html = `<p>Your OTP code is: <strong>${otp}</strong></p>`;
        
        await this.sendMail(to, subject, text, html);
    }
}
