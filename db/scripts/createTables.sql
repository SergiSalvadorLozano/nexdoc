CREATE TABLE IF NOT EXISTS "user" (
	"id" serial,
	PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "contact" (
	"user_id_1" integer,
	"user_id_2" integer,
	PRIMARY KEY ("user_id_1", "user_id_2"),
	FOREIGN KEY ("user_id_1") REFERENCES "user" ("id"),
	FOREIGN KEY ("user_id_2") REFERENCES "user" ("id")
);

CREATE TABLE IF NOT EXISTS "group" (
	"id" serial,
	PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "member" (
	"user_id" integer,
	"group_id" integer,
	PRIMARY KEY ("user_id", "group_id"),
	FOREIGN KEY ("user_id") REFERENCES "user" ("id"),
	FOREIGN KEY ("group_id") REFERENCES "group" ("id")
);

CREATE TABLE IF NOT EXISTS "conversation" (
	"id" serial,
	PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "groupConversation" (
	"conversation_id" integer,
	PRIMARY KEY ("conversation_id"),
	FOREIGN KEY ("conversation_id") REFERENCES "conversation" ("id")
);

CREATE TABLE IF NOT EXISTS "comment" (
	"id" serial,
	"user_id" integer NOT NULL,
	"conversation_id" integer NOT NULL,
	PRIMARY KEY ("id"),
	FOREIGN KEY ("user_id") REFERENCES "user" ("id"),
	FOREIGN KEY ("conversation_id") REFERENCES "conversation" ("id")
);

CREATE TABLE IF NOT EXISTS "exercise" (
	"id" serial,
	"user_id" integer NOT NULL,
	PRIMARY KEY ("id"),
	FOREIGN KEY ("user_id") REFERENCES "user" ("id")
);

CREATE TABLE IF NOT EXISTS "proposed" (
	"exercise_id" integer,
	"group_id" integer,
	PRIMARY KEY ("exercise_id", "group_id"),
	FOREIGN KEY ("exercise_id") REFERENCES "exercise" ("id"),
	FOREIGN KEY ("group_id") REFERENCES "group" ("id")
);

CREATE TABLE IF NOT EXISTS "answer" (
	"user_id" integer,
	"exercise_id" integer,
	"conversation_id" integer UNIQUE NOT NULL,
	PRIMARY KEY ("user_id", "exercise_id"),
	FOREIGN KEY ("user_id") REFERENCES "user" ("id"),
	FOREIGN KEY ("exercise_id") REFERENCES "exercise" ("id")
)