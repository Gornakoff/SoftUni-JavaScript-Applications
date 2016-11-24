function solve() {
    $('#load').click(loadData);

    const appId = 'kid_BJXTsSi-e';
    const baseUrl = `https://baas.kinvey.com/appdata/${appId}/knock`;
    const kinveyUsername = 'guest';
    const kinveyPass = 'guest';
    const base64auth = btoa(`${kinveyUsername}:${kinveyPass}`);
    const authHeaders = {Authorization: `Basic ${base64auth}`};

    let message = 'Knock Knock.';

    function loadData() {
        if (message != undefined) {
            $.ajax(createAjaxRequest(message))
                .then(displayData)
                .catch(displayError);
        }
    }

    function displayData(data) {
        let answer = data.answer;
        let li = $('<li>');
        let ul = $('#knock');
        ul.append(li.clone().text(message));
        ul.append(li.clone().text(answer));
        message = data.message;
        loadData();
    }

    function createAjaxRequest(secretWord) {
        let query = `?query=${secretWord}`;
        let requestUrl = baseUrl + query;

        let getRequest = {
            method: "GET",
            url: requestUrl,
            headers: authHeaders
        };
        return getRequest;
    }

    function displayError(err) {
        let div = $('<div>');
        let divText = `Error: ${err.status} (${err.statusText})`;
        $('body')
            .append(div)
            .append(divText);
    }
}