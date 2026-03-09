import { createContext, useContext, useEffect, useState } from "react";
import type { GetResponse } from "../types/GetType";
import { useSocket } from "../socket/SocketContext";
import { useAuth } from "../auth/AuthContext";
// import api from "../serverApi";
import toast from "../Notifications";
import { useRoom } from "../home/RoomContext";
import { useQueryClient } from "@tanstack/react-query";

type ChatInfoResponse = GetResponse<"/chat/{chatId}/info", "get">;

type ChatContextValue = {
	chat: ChatInfoResponse | null;
	role: string | null;
	permissions: Record<string, boolean>;
	isTyping: boolean;
	// blockedUsersId: string;
	// bannedUsersId: string; //need to handle banned users
	// typingUsers: Record<string, string>;
	joinChat: (chatId: string) => void;
	leaveChat: () => void;
};

const ChatContext = createContext<ChatContextValue | null>(null);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {

	const queryClient = useQueryClient();
	const socket = useSocket();
	const { user } = useAuth();
	const { room } = useRoom()!;

	const [chat, setChat] = useState<ChatInfoResponse | null>(null);
	//const [typingUsers, setTypingUsers] = useState<Record<string, string>>({});
	const [isTyping, setIsTyping] = useState(false);

	const role = chat?.members.find(mbr => mbr.user.appUserId === user?.id)?.role ?? null;

	const permissions = {
		canInvite: ["owner", "admin", "moderator", "writer", "member"].includes(role ?? ""),
		canWrite: ["owner", "admin", "moderator", "writer"].includes(role ?? ""),
		canModerate: ["owner", "admin", "moderator"].includes(role ?? ""),
		canBan: ["owner", "admin"].includes(role ?? ""),
		canKick: ["owner", "admin"].includes(role ?? ""),
		canChangeRoles: ["owner", "admin"].includes(role ?? ""),
		canRename: ["owner"].includes(role ?? "")
	}

	const joinChat = async(chatId: string) => {

		//GET CHAT INFO
		//const res = await api.get<ChatInfoResponse>(`/chat/${chatId}/info`);
		//setChat(res.data);

		if (socket)
			socket.emit("join_chat", { chatId });
	};

	const leaveChat = async() => {
		if (socket && chat?.chatId)
			socket.emit("leave_chat", {chatId: chat.chatId});

		setChat(null);
		//setTypingUsers({});
		setIsTyping(false);
	};

	useEffect(() => {

		const unsubscribe = queryClient.getQueryCache().subscribe(event => {

			if (event?.query?.queryKey?.[0] !== "chat-info")
				return;

			const data = event.query.state.data;

			if (data)
				setChat(data);

		});

		return unsubscribe;

	}, [queryClient]);

	useEffect(() => {

		if (!socket)
			return;

		socket.on("notification", (payload) => {

			if (payload.senderId === user?.id)// ignore yourself
				return;

			//user has been added to chat group notif
			if (payload.type === "added_to_group" && payload.senderId !== user?.id) {
				toast({
					title: `${payload.creatorName} added you to "${payload.chatName}" group chat`,
					type: "is-info"
				});
			}

			//user has received an invite to join group
			else if (payload.type === "invite_received" && payload.senderId !== user?.id) {
				toast({
					title: "Chat invite received!",
					message: `${payload.senderName} invites you to join "${payload.chatName}" group chat`,
					type: "is-info"
				});
			}

			//user's sent chat invite has been accepted
			else if (payload.type === "invite_accepted" && payload.senderId !== user?.id) {
				toast({
					title: `${payload.chatName}`,
					message: `${payload.receiverName} accepted your invitation to join this chat`,
					type: "is-success"
				});
			}

			// ***** send to all chat members *****//
			//user has received an invite to join game session from group chat
			else if (payload.type === "game_invite" && payload.senderId !== user?.id) {
				toast({
					title: `${payload.chatName}`,
					message: `${payload.senderUsername} send you a game invitation 🎮`,
					type: "is-info"
				});
			}

			//a group chat user is a member of has launched a game
			else if (payload.type === "game_started" && payload.roomId !== room?.roomId) {
				toast({
					title: `${payload.chatName}`,
					message: "Your fellow companions started a game session 🚀",
					type: "is-success"
				});
			}

			else if (payload.type === "chat_member_kicked") {
				toast({
					title: `You've been kicked from group chat`,
					type: "is-warning"
				});
			}
		});

		socket.on("chat_typing", ({ userId }) => {
			if (userId === user?.id)// ignore yourself
				return;

			setIsTyping(true);

			setTimeout(() => {
				setIsTyping(false);
			}, 3000);
		});

		return () => {
			socket.off("chat_typing");
			socket.off("notification");
		};

	}, [socket, user]);

	return (
		//<ChatContext.Provider value= {{chat, role, permissions, typingUsers, joinChat, leaveChat }}></ChatContext.Provider>
		<ChatContext.Provider value= {{chat, role, permissions, isTyping, joinChat, leaveChat }}>
			{children}
		</ChatContext.Provider>);
};

export const useChat = (): ChatContextValue => {
	const ctx = useContext(ChatContext);
	if (!ctx)
		throw new Error("useChat must be used inside ChatProvider");
	return ctx;
}
