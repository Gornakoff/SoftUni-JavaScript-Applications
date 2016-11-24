function attachEvents() {
    $('.load').click(loadData);
    $('.add').click(addData);
    $('.update').click(updateData);
    $('.delete').click(deleteData);

    const appId = 'kid_ryZjZs7Me';
    const baseUrl = `https://baas.kinvey.com/appdata/${appId}`;
    const kinveyUsername = 'test';
    const kinveyPass = 'test';
    const base64auth = btoa(`${kinveyUsername}:${kinveyPass}`);
    const authHeaders = { Authorization: `Basic ${base64auth}`};

    function loadData() {
        $('#catches').empty();
        let loadRequest = {
            method: 'GET',
            url: `${baseUrl}/biggestCatches`,
            headers: authHeaders
        };

        $.ajax(loadRequest)
            .then(displayCatches)
            .catch(displayError)
    }

    function addData() {
        let addSelector = '#addForm';
        let addCatch = formRequestData(addSelector);

        let addRequest = {
            method: "POST",
            url: `${baseUrl}/biggestCatches`,
            headers: authHeaders,
            contentType: 'application/json',
            data: JSON.stringify(addCatch)
        };

        $.ajax(addRequest)
            .then(loadData)
            .catch(displayError);
    }

    function updateData(id) {
        let updateSelector = '.catch';
        let update = formRequestData(updateSelector, id);

        let updateRequest = {
            method: "PUT",
            url: `${baseUrl}/biggestCatches/${id}`,
            headers: authHeaders,
            contentType: 'application/json',
            data: JSON.stringify(update)
        };

        $.ajax(updateRequest)
            .then(loadData)
            .catch(displayError);
    }

    function formRequestData(selector, id) {
        if (id && typeof(id) != 'string') {
            selector = $(`div[data-id='${id}']`);
        }
        let angler = $(selector).find('.angler').val().trim();
        let weight = Number($(selector).find('.weight').val().trim()); // set as NUMBER
        let species = $(selector).find('.species').val().trim();
        let location = $(selector).find('.location').val().trim();
        let bait = $(selector).find('.bait').val().trim();
        let captureTime = Number($(selector).find('.captureTime').val().trim()); // set as Number

        if (angler != '' && weight != '' && species != '' &&
            location != '' && bait != '' && captureTime != '') {
            let data = { angler, weight, species, location, bait, captureTime };
            return data;
        }
        return false;
    }

    function deleteData(id) {
        let delRequest = {
            method: 'DELETE',
            url: `${baseUrl}/biggestCatches/${id}`,
            headers: authHeaders
        };

        $.ajax(delRequest)
            .then(loadData)
            .catch(displayError);
    }
    
    function displayCatches(data) {
        for (let entry in data) {
            let catchEntry = data[entry];
            let catchId = catchEntry._id;

            let div = $('<div>').addClass('catch').attr('data-id', catchId);
            div.append($('<label>').text('Angler'))
                .append($('<input>').attr('type', 'text').addClass('angler').val(catchEntry.angler))
                .append($('<label>').text('Weight'))
                .append($('<input>').attr('type', 'number').addClass('weight').val(catchEntry.weight))
                .append($('<label>').text('Species'))
                .append($('<input>').attr('type', 'text').addClass('species').val(catchEntry.species))
                .append($('<label>').text('Location'))
                .append($('<input>').attr('type', 'text').addClass('location').val(catchEntry.location))
                .append($('<label>').text('Bait'))
                .append($('<input>').attr('type', 'text').addClass('bait').val(catchEntry.bait))
                .append($('<label>').text('Capture Time'))
                .append($('<input>').attr('type', 'number').addClass('captureTime').val(catchEntry.captureTime));

            div.append($('<button>').addClass('update').text('Update').on('click', function () {
                updateData(catchId);
            }));
            div.append($('<button>').addClass('delete').text('Delete').on('click', function () {
                deleteData(catchId);
            }));

            $('#catches').append(div);
        }
    }

    function displayError(err) {
        let errDiv = $('<div>');
        let divText = `Error: ${err.status} (${err.statusText})`;
        errDiv.text(divText);
        $('body').prepend(errDiv);

        setTimeout(function () {
            $(errDiv).fadeOut(function () {
                $(errDiv).remove();
            });
        }, 3000);
    }
}