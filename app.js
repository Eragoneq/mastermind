const express = require("express");
const http = require("http");
const websocket = require("ws");
const Game = require("./game");

const port = process.argv[2];
const app = express();

const server = http.createServer(app);

app.use(express.static(__dirname + "/public"));
app.use("/game", function (req, res) {
    res.sendFile("game.html", { root: "./public" });
});

app.use("/*", function (req, res) {
    res.sendFile("splash.html", { root: "./public" });
});


const wss = new websocket.Server({ server });
const msg = require("./public/javascripts/messages");

class GameStats {
    constructor() {
        this.gamesPlayed = 0;
    }
};

let statistics = new GameStats();

let newGame = new Game(statistics.gamesPlayed++);
let connectionId = 0;

let activePlayers = {};

wss.on("connection", function (ws) {
    
    //Create a copy of player web socket
    let con = ws;
    con.id = connectionId++;            // Add additional property id to remember the player's game
    newGame.addPlayer(con);             // Add a player to the game
    activePlayers[con.id] = newGame;    // Set the connected id it's game

    console.log("Current players:");
    console.log(activePlayers);

    if(newGame.isFull()) {
        newGame = new Game(statistics.gamesPlayed++);   // Check if the game is full, create new one if that is the case
        console.log("Game created with ID " + statistics.gamesPlayed);
    }

    ws.onmessage = (event) => {
        let msgObj = JSON.parse(event.data);

        if(msgObj.type == msg.T_TEST) {
            console.log("[TEST] " + msgObj.data + " from player " + event.target.id + " in game " + activePlayers[event.target.id].gameID);
        } else {
            console.log("[SOCKET] " + msgObj.type);
        }
        
    };

    ws.onclose = (event) => {
        console.log("Lost connection to client with ID " + event.target.id);
        delete activePlayers[event.target.id];
        console.log("Current players:");
        console.log(activePlayers);
    };
});

server.listen(port);
