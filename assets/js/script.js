var button = $('#search-btn');
var value = $('#example-search-input');

var now = dayjs();
$('#current-day-date').text(now.format("MM-DD-YYYY"));

function setForecastDates() {
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
} setForecastDates();

button.click(function() {
    fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + value[0].value + '&appid=')
    .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
                console.log(data.city.name);
                setCurrentWeather(data.list[0].weather[0].icon, data.city.name, data.list[0].main.temp, data.list[0].weather[0].description, data.list[0].wind.speed);
                console.log(data.list[0].weather[0].icon);
                //$('#current-weather').find('h5').text(data.city.name);
                //setFutureWeather(data.list[6].dt_txt);
                //setForecastDates();
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
    $('#current-weather').css('background-image', 'url("https://openweathermap.org/img/w/' + descriptionIcon + '.png")');
    $('#current-weather').find('h5').eq(0).text(cityName);
    $('#current-weather').find('p').eq(0).text((temperature - 273.15).toFixed(2) + '°C');
    $('#current-weather').find('p').eq(1).text(weather);
    $('#current-weather').find('p').eq(2).text('Wind Speed: ' + (windSpeed * 2.2).toFixed(2) + 'mph');
}

function setFutureWeather() {

}