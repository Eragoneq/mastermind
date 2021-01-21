class GameStats {

    constructor() {
        this.gamesPlayed = -1;
        this.gamesActive = 0;
        this.gamesWon = 0;
    }

    // constructor(gamesPlayed, gamesActive, gamesWon) {
    //     this.gamesPlayed = gamesPlayed;
    //     this.gamesActive = gamesActive;
    //     this.gamesWon = gamesWon;
    // }

    gamesWonAdd() {
        this.gamesWon += 1;
    }

    gamesActiveAdd() {
        this.gamesActive += 1;
    }

    gamesPlayedAdd() {
        this.gamesPlayed += 1;
    }

    gamesActiveRemove() {
        this.gamesActive -= 1;
    }
};

module.exports = GameStats;