
export class Workout {
    constructor(coords, distance, duration, id, date) {
        this.coords = coords; // [lat, lng]
        this.distance = distance; // in miles
        this.duration = duration; // in minutes
        this.id = id || (Date.now() + "").slice(-10);
        this.date = date ? new Date(date) : new Date();
    }
    _setDescription() {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${months[this.date.getMonth()]} ${this.date.getDate()}`
    }
}

