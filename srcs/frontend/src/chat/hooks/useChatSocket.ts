import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "../../socket/SocketContext";

//When a socket event arrives, it directly updates the React Query cache
export function useChatSocket(chatId?: string) {

	const socket = useSocket();
	const queryClient = useQueryClient();

	useEffect(() => {
	
		if (!socket || !chatId)
			return;

		//SEND
		const onMessageCreated = (message: any) => {
	
			//let the backend decide what you’re allowed to see
			queryClient.invalidateQueries({ queryKey: ["chat-messages", chatId] });
			// queryClient.setQueryData(["chat-messages", chatId], (cache: any[] | undefined) => {
			// 	if (!cache)
			// 		return [message];
			// 	return [...cache, message];
			// });
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
}
