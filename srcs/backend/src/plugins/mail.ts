import nodemailer from 'nodemailer';
import { AppError } from '../schema/errorSchema.js';

const mails = new Map<string, { email: string, expiresAt: Date }>();

export const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS
	}
});

export async function sendResetPasswordEmail(to: string, token: string, resetLink: string) {
	mails.set(token, { email: to, expiresAt: new Date(Date.now() + 15 * 60 * 1000) });

	return await transporter.sendMail({
		from: `"Support" ${process.env.SMTP_USER}`,
		to,
		subject: 'Password reset',
		html: `
		<p>You asked to reset your password.</p>
		<p>
			<a href="${resetLink}">
				Click here to reset
			</a>
		</p>
		<p>This link expires in 15 minutes.</p>
		`
	});
}

export function verifyResetToken(token: string): string {
	mails.forEach(({ expiresAt }, tok) => {
		if (expiresAt < new Date()) {
			mails.delete(tok);
		}
	});

	const storedToken = mails.get(token);

	if (!storedToken)
		throw new AppError('Invalid or expired token', 404);

	mails.delete(token);

	return storedToken.email;
}