<?php
$Auth = new AdminAuth();
$Chiper = new Chiper();
$isAuth = $Auth->authCheck();

if ($isAuth) {
    if ($DATA->data) {
        $myfile = fopen("data.json", "w");
        fwrite($myfile,json_encode($DATA->data));
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

