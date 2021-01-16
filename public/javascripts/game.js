//@ts-check
const target = document.getElementById("info");
const socket = new WebSocket("ws://localhost:3000");

let arr = new Array();

function add(col) {
    arr.push(col);
    target.innerHTML = arr.toString();
}

// socket.onmessage = function(event){
//     target.innerHTML = event.data;
// };

// socket.onopen = function(){
//     socket.send("Hello from the client!");
//     target.innerHTML = "Sending a first message to the server ...";
// };

function submit() {
    socket.send(JSON.stringify(arr));
}

function sendTestSocket(info) {
    let msg = Messages.O_TEST;
    msg.data = info;
    socket.send(JSON.stringify(msg));
}