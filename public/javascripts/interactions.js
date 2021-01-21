//@ts-check
let playerType = "";
let turn = 0;

socket.onmessage = (evt) => {
    let msgObj = JSON.parse(evt.data);

    switch (msgObj.type) {
        // @ts-ignore
        case Messages.T_PLAYER_TYPE:
            createTimer();
            playerType = msgObj.data;

            if(playerType == "SET") {
                openColors();
                updateInfo("You're the codemaker, set your colors!");
                console.log("SETTING COLORS");
            } else {
                updateInfo("Waiting for opponent to set colors...");
            }

            break;
        // @ts-ignore
        case Messages.T_NEXT_TURN:
            let receivedColorArray = msgObj.data;
            for (let i = 0; i < receivedColorArray.length; i++) {
                // @ts-ignore
                receivedColorArray[i] = new ColorSet(receivedColorArray[i]);
            }

            updateInfo("It's your turn!");

            if(playerType == "GUESS") {
                updateTurn();
                openColors();
                console.log("GUESSING NOW");
                console.log(receivedColorArray);
                if(turn !== 1) {
                    updateBoard(receivedColorArray, "checks")
                }
            } else {
                openChecks();
                console.log("CHECKING NOW");
                console.log(receivedColorArray);
                updateBoard(receivedColorArray, "colors")
            }
            break;
        // @ts-ignore
        case Messages.T_GAME_WON:
            endGame();
            updateInfo("You won!");
            alert(msgObj.data);
            break;
        // @ts-ignore
        case Messages.T_GAME_LOST:
            endGame();
            updateInfo("You lost!");
            alert(msgObj.data);
            break;
        default:
            console.log("[SOCKET] " + msgObj.type + "\n[DATA] " + msgObj.data);
            break;
    }

};

