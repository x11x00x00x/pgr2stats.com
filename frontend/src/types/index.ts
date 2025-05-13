export interface LeaderboardEntry {
  rank: string;
  name: string;
  score: string;
}

export interface ArcadeEntry {
  Name: string;
  Counts: {
    [key: string]: number;
  };
}

export interface OfflineTop10Entry {
  rank: number;
  name: string;
  score: string;
}

export interface MatchEntry {
  host: string;
  players: string;
}

export type EndpointType = 
  | 'arcade'
  | 'latestchanges'
  | 'leaderboard'
  | 'livecities'
  | 'matches'
  | 'offlinetop10'
  | 'timeattacktop3'
  | 'timeattacktop10'
  | 'top3'
  | 'top10';

export interface ExcelData {
  [key: string]: any;
} 