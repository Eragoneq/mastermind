
class Game {
    constructor(id) {
        this.gameID = id;

        this.player1 = null;
        this.player2 = null;

        this.set_color = null;
        this.last_guess = null;

        this.turn = 0;

        this.state = "PREP";
    }

    addPlayer(ws) {
        if(this.player1 === null) this.player1 = ws;
        else if (this.player2 === null) this.player2 = ws;
        else console.log("An error has ocurred, tried to add the player to a full game!") 
    }

    isFull() {
        return this.player1 !== null && this.player2 !== null ? true : false;
    }


}

module.exports = Game;