<?php
$Auth = new AdminAuth();
$isAuth = $Auth->authCheck();
if ($isAuth) {
    if (isset($DATA->path)) {
        unlink(UPLOAD_ARTIKLES_REL_PATH.$DATA->path.'.html');
        $Artikles = new Artikles();
        $Artikles->deleteArtikle($DATA->path);
    } else {
        $RESPONSE['error'] = 2;
        $RESPONSE['errorMessage'] = 'no data';
    }
} else {
    $RESPONSE['error'] = 1;
    $RESPONSE['errorMessage'] = 'not authorized';
}

