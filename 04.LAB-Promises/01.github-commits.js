function loadCommits() {
    $('#commits').empty();
    const baseUrl = "https://api.github.com/repos";
    let username = $('#username').val().trim(); // remove whitespaces from username
    let repository = $('#repo').val().trim(); // remove whitespaces from repo
    let targetUrl = `${baseUrl}/${username}/${repository}/commits`;

    $.ajax(targetUrl)
        .then(displayCommits)
        .catch(displayError);

    function displayCommits(data) {
        for (let obj of data) {
            let authorName = obj.commit.author.name;
            let msg = obj.commit.message;
            let liInfo = `${authorName}: ${msg}`;
            $('#commits').append($('<li>').text(liInfo));
        }
    }

    function displayError(err) {
        let errStatus = err.status;
        let errStatText = err.statusText;
        let liText = `Error: ${errStatus} (${errStatText})`;
        $('#commits').append($('<li>').text(liText));
    }
}