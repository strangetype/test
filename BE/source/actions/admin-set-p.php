<?php

if (isset($DATA->P)) {
    $Auth = new AdminAuth();
    $isAuth = $Auth->authCheck();
    if ($isAuth) {
        $Akril = new Akril();
        $RESPONSE['affected'] = $Akril->setP($DATA->P);
        if (!$RESPONSE['affected']) {
            $RESPONSE['error'] = 3;
            $RESPONSE['errorMessage'] = 'update error';
        }
    } else {
        $RESPONSE['error'] = 2;
        $RESPONSE['errorMessage'] = 'not authorized';
    }
} else {
    $RESPONSE['error'] = 1;
    $RESPONSE['errorMessage'] = 'no data';
}

