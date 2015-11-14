<?php
$Auth = new AdminAuth();
$isAuth = $Auth->authCheck();

if ($isAuth) {
    if (   isset($DATA->id)
        && isset($DATA->name)
        && isset($DATA->description)
        ) {

        $Gallery = new Gallery();
        if ($Gallery->updateMegaCategory($DATA)) {
            $RESPONSE['updatedMegaCategory'] = $DATA;
        } else {
            $RESPONSE['error'] = 3;
            $RESPONSE['errorMessage'] = 'update error';
        }
    } else {
        $RESPONSE['error'] = 2;
        $RESPONSE['errorMessage'] = 'no data';
    }
} else {
    $RESPONSE['error'] = 1;
    $RESPONSE['errorMessage'] = 'not authorized';
}

