<?php
$Auth = new Auth();
$Orders = new Orders();
$UserId = $Auth->authCheck();
if ($UserId) {
    $RESPONSE['orders'] = array();
    $RESPONSE['orders']['orders'] = $Orders->getOrders($UserId);
    $ordersList = array();
    for ($i=0; $i<count($RESPONSE['orders']['orders']); $i++) {
        array_push($ordersList, $RESPONSE['orders']['orders'][$i]['id']);
    };
    if (count($ordersList)) {
        $RESPONSE['orders']['concretes'] = $Orders->getConcretesByOrder($ordersList);
    } else {
        $RESPONSE['orders']['concretes'] = array();
    }

}  else {
    $RESPONSE['error'] = 1;
    $RESPONSE['errorMessage'] = "войдите в систему или авторизируйтесь";
}