import { Box } from "@allxsmith/bestax-bulma";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../auth/AuthContext";

type Message = {
	messageId: string;
	chatId: string;
	userId: string;
	content: string;
	status: string;
	postedAt: string | null;
	editedAt?: string | null;
	deletedAt?: string | null;
	author: {
		appUserId: string;
		username: string;
		avatarUrl?: string | null;
		availability?: string | null;
	};
};

type MessageListProps = {
	messages: Message[];
	readState?: Record<string, string>;
	role: string | null;
	permissions: Record<string, boolean>;
	onEdit: (data: { messageId: string; content: string }) => void;
	onDelete: (messageId: string) => void;
	onModerate: (messageId: string) => void;
	onRestore: (messageId: string) => void;
};

function isMessageRead(
	messageId: string,
	readState?: Record<string, string>
) {
	if (!readState)
		return false;

	return Object.values(readState).some(
		lastId => lastId === messageId
	);
}

export function MessageList({
	messages,
	// role,
	readState,
	permissions,
	onEdit,
	onDelete,
	onModerate,
	onRestore
}: MessageListProps) {

	const { user } = useAuth();
	const navigate = useNavigate();

	if (!messages || messages.length === 0)
		return null;

	return (
	<>
		{messages?.map(msg => {

			const read = isMessageRead(msg.messageId, readState);

			// GAME INVITE MESSAGE
			if (msg.content.includes("/join/")) {
				const match = msg.content.match(/\/join\/([^\/\s]+)/);
				const roomId = match ? match[1] : null;

				return (
					<Box className="box" m="2" p="3">
					<p><strong>{msg.author.username}</strong> invites you to join a game 🎮</p>

					{/* Join button */}
					<button
						className="button is-primary is-small mt-2"
						onClick={() => navigate(`/join/${roomId}`)}
					>
						Join Room
					</button>
					<> 
						{/* DISPLAY MESSAGES & DATE*/}
						<small>
							{msg.postedAt ? new Date(msg.postedAt).toLocaleString() : ""}
						</small>

						{/* AUTHOR ACTIONS */}
						{msg.userId === user?.id && msg.status === "posted" && (
							<button
								className="button is-danger is-small mt-2"
								onClick={() => onDelete(msg.messageId)}
							>
								Delete
							</button>
						)}

						{/* MODERATOR ACTIONS */}
						{permissions.canModerate && (
							<>
							{msg.status !== "moderated" && (
								<button
								className="button is-danger is-small mt-2 ml-2"
								onClick={() => onModerate(msg.messageId)}
								>
								Moderate
								</button>
							)}

							{msg.status === "moderated" && (
								<button
								className="button is-success is-small mt-2 ml-2"
								onClick={() => onRestore(msg.messageId)}
								>
								Restore
								</button>
							)}
							</>
						)}
					</>
					</Box>
				);
			}

			return (
				<Box key={msg.messageId} className="box" m="2" p="3">
				
				{/* ACCESS MEMBER PROFILE FROM CHAT */}
				<strong>
					<Link
					to={`/profile/${encodeURIComponent(msg.author.username)}`}
					className="has-text-dark"
					>
					{msg.author.username}
					</Link>
				</strong>

				{/* DISPLAY MESSAGES & DATE*/}
				<p>{/*msg.status === "moderated" ? "Message moderated" : */msg.content}</p>
				<small>
					{msg.postedAt ? new Date(msg.postedAt).toLocaleString() : ""}
				</small>

				{/* AUTHOR ACTIONS */}
				{msg.userId === user?.id && msg.status === "posted" && (
					<>
					<button
						className="button is-warning is-small mt-2"
						onClick={() => {
						const newContent = prompt("Edit message:", msg.content);
						if (newContent)
							onEdit({ messageId: msg.messageId, content: newContent });
						}}
					>
						Edit
					</button>

					<button
						className="button is-danger is-small mt-2"
						onClick={() => onDelete(msg.messageId)}
					>
						Delete
					</button>
					</>
				)}

				{/* MODERATOR ACTIONS */}
				{permissions.canModerate && (
					<>
					{msg.status !== "moderated" && (
						<button
						className="button is-danger is-small mt-2 ml-2"
						onClick={() => onModerate(msg.messageId)}
						>
						Moderate
						</button>
					)}

					{msg.status === "moderated" && (
						<button
						className="button is-success is-small mt-2 ml-2"
						onClick={() => onRestore(msg.messageId)}
						>
						Restore
						</button>
					)}
					</>
				)}

				
				{/* READ RECEIPTS */}
				{read && (
					<span style={{ marginLeft: 8, color: "#4fc3f7" }}>
						✓✓
					</span>
				)}

				</Box>
			);
		})}
	</>
	);
}
