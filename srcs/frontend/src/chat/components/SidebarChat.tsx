import { useState } from "react";
import ChatList from "../ChatList";
import ChatView from "../ChatView";

export function SidebarChat() {
	const [activeChatId, setActiveChatId] = useState<string | null>(null);
	const [collapsed, setCollapsed] = useState(false);

	return (
		<div style={{
			width: collapsed ? "40px" : "350px",
			transition: "width 0.25s ease",
			height: "100vh",
			borderLeft: "2px solid #ddd",
			background: "white",
			overflow: "hidden",
			display: "flex",
			flexDirection: "column",
			position: "relative"
		}}>
			
			{/* COLLAPSE BUTTON 9not working) */}
			<button
				onClick={() => setCollapsed(!collapsed)}
				style={{
					position: "absolute",
					left: "-40px",
					top: "20px",
					width: "40px",
					height: "40px",
					borderRadius: "8px 0 0 8px",
					border: "1px solid #ccc",
					background: "#fff",
					cursor: "pointer"
				}}
				>
				{collapsed ? "⮜" : "⮞"}
			</button>

			{!collapsed && !activeChatId && (
			<ChatList onSelectChat={(id) => setActiveChatId(id)} />
			)}

			{!collapsed && activeChatId && (
			<ChatView
				chatId={activeChatId}
				onClose={() => setActiveChatId(null)}
			/>
			)}
		</div>
	);
}
