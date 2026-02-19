#!/bin/bash
curl -X POST -H "Content-Type: application/json" -d '{
  "provider": {
    "name": "Counter-Strike: Global Offensive",
    "appid": 730,
    "version": 1337,
    "steamid": "76561198000000000",
    "timestamp": 1234567890
  },
  "map": {
    "mode": "competitive",
    "name": "de_mirage",
    "phase": "live",
    "round": 4,
    "team_ct": {
      "score": 5,
      "name": "CT",
      "timeouts_remaining": 1,
      "matches_won_this_series": 0
    },
    "team_t": {
      "score": 8,
      "name": "T",
      "timeouts_remaining": 1,
      "matches_won_this_series": 0
    },
    "num_matches_to_win_series": 0,
    "current_spectators": 0,
    "souvenirs_total": 0
  },
  "round": {
    "phase": "over",
    "win_team": "T",
    "bomb": "defused"
  },
  "player": {
    "steamid": "76561198000000000",
    "name": "Player 1",
    "observer_slot": 1,
    "team": "T",
    "activity": "playing",
    "state": {
      "health": 100,
      "armor": 100,
      "helmet": true,
      "flashed": 0,
      "smoked": 0,
      "burning": 0,
      "money": 16000,
      "round_kills": 0,
      "round_killhs": 0,
      "equip_value": 1000
    }
  }
}' http://localhost:1349/api/gsi
echo "Sent GSI payload (T Win)"
