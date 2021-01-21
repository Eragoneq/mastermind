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