import Type, { type Static } from 'typebox';

export const RegionSchema = Type.Union([
	Type.Literal('EU'),
	Type.Literal('NA'),
	Type.Literal('SAM'),
	Type.Literal('MENA'),
	Type.Literal('OCE'),
	Type.Literal('APAC'),
	Type.Literal('SSA')
]);

export const UserSchema = Type.Object({
	id: Type.String(),
	firstname: Type.String(),
	lastname: Type.String(),
	username: Type.String(),
	region: Type.Optional(RegionSchema),
	email: Type.String({ format: 'email' }),
	passwordHash: Type.String()
});

export type User = Static<typeof UserSchema>
