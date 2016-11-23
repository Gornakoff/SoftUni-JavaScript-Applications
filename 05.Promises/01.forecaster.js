function attachEvents() {
    $('#submit').click(getLocation);

    const baseUrl = 'https://judgetests.firebaseio.com';
    const degreesSymbol = '&#176;';   // °

    const conditions = {
        Sunny: '&#x2600;', // ☀
        "Partly sunny": '&#x26C5;', //
        Overcast: '&#x2601;', // ☁
        Rain: '&#x2614;' // ☂
    };

    function getLocation() {
        let getRequest = {
            method: 'GET',
            url: `${baseUrl}/locations.json`,
        };
        $.ajax(getRequest)
            .then(getLocationCode)
            .catch(displayError);
    }

    function getLocationCode(locationsData) {
        let selectedLocation = $('#location').val();

        for (let location of locationsData) {
            let locationName = location.name;

            if (selectedLocation == locationName) {
                let code = location.code;

                let currentWeatherRequest = $.ajax({
                    url: `${baseUrl}/forecast/today/${code}.json`,
                });

                let upcomingWeatherRequest = $.ajax({
                    url: `${baseUrl}/forecast/upcoming/${code}.json`
                });

                Promise.all([currentWeatherRequest, upcomingWeatherRequest])
                    .then(displayWeather)
                    .catch(displayError);
                return;
            }
        }
    }

    function displayWeather([current, upcoming]) {
        $('.condition').remove();
        $('.upcoming').remove();
        $('#forecast').removeAttr('style');
        displayCurrentWeather(current);
        displayUpcomingWeather(upcoming);
    }

    function displayCurrentWeather(currentInfo) {
        let name = currentInfo.name;
        let currentData = currentInfo.forecast;
        let data = extractData(currentData);

        let div = $('#current');
        let span = $('<span>').prop('class', 'forecast-data');
        div.append($('<span>').prop('class', 'condition symbol').append(data.symbol))
            .append($('<span>').prop('class', 'condition')
            .append(span.clone().append(name))
            .append(span.clone().append(data.temp))
            .append(span.clone().append(data.condition)));
    }

    function displayUpcomingWeather(upcomingInfo) {
        let weatherData = upcomingInfo.forecast;

        for (let day of weatherData) {
            let data = extractData(day);
            let div = $('#upcoming');
            let span = $('<span>').prop('class', 'forecast-data');
            div.append($('<span>').prop('class', 'upcoming')
                    .append($('<span>').prop('class', 'symbol').append(data.symbol))
                    .append(span.clone().append(data.temp))
                    .append(span.clone().append(data.condition)));
        }
    }

    function extractData(data) {
        let currentSymbol = conditions[data.condition];
        let lowTemp = data.low + degreesSymbol;
        let highTemp = data.high + degreesSymbol;
        let temp = `${lowTemp}/${highTemp}`;

        return {
            symbol: currentSymbol,
            temp: temp,
            condition: data.condition
        };
    }

    function displayError(errData) {
        let errDiv = $('<div>');
        let divText = `Error: ${errData.status} (${errData.statusText})`;
        errDiv.text(divText);
        $('body').prepend(errDiv);

        setTimeout(function () {
            $(errDiv).fadeOut(function () {
                $(errDiv).remove();
            });
        }, 3000);
    }
}