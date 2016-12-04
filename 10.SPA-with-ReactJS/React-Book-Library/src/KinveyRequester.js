import $ from 'jquery';

let KinveyRequester = (function () {
    const baseUrl = "https://baas.kinvey.com/";
    const appID = 'kid_BkcHjpemg';
    const appSecret = '5fa8be053a6e4c0fb7a892ad63e04252';

    const authHeaders = {
        Authorization: "Basic " + btoa(appID + ":" + appSecret)
    };

    function loginUser(username, password) {
        return $.ajax({
            method: 'POST',
            url: baseUrl + "user/" + appID + "/login",
            headers: authHeaders,
            contentType: 'application/json',
            data: JSON.stringify({username, password})
        });
    }


    function registerUser(username, password) {
        return $.ajax({
            method: 'POST',
            url: baseUrl + "user/" + appID,
            headers: authHeaders,
            contentType: 'application/json',
            data: JSON.stringify({username, password})
        });
    }

    function loadBooks() {
        return $.ajax({
            method: 'GET',
            url: baseUrl + "appdata/" + appID + "/books",
            headers: getKinveyUserAuthHeaders()
        });
    }

    function getKinveyUserAuthHeaders() {
        return {
            'Authorization': "Kinvey " + sessionStorage.getItem('authToken'),
        };
    }

    function findBookById(bookId) {
        return $.ajax({
            method: "GET",
            url: baseUrl + "appdata/" + appID + "/books/" + bookId,
            headers: getKinveyUserAuthHeaders()
        });
    }

    function createBook(title, author, description) {
        return $.ajax({
            method: "POST",
            url: baseUrl + "appdata/" + appID + "/books",
            headers: getKinveyUserAuthHeaders(),
            data: { title, author, description }
        });
    }

    function editBook(bookId, title, author, description) {
        return $.ajax({
            method: "PUT",
            url: baseUrl + "appdata/" + appID + "/books/" + bookId,
            headers: getKinveyUserAuthHeaders(),
            data: { title, author, description }
        });
    }

    function deleteBook(bookId) {
        return $.ajax({
            method: "DELETE",
            url: baseUrl + "appdata/" + appID + "/books/" + bookId,
            headers: getKinveyUserAuthHeaders()
        });
    }

    return {
        loginUser,
        registerUser,
        loadBooks,
        findBookById,
        createBook,
        editBook,
        deleteBook
    }
})();

export default KinveyRequester;