function solve() {
    const baseUrl = "https://judgetests.firebaseio.com/schedule";

    let currentId = 'depot';
    let nextId = '';
    let request = {
        method: 'GET',
        contentType: 'application/json'
    };

    function depart() {
        activateButton('#arrive', '#depart'); // set arrive button active
        request.url = `${baseUrl}/${currentId}.json`;
        request.success = function (data) {
            let departText = `Next stop ${data.name}`;

            $('.info').append(departText);
            nextId = data.next;
        };

        $.ajax(request);

    }

    function arrive() {
        activateButton('#depart', '#arrive'); // set depart button active
        request.url = `${baseUrl}/${currentId}.json`;
        request.success = function (data) {
            let arriveText = `Arriving at ${data.name}`;

            $('.info').append(arriveText);
        };

        $.ajax(request);
        currentId = nextId;
    }

    function activateButton(showButton, hideButton) {
        $('.info').empty();
        $(showButton).removeAttr('disabled');
        $(hideButton).attr('disabled', 'disabled');
    }

    return {
        depart,
        arrive
    };
}
let result = solve();