<?php

if (isset($DATA->orderId)) {
    $Auth = new Auth();
    if ($Auth->authCheck()) {
        $userId = $Auth->getMyId();
        if ($userId) {
            $Orders = new Orders();
            $result = $Orders->deleteOrder($userId, $DATA->orderId);
            if (!$result) {
                $RESPONSE['error'] = 4;
                $RESPONSE['errorMessage'] = "ошибка при удалении заказа";
            }
        } else {
            $RESPONSE['error'] = 3;
            $RESPONSE['errorMessage'] = "неверный пользователь";
        }
    }  else {
        $RESPONSE['error'] = 1;
        $RESPONSE['errorMessage'] = "войдите в систему или авторизируйтесь";
    }
} else {
    $RESPONSE['error'] = 2;
    $RESPONSE['errorMessage'] = "попытка создать пустой заказ";
}

