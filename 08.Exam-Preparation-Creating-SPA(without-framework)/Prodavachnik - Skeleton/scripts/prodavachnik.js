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

    // ====================================================================================
    // ADVERTISEMENT SECTION

    // ====================================================================================
    // SHOW VIEWS SECTION

    // ====================================================================================
    // DISPLAY LOADING/INFO/ERROR SECTION
}