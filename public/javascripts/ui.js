//@ts-check
const target = document.getElementById("info");
const socket = new WebSocket("ws://localhost:3000");

class Timer {
    constructor() {
        this.time = 0;
        this.timer = null;
    }

    startTimer(element) {
        this.timer = setInterval(() => {
            this.time += 1;
            element.innerHTML = `${Math.floor(this.time / 60).toString().padStart(2, '0')}:${(this.time % 60).toString().padStart(2, '0')}`
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

function createTimer() {
    timer.startTimer(document.getElementById("time"));
}

function add(col) {
    if(arr.length < 4) arr.push(col);
    target.innerHTML = arr.toString();
    console.log(arr.toString());
}

function clear() {
    arr = [];
    console.log(arr);
    target.innerHTML = "";
}

function submit() {
    // @ts-ignore
    let msg = Messages.O_GUESS_COLORS;
    msg.data = arr;
    socket.send(JSON.stringify(msg));
}

function sendTestSocket(info) {
    // @ts-ignore
    let msg = Messages.O_TEST;
    msg.data = info;
    socket.send(JSON.stringify(msg));
}

document.querySelectorAll('.colors').forEach((button) => {
    button.addEventListener("click", () => {
        add(button.innerHTML);
    });
});

document.querySelectorAll('.clear').forEach((button) => {
    button.addEventListener("click", () => {
        clear();
    });
});

document.querySelectorAll('.submit').forEach((button) => {
    button.addEventListener("click", () => {
        submit();
    });
});