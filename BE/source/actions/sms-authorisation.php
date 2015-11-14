<?php

if
(isset($DATA->phone) &&
isset($DATA->password))
{
	$Auth = new Auth();
	$RESPONSE['isAuth'] = $Auth->authorisationByPhone($DATA->phone, $DATA->password);
	if (!$RESPONSE['isAuth']) {
        $RESPONSE['error'] = 2;
        $RESPONSE['errorMessage'] = 'неверный пароль или телефон';
	}
}  else {
    $RESPONSE['error'] = 1;
    $RESPONSE['errorMessage'] = 'недостаточно данных для авторизации';
}


