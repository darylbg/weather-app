var button = $('#search-btn');
var value = $('#example-search-input');

var now = dayjs();
$('#current-day-date').text(now.format("MM-DD-YYYY"));

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


var searches = JSON.parse(localStorage.getItem('searches')) || [];

button.click(function() {
    searches.push(value.val());
    localStorage.setItem('searches', JSON.stringify(searches));
    
    fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + value[0].value + '&appid=c42bd53b497736aab98f794d9e907730')
    .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
                console.log(data.city.name);
                setCurrentWeather(data.list[0].weather[0].icon, data.city.name, data.list[0].main.temp, data.list[0].weather[0].description, data.list[0].wind.speed);
                console.log(data.list[0].weather[0].icon);

                setFutureWeather();
            });
        } else {
            alert('error');
        }
    })
    .catch(function (error) {
        alert('Unable to connect to GitHub');
    });
});

function setCurrentWeather(descriptionIcon, cityName, temperature, weather, windSpeed) {
    $('#current-weather').find('img').attr('src', 'https://openweathermap.org/img/w/' + descriptionIcon + '.png');
    $('#current-weather').find('h5').eq(0).text(cityName);
    $('#current-weather').find('p').eq(0).text((temperature - 273.15).toFixed(2) + '°C');
    $('#current-weather').find('p').eq(1).text(weather);
    $('#current-weather').find('p').eq(2).text('Wind Speed: ' + (windSpeed * 2.2).toFixed(2) + 'mph');
}

function setFutureWeather(date) {
    fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + value[0].value + '&appid=c42bd53b497736aab98f794d9e907730')
    .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
                console.log(data.list.length);

                for (let i = 7; i < data.list.length; i += 8) {
                    const div = $('<div>').addClass('card col');
                    const cardBody = $('<div>').addClass('card-body');
                    const h6 = $('<h6>').addClass('card-title').text(data.list[i].dt_txt);
                    var image = $('<img>').attr('src', 'https://openweathermap.org/img/w/' + data.list[i].weather[0].icon + '.png');
                    const p1 = $('<p>').addClass('card-text').text((data.list[i].main.temp - 273.15).toFixed(2) + '°C');
                    const p3 = $('<p>').addClass('card-text').text(data.list[i].weather[0].description);
                    const p2 = $('<p>').addClass('card-text').text((data.list[i].wind.speed * 2.2).toFixed(2) + 'mph');
                    
                    cardBody.append(h6, image, p1, p2, p3);
                    div.append(cardBody);
                    $('.future-weather-display').append(div);
                }

            });
        } else {
            alert('error');
        }
    })
    .catch(function (error) {
        alert('Unable to connect to GitHub');
    });
}