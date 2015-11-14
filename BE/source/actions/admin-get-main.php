<?php
$Auth = new AdminAuth();
$isAuth = $Auth->authCheck();

if ($isAuth) {
    $Akril = new Akril();
    $RESPONSE['P'] = round(1000*$Akril->getP())/1000;
} else {
    $RESPONSE['error'] = 1;
    $RESPONSE['errorMessage'] = 'not authorized';
}