<?php
$Auth = new AdminAuth();
$isAuth = $Auth->authCheck();

if ($isAuth) {
    if ($DATA->id) {
        $Gallery = new Gallery();
        $isDeleted = $Gallery->deleteCategory($DATA->id);
        if ($isDeleted) {
            $RESPONSE['isDeleted'] = true;
        } else {
            $RESPONSE['error'] = 3;
            $RESPONSE['errorMessage'] = 'delete from DB error';
        }
    } else {
        $RESPONSE['error'] = 2;
        $RESPONSE['errorMessage'] = 'no data';
    }
} else {
    $RESPONSE['error'] = 1;
    $RESPONSE['errorMessage'] = 'not authorized';
}

