<?php
$Auth = new AdminAuth();
$isAuth = $Auth->authCheck();

if ($isAuth) {
    if (  isset($DATA->orderId) && isset($DATA->state) ) {
        $Orders = new Orders();
        $RESPONSE['isChanged'] = $Orders->setOrderStatus($DATA->orderId, $DATA->state);
        if ($RESPONSE['isChanged']) {
            $RESPONSE['state'] = $DATA->state;
        }
    } else {
        $RESPONSE['error'] = 1;
        $RESPONSE['errorMessage'] = 'no data';
    }
} else {
    $RESPONSE['error'] = 1;
    $RESPONSE['errorMessage'] = 'not authorized';
}