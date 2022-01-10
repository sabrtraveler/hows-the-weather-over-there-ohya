// assign variables for date

var d = new Date()
var month = d.getMonth()
var year = d.getFullYear()
var monthDay = d.getDate()
var completeDate = '(' + month + '/' + monthDay + '/' + year + ')'


// assign api key to variable
var apiKey = '3a5dcccabb31635037afffcfa07050bc'

// store city name in local storage
var cName = JSON.parse(localStorage.getItem("city")) 

// query the url based on the city
var qUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cName + '&appid=' + apiKey

// Get the cities saved in the local storage 
// Create buttons based on the city names in local storage 
// Put a value attribute and some styling 

var cButtons = JSON.parse(localStorage.getItem("cities")) || []
for (var i = 0; i < cButtons.length; i++) {
    var additionalCity = document.createElement("button")
    var buttonsSection = document.getElementById("buttons")
    additionalCity.innerHTML = cButtons[i]
    additionalCity.classList.add("btn", "border", "btn-block", "mt-0", "text-left", "city")
    additionalCity.setAttribute("value", cButtons[i])
    buttonsSection.appendChild(additionalCity)
}

// store city input into variable
var city = document.getElementById("cityInput")

// Selector for the search button
var search = document.getElementById("searchButton")


// create an event listener for search button
// A button is created and weather information is displayed 
// when additional city is added it gets put in local storage
search.addEventListener("click", function() {
    var additionalCity = document.createElement("button")
    var buttonsSection = document.getElementById("buttons")
    additionalCity.innerHTML = city.value.toLowerCase()
    additionalCity.classList.add("btn", "border", "btn-block", "mt-0", "text-left", "city")
    additionalCity.setAttribute("value", city.value.toLowerCase())
    buttonsSection.appendChild(additionalCity)
    cButtons.push(city.value.toLowerCase())
    localStorage.setItem("cities", JSON.stringify(cButtons))
    cName = city.value
    qUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cName + '&appid=' + apiKey
    localStorage.setItem('city', JSON.stringify(cName))
    apiData()
})



// store variables for the buttons and the city
var buttons = document.getElementById('buttons')
var selectCity = document.querySelectorAll('.city')


// put the event listeners on all buttons
buttons.addEventListener('click', function() {
    if (event.target.matches('.city')) {
        cName = event.target.value
        qUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cName + '&appid=' + apiKey
        localStorage.setItem('city', JSON.stringify(cName))
        apiData()
    }
})


// create a function to fetch weather data
function apiData() {
    fetch(qUrl)
        .then(function(response) {
            return response.json()
        })
        .then(function(weatherData) {

            var dateIndex = 0

            var cityNameFetch = weatherData.city.name

            var weatherIcon = weatherData.list[dateIndex].weather[0].icon

            var temperature = (Number((weatherData.list[dateIndex].main.temp) * 9 / 5 - 459.67)).toFixed(1)

            var humidity = weatherData.list[dateIndex].main.humidity

            var windSpeed = Number(weatherData.list[dateIndex].wind.speed).toFixed(1)

            var latitude = JSON.stringify(weatherData.city.coord.lat)

            var longitude = JSON.stringify(weatherData.city.coord.lon)

            // set variables to HTML
            var selectorCity = document.getElementById("city-name")
            var selectorTemperature = document.getElementById("temperature")
            var selectorHumidity = document.getElementById("humidity")
            var selectorWindSpeed = document.getElementById("wind-speed")
            var elementWeatherIcon = document.createElement('img')

            // setting the html text content to the api data
            selectorCity.textContent = cityNameFetch + ' (' + month + '/' + monthDay + '/' + year + ')'
            selectorTemperature.textContent = 'Temperature: ' + temperature + '\u00B0 F'
            selectorHumidity.textContent = 'Humidity: ' + humidity + '%'
            selectorWindSpeed.textContent = 'Wind Speed: ' + windSpeed + ' MPH'
            selectorCity.appendChild(elementWeatherIcon)
            elementWeatherIcon.setAttribute('src', 'http://openweathermap.org/img/wn/' + weatherIcon + '.png')

            // getting the UV data
            var uvUrl = 'https://api.openweathermap.org/data/2.5/uvi?appid=' + apiKey + '&lat=' + latitude + '&lon=' + longitude
            fetch(uvUrl)
                .then(function(uvResponse) {
                    return uvResponse.json()
                })
                .then(function(UVData) {
                    var uvIndex = UVData.value
                    var uvIndexSelector = document.getElementById("uv-index")
                    var uvLabel = document.getElementById("uv-label")
                    uvLabel.textContent = 'UVIndex:'
                    uvIndexSelector.textContent = uvIndex
                        // uv index >= 8 the button is red
                    if (uvIndex >= 8) {
                        uvIndexSelector.classList.add("bg-danger")
                        uvIndexSelector.classList.remove("bg-warning")
                        uvIndexSelector.classList.remove("bg-success")
                    }
                    // uv index < 8 & > 2 button is yellow
                    else if (uvIndex < 8 && uvIndex > 2) {
                        uvIndexSelector.classList.add("bg-warning")
                        uvIndexSelector.classList.remove("bg-success")
                        uvIndexSelector.classList.remove("bg-danger")
                    }
                    // otherwise button is green
                    else {
                        uvIndexSelector.classList.add("bg-success")
                        uvIndexSelector.classList.remove("bg-danger")
                        uvIndexSelector.classList.remove("bg-warning")
                    }
                })

            // five day forecast update
            var day = 1

            // loop through the five day forecast
            while (day < 6) {
                
                dateIndex += 7
                monthDay += 1
                completeDate = '(' + month + '/' + monthDay + '/' + year + ')'

                // creating the weather icon
                weatherIcon = weatherData.list[dateIndex].weather[0].icon

                // convert temp to farrenheit 
                temperature = (Number((weatherData.list[dateIndex].main.temp) * 9 / 5 - 459.67)).toFixed(1)

                // setting the humidity
                humidity = weatherData.list[dateIndex].main.humidity

                // selecting the html elements
                var selectorDate = document.getElementById("date" + day)
                var selectorWeatherIcon = document.getElementById('weather-icon' + day)
                var selectorTemp = document.getElementById("temp" + day)
                var selectorHumid = document.getElementById("humid" + day)

                // get data for date, weather, temp and humidity
                selectorDate.textContent = completeDate
                selectorWeatherIcon.setAttribute('src', 'http://openweathermap.org/img/wn/' + weatherIcon + '.png')
                selectorTemp.textContent = "Temp: " + temperature + '\u00B0 F'
                selectorHumid.textContent = "Humidity: " + humidity + '%'
                
                day += 1

            }
            // reset back to current date
            monthDay = d.getDate()
        })
}

apiData()