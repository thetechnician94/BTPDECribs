<html>
    <head>
        <title>KU Betas Cribs</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <!--
       JQuery
        -->
        <link href="/JQuery/jquery-ui.min.css" rel="stylesheet" />
        <script src="/JQuery/jquery.js"></script>
        <script src="/JQuery/jquery-ui.min.js"></script>
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
        <script src="/Scripts/Profile.js"></script>
    </head>
    <body>
        <?PHP
        require "Header.php";
        ?>
        <div class="profileSettings">
            <label>Theme:</label>
            <select name="Theme">
                <option>Default</option>
                <option>Dark</option>
            </select>

        </div>
        <?PHP
        require "Footer.php";
        ?>
    </body>

</html>
