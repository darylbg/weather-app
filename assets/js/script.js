var button = $('#search-btn');
var value = $('#example-search-input');

button.click(function() {
    fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + value[0].value + '&appid=1f8683fe1384aa1e2f6cda5b83b27321')
    .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
                console.log(data.city.name);
                setCurrentWeather(data.list[0].weather[0].icon, data.city.name, data.list[0].dt_txt, data.list[0].main.temp, data.list[0].weather[0].description, data.list[0].wind.speed);
                console.log(data.list[0].weather[0].icon);
                //$('#current-weather').find('h5').text(data.city.name);
                setFutureWeather(data.list[6].dt_txt);
            });
        } else {
            alert('error');
        }
    })
    .catch(function (error) {
        alert('Unable to connect to GitHub');
    });
});

function setCurrentWeather(descriptionIcon, cityName, date, temperature, weather, windSpeed) {
    $('#current-weather').css('background-image', 'url("https://openweathermap.org/img/w/' + descriptionIcon + '.png")');
    $('#current-weather').find('h5').text(cityName);
    $('#current-weather').find('h5').eq(1).text(date);
    $('#current-weather').find('p').eq(0).text((temperature - 273.15).toFixed(1) + '°C');
    $('#current-weather').find('p').eq(1).text(weather);
    $('#current-weather').find('p').eq(2).text('Wind Speed: ' + (windSpeed * 2.2).toFixed(1) + 'mph');
}

function setFutureWeather(date) {
    var futureWeatherEl = $('.future-weather-display').children();
    console.log(futureWeatherEl.length);

    for (i = 0; i < futureWeatherEl.length; i++) {
        $(futureWeatherEl[i]).children().children('h5').text(date);
    }
}