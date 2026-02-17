import { useState } from "react";

//SEND MESSAGE
export function ChatInput({ onSend }) {

	const [content, setContent] = useState("");

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
				onChange={(e) => setContent(e.target.value)}
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
