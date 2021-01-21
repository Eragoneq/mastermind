(function(exports){

    exports.T_GAME_WON = "GAME-WON";
    exports.O_GAME_WON = {
        type: exports.T_GAME_WON,
        data: "",
        finalset: ""
    }

    exports.T_GAME_LOST = "GAME-LOST";
    exports.O_GAME_LOST = {
        type: exports.T_GAME_LOST,
        data: "",
        finalset: ""
    }
    
    exports.T_PLAYER_TYPE = "PLAYER-TYPE";
    exports.O_PLAYER_TYPE = {
        type: exports.T_PLAYER_TYPE,
        data: ""
    }

    exports.T_GUESS_COLORS = "GUESS-COLORS";
    exports.O_GUESS_COLORS = {
        type: exports.T_GUESS_COLORS,
        data: ""
    }

    exports.T_CHECK_COLORS = "CHECK-COLORS";
    exports.O_CHECK_COLORS = {
        type: exports.T_CHECK_COLORS,
        data: ""
    }

    exports.T_SET_COLORS = "SET-COLORS";
    exports.O_SET_COLORS = {
        type: exports.T_SET_COLORS,
        data: ""
    }

    exports.T_NEXT_TURN = "NEXT-TURN";
    exports.O_NEXT_TURN = {
        type: exports.T_NEXT_TURN,
        data: ""
    }

    exports.T_TEST = "TEST";
    exports.O_TEST = {
        type: exports.T_TEST,
        data: ""
    }

}(typeof exports === "undefined" ? this.Messages = {} : exports));
