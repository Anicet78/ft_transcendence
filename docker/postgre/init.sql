CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext"; --case insensitive text

-- Function: set_updated_at
-- Sets NEW.updated_at to current timestamp on UPDATE
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
	NEW.updated_at = CURRENT_TIMESTAMP;
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: normalize_mail_address
-- Lowercases mail_address on INSERT or UPDATE
CREATE OR REPLACE FUNCTION normalize_mail_address()
RETURNS TRIGGER AS $$
BEGIN
	IF NEW.mail_address IS NOT NULL THEN
		NEW.mail_address = lower(NEW.mail_address);
	END IF;
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TYPE region_list AS ENUM ('EU', 'NA', 'SAM', 'MENA', 'OCE', 'APAC', 'SSA', 'Deleted');

CREATE TABLE app_user (
	app_user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	first_name TEXT NOT NULL,
	last_name TEXT NOT NULL,
	username TEXT UNIQUE NOT NULL,
	mail_address CITEXT UNIQUE NOT NULL,
	password_hash TEXT NOT NULL,
	-- avatar --img
	avatar_url TEXT,

	"availability" BOOLEAN NOT NULL DEFAULT false,
	playing BOOLEAN NOT NULL DEFAULT false,
	region region_list NOT NULL,

	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
	deleted_at timestamptz,
	last_connected_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,

	CHECK (trim(first_name) <> ''),
	CHECK (trim(last_name) <> ''),
	CHECK (trim(username) <> ''),
	CHECK (trim(mail_address) <> '')
);

CREATE TABLE user_role (
	user_role_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	attributed_to UUID,
	attributed_by UUID,

	"role" VARCHAR(20) NOT NULL DEFAULT 'guest',

	created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
	deleted_at timestamptz,

	CONSTRAINT fk_role_receiver
		FOREIGN KEY (attributed_to)
		REFERENCES app_user(app_user_id),

	CONSTRAINT fk_role_giver
		FOREIGN KEY (attributed_by)
		REFERENCES app_user(app_user_id),

	CHECK ("role" IN ('guest', 'user', 'app_admin'))
);

CREATE TABLE ban_list (
	ban_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	user_id UUID,

	banned_by UUID,
	banned_at timestamptz DEFAULT CURRENT_TIMESTAMP,
	reason TEXT,
	expires_at timestamptz,
	updated_at timestamptz,
	deleted_at timestamptz,

	FOREIGN KEY (user_id)
		REFERENCES app_user(app_user_id),

	FOREIGN KEY (banned_by)
		REFERENCES app_user(app_user_id)
);

CREATE TABLE blocked_list (
	blocked_list UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	blocker UUID,
	blocked UUID,

	created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
	deleted_at timestamptz,

	FOREIGN KEY (blocker)
		REFERENCES app_user(app_user_id),

	FOREIGN KEY (blocked)
		REFERENCES app_user(app_user_id)
);


CREATE TABLE friendship (
	friendship_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	sender_id UUID,
	receiver_id UUID,
	"status" VARCHAR(10) NOT NULL DEFAULT 'waiting',
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
	deleted_at timestamptz,

	-- CONSTRAINT friendship_id
	-- 	PRIMARY KEY (sender_id, receiver_id),

	CONSTRAINT fk_friendship_sender
		FOREIGN KEY (sender_id)
		REFERENCES app_user(app_user_id),

	CONSTRAINT fk_friendship_receiver
		FOREIGN KEY (receiver_id)
		REFERENCES app_user(app_user_id),

	CONSTRAINT chk_friendship_not_self
		CHECK (sender_id <> receiver_id),

	CHECK ("status" IN ('waiting', 'accepted', 'rejected', 'cancelled', 'deleted'))
);

CREATE TABLE game_profile (
	game_profile_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	user_id UUID UNIQUE NOT NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
	deleted_at timestamptz,
	total_games INT NOT NULL DEFAULT 0,
	total_wins INT NOT NULL DEFAULT 0,
	total_loses INT NOT NULL DEFAULT 0,
	total_ennemies_killed INT NOT NULL DEFAULT 0,
	total_xp INT NOT NULL DEFAULT 0,
	"level" INT NOT NULL DEFAULT 0,
	best_time INT NOT NULL DEFAULT 0, --minutes ? seconds ?

	CONSTRAINT fk_game_profile_user_id
		FOREIGN KEY (user_id)
		REFERENCES app_user(app_user_id)

	-- CONSTRAINT fk_game_profile_user
	-- 	FOREIGN KEY (game_profile_id)
	-- 	REFERENCES app_user(app_user_id)
	-- 	ON DELETE CASCADE
);

CREATE TABLE game_session (
	session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
	deleted_at timestamptz,
	map_name VARCHAR(100) NOT NULL,

	started_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
	ended_at timestamptz,

	"status" VARCHAR(20) NOT NULL DEFAULT 'finished',

    CONSTRAINT chk_game_status
        CHECK (status IN ('pending', 'running', 'finished', 'aborted'))
);

CREATE TABLE game_result (
	game_result_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	game_id UUID,
	player_id UUID,

	created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
	deleted_at timestamptz,

	completion_time INT, -- minutes ? seconds ?
	ennemies_killed INT NOT NULL DEFAULT 0,
	gained_xp INT NOT NULL DEFAULT 0,
	is_winner BOOLEAN NOT NULL DEFAULT false,

	-- CONSTRAINT game_result_pk
	-- 	PRIMARY KEY (game_id, player_id),

	CONSTRAINT fk_game_result_match
		FOREIGN KEY (game_id)
		REFERENCES game_session(session_id),

	CONSTRAINT fk_game_result_user
		FOREIGN KEY (player_id)
		REFERENCES app_user(app_user_id)
		-- ON DELETE CASCADE
);


CREATE TYPE type_list AS ENUM ('private', 'group');

CREATE TABLE chat (
	chat_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

	created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
	deleted_at timestamptz,

	chat_type type_list DEFAULT 'private',
	chat_name citext,
	created_by UUID,

	CONSTRAINT fk_created_by
		FOREIGN KEY (created_by)
		REFERENCES app_user(app_user_id)

	-- CHECK (chat_type IN ('private', 'group'))
);

CREATE TABLE chat_invitation (
	chat_invitation_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	sender_id UUID,
	receiver_id UUID,
	chat_id UUID,
	"status" VARCHAR(10) NOT NULL DEFAULT 'waiting',
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
	deleted_at timestamptz,

	CONSTRAINT fk_chat_ivitate_sender
		FOREIGN KEY (sender_id)
		REFERENCES app_user(app_user_id),

	CONSTRAINT fk_chat_ivitate_receiver
		FOREIGN KEY (receiver_id)
		REFERENCES app_user(app_user_id),

	CONSTRAINT fk_chat_id
		FOREIGN KEY (chat_id)
		REFERENCES chat(chat_id),

	CONSTRAINT chk_chat_ivitate_not_self
		CHECK (sender_id <> receiver_id),

	CHECK ("status" IN ('waiting', 'accepted', 'rejected', 'cancelled', 'deleted'))
);

CREATE TABLE chat_invitation (
	chat_invitation_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	sender_id UUID,
	receiver_id UUID,
	chat_id UUID,
	"status" VARCHAR(10) NOT NULL DEFAULT 'waiting',
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
	deleted_at timestamptz,

	CONSTRAINT fk_chat_ivitate_sender
		FOREIGN KEY (sender_id)
		REFERENCES app_user(app_user_id),

	CONSTRAINT fk_chat_ivitate_receiver
		FOREIGN KEY (receiver_id)
		REFERENCES app_user(app_user_id),

	CONSTRAINT fk_chat_id
		FOREIGN KEY (chat_id)
		REFERENCES chat(chat_id),

	CONSTRAINT chk_chat_ivitate_not_self
		CHECK (sender_id <> receiver_id),

	CHECK ("status" IN ('waiting', 'accepted', 'rejected', 'cancelled', 'deleted'))
);

CREATE TABLE chat_member (
	chat_member_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	chat_id UUID,
	user_id UUID,

	created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
	deleted_at timestamptz,

	joined_at timestamptz DEFAULT CURRENT_TIMESTAMP,
	left_at timestamptz,

	-- CONSTRAINT chat_member_id
	-- 	PRIMARY KEY (chat_id, user_id),

	FOREIGN KEY (chat_id)
		REFERENCES chat(chat_id),

	FOREIGN KEY (user_id)
		REFERENCES app_user(app_user_id)
);

CREATE TABLE private_chat (
	private_chat_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	user1_id UUID,
	user2_id UUID,
	chat_id UUID,

	created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
	deleted_at timestamptz,

	CONSTRAINT chk_private_chat_order_check
		CHECK (user1_id < user2_id),

	CONSTRAINT chk_private_chat_unique_pair
		UNIQUE (user1_id, user2_id),

	FOREIGN KEY (user1_id)
		REFERENCES app_user(app_user_id),

	FOREIGN KEY (user2_id)
		REFERENCES app_user(app_user_id),

	FOREIGN KEY (chat_id)
		REFERENCES chat(chat_id)
);

CREATE TYPE chat_role_type AS ENUM ('owner', 'admin', 'moderator', 'writer', 'member');

CREATE TABLE chat_role (
	chat_role_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	chat_id UUID,
	user_id UUID,
	"role" chat_role_type NOT NULL DEFAULT 'member',

	attributed_by UUID,
	attributed_at timestamptz DEFAULT CURRENT_TIMESTAMP,
	modified_at timestamptz,
	deleted_at timestamptz,

	-- CONSTRAINT chat_role_id
	-- 	PRIMARY KEY (chat_id, user_id, "role"),

	FOREIGN KEY (user_id)
		REFERENCES app_user(app_user_id),

	FOREIGN KEY (chat_id)
		REFERENCES chat(chat_id),

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

	posted_at timestamptz DEFAULT CURRENT_TIMESTAMP,
	edited_at timestamptz,
	deleted_at timestamptz,
	moderated_by UUID,

	FOREIGN KEY (chat_id)
		REFERENCES chat(chat_id),

	FOREIGN KEY (user_id)
		REFERENCES app_user(app_user_id),

	FOREIGN KEY (moderated_by)
		REFERENCES app_user(app_user_id)
);

CREATE TABLE chat_ban (
	chat_ban_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	chat_id UUID,
	user_id UUID,

	banned_by UUID,
	banned_at timestamptz DEFAULT CURRENT_TIMESTAMP,
	reason TEXT,
	expires_at timestamptz,
	updated_at timestamptz,
	deleted_at timestamptz,

	FOREIGN KEY (chat_id)
		REFERENCES chat(chat_id),

	FOREIGN KEY (user_id)
		REFERENCES app_user(app_user_id),

	FOREIGN KEY (banned_by)
		REFERENCES app_user(app_user_id)
);

-- CREATE OR REPLACE FUNCTION trigger_set_updated_at()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   NEW.updated_at = CURRENT_TIMESTAMP;
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- -- attach to tables you want auto-updated
-- CREATE TRIGGER trg_app_user_updated_at
-- BEFORE UPDATE ON app_user
-- FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- CREATE TRIGGER trg_game_profile_updated_at
-- BEFORE UPDATE ON game_profile
-- FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
