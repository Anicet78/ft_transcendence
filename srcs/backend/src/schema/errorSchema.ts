import http from 'http';
import Type from 'typebox';

export const AppErrorSchema = Type.Object({
	error: Type.String(),
	code: Type.Optional(Type.Number()),
	message: Type.Optional(Type.String())
});

export class AppError extends Error {
	public readonly error: string;
	public readonly statusCode: number;

	constructor(message: string, statusCode: number = 500) {
		super(message);

		this.error = http.STATUS_CODES[statusCode] || 'Internal Server Error';
		this.statusCode = statusCode;
		this.name = 'AppError';

		Object.setPrototypeOf(this, AppError.prototype);
	}
}
