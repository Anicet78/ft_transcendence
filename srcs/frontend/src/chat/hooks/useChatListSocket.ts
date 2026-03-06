import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "../../socket/SocketContext";

export function useChatListSocket() {
	const socket = useSocket();
	const queryClient = useQueryClient();

	useEffect(() => {
		if (!socket)
			return;

		//when chat is closed, refetch only chat that are not the chat which just been closed
		const handleQuitChat = ({ chatId }: { chatId: string }) => {
			queryClient.setQueryData(["chat-list"], (chats: any[] = []) =>
				chats.filter(chat => chat.chatId !== chatId));

			// cleanup any cached chat data
			queryClient.removeQueries({ queryKey: ["chat-info", chatId] });
			queryClient.removeQueries({ queryKey: ["chat-messages", chatId] });
			queryClient.removeQueries({ queryKey: ["chat-read-state", chatId] });
		};

		const invalidateChatList = () => {
			queryClient.invalidateQueries({ queryKey: ["chat-list"] });
		};

		socket.on("chat_member_quit", handleQuitChat);
		socket.on("chat_member_kicked", handleQuitChat);
		socket.on("chat_disbanded", handleQuitChat);
		socket.on("chat_created", invalidateChatList);

		return () => {
			socket.off("chat_member_quit", handleQuitChat);
			socket.off("chat_member_kicked", handleQuitChat);
			socket.off("chat_disbanded", handleQuitChat);
			socket.off("chat_created", invalidateChatList);//no event for joined ?
		};

	}, [socket, queryClient]);
}