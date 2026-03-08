import { useState } from "react";
import { useTyping } from "../hooks/useTyping";
import { Button } from "@allxsmith/bestax-bulma";

//SEND MESSAGE
type ChatInputProps = {
	onSend: (data: {
		content: string;
		type?: "text" | "game_invite" | "game_started"
	}) => void;
	chatId: string | undefined;
}

export function ChatInput({ onSend, chatId }: ChatInputProps) {

	const [content, setContent] = useState("");
	const { emitTypingEffect } = useTyping(chatId);

	const send = () => {
		if (content.trim() === "")
			return;
		onSend({content});
		setContent("");
	};

	return (
		<div className="field has-addons input-msg">
			<p className="control is-expanded">
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
			</p>

			<p className="control">
			<Button size="medium" onClick={send}>
				<i className="fas fa-paper-plane"></i>
			</Button>
			</p>
		</div>
	);
}
