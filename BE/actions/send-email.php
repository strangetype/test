<?php
if ($DATA->name && $DATA->message && $DATA->email) {
    $mailRes = mail("macsimusfactorre@gmail.com", "Письмо с сайта: ".$DATA->email." ".$DATA->name, $DATA->message);
    $RESPONSE['result'] = $mailRes;
} else {
    $RESPONSE['error'] = 1;
    $RESPONSE['errorMessage'] = 'no params';
}
