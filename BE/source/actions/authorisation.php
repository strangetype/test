<?php

$result = 0;

if
(isset($DATA->mail) &&
isset($DATA->password))
{
	$Auth = new Auth();
	$RESPONSE['isAuth'] = $Auth->authorisation($DATA->mail, $DATA->password);
	if (!$RESPONSE['isAuth']) {
        $RESPONSE['error'] = 2;
        $RESPONSE['errorMessage'] = 'неверный пароль или почтовый ящик';
	}
}  else {
    $RESPONSE['error'] = 1;
    $RESPONSE['errorMessage'] = 'недостаточно данных для авторизации';
}


