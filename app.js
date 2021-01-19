const express = require("express");
const http = require("http");
const websocket = require("ws");
const Game = require("./game");

const port = process.env.PORT || process.argv[2] || 3000;
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
    console.log(Object.keys(activePlayers));

    if(newGame.isFull()) {
        let gameInfo = msg.O_PLAYER_TYPE;

        gameInfo.data = "SET";
        newGame.player1.send(JSON.stringify(gameInfo));

        gameInfo.data = "GUESS";
        newGame.player2.send(JSON.stringify(gameInfo));

        newGame.state = "SETTING";

        newGame = new Game(statistics.gamesPlayed++);   // Check if the game is full, create new one if that is the case
        console.log("Game created with ID " + statistics.gamesPlayed);
    }

    ws.onmessage = (event) => {
        let msgObj = JSON.parse(event.data);
        let game = activePlayers[event.target.id];

        switch (msgObj.type) {
            case msg.T_TEST:
                console.log("[TEST] " + msgObj.data + " from player " + event.target.id + " in game " + activePlayers[event.target.id].gameID);
                break;
            case msg.T_SET_COLORS:
                if(game.set_color === null || game.state === "SETTING") {
                    // Set the colors of the game
                    game.set_color = msgObj.data;

                    let resp = msg.O_NEXT_TURN;
                    game.player2.send(JSON.stringify(resp));
                }
                break;
            case msg.T_GUESS_COLORS:
                if(game.turn < 9) {
                    // Add the guess colors (array) to array of guesses
                    game.guesses.push(msgObj.data);

                    let resp = msg.O_NEXT_TURN; // Send client info about new turn
                    resp.data = game.guesses;   // Send information about the check pins that opponent set
                    game.player1.send(JSON.stringify(resp));

                    console.log(game.guesses);
                }
                break;
            case msg.T_CHECK_COLORS:
                if(game.turn < 9) {
                    // Add the check colors (array) to array of guesses
                    game.checks.push(msgObj.data);

                    game.turn++;                // Update turn count
                    let resp = msg.O_NEXT_TURN; // Send client info about new turn
                    resp.data = game.checks;    // Send client info about the guessed color pins
                    game.player2.send(JSON.stringify(resp));

                    console.log(game.checks);
                }
                break;
            default:
                console.log("[SOCKET] " + msgObj.type + "\n[DATA] " + msgObj.data);
                break;
        }
        
    };

    ws.onclose = (event) => {
        console.log("Lost connection to client with ID " + event.target.id);
        let game = activePlayers[event.target.id];
        delete activePlayers[event.target.id];
        if(game.state == "PREP") {
            game.player1 = null;
            return;
        }
        let winner = event.target === game.player1 ? game.player2 : game.player1;

        let winMessage = msg.O_GAME_WON;
        winMessage.data = "Your opponent disconnected, you win!";

        winner.send(JSON.stringify(winMessage));

        console.log("Current players:");
        console.log(Object.keys(activePlayers));
    };
});

server.listen(port, '0.0.0.0');
