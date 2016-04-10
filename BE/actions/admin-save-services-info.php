<?php
$Auth = new AdminAuth();
$Chiper = new Chiper();
$isAuth = $Auth->authCheck();

if ($isAuth) {
    if (isset($DATA->servicesInfo)) {
        $myfile = fopen("services-info.html", "w");
        fwrite($myfile,$DATA->servicesInfo);
        fclose($myfile);
        $RESPONSE['data'] = $DATA->data;
    } else {
        $RESPONSE['error'] = 2;
        $RESPONSE['errorMessage'] = 'no data to save';
    }
} else {
    $RESPONSE['error'] = 1;
    $RESPONSE['errorMessage'] = 'not authorized';
}

