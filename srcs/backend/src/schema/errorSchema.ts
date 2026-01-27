import Type from 'typebox';

export const AppErrorSchema = Type.Object({
	error: Type.String(),
	code: Type.Optional(Type.String())
});

export class AppError extends Error {
	public readonly statusCode: number;

	constructor(message: string, statusCode: number) {
		super(message);

		this.statusCode = statusCode;
		this.name = 'AppError';

		Object.setPrototypeOf(this, AppError.prototype);
	}
}
