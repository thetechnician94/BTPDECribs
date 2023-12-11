const baseCribURL = "/API/api.php/records/Cribs/";
const baseClassURL = "/API/api.php/records/ClassIDs/";
let archive = false;
$(document).ready(function () {
    initTable(baseCribURL + "?order=Date,desc&size=500");
});

function updateTable(id) {
    url = baseCribURL + id;
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

function initTable(url) {
    var table = $('#dataTable').DataTable({
        dom: 'fBrtlip',
        ajax: {
            url: url,
            dataSrc: 'records'
        },
        columns: [
            {
                data: "ID",
                title: "ID",
                type: "hidden"
            },
            {
                data: "Date",
                title: "Date",
                type: "date",
                required: true
            },
            {
                data: "Class",
                title: "Class",
                type: "select",
                select2: {
                    width: "100%",
                    placeholder: 'Select Class',
                    sortByLabel: false
                },
                options: getClasses(),
                required: true
            },
            {
                data: "Name",
                title: "Name",
                type: "text",
                required: true
            },
            {
                data: "Professor",
                title: "Professor",
                type: "text",
                required: true
            },
            {
                data: "Description",
                title: "Description",
                type: "textarea"
            },
            {
                data: "CribType",
                title: "Type",
                type: "select",
                select2: {
                    width: "100%",
                    placeholder: 'Select Type',
                    sortByLabel: false
                },
                options: ["Assignment", "Quiz", "Project", "Test", "Exam", "Other"],
                required: true
            },
            {
                data: "File",
                title: "File",
                type: "file",
                render: function (data, type, rowdata) {
                    return "<a href='/Cribs/" + rowdata.File.replace("#", "%23") + "' target='_blank'>" + rowdata.File.substring(rowdata.File.indexOf("-") + 1);
                    +"</a>";
                }
            }
        ],
        paging: true,
        stateSave: true,
        "lengthMenu": [[5, 10, 25, 50], [5, 10, 25, 50]],
        buttons: [
            {

                text: 'Upload',
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
            "pdf", "excel",
            {
                text: "Show/Hide Archive",
                action: function () {
                    if (!archive) {
                        $('#dataTable').DataTable().destroy();
                        initTable(baseCribURL);
                        archive = !archive;
                    } else {
                       location.reload(); //reloading the page is more stable
                    }
                  
                }

            }

        ],
        select: 'single',
        altEditor: true,
        encodeFiles: false,
        responsive: true,
        fixedHeader: true,
        colReorder: true,
        onEditRow: function (datatable, rowdata, success, error) {
            let file = rowdata.File;
            if (file == null) { //File isn't changing
                delete rowdata.File;
                $.ajax({
                    url: baseCribURL + rowdata["ID"],
                    type: 'PUT',
                    data: rowdata,
                    success: function (response, status, more) {
                        success(updateTable(rowdata["ID"]), status, more);
                    },
                    error: error
                });
            } else { //File Changing
                $.ajax({//Delete the current file
                    url: '/API/DeleteFile.php',
                    type: 'POST',
                    data: "file=" + updateTable(rowdata["ID"]).File,
                    success: function (data, status, jqxhr) {

                    },
                    error: function (jqxhr, status, msg) {
                        //error code
                    }
                });
                var fd = new FormData();
                fd.append('file', file);
                $.ajax({//Upload the new one
                    url: '/API/UploadFile.php',
                    type: 'POST',
                    processData: false,
                    contentType: false,
                    data: fd,
                    success: function (data, status, jqxhr) {
                        rowdata.File = data;
                        $.ajax({
                            url: baseCribURL + rowdata["ID"],
                            type: 'PUT',
                            data: rowdata,
                            success: function (response, status, more) {
                                success(updateTable(rowdata["ID"]), status, more);

                            },
                            error: error
                        });

                    },
                    error: function (jqxhr, status, msg) {
                        //error code
                    }
                });
            }
        },
        onAddRow: function (datatable, rowdata, success, error) {
            rowdata = sanitizeRowData(rowdata);
            let file = rowdata.File;
            if (file == null) {
                return;
            }
            var fd = new FormData();
            fd.append('file', file);
            $.ajax({
                url: '/API/UploadFile.php',
                type: 'POST',
                processData: false,
                contentType: false,
                data: fd,
                success: function (data, status, jqxhr) {
                    rowdata.File = data;
                    $.ajax({
                        url: baseCribURL,
                        type: 'POST',
                        data: rowdata,
                        success: function (response, status, more) {
                            success(updateTable(response), status, more);
                        },
                        error: error
                    });
                },
                error: function (jqxhr, status, msg) {
                    //error code
                }
            });
        },
        onDeleteRow: function (datatable, rowdata, success, error) {
            $.ajax({//Delete the current file
                url: '/API/DeleteFile.php',
                type: 'POST',
                data: "file=" + updateTable(rowdata[0]["ID"]).File,
                success: function (data, status, jqxhr) {

                },
                error: function (jqxhr, status, msg) {
                    //error code
                }
            });
            $.ajax({//delete the table row
                url: baseCribURL + rowdata[0]["ID"],
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


function getClasses() {
    url = baseClassURL + "?include=Class&order=Class,ASC";
    let data = [];
    $.ajax({
        url: url,
        type: 'GET',
        async: false,
        success: function (response) {
            response.records.forEach(function (elem) {
                data.push(elem.Class);
            });
        },
        error: function (response) {}
    });
    return data;
}