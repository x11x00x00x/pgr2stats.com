BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "Arcade" (
	"id"	INTEGER,
	"name"	TEXT NOT NULL,
	"count_1"	INTEGER,
	"count_2"	INTEGER,
	"count_3"	INTEGER,
	"count_4"	INTEGER,
	"count_5"	INTEGER,
	"count_6"	INTEGER,
	"count_7"	INTEGER,
	"count_8"	INTEGER,
	"count_9"	INTEGER,
	"count_10"	INTEGER,
	"folder_date"	DATETIME,
	"data_date"	DATETIME,
	"sync_id"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "GeometryWars" (
	"id"	INTEGER,
	"leaderboard_id"	INTEGER NOT NULL,
	"rank"	INTEGER NOT NULL,
	"name"	TEXT NOT NULL,
	"hiscore"	INTEGER,
	"folder_date"	DATETIME,
	"data_date"	DATETIME,
	"sync_id"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "KudosWorldSeries" (
	"id"	INTEGER,
	"leaderboard_id"	INTEGER NOT NULL,
	"rank"	INTEGER NOT NULL,
	"name"	TEXT NOT NULL,
	"data_date"	DATETIME,
	"location"	TEXT,
	"circuit"	TEXT,
	"car"	TEXT,
	"kudos"	INTEGER,
	"folder_date"	DATETIME,
	"sync_id"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "LatestChanges" (
	"id"	INTEGER,
	"leaderboard_id"	INTEGER NOT NULL,
	"leaderboard"	TEXT NOT NULL,
	"name"	TEXT NOT NULL,
	"oldRank"	INTEGER NOT NULL,
	"newRank"	INTEGER NOT NULL,
	"oldScore"	INTEGER NOT NULL,
	"newScore"	INTEGER NOT NULL,
	"folder_date"	DATETIME,
	"data_date"	DATETIME,
	"sync_id"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "LeaderboardChallengeKudos" (
	"id"	INTEGER,
	"leaderboard_id"	INTEGER NOT NULL,
	"rank"	INTEGER NOT NULL,
	"name"	TEXT NOT NULL,
	"data_date"	DATETIME,
	"location"	TEXT,
	"circuit"	TEXT,
	"car"	TEXT,
	"kudos"	INTEGER,
	"folder_date"	DATETIME,
	"sync_id"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "LeaderboardChallengeTime" (
	"id"	INTEGER,
	"leaderboard_id"	INTEGER NOT NULL,
	"rank"	INTEGER NOT NULL,
	"name"	TEXT NOT NULL,
	"data_date"	DATETIME,
	"location"	TEXT,
	"circuit"	TEXT,
	"car"	TEXT,
	"time"	TEXT,
	"folder_date"	DATETIME,
	"sync_id"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "Matches" (
	"id"	INTEGER,
	"leaderboard_id"	INTEGER NOT NULL,
	"host"	TEXT NOT NULL,
	"players"	TEXT,
	"folder_date"	DATETIME,
	"data_date"	DATETIME,
	"sync_id"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "OG" (
	"id"	INTEGER,
	"leaderboard_id"	INTEGER NOT NULL,
	"rank"	INTEGER NOT NULL,
	"name"	TEXT NOT NULL,
	"score"	INTEGER,
	"folder_date"	DATETIME,
	"data_date"	DATETIME,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "OfflineTop10" (
	"id"	INTEGER,
	"rank"	INTEGER NOT NULL,
	"name"	TEXT NOT NULL,
	"score"	INTEGER,
	"folder_date"	DATETIME,
	"data_date"	DATETIME,
	"sync_id"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "OnlineUsers" (
	"id"	INTEGER,
	"active_user_count"	INTEGER,
	"folder_date"	DATETIME,
	"data_date"	DATETIME,
	"sync_id"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "Sync" (
	"id"	INTEGER NOT NULL UNIQUE,
	"sync_id"	TEXT,
	"sync_date"	DATETIME,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "TimeAttack" (
	"id"	INTEGER,
	"leaderboard_id"	INTEGER NOT NULL,
	"rank"	INTEGER NOT NULL,
	"name"	TEXT NOT NULL,
	"data_date"	DATETIME,
	"location"	TEXT,
	"circuit"	TEXT,
	"car"	TEXT,
	"time"	TEXT,
	"folder_date"	DATETIME,
	"sync_id"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "TimeAttackTop10" (
	"id"	INTEGER,
	"name"	TEXT NOT NULL,
	"count_1"	INTEGER,
	"count_2"	INTEGER,
	"count_3"	INTEGER,
	"count_4"	INTEGER,
	"count_5"	INTEGER,
	"count_6"	INTEGER,
	"count_7"	INTEGER,
	"count_8"	INTEGER,
	"count_9"	INTEGER,
	"count_10"	INTEGER,
	"folder_date"	DATETIME,
	"data_date"	DATETIME,
	"sync_id"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "TimeAttackTop3" (
	"id"	INTEGER,
	"name"	TEXT NOT NULL,
	"count_1"	INTEGER,
	"count_2"	INTEGER,
	"count_3"	INTEGER,
	"folder_date"	DATETIME,
	"data_date"	DATETIME,
	"sync_id"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "Top10" (
	"id"	INTEGER,
	"name"	TEXT NOT NULL,
	"count_1"	INTEGER,
	"count_2"	INTEGER,
	"count_3"	INTEGER,
	"count_4"	INTEGER,
	"count_5"	INTEGER,
	"count_6"	INTEGER,
	"count_7"	INTEGER,
	"count_8"	INTEGER,
	"count_9"	INTEGER,
	"count_10"	INTEGER,
	"folder_date"	DATETIME,
	"data_date"	DATETIME,
	"sync_id"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "Top3" (
	"id"	INTEGER,
	"name"	TEXT NOT NULL,
	"count_1"	INTEGER,
	"count_2"	INTEGER,
	"count_3"	INTEGER,
	"folder_date"	DATETIME,
	"data_date"	DATETIME,
	"sync_id"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "XBLCity" (
	"id"	INTEGER,
	"leaderboard_id"	INTEGER NOT NULL,
	"rank"	INTEGER NOT NULL,
	"name"	TEXT NOT NULL,
	"kudos"	INTEGER,
	"folder_date"	DATETIME,
	"data_date"	DATETIME,
	"sync_id"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "XBLCityRaces" (
	"id"	INTEGER,
	"leaderboard_id"	INTEGER NOT NULL,
	"name"	TEXT NOT NULL,
	"track"	TEXT NOT NULL,
	"opponents"	INTEGER,
	"car"	TEXT,
	"race_date"	DATETIME,
	"kudos"	INTEGER,
	"folder_date"	DATETIME,
	"data_date"	DATETIME,
	"sync_id"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("leaderboard_id","name") REFERENCES "XBLCity"("leaderboard_id","name")
);
CREATE TABLE IF NOT EXISTS "XBLTotal" (
	"id"	INTEGER,
	"leaderboard_id"	INTEGER NOT NULL,
	"rank"	INTEGER NOT NULL,
	"name"	TEXT NOT NULL,
	"first_place_finishes"	INTEGER,
	"second_place_finishes"	INTEGER,
	"third_place_finishes"	INTEGER,
	"races_completed"	INTEGER,
	"kudos_rank"	INTEGER,
	"kudos"	INTEGER,
	"folder_date"	DATETIME,
	"data_date"	DATETIME,
	"sync_id"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);
COMMIT;
