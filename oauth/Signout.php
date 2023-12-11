<?php
echo "Signing you out...";
session_start();
$_SESSION = array();
// Finally, destroy the session.
session_destroy();
header("Location: /index.php");
