const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");

const API_KEY = "7a73f546e23472cce6023cba32b7b261"; // API key for OpenWeatherMap API

const createWeatherCard = (cityName, weatherItem, index) => {
    if(index === 0) { // HTML for the main weather card
        return `<div class="details">
                    <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <h6>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
                    <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                    <h6>Humidity: ${weatherItem.main.humidity}%</h6>
                </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h6>${weatherItem.weather[0].description}</h6>
                </div>`;
    } else { // HTML for the other five day forecast card
        return `<li class="card">
                    <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h6>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
                    <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                    <h6>Humidity: ${weatherItem.main.humidity}%</h6>
                </li>`;
    }
}

const getWeatherDetails = (cityName, latitude, longitude) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL).then(response => response.json()).then(data => {
        // Filter the forecasts to get only one forecast per day
        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if (!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }
        });

        // Clearing previous weather data
        cityInput.value = "";
        currentWeatherDiv.innerHTML = "";
        weatherCardsDiv.innerHTML = "";

        // Creating weather cards and adding them to the DOM
        fiveDaysForecast.forEach((weatherItem, index) => {
            const html = createWeatherCard(cityName, weatherItem, index);
            if (index === 0) {
                currentWeatherDiv.insertAdjacentHTML("beforeend", html);
            } else {
                weatherCardsDiv.insertAdjacentHTML("beforeend", html);
            }
        });        
    }).catch(() => {
        alert("An error occurred while fetching the weather forecast!");
    });
}

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (cityName === "") return;
    const API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
    
    // Get entered city coordinates (latitude, longitude, and name) from the API response
    fetch(API_URL).then(response => response.json()).then(data => {
        if (!data.length) return alert(`No coordinates found for ${cityName}`);
        const { lat, lon, name } = data[0];
        getWeatherDetails(name, lat, lon);
    }).catch(() => {
        alert("An error occurred while fetching the coordinates!");
    });
}

const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords; // Get coordinates of user location
            // Get city name from coordinates using reverse geocoding API
            const API_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
            fetch(API_URL).then(response => response.json()).then(data => {
                const { name } = data[0];
                getWeatherDetails(name, latitude, longitude);
            }).catch(() => {
                alert("An error occurred while fetching the city name!");
            });
        },
        error => { // Show alert if user denied the location permission
            if (error.code === error.PERMISSION_DENIED) {
                alert("Geolocation request denied. Please reset location permission to grant access again.");
            } else {
                alert("Geolocation request error. Please reset location permission.");
            }
        });
}

locationButton.addEventListener("click", getUserCoordinates);
searchButton.addEventListener("click", getCityCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());






// let cityInput = document.getElementById("city-input");
// let searchButton = document.getElementById("getWeatherBtn");
// let locationButton = document.querySelector(".location-btn");
// let currentWeatherDiv = document.querySelector(".current-weather");
// let weatherCardsDiv = document.querySelector(".weather-cards");

// let API_KEY = "7a73f546e23472cce6023cba32b7b261"; // Fixed the missing semicolon here

// let createWeatherCard = (cityName, weatherItem, index) => {
//     if (index === 0) { //html for the main card
        
//         return `<div class="details">
//                     <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
//                     <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4> <!-- Fixed the temperature conversion -->
//                     <h4>Wind: ${weatherItem.wind.speed}M/S </h4>
//                     <h4>Humidity: ${weatherItem.main.humidity}</h4>
//                 </div>
//                 <div class="icon">
//                     <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="">
//                     <h4>${weatherItem.weather[0].description}</h4>
//                 </div>`;
        
//     } else {
//         return `<li class="card">
//                     <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3> <!-- Fixed the closing h3 tag here -->
//                     <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png">
//                     <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4> <!-- Fixed the temperature conversion -->
//                     <h4>Wind: ${weatherItem.wind.speed}M/S </h4>
//                     <h4>Humidity: ${weatherItem.main.humidity}</h4>
//                 </li> `;
//         // return ""; // Commented out this line to keep the comment.
//     }
    
// }
// // console.log(createWeatherCard);

// let getWeatherDetails = (cityName, lat, lon) => {
//     let WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

//     fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
//         //filter the forecasts to get only one forecast per day

//         let uniqueForecastDays = [];
//         let fiveDaysForecast =  data.list.filter(forecast => {
//             let forecastDate = new Date(forecast.dt_txt).getDate(); // Fixed dt_txt typo
//             if (!uniqueForecastDays.includes(forecastDate)) {
//                 return uniqueForecastDays.push(forecastDate);
//             }
//         });

        
//         //Clearing previous weather data
//         cityInput.value = "";
//         currentWeatherDiv.innerHTML = "";
//         weatherCardsDiv.innerHTML = "";
//         //Creating weather cards and adding them to the DOM
//         fiveDaysForecast.forEach((weatherItem, index) => { // Fixed forEach syntax

//             weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(weatherItem));
//             // let cardHtml = createWeatherCard(cityName, weatherItem, index);
//             // if (cardHtml) {
//             //     if (index === 0) {
//             //         currentWeatherDiv.insertAdjacentHTML("beforeend", cardHtml);
//             //     } else {
//             //         weatherCardsDiv.insertAdjacentHTML("beforeend", cardHtml);
//             //     }
//             // }
//         });
//     })
//     .catch(() => {
//         alert("An error occurred while fetching the coordinates");
//     });
// }

// let getCityCoordinates = () => {
//     cityName = document.getElementById("city-input").value.trim();
//     if (!cityName) return; //return if city name is empty
//     let GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
//     //get entered city coodinates (latitude, longitude, and name) from the API response
//     fetch(GEOCODING_API_URL)
//         .then(res => res.json())
//         .then(data => {
//             if (!data.length) return alert(`No coordinates found for ${cityName}`);
//             let { name, lat, lon } = data[0];
//             getWeatherDetails(name, lat, lon);
//         })
//         .catch(() => {
//             alert("An error occurred while fetching the coordinates");
//     });
    
// }


// // let getUserCoordinates = () => {
// //     navigator.geolocation.getCurrentPosition(
// //         position => {
// //             let { latitude, longitude } = position.coords;
// //             let REVERSE_GEOCORDING_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit={limit}&appid=${API_KEY}`

// //             //get city name from coordinates using reverse geocoding API
// //             fetch(REVERSE_GEOCORDING_URL).then(res => res.json()).then(data => {
// //                 let { name, lat, lon } = data[0];
// //                 getWeatherDetails(name, latitude, longitude);
// //             }).catch(() => {
// //                 alert("An error occurred while fetching the coordinates");
// //             });
// //         },
// //         error => {
// //             if(error.code === error.PERMISSION_DENIED) {
// //                 alert("Geolocation request denied. Please reset location permission to grant access ")
// //             }
// //         }
// //     )
// // }

// // locationButton.addEventListener("click", getUserCoordinates);
// searchButton.addEventListener("click", getCityCoordinates);
// cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());
