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
	-- "role" VARCHAR(20) NOT NULL DEFAULT 'guest',
	region VARCHAR(50),

	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	deleted_at TIMESTAMP,
	last_connected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

	CHECK (trim(first_name) <> ''),
	CHECK (trim(last_name) <> ''),
	CHECK (trim(username) <> ''),
	CHECK (trim(mail_address) <> '')
	-- CHECK ("role" IN ('guest', 'user', 'app_admin', 'banned_user'))
);

CREATE TABLE user_role (
	user_role_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	attributed_to UUID,
	attributed_by UUID,

	"role" VARCHAR(20) NOT NULL DEFAULT 'guest',

	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	deleted_at TIMESTAMP,

	CONSTRAINT fk_role_receiver
		FOREIGN KEY (attributed_to)
		REFERENCES app_user(app_user_id)
		-- ON DELETE CASCADE,

	CONSTRAINT fk_role_giver
		FOREIGN KEY (attributed_by)
		REFERENCES app_user(app_user_id)
		-- ON DELETE CASCADE,

	CHECK ("role" IN ('guest', 'user', 'app_admin', 'banned_user'))
);

CREATE TABLE friendship (
	sender_id UUID,
	receiver_id UUID,
	"status" VARCHAR(10) NOT NULL DEFAULT 'waiting',
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	deleted_at TIMESTAMP,

	CONSTRAINT friendship_id
		PRIMARY KEY (sender_id, receiver_id),

	CONSTRAINT fk_friendship_sender
		FOREIGN KEY (sender_id)
		REFERENCES app_user(app_user_id)
		-- ON DELETE CASCADE,

	CONSTRAINT fk_friendship_receiver
		FOREIGN KEY (receiver_id)
		REFERENCES app_user(app_user_id)
		-- ON DELETE CASCADE,

	CONSTRAINT chk_friendship_not_self
		CHECK (sender_id <> receiver_id),
	
	CHECK ("status" IN ('waiting', 'accepted', 'rejected', 'deleted'))
);

CREATE TABLE game_profile (
	game_profile_id UUID PRIMARY KEY,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	deleted_at TIMESTAMP,
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
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	deleted_at TIMESTAMP,
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

	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	deleted_at TIMESTAMP,

	completion_time INT, -- minutes ? seconds ?
	ennemies_killed INT NOT NULL DEFAULT 0,
	gained_xp INT NOT NULL DEFAULT 0,
	is_winner BOOLEAN NOT NULL DEFAULT false,

	CONSTRAINT game_result_pk
		PRIMARY KEY (game_id, player_id),

	CONSTRAINT fk_game_result_match
		FOREIGN KEY (game_id)
		REFERENCES game_session(session_id)
		-- ON DELETE CASCADE,

	CONSTRAINT fk_game_result_user
		FOREIGN KEY (player_id)
		REFERENCES app_user(app_user_id)
		ON DELETE CASCADE
);

CREATE TABLE chat (
	chat_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	deleted_at TIMESTAMP,

	chat_type VARCHAR(20) NOT NULL DEFAULT 'private',
	chat_name VARCHAR(255) NOT NULL,
	-- chat_history

	CHECK (chat_type IN ('private', 'group'))
);

CREATE TABLE chat_member (
	chat_id UUID,
	user_id UUID,

	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	deleted_at TIMESTAMP,

	joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	left_at TIMESTAMP,

	CONSTRAINT chat_member_id
		PRIMARY KEY (chat_id, user_id),

	FOREIGN KEY (chat_id)
		REFERENCES chat(chat_id)
		-- ON DELETE CASCADE,

	FOREIGN KEY (user_id)
		REFERENCES app_user(app_user_id)
		-- ON DELETE CASCADE
);

CREATE TABLE private_chat (
	private_chat_id UUID PRIMARY KEY,
	user1_id UUID,
	user2_id UUID,

	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	deleted_at TIMESTAMP,

	FOREIGN KEY (user1_id)
		REFERENCES app_user(app_user_id)

	FOREIGN KEY (user2_id)
		REFERENCES app_user(app_user_id)

	UNIQUE (LEAST(user1_id, user2_id), GREATEST(user1_id, user2_id))
);

CREATE TYPE chat_role_type AS ENUM ('owner', 'admin', 'moderator', 'read_only');

CREATE TABLE chat_role (
	chat_id UUID,
	user_id UUID,
	"role" chat_role_type NOT NULL,

	attributed_by UUID,
	attributed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	modified_at TIMESTAMP,
	deleted_at TIMESTAMP,

	CONSTRAINT chat_role_id
		PRIMARY KEY (chat_id, user_id, "role"),

	FOREIGN KEY (user_id)
		REFERENCES app_user(app_user_id)
		-- ON DELETE CASCADE,

	FOREIGN KEY (chat_id)
		REFERENCES chat(chat_id)
		-- ON DELETE CASCADE,

	FOREIGN KEY (attributed_by)
		REFERENCES app_user(app_user_id)
);

CREATE TYPE message_status AS ENUM ('posted', 'edited', 'deleted', 'moderated');

CREATE TABLE chat_message (
	message_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	chat_id UUID NOT NULL,
	user_id UUID NOT NULL,

	content TEXT NOT NULL,
	"status" message_status NOT NULL DEFAULT 'posted',

	posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	edited_at TIMESTAMP,
	deleted_at TIMESTAMP,
	moderated_by UUID,

	FOREIGN KEY (chat_id)
		REFERENCES chat(chat_id)
		-- ON DELETE CASCADE,

	FOREIGN KEY (user_id)
		REFERENCES app_user(app_user_id)
		-- ON DELETE SET NULL,

	FOREIGN KEY (moderated_by)
		REFERENCES app_user(app_user_id)
);

CREATE TABLE chat_ban (
	chat_id UUID,
	user_id UUID,

	banned_by UUID,
	banned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	reason TEXT,
	expires_at TIMESTAMP,
	updated_at TIMESTAMP,
	deleted_at TIMESTAMP,

	PRIMARY KEY (chat_id, user_id),

	FOREIGN KEY (chat_id)
		REFERENCES chat(chat_id)
		-- ON DELETE CASCADE,

	FOREIGN KEY (user_id)
		REFERENCES app_user(app_user_id)
		-- ON DELETE CASCADE,

	FOREIGN KEY (banned_by)
		REFERENCES app_user(app_user_id)
);
