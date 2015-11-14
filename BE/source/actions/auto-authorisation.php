<?php

if
(isset($_COOKIE['GUID']))
{
	$Auth = new Auth();
	$RESPONSE['isAuth'] = $Auth->authorisationByGUID();
	if (!$RESPONSE['isAuth']) {
        $RESPONSE['error'] = 2;
        $RESPONSE['errorMessage'] = 'ошибка автоматической авторизации';
	}
}  else {
    $RESPONSE['error'] = 1;
    $RESPONSE['errorMessage'] = 'пройдите процедуру авторизации';
}


