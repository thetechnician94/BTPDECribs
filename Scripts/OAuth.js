/*
 * Functions for handling the OAuth with Google and necessary redirects
 */
function parseUrlFragment() {
    var fragment = window.location.hash.substring(1); // Exclude the "#" symbol
    var pairs = fragment.split('&');
    var result = {};

    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');
        var key = decodeURIComponent(pair[0]);
        var value = decodeURIComponent(pair[1]);
        result[key] = value;
    }

    return result;
}
function generateForm() {
    var formData = parseUrlFragment();
    var form = document.createElement('form');
    form.action = 'CompleteSignin.php'; // Replace with the actual destination page URL
    form.method = 'post';

    for (var key in formData) {
        if (formData.hasOwnProperty(key)) {
            var input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = formData[key];
            form.appendChild(input);
        }
    }

    document.body.appendChild(form);
    form.submit();
}

function login() {
    let oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
    // Create <form> element to submit parameters to OAuth 2.0 endpoint.
    var form = document.createElement('form');
    form.setAttribute('method', 'GET'); // Send as a GET request.
    form.setAttribute('action', oauth2Endpoint);


    var params = {'client_id': '625554778222-u7uc5kh86chnllmpo63qdf2jkhqf60fj.apps.googleusercontent.com',
        'redirect_uri': 'https://devcribs.kubetas.com/oauth/',
        'response_type': 'token',
        'scope': 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
        'include_granted_scopes': 'true',
        'state': 'pass-through value'};

    // Add form parameters as hidden input values.
    for (var p in params) {
        var input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', p);
        input.setAttribute('value', params[p]);
        form.appendChild(input);
    }

    // Add form to page and submit it to open the OAuth 2.0 endpoint.
    document.body.appendChild(form);
    form.submit();
}