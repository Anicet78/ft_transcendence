import Type, { type Static } from 'typebox';

export const UserSchema = Type.Object({
	id: Type.String(),
	firstname: Type.String(),
	lastname: Type.String(),
	username: Type.String(),
	email: Type.String({ format: 'email' }),
	region: Type.String(), //need to check, added to compile
	passwordHash: Type.String()
});

export type User = Static<typeof UserSchema>
