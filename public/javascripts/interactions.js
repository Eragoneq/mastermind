//@ts-check
let playerType = "";
let turn = 0;

socket.onmessage = (evt) => {
    let msgObj = JSON.parse(evt.data);

    switch (msgObj.type) {
        case Messages.T_PLAYER_TYPE:
            createTimer();
            playerType = msgObj.data;

            if(playerType == "SET") {
                openColors();
                target.innerHTML = "Secret pins: ";
                console.log("SETTING COLORS");
            }

            break;
        case Messages.T_NEXT_TURN:
            if(playerType == "GUESS") {
                updateTurn();
                openColors();
                console.log("GUESSING NOW");
                console.log(msgObj.data);
                if(turn !== 1) {
                    updateBoard(msgObj.data, "checks")
                }
            } else {
                openChecks();
                console.log("CHECKING NOW");
                console.log(msgObj.data);
                updateBoard(msgObj.data, "colors")
            }
            break;
        default:
            console.log("[SOCKET] " + msgObj.type + "\n[DATA] " + msgObj.data);
            break;
    }

};

