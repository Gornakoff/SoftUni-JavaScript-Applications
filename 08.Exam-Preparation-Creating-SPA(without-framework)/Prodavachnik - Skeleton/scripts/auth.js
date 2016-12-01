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