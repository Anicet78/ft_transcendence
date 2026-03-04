import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { SidebarChat } from "../chat/components/SidebarChat";

const Sidebar = () => {
	const { user } = useAuth();
	const [mobileOpen, setMobileOpen] = useState(false);
	const [collapsed, setCollapsed] = useState(false); // new state

	// Lock body scroll on mobile overlay
	useEffect(() => {
		if (mobileOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "auto";
		}
		// Reset on unmount
		return () => {
			document.body.style.overflow = "auto";
		};
	}, [mobileOpen]);

	useEffect(() => {
		return () => {
			// Safety cleanup if component unmounts while resizing
			document.body.style.userSelect = "auto";
			document.body.style.cursor = "auto";
		};
	}, []);

	// Important to put after the cleaning hooks
	if (!user) {
		return null;
	}

	// RESIZING
	const [width, setWidth] = useState(350);
	const [resizing, setResizing] = useState(false);

	function startResize() {
		document.body.style.userSelect = "none";      // prevent text selection
		document.body.style.cursor = "ew-resize";     // change cursor
		setResizing(true);
	}

	useEffect(() => {
		if (!resizing) return;

		function handleMouseMove(e: MouseEvent) {
			const newWidth = window.innerWidth - e.clientX;
			setWidth(Math.min(600, Math.max(200, newWidth)));
		}

		function handleMouseUp() {
			document.body.style.userSelect = "auto";      // restore text selection
			document.body.style.cursor = "auto";          // restore cursor
			setResizing(false);
		}

		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("mouseup", handleMouseUp);

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mouseup", handleMouseUp);
		};
	}, [resizing]);

	return (
		<>
			{/* ===== DESKTOP SIDEBAR ===== */}
			<aside 
				className={`chat-sidebar-desktop ${collapsed ? "collapsed" : ""}`}
				style={{
					width: collapsed ? "0px" : `${width}px`,
					transition: resizing ? "none" : "width 0.3s ease"
				}}
			>
				{/* COLLAPSE BUTTON */}
				<button
					className="button is-small collapse-btn"
					onClick={() => setCollapsed(!collapsed)}
				>
					<span className="icon">
						<i className={`fas ${collapsed ? "fa-angle-left" : "fa-angle-right"}`}></i>
					</span>
				</button>
				{/* RESIZE HANDLE (only when expanded) */}
				{!collapsed && (
					<div
					onMouseDown={startResize}
					style={{
						position: "absolute",
						left: 0,
						transform: "none",
						top: 0,
						width: "16px",
						height: "100%",
						cursor: "ew-resize",
						zIndex: 15,
						background: "transparent"
					}}
					/>
				)}
				{!collapsed && (
					<div className="sidebar-content">
						<SidebarChat />
					</div>)}
			</aside>

			{/* ===== MOBILE ===== */}
			<div className="is-hidden-desktop">
				<button
					className="button is-primary floating-chat-btn"
					onClick={() => setMobileOpen(true)}
				>
					<span className="icon">
						<i className="fas fa-comment-dots"></i>
					</span>
				</button>

				{mobileOpen && (
					<div className="chat-mobile-overlay">
						<div className="chat-mobile-header">
							<p className="has-text-weight-semibold">Messages</p>

							<button
							className="button is-white"
							onClick={() => setMobileOpen(false)}
						>
							<span className="icon">
								<i className="fas fa-times"></i>
							</span>
						</button>
						</div>

						<div className="chat-mobile-body">
							<SidebarChat />
						</div>
					</div>
				)}
			</div>
		</>
	);
}

export default Sidebar
