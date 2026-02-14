import { useState } from "react";
import { useTyping } from "../hooks/useTyping";

//SEND MESSAGE
type ChatInputProps = {
	onSend: (content: string) => void;
	chatId: string | undefined;
}

export function ChatInput({ onSend, chatId }: ChatInputProps) {

	const [content, setContent] = useState("");
	const { emitTypingEffect } = useTyping(chatId);

	const send = () => {
		if (content.trim() === "")
			return;
		onSend(content);
		setContent("");
	};

	return (
		<div className="field has-addons">
			<div className="control is-expanded">
			<input
				className="input"
				type="text"
				placeholder="Write a message..."
				value={content}
				onChange={(e) => {
					setContent(e.target.value);
					emitTypingEffect();
				}}
			/>
			</div>

			<div className="control">
			<button className="button is-dark" onClick={send}>
				Send
			</button>
			</div>
		</div>
	);
}
