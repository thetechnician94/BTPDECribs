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
        <script src="/Scripts/RitualBookScript.js"></script>
    </head>
    <body>
        <?PHP
        require "Header.php";
        if ($_SESSION["role"] == "Guest") {
            echo "<div class='permissionDenied'>Sorry! This page is for brothers only!</div>";
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

    <div class='qualitySelect'>
        Please select the quality of your book:
        <select>
            <option></option>
            <option>Very Poor</option>
            <option>Poor</option>
            <option>Average</option>
            <option>Good</option>
            <option>Very Good</option>
            <option>New</option>
        </select>

    </div>

    <div class='checkoutReason'>
        Reason for checkout:
        <textarea></textarea>

    </div>
    
     <div class='ritualLog'>
         <div class='logText'></div>
    </div>
</html>
