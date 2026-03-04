import { useState } from "react";
import ChatList from "../ChatList";
import ChatView from "../ChatView";

export function SidebarChat() {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  return (
    <div>
      {/* CONTENT */}
      {!activeChatId && (
        <ChatList onSelectChat={(id) => setActiveChatId(id)} />
      )}

      {activeChatId && (
        <ChatView
          chatId={activeChatId}
          onClose={() => setActiveChatId(null)}
        />
      )}
    </div>
  );
}
