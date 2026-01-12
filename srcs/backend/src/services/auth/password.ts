import argon2 from "argon2";

/**
 * Hash a password
 * @param {string} password User password
 * @returns {Promise<string>} Promise of the hashed password
 */
export async function hashPassword(password: string): Promise<string> {
	const hash = await argon2.hash(password, {
		type: argon2.argon2id,
		memoryCost: 2 ** 16,	// 64 MB
		timeCost: 3,			// iteration amount
		parallelism: 1			// thread amount
	});

	return hash;
}

/**
 * Check if the password is the same as the one stored with its hash
 * @param {string} hash User hashed password from DB
 * @param {string} password User input password
 * @returns {Promise<boolean>} Promise of the password check
 */
export async function verifyPassword(hash: string, password: string): Promise<boolean> {
	return argon2.verify(hash, password);
}
