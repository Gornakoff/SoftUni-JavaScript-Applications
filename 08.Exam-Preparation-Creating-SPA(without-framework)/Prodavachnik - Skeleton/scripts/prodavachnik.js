function startApp() {
    //$('#menu a').show();
    showHideNavigationMenus();

    // bind navigation menu links
    $("#linkHome").click(showHomeView);
    $("#linkLogin").click(showLoginView);
    $("#linkRegister").click(showRegisterView);
    $("#linkListAds").click(displayAdverts);
    $("#linkCreateAd").click(showCreateAdView);
    $("#linkLogout").click(logoutUser);

    // bind buttons actions
    $('#buttonLoginUser').click(loginUser);
    $('#buttonRegisterUser').click(registerUser);
    $('#buttonCreateAd').click(createAdvert);
    $('#buttonEditAd').click(editAdvert);

    // ====================================================================================
    // USER SECTION
    const kinveyBaseUrl = "https://baas.kinvey.com/";
    const kinveyAppKey = "kid_ryjE1c3Ge";
    const kinveyAppSecret = "1802a294119349f7bcd6ea55d329d364";
    const kinveyAppAuthHeaders = {
        'Authorization': "Basic " + btoa(kinveyAppKey + ":" + kinveyAppSecret),
    };

    function getKinveyUserAuthHeaders() {
        return {
            'Authorization': "Kinvey " + sessionStorage.getItem('authToken'),
        };
    }

    function loginUser() {
        let username = $('#formLogin input[name=username]').val();
        let password = $('#formLogin input[name=passwd]').val();
        let userData = { username, password };

        let loginRequest = {
            method: "POST",
            url: kinveyBaseUrl + "user/" + kinveyAppKey + "/login",
            headers: kinveyAppAuthHeaders,
            data: userData
        };

        $.ajax(loginRequest)
            .then(loginSuccess)
            .catch(displayError);

        function loginSuccess(userInfo) {
            setSessionStorage(userInfo);
            showHideNavigationMenus();
            showHomeView();
            showInfo('Login successful.');
        }
    }
    
    function registerUser() {
        let username = $('#formRegister input[name=username]').val();
        let password = $('#formRegister input[name=passwd]').val();
        let userData = { username, password };

        let registerRequest = {
            method: "POST",
            url: kinveyBaseUrl + "user/" + kinveyAppKey + "/",
            headers: kinveyAppAuthHeaders,
            data: userData
        };

        $.ajax(registerRequest)
            .then(registerSuccess)
            .catch(displayError);

        function registerSuccess(userInfo) {
            setSessionStorage(userInfo);
            showHideNavigationMenus();
            showHomeView();
            showInfo('User registration successful.');
        }
    }
    
    function logoutUser() {
        sessionStorage.clear();
        $('#loggedInUser').text("");
        showHideNavigationMenus();
        showHomeView();
        showInfo('Logout successful.');
    }

    function setSessionStorage(userInfo) {
        let userAuth = userInfo._kmd.authtoken;
        sessionStorage.setItem('authToken', userAuth);
        let userId = userInfo._id;
        sessionStorage.setItem('userId', userId);
        let username = userInfo.username;
        sessionStorage.setItem('username', username);
        $('#loggedInUser').text(`Welcome, ${username}!`);
    }

    // ====================================================================================
    // ADVERTISEMENT SECTION
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

    // ====================================================================================
    // SHOW VIEWS SECTION
    function showHideNavigationMenus() {
        $("#linkHome").show(); // always show home link
        $('#viewHome').show();

        if (sessionStorage.getItem('authToken')) {
            // If user is logged in
            $("#linkLogin").hide();
            $("#linkRegister").hide();
            $("#linkListAds").show();
            $("#linkCreateAd").show();
            $("#linkLogout").show();
            $("#loggedInUser").show();
        } else {
            // No logged in user
            $("#linkLogin").show();
            $("#linkRegister").show();
            $("#linkListAds").hide();
            $("#linkCreateAd").hide();
            $("#linkLogout").hide();
            $("#loggedInUser").hide();
        }
    }

    function showHomeView() {
        showView('viewHome');
    }

    function showLoginView() {
        $('#formLogin').trigger('reset');
        showView('viewLogin');
    }

    function showRegisterView() {
        $('#formRegister').trigger('reset');
        showView('viewRegister');
    }

    function showListAdsView() {
        showView('viewAds');
    }

    function showCreateAdView() {
        $('#formCreateAd').trigger('reset');
        showView('viewCreateAd');
    }

    function showEditAdView() {
        //$('#formEditAd').trigger('reset');
        showView('viewEditAd');
    }

    function showView(viewName) {
        // Hide all views and show the selected view only
        $('main > section').hide();
        $('#' + viewName).show();
    }
    
    function displayError(response) {
        let errorMsg = JSON.stringify(response);
        if (response.readyState === 0)
            errorMsg = "Cannot connect due to network error.";
        if (response.responseJSON &&
            response.responseJSON.description)
            errorMsg = response.responseJSON.description;
        showError(errorMsg);
    }

    // ====================================================================================
    // DISPLAY INFO/ERROR SECTION
    function showInfo(message) {
        $('#infoBox').text(message);
        $('#infoBox').show();
        setTimeout(function() {
            $('#infoBox').fadeOut();
        }, 3000);
    }

    function showError(errMsg) {
        $('#errorBox').text("Error: " + errMsg);
        $('#errorBox').show();
    }
}