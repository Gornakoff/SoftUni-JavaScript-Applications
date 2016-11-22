function attachEvents() {
    $('#btnLoadPosts').click(loadPosts);
    $('#btnViewPost').click(viewDetails);

    const appId = 'kid_HyFDR6bMl';
    const baseUrl = `https://baas.kinvey.com/appdata/${appId}`;
    const kinveyUsername = 'peter';
    const kinveyPass = 'p';
    const base64auth = btoa(`${kinveyUsername}:${kinveyPass}`);
    const authHeaders = { Authorization: `Basic ${base64auth}`};

    function loadPosts() {
        let loadPostsRequest = {
            url: `${baseUrl}/posts`,
            headers: authHeaders
        };

        $.ajax(loadPostsRequest)
            .then(fillDropDownMenu)
            .catch(displayError);
    }

    function fillDropDownMenu(postsData) {
        let dropDownMenu = $('#posts');
        dropDownMenu.empty();

        for (let post of postsData) {
            let itemText = post.title;
            let itemValue = post._id;
            let option = $('<option>');
            option.val(itemValue);
            option.text(itemText);
            $('#posts').append(option);
        }
    }

    function viewDetails() {
        let postId = $('#posts').val();
        let commentsByPost = `?query={"post_id":"${postId}"}`;

        let postRequest = $.ajax({
            url: `${baseUrl}/posts/${postId}`,
            headers: authHeaders
        });

        let commentsRequest = $.ajax({
            url: `${baseUrl}/comments/${commentsByPost}`,
            headers: authHeaders
        });

        Promise.all([postRequest, commentsRequest])
            .then(displayAllInfo)
            .catch(displayError);

    }

    function displayAllInfo([postInfo, commentsData]) {
        $('#post-body').empty();
        $('#post-comments').empty();

        let liPost = $('<li>');
        liPost.text(postInfo.body);

        $('#post-title').text(postInfo.title);
        $('#post-body').append(liPost);

        for (let comment of commentsData) {
            let liComment = $('<li>');
            liComment.text(comment.text);
            $('#post-comments').append(liComment);
        }
    }

    function displayError(err) {
        let errDiv = $('<div>');
        let divText = `Error: ${err.status} (${err.statusText})`;
        errDiv.text(divText);
        $('body').prepend(errDiv);

        setTimeout(function () {
            $(errDiv).fadeOut(function () {
                $(errDiv).remove();
            });
        }, 3000);
    }
}