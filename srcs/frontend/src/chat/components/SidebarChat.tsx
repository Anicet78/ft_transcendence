import { useState } from "react";
import ChatList from "../ChatList";
import ChatView from "../ChatView";
import GroupChatCreation from "./GroupChatCreation";
import GroupChatInvitations from "./GroupChatInvitations";

export function SidebarChat() {
  const [mode, setMode] = useState<
  "list" | "chat" | "create-group" | "invitations"
  >("list");

  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  return (
    <div className="sidebar-box">
      {/* CONTENT */}
      {/* {!activeChatId && (
        <ChatList onSelectChat={(id) => setActiveChatId(id)} />
      )}

      {activeChatId && (
        <ChatView
          chatId={activeChatId}
          onClose={() => setActiveChatId(null)}
        />
      )} */}

      {mode === "list" && (
        <ChatList
        onSelectChat={(id) => {
          setActiveChatId(id);
          setMode("chat");
        }}
        onCreateGroup={() => setMode("create-group")}
        onShowInvitations={() => setMode("invitations")}
        />
      )}

      {mode === "chat" && activeChatId && (
        <ChatView
        chatId={activeChatId}
        onClose={() => {
          setActiveChatId(null);
          setMode("list");
        }}
        />
      )}

      {mode === "create-group" && (
        <GroupChatCreation
        onClose={() => setMode("list")}
        onCreated={(chatId) => {
          setActiveChatId(chatId);
          setMode("chat");
        }}
        />
      )}

      {mode === "invitations" && (
        <GroupChatInvitations
        onClose={() => setMode("list")}
        />
      )}
    </div>
  );
}
