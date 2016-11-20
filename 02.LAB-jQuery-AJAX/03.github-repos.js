function loadRepos() {
    $('#repos').empty();
    let username = $('#username').val();
    let linkUrl = `https://api.github.com/users/${username}/repos`;

    let request = {
        method: 'GET',
        url: `${linkUrl}`,
        contentType: 'application/json',
        success: displayRepos,
        error: displayError
    };

    $.ajax(request);

    function displayRepos(reps) {
        for (let repo of reps) {
            let link = $('<a>').text(repo.full_name);
            link.attr('href', repo.html_url);
            $('#repos').append($('<li>').append(link));
        }
    }

    function displayError() {
        let text = $('<li>').text('Error');
        $('#repos').append(text);
    }
}