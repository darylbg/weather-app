var button = $('#search-btn');
var searchInput = $('#example-search-input');

var now = dayjs();
$('#current-day-date').text(now.format("DD/MM/YYYY"));

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
var searchValue;
button.click(function() {
    searchValue = searchInput.val();
    searches.unshift(searchValue);

    localStorage.setItem('searches', JSON.stringify(searches));
    $('.future-weather-display').text('');
    $('.recent-searches').text('');
    console.log('searchValue:', searchValue);
    fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + searchValue + '&appid=c42bd53b497736aab98f794d9e907730')
    .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
                console.log(data.city.name);
                setCurrentWeather(data.list[0].weather[0].icon, data.city.name, data.list[0].main.temp, data.list[0].weather[0].description, data.list[0].wind.speed);
                console.log(data.list[0].weather[0].icon);

                setFutureWeather(searchValue);         
                searchHistory();       
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

function searchHistory() {
    console.log(searches.length);
    for (let i = 0; i < 6 && i < searches.length; i++) {
        console.log(searches[i]);
        var buttonList = $('<button>').addClass('btn btn-secondary search-history-btn').text(searches[i]);
        $('.recent-searches').append(buttonList);
        
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
                        setCurrentWeather(data.list[0].weather[0].icon, data.city.name, data.list[0].main.temp, data.list[0].weather[0].description, data.list[0].wind.speed);
                        console.log(data.list[0].weather[0].icon);

                        setFutureWeather(searchHistoryValue);

                    });
                } else {
                    alert('error');
                }
            })
            .catch(function (error) {
                alert('Unable to connect to GitHub');
            });
        });
    }
}
 searchHistory();


function setFutureWeather(searchValue) {
    console.log('this: ' + searchValue)
    fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + searchValue + '&appid=c42bd53b497736aab98f794d9e907730')
    .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
                console.log(data.list.length);

                for (let i = 7; i < data.list.length; i += 8) {
                    var div = $('<div>').addClass('card col');
                    var cardBody = $('<div>').addClass('card-body');

                    const dateTxt = data.list[i].dt_txt; // Example date and time string
                    const dateObj = new Date(dateTxt); // Parse the date and time string into a Date object
                    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
                    const formattedDate = dateObj.toLocaleDateString('en-GB', options);

                    var h6 = $('<h6>').addClass('card-title').text(formattedDate);
                    var image = $('<img>').attr('src', 'https://openweathermap.org/img/w/' + data.list[i].weather[0].icon + '.png');
                    var p1 = $('<p>').addClass('card-text').text('Temp: ' + (data.list[i].main.temp - 273.15).toFixed(1) + '°C');
                    var p3 = $('<p>').addClass('card-text').text('Humidity: ' + data.list[i].main.humidity + '%');
                    var p2 = $('<p>').addClass('card-text').text('Wind: ' + (data.list[i].wind.speed * 2.2).toFixed(1) + 'mph');
                    
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