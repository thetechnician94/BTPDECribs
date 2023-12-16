<?php

//Oauth complete
/* //We aren't going to store this info - but its here for later
  $_SESSION["token"] = filter_input(INPUT_POST, "access_token");
  $_SESSION["expires"] = filter_input(INPUT_POST, "expires_in");
  $_SESSION["scope"] = filter_input(INPUT_POST, "scope");
  $_SESSION["state"] = filter_input(INPUT_POST, "state");
 */

//Lookup User
$userInfoURL = "https://www.googleapis.com/oauth2/v2/userinfo";
$authorization = "Authorization: Bearer " . filter_input(INPUT_POST, "access_token"); // Prepare the authorization token
$ch = curl_init();
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_URL, $userInfoURL);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Length: 0', $authorization));
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1); // This will follow any redirects
$result = curl_exec($ch); // Execute the cURL statement
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch); // Close the cURL connection
$info = json_decode($result, true); // Return the received data
if ($httpcode != 200) { //Make sure we got a good response
    echo "Uh Oh! Something went wrong. Please try again later<br>";
    echo $info["Error"]["Message"];
    die();
}
//Check if a verified user
$vUsersDir = "{$_SERVER["DOCUMENT_ROOT"]}/Users";
$files = array_diff(scandir($vUsersDir), array(".", "..", "web.config"));
$userFile = null;
foreach ($files as $file) {
    if (str_replace(".json", "", $file) == $info["id"]) {
        $userFile = $file;
        break;
    }
}
if ($userFile == null) { //Never signed in before
    notifyAdmins($info["name"], $info["email"]);
    $temp = fopen($vUsersDir . "/" . $info["id"] . ".json", "w");
    $info["verified"] = false;
    $info["role"] = "";
    fwrite($temp, json_encode($info));
    fclose($temp);
    header("Location: /NeedsVerification.html");
    die();
} else {
    $temp = fopen($vUsersDir . "/" . $info["id"] . ".json", "r+");
    $content = file_get_contents($vUsersDir . "/" . $info["id"] . ".json");
    $tempInfo = json_decode($content, true);
    if ($tempInfo["verified"] == false) {
        header("Location: /NeedsVerification.html");
        die();
    }
    $info["verified"] = true;
    $info["role"] = $tempInfo["role"];
    fwrite($temp, json_encode($info));
    fclose($temp);
}
//Set our internal state
session_start();
$_SESSION["email"] = $info["email"];
$_SESSION["name"] = $info["name"];
$_SESSION["id"] = $info["id"];
$_SESSION["lastName"] = $info["family_name"];
$_SESSION["firstName"] = $info["given_name"];
$_SESSION["picture"] = $info["picture"];
$_SESSION["role"] = $info["role"];
//Redirect to the site
header("Location: /Cribs.php");

function notifyAdmins($name, $email) {
    require "Settings.php";
    $curl = curl_init();
    curl_setopt_array($curl, array(
        CURLOPT_URL => $adminAlertURL,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'POST',
        CURLOPT_POSTFIELDS => array("content" => "A new user has attempted to sign in. $name, $email","username"=>"Beta Cribs Alerts")
    ));
    $response = curl_exec($curl);
    curl_close($curl);
    echo $response;
}
