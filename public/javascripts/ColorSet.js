//@ts-check

//Container class for an array of colors
class ColorSet {
    constructor(colors) {
        if (arguments.length === 0) this.colors = [];
        else this.colors = colors;

        this.size = this.colors.length;
    }

    // makes a copy of the current object
    copy() {
        return new ColorSet(this.colors);
    }

    // checks if the color set is ready for submission
    checkReadyForSubmit() {
        return this.size === 4;
    }

    // --------------- Getters and setters -----------------------
    // getter for main array
    getColors() {
        return this.colors;
    }

    // getter for color in particular position
    getColor(position) {
        if (!(position < 0 || position > (this.size - 1))) {
            return this.colors[position];
        }
    }

    // getter for size
    getSize() {
        return this.size;
    }

    // setter for main array
    setColors(colors) {
        this.clearColors();
        for (const color of colors) {
            this.addColor(color);
        }
    }
    // -------------- Main array: adding and deleting ----------------------
    addColor(color) {
        if (this.size <= 3) {
            this.colors[this.size] = color;
            this.size += 1;
        } else {
            console.log('ColorSet is already full!');
        }
    }

    dropColor(position) {
        this.colors.splice(position, 1);
    }

    dropLastColor() {
        this.colors.splice(this.size - 1, 1);
    }

    clearColors() {
        this.colors = [];
        this.size = 0;
    }

    // ------------------- Helper methods for generateCheckSet() --------------------
    // counts instances of color argument
    countColor(colorToCount) {
        let counter = 0;
        for (const color of this.colors) {
            if (color === colorToCount) {
                counter += 1;
            }
        }
        return counter;
    }

    // compares colors on the same position with another set
    checkColorWithPosition(compSet, position) {
        if (compSet.getColor(position) === compSet.getColor(position)) {
            return true;
        }
        return false;
    }

    // compares sets with respect to colors but without respect to their position
    // e.g.:
    // Blue Yellow Green Red == Yellow Green Blue Red
    // Blue Yellow Green Red != Blue Yellow Green Purple
    compareColors(compSet) {
        if (this.size != compSet.size) return false;
        for (const color of this.colors) {
            if (this.countColor(color) != compSet.countColor(color)) {
                return false;
            }
        }
        return true;
    }

    // generating checkSet (black & white colors set) for current object
    generateCheckSet(keySet) {
        let whitePins = 0;
        let blackPins = 0;
        let checkSet = new ColorSet();

        // check set finding algorithm
        // https://stackoverflow.com/questions/2005723/how-to-count-the-white-correctly-in-mastermind-guessing-game-in-c/2005930
        let sum = 0;

        for (let i = 0; i < this.size; i++) {
            if (this.getColor(i) === keySet.getColor(i)) {
                blackPins += 1;
            }
        }

        let allColors = ['red', 'yellow', 'green', 'blue', 'purple'];
        let ans = [];
        let guess = [];
        let color = '';

        for (let i = 0; i < allColors.length; i++) {
            color = allColors[i];
            sum += Math.min(this.countColor(color), keySet.countColor(color));
        }

        whitePins = sum - blackPins;

        for (let i = 0; i < whitePins; i++) checkSet.addColor('white');
        for (let i = 0; i < blackPins; i++) checkSet.addColor('black');

        return checkSet;
    }
}
