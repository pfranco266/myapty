import { Workout } from "./workout.js";

export class Running extends Workout {
    type = 'running'
    constructor(coords, distance, duration, cadence, id) {
        super(coords, distance, duration, id)
        this.cadence = cadence;
        this._setDescription();
        this.calcPace();
    }
    //could have saved to variable, going to compare perf later on
    calcPace() {
        this.pace = this.duration / this.distance;
        return this.pace;
    }
}