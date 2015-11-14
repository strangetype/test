<?php
class Orders
{
	public static $DB;
	
	function __construct()
	{
		new DB();
		session_start();
	}

	public function makeOrder($ownerId, $description, $state)
	{

		$stmt = DB::$DB->prepare("
			INSERT INTO orders
				(`owner_id`,
				`description`,
				`state`
				)
			VALUES
				(?, ?, ?) "
		);

		$stmt->bind_param('isi',
			$ownerId,
			$description,
			$state
		);
		$stmt->execute();
		$stmt->close();
		return DB::$DB->insert_id;
	}

	public function getOrders($ownerId) {
		$order = array();
		$stmt = DB::$DB->prepare(
			"SELECT
				id,
				date,
				description,
				state
            FROM orders
            WHERE owner_id = ?
            ;"
		);

		$stmt->bind_param('i',
			$ownerId
		);

		$stmt->execute();

		$stmt->bind_result(
			$order['id'],
			$order['date'],
			$order['description'],
			$order['state']
		);

		$orders = array();

		$tr = $stmt->fetch();
		$i = 0;

		while($tr)
		{
			$orders[$i] = array();
			$orders[$i]['id'] = $order['id'];
			$orders[$i]['date'] = $order['date'];
			$orders[$i]['description'] = $order['description'];
			$orders[$i]['state'] = $order['state'];

			$tr = $stmt->fetch();
			$i++;
		}
		$stmt->close();
		return $orders;
	}

	public function getAllOrders() {
		$order = array();
		$stmt = DB::$DB->prepare(
			"SELECT
				id,
				date,
				description,
				state,
				owner_id
            FROM orders
            ;"
		);

		$stmt->execute();

		$stmt->bind_result(
			$order['id'],
			$order['date'],
			$order['description'],
			$order['state'],
			$order['ownerId']
		);

		$orders = array();

		$tr = $stmt->fetch();
		$i = 0;

		while($tr)
		{
			$orders[$i] = array();
			$orders[$i]['id'] = $order['id'];
			$orders[$i]['date'] = $order['date'];
			$orders[$i]['description'] = $order['description'];
			$orders[$i]['state'] = $order['state'];
			$orders[$i]['ownerId'] = $order['ownerId'];

			$tr = $stmt->fetch();
			$i++;
		}
		$stmt->close();
		return $orders;
	}

	public function addConcrete($orderId, $width, $height, $colorId, $edgeColorId, $isLeftEdge, $isRightEdge, $isTopEdge, $isBottomEdge, $count) {

		$RESPONSE['conc'] = Array(
		    'orderId'=>$orderId ,
		    'width'=>$width    ,
		    'height'=>$height  ,
		    'colorId'=>$colorId   ,
		    'edgeColorId'=>$edgeColorId   ,
		    'isLeftEdge'=>$isLeftEdge ,
		    'isRightEdge'=>$isRightEdge   ,
		    'isTopEdge'=>$isTopEdge      ,
		    'isBottomEdge'=>$isBottomEdge   ,
		    'count'=>$count
		);

		$stmt = DB::$DB->prepare("
			INSERT INTO concretes
				(`order_id`,
				`width`,
				`height`,
				`color_id`,
				`edge_color_id`,
				`is_left_edge`,
				`is_right_edge`,
				`is_top_edge`,
				`is_bottom_edge`,
				`count`
				)
			VALUES
				(?, ?, ?, ?, ?, ?, ?, ?, ?, ?) "
		);

		$stmt->bind_param('iddiiiiiii',
			$orderId, $width, $height, $colorId, $edgeColorId, $isLeftEdge, $isRightEdge, $isTopEdge, $isBottomEdge, $count
		);
		$stmt->execute();
		$stmt->close();
		return DB::$DB->insert_id;

	}

	public function getConcretes() {
		$concrete = array();
		$stmt = DB::$DB->prepare(
			"SELECT
				id,
				order_id,
				width,
				height,
                color_id,
                edge_color_id,
                is_left_edge,
                is_right_edge,
                is_top_edge,
                is_bottom_edge,
                count
            FROM concretes;"
		);
		$stmt->execute();

		$stmt->bind_result(
			$concrete['id'],
			$concrete['orderId'],
			$concrete['width'],
			$concrete['height'],
			$concrete['colorId'],
			$concrete['edgeColorId'],
			$concrete['isLeftEdge'],
			$concrete['isRightEdge'],
			$concrete['isTopEdge'],
			$concrete['isBottomEdge'],
			$concrete['count']
		);

		$concretes = array();

		$tr = $stmt->fetch();
		$i = 0;

		while($tr)
		{
			$concretes[$i] = array();
			$concretes[$i]['edges'] = array();
			$concretes[$i]['id'] = $concrete['id'];
			$concretes[$i]['orderId'] = $concrete['orderId'];
			$concretes[$i]['width'] = $concrete['width'];
			$concretes[$i]['height'] = $concrete['height'];
			$concretes[$i]['colorId'] = $concrete['colorId'];
			$concretes[$i]['edgeColorId'] = $concrete['edgeColorId'];
			$concretes[$i]['edges']['left'] = $concrete['isLeftEdge'];
			$concretes[$i]['edges']['right'] = $concrete['isRightEdge'];
			$concretes[$i]['edges']['top'] = $concrete['isTopEdge'];
			$concretes[$i]['edges']['bottom'] = $concrete['isBottomEdge'];
			$concretes[$i]['count'] = $concrete['count'];
			$tr = $stmt->fetch();
			$i++;
		}
		$stmt->close();
		return $concretes;
	}

	public function getConcretesByOrder($orders) {
		$concrete = array();
        $ordersStr = implode(',',$orders);
		$stmt = DB::$DB->prepare(
			"SELECT
				id,
				order_id,
				width,
				height,
                color_id,
                edge_color_id,
                is_left_edge,
                is_right_edge,
                is_top_edge,
                is_bottom_edge,
                count
            FROM concretes
            WHERE order_id IN (".$ordersStr.");"
		);
		$stmt->execute();
		$stmt->bind_result(
			$concrete['id'],
			$concrete['orderId'],
			$concrete['width'],
			$concrete['height'],
			$concrete['colorId'],
			$concrete['edgeColorId'],
			$concrete['isLeftEdge'],
			$concrete['isRightEdge'],
			$concrete['isTopEdge'],
			$concrete['isBottomEdge'],
			$concrete['count']
		);

		$concretes = array();

		$tr = $stmt->fetch();
		$i = 0;

		while($tr)
		{
			$concretes[$i] = array();
			$concretes[$i]['edges'] = array();
			$concretes[$i]['id'] = $concrete['id'];
			$concretes[$i]['orderId'] = $concrete['orderId'];
			$concretes[$i]['width'] = $concrete['width'];
			$concretes[$i]['height'] = $concrete['height'];
			$concretes[$i]['colorId'] = $concrete['colorId'];
			$concretes[$i]['edgeColorId'] = $concrete['edgeColorId'];
			$concretes[$i]['edges'] = array();
			$concretes[$i]['edges']['left'] = $concrete['isLeftEdge'];
			$concretes[$i]['edges']['right'] = $concrete['isRightEdge'];
			$concretes[$i]['edges']['top'] = $concrete['isTopEdge'];
			$concretes[$i]['edges']['bottom'] = $concrete['isBottomEdge'];
			$concretes[$i]['count'] = $concrete['count'];
			$tr = $stmt->fetch();
			$i++;
		}
		$stmt->close();
		return $concretes;
	}

	public function setOrderStatus($orderId, $state) {
        $stmt = DB::$DB->prepare(
            "UPDATE `orders` SET `state` = ? WHERE `id` = ?;"
        );
        $stmt->bind_param("ii", $state, $orderId);
        $stmt->execute();
        $stmt->close();
        return DB::$DB-->affected_rows;
	}

	public function deleteOrder($userId, $orderId) {
        $stmt = DB::$DB->prepare(
            "DELETE FROM `orders` WHERE `id` = ? AND `owner_id` = ?;"
        );
        $stmt->bind_param("ii", $orderId, $userId);
        $stmt->execute();

        $stmt = DB::$DB->prepare(
            "DELETE FROM `concretes` WHERE `order_id` = ?;"
        );
        $stmt->bind_param("i", $orderId);
        $stmt->execute();
        $stmt->close();
        return true;
	}

	public function updateOrder($order, $userId) {
	    $orderId = 0; $state = 1;
        $stmt = DB::$DB->prepare(
            "SELECT `id`, `state` FROM `orders` WHERE id = ? AND owner_id = ?;"
        );
        $stmt->bind_param("ii", $order['id'], $userId);
        $stmt->execute();
        $stmt->bind_result($orderId, $state);
        $stmt->fetch();
        if ($orderId && $state != 0) {
            $stmt->close();
            return 3;
        }
        if ($orderId) {
            $stmt->close();
            $stmt = DB::$DB->prepare(
                "UPDATE `orders` SET `description`= ?  WHERE id = ? AND owner_id = ? AND state = 0;"
            );
            $stmt->bind_param("sii",
                $order['description'],
                $order['id'],
                $userId
            );
            $stmt->execute();
            if (!$stmt->error) {
                $stmt->close();
                $stmt = DB::$DB->prepare("
                    DELETE FROM `concretes` WHERE `order_id` = ?;
                ");
                $stmt->bind_param("i", $order['id']);
                $stmt->execute();
                $a = $stmt->affected_rows;
                $i = 0;
                if (!$stmt->error) {
                    foreach($order['concretes'] as $c) {
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
                        self::addConcrete(
                            $order['id'],
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
                    };
                    $stmt->close();
                    return 1;
                }
                $stmt->close();
                return 0;
            } else {
                $stmt->close();
                return 0;
            }
        } else {
            $stmt->close();
            return 2;
        }
	}
}