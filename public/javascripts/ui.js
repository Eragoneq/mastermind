//@ts-check
const target = document.getElementById("info");
const board = document.getElementById("board");
const turnCounter = document.getElementById("turn");
const socket = new WebSocket("ws://localhost:3000");

class Timer {
    constructor() {
        this.time = 0;
        this.timer = null;
    }

    startTimer(element) {
        this.timer = setInterval(() => {
            this.time += 1;
            element.innerHTML = `Timer: ${Math.floor(this.time / 60).toString().padStart(2, '0')}:${(this.time % 60).toString().padStart(2, '0')}`
        }, 1000);
    }

    stopTimer() {
        if(this.timer != null) {
            clearInterval(this.timer);
        }
    }

}

const timer = new Timer();
let arr = new Array();
let colorsArray = new Array();
let checkArray = new Array();

// ------------------- HTML color pins in rows: adding and erasing -------------------------------
function addColorDivToRow(color, row) {
    //@ts-ignore
    let colorDiv = document.createElement('div');
    colorDiv.className = 'pin ' + color;
    row.appendChild(colorDiv);
}

function addAllColorDivsToRow(colors, row) {
    colors.forEach(color => {
        addColorDivToRow(color, row);
    });
}

function addAllColorRows(colors, rowList) {
    for (let i = 0; i < colors.length; i++) {
        addAllColorDivsToRow(colors[i], rowList[i]);
    }
}

function clearRow(row) {
    row.innerHTML = "";
}

function clearAllRows(rowList) {
    rowList.forEach(row => {
        clearRow(row);
    });
}
// -----------------------------------------------------------------------------------------------

function updateBoard(arr, type) {
    if(type == "colors") {
        colorsArray = arr;
        let rowContainer = document.querySelector('.rowList_container');
        let rowList = rowContainer.querySelectorAll('div.row');
        
        clearAllRows(rowList);
        addAllColorRows(colorsArray, rowList);

        // let c = document.getElementById("colorPins")
        // c.innerHTML = "";

        // colorsArray.forEach((el) => c.innerHTML += el.join(", ") + "<br>");

    } else {
        checkArray = arr;
        // let c = document.getElementById("checkPins")
        // c.innerHTML = "";

        // checkArray.forEach((el) => c.innerHTML += el.join(", ") + "<br>");
    }
}

function updateTurn() {
    turn++;
    turnCounter.innerHTML = "Guess: " + turn.toString();
}

function createTimer() {
    timer.startTimer(document.getElementById("time"));
}

function updateLive(color) {
    if(arr.length < 4) arr.push(color);
    updateLiveRow(arr);
    target.innerHTML = arr.toString();
    // console.log(arr.toString());
}

function updateLiveRow(colors) {
    let liveRow = document.getElementById('live_pins');
    clearRow(liveRow);
    addAllColorDivsToRow(colors, liveRow);
}

function clearLive() {
    arr = [];
    // console.log(arr);
    target.innerHTML = "Current pins: ";
    updateLiveRow(arr);
}

function submit() {
    // @ts-ignore
    let msg = null;
    if(playerType == "SET"){
        if(turn == 0) {
            msg = Messages.O_SET_COLORS;
        } else {
            msg = Messages.O_CHECK_COLORS;
            checkArray.push(arr);
            updateBoard(checkArray, "checks");
        }
        updateTurn();
    } else {
        msg = Messages.O_GUESS_COLORS;
        colorsArray.push(arr);
        updateBoard(colorsArray, "colors");
    }
    msg.data = arr;
    socket.send(JSON.stringify(msg));
    clearLive();
    disableButtons();
}

function sendTestSocket(info) {
    let msg = Messages.O_TEST;
    msg.data = info;
    socket.send(JSON.stringify(msg));
}

function openColors() {
    document.querySelectorAll(".table_col,.table_info").forEach((button) => {
        button.removeAttribute("style");
    });
    document.getElementById("buttons").removeAttribute("style");
}

function openChecks() {
    document.querySelectorAll(".table_check,.table_info").forEach((button) => {
        button.removeAttribute("style");
    });
    document.getElementById("buttons").removeAttribute("style");
}

function disableButtons() {
    document.querySelectorAll(".table_check,.table_info,.table_col").forEach((button) => {
        button.style.display = "none";
    });
    document.getElementById("buttons").style.display = "none";
}

document.querySelectorAll('.colors,.checks').forEach((button) => {
    button.addEventListener("click", () => {
        updateLive(button.innerHTML);
    });
});

document.querySelectorAll('.clear').forEach((button) => {
    button.addEventListener("click", () => {
        clearLive();
    });
});

document.querySelectorAll('.submit').forEach((button) => {
    button.addEventListener("click", () => {
        submit();
    });
});

disableButtons();