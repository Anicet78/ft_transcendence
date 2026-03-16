import { useEffect, useRef } from "react";
import { useChat } from "../ChatContext";
import { useChatMessages, useChatReadState } from "../hooks/useChatMessages";
import { useMessagesMutations } from "../hooks/useMessagesMutations";
import { ChatInput } from "./ChatInput";
import { MessageList } from "./ChatMessageList";
import { TypingIndicator } from "./ChatTypingIndicator";
import { useSocket } from "../../socket/SocketContext";
import { useChatSocket } from "../hooks/useChatSocket";

export function ChatRoom({ chatId }: {chatId: string}) {

	useChatSocket(chatId);
	const {chat, permissions, role, isTyping} = useChat();
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

	// read receipt
	useEffect(() => {
		if (!messages.length || !socket)
			return;

		const last = messages[messages.length - 1];

		socket?.emit("chat_read", {
			chatId,
			lastMessageId: last.messageId
		});

	}, [messages , socket, chatId ]);

	return (
		<>
			<div style={{
				flex: 1,
				minHeight: 0,
				height: "50vh",
				overflowY: "auto",
				paddingRight: "8px",
				position: "relative"
			}}
			>
				<MessageList
					messages={messages}
					readState={readState}
					chatType={chat?.chatType}
					memberCount={chat?.members?.length ?? 0}
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

			{permissions.canWrite ? (
				<ChatInput
					chatId={chatId}
					onSend={mutations.sendMessageMutation.mutate}
					/>
				) : (
				<p style={{ opacity: 0.6 }}>
					You don't have permission to write in this chat.
				</p>
			)}
		</>
	);
}
