import { Box } from "@allxsmith/bestax-bulma";
import { Link } from "react-router";
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
	role: string | null;
	permissions: Record<string, boolean>;
	onEdit: (data: { messageId: string; content: string }) => void;
	onDelete: (messageId: string) => void;
	onModerate: (messageId: string) => void;
	onRestore: (messageId: string) => void;
};


export function MessageList({
	messages,
	// role,
	permissions,
	onEdit,
	onDelete,
	onModerate,
	onRestore
}: MessageListProps) {

	const { user } = useAuth();

	// const isModerator = ["owner", "admin", "moderator"].includes(role ?? "");

	if (!messages)
		return null;

	return (
	<>
		{messages?.map(msg => {

			return (
				<Box key={msg.messageId} className="box" m="2" p="3">
				<strong>
					<Link
					to={`/profile/${encodeURIComponent(msg.author.username)}`}
					className="has-text-dark"
					>
					{msg.author.username}
					</Link>
				</strong>

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
				</Box>
			);
		})}
	</>
	);
}
