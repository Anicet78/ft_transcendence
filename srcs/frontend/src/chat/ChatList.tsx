import { useQuery } from '@tanstack/react-query';
import '../App.css'
import type { GetResponse } from '../types/GetType'
import api from '../serverApi';
import { Button} from '@allxsmith/bestax-bulma';
import { useNavigate } from 'react-router';
import { useChatListSocket } from './hooks/useChatListSocket';

type ChatListResponseType = GetResponse<"/chat/list", "get">;

const ChatList = ({
	onSelectChat, 
	onCreateGroup,
	onShowInvitations
}: {
	onSelectChat?: (id: string) => void;
	onCreateGroup?: () => void; onShowInvitations?: () => void;
}) => {
	
	const navigate = useNavigate();
	useChatListSocket();

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
		<div className='sidebar-content'>
			<h1 className="title">Your chats</h1>

			<Button
				className='group-chat-btn'
				size='small'
				onClick={onCreateGroup}
				>
				Create Group Chat
			</Button>

			<Button
				className='group-invit-btn'
				size='small'
				onClick={onShowInvitations}
				>
				Group Chat Invitations
			</Button>


			{/* LIST CHATS */}
			{data.length === 0 && <p>You have no chats yet.</p>}

			{data.map(chat => (
			<div key={chat.chatId} className="chat-box">
				<h2 className="subtitle">
				{chat.chatName || (chat.chatType === "private" ? "Private chat" : "Group chat")}
				</h2>

				<p>Type: {chat.chatType}</p>
				<p>Members: {chat.members.length}</p>

				<Button
					className="chat-button"
					onClick={() => {
						if (onSelectChat)
							onSelectChat(chat.chatId);
						else
							navigate(`/chat/${chat.chatId}/info`);
					}}
				>
					Open chat
				</Button>
			</div>
			))}
		</div>
		);
};

export default ChatList;
