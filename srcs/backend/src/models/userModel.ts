import Type, { type Static } from 'typebox'

export const UserSchema = Type.Object({
	id: Type.String(),
	email: Type.String({ format: 'email' }),
	username: Type.String(),
	passwordHash: Type.String()
})

export type User = Static<typeof UserSchema>
