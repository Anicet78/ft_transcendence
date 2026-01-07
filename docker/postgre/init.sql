CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";

CREATE TABLE app_user (
	app_user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	first_name VARCHAR(255) NOT NULL,
	last_name VARCHAR(255) NOT NULL,
	username VARCHAR(15) UNIQUE NOT NULL,
	mail_address VARCHAR(255) UNIQUE NOT NULL,
	password_hash TEXT NOT NULL,
	-- avatar --img
	avatar_url TEXT,

	"availability" BOOLEAN NOT NULL DEFAULT false,
	"role" VARCHAR(20) NOT NULL DEFAULT 'guest',
	region VARCHAR(50),

	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	deleted_at TIMESTAMP,
	last_connected_at TIMESTAMP DEFAULT created_at,

	CHECK (trim(first_name) <> ''),
	CHECK (trim(last_name) <> ''),
	CHECK (trim(username) <> ''),
	CHECK (trim(mail_address) <> ''),
	CHECK (role IN ('guest', 'user', 'app_admin', 'banned_user'))
);

CREATE TABLE friendship (
	sender_id UUID,
	receiver_id UUID,
	"status" VARCHAR(10) NOT NULL DEFAULT 'waiting',
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT friendship_id
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
	
	CHECK (role IN ('waiting', 'accepted', 'rejected'))
);

CREATE TABLE game_profile (
	game_profile_id UUID PRIMARY KEY,
	total_games INT DEFAULT 0,
	total_wins INT DEFAULT 0,
	total_loses INT DEFAULT 0,
	total_ennemies_killed INT DEFAULT 0,
	total_xp INT DEFAULT 0,
	"level" INT DEFAULT 0,
	best_time INT, --minutes ? seconds ?

	CONSTRAINT fk_game_profile_user
		FOREIGN KEY (game_profile_id)
		REFERENCES app_user(app_user_id)
		ON DELETE CASCADE
);

CREATE TABLE game_session (
	session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	map_name VARCHAR(100) NOT NULL,

	started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	ended_at TIMESTAMP,

	"status" VARCHAR(20) NOT NULL DEFAULT 'finished',

    CONSTRAINT chk_game_status
        CHECK (status IN ('pending', 'running', 'finished', 'aborted'))
);

CREATE TABLE game_result (
	game_id UUID,
	player_id UUID,

	completion_time INT, -- minutes ? seconds ?
	ennemies_killed INT NOT NULL DEFAULT 0,
	gained_xp INT NOT NULL DEFAULT 0,
	is_winner BOOLEAN NOT NULL DEFAULT false,

	CONSTRAINT game_result_pk
		PRIMARY KEY (game_id, player_id),

    CONSTRAINT fk_game_result_match
        FOREIGN KEY (game_id)
        REFERENCES game_session(session_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_game_result_user
        FOREIGN KEY (player_id)
        REFERENCES app_user(app_user_id)
        ON DELETE CASCADE
);

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



-- CREATE TABLE chat (
--     chat_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--     name VARCHAR(100),
--     type VARCHAR(10) NOT NULL, -- private, group
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE chat_member (
--     chat_id UUID,
--     user_id UUID,
--     role VARCHAR(10) DEFAULT 'member',
--     joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

--     PRIMARY KEY (chat_id, user_id),

--     FOREIGN KEY (chat_id) REFERENCES chat(chat_id) ON DELETE CASCADE,
--     FOREIGN KEY (user_id) REFERENCES app_user(app_user_id) ON DELETE CASCADE
-- );
