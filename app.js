const express = require("express");
const http = require("http");
const websocket = require("ws");
const Game = require("./game");

const port = process.argv[2];
const app = express();

const server = http.createServer(app);

app.use(express.static(__dirname + "/public"));
app.use("/game", function (req, res) {
    res.sendFile("public/game.html", { root: "./" });
});

app.use("/*", function (req, res) {
    res.sendFile("public/splash.html", { root: "./" });
});


const wss = new websocket.Server({ server });
const msg = require("./public/javascripts/messages");

let gameStats = () => {
    this.gamesPlayed = 0;
};

let newGame = new Game(gameStats.gamesPlayed++);
let connectionId = 0;

let activePlayers = {};

wss.on("connection", function (ws) {
    
    //Create a copy of player web socket
    let con = ws;
    con.id = connectionId++;            // Add additional property id to remember the player's game
    newGame.addPlayer(con);             // Add a player to the game
    activePlayers[con.id] = newGame;    // Set the connected id it's game

    if(newGame.isFull()) newGame = new Game(gameStats.gamesPlayed++);   // Check if the game is full, create new one if that is the case

    ws.on("message", (message) => {
        let msgObj = JSON.parse(message);

        if(msgObj.type == msg.T_TEST) {
            console.log("[TEST] " + msgObj.data);
        } else {
            console.log(msgObj.type);
        }
        
    });
});

server.listen(port);
