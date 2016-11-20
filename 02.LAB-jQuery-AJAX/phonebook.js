$(function () {
    $('#btnLoad').click(loadContacts);
    $('#btnCreate').click(createContact);

    const baseUrl ="https://phonebook-1b45a.firebaseio.com/phonebook";

    function loadContacts() {
        $('#phonebook').empty();
        let linkUrl = `${baseUrl}.json`;
        let request = {
            method: 'GET',
            url: `${linkUrl}`,
            contentType: 'application/json'
            //success: displayContacts,
            //error: displayError
        };

        $.ajax(request)
            .then(displayContacts)
            .catch(displayError);
    }

    function displayContacts(contacts) {
        let keys = Object.keys(contacts);

        for (let key of keys) {
            let contact = contacts[key];
            let info = `${contact.person}: ${contact.phone}`;

            if (contact.person) {
                let li = $('<li>').text(info + ' ');
                let btnDel = $('<a href="#">[Delete]</a>');
                $('#phonebook').append(li);
                li.append(btnDel.click(function () {
                    deleteContact(key);
                }));
            }
        }
    }

    function displayError() {
        let text = $('<li>').text('Error');
        $('#phonebook').append(text);
    }

    function deleteContact(id) {
        let urlPath = `${baseUrl}/${id}.json`;
        let delRequest = {
            method: 'DELETE',
            url: urlPath
        };

        $.ajax(delRequest)
            .then(loadContacts)
            .catch(displayError);
    }
    
    function createContact() {
        let person = $('#txtPerson').val();
        let phone = $('#txtPhone').val();
        let newContact = {person, phone};

        let urlPath = `${baseUrl}.json`;
        let createRequest = {
            method: 'POST',
            url: urlPath,
            data: JSON.stringify(newContact)
        };

        $.ajax(createRequest)
            .then(loadContacts)
            .catch(displayError);

        $('#txtPerson').val("");
        $('#txtPhone').val("");
    }
});