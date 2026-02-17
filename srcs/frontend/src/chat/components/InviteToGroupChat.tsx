import { useQuery, useMutation } from "@tanstack/react-query";
import api from "../../serverApi";
import { Box } from "@allxsmith/bestax-bulma";
import { useAuth } from "../../auth/AuthContext";

export function GroupChatInvitations({ chatId, existingMembers }) {
  const { user } = useAuth();

  // Fetch friends
  const { data: friends, isLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: async () => {
      const res = await api.get("/friends/list");
      const friendships = res.data;

      return friendships.map((f: any) =>
        f.sender.appUserId === user?.id ? f.receiver : f.sender
      );
    }
  });

  //fetch all chat invitations
  const { data: invitations } = useQuery({
    queryKey: ["group-invitations"],
    queryFn: async () => {
      const res = await api.get("/group/invitations");
      return res.data;
    }
  });

  //invite friends to join chat mutation
  const inviteMutation = useMutation({
    mutationFn: async (friendId: string) => {
      await api.post(`/group/${chatId}/invite/${friendId}`);
    }
  });

  if (isLoading || !friends || !invitations)//check if correct to return if no friends
    return null;

  //check if friends are already chat members
  const existingIds = existingMembers.map((m: any) => m.user.appUserId);
  const eligibleFriends = friends.filter(
    (f: any) => !existingIds.includes(f.appUserId)
  );

  //check if friends already received invite to join chat
  const pendingInvites = invitations.filter( (inv: any) => 
    inv.chatId === chatId && inv.status === "waiting" );

  if (eligibleFriends.length === 0)
    return (
      <Box className="box mt-4">
        <strong>No friends available to invite.</strong>
      </Box>
    );

  return (
    <Box className="box mt-4">
      <strong>Invite Friends to Join Group</strong>

      {eligibleFriends.map((f: any) => {
        const isPending = pendingInvites.some(
          (inv: any) => inv.receiver.appUserId === f.appUserId
        );
      
      return (
        <div key={f.appUserId} className="mt-2">
          {f.username}

          {
            isPending ? (
              <button className="button is-small is-light ml-2" disabled>
                Invite already pending
              </button>

            ) : (

            <button
              className="button is-small is-primary ml-2"
              onClick={() => inviteMutation.mutate(f.appUserId)}
            >
              Invite
            </button>
            )}
          </div>
        );
      })}
    </Box>
  );
}
