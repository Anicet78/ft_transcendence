import Type, { type Static } from 'typebox';

export const UserSchema = Type.Object({
	id: Type.String(),
	firstname: Type.String(),
	lastname: Type.String(),
	username: Type.String(),
	email: Type.String({ format: 'email' }),
	passwordHash: Type.String()
});

export type User = Static<typeof UserSchema>
