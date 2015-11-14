<?php

if (isset($DATA->order)) {
    if (isset($DATA->order['concretes'])) {
        if (is_array($DATA->order['concretes'])) {
            if (!count($DATA->order['concretes'])) {
                $RESPONSE['error'] = 2;
                $RESPONSE['errorMessage'] = "попытка создать пустой заказ";
            }
        } else {
            $RESPONSE['error'] = 2;
            $RESPONSE['errorMessage'] = "попытка создать пустой заказ";
        }
    } else {
        $RESPONSE['error'] = 2;
        $RESPONSE['errorMessage'] = "попытка создать пустой заказ";
    }
    $Auth = new Auth();
    if ($Auth->authCheck()) {
        $userId = $Auth->getMyId();
        if ($userId) {
            $Orders = new Orders();
            $result = $Orders->updateOrder($DATA->order, $userId);
            if ($result == 2) {
                $RESPONSE['error'] = 5;
                $RESPONSE['errorMessage'] = "заказ отменен";
            }
            if ($result == 3) {
                $RESPONSE['error'] = 6;
                $RESPONSE['errorMessage'] = "заказ недоступен для редактирвоания";
            }
            if ($result==1) {
                $RESPONSE['data'] = $DATA;
            }
            if (!$result) {
                $RESPONSE['error'] = 4;
                $RESPONSE['errorMessage'] = "ошибка при обновлении заказа";
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

