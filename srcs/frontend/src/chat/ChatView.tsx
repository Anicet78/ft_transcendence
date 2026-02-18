import { useParams } from "react-router"
import { useChat } from "./ChatContext";
import { useChatMessages } from "./hooks/useChatMessages";
import { useChatMutations } from "./hooks/useChatMutations";
import { useEffect } from "react";
import { Box } from "@allxsmith/bestax-bulma";
import { MessageList } from "./components/ChatMessageList";
import { ChatInput } from "./components/ChatInput";
import { useChatSocket } from "./hooks/useChatSocket";
import { TypingIndicator } from "./components/ChatTypingIndicator";
import { useChatRoleMutation } from "./hooks/useChatRoleMutations";
import { GroupChatInvitations } from "./components/InviteToGroupChat";
import { useMutation } from "@tanstack/react-query";
import api from "../serverApi";
import { useAuth } from "../auth/AuthContext";

// const ChatView = () => {
const ChatView = ({ chatId: propChatId, onClose }: {
	chatId?: string;
	onClose?: () => void;
}) => {
	const params = useParams();
	const chatId = propChatId ?? params.chatId;

	//const { chatId } = useParams();
	//const { chat, role, permissions, typingUsers, joinChat } = useChat();
	const { chat, role, permissions, isTyping, joinChat, leaveChat } = useChat();

	const { messages, isLoading, isError } = useChatMessages(chatId);
	const mutations = useChatMutations(chatId);
	const roleMutation = useChatRoleMutation(chatId);

	useChatSocket(chatId);

	const { user } = useAuth();
	const kickMutation = useMutation({
		mutationFn: async (memberId: string) => {
		await api.post(`/group/${chatId}/kick/${memberId}`);
		},
		onSuccess: () => {
		// Refresh chat info so the kicked member disappears
		joinChat(chatId!);
		}
	});

	const quitMutation = useMutation({
		mutationFn: async () => {
			await api.post(`/group/${chatId}/quit`);
			},
			onSuccess: () => {
			// Refresh chat info so the kicked member disappears
			leaveChat();
			window.location.href = "/chat/list";
		}
	});

	const disbandMutation = useMutation({
		mutationFn: async () => {
			await api.post(`/group/${chatId}/disband`);
			},
			onSuccess: () => {
			// Refresh chat info so the kicked member disappears
			leaveChat();
			window.location.href = "/chat/list";
		}
	});


	//join new chat add each chatId change
	useEffect(() => {
		if (chatId)
			joinChat(chatId);
	}, [chatId]);


	if (isLoading || !chat)
		return <div>Loading chat...</div>;

	if (isError)
		return <div>Error loading chat</div>;

	return (
		<Box m="4" p="6" bgColor="white">
			<h1 className="title">
				{chat.chatName || (chat.chatType === "private" ? "Private chat" : "Group chat")}
			</h1>

			{/* MEMBERS */}
			<div className="mb-4">
			<strong>Members:</strong>
			<ul>
				{chat.members.map(m => (
				<li key={m.chatMemberId} className="mb-1">
					{m.user.username} — <em>{m.role}</em>

					{permissions.canChangeRoles && m.user.appUserId !== user?.id && (
					<select
						className="ml-2"
						value={m.role}
						onChange={(e) =>
							roleMutation.mutate({
								memberId: m.user.appUserId,
								role: e.target.value
							})
						}
					>
						<option value="owner">Owner</option>
						<option value="admin">Admin</option>
						<option value="moderator">Moderator</option>
						<option value="writer">Writer</option>
						<option value="member">Member</option>
					</select>
					)}


					{permissions.canKick && m.user.appUserId !== user?.id && (
						<button
							className="button is-danger is-light is-small ml-2"
							onClick={() => kickMutation.mutate(m.user.appUserId)}
						>
							Kick
						</button>
					)}
				</li>
				))}
			</ul>
			</div>

			{/* QUIT CHAT */}
			{chat.chatType === "group" && role !== "owner" && (
				<button
					className="button is-warning is-small mb-3"
					onClick={() => quitMutation.mutate()}
				>
					Quit Group Chat
				</button>
			)}

			{/* DISBAND CHAT */}
			{chat.chatType === "group" && role === "owner" && (
				<button
					className="button is-danger is-small mb-3"
					onClick={() => disbandMutation.mutate()}
				>
					Disband Group Chat
				</button>
			)}

			{/* INVITE TO JOIN GROUP CHAT */}
			{chat.chatType === "group" &&
				<GroupChatInvitations
					chatId={chat.chatId}
					existingMembers={chat.members} 
				/>
			}

			{/* LIST MESSAGES */}
			<MessageList
				messages={messages}
				role={role}
				permissions={permissions}
				onEdit={mutations.editMessageMutation.mutate}
				onModerate={mutations.moderateMessageMutation.mutate}
				onDelete={mutations.deleteMessageMutation.mutate}
				onRestore={mutations.restoreMessageMutation.mutate}
			/>

			{/* <TypingIndicator typingUsers={typingUsers} /> */}
			<TypingIndicator isTyping={isTyping} />

			<ChatInput
				chatId={chatId}
				onSend={mutations.sendMessageMutation.mutate}
			/>

			{onClose && (
				<button
					className="button is-light is-small mb-3"
					onClick={onClose}
				>
				Back to chats
				</button>
			)}

		</Box>
	);
};
export default ChatView;
