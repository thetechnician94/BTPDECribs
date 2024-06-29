const baseUserURL = "/API/Users.php";

$(document).ready(function () {
    initTable();
});


function initTable() {
    var table = $('#dataTable').DataTable({
        dom: 'fBrtlip',
        ajax: {
            url: baseUserURL,
            dataSrc: ''
        },
        columns: [
            {
                data: "id",
                title: "ID",
                type: "hidden"
            },
            {
                data: "name",
                title: "Name",
                type: "text",
                readonly: true
            },
            {
                data: "email",
                title: "Email",
                type: "text",
                readonly: true
            },
            {
                data: "role",
                title: "Role",
                type: "select",
                options: ["Guest", "Brother", "Admin", "Ritual Chair"]
            },
            {
                data: "verified",
                title: "Verified",
                type: "checkbox"
            }
        ],
        paging: true,
        stateSave: true,
        "lengthMenu": [[5, 10, 25, 50], [5, 10, 25, 50]],
        buttons: [
            {
                text: "Verify",
                extend: "selected",
                action: function (e, dt, node, config) {
                    var data = $('#dataTable').DataTable().rows({selected: true}).data();
                    if (data[0]["verified"] == "true") {
                        alert("This user has already been verified");
                        return;
                    }
                    $.ajax({
                        url: baseUserURL,
                        type: 'POST',
                        data: "id=" + data[0]["id"]+"&verify=true&role="+data[0]["role"],
                        success: function (response, status, more) {
                            $('#dataTable').DataTable().ajax.reload();
                        },
                        error: function (response, status, more) {
                            alert("Error verifying user " + response);
                        }
                    });
                }

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
        onDeleteRow: function (datatable, rowdata, success, error) {
            $.ajax({//delete the table row
                url: baseUserURL,
                type: 'POST',
                data: "delete=" + rowdata[0]["id"],
                success: success,
                error: error
            });
        },

        onEditRow: function (datatable, rowdata, success, error) {
            $.ajax({//delete the table row
                url: baseUserURL,
                type: 'POST',
                data: "id=" + rowdata["id"] + "&role=" + rowdata["role"]+"&verify="+rowdata["verified"],
                success: success,
                error: error
            });
        }
    });
}
