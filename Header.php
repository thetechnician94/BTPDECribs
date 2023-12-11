<?php
session_start();
if(!isset($_SESSION["id"])){
    header("Location: /Login.html");
    die();
}
echo"<div class='header'>Beta Theta Pi</div>";

