CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";

CREATE TABLE app_user (
	app_user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	first_name VARCHAR(255),
	last_name VARCHAR(255),
	username VARCHAR(15) UNIQUE NOT NULL,
	mail_address VARCHAR(255) UNIQUE NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
	-- password
	-- deletion_date
	-- friend_list
	-- online
	-- status
	-- chat
	-- role
	-- region
	-- last_connection
	-- avatar

CREATE TABLE game_profile (
	profile_id UUID PRIMARY KEY,
	total_games INT DEFAULT 0,
	total_loses INT DEFAULT 0,
	total_wins INT DEFAULT 0,
	total_ennemies_killed INT DEFAULT 0,
	total_xp INT DEFAULT 0,
	"level" INT DEFAULT 0,
	CONSTRAINT fk_game_profile_user
		FOREIGN KEY (profile_id)
		REFERENCES app_user(app_user_id)
		ON DELETE CASCADE
);

CREATE TABLE friendship (
	sender_id UUID,
	receiver_id UUID,
	"status" VARCHAR(10) NOT NULL DEFAULT 'waiting',
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

	PRIMARY KEY (sender_id, receiver_id),

	CONSTRAINT fk_friendship_sender
		FOREIGN KEY (sender_id)
		REFERENCES app_user(app_user_id)
		ON DELETE CASCADE,

	CONSTRAINT fk_friendship_receiver
		FOREIGN KEY (receiver_id)
		REFERENCES app_user(app_user_id)
		ON DELETE CASCADE,

	CONSTRAINT chk_friendship_not_self
		CHECK (sender_id <> receiver_id)
);

-- friendship_id PRIMARY KEY (sender_id, receiver_id),
-- friendship_id UUID PRIMARY KEY (send_by, send_to),

-- CREATE TABLE game_matches (
-- 	game_id
-- 	players
-- 	map
-- 	date
-- 	completion_time
-- 	results
-- 	winner
-- );

-- CREATE TABLE game_result (
-- 	result_id
-- 	player
-- 	ennemies_killed
-- 	completion_time
-- 	gained_xp
-- );

-- CREATE TABLE chat (
-- 	chat_id
-- 	members
-- 	banned_users
-- 	type
-- 	creation_date
-- 	deletion_date
-- 	chat_history
-- 	state
-- 	moderators
-- 	read-only
-- );

-- CREATE TABLE chat_history (
-- 	comment_id
-- 	comment
-- 	status
-- 	posted_by
-- 	posted_in
-- 	posting_date
-- 	deletion_date
-- 	moderated_by
-- );

-- CREATE TABLE chat_member (
-- 	user_id
-- 	role
-- 	chat_id
-- 	role_assigned_at
-- 	joined_at
-- );

-- CREATE TABLE banlist (
-- 	ban_id
-- 	ban_type
-- 	banned_at
-- 	expires_at
-- 	reason
-- 	chat_id
-- 	banned_by
-- 	banned_person
-- );
