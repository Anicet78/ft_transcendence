import { createContext, useContext, useEffect, useState } from "react";
import type { GetResponse } from "../types/GetType";
import { useSocket } from "../socket/SocketContext";
import { useAuth } from "../auth/AuthContext";
import api from "../serverApi";

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
	
	const socket = useSocket();
	const { user } = useAuth();

	const [chat, setChat] = useState<ChatInfoResponse | null>(null);
	//const [typingUsers, setTypingUsers] = useState<Record<string, string>>({});
	const [isTyping, setIsTyping] = useState(false);

	const role = chat?.members.find(mbr => mbr.user.appUserId === user?.id)?.role ?? null;

	const permissions = {
		canModerate: ["owner", "admin", "moderator"].includes(role ?? ""),
		canInvite: ["owner", "admin", "moderator", "writer", "member"].includes(role ?? ""),
		canBan: ["owner", "admin"].includes(role ?? ""),
		canKick: ["owner", "admin"].includes(role ?? ""),
		canRename: ["owner", "admin"].includes(role ?? ""),
		canChangeRoles: ["owner", "admin"].includes(role ?? "") 
	}

	const joinChat = async(chatId: string) => {

		//GET CHAT INFO
		const res = await api.get<ChatInfoResponse>(`/chat/${chatId}/info`);
		setChat(res.data);

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

		if (!socket)
			return;

		socket.on("chat_typing", ({ userId }) => {
			if (userId === user?.id)// ignore yourself
				return;

			setIsTyping(true);

			setTimeout(() => {
				setIsTyping(false);
			}, 2000);
		});

		// socket.on("chat_typing", ({ userId, username }) => {
		// 	if (userId === user?.id)//show typing except for the typing user
		// 		return;

		// 	setTypingUsers(prev => ({
		// 		...prev, [userId]: username
		// 	}));

		// 	setTimeout(() => {
		// 		setTypingUsers(prev => {
		// 			const copy = { ...prev };
		// 			delete copy[userId];
		// 			return copy;
		// 		});
		// 	}, 2000);
		// });

		return () => {
			socket.off("chat_typing");
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

