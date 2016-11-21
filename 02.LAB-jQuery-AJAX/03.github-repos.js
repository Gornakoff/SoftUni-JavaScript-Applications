function loadRepos() {
    $('#repos').empty();
    let username = $('#username').val();
    let linkUrl = `https://api.github.com/users/${username}/repos`;

    let request = {
        method: 'GET',
        url: linkUrl,
        success: displayRepos,
        error: displayError
    };

    $.ajax(request);


    function displayRepos(reps) {
        for (let repo of reps) {
            let link = $(`<li><a href="${repo.html_url}">${repo.full_name}</a></li>`);
            $('#repos').append(link);
        }
    }

    function displayError() {
        let text = $('<li>').append('Error');
        $('#repos').append(text);
    }
}