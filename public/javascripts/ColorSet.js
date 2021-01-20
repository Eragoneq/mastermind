//@ts-check

//Container class for an array of colors
class ColorSet {
    constructor() {
        this.colors = [];
        this.size = 0;
    }

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

    // setter for main array
    setColors(colors) {
        this.clearColors();
        for (const color of colors) {
            this.addColor(color);
        }
    }

    // main array: adding and deleting
    addColor(color) {
        if (this.size < 3) {
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

    // ------- helper methods for generateCheckSet() ------
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
        for (const color of this.colors) {
            if (this.countColor(color) !== compSet.countColor(color)) {
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

        let color = '';

        for(let i = 0; i < keySet.length; i++) {
            color = keySet[i];
            if (this.countColor(color) === keySet.countColor(color)) {
                if (this.checkColorWithPosition(i) === keySet.checkColorWithPosition(i)) {
                    whitePins += 1;
                } else {
                    blackPins += 1;
                }
            }
        }

        for (let i = 0; i < whitePins; i++) checkSet.addColor('white');
        for (let i = 0; i < blackPins; i++) checkSet.addColor('black');

        return checkSet;
    }
}
