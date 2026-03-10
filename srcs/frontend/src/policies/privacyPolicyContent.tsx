const CONTACT_EMAIL = "dungeonnodragon@gmail.com";

export const sections = [
	{
		id: "introduction",
		title: "Introduction",
		content: (
		<div className="section-content">
			<p>
				The DungeonNoDragon web game is operate by the team of Anicet, Julie, Maxime, Nina and Tom as the 
				final project ft_transcendence of the common-core curriculum of the 42 Paris school.
			</p>
			<p>This privacy policy page explains how we collect, use, and protect information when you play our web game.</p>
		</div>
		)
	},
	{
		id: "collected-info",
		title: "Collected information",
		content: (
			<div className="section-content">
				<h4>Account information</h4>
				<p>During user registration, we collect the following information:</p>
				<ul>
					<li>First name</li>
					<li>Last name</li>
					<li>Username</li>
					<li>Email address</li>
					<li>{"Password (stored securely using a cryptographic hash)"}</li>
				</ul>
				<h4>Technical information</h4>
				<p>When players access the game, the server may automatically collect:</p>
				<ul>
					<li>IP address</li>
					<li>Browser type</li>
					<li>Device information</li>
					<li>Server request logs</li>
				</ul>
			</div>
		)
	},
	{
		id: "info-usage",
		title: "How we use the collected information",
		content: (
			<div className="section-content">
				<p>
					The processing of this data is necessary for the operation of the game
					and the management of user accounts.
				</p>
				<p>The collected data will therefore be used for:</p>
				<ul>
					<li>Creating and managing player accounts</li>
					<li>Allowing users to interact fully with each other</li>
					<li>Allowing multi-player gameplay</li>
					<li>Saving gameplay progress</li>
				</ul>
			</div>
		)
	},
	{
		id: "player-visibility",
		title: "Information visible to other players",
		content: (
			<div className="section-content">
				<p>
					Some information associated with your account, such as your username,
					level, experience points, and game results, may be visible to other players
					within the game.
				</p>
			</div>
		)
	},
	{
		id: "storage-security",
		title: "Data storage and Security",
		content: (
			<div className="section-content">
				<p>
					Account data is stored in a PostgreSQL database. 
					The game runs in a containerized environment with Docker.
					The website is served through Nginx, which manages external connections and limits exposed network ports.
				</p>
			</div>
		)
	},
	{
		id: "data-sharing",
		title: "Data sharing",
		content: (
			<div className="section-content">
				<p>
					This project does not sell, rent, or share personal information 
					with third parties except when required by law.
				</p>
			</div>
		)
	},
	{
		id: "data-retention",
		title: "Data retention",
		content: (
			<div className="section-content">
				<p>Account data is kept for the duration of the project evaluation and will be deleted afterwards.</p>
				<p>
					{'If you wish to delete your account, send an email (with the email address used for your account) to this adress: '}
					<span>{CONTACT_EMAIL}</span>.
				</p>
			</div>
		)
	},
	{
		id: "user-rights",
		title: "User rights",
		content: (
			<div className="section-content">
			<p>As a user, you have the right to request access or correction of your personal data, including the deletion of your account.</p>
			</div>
		)
	},
	{
		id: "children",
		title: "Children's privacy",
		content: (
			<div className="section-content">
				<p>
					This project is intended for educational purposes and is not specifically
					directed at children under the age of 13. If personal data from a child
					is discovered, it will be deleted upon request.
				</p>
			</div>
		)
	},
	{
		id: "policy-changes",
		title: "Changes to this policy",
		content: (
			<div className="section-content">
				<p>
					This privacy policy may be updated during the development of the project.
					Any updates will be reflected by updating the "Last updated" date at
					the top of this page.
				</p>
			</div>
		)
	},
	{
		id: "contact",
		title: "Contact",
		content: (
			<div className="section-content">
				<p>For questions about this policy, please contact us at this address: <span>{CONTACT_EMAIL}</span>.</p>
			</div>
		)
	},
];