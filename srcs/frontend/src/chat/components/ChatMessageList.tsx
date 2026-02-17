import { Box } from "@allxsmith/bestax-bulma";
import { Link } from "react-router";
import { useAuth } from "../../auth/AuthContext";

export function MessageList({
	messages,
	role,
	permissions,
	onEdit,
	onDelete,
	onModerate,
	onRestore
}) {

	const { user } = useAuth();

	return (
	<>
		{messages.map(msg => (
		<Box key={msg.messageId} className="box" m="2" p="3">
			<strong>
			<Link
				to={`/profile/${encodeURIComponent(msg.author.username)}`}
				className="has-text-dark"
			>
				{msg.author.username}
			</Link>
			</strong>

			<p>{msg.status === "moderated" ? "Message moderated" : msg.content}</p>
			<small>{msg.postedAt ? new Date(msg.postedAt).toLocaleString() : ""}</small>

			{/* Author actions */}
			{msg.userId === user?.id && (
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

			{/* Moderator actions */}
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
		))}
	</>
	);
}
