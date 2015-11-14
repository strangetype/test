<?php
$Auth = new AdminAuth();
$isAuth = $Auth->authCheck();

if ($isAuth) {
    if ( !empty( $_FILES ) ) {

        $tempPath = $_FILES[ 'file' ][ 'tmp_name' ];
        $uploadPath = IMAGES_PATH.$_FILES[ 'file' ][ 'name' ];
        move_uploaded_file( $tempPath, $uploadPath );

        $RESPONSE['isUploaded'] = true;
        $RESPONSE['file'] = $_FILES[ 'file' ];
        $RESPONSE['post'] = $_POST;
        $RESPONSE['request'] = $_REQUEST;

    } else {
        $RESPONSE['error'] = 2;
        $RESPONSE['errorMessage'] = 'no files';
    }
} else {
    $RESPONSE['error'] = 1;
    $RESPONSE['errorMessage'] = 'not authorized';
}

