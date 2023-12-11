const prefsURL = "/API/Preference.php?uniq=" + new Date().getTime();
let prefs = getPreferences();
switch (prefs.Theme) {
    case "Dark":
        $("head").append('<link rel="stylesheet" href="/CSS/Dark.css" type="text/css" />');
        break;
}


$(document).ready(function () {



});


function getPreferences() {
    let url = prefsURL;
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
    return JSON.parse(data);
}
