class Game {
    constructor(id) {
        this.gameID = id;

        this.player1 = null;
        this.player2 = null;

        this.set_color = null;

        this.guesses = [];
        this.checks = [];

        this.turn = 0;

        this.state = "PREP";
    }

    addPlayer(ws) {
        if(this.player1 === null) this.player1 = ws;
        else if (this.player2 === null) this.player2 = ws;
        else console.log("An error has ocurred, tried to add the player to a full game!") 
    }

    getPlayerByID(id) {
        if (this.player1.id == id) return 1;
        else if (this.player2.id == id) return 2;
        else console.log("NO PLAYER WITH SUCH ID IN GAME: CANNOT GET PLAYER BY ID");
    } 

    removePlayer(number) {
        if (number == 1) this.player1 == "removed";
        else if (number == 2) this.player2 == "removed";
        else console.log("NO PLAYER WITH SUCH NUMBER IN GAME: CANNOT REMOVE");
    }

    closePlayerSocket(number) {
        if (number == 1) this.player1.close();
        else if (number == 2) this.player2.close();
        else console.log("NO PLAYER WITH SUCH NUMBER IN GAME: CANNOT CLOSE WEB SOCKET");
    }

    checkIfOnePlayerRemoved() {
        return this.player1 == "removed" ^ this.player2 == "removed" ? true : false;
    }

    isFull() {
        return this.player1 !== null && this.player2 !== null ? true : false;
    }

    delete() {
        delete this;
    }

    setStatus(status) {
        this.state = status;
    }
}

class Color {
    constructor() {
        this.id = a;
    }
}

module.exports = Game;