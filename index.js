// let x = 2;
// const y = 3;

// console.log(`My favourite number is ${x}`);

// if (x != y) {
//     console.log(`my favourite number is ${y}`);
// } else {
//     console.log(`my favourite number is ${x}`);
// }

// try {
//     y = 5;
// } catch (err) {
//     console.log(err.message);
// }

// let a = {
//     "name": 'Adarsh'
// }

// console.log(a['name']);

// let a = ["hihihi", true, 90]

// console.log(a[0]);

// const wO1 = {
//     'nameLocation': 'Tampa',
//     'countryCode': 'US',
//     'description': 'Sunny',
//     'temperature': '28.5',
//     'feelsLike': '35',
//     'windspeed': '19',
//     'humidity': '68%'
// }

// const wO2 = {
//     'nameLocation': 'SLC',
//     'countryCode': 'US',
//     'description': 'Sunny',
//     'temperature': '20.5',
//     'feelsLike': '25',
//     'windspeed': '8',
//     'humidity': '1%'
// }

API_Key = "d1c20b586ba0e8c6c16608f71ed53cde";

async function getCoordinates(name) {
    try {
        const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${name}&limit=5&appid=${API_Key}`, { mode: "cors" })
        const data = await response.json();
        const latlon = {
            lat: data[0].lat,
            lon: data[0].lon,
        }
        return latlon;
    } catch {

    }
}

async function getCurrentWeather(lat, lon) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_Key}`)
        const weatherData = await response.json();
        return weatherData;
    } catch (e) {

    }
}

async function weather(name) {
    try {
        const coordinates = getCoordinates(name);
        const data = await getCurrentWeather((await coordinates).lat, (await coordinates).lon);

        const nameLocation = data.name; //the "name" part is part of the JSON file fetched by the request above. Read the JSON documentation on the API website to check the list of variables fetched
        const countryCode = data.sys.country;
        const description = data.weather[0].description;
        const temperature = data.main.temp;
        const feelsLike = data.main.feels_like;
        const windSpeed = data.wind.speed;
        const humidity = data.main.humidity;

        return {
            nameLocation,
            countryCode,
            description,
            temperature,
            feelsLike,
            windSpeed,
            humidity
        }

    } catch (e) {
        return "error";
    }
}

const renderWeatherComponent = (weatherObj) => {

    const main = document.createElement("main"); //creates a div with the tags <main></main> 
    document.querySelector("body").appendChild(main); //appends the body tag and adds the "main" div inside the body

    const locationName = document.createElement("h1");
    locationName.id = "location"; //changes the id of the locationName constant
    locationName.textContent = `${weatherObj.nameLocation}, ${weatherObj.countryCode}`;
    main.appendChild(locationName);

    const description = document.createElement("h2");
    description.id = "description";
    description.textContent = `${weatherObj.description}`;
    main.appendChild(description);

    const bottomContainer = document.createElement("div");
    bottomContainer.id = "bottomContainer";
    main.appendChild(bottomContainer);

    const leftSide = document.createElement("div");
    leftSide.id = "leftSide";
    bottomContainer.appendChild(leftSide);

    const temperature = document.createElement("h2");
    temperature.id = "temperature";
    temperature.textContent = `${weatherObj.temperature}`;
    leftSide.appendChild(temperature);

    const units = document.createElement("h4");
    units.id = "units";
    units.textContent = "K";
    leftSide.appendChild(units);

    const rightSide = document.createElement("div");
    rightSide.id = "rightSide";
    bottomContainer.appendChild(rightSide);

    const feelsLike = document.createElement("p");
    feelsLike.id = "feelsLike";
    feelsLike.textContent = `Feels like: ${weatherObj.feelsLike}K`;
    rightSide.appendChild(feelsLike);

    const windspeed = document.createElement("p");
    windspeed.id = "windspeed";
    windspeed.textContent = `Wind Speed: ${weatherObj.windspeed}km/h`;
    rightSide.appendChild(windspeed);

    const humidity = document.createElement("p");
    humidity.id = "humidity";
    humidity.textContent = `Humidity: ${weatherObj.humidity}`;
    rightSide.appendChild(humidity);

}

async function renderer(weatherObject, first = false) {
    const weatherData = await weatherObject;

    try {
        document.getElementById("errorMessage").remove();
    } catch {}

    if (weatherData == "error") {
        console.log("error");
    } else if (first == true) {
        renderWeatherComponent(weatherData);
    } else {
        document.querySelector("main").remove();
        document.querySelector("input").value = "";
        renderWeatherComponent(weatherData);
    }

}

document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();
    renderer(weather(document.querySelector("input").value));
})

renderer(weather("Lyon"), true)