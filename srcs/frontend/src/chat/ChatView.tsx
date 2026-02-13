import { Link, useParams } from "react-router";
import type { GetResponse } from "../types/GetType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../serverApi";
import { Box } from "@allxsmith/bestax-bulma";
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useSocket } from "../socket/SocketContext";

type ChatInfoResponse = GetResponse<"/chat/{chatId}/info", "get">;
type ChatMessagesResponse = GetResponse<"/chat/{chatId}/messages", "get">;


const ChatView = () => {
	const { chatId } = useParams();
	const { user } = useAuth();

	const queryClient = useQueryClient();
	const [content, setContent] = useState("");

	const socket = useSocket();

	useEffect(() => {
		if (!socket || !chatId)
			return;

		//SEND
		const onMessageCreated = (message: any) => {
			queryClient.setQueryData(["chat-messages", chatId], (cache: any[] | undefined) => {
				if (!cache)
					return [message];
				return [...cache, message];
			});
		};

		//EDIT
		const onMessageEdited = (message: any) => {
			queryClient.setQueryData(["chat-messages", chatId], (cache: any[] = []) => {
				return cache.map(msg => msg.messageId === message.messageId ? message : msg);
			});
		};

		//DELETE
		const onMessageDeleted = (message: any) => {
			queryClient.setQueryData(["chat-messages", chatId], (cache: any[] = []) => {
				return cache.map(msg => msg.messageId === message.messageId 
					? {...msg, status: "deleted", deletedAt: message.deletedAt }
					: msg
				);
				// cache.filter(msg => msg.messageId !== message.messageId);
			});
		};


		//MODERATED
		const onMessageModerated = (message: any) => {
			queryClient.setQueryData(["chat-messages", chatId], (cache: any[] = []) => {
				return cache.map(msg => msg.messageId === message.messageId 
					? {...msg, status: "moderated", deletedAt: message.deletedAt }
					: msg
				);
			});
		};

		//RESTORE
		const onMessageRestored = (message: any) => {
			queryClient.setQueryData(["chat-messages", chatId], (cache: any[] = []) => {
				return cache.map(msg => msg.messageId === message.messageId 
					? {...msg, status: "posted"}
					: msg
				);
			});
		};

		socket.on("chat_message_created", onMessageCreated);
		socket.on("chat_message_edited", onMessageEdited);
		socket.on("chat_message_deleted", onMessageDeleted);
		socket.on("chat_message_moderated", onMessageModerated);
		socket.on("chat_message_restored", onMessageRestored);


		return () => {
			socket.off("chat_message_created", onMessageCreated);
			socket.off("chat_message_edited", onMessageEdited);
			socket.off("chat_message_deleted", onMessageDeleted);
			socket.off("chat_message_moderated", onMessageModerated);
			socket.off("chat_message_restored", onMessageRestored);
		}

	}, [socket, chatId, queryClient]);


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

	//SEND MESSAGE MUTATION
	const sendMessageMutation = useMutation({
		mutationFn: async () => {
			return api.post(`/chat/${chatId}`, { content });
		},
		onSuccess: () => {
			setContent("");
			//queryClient.invalidateQueries({ queryKey: ["chat-messages", chatId] });
		}
	});

	//DELETE MESSAGE (only by message author, admin use MODERATE action)
	const deleteMessageMutation = useMutation({
		mutationFn: async (messageId: string) => {
			return api.delete(`/chat/${chatId}/message/${messageId}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["chat-messages", chatId] });
		}
	});

	//EDIT MESSAGE
	const editMessageMutation = useMutation({
		mutationFn: async ({ messageId, content }: { messageId: string; content: string }) => {
			return api.patch(`/chat/${chatId}/message/${messageId}/edit`, {content});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["chat-messages", chatId] });
		}
	});

	//MODERATE MESSAGE
	const moderateMessageMutation = useMutation({
		mutationFn: async (messageId: string) => {
			return api.patch(`/chat/${chatId}/message/${messageId}/moderate`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["chat-messages", chatId] });
		}
	});

	//RESTORE MESSAGE
	const restoreMessageMutation = useMutation({
		mutationFn: async (messageId: string) => {
			return api.patch(`/chat/${chatId}/message/${messageId}/restore`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["chat-messages", chatId] });
		}
	});

	if (chatInfoQuery.isLoading || messagesQuery.isLoading)
		return <div>Loading chat...</div>;

	if (chatInfoQuery.isError || messagesQuery.isError)
		return <div>Error loading chat</div>;

	const chat = chatInfoQuery.data!;
	const messages =(messagesQuery.data ?? []).filter( msg => msg.status !== "deleted" );//
	const myMemberEntry = chat.members.find(mbr => mbr.user.appUserId === user?.id);
	const myRole = myMemberEntry?.role!; // "owner" | "admin" | "moderator" | "writer" | "member"
	const isModerator = ["owner", "admin", "moderator"].includes(myRole);

	return (
		<Box m="4" p="6" bgColor="white">
			<h1 className="title">
			{chat.chatName || (chat.chatType === "private" ? "Private chat" : "Group chat")}
			</h1>

			<h2 className="subtitle">Members</h2>
			<ul>
			{chat.members.map(mbr => (
				<li key={mbr.chatMemberId}>
				{mbr.user.username} - {mbr.role}
				</li>
			))}
			</ul>

			<hr />

			<h2 className="subtitle">Messages</h2>

			{/*messages.length === 0 && <p>No messages yet.</p>*/}

			{messages.map(msg => (
			<Box key={msg.messageId} className="box" m="2" p="3">
				<strong>
					<Link
						to={`/profile/${encodeURIComponent(msg.author.username)}`}
						aria-label={`Open ${msg.author.username} profile`}
						className="has-text-dark"
					> 
						{msg.author.username}
					</Link>
				</strong>
				<p>{msg.status === "moderated" ? "Message moderated" : msg.content}</p>
				<small>{msg.postedAt ? new Date(msg.postedAt).toLocaleString() : ""}</small>

				{/* AUTHOR ONLY ACTIONS */}
				{msg.userId === user?.id && (
					<>
						{/* EDIT */}
						<button
							className="button is-warning is-small mt-2"
							onClick={() => {
								const newContent = prompt("Edit message:", msg.content);
								if (newContent) {
									editMessageMutation.mutate({ messageId: msg.messageId, content: newContent});
								}
							}}
						>
							Edit
						</button>

						{/* DELETE */}
						<button
							className="button is-danger is-small mt-2"
							onClick={() => deleteMessageMutation.mutate(msg.messageId)}
						>
							Delete
						</button>
					</>
				)}

				{/* MODERATORS AND + ACTIONS */}
				
					{/* MODERATE */}
					{isModerator && msg.status !== "moderated" && (
						<button
							className="button is-danger is-small mt-2 ml-2"
							onClick={() => moderateMessageMutation.mutate(msg.messageId)}
						>
							Moderate
						</button>
					)}
					{/* RESTORE */}
					{isModerator && msg.status === "moderated" && (
						<button
							className="button is-success is-small mt-2 ml-2"
							onClick={() => restoreMessageMutation.mutate(msg.messageId)}
						>
							Restore
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
