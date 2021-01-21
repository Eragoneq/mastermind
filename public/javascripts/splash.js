let playButton = document.getElementById("play");
const clickSound = new Audio("../click.wav");
clickSound.volume = 0.1;

playButton.addEventListener("click", () => {
    window.location.href="/game";
    clickSound.play();
});