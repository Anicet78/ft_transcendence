import { useEffect, useRef } from "react";
import { useChat } from "../ChatContext";
import { useChatMessages, useChatReadState } from "../hooks/useChatMessages";
import { useMessagesMutations } from "../hooks/useMessagesMutations";
import { ChatInput } from "./ChatInput";
import { MessageList } from "./ChatMessageList";
import { TypingIndicator } from "./ChatTypingIndicator";
import { useSocket } from "../../socket/SocketContext";

export function ChatRoom({ chatId }: {chatId: string}) {

	const {permissions, role, isTyping} = useChat();
	const {messages} = useChatMessages(chatId);
	const mutations = useMessagesMutations(chatId);
	const bottomRef = useRef<HTMLDivElement>(null);

	const { data: readState } = useChatReadState(chatId);

	const socket = useSocket();

	useEffect(() => {
		const element = bottomRef.current;
		if (!element)
			return;

		element.parentElement!.scrollTo({
			top: element.parentElement!.scrollHeight,
			behavior: "smooth"
		});

	}, [messages]);

	useEffect(() => {
		if (!messages.length || !socket)
			return;

		const last = messages[messages.length - 1];

		socket?.emit("chat_read", {
			chatId,
			lastMessageId: last.messageId
		});

	}, [messages , socket, chatId ]);

	// // Emit read receipt
	// useEffect(() => {
	// 	if (!messages.length)
	// 		return;
		
	// 	const lastMessage = messages[messages.length - 1];
		
	// 	socket?.emit("chat_receipt", {
	// 		chatId,
	// 		messageId: lastMessage.messageId
	// 	});
	// }, [messages, chatId, socket]); 

	return (
		<>
			<div style={{
				height: "60vh",
				overflowY: "auto",
				paddingRight: "8px",
				position: "relative"
			}}
			>
				<MessageList
					messages={messages}
					readState={readState}
					role={role}
					permissions={permissions}
					onEdit={mutations.editMessageMutation.mutate}
					onModerate={mutations.moderateMessageMutation.mutate}
					onDelete={mutations.deleteMessageMutation.mutate}
					onRestore={mutations.restoreMessageMutation.mutate}
				/>

				<div ref={bottomRef} />
			</div>

			{/* <TypingIndicator typingUsers={typingUsers} /> */}
			<TypingIndicator isTyping={isTyping} />

			<ChatInput
				chatId={chatId}
				onSend={mutations.sendMessageMutation.mutate}
			/>
		</>
	);
}