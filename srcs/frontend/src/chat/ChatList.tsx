import { useQuery } from '@tanstack/react-query';
import '../App.css'
import type { GetResponse } from '../types/GetType'
import api from '../serverApi';
import { Box } from '@allxsmith/bestax-bulma';
import { Link, useNavigate } from 'react-router';
// import { useAuth } from '../auth/AuthContext';

type ChatListResponseType = GetResponse<"/chat/list", "get">;

// const { user } = useAuth();

const ChatList = ({ onSelectChat }: { onSelectChat?: (id: string) => void }) => {
	
	const navigate = useNavigate();

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

			{/* CREATE GROUP CHAT BUTTON */}
			<Link
				to="/chat/group/new"
				className="button is-primary is-small mb-4"
			>
			Create Group Chat
			</Link>

			<Link
				to="/group/invitations" className="button is-small is-warning"
			>
			Group Chat Invitations
			</Link>


			{/* LIST CHATS */}
			{data.length === 0 && <p>You have no chats yet.</p>}

			{data.map(chat => (
			<Box key={chat.chatId} className="box" m="2" p="4">
				<h2 className="subtitle">
				{chat.chatName || (chat.chatType === "private" ? "Private chat" : "Group chat")}
				</h2>

				<p>Type: {chat.chatType}</p>
				<p>Members: {chat.members.length}</p>

				{/* <Link
					to={`/chat/${chat.chatId}/info`}
					className="button is-dark is-small mt-2"
				>
				Open chat
				</Link> */}

				<button
				className="button is-dark is-small mt-2"
				onClick={() => {
					if (onSelectChat)
						onSelectChat(chat.chatId);
					else
						navigate(`/chat/${chat.chatId}/info`);
				}}
				>
				Open chat
				</button>

{/* 
				{chat.chatType === "group" && user?.role !== "owner" && (
					<button
						className="button is-warning is-light is-small ml-2"
						// onClick={() => quitMutation.mutate(chat.chatId)}
					>
						Quit
					</button>
				)} */}

			</Box>
			))}
		</Box>
		);
};

export default ChatList;
