
$(document).ready(function () {
    populatePrefs(getPreferences());
    initEventHandlers();
});


function setPreference(key, value) {
    let url = prefsURL;
    let data = [];
    $.ajax({
        url: url,
        type: 'POST',
        async: true,
        data: "setting=" + key + "&value=" + value,
        success: function (response) {
            data = response;
        },
        error: function (response) {}
    });
    return data;
}

function populatePrefs(prefs) {
    for (const key in prefs) {
        const value = prefs[key];
        $(".profileSettings select").val(value);
        $(".profileSettings input").val(value);
    }

}
function initEventHandlers() {
    $(".profileSettings select").on("change", function () {
        let val = $(this).val();
        let name = $(this).attr('name');
        setPreference(name, val);
    });
}