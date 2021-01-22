const express = require("express");
const http = require("http");
const websocket = require("ws");
const Game = require("./game");
const GameStats = require("./stats.js");

const port = process.env.PORT || process.argv[2] || 3000;
const app = express();

const server = http.createServer(app);

let statistics = new GameStats();

app.use(express.static(__dirname + "/public"));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use("/game", function (req, res) {
    res.sendFile("game.html", { root: "./public" });
});

app.use("/", function (req, res) {
    res.render("splash", {gamesPlayed: statistics.gamesPlayed, gamesActive: statistics.gamesActive, gamesWon: statistics.gamesWon});
});


const wss = new websocket.Server({ server });
const msg = require("./public/javascripts/messages");

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

        statistics.gamesActiveAdd();
        console.log("ACTIVE GAME ADDED");

        newGame = new Game(statistics.gamesPlayed++);   // Check if the game is full, create new one if that is the case
        console.log("Game created with ID " + statistics.gamesPlayed);
    }

    ws.onmessage = (event) => {
        let msgObj;
        try {
            msgObj = JSON.parse(event.data);
        } catch (error) {
            console.log("RECEIVED INVALID DATA");
            return;
        }
        
        let game = activePlayers[event.target.id];
        // console.log("GAME STATE: ")
        // console.log(game.state);

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
                if(game.turn <= 8) {
                    // Add the guess colors (array) to array of guesses
                    game.guesses.push(msgObj.data);
    
                    let resp = msg.O_NEXT_TURN; // Send client info about new turn
                    resp.data = game.guesses;   // Send information about the check pins that opponent set
                    game.player1.send(JSON.stringify(resp));
    
                    console.log(game.guesses);
                } 
                break;
            case msg.T_CHECK_COLORS:
                console.log("CHECK WITH TURN: ");
                console.log(game.turn);
                if(game.turn <= 8) {
                    // Add the check colors (array) to array of guesses
                    game.checks.push(msgObj.data);
    
                    if (checkGameWon(msgObj.data)) {
                        statistics.gamesActiveRemove();
                        game.setStatus('CLOSED');
                        endGame(game.player2, game.player1, game, true);
                        return;
                    } else if (game.turn == 8) {
                        statistics.gamesActiveRemove();
                        game.setStatus('CLOSED');
                        endGame(game.player1, game.player2, game);
                        return;
                    }
    
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

        if (game.state == "PREP") {
            game.player1 = null;
            return;
        } else if (game.state == "SETTING") {
            let winner = event.target === game.player1 ? game.player2 : game.player1;

            let winMessage = msg.O_GAME_WON;
            winMessage.data = "Your opponent disconnected, you win!";
            // Check if the setter got the colors set first, if not then send empty array
            winMessage.finalset = game.set_color === null ? [] : game.set_color;

            game.setStatus('CLOSED');
            statistics.gamesActiveRemove();

            winner.send(JSON.stringify(winMessage));

            console.log("Current players:");
            console.log(Object.keys(activePlayers));
        } // other case is game.state = "CLOSED", which means one player won
    };

});

// Heroku cheat to make it not disconnect players within 55 seconds
setInterval(() => {
    let ping = msg.O_TEST;
    ping.data = "PING";
    wss.clients.forEach((ws) => {
        ws.send(JSON.stringify(ping));
    });
}, 30000);

function checkGameWon(arr) {
    if (arr.length === 4 && arr.filter(x => x==="black").length === 4) return true;
    console.log("ARR:");
    console.log(arr);
    return false;
}

function endGame(winner, loser, game, addGamesWon = false) {
    if (addGamesWon) {
        statistics.gamesWonAdd();
        console.log("GAME WON ADDED");
    }
    endGameJSONSend(winner, loser, game);
}

function endGameJSONSend(winner, loser, game) {
    let winMessage = msg.O_GAME_WON;
    let loseMessage = msg.O_GAME_LOST;

    winMessage.data = "You win!";
    loseMessage.data = "You lose!";
    winMessage.finalset = game.set_color;
    loseMessage.finalset = game.set_color;

    winner.send(JSON.stringify(winMessage));
    loser.send(JSON.stringify(loseMessage));
}

server.listen(port, '0.0.0.0');
