# Leaderboard API Documentation

## Overview

This API provides access to a leaderboard database (`leaderboards.db`) containing various gaming leaderboards. It is built using Node.js with Express and SQLite3, allowing clients to retrieve data from multiple tables with filtering capabilities.

## Base URL

```
http://localhost:3000/api
```

## General Notes

- All endpoints return JSON responses.
- Error responses include a JSON object with an `error` field describing the issue.
- Query parameters are optional and can be combined for filtering.
- The API supports CORS for cross-origin requests.
- Dates for `folder_date` and `data_date` should be in SQLite-compatible format (e.g., `YYYY-MM-DD HH:MM:SS`).
- The `name` filter uses partial matching with `LIKE` (e.g., `?name=John` matches "John", "Johnny", etc.).

## Endpoints

### Arcade

- **GET** `/arcade`

  Retrieves all records from the `Arcade` table.

  **Query Parameters**:

  - `name` (string): Filter by player name (partial match).
  - `folder_date` (datetime): Filter by folder date.
  - `data_date` (datetime): Filter by data date.

  **Example**:

  ```bash
  GET /api/arcade?name=John&folder_date=2025-05-01%2000:00:00
  ```

  **Response**:

  ```json
  [
    {
      "id": 1,
      "name": "JohnDoe",
      "count_1": 100,
      "count_2": 50,
      "count_3": 25,
      "count_4": 10,
      "count_5": 5,
      "count_6": 2,
      "count_7": 1,
      "count_8": 0,
      "count_9": 0,
      "count_10": 0,
      "folder_date": "2025-05-01 00:00:00",
      "data_date": "2025-05-01 00:00:00",
      "sync_id": "uuid-here"
    }
  ]
  ```

- **GET** `/arcade/:id`

  Retrieves a single `Arcade` record by ID.

  **Parameters**:

  - `id` (integer): The record ID.

  **Example**:

  ```bash
  GET /api/arcade/1
  ```

  **Response**:

  ```json
  {
    "id": 1,
    "name": "JohnDoe",
    "count_1": 100,
    ...
  }
  ```

### GeometryWars

- **GET** `/geometrywars`

  Retrieves all records from the `GeometryWars` table.

  **Query Parameters**:

  - `name` (string): Filter by player name (partial match).
  - `folder_date` (datetime): Filter by folder date.
  - `data_date` (datetime): Filter by data date.
  - `leaderboard_id` (integer): Filter by leaderboard ID.

  **Example**:

  ```bash
  GET /api/geometrywars?name=Player1
  ```

  **Response**:

  ```json
  [
    {
      "id": 1,
      "leaderboard_id": 15,
      "rank": 1,
      "name": "Player1",
      "hiscore": 5000,
      "folder_date": "2025-05-01 00:00:00",
      "data_date": "2025-05-01 00:00:00",
      "sync_id": "uuid-here"
    }
  ]
  ```

- **GET** `/geometrywars/:id`

  Retrieves a single `GeometryWars` record by ID.

  **Parameters**:

  - `id` (integer): The record ID.

  **Response**:

  ```json
  {
    "id": 1,
    "leaderboard_id": 101,
    "rank": 1,
    "name": "Player1",
    "hiscore": 5000,
    ...
  }
  ```

### KudosWorldSeries

- **GET** `/kudosworldseries`

  Retrieves all records from the `KudosWorldSeries` table.

  **Query Parameters**:

  - `name` (string): Filter by player name (partial match).
  - `folder_date` (datetime): Filter by folder date.
  - `data_date` (datetime): Filter by data date.
  - `leaderboard_id` (integer): Filter by leaderboard ID.

  **Example**:

  ```bash
  GET /api/kudosworldseries?leaderboard_id=38&name=Jane
  ```

  **Response**:

  ```json
  [
    {
      "id": 1,
      "leaderboard_id": 38,
      "rank": 1,
      "name": "JaneDoe",
      "data_date": "2025-05-01 00:00:00",
      "location": "Tokyo",
      "circuit": "Circuit A",
      "car": "Car X",
      "kudos": 1200,
      "folder_date": "2025-05-01 00:00:00",
      "sync_id": "uuid-here"
    }
  ]
  ```

### LeaderboardChallengeKudos

- **GET** `/leaderboardchallengekudos`

  Retrieves all records from the `LeaderboardChallengeKudos` table.

  **Query Parameters**:

  - `name` (string): Filter by player name (partial match).
  - `folder_date` (datetime): Filter by folder date.
  - `data_date` (datetime): Filter by data date.
  - `leaderboard_id` (integer): Filter by leaderboard ID.

  **Example**:

  ```bash
  GET /api/leaderboardchallengekudos?leaderboard_id=2
  ```

  **Response**:

  ```json
  [
    {
      "id": 1,
      "leaderboard_id": 2,
      "rank": 1,
      "name": "Player2",
      "data_date": "2025-05-01 00:00:00",
      "location": "London",
      "circuit": "Circuit B",
      "car": "Car Y",
      "kudos": 1500,
      "folder_date": "2025-05-01 00:00:00",
      "sync_id": "uuid-here"
    }
  ]
  ```

### LeaderboardChallengeTime

- **GET** `/leaderboardchallengetime`

  Retrieves all records from the `LeaderboardChallengeTime` table.

  **Query Parameters**:

  - `name` (string): Filter by player name (partial match).
  - `folder_date` (datetime): Filter by folder date.
  - `data_date` (datetime): Filter by data date.
  - `leaderboard_id` (integer): Filter by leaderboard ID.

  **Example**:

  ```bash
  GET /api/leaderboardchallengetime?name=Alex&leaderboard_id=271
  ```

  **Response**:

  ```json
  [
    {
      "id": 1,
      "leaderboard_id": 271,
      "rank": 1,
      "name": "Alex",
      "data_date": "2025-05-01 00:00:00",
      "location": "Paris",
      "circuit": "Circuit C",
      "car": "Car Z",
      "time": "1:23.456",
      "folder_date": "2025-05-01 00:00:00",
      "sync_id": "uuid-here"
    }
  ]
  ```

### Matches

- **GET** `/matches`

  Retrieves all records from the `Matches` table.

  **Query Parameters**:

  - `host` (string): Filter by host name.
  - `folder_date` (datetime): Filter by folder date.
  - `data_date` (datetime): Filter by data date.
  - `leaderboard_id` (integer): Filter by leaderboard ID.

  **Example**:

  ```bash
  GET /api/matches?host=Host1
  ```

  **Response**:

  ```json
  [
    {
      "id": 1,
      "leaderboard_id": 0,
      "host": "Host1",
      "players": "Player1, Player2, Player3",
      "folder_date": "2025-05-01 00:00:00",
      "data_date": "2025-05-01 00:00:00",
      "sync_id": "uuid-here"
    }
  ]
  ```

### OG

- **GET** `/og`

  Retrieves all records from the `OG` table.

  **Query Parameters**:

  - `name` (string): Filter by player name (partial match).
  - `folder_date` (datetime): Filter by folder date.
  - `data_date` (datetime): Filter by data date.
  - `leaderboard_id` (integer): Filter by leaderboard ID.

  **Example**:

  ```bash
  GET /api/og?leaderboard_id=601
  ```

  **Response**:

  ```json
  [
    {
      "id": 1,
      "leaderboard_id": 601,
      "rank": 1,
      "name": "Player3",
      "score": 3000,
      "folder_date": "2025-05-01 00:00:00",
      "data_date": "2025-05-01 00:00:00"
    },
    ...
  ]
  ```

### OfflineTop10

- **GET** `/offlinetop10`

  Retrieves all records from the `OfflineTop10` table.

  **Query Parameters**:

  - `name` (string): Filter by player name (partial match).
  - `folder_date` (datetime): Filter by folder date.
  - `data_date` (datetime): Filter by data date.

  **Example**:

  ```bash
  GET /api/offlinetop10?name=Player1
  ```

  **Response**:

  ```json
  [
    {
      "id": 1,
      "rank": 1,
      "name": "Player1",
      "score": 1000,
      "folder_date": "2025-05-01 00:00:00",
      "data_date": "2025-05-01 00:00:00",
      "sync_id": "uuid-here"
    }
  ]
  ```

### OnlineUsers

- **GET** `/onlineusers`

  Retrieves all records from the `OnlineUsers` table.

  **Query Parameters**:

  - `folder_date` (datetime): Filter by folder date.
  - `data_date` (datetime): Filter by data date.

  **Example**:

  ```bash
  GET /api/onlineusers?data_date=2025-05-01%2000:00:00
  ```

  **Response**:

  ```json
  [
    {
      "id": 1,
      "active_user_count": 50,
      "folder_date": "2025-05-01 00:00:00",
      "data_date": "2025-05-01 00:00:00"
    },
    ...
  ]
  ```

### TimeAttack

- **GET** `/timeattack`

  Retrieves all records from the `TimeAttack` table.

  **Query Parameters**:

  - `name` (string): Filter by player name (partial match).
  - `folder_date` (datetime): Filter by folder date.
  - `data_date` (datetime): Filter by data date.
  - `leaderboard_id` (integer): Filter by leaderboard ID.

  **Example**:

  ```bash
  GET /api/timeattack?leaderboard_id=271
  ```

  **Response**:

  ```json
  [
    {
      "id": 1,
      "leaderboard_id": 271,
      "rank": 1,
      "name": "Player1",
      "data_date": "2025-05-01 00:00:00",
      "location": "Tokyo",
      "circuit": "Circuit A",
      "car": "Car X",
      "time": "1:23.456",
      "folder_date": "2025-05-01 00:00:00",
      "sync_id": "uuid-here"
    }
  ]
  ```

### TimeAttackTop10

- **GET** `/timeattacktop10`

  Retrieves all records from the `TimeAttackTop10` table.

  **Query Parameters**:

  - `name` (string): Filter by player name (partial match).
  - `folder_date` (datetime): Filter by folder date.
  - `data_date` (datetime): Filter by data date.

  **Example**:

  ```bash
  GET /api/timeattacktop10?name=Player1
  ```

  **Response**:

  ```json
  [
    {
      "id": 1,
      "name": "Player1",
      "count_1": 100,
      "count_2": 50,
      "count_3": 25,
      "count_4": 10,
      "count_5": 5,
      "count_6": 2,
      "count_7": 1,
      "count_8": 0,
      "count_9": 0,
      "count_10": 0,
      "folder_date": "2025-05-01 00:00:00",
      "data_date": "2025-05-01 00:00:00",
      "sync_id": "uuid-here"
    }
  ]
  ```

### TimeAttackTop3

- **GET** `/timeattacktop3`

  Retrieves all records from the `TimeAttackTop3` table.

  **Query Parameters**:

  - `name` (string): Filter by player name (partial match).
  - `folder_date` (datetime): Filter by folder date.
  - `data_date` (datetime): Filter by data date.

  **Example**:

  ```bash
  GET /api/timeattacktop3?name=Player1
  ```

  **Response**:

  ```json
  [
    {
      "id": 1,
      "name": "Player1",
      "count_1": 100,
      "count_2": 50,
      "count_3": 25,
      "folder_date": "2025-05-01 00:00:00",
      "data_date": "2025-05-01 00:00:00",
      "sync_id": "uuid-here"
    }
  ]
  ```

### Top10

- **GET** `/top10`

  Retrieves all records from the `Top10` table.

  **Query Parameters**:

  - `name` (string): Filter by player name (partial match).
  - `folder_date` (datetime): Filter by folder date.
  - `data_date` (datetime): Filter by data date.

  **Example**:

  ```bash
  GET /api/top10?name=Player1
  ```

  **Response**:

  ```json
  [
    {
      "id": 1,
      "name": "Player1",
      "count_1": 100,
      "count_2": 50,
      "count_3": 25,
      "count_4": 10,
      "count_5": 5,
      "count_6": 2,
      "count_7": 1,
      "count_8": 0,
      "count_9": 0,
      "count_10": 0,
      "folder_date": "2025-05-01 00:00:00",
      "data_date": "2025-05-01 00:00:00",
      "sync_id": "uuid-here"
    }
  ]
  ```

### Top3

- **GET** `/top3`

  Retrieves all records from the `Top3` table.

  **Query Parameters**:

  - `name` (string): Filter by player name (partial match).
  - `folder_date` (datetime): Filter by folder date.
  - `data_date` (datetime): Filter by data date.

  **Example**:

  ```bash
  GET /api/top3?name=Player1
  ```

  **Response**:

  ```json
  [
    {
      "id": 1,
      "name": "Player1",
      "count_1": 100,
      "count_2": 50,
      "count_3": 25,
      "folder_date": "2025-05-01 00:00:00",
      "data_date": "2025-05-01 00:00:00",
      "sync_id": "uuid-here"
    }
  ]
  ```

### XBLCity

- **GET** `/xblcity`

  Retrieves all records from the `XBLCity` table.

  **Query Parameters**:

  - `name` (string): Filter by player name (partial match).
  - `folder_date` (datetime): Filter by folder date.
  - `data_date` (datetime): Filter by data date.

  **Example**:

  ```bash
  GET /api/xblcity?name=CityRacer
  ```

  **Response**:

  ```json
  [
    {
      "id": 1,
      "leaderboard_id": 801,
      "rank": 1,
      "name": "CityRacer",
      "kudos": 2000,
      "folder_date": "2025-05-01 00:00:00",
      "data_date": "2025-05-01 00:00:00"
    },
    ...
  ]
  ```

### XBLCityRaces

- **GET** `/xblcityraces`

  Retrieves all records from the `XBLCityRaces` table.

  **Query Parameters**:

  - `name` (string): Filter by player name (partial match).
  - `folder_date` (datetime): Filter by folder date.
  - `data_date` (datetime): Filter by data date.

  **Example**:

  ```bash
  GET /api/xblcityraces?name=RaceStar
  ```

  **Response**:

  ```json
  [
    {
      "id": 1,
      "leaderboard_id": 901,
      "name": "RaceStar",
      "track": "Track A",
      "opponents": 5,
      "car": "Car V",
      "race_date": "2025-05-01 00:00:00",
      "kudos": 500,
      "folder_date": "2025-05-01 00:00:00",
      "data_date": "2025-05-01 00:00:00"
    },
    ...
  ]
  ```

### XBLTotal

- **GET** `/xbltotal`

  Retrieves all records from the `XBLTotal` table.

  **Query Parameters**:

  - `name` (string): Filter by player name (partial match).
  - `folder_date` (datetime): Filter by folder date.
  - `data_date` (datetime): Filter by data date.
  - `leaderboard_id` (integer): Filter by leaderboard ID.

  **Example**:

  ```bash
  GET /api/xbltotal?name=Player1
  ```

  **Response**:

  ```json
  [
    {
      "id": 1,
      "leaderboard_id": 1,
      "rank": 1,
      "name": "Player1",
      "first_place_finishes": 100,
      "second_place_finishes": 50,
      "third_place_finishes": 25,
      "races_completed": 175,
      "kudos_rank": 1,
      "kudos": 10000,
      "folder_date": "2025-05-01 00:00:00",
      "data_date": "2025-05-01 00:00:00",
      "sync_id": "uuid-here"
    }
  ]
  ```

## Error Handling

- **400 Bad Request**: Invalid query parameters or malformed request.
- **404 Not Found**: Requested resource (e.g., specific ID) not found.
- **500 Internal Server Error**: Database or server error.

```json
{
  "error": "Error message describing the issue"
}
```

## Setup Instructions

1. Ensure Node.js is installed.
2. Install dependencies:

   ```bash
   npm install express sqlite3 cors
   ```

3. Place the `leaderboards.db` SQLite database file in the same directory as `server.js`.
4. Run the server:

   ```bash
   node server.js
   ```

5. The API will be available at `http://localhost:3000/api`.

## Notes

- Ensure the SQLite database file (`leaderboards.db`) is accessible and contains the schema as defined.
- The API assumes the database tables are populated with data.
- For production, consider adding authentication, rate limiting, and input validation.
- The server runs on port 3000 by default; modify the `port` variable in `server.js` if needed.