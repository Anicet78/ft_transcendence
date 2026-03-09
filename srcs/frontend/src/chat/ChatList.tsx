import { useQuery } from '@tanstack/react-query';
import '../App.css'
import type { GetResponse } from '../types/GetType'
import api from '../serverApi';
import { Button} from '@allxsmith/bestax-bulma';
import { useNavigate } from 'react-router';
import { useChatListSocket } from './hooks/useChatListSocket';
import { useAuth } from '../auth/AuthContext';

type ChatListResponseType = GetResponse<"/chat/list", "get">;

//you need to create a chat model, and a member model
function chatNameToDisplay(chat: any, userId?: string) {
	if (chat.chatType === "private") {
		const other = chat.members.find(
			(m: any) => m.user.appUserId !== userId
		);
		return other?.user?.username || "Private chat";
	}
	return chat.chatName || "Group chat";
}

const ChatList = ({
	onSelectChat, 
	onCreateGroup,
	onShowInvitations
}: {
	onSelectChat?: (id: string) => void;
	onCreateGroup?: () => void; onShowInvitations?: () => void;
}) => {
	
	const navigate = useNavigate();
	const user = useAuth();

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
						<a
							className="has-text-dark"
							style={{ cursor: "pointer" }}
							onClick={() => {
								if (onSelectChat)
									onSelectChat(chat.chatId);
								else
									navigate(`/chat/${chat.chatId}/info`);
							}}
						>
							{chatNameToDisplay(chat, user?.user?.id)}
						</a>
					</h2>

					{/* Chat metadata */}
					<p style={{ fontSize: "0.85rem", opacity: 0.7 }}>
						{chat.chatType === "group" && (
							<>{chat.members.length} members</>
						)}
					</p>
				</div>
			))}
		</div>
		);
};

export default ChatList;
