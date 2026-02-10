import { useParams } from "react-router";
import type { GetResponse } from "../types/GetType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../serverApi";
import { Box } from "@allxsmith/bestax-bulma";
import { useState } from "react";

type ChatInfoResponse = GetResponse<"/chat/:chatId/info", "get">;
type ChatMessagesResponse = GetResponse<"/chat/:chatId/messages", "get">;

const ChatView = () => {
	const { chatId } = useParams();

	//GET CHAT INFO
	const chatInfoQuery = useQuery({
		queryKey: ["chat-info", chatId],
		queryFn: async () => {
			const res = await api.get<ChatInfoResponse>(`/chat/${chatId}/info`);
			return res.data;
		},
		enabled: !!chatId
	});

	//GET CHAT MESSAGES
	const messagesQuery = useQuery({
		queryKey: ["chat-messages", chatId],
		queryFn: async () => {
			const res = await api.get<ChatMessagesResponse>(`/chat/${chatId}/messages`);
			return res.data;
		},
		enabled: !!chatId
	});

	const queryClient = useQueryClient();
	const [content, setContent] = useState("");

	// SEND MESSAGE MUTATION
	const sendMessageMutation = useMutation({
		mutationFn: async () => {
			return api.post(`/chat/${chatId}`, { content });
		},
		onSuccess: () => {
			setContent("");
			queryClient.invalidateQueries({ queryKey: ["chat-messages", chatId] });
		}
	});

	//DELETE MESSAGE
	const deleteMessageMutation = useMutation({
		mutationFn: async (messageId: string) => {
			return api.delete(`/chat/${messageId}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["chat-messages", chatId] });
		}
	});



	if (chatInfoQuery.isLoading || messagesQuery.isLoading)
		return <div>Loading chat...</div>;

	if (chatInfoQuery.isError || messagesQuery.isError)
		return <div>Error loading chat</div>;

	const chat = chatInfoQuery.data;
	const messages = messagesQuery.data;

	return (
	<Box m="4" p="6" bgColor="white">
		<h1 className="title">
		{chat.chatName || (chat.chatType === "private" ? "Private chat" : "Group chat")}
		</h1>

		<h2 className="subtitle">Members</h2>
		<ul>
		{chat.members.map(mbr => (
			<li key={mbr.chatMemberId}>
			{mbr.user.username} — {mbr.role}
			</li>
		))}
		</ul>

		<hr />

		<h2 className="subtitle">Messages</h2>

		{messages.length === 0 && <p>No messages yet.</p>}

		{messages.map(msg => (
		<Box key={msg.messageId} className="box" m="2" p="3">
			<strong>{msg.author.username}</strong>
			<p>{msg.content}</p>
			<small>
			{msg.postedAt ? new Date(msg.postedAt).toLocaleString() : ""}
			</small>

			{/* delete button, only if user is the author (but now only owner */}
			{msg.userId === chatInfoQuery.data.createdBy?.appUserId && (
				<button
					className="button is-danger is-small mt-2"
					onClick={() => deleteMessageMutation.mutate(msg.messageId)}
				>
					Delete
				</button>
			)}

		</Box>
		
		))}

		<hr />

		<h2 className="subtitle">Send a message</h2>

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
			<button
				className="button is-dark"
				onClick={() => sendMessageMutation.mutate()}
				disabled={sendMessageMutation.isPending || content.trim() === ""}
			>
				Send
			</button>
			</div>
		</div>
	</Box>
	);
};

export default ChatView;
