// type TypingIndicatorProps = { typingUsers: Record<string, string>; };

// export function TypingIndicator({ typingUsers }: TypingIndicatorProps) {

// 	const names = Object.values(typingUsers);

// 	if (names.length === 0)
// 		return null;

// 	return (
// 	<p className="has-text-grey mt-2">
// 		{names.join(", ")} typing…
// 	</p>
// 	);
// }

type TypingIndicatorProps = { isTyping: boolean };

export function TypingIndicator({ isTyping }: TypingIndicatorProps) {
	if (!isTyping)
		return null;

	return (
		<p className="has-text-grey mt-2">
			Someone is typing…
		</p>
	);
}

