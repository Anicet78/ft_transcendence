import { useAuth } from "../../auth/AuthContext";
import { useChat } from "../ChatContext";
import { useChatRoleMutation } from "../hooks/useChatRoleMutations";
import { useGroupChatMutations } from "../hooks/useGroupChatMutations";

export function ChatMembers({ chatId }) {

	const { chat, permissions } = useChat();
	const { user } = useAuth();

	const roleMutation = useChatRoleMutation(chatId);
	const {kickMutation} = useGroupChatMutations(chatId);

	if (!chat)
		return null; //<div>Loading chat...</div>;

	return (
		<div className="mb-4">
			<strong>Members:</strong>

			<ul>
				{chat.members.map(m => (
				<li key={m.chatMemberId} className="mb-1">
					{m.user.username} - <em>{m.role}</em>

					{permissions.canChangeRoles && m.user.appUserId !== user?.id && (
					<select
						className="ml-2"
						value={m.role}
						onChange={(e) =>
							roleMutation.mutate({
								memberId: m.user.appUserId,
								role: e.target.value
							})
						}
					>
						<option value="owner">Owner</option>
						<option value="admin">Admin</option>
						<option value="moderator">Moderator</option>
						<option value="writer">Writer</option>
						<option value="member">Member</option>
					</select>
					)}

					{/* KICK MEMBER */}
					{permissions.canKick && m.user.appUserId !== user?.id && (
						<button
							className="button is-danger is-light is-small ml-2"
							onClick={() => kickMutation.mutate(m.user.appUserId)}
						>
							Kick
						</button>
					)}
				</li>
				))}
			</ul>
		</div>
	);
}