import { Workout } from "./workout.js";

export class Cycling extends Workout {
    type = 'cycling'
    constructor(coords, distance, duration, elevationGain, id) {
        super(coords, distance, duration, id)
        this.elevationGain = elevationGain;
        this._setDescription();
        this.calcSpeed();

    }
    //keeping my solution to compare with jonas later on
    calcSpeed() {
        this.speed = this.distance / (this.duration / 60);
        return this.speed;
    }
}