<?php
$Auth = new AdminAuth();
$Chiper = new Chiper();
$isAuth = $Auth->authCheck();

if ($isAuth) {
    if ( !empty( $_FILES ) ) {
        $tempPath = $_FILES[ 'file' ][ 'tmp_name' ];
        $newFileName = $Chiper->getUniqueId();
        $uploadPath = PHOTOS_CLIENT_PATH.$newFileName;


        $size = getimagesize ( $tempPath );
        $fileWidth = $size[0];
        $fileHeight = $size[1];
        $fileSmallerSize = $fileWidth;
        if ($fileWidth>$fileHeight) $fileSmallerSize = $fileHeight;

        $dx = ceil(($fileWidth - $fileSmallerSize)/2);
        $dy = ceil(($fileHeight - $fileSmallerSize)/2);

        $x = $dx; $y = $dy;
        $w = $fileSmallerSize; $h = $fileSmallerSize;

        echo $_POST['data']; exit;

        $DATA = (object) json_decode($_POST['data']);

        if ($DATA->x) $x = $DATA->x;
        if ($DATA->y) $y = $DATA->y;
        if ($DATA->w) $w = $DATA->w;
        if ($DATA->h) $h = $DATA->h;

        $thumb = imagecreatetruecolor(100, 100);
        switch ($size["mime"]) {
            case 'image/jpeg':
                $source = imagecreatefromjpeg($tempPath);
            break;
            case 'image/png':
                $source = imagecreatefrompng($tempPath);
            break;
            case 'image/gif':
                $source = imagecreatefromgif($tempPath);
            break;
            default:
            break;
        }

        imagecopyresized(
            $thumb, $source,
            0, 0,
            $x, $y,
            100, 100,
            $w, $h
        );

        switch ($size["mime"]) {
            case 'image/jpeg':
                imagejpeg($thumb, $uploadPath);
            break;
            case 'image/png':
                imagepng($thumb, $uploadPath);
            break;
            case 'image/gif':
                imagegif($thumb, $uploadPath);
            break;
            default:
            break;
        }


        $RESPONSE['isUploaded'] = true;
        $RESPONSE['file'] = $_FILES[ 'file' ];
        $RESPONSE['post'] = $_POST;
        $RESPONSE['request'] = $_REQUEST;
        $RESPONSE['newFileName'] = $newFileName;

    } else {
        $RESPONSE['error'] = 2;
        $RESPONSE['errorMessage'] = 'no files';
    }
} else {
    $RESPONSE['error'] = 1;
    $RESPONSE['errorMessage'] = 'not authorized';
}

