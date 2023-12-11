<?php
if(isset($_SESSION["id"])){
    header("Location: /Cribs.php");
}else{
    header("Location: /Login.html");
}
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

