export function extractRoomId(content: string): string | null {
	const match = content.match(/\/join\/([^\/\s]+)/);
	return match ? match[1]! : null;
}