//@ts-check

socket.onmessage = (evt) => {
    let msgObj = JSON.parse(evt.data);

    // if(msgObj.type == Messages.T_TEST) {
    //     console.log("[TEST] " + msgObj.data + " from server ");
    // } else {
    //     console.log("[SOCKET] " + msgObj.type + "\n[DATA] " + msgObj.data);
    // }
    if(msgObj.type == Messages.T_PLAYER_TYPE) {
        createTimer();
        console.log("PLAYER A");
    }else{
        console.log("[SOCKET] " + msgObj.type + "\n[DATA] " + msgObj.data);
    }

};

