const baseClassURL = "/API/api.php/records/ClassIDs/";

$(document).ready(function () {
    initTable();
});

function updateTable(id) {
    let url = baseClassURL + id;
    let data;
    $.ajax({
        url: url,
        type: 'GET',
        async: false,
        success: function (response) {
            data = response;
        },
        error: function (response) {}
    });
    return data;
}
function sanitizeRowData(rowdata) {
    delete rowdata.undefined;
    delete rowdata.addRowBtn;
    delete rowdata.ID;
    delete rowdata.id;
    return rowdata;
}
function verifyUnique(newClass) {
    let url = baseClassURL + "?filter=Class,eq," + newClass;
    let data;
    $.ajax({
        url: url,
        type: 'GET',
        async: false,
        success: function (response) {
            data = response.records.length;
        },
        error: function (response) {}
    });
    return data === 0;
}

function checkPattern(newClass) {
    return /^([A-Z]{2}|[A-Z]{4})-[0-9]{3}$/.test(newClass);
}
function initTable() {
    var table = $('#dataTable').DataTable({
        dom: 'fBrtlip',
        ajax: {
            url: baseClassURL,
            dataSrc: 'records'
        },
        columns: [
            {
                data: "ID",
                title: "ID",
                type: "hidden"
            },
            {
                data: "Class",
                title: "Class",
                type: "text",
                required: true
            }
        ],
        paging: true,
        stateSave: true,
        "lengthMenu": [[5, 10, 25, 50], [5, 10, 25, 50]],
        buttons: [
            {

                text: 'Add',
                name: 'add'        // do not change name
            },
            {
                extend: 'selected', // Bind to Selected row
                text: 'Edit',
                name: 'edit'        // do not change name
            },
            {
                extend: 'selected', // Bind to Selected row
                text: 'Delete',
                name: 'delete'      // do not change name
            },
            "searchBuilder",
            "colvis",
            "pdf", "excel"

        ],
        select: 'single',
        altEditor: true,
        responsive: true,
        fixedHeader: true,
        colReorder: true,
        onEditRow: function (datatable, rowdata, success, error) {
            rowdata.Class = rowdata.Class.toUpperCase();
            if (!verifyUnique(rowdata.Class)) {
                alert("This class already exists");
                return;
            }
            if (!checkPattern(rowdata.Class)) {
                alert("This class doesn't seem to be formatted correctly. Please use the following format: XX-### or XXXX-###");
                return;
            }
            $.ajax({
                url: baseClassURL + rowdata["ID"],
                type: 'PUT',
                data: rowdata,
                success: function (response, status, more) {
                    success(updateTable(rowdata["ID"]), status, more);
                },
                error: error
            });
        },
        onAddRow: function (datatable, rowdata, success, error) {
            rowdata = sanitizeRowData(rowdata);
            rowdata.Class = rowdata.Class.toUpperCase();
            if (!verifyUnique(rowdata.Class)) {
                alert("This class already exists");
                return;
            }
            if (!checkPattern(rowdata.Class)) {
                  alert("This class doesn't seem to be formatted correctly. Please use the following format: XX-### or XXXX-###");
                return;
            }
            $.ajax({
                url: baseClassURL,
                type: 'POST',
                data: rowdata,
                success: function (response, status, more) {
                    success(updateTable(response), status, more);
                },
                error: error
            });
        },
        onDeleteRow: function (datatable, rowdata, success, error) {
            $.ajax({//delete the table row
                url: baseClassURL + rowdata[0]["ID"],
                type: 'DELETE',
                data: rowdata,
                success: function (response, status, more) {
                    success(updateTable(response), status, more);
                },
                error: error
            });
        }
    });
}
