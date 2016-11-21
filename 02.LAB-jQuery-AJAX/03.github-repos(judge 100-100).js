function loadRepos() {
    $('#repos').empty();
    let username = $('#username').val();
    let baseUrl = `https://api.github.com/users/${username}/repos`;

    return (
        $.get(baseUrl)
            .done(function (data) {
                for (let repo of data) {
                    let li = $(`<li><a href="${repo.html_url}">${repo.full_name}</a></li>`);
                    $('#repos').append(li);
                }
            })
            .catch(function (error) {
                let text = $('<li>Error</li>');
                $('#repos').append(text);
            })
    )
}