const baseBookURL = "/API/apiBrothers.php/records/RitualBooks/";
const userProfileURL = "/API/Me.php";
const logURL = "/API/RitualLog.php";
var user;
$(document).ready(function () {
    initTable();
    user = getMe();
});
function getMe() {
    let data;
    $.ajax({
        url: userProfileURL,
        type: 'GET',
        async: false,
        success: function (response) {
            data = JSON.parse(response);
        },
        error: function (response) {}
    });
    return data;
}

function verifyUnique(bookNum) {
    let url = baseBookURL + "?filter=ID,eq," + bookNum;
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
function updateTable(id) {
    let url = baseBookURL + id;
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

function logData(text) {
    $.ajax({
        url: logURL,
        type: 'POST',
        data: "Data=" + encodeURIComponent(text),
        async: true,
        success: function (response) {

        },
        error: function (response) {}
    });
}

function initTable() {
    var table = $('#dataTable').DataTable({
        dom: 'fBrtlip',
        ajax: {
            url: baseBookURL,
            dataSrc: 'records'
        },
        columns: [
            {
                data: "ID",
                title: "ID",
                type: "hidden"
            },
            {
                data: "BookNum",
                title: "Book Number",
                type: "number",
                step: "1",
                min: "1",
                unique: true,
                required: true
            },
            {
                data: "Status",
                title: "Status",
                type: "text",
                readonly: true,
                value: "Available"

            },
            {
                data: "CheckedOutBy",
                title: "Checked Out By",
                type: "text",
                value: "None",
                render: function (data) {
                    return data === "None" ? "" : data;
                },
                readonly: true
            },
            {
                data: "LastUpdate",
                title: "Last Update",
                readonly: true

            },
            {
                data: "Quality",
                title: "Quality",
                type: "text",
                readonly: true
            },
            {
                data: "Reason",
                title: "Reason",
                type: "textarea",
                readonly: true,
                render: function (data) {
                    return data === "None" ? "" : data;
                }
            }


        ],
        paging: true,
        stateSave: true,
        "lengthMenu": [[5, 10, 25, 50], [5, 10, 25, 50]],
        buttons: [
            {
                text: "Check In/Out",
                extend: "selected",
                action: function (e, dt, node, config) {
                    var data = $('#dataTable').DataTable().rows({selected: true}).data();
                    let today = new Date();
                    let todayString = today.getFullYear() + "-" +
                            (today.getMonth() + 1) + "-" +
                            today.getDate();
                    if (data[0]["Status"] !== "Available") { //Book is checked in
                        if (data[0]["CheckedOutBy"] !== user.name) {
                            if (!confirm("This book was not checked out by you. Are you sure you want to check it back it?")) {
                                return;
                            }
                        }
                        $(".qualitySelect").dialog({

                            modal: true,
                            title: "Select Quality",
                            buttons: [
                                {
                                    text: "OK",
                                    click: function () {
                                        if ($(".qualitySelect select").val() === "") {
                                            alert("Please select a quality");
                                            return;
                                        }
                                        $(this).dialog("close");
                                        $.ajax({
                                            url: baseBookURL + data[0]["ID"],
                                            type: 'PUT',
                                            data: "CheckedOutBy=None&Reason=None&Status=Available&LastUpdate=" + todayString +
                                                    "&Quality=" + $(".qualitySelect select").val(),
                                            success: function (response, status, more) {
                                                $('#dataTable').DataTable().ajax.reload();
                                                logData("Book <strong>" + data[0]["BookNum"] + "</strong> checked in by <strong>" + user.name + "</strong> with quality <strong>" + $(".qualitySelect select").val() + "</strong>");
                                            },
                                            error: function (response, status, more) {
                                                alert("Error checking out book " + response);
                                            }
                                        });
                                    }
                                }
                            ]
                        });
                        $(".qualitySelect").dialog('widget').find(".ui-dialog-titlebar-close").hide();
                    } else { //Book is being checked out
                        $(".checkoutReason").dialog({

                            modal: true,
                            title: "Checkout Reason",
                            buttons: [
                                {
                                    text: "OK",
                                    click: function () {
                                        if ($(".checkoutReason textarea").val() === "") {
                                            alert("Please enter a reason");
                                            return;
                                        }
                                        $(this).dialog("close");
                                        $.ajax({
                                            url: baseBookURL + data[0]["ID"],
                                            type: 'PUT',
                                            data: "CheckedOutBy=" + user.name + "&Status=Checked Out&LastUpdate=" + todayString + "&Reason=" + $(".checkoutReason textarea").val(),
                                            success: function (response, status, more) {
                                                logData("Book <strong>" + data[0]["BookNum"] + "</strong> checked out by <strong>" + user.name + "</strong> with reason <strong>" + $(".checkoutReason textarea").val() + "</strong>");
                                                $(".checkoutReason textarea").val("");
                                                $('#dataTable').DataTable().ajax.reload();
                                            },
                                            error: function (response, status, more) {
                                                alert("Error checking out book " + response);
                                            }
                                        });
                                    }
                                }
                            ]
                        });
                        $(".checkoutReason").dialog('widget').find(".ui-dialog-titlebar-close").hide();
                    }
                }
            },
            {
                text: "View Log",
                action: function (e, dt, node, config) {
                    $.ajax({
                        url: logURL + "?num=10",
                        type: 'GET',
                        async: true,
                        success: function (response) {
                            $(".ritualLog div").html(response);
                            $(".ritualLog").dialog({
                                modal: true,
                                title: "Book Log",
                                height: "500",
                                width: "50%",
                                buttons: [

                                    {
                                        text: "Full Log",
                                        click: function () {
                                            window.location.href = "/API/RitualLog.php";
                                        }
                                    },
                                    {
                                        text: "OK",
                                        click: function () {
                                            $(this).dialog("close");
                                        }
                                    }
                                ]
                            });
                            $(".ritualLog").dialog('widget').find(".ui-dialog-titlebar-close").hide();
                        },
                        error: function (response) {}
                    });

                }
            },
            {

                text: 'Add',
                name: 'add'        // do not change name
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
            if (!verifyUnique(rowdata.ID)) {
                alert("This book already exists");
                return;
            }

            $.ajax({
                url: baseBookURL + rowdata["ID"],
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
            if (!verifyUnique(rowdata.ID)) {
                alert("This book already exists");
                return;
            }
            $.ajax({
                url: baseBookURL,
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
                url: baseBookURL + rowdata[0]["ID"],
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
