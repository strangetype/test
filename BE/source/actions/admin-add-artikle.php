<?php

$Auth = new AdminAuth();
$isAuth = $Auth->authCheck();

if ($isAuth) {
    if (isset($DATA->path)
    && isset($DATA->name)
    && isset($DATA->artikle)
    && isset($DATA->categoryName)
    && isset($DATA->categoryTitle)) {

        $newArtikle = fopen(UPLOAD_ARTIKLES_REL_PATH.$DATA->path.'.html', 'w');
        fwrite($newArtikle, $DATA->artikle);
        fclose($newArtikle);

        $Artikles = new Artikles();
        $Artikles->addArtikle($DATA->name, $DATA->path, $DATA->categoryName, $DATA->categoryTitle);

    } else {
        $RESPONSE['error'] = 2;
        $RESPONSE['errorMessage'] = 'no data';
    }
} else {
    $RESPONSE['error'] = 1;
    $RESPONSE['errorMessage'] = 'not authorized';
}