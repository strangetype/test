<?php
$Auth = new Auth();
$RESPONSE['isAuth'] = $Auth->authCheck();

if (!$RESPONSE['isAuth']) {
    $RESPONSE['error'] = 1;
    $RESPONSE['errorMessage'] = 'сбой авторизации';
}