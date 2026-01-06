CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE user (
	user_id UUID DEFAULT uuid_generate_v4()
	first_name
	last_name
	mail_address
	password
	friend_list
	online
	creation_date
	deletion_date
	status
	chat
	role
	region
	last_connection
	avatar
);

CREATE TABLE friendship (
	friend_id
	sender
	receiver
	status
);

CREATE TABLE game_profile (
	user_id
	total_games
	total_loses
	total_wins
	total_ennemies_killed
	total_xp
	level
);

CREATE TABLE GAME (
	game_id
	players
	map
	date
	completion_time
	results
	winner
);

CREATE TABLE GAME_RESULT (
	result_id
	player
	ennemies_killed
	completion_time
	gained_xp
);

CREATE TABLE CHAT (
	chat_id
	members
	banned_users
	type
	creation_date
	deletion_date
	chat_history
	state
	moderators
	read-only
);

CREATE TABLE CHAT_HISTORY (
	comment_id
	comment
	status
	posted_by
	posted_in
	posting_date
	deletion_date
	moderated_by
);

CREATE TABLE CHAT_MEMBERS (
	user_id
	role
	chat_id
	role_assigned_at
	joined_at
);

CREATE TABLE BANLIST (
	ban_id
	ban_type
	banned_at
	expires_at
	reason
	chat_id
	banned_by
	banned_person
);
