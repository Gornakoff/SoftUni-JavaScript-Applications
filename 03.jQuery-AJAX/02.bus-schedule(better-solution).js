function solve() {
    const baseUrl = "https://judgetests.firebaseio.com/schedule/";

    let name = '';
    let nextId = 'depot';

    function depart() {
        activateButton('#arrive', '#depart'); // set arrive button active
        let siteUrl = baseUrl + nextId;
        $.get(`${siteUrl}.json`)
            .then(extractInfo);

    }

    function arrive() {
        activateButton('#depart', '#arrive'); // set depart button active
        let arriveStation = `Arriving at ${name}`;
        $('#info').find('span').text(arriveStation);
    }

    function extractInfo(data) {
        name = data.name;
        nextId = data.next;
        let nextStopName = `Next stop ${name}`;

        $('#info').find('span').text(nextStopName);
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