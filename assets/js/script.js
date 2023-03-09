var button = $('#search-btn');
var searchInput = $('#example-search-input');

// setting current day
var now = dayjs();
$('#current-day-date').text(now.format("DD/MM/YYYY"));

// setting days in advance from current day
var day1Date = now.add(1, 'day');
var day2Date = now.add(2, 'day');
var day3Date = now.add(3, 'day');
var day4Date = now.add(4, 'day');
var day5Date = now.add(5, 'day');

$('#day1-date').text(day1Date.format("MM-DD-YYYY"));
$('#day2-date').text(day2Date.format("MM-DD-YYYY"));
$('#day3-date').text(day3Date.format("MM-DD-YYYY"));
$('#day4-date').text(day4Date.format("MM-DD-YYYY"));
$('#day5-date').text(day5Date.format("MM-DD-YYYY"));

// setting a local storage key to store an array of strings
var searches = JSON.parse(localStorage.getItem('searches')) || [];
var searchValue;
// on button click, local storage is updated and an api is called
button.click(function() {
    searchValue = searchInput.val();
    localStorage.setItem('searches', JSON.stringify(searches));
    $('.future-weather-display').text('');
    $('.recent-searches').text('');
    console.log('searchValue:', searchValue);
    fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + searchValue + '&appid=c42bd53b497736aab98f794d9e907730')
    .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                // sets parameter values in setCurrentWeather to locations in the api data
                setCurrentWeather(data.list[0].weather[0].icon, data.city.name, data.list[0].weather[0].description, data.list[0].main.temp, data.list[0].wind.speed, data.list[0].main.humidity);             
                // adds enterred text to localstorage
                searches.unshift(searchValue);
                // sets the 5 day forecast
                setFutureWeather(searchValue);   
                // adds the updated localstorage to display       
                searchHistory();       
                // resets input field to blank
                searchInput.val('');
            });
        } else {
            // error thrown if the text enterred returns an invalid api call
            alert('Please enter a valid country or city name');
        }
    })
    .catch(function () {
        alert('Unable to connect to GitHub');
    });
});

// sets current day data to populate html 
function setCurrentWeather(descriptionIcon, cityName, weather, temperature, windSpeed, humidity) {
    $('#current-weather').find('img').attr('src', 'https://openweathermap.org/img/w/' + descriptionIcon + '.png');
    $('#current-weather').find('h5').eq(0).text(cityName);
    $('#current-weather').find('p').eq(0).text(weather);
    $('#current-weather').find('p').eq(1).text('Temperature: ' + (temperature - 273.15).toFixed(2) + '°C');
    $('#current-weather').find('p').eq(2).text('Wind Speed: ' + (windSpeed * 2.2).toFixed(2) + 'mph');
    $('#current-weather').find('p').eq(3).text('Humidity: ' + humidity + '%')
}

// function to set the current forecast for recent searches
function searchHistory() {
    // adds a button for each item in the local storage array
    for (let i = 0; i < 6 && i < searches.length; i++) {
        var buttonList = $('<button>').addClass('btn btn-secondary search-history-btn').text(searches[i]);
        $('.recent-searches').append(buttonList);
        // sets the weather forecast for location saved in localstorage
        buttonList.click(function() {
            var searchHistoryValue = $(this).text();
            console.log(searchHistoryValue);
            $('.future-weather-display').text('');
            fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + searchHistoryValue + '&appid=c42bd53b497736aab98f794d9e907730')
            .then(function (response) {
                if (response.ok) {
                    response.json().then(function (data) {
                        console.log(data);
                        console.log(data.city.name);
                        setCurrentWeather(data.list[0].weather[0].icon, data.city.name, data.list[0].weather[0].description, data.list[0].main.temp, data.list[0].wind.speed, data.list[0].main.humidity);
                        console.log(data.list[0].weather[0].icon);

                        setFutureWeather(searchHistoryValue);

                    });
                } else {
                    // error thrown if the text enterred returns an invalid api call
                    alert('Please enter a valid country or city name');
                }
            })
            .catch(function () {
                alert('Unable to connect to GitHub');
            });
        });
    }
} searchHistory();

// sets 5 day forecast from current day
function setFutureWeather(searchValue) {
    fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + searchValue + '&appid=c42bd53b497736aab98f794d9e907730')
    .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                // generates a card for every 8th item in the array as the api return data every 3 hours
                for (let i = 7; i < data.list.length; i += 8) {
                    var div = $('<div>').addClass('card col');
                    var cardBody = $('<div>').addClass('card-body');
                    // formats the date from the api 
                    const dateTxt = data.list[i].dt_txt;
                    const dateObj = new Date(dateTxt);
                    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
                    const formattedDate = dateObj.toLocaleDateString('en-GB', options);
                    // generates dom elements and adds classes, styling and content
                    var h6 = $('<h6>').addClass('card-title').css('text-align', 'center').text(formattedDate);
                    var image = $('<img>').attr('src', 'https://openweathermap.org/img/w/' + data.list[i].weather[0].icon + '.png');
                    var p1 = $('<p>').addClass('card-text').text('Temp: ' + (data.list[i].main.temp - 273.15).toFixed(1) + '°C');
                    var p3 = $('<p>').addClass('card-text').text('Humidity: ' + data.list[i].main.humidity + '%');
                    var p2 = $('<p>').addClass('card-text').text('Wind: ' + (data.list[i].wind.speed * 2.2).toFixed(1) + 'mph');
                    // appends generated elements to the dom
                    cardBody.append(h6, image, p1, p2, p3);
                    div.append(cardBody);
                    $('.future-weather-display').append(div);
                }

            });
        } else {
            // error thrown if the text enterred returns an invalid api call
            alert('Please enter a valid country or city name');
        }
    })
    .catch(function () {
        alert('Unable to connect to GitHub');
    });
}