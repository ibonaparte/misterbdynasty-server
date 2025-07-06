const express = require("express");
const app = express();
const cors = require("cors");
const apiRoutes = require("./routes/routes");
const corsOptions = {
  origin: ["https://misterbdynasty-client.onrender.com/"],
};

/* SQL/Database*/
const { printQueryResults } = require("./utils.js");
const sqlite = require("sqlite3");
const dbFile = "./db/misterbdynasty.db";
const db = new sqlite.Database(dbFile);

app.use(cors(corsOptions));
app.use("/", apiRoutes);

const users = [];
const teams = [];
const matches = [];

//Users
db.each(
  "SELECT * FROM users INNER JOIN teams ON users.current_team = teams.team_id",
  (error, row) => {
    users.push({
      user_id: row.user_id,
      username: row.username,
      current_team: row.current_team,
      twitch_name: row.twitch_name,
      platform: row.platform,
      school_name: row.school_name,
      team_name: row.nickname,
      team_abbr: row.abbr,
    });
  }
);

//Teams
db.each("SELECT * FROM teams", (error, row) => {
  teams.push({
    team_id: row.team_id,
    school_name: row.school_name,
    nickname: row.nickname,
    abbr: row.abbr,
    conference: row.conference,
    logo: row.logo,
    ovr: row.ovr,
    off: row.off,
    def: row.def,
    is_user: row.is_user,
  });
});

//Matches
db.each("SELECT * FROM matches", (error, row) => {
  matches.push({
    match_id: row.match_id,
    season_id: row.season_id,
    week_id: row.week_id,
    away_id: row.away_id,
    home_id: row.home_id,
    away_score: row.away_score,
    home_score: row.home_score,
    away_rank: row.away_rank,
    home_rank: row.home_rank,
    game_type: row.game_type,
    game_name: row.game_name,
    write_up: row.write_up,
    twitch_link: row.twitch_link,
  });
});

const getTeamMatches = (teamId) => {
  const sql = "SELECT * FROM matches WHERE";
};

//Set API
app.get("/api", (req, res) => {
  res.json({ users: users, teams: teams, matches: matches });
});

app.get("/api/users", (req, res) => {
  res.json({ users: users });
});

app.get("/api/teams", (req, res) => {
  res.json({ teams: teams });
});

app.get("/api/matches", (req, res) => {
  res.json({ matches: matches });
});

app.get("/api/matches/:teamId", (req, res) => {
  const { teamId } = req.params;
  const teamMatches = matches.filter(
    (t) => t.home_id === parseInt(teamId) || t.away_id === parseInt(teamId)
  );

  if (!teamMatches) {
    return res
      .status(404)
      .send("Team does not exist or have matches that exist");
  }

  res.json(teamMatches);
});

/*
app.post("/api/matches", (req, res) => {
  const {
    season_id,
    week_id,
    away_id,
    home_id,
    away_score,
    home_score,
    away_rank,
    home_rank,
    game_type,
    game_name,
  } = req.body;
  db.run(
    "INSERT INTO matches (season_id, week_id, away_id, home_id, away_score, home_score, away_rank, home_rank, game_type, game_name) VALUES (?, ?,?, ?, ?, ?, ?, ?, ?, ?)"
  ),
    [
      season_id,
      week_id,
      away_id,
      home_id,
      away_score,
      home_score,
      away_rank,
      home_rank,
      game_type,
      game_name,
    ],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID });
    };
});
*/
app.listen(8080, () => {
  console.log("Server started on port 8080");
});
