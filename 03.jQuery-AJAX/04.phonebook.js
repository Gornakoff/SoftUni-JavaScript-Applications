function attachEvents() {
    $('#btnLoad').click(loadContacts);
    $('#btnCreate').click(createContact);

    const baseUrl = 'https://phonebook-nakov.firebaseio.com/phonebook';

    function loadContacts() {
        $('#phonebook').empty();
        $.get(`${baseUrl}.json`)
            .then(getInfo);
    }

    function createContact() {
        let person = $('#person').val();
        let phone = $('#phone').val();

        let contact = { person, phone };

        if (person != '') {
            $.post(`${baseUrl}.json`, JSON.stringify(contact))
                .then(loadContacts);

            $('#person').val('');
            $('#phone').val('');
        }
    }

    function getInfo(data) {
        //let keys = Object.keys(data);
        //for (let key of keys)
        for (let key in data) {
            let contactName = data[key].person;
            let contactPhone = data[key].phone;
            let liText = `${contactName}: ${contactPhone} `;
            let li = $('<li>').append(liText);
            let delBtn = $('<button>[Delete]</button>');

            li.append(delBtn.click(function () {
                deleteContact(key);
            }));

            $('#phonebook').append(li);
        }
    }

    function deleteContact(id) {
        let urlPath = `${baseUrl}/${id}.json`;
        let deleteRequest = {
            method: 'DELETE',
            url: urlPath
        };

        $.ajax(deleteRequest)
            .then(loadContacts);
    }
}