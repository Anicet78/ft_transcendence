import nodemailer from 'nodemailer';
import { AppError } from '../schema/errorSchema.js';

const mails = new Map<string, { email: string, expiresAt: Date }>();

export const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
	port: Number(process.env.SMTP_PORT),
	secure: false,
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS
	}
});

export async function sendResetPasswordEmail(to: string, token: string, resetLink: string) {
	mails.set(token, { email: to, expiresAt: new Date(Date.now() + 15 * 60 * 1000) });

	return await transporter.sendMail({
		from: '"Support" <support@transcendence.com>',
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
	mails.forEach(({ expiresAt }, token) => {
		if (expiresAt < new Date())
			mails.delete(token);
	});

	const storedToken = mails.get(token);

	if (!storedToken)
		throw new AppError('Invalid or expired token', 404);

	mails.delete(token);

	return storedToken.email;
}