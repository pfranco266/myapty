// 'use strict';

// const form = document.querySelector('.form');
// const containerWorkouts = document.querySelector('.workouts');
// const inputType = document.querySelector('.form__input--type');
// const inputDistance = document.querySelector('.form__input--distance');
// const inputDuration = document.querySelector('.form__input--duration');
// const inputCadence = document.querySelector('.form__input--cadence');
// const inputElevation = document.querySelector('.form__input--elevation');
// const editWorkoutButton = document.querySelector('#editButton');
// const deleteAllButton = document.querySelector('.delete-btn');
// const deleteButton = document.querySelector('.delete-single');
// const weatherLi = document.querySelector('#weatherLi');
// const fahrOrCels = document.querySelector('#toggleForC');
// // const weatherDescription = document.querySelector('#weatherDescription');

// class Workout {
//     constructor(coords, distance, duration, id, date) {
//         this.coords = coords; // [lat, lng]
//         this.distance = distance; // in miles
//         this.duration = duration; // in minutes
//         this.id = id || (Date.now() + "").slice(-10);
//         this.date = date ? new Date(date) : new Date();
//     }
//     _setDescription() {
//         const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
//         this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${months[this.date.getMonth()]} ${this.date.getDate()}`
//     }
// }

// class Running extends Workout {
//     type = 'running'
//     constructor(coords, distance, duration, cadence, id) {
//         super(coords, distance, duration, id)
//         this.cadence = cadence;
//         this._setDescription();
//         this.calcPace();
//     }
//     //could have saved to variable, going to compare perf later on
//     calcPace() {
//         this.pace = this.duration / this.distance;
//         return this.pace;
//     }
// }

// class Cycling extends Workout {
//     type = 'cycling'
//     constructor(coords, distance, duration, elevationGain, id) {
//         super(coords, distance, duration, id)
//         this.elevationGain = elevationGain;
//         this._setDescription();
//         this.calcSpeed();

//     }
//     //keeping my solution to compare with jonas later on
//     calcSpeed() {
//         this.speed = this.distance / (this.duration / 60);
//         return this.speed;
//     }
// }

// class Weather {
//     constructor() {
//         this.kelvinTemp = null;
//         this.city = null;
//         this.degreeType = 'celsius'; // default degree type
//         this.description = '';

//     }

//     setWeatherData({ kelvinTemp, city, description }) {
//         this.kelvinTemp = kelvinTemp;
//         this.city = city;
//         this.description = description;
//     }

//     convertToCelsius() {
//         // Kelvin to Celsius
//         return this.kelvinTemp - 273.15;
//     }

//     convertToFahrenheit() {
//         // Kelvin to Fahrenheit
//         return (this.kelvinTemp - 273.15) * 9/5 + 32;
//     }

//     toggleDegreeType() {
//         this.degreeType = this.degreeType === 'celsius' ? 'fahrenheit' : 'celsius';
//     }

//     getFormattedTemperature() {
//         if (this.degreeType === 'celsius') {
//             return this.convertToCelsius();
//         } else {
//             return this.convertToFahrenheit();
//         }
//     }
// }





// ///////////////////////////////////application architecture///////////////////////////////////////////////////////////////// 

// class App {
//     #map;
//     #defaultZoom = 13;
//     #mapEvent;
//     #workouts = [];
//     constructor() {
//         this._getPosition(); //get users location
//         this.isEdit = false; // flag for editing
//         //attach event handlers
//         form.addEventListener('submit', this._newWorkout.bind(this))
//         inputType.addEventListener('change', () => this._toggleElevationField(inputType.value));
//         containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));
//         containerWorkouts.addEventListener('click', this._editWorkout.bind(this));
//         containerWorkouts.addEventListener('click', this._deleteWorkout.bind(this))


//         this._loadLocalStorage();  //get data from local storage, if previous session
//     }

//     _getPosition() {
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function (err) {
//                 alert(`Please accept location services to continue, ${err.code}: ${err.message}`)
//             })
//         }
//     }

//     _loadMap(position) {
//         const { latitude, longitude } = position.coords;
//         console.log(this)
//         this.#map = L.map('map').setView([latitude, longitude], this.#defaultZoom);
//         L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
//             maxZoom: 19,
//             attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//         }).addTo(this.#map);
//         displayWeather(latitude, longitude)
//         //handling map clicks
//         this.#map.on('click', this._showForm.bind(this));
//         this.#workouts.forEach(workout => {
//             this._renderWorkoutMarker(workout)
//         })
//     }

//     _showForm(e) {
//         this.#mapEvent = e;
//         form.classList.remove('hidden');
//         inputDistance.focus();
//     }

//     _hideForm() {
//         //empty inputs
//         inputCadence.value = inputDistance.value = inputDuration.value = inputElevation.value = '';
//         //add hidden class back:
//         form.style.display = 'none';
//         form.classList.add('hidden');
//         setTimeout(() => form.style.display = 'grid', 1000);

//     }

//     _toggleElevationField(workoutType) {
//         console.log('5:', workoutType)
//         const elevationField = inputElevation.closest('.form__row');
//         const cadenceField = inputCadence.closest('.form__row');

//         if (workoutType === 'cycling') {
//             elevationField.classList.remove('form__row--hidden');
//             cadenceField.classList.add('form__row--hidden');
//         } else { // Assuming default is 'running'
//             cadenceField.classList.remove('form__row--hidden');
//             elevationField.classList.add('form__row--hidden');
//         }
//     }


//     _createOrUpdateWorkout(type, coords, distance, duration, cadenceOrElevation, workoutId = null) {
//         console.log('3: createOrUpdate')

//         let workout;
//         let cadence, elevation;
//         console.log(type)
//         if (workoutId) {
//             const index = this.#workouts.findIndex(w => w.id === workoutId);
//             if (index !== -1) {
//                 if (type === 'running') {
//                     cadence = cadenceOrElevation;
//                     console.log(type)
//                     this.#workouts[index] = new Running(coords, distance, duration, cadence, workoutId);
//                 } else if (type === 'cycling') {
//                     elevation = cadenceOrElevation;
//                     console.log(type)
//                     this.#workouts[index] = new Cycling(coords, distance, duration, elevation, workoutId);
//                 }
//                 workout = this.#workouts[index];
//             }
//         } else {
//             if (type === 'running') {
//                 cadence = cadenceOrElevation;
//                 workout = new Running(coords, distance, duration, cadence);
//             } else if (type === 'cycling') {
//                 elevation = cadenceOrElevation;
//                 workout = new Cycling(coords, distance, duration, elevation);
//             }
//         }
//         return workout;
//     }

//     _validateInputs(inputs) {
//         return inputs.every(n => Number.isFinite(n) && n > 0);
//     }

//     _newWorkout(e) {
//         if (this.isEdit) {
//             this.isEdit = false;
//             return;
//         };
//         e.preventDefault();

//         console.log('2: newWorkout', this.#workouts)


//         const type = inputType.value;
//         const distance = +inputDistance.value;
//         const duration = +inputDuration.value;
//         const { lat, lng } = this.#mapEvent.latlng;
//         let workout;

//         if (type === 'running') {
//             const cadence = +inputCadence.value;
//             if (this._validateInputs([distance, duration, cadence])) {
//                 workout = this._createOrUpdateWorkout(type, [lat, lng], distance, duration, cadence);
//             } else {
//                 return alert('Invalid input for running workout');
//             }
//         } else if (type === 'cycling') {
//             const elevation = +inputElevation.value;
//             if (this._validateInputs([distance, duration, elevation])) {
//                 workout = this._createOrUpdateWorkout(type, [lat, lng], distance, duration, elevation);
//             } else {
//                 return alert('Invalid input for cycling workout');
//             }
//         }

//         // add new object to workout array
//         this.#workouts.push(workout);
//         // Render workout on map as marker
//         this._renderWorkoutMarker(workout)
//         // Render workout on the list
//         this._renderWorkout(workout);
//         // hide the form, clear the inputs
//         this._hideForm();
//         //set local storage to all workouts
//         this._setLocalStorage();
//     }

//     _editWorkout(e) {
//         if (!e.target.classList.contains('edit')) return;
//         this.isEdit = true;
//         console.log('1: edit workout')
//         const item = e.target.closest('.workout');

//         let cadence, elevation, cadenceOrElevation;

//         this._showForm(e);

//         const workoutToEdit = this.#workouts.find(workout => {
//             return workout.id === item.dataset.id;
//         })
//         console.log(workoutToEdit)

//         this._toggleElevationField(workoutToEdit.type);

//         console.log(workoutToEdit)


//         if (workoutToEdit.type === 'running') {
//             inputType.value = workoutToEdit.type;
//             inputDistance.value = workoutToEdit.distance;
//             inputDuration.value = workoutToEdit.duration;
//             inputCadence.value = workoutToEdit.cadence;
//             cadence = +inputCadence.value;
//             // Ensure elevation field is hidden
//         } else if (workoutToEdit.type === 'cycling') {
//             inputType.value = workoutToEdit.type;
//             inputDistance.value = workoutToEdit.distance;
//             inputDuration.value = workoutToEdit.duration;
//             inputElevation.value = workoutToEdit.elevation;
//             elevation = +inputElevation.value;
//             // Ensure cadence field is hidden
//         }

//         form.addEventListener('submit', (e) => {

//             const type = inputType.value;
//             const distance = +inputDistance.value;
//             const duration = +inputDuration.value;
//             const cadence = type === 'running' ? +inputCadence.value : undefined;
//             const elevation = type === 'cycling' ? +inputElevation.value : undefined;
//             if (workoutToEdit.type === 'running') {
//                 cadenceOrElevation = cadence;
//             }
//             if (workoutToEdit.type === 'cycling') {
//                 cadenceOrElevation = cadence;
//             }

//             if (this._validateInputs([distance, duration, cadence || elevation])) {
//                 const updatedWorkout = this._createOrUpdateWorkout(type, workoutToEdit.coords, distance, duration, cadenceOrElevation, item.dataset.id);
//                 console.log(this.#workouts)
//                 this._renderWorkout(updatedWorkout); // Method to re-render all workouts
//                 this._renderWorkoutMarker(workoutToEdit);
//                 this._setLocalStorage();
//                 this._hideForm();
//                 this.isEdit = false;
//             } else {
//                 alert('Invalid inputs');
//             }


//         });




//     }
//     _renderWorkoutMarker(workout) {
//         console.log('6: renderworkoutmarker')
//         const marker = L.marker([workout.coords[0], workout.coords[1]], {
//             workoutID: workout.id
//         }).addTo(this.#map)
//             .bindPopup(`${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'}: ${workout.description}`, {
//                 maxWidth: 300,
//                 minWidth: 100,
//                 autoClose: false,
//                 closeOnClick: false,
//                 className: `${workout.type}-popup`
//             })
//             .openPopup();

//     }

//     _renderWorkout(workout) {
//         console.log('4: renderworkout')

//         let html = `
//          <li class="workout workout--${workout.type}" data-id="${workout.id}">
//         <h2 class="workout__title">${workout.description}</h2>
//         <button class="edit" id="editButton" >Edit Workout</button>
//         <button class="delete-single" id"deleteButton">Delete</button> 
//         </div>
//         <div class="workout__details">
//           <span class="workout__icon"> ${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'}</span>
//           <span class="workout__value">${workout.distance}</span>
//           <span class="workout__unit">km</span>
//         </div>
//         <div class="workout__details">
//           <span class="workout__icon">⏱</span>
//           <span class="workout__value">${workout.duration}</span>
//           <span class="workout__unit">min</span>
//         </div>
        
//         `;
//         if (workout.type === 'running') {
//             html += `
//                 <div class="workout__details">
//                     <span class="workout__icon">⚡️</span>
//                     <span class="workout__value">${workout.pace.toFixed(1)}</span>
//                     <span class="workout__unit">min/km</span>
//                 </div>
//                 <div class="workout__details">
//                     <span class="workout__icon">⛰</span>
//                     <span class="workout__value">${workout.cadence}</span>
//                     <span class="workout__unit">spm</span>
//                 </div>
//             `;
//         }
//         if (workout.type === 'cycling') {
//             html += `
//                 <div class="workout__details">
//                     <span class="workout__icon">⚡️</span>
//                     <span class="workout__value">${workout.speed.toFixed(1)}</span>
//                     <span class="workout__unit">km/h</span>
//                 </div>
//                 <div class="workout__details">
//                     <span class="workout__icon">⛰</span>
//                     <span class="workout__value">${workout.elevationGain}</span>
//                     <span class="workout__unit">m</span>
//                 </div>
//             </li>
//             `;
//         }
//         form.insertAdjacentHTML('afterend', html)

//     }

//     ////////////////////////////////////////////////////////////////////////////////////

//     _deleteWorkout(e) {
//         if (!e.target.classList.contains('delete-single')) {
//             return;
//         }

//         const deleteMessage = confirm(`Are you sture you want to delete all your hard work?`)

//         if (deleteMessage) {
//             const workoutEl = e.target.closest(".workout")
//             if (!workoutEl) return;
//             const workoutDelIndex = this.#workouts.findIndex((work) => work.id === workoutEl.dataset.id)

//             this.#workouts.splice(workoutDelIndex, 1)

//             this._setLocalStorage()

//             workoutEl.remove()

//             this.#map.eachLayer(function (layer) {
//                 if (layer instanceof L.Marker && layer.options.workoutID == workoutEl.dataset.id) {
//                     layer.remove()
//                 }
//             })
//         }
//     }

//     _moveToPopup(e) {

//         const workoutElement = e.target.closest('.workout')
//         if (!workoutElement) {
//             return;
//         }

//         const workout = this.#workouts.find(el => el.id === workoutElement.dataset.id)
//         // if delete:

//         this.#map.setView(workout.coords, this.#defaultZoom, {
//             animate: true,
//             pan: {
//                 duration: 2
//             }
//         })
//         //using public interface:
//         // workout.click();
//     }
//     _setLocalStorage() {
//         console.log('8: set local storage')
//         localStorage.setItem('workouts', JSON.stringify(this.#workouts))
//     }

//     _loadLocalStorage() {
//         console.log('9: set local storage')

//         const data = JSON.parse(localStorage.getItem('workouts'))
//         if (!data) return;
//         this.#workouts = data;
//         this.#workouts.forEach(workout => {
//             this._renderWorkout(workout)
//         })
//     }
// }

// /////////////////////////////////////////////////////////WEATHER ///////////////////////////////////////////////////
// const weatherInstance = new Weather();


// async function displayWeather(lat, lon) {
//     try {
//         console.log('1: displayWeather')
//         const data = await getWeather(lat, lon);
//         if (!data) throw new Error("No weather data available");
//         const kelvinTemp = data.list[0].main.temp;
//         const description = data.list[0].weather[0].description;
//         const newDescription = description[0].toUpperCase() + description.substring(1);
//         const city = data.city.name;
//         //stop here!!
//         weatherInstance.setWeatherData({ kelvinTemp, city, description });
//         const temperature = weatherInstance.getFormattedTemperature();
//         const degreeType = weatherInstance.degreeType;
//         updateDisplay(temperature, degreeType, city, newDescription);
//     } catch (err) {
//         console.error(err);
//         weatherLi.textContent = 'Current weather data unavailable';
//     }
// }

// async function getWeather(lat, lon, degreeType = 'celsius') {
//     const key = '03c95743404fb2fb37f070483c7a7ba8';
//     const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}`//could do ...lon&units=metric&appid... 
//     try {
//         console.log('2: getWeather')
//         const response = await fetch(url);
//         const data = await response.json();
//         return data;
//         // You can now use 'data' to update your webpage or perform other actions
//     } catch (error) {
//         console.error('Error fetching weather data:', error);
//     }
// }


// async function updateDisplay(temp, degreeType, city, description) {
//     try {
//         //convert weather to C or F, default celsius;
//         console.log('3: updateDisplay')
//         console.log(description)
//         const weatherDescription = description || weatherInstance.description;
//         const formattedDescription = weatherDescription[0].toUpperCase() + weatherDescription.substring(1);
//         const displayedWeather = `${formattedDescription} today in ${city}, it is ${temp.toFixed(0)} degrees ${degreeType}`
//         weatherLi.textContent = displayedWeather;
//     } catch(err) {
//         console.log(err)
//         weatherLi.textContent = 'Current weather data unavailable';
//     }
// }

// fahrOrCels.addEventListener('click', celsiusOrFahrenheit);


// function celsiusOrFahrenheit(e) {
//     console.log('4: celsiusOrFahrenheit')

//     e.preventDefault();
//     weatherInstance.toggleDegreeType();
//     const temperature = weatherInstance.getFormattedTemperature();
//     const degreeType = weatherInstance.degreeType;
//     const city = weatherInstance.city;
//     const description = weatherInstance.description
//     console.log(weatherInstance)

//     updateDisplay(temperature, degreeType, city, description);
// }


// const app = new App();
