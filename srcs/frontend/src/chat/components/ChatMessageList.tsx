import { Box, Button } from "@allxsmith/bestax-bulma";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../auth/AuthContext";

export type Message = {
	messageId: string;
	chatId: string;
	userId: string;
	content: string;
	status: string;
	type: string;
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
	chatType?: string | null;
	memberCount: number,
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

function buildReadersByMessage(
	messages: Message[],
	readState?: Record<string, string>
) {
	if (!readState)
		return {};

	const indexMap = new Map(
		messages.map((m, i) => [m.messageId, i])
	);

	const result: Record<string, string[]> = {};

	for (const [userId, lastId] of Object.entries(readState)) {
		const lastIndex = indexMap.get(lastId);
		if (lastIndex === undefined)
			continue;

		for (let i = 0; i <= lastIndex; i++) {
			const msgId = messages[i].messageId;

			if (!result[msgId])
				result[msgId] = [];

			result[msgId].push(userId);
		}
	}

	return result;
}

export function MessageList({
	messages,
	// role,
	readState,
	chatType,
	memberCount = 0,
	permissions,
	onEdit,
	onDelete,
	onModerate,
	onRestore
}: MessageListProps) {

	const { user } = useAuth();
	const navigate = useNavigate();

	if (!messages || messages.length === 0) {

		return null;
	}

	const readersByMessage = buildReadersByMessage(messages, readState);

	return (
	<>
		{messages?.map(msg => {

			const read = isMessageRead(msg.messageId, readState);
			const readers = readersByMessage[msg.messageId] || [];

			// GAME INVITE MESSAGE
			if (msg.content.includes("/join/")) {
			//if (msg.type === "game_invite") {
				const match = msg.content.match(/\/join\/([^\/\s]+)/);
				const roomId = match ? match[1] : null;

				return (
					<div className="join-box">
					<p><strong>{msg.author.username}</strong> invites you to join a game 🎮</p>

					{/* Join button */}
					<Button
						className="chat-join-button"
						onClick={() => navigate(`/join/${roomId}`)}
					>
						Join Room
					</Button>
					<>
						{/* DISPLAY MESSAGES & DATE*/}
						<small>
							{msg.postedAt ? new Date(msg.postedAt).toLocaleString() : ""}
						</small>
						<div className="chat-actions-btn">
							{/* AUTHOR ACTIONS */}
							{msg.userId === user?.id && msg.status === "posted" && (
								<Button
									className="delete-button"
									onClick={() => onDelete(msg.messageId)}
								>
									Delete
								</Button>
							)}

							{/* MODERATOR ACTIONS */}
							{permissions.canModerate && msg.status !== "deleted" && (
								<>
									{msg.status !== "moderated" && (
										<Button
											className="moderate-button"
											onClick={() => onModerate(msg.messageId)}
										>
											Moderate
										</Button>
									)}

									{msg.status === "moderated" && (
										<Button
											className="restore-button"
											onClick={() => onRestore(msg.messageId)}
										>
											Restore
										</Button>
									)}
								</>
						)}
						</div>
					</>
					</div>
				);
			}

			if (msg.type === "game_started") {
				// const match = msg.content.match(/\/join\/([^\/\s]+)/);
				// const roomId = match ? match[1] : null;

				return (
					<Box className="box" m="2" p="3">
					<p><strong>{msg.author.username}</strong> 🎮 Game session is going on! </p>
					<>
						{/* DISPLAY MESSAGES & DATE*/}
						<small>
							{msg.postedAt ? new Date(msg.postedAt).toLocaleString() : ""}
						</small>
					</>
					</Box>
				);
			}

			return (
				<div key={msg.messageId} className="msg-box">

				{/* ACCESS MEMBER PROFILE FROM CHAT */}
					<Link
					to={`/profile/${encodeURIComponent(msg.author.username)}`}
					className="view-author-profile"
					>
					{msg.author.username}
					</Link>

				{/* DISPLAY MESSAGES & DATE*/}
				{msg.status === "deleted" &&
					<p className="msg-deleted">This message has been deleted</p>
				}
				<p>{msg.content}</p>
				<small>
					{msg.postedAt ? new Date(msg.postedAt).toLocaleString() : ""}
				</small>

				{/* AUTHOR ACTIONS */}
				<div className="chat-actions-btn">
					{msg.userId === user?.id && (msg.status === "posted" || msg.status === "edited") && (
						<>
						<Button
							className="edit-button"
							onClick={() => {
							const newContent = prompt("Edit message:", msg.content);
							if (newContent)
								onEdit({ messageId: msg.messageId, content: newContent });
							}}
						>
							Edit
						</Button>

						<Button
							className="delete-button"
							onClick={() => onDelete(msg.messageId)}
						>
							Delete
						</Button>
						</>
					)}

					{/* MODERATOR ACTIONS */}
					{permissions.canModerate && msg.status !== "deleted" && (
						<>
						{msg.status !== "moderated" && (
							<Button
							className="moderate-button"
							onClick={() => onModerate(msg.messageId)}
							>
							Moderate
							</Button>
						)}

						{msg.status === "moderated" && (
							<Button
							className="restore-button"
							onClick={() => onRestore(msg.messageId)}
							>
							Restore
							</Button>
						)}
						</>
					)}


					{/* READ RECEIPTS - PRIVATE*/}
					{chatType === "private" && read && (
						<span style={{ marginLeft: 8, color: "#4fc3f7" }}>
							✓✓
						</span>
					)}

					{/* READ RECEIPTS - GROUP CHAT*/}
					{chatType === "group" && msg.userId === user?.id && readers.length > 0 && (
						<div style={{ fontSize: "0.75rem", opacity: 0.7 }}>
							{readers.length === memberCount - 1
							? "✓ Read by everyone"
							: `Seen by ${readers.length}`}
						</div>
					)}
					</div>
				</div>
			);
		})}
	</>
	);
}
