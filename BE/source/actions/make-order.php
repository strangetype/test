<?php

if (isset($DATA->order)) {
    $Auth = new Auth();
    if ($Auth->authCheck()) {
        $userId = $Auth->getMyId();
        if ($userId) {
            $Orders = new Orders();
            $orderId = $Orders->makeOrder($userId, $DATA->order->description, 0);
            $RESPONSE['data'] = $DATA;
            if ($orderId) {
                $i = 0;
                foreach($DATA->order['concretes'] as $c) {
                    if ($c['colors']['mainColor']) {
                        $colorId = $c['colors']['mainColor']['id'];
                    } else {
                        $colorId = false;
                    }
                    if ($c['colors']['edgeColor']) {
                        $edgeColorId = $c['colors']['edgeColor']['id'];
                    } else {
                        $edgeColorId = false;
                    }
                    $Orders->addConcrete(
                        $orderId,
                        $c['width'],
                        $c['height'],
                        $colorId,
                        $edgeColorId,
                        $c['edges']['left'],
                        $c['edges']['right'],
                        $c['edges']['top'],
                        $c['edges']['bottom'],
                        $c['count']
                    );
                    $i++;
                }
            } else {
                $RESPONSE['error'] = 4;
                $RESPONSE['errorMessage'] = "ошибка при создании заказа";
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

