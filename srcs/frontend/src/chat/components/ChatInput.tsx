import { useState } from "react";
import { useTyping } from "../hooks/useTyping";
import toast from "../../Notifications";

//SEND MESSAGE
type ChatInputProps = {
	onSend: (data: {
		content: string;
		type?: "text" | "game_invite" | "game_started"
	}) => void;
	chatId: string | undefined;
}

const MAX_MESSAGE_LENGTH = 2000;

export function ChatInput({ onSend, chatId }: ChatInputProps) {

	const [content, setContent] = useState("");
	const { emitTypingEffect } = useTyping(chatId);

	const send = () => {
		const text = content.trim();

		if (!text)
			return;

		if (text.length > MAX_MESSAGE_LENGTH) {
			toast({ title: "Error", message: "Your message can't contain more than 2000 characters.", type: "is-danger"})
			return;
		}

		if (!chatId)
			return;

		onSend({content: text});
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
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						e.preventDefault();
						send();
					}
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
