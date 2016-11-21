function getInfo() {
    $('#stopName').empty();
    $('#buses').empty();

    const baseUrl = "https://judgetests.firebaseio.com/businfo";

    let busStopId = $('#stopId').val();
    let getUrl = `${baseUrl}/${busStopId}.json`;

    let request = {
        method: 'GET',
        url: `${getUrl}`,
        contentType: 'application/json'
    };

    $.ajax(request)
        .then(displayBuses)
        .catch(displayError);

    function displayBuses(vehicles) {
        let busesInfo = vehicles['buses']; // vehicles.buses
        let stopName = vehicles['name']; // vehicles.name

        $('#stopName').append(stopName);

        for (let busLine in busesInfo) {
            let busTime = busesInfo[busLine];
            let text = `Bus ${busLine} arrives in ${busTime} minutes`;
            let li = $('<li>').append(text);

            $('#buses').append(li);
        }
    }

    function displayError() {
        $('#stopName').append('Error');
    }
}