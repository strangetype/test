<?php
$Auth = new AdminAuth();
$isAuth = $Auth->authCheck();

if ($isAuth) {
    if ( !empty( $_FILES ) ) {

        $tempPath = $_FILES[ 'file' ][ 'tmp_name' ];
        $uploadPath = COLORS_IMAGES_PATH.$_FILES[ 'file' ][ 'name' ];
        $uploadMiniPath =  COLORS_IMAGES_MINI_PATH.$_FILES[ 'file' ][ 'name' ];
        move_uploaded_file( $tempPath, $uploadPath );

        $size = getimagesize ( $uploadPath );
        $fileWidth = $size[0];
        $fileHeight = $size[1];
        $fileSmallerSize = $fileWidth;
        if ($fileWidth>$fileHeight) $fileSmallerSize = $fileHeight;
        $thumb = imagecreatetruecolor(45, 45);
        switch ($size["mime"]) {
            case 'image/jpeg':
                $source = imagecreatefromjpeg($uploadPath);
            break;
            case 'image/png':
                $source = imagecreatefrompng($uploadPath);
            break;
            case 'image/gif':
                $source = imagecreatefromgif($uploadPath);
            break;
            default:
            break;
        }
        imagecopyresized(
            $thumb, $source,
            0, 0,
            0, 0,
            45, 45,
            $fileSmallerSize, $fileSmallerSize
        );

        switch ($size["mime"]) {
            case 'image/jpeg':
                imagejpeg($thumb, $uploadMiniPath);
            break;
            case 'image/png':
                imagepng($thumb, $uploadMiniPath);
            break;
            case 'image/gif':
                imagegif($thumb, $uploadMiniPath);
            break;
            default:
            break;
        }
        //unlink ($uploadPath);

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

