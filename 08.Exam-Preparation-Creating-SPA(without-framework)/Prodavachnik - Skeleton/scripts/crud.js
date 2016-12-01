function displayAdverts() {
    $('#ads').empty();
    showListAdsView();

    let listAdsRequest = {
        method: "GET",
        url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/adverts",
        headers: getKinveyUserAuthHeaders()
    };

    $.ajax(listAdsRequest)
        .then(loadAdsSuccess)
        .catch(displayError);

    function loadAdsSuccess(ads) {
        showInfo('Advertisements loaded.');

        if (ads.length == 0) {
            $('#ads').append('No advertisements available.');
        } else {
            let adsTable = $('<table>')
                .append($('<tr>').append(
                    '<th>Title</th><th>Description</th>',
                    '<th>Publisher</th><th>Price</th>',
                    '<th>Date Published</th><th>Actions</th>'));

            for (let advert of ads)
                appendAdvertRow(advert, adsTable);
            $('#ads').append(adsTable);
        }
    }
}

function appendAdvertRow(advert, adsTable) {
    let title = advert.title;
    let publisher = advert.author;
    let description = advert.description;
    let price = advert.price;
    let date = advert.date;
    let deleteLink, editLink;
    let links = [];

    if (advert._acl.creator == sessionStorage['userId']) {
        deleteLink = $('<a href="#">[Delete]</a>')
            .click(deleteAdvert.bind(this, advert));
        editLink = $('<a href="#">[Edit]</a>')
            .click(renderEditAdvert.bind(this, advert));
        links = [deleteLink, ' ', editLink];
    }

    adsTable.append($('<tr>').append(
        $('<td>').text(title),
        $('<td>').text(description),
        $('<td>').text(publisher),
        $('<td>').text(price),
        $('<td>').text(date),
        $('<td>').append(links)
    ));
}

function createAdvert() {
    let title = $('#viewCreateAd input[name=title]').val();
    let description = $('#viewCreateAd textarea[name=description]').val();
    let date = $('#viewCreateAd input[name=datePublished]').val();
    let price = $('#viewCreateAd input[name=price]').val();

    let advertData = {
        title,
        description,
        author: sessionStorage.getItem('username'),
        date,
        price
    };

    let createAdvertRequest = {
        method: "POST",
        url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/adverts",
        headers: getKinveyUserAuthHeaders(),
        contentType: 'application/json',
        data: JSON.stringify(advertData)
    };

    $.ajax(createAdvertRequest)
        .then(createAdvertSuccess)
        .catch(displayError);

    function createAdvertSuccess(response) {
        displayAdverts();
        showInfo('Advert created.');
    }
}

function renderEditAdvert(advert) {
    let advertId = advert._id;
    let request = {
        method: "GET",
        url: kinveyBookUrl = kinveyBaseUrl + "appdata/" + kinveyAppKey + "/adverts/" + advertId,
        headers: getKinveyUserAuthHeaders()
    };

    $.ajax(request)
        .then(editSuccess)
        .catch(displayError);

    function editSuccess(advert) {
        $('#formEditAd input[name=id]').val(advert._id);
        $('#formEditAd input[name=title]').val(advert.title);
        $('#formEditAd textarea[name=description]').val(advert.description);
        $('#formEditAd input[name=datePublished]').val(advert.date);
        $('#formEditAd input[name=price]').val(advert.price);
        showEditAdView();
    }
}

function editAdvert(advert) {
    let advertId = $('#formEditAd input[name=id]').val();
    let title = $('#formEditAd input[name=title]').val();
    let description = $('#formEditAd textarea[name=description]').val();
    let price = $('#formEditAd input[name=price]').val();
    let date = $('#formEditAd input[name=datePublished]').val();

    let advertData = {
        author: sessionStorage.getItem('username'),
        title,
        description,
        price,
        date
    };

    let editRequest = {
        method: "PUT",
        url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/adverts/" + advertId,
        headers: getKinveyUserAuthHeaders(),
        data: advertData
    };

    $.ajax(editRequest)
        .then(editAdvertSuccess)
        .catch(displayError);

    function editAdvertSuccess(response) {
        displayAdverts();
        showInfo('Advert edited.');
    }
}

function deleteAdvert(advert) {
    let deleteRequest = {
        method: "DELETE",
        url: kinveyBookUrl = kinveyBaseUrl + "appdata/" + kinveyAppKey + "/adverts/" + advert._id,
        headers: getKinveyUserAuthHeaders()
    }

    $.ajax(deleteRequest)
        .then(deleteAdvertSuccess)
        .catch(displayError);
    function deleteAdvertSuccess(response) {
        displayAdverts();
        showInfo('Advert deleted.');
    }
}