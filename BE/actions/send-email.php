<?php
if ($DATA->name && $DATA->message && $DATA->email) {
    $mess = $DATA->message." /n ".$DATA->email." ".$DATA->name." ".$DATA->phone;
    $mailRes = mail("macsimusfactorre@gmail.com", "Письмо с фото-сайта от ".$DATA->name, $DATA->message);
    $RESPONSE['result'] = $mailRes;
} else {
    $RESPONSE['error'] = 1;
    $RESPONSE['errorMessage'] = 'no params';
}
