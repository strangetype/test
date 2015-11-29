<?php
$Auth = new AdminAuth();
$Chiper = new Chiper();
$isAuth = $Auth->authCheck();

if ($isAuth) {
    if ($DATA->id) {
        $RESPONSE['data'] = $DATA;
        $RESPONSE['deleteResult'] = unlink(PHOTOS_PATH.$DATA->id);
        $RESPONSE['deleteResultMini'] = unlink(PHOTOS_MINI_PATH.$DATA->id);
    }
} else {
    $RESPONSE['error'] = 1;
    $RESPONSE['errorMessage'] = 'not authorized';
}

