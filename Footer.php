<div class="footer">
    <div>
        <a href='Cribs.php'>Cribs</a>
        <a href='Classes.php'>Classes</a>
        <?PHP
        if ($_SESSION["role"] != "Guest") {
            echo "<a href = 'RitualBooks.php' >Ritual&nbsp;Books</a>";
        }
        if ($_SESSION["role"] == "Admin") {
            echo "<a href = 'Users.php'>Users</a>";
        }
        ?>
        <!-- <a href='Profile.php'>Profile</a>-->
        <a href="Help.php">Help</a>
        <a href='/Oauth/Signout.php'>Sign&nbsp;Out</a>
    </div>
</div>