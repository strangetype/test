<?php

$result = 0;

if
(isset($DATA->username) &&
isset($DATA->password))
{
	$Auth = new AdminAuth();
	$RESPONSE['isAuth'] = $Auth->authorisation($DATA->username, $DATA->password);
	if (!$RESPONSE['isAuth']) {
        $RESPONSE['error'] = 2;
        $RESPONSE['errorMessage'] = 'неверный пароль или имя';
	}
}  else {
    $RESPONSE['error'] = 1;
    $RESPONSE['errorMessage'] = 'недостаточно данных для авторизации';
}


