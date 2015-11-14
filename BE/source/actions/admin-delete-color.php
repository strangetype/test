<?php
$Auth = new AdminAuth();
$isAuth = $Auth->authCheck();

if ($isAuth) {
    if ($DATA->colorId) {
        $Gallery = new Gallery();

        $color = $Gallery->getColorById($DATA->colorId);
        if ($color) {
            $isDeleted = $Gallery->deleteColor($color['id']);
            if ($isDeleted) {
                unlink(COLORS_IMAGES_PATH.$color['textureId']);
                $RESPONSE['isDeleted'] = true;
            } else {
                $RESPONSE['error'] = 4;
                $RESPONSE['errorMessage'] = 'delete from DB error';
            }

        } else {
            $RESPONSE['error'] = 3;
            $RESPONSE['errorMessage'] = 'no such color';
        }

    } else {
        $RESPONSE['error'] = 2;
        $RESPONSE['errorMessage'] = 'no data';
    }
} else {
    $RESPONSE['error'] = 1;
    $RESPONSE['errorMessage'] = 'not authorized';
}

