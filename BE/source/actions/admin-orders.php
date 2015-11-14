<?php
$Auth = new AdminAuth();
$Orders = new Orders();
$Users= new Users();
if ($Auth->authCheck()) {
    $RESPONSE['orders'] = array();
    $RESPONSE['orders']['orders'] = $Orders->getAllOrders();
    $ordersList = array();
    $usersList = array();
    for ($i=0; $i<count($RESPONSE['orders']['orders']); $i++) {
        array_push($ordersList, $RESPONSE['orders']['orders'][$i]['id']);
        array_push($usersList, $RESPONSE['orders']['orders'][$i]['ownerId']);
    };
    if (count($ordersList)) {
        $RESPONSE['orders']['concretes'] = $Orders->getConcretesByOrder($ordersList);
    } else {
        $RESPONSE['orders']['concretes'] = array();
    }
    if (count($usersList)) {
        $RESPONSE['orders']['users'] = $Users->getUsersByOrder($usersList);
    } else {
        $RESPONSE['orders']['user'] = array();
    }

}  else {
    $RESPONSE['error'] = 1;
    $RESPONSE['errorMessage'] = "войдите в систему или авторизируйтесь";
}