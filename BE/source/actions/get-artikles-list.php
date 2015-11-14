<?php
$arts = scandir(UPLOAD_ARTIKLES_REL_PATH);

$narts = array();

for ($i=2; $i<count($arts); $i++) {
    $narts[] = basename($arts[$i],'.html');
}

$Artikles = new Artikles();
$artikleNames = $Artikles->getArtikles();


$RESPONSE['artikles'] = $narts;
$RESPONSE['artikleNames'] = $artikleNames;