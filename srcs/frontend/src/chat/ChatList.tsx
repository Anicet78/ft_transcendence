import { useQuery } from '@tanstack/react-query';
import '../App.css'
import type { GetResponse } from '../types/GetType'
import api from '../serverApi';
import { Box } from '@allxsmith/bestax-bulma';
import { useNavigate } from 'react-router';
import { useListSocket } from './hooks/useListSocket';
// import { useAuth } from '../auth/AuthContext';

type ChatListResponseType = GetResponse<"/chat/list", "get">;

// const { user } = useAuth();

// const ChatList = ({ onSelectChat }: { onSelectChat?: (id: string) => void }) => {
const ChatList = ({
	onSelectChat, 
	onCreateGroup,
	onShowInvitations
}: {
	onSelectChat?: (id: string) => void;
	onCreateGroup?: () => void; onShowInvitations?: () => void;
}) => {
	
	const navigate = useNavigate();
	useListSocket();

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
			{/* <Link
				to="/chat/group/new"
				className="button is-primary is-small mb-4"
			>
			Create Group Chat
			</Link> */}
			{/* <Link
				to="/group/invitations" className="button is-small is-warning"
			>
			Group Chat Invitations
			</Link> */}

			<button
				className="button is-primary is-small mb-4"
				onClick={onCreateGroup}
				>
				Create Group Chat
			</button>

			<button
				className="button is-small is-warning mb-4"
				onClick={onShowInvitations}
				>
				Group Chat Invitations
			</button>


			{/* LIST CHATS */}
			{data.length === 0 && <p>You have no chats yet.</p>}

			{data.map(chat => (
			<Box key={chat.chatId} className="box" m="2" p="4">
				<h2 className="subtitle">
				{chat.chatName || (chat.chatType === "private" ? "Private chat" : "Group chat")}
				</h2>

				<p>Type: {chat.chatType}</p>
				<p>Members: {chat.members.length}</p>

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

			</Box>
			))}
		</Box>
		);
};

export default ChatList;
