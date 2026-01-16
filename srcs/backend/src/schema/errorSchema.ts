import Type, { type Static } from 'typebox';

export const AppErrorSchema = Type.Object({
	error: Type.String(),
	code: Type.Optional(Type.String())
});

export type User = Static<typeof AppErrorSchema>
