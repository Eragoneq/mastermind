//@ts-check
const target = document.getElementById("info");
const board = document.getElementById("board");
const turnCounter = document.getElementById("turn");
const subButton = document.getElementById("submit");
const HOST = location.origin.replace(/^http/, 'ws')
const socket = new WebSocket(HOST);
const clickSound = new Audio("../click.wav");
clickSound.volume = 0.1;

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
// @ts-ignore
let keySet = new ColorSet();
// @ts-ignore
let liveSet = new ColorSet();
let colorsArray = new Array();
let checkArray = new Array();

// ------------------- HTML color pins in rows: adding and erasing -------------------------------
function addColorDivToField(color, field) {
    //@ts-ignore
    let colorDiv = document.createElement('div');
    let fieldClass = field.className;
    // console.log('ADDING DIV TO FIELD: ' + fieldClass);
    let divClass = '';
    let add = '';

    if (fieldClass === 'row') {
        add = '';
    } else if (fieldClass === 'square') {
        add = 'small';
    }

    divClass = add + 'pin ' + color;
    colorDiv.className = divClass;
    field.appendChild(colorDiv);
}

function addAllColorDivsToField(colorSet, field) {
    colorSet.getColors().forEach(color => {
        addColorDivToField(color, field);
    });
}

function addAllFields(colorSetsArray, rowList) {
    for (let i = 0; i < colorSetsArray.length; i++) {
        addAllColorDivsToField(colorSetsArray[i], rowList[i]);
    }
}

function clearField(field) {
    field.innerHTML = "";
}

function clearAllFields(fieldList) {
    fieldList.forEach(field => {
        clearField(field);
    });
}
// -----------------------------------------------------------------------------------------------

function updateBoard(arr, type) {
    if(type === "colors") {
        colorsArray = arr;
        let rowContainer = document.querySelector('.rowList_container');
        let rowList = rowContainer.querySelectorAll('div.row');

        let elArray = Array.from(rowList);
        elArray.reverse();

        clearAllFields(elArray);
        addAllFields(colorsArray, elArray);

        // let c = document.getElementById("colorPins")
        // c.innerHTML = "";

        // colorsArray.forEach((el) => c.innerHTML += el.join(", ") + "<br>");

    } else if (type === "checks") {
        checkArray = arr;
        let rowContainer = document.querySelector('.rowList_container');
        let squareList = rowContainer.querySelectorAll('div.square');

        let elArray = Array.from(squareList);
        elArray.reverse();

        clearAllFields(elArray);
        addAllFields(checkArray, elArray);

        // let c = document.getElementById("checkPins")
        // c.innerHTML = "";

        // checkArray.forEach((el) => c.innerHTML += el.join(", ") + "<br>");
    }
}

function updateTurn() {
    // @ts-ignore
    turn++;
    // @ts-ignore
    turnCounter.innerHTML = "Guess: " + turn.toString();
}

function updateInfo(str) {
    target.innerHTML = str;
}

function createTimer() {
    timer.startTimer(document.getElementById("time"));
}

function updateLive(color) {
    if(liveSet.getSize() < 4) {
        liveSet.addColor(color);
        // console.log("COLOR ADDED TO LIVE SET: " + color);
        updateLiveRow(liveSet);
        // target.innerHTML = liveSet.getColors().toString();
    } else {
        // console.log("ACCESS DENIED: LIVE SET FULL");
    }
    // console.log(arr.toString());
}

function updateLiveRow(colors) {
    let liveRow = document.getElementById('live_pins');
    clearField(liveRow);
    addAllColorDivsToField(colors, liveRow);
    // console.log("LIVE ROW UPDATED");
}

function clearLive() {
    liveSet.clearColors();
    // console.log("LIVE SET CLEAR");
    // target.innerHTML = "Current pins: ";
    updateLiveRow(liveSet);
}

function showKey(pinSet = keySet) {
    let div = document.getElementById('set_pins');
    div.querySelectorAll('*').forEach(n => n.remove());
    addAllColorDivsToField(pinSet, div);
}

function addErrorAnimation() {
    subButton.classList.add("error");
}

function removeErrorAnimation() {
    subButton.classList.remove("error");
}

function endGame() {
    disableButtons();
    timer.stopTimer();
}

function submit() {
    let msg = null;

    // @ts-ignore
    if(playerType == "SET"){
        // @ts-ignore
        if(turn == 0) {
            if (liveSet.checkReadyForSubmit()) {
                // @ts-ignore
                msg = Messages.O_SET_COLORS;
                keySet = liveSet.copy();
                showKey();
            } else {
                handleIncompleteSubmit();
                return;
            }
        } else {
            let lastColorSet = colorsArray[colorsArray.length-1];
            if (liveSet.compareColors(lastColorSet.generateCheckSet(keySet))) {
                // @ts-ignore
                msg = Messages.O_CHECK_COLORS;
                checkArray.push(liveSet.copy());
                // console.log("LIVE SET PUSHED TO CHECK ARRAY");
                updateBoard(checkArray, "checks");
            } else {
                handleIncorrectCheckSubmit();
                return;
            }
        }
        updateTurn();
    } else {
        if (liveSet.checkReadyForSubmit()) {
            // @ts-ignore
            msg = Messages.O_GUESS_COLORS;
            colorsArray.push(liveSet.copy());
            // console.log("LIVE SET PUSHED TO COLORS ARRAY");
            updateBoard(colorsArray, "colors");
        } else {
            handleIncompleteSubmit();
            return;
        }
        
    }
    updateInfo("It's opponents turn.");
    msg.data = liveSet.getColors();
    socket.send(JSON.stringify(msg));
    clearLive();
    disableButtons();
    
}

function handleIncompleteSubmit() {
    // console.log('SUBMIT DENIED: COLOR SET IS INCOMPLETE');
}

function handleIncorrectCheckSubmit() {
    addErrorAnimation();
    // console.log('SUBMIT DENIED: CHECK SET IS INCORRECT');
}

function sendTestSocket(info) {
    // @ts-ignore
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
        // @ts-ignore
        button.style.display = "none";
    });
    document.getElementById("buttons").style.display = "none";
}

document.querySelectorAll('.colors,.checks').forEach((button) => {
    button.addEventListener("click", () => {
        updateLive(button.innerHTML);
        removeErrorAnimation();
        clickSound.play();
    });
});

document.querySelectorAll('.clear').forEach((button) => {
    button.addEventListener("click", () => {
        clearLive();
        removeErrorAnimation();
        clickSound.play();
    });
});

document.querySelectorAll('.submit').forEach((button) => {
    button.addEventListener("click", () => {
        submit();
        clickSound.play();
    });
});

disableButtons();