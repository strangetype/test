<?php

$dirlist = scandir(PHOTOS_PATH);
$photos = array();
for ($i=2; $i<count($dirlist); $i++) {
    $photos[] = $dirlist[$i];
}

$RESPONSE['photos'] = $photos;




