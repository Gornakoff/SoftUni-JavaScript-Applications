function solve() {
    $('#btnAdd').click(addStudent);

    const appId = 'kid_BJXTsSi-e';
    const baseUrl = `https://baas.kinvey.com/appdata/${appId}/students`;
    const kinveyUsername = 'guest';
    const kinveyPass = 'guest';
    const base64auth = btoa(`${kinveyUsername}:${kinveyPass}`);
    const authHeaders = { Authorization: `Basic ${base64auth}` };
    const contentType = 'application/json';



    function addStudent(e) {
       e.preventDefault();

        let studentInfo = studentCheck();

        console.log(studentInfo);
        if (studentInfo != false) {
            let addRequest = {
                method: "POST",
                url: baseUrl,
                headers: authHeaders,
                contentType,
                data: JSON.stringify(studentInfo)
            };
            
            $.ajax(addRequest)
                .then(displayStudents)
                .catch(displayError);
        }
    }

    function displayStudents() {
        clearData();

        let getRequest = {
            method: "GET",
            url: baseUrl,
            headers: authHeaders
        };

        $.ajax(getRequest)
            .then(loadData)
            .catch(displayError);
    }

    function loadData(data) {
        data.sort((a, b) => a.ID - b.ID);

        for (let obj of data) {
            let id = $('<td>').text(obj.ID);
            let firstName = $('<td>').text(obj.FirstName);
            let lastName = $('<td>').text(obj.LastName);
            let facNum = $('<td>').text(obj.FacultyNumber);
            let grade = $('<td>').text(obj.Grade);
            let tr = $('<tr>');
            tr.append(id)
                .append(firstName)
                .append(lastName)
                .append(facNum)
                .append(grade);

            $('#results').append(tr);
        }
    }

    function studentCheck() {
        let idVal = Number($('#studentId').val().trim());
        let fNameVal = $('#firstName').val().trim();
        let lNameVal = $('#lastName').val().trim();
        let facNumVal = $('#facultyNumber').val().trim();
        let gradeVal = Number($('#grade').val().trim());

        let student = false;

        if ((idVal > 0) &&
            fNameVal != '' && lNameVal != '' &&
            (Number.isInteger(Number(facNumVal)) && Number(facNumVal) > 0 && facNumVal != '') &&
            (gradeVal >= 2 && gradeVal <= 6 && gradeVal != '')) {
            student = {
                ID: idVal,
                FirstName: fNameVal,
                LastName: lNameVal,
                FacultyNumber: facNumVal,
                Grade: gradeVal
            };
        }
        return student;
    }

    function clearData() {
        let selectAllRows = $('#results tr').not(':first');
        selectAllRows.remove();

        $('#studentId').val('');
        $('#firstName').val('');
        $('#lastName').val('');
        $('#facultyNumber').val('');
        $('#grade').val('');
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