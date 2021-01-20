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
                target.innerHTML = "Secret pins: ";
                console.log("SETTING COLORS");
            }

            break;
        // @ts-ignore
        case Messages.T_NEXT_TURN:
            let receivedColorArray = msgObj.data;
            for (let i = 0; i < receivedColorArray.length; i++) {
                receivedColorArray[i] = new ColorSet(receivedColorArray[i]);
            }

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
        default:
            console.log("[SOCKET] " + msgObj.type + "\n[DATA] " + msgObj.data);
            break;
    }

};

