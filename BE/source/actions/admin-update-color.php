<?php
$Auth = new AdminAuth();
$isAuth = $Auth->authCheck();

if ($isAuth) {
    if (   isset($DATA->id)
        && isset($DATA->name)
        && isset($DATA->textureId)
        && isset($DATA->coupleId)
        && isset($DATA->color)
        && isset($DATA->categoryId)
        && isset($DATA->cost)
        && isset($DATA->artikle)
        && isset($DATA->CW)
        ) {

        $Gallery = new Gallery();
        if ($Gallery->updateColor($DATA)) {
           $RESPONSE['updatedColor'] = $DATA;
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

