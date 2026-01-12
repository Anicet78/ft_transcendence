import argon2 from "argon2";

// Hash a password to store it in the DB
export async function hashPassword(password: string): Promise<string> {
	const hash = await argon2.hash(password, {
		type: argon2.argon2id,
		memoryCost: 2 ** 16,	// 64 MB
		timeCost: 3,			// iteration amount
		parallelism: 1			// thread amount
	});

	return hash;
}

// Check if the password is the same as the one stored with its hash
export async function verifyPassword(hash: string, password: string): Promise<boolean> {
	return argon2.verify(hash, password);
}
