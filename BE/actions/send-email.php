<?php
if ($DATA->name && $DATA->message && $DATA->email) {
    $mess = $DATA->message." \n email: ".$DATA->email.", телефон: ".$DATA->phone;
    $mailRes = mail("mtropinamoscow@gmail.com", "Письмо с фото-сайта от ".$DATA->name, $mess);
    $RESPONSE['result'] = $mailRes;
} else {
    $RESPONSE['error'] = 1;
    $RESPONSE['errorMessage'] = 'no params';
}
