<html>
    <head>
        <title>KU Betas Cribs</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <!--
       JQuery
        -->
        <script src="/JQuery/jquery.js"></script>
        <!--
        Select 2
        -->
        <link href="/Select2/select2.min.css" rel="stylesheet" />
        <script src="/Select2/select2.min.js"></script>
        <!--
        Datatables
        -->
        <link href="/DataTables/bootstrap.min.css" rel="stylesheet">
        <link href="/DataTables/datatables.min.css" rel="stylesheet">
        <script src="/DataTables/bootstrap.bundle.min.js"></script>
        <script src="/DataTables/bootstrap.min.js"></script>
        <script src="/DataTables/datatables.min.js"></script>
        <script src="/DataTables/dataTables.altEditor.free.js"></script>
        <!--
        Custom Scripts and Style
        -->
        <link href="/CSS/Main.css" rel="stylesheet">
        <script src="/Scripts/Main.js"></script>
        <script src="/Scripts/UsersScript.js"></script>
    </head>
    <body>
        <?PHP
        require "Header.php";
        if ($_SESSION["role"] != "Admin") {
            echo "<div class='permissionDenied'>Sorry! This page is for admins only!</div>";
            require "Footer.php";
            http_response_code(403);
            die();
        }
        ?>
        <table id="dataTable" class='stripe'></table>
        <?PHP
        require "Footer.php";
        ?>
    </body>
</html>
