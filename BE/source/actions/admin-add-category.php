<?php
$Auth = new AdminAuth();
$isAuth = $Auth->authCheck();

if ($isAuth) {
    if (   isset($DATA->name)
        && isset($DATA->description)
        && isset($DATA->megaCategoryId)
        && isset($DATA->type)
        ) {

        $Gallery = new Gallery();
        $RESPONSE['addedCategory'] = $Gallery->addCategory($DATA);

    } else {
        $RESPONSE['error'] = 2;
        $RESPONSE['errorMessage'] = 'no data';
    }
} else {
    $RESPONSE['error'] = 1;
    $RESPONSE['errorMessage'] = 'not authorized';
}

