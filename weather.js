
export class Weather {
    constructor() {
        this.kelvinTemp = null;
        this.city = null;
        this.degreeType = 'celsius'; // default degree type
        this.description = '';

    }

    setWeatherData({ kelvinTemp, city, description }) {
        this.kelvinTemp = kelvinTemp;
        this.city = city;
        this.description = description;
    }

    convertToCelsius() {
        // Kelvin to Celsius
        return this.kelvinTemp - 273.15;
    }

    convertToFahrenheit() {
        // Kelvin to Fahrenheit
        return (this.kelvinTemp - 273.15) * 9/5 + 32;
    }

    toggleDegreeType() {
        this.degreeType = this.degreeType === 'celsius' ? 'fahrenheit' : 'celsius';
    }

    getFormattedTemperature() {
        if (this.degreeType === 'celsius') {
            return this.convertToCelsius();
        } else {
            return this.convertToFahrenheit();
        }
    }
}