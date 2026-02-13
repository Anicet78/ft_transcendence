import { useQuery } from '@tanstack/react-query';
import '../App.css'
import type { GetResponse } from '../types/GetType'
import api from '../serverApi';
import { Box } from '@allxsmith/bestax-bulma';
import { Link } from 'react-router';

type ChatListResponseType = GetResponse<"/chat/list", "get">;

const ChatList = () => {
	
	const { data, isLoading, isError, error } = useQuery({
		queryKey: ['chat-list'],
		queryFn: async () => {
			const res = await api.get<ChatListResponseType>("/chat/list");
			return res.data;
		}
	});

	if (isLoading)
		return <div>Loading chats...</div>;
	if (isError || !data)
		return <div>Error: {error?.message}</div>;

	return (
		<Box m="4" p="6" bgColor="white">
			<h1 className="title">Your chats</h1>

			{data.length === 0 && <p>You have no chats yet.</p>}

			{data.map(chat => (
			<Box key={chat.chatId} className="box" m="2" p="4">
				<h2 className="subtitle">
				{chat.chatName || (chat.chatType === "private" ? "Private chat" : "Group chat")}
				</h2>

				<p>Type: {chat.chatType}</p>
				<p>Members: {chat.members.length}</p>

				<Link
				to={`/chat/${chat.chatId}/info`}
				className="button is-dark is-small mt-2"
				>
				Open chat
				</Link>
			</Box>
			))}
		</Box>
		);
};

export default ChatList;


// import { useQuery } from "@tanstack/react-query";
// import api from "../serverApi";
// import type { GetResponse } from "../types/GetType";

// export type ChatListResponse = GetResponse<"/chat/list", "get">;

// export function useChatList() {
// 	return useQuery({
// 	queryKey: ["chat-list"],
// 	queryFn: async () => {
// 		const res = await api.get<ChatListResponse>("/chat/list");
// 		return res.data;
// 	}
// 	});
// }


// import { useChatList } from "./useChatList";

// const ChatList = () => {
// 	const { data, isLoading, isError, error } = useChatList();

// 	if (isLoading) return <div>Loading chats...</div>;
// 	if (isError || !data) return <div>Error: {error?.message}</div>;

// 	return (
// 	<div>
// 		<h1>Your chats</h1>

// 		{data.map(chat => (
// 		<div key={chat.chatId}>
// 			<h2>{chat.chatName || chat.chatType}</h2>
// 			<p>Members: {chat.members.length}</p>
// 		</div>
// 		))}
// 	</div>
// 	);
// };
