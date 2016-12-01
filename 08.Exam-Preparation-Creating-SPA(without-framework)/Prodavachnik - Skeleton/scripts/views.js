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