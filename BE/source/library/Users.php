<?php
class Users
{
	public static $DB;
	
	function __construct()
	{
		new DB();
		session_start();
	}

	public function addUser($mail, $phone, $password)
	{
		$stmt = DB::$DB->prepare("
			INSERT INTO users
				(`mail`,
				`password`,
				`timestamp`,
				`phone`
				)
			VALUES
				(?, ?, CURRENT_TIMESTAMP, ?) "
		);

		$stmt->bind_param('sss',
			$mail,
			$password,
			$phone
		);
		$stmt->execute();
		$stmt->close();
		return DB::$DB->insert_id;
	}

	public function getUserById($id)
	{
	    $user = array();
		$stmt = DB::$DB->prepare("
			SELECT `id`, `phone` FROM users
			WHERE id = ? ;"
		);

		$stmt->bind_param('i',
			$id
		);
		$stmt->execute();
		$stmt->bind_result($user['id'], $user['phone']);
		$stmt->fetch();
		$stmt->close();
		return $user;
	}

	public function getUsersByOrder($usersList) {
		$user = array();
        $usersStr = implode(',',$usersList);
		$stmt = DB::$DB->prepare(
			"SELECT
				id,
				phone
            FROM users
            WHERE id IN (".$usersStr.");"
		);
		$stmt->execute();
		$stmt->bind_result(
			$user['id'],
			$user['phone']
		);

		$users = array();

		$tr = $stmt->fetch();
		$i = 0;

		while($tr)
		{
			$users[$i] = array();
			$users[$i]['id'] = $user['id'];
			$users[$i]['phone'] = $user['phone'];
			$tr = $stmt->fetch();
			$i++;
		}
		$stmt->close();
		return $users;
	}
	
	public function checkRepeatedUsers($mail)
	{
		$stmt = DB::$DB->prepare("SELECT mail FROM users WHERE mail = ? ");
		$stmt->bind_param('s', $mail);
		$stmt->execute();
		$stmt->bind_result($rMail);
		$stmt->fetch();
		$stmt->close();
		if ($rMail == $mail) return $rMail;
		return false;
	}

	public function checkRepeatedUsersByPhone($phone)
	{
		$stmt = DB::$DB->prepare("SELECT phone FROM users WHERE phone = ? ");
		$stmt->bind_param('s', $phone);
		$stmt->execute();
		$stmt->bind_result($rPhone);
		$stmt->fetch();
		$stmt->close();
		if ($rPhone == $phone) return $rPhone;
		return false;
	}

	public function setPassword($phone, $newPassword) {
		$stmt = DB::$DB->prepare("UPDATE users SET `password` = ? WHERE `phone` = ?");
		$stmt->bind_param('ss', $newPassword, $phone);
		$stmt->execute();
		$stmt->close();
		return 1;
	}
	
	public function getUsersList()
	{
		$user = array();
		$stmt = DB::$DB->prepare(
			"SELECT
				users.mail,
				users.first_name,
				users.last_name,
				users.image_name,
				a_countries.name,
				a_cities.name,
				a_streets.name,
				a_houses.name,
				a_apartments.name,
				users.phone1,
				users.phone2
            FROM users
                LEFT OUTER JOIN address_book ON users.address_id = address_book.id
                LEFT OUTER JOIN a_countries ON address_book.country = a_countries.id
                LEFT OUTER JOIN a_cities ON address_book.city = a_cities.id
                LEFT OUTER JOIN a_streets ON address_book.street = a_streets.id
                LEFT OUTER JOIN a_houses ON address_book.house = a_houses.id
                LEFT OUTER JOIN a_apartments ON address_book.apartment = a_apartments.id ;
            "
		);
		$stmt->execute();
		
		$stmt->bind_result(
			$user['mail'],
			$user['firstName'],
			$user['lastName'],
			$user['imageName'],
			$user['country'],
			$user['city'],
			$user['street'],
			$user['house'],
			$user['apartment'],
			$user['phone1'],
			$user['phone2']
		);
		
		$users = array();
		
		$tr = $stmt->fetch();
		$i = 0;
		
		while($tr)
		{
			$users[$i] = array();
			$users[$i]['mail'] = $user['mail'];
			$users[$i]['firstName'] = $user['firstName'];
			$users[$i]['lastName'] = $user['lastName'];
			$users[$i]['imageName'] = $user['imageName'];
			$users[$i]['country'] = $user['country'];
			$users[$i]['city'] = $user['city'];
			$users[$i]['street'] = $user['street'];
			$users[$i]['house'] = $user['house'];
			$users[$i]['apartment'] = $user['apartment'];
			$users[$i]['phone1'] = $user['phone1'];
			$users[$i]['phone2'] = $user['phone2'];
			
			$tr = $stmt->fetch();
			$i++;
		}
		$stmt->close();
		return $users;
	}
	
	public function updateImageName($id, $imageName)
	{
		$stmt = DB::$DB->prepare("UPDATE users SET `image_name` = ? WHERE `id` = ?");
		$stmt->bind_param('ss', $imageName, $id);
		$stmt->execute();
		$stmt->close();
		return 1;
	}
	
	public function updateImageNameBySID($SID, $imageName)
	{
		$stmt = DB::$DB->prepare("UPDATE users SET `image_name` = ? WHERE `sid` = ?");
		$stmt->bind_param('ss', $imageName, $SID);
		$stmt->execute();
		$stmt->close();
		return 1;
	}
	
	public function getUserBySID($SID)
	{
		$user = array();
		$stmt = DB::$DB->prepare(
			"SELECT
                users.mail,
                users.first_name,
                users.last_name,
                users.image_name,
                users.phone1,
                users.phone2, 
                a_countries.name,
                a_cities.name,
                a_streets.name,
                a_houses.name,
                a_apartments.name
            FROM users
                LEFT OUTER JOIN address_book ON users.address_id = address_book.id
                LEFT OUTER JOIN a_countries ON address_book.country = a_countries.id
                LEFT OUTER JOIN a_cities ON address_book.city = a_cities.id
                LEFT OUTER JOIN a_streets ON address_book.street = a_streets.id
                LEFT OUTER JOIN a_houses ON address_book.house = a_houses.id
                LEFT OUTER JOIN a_apartments ON address_book.apartment = a_apartments.id
            WHERE users.sid = ?;
			"
		);
		
		$stmt->bind_param('s', $SID);
		
		$stmt->execute();
		
		$stmt->bind_result(
			$user['mail'],
			$user['firstName'],
			$user['lastName'],
			$user['imageName'],
			$user['phone1'],
			$user['phone2'],
			$user['country'],
			$user['city'],
			$user['street'],
			$user['house'],
			$user['apartment']
		);
		
		$stmt->fetch();
		
		$stmt->close();
		return $user;
	}
	
	public function getUserImagePathBySID($SID)
	{
		$stmt = DB::$DB->prepare(
			"SELECT
				`image_name`
			FROM users
			WHERE
				`sid` = ?;
			"
		);
		$stmt->bind_param('s', $SID);
		$stmt->execute();
		$stmt->bind_result($imageName);
		$stmt->fetch();
		$stmt->close();
		return $imageName;
	}
	
	public function updateInfo($SID, $info)
	{
		$stmt = DB::$DB->prepare(
			"SELECT
				`mail`
			FROM users
			WHERE
				`sid` = ?;
			"
		);
		$stmt->bind_param('s', $SID);
		$stmt->execute();
		$stmt->bind_result($mail);
		$stmt->fetch();
		$stmt->close();
		$searchField = FN::searchEncode($info['firstName'].$info['lastName'].$mail);
	
		$stmt = DB::$DB->prepare("
			UPDATE users
			SET
				`first_name` = ?,
				`last_name` = ?,
				`phone1` = ?,
				`phone2` = ?,
				`address_id` = ?,
				`search_field` = ?
			WHERE `SID` = ?
		");
		
		$stmt->bind_param('sssssss',
			$info['firstName'],
			$info['lastName'],
			$info['phone1'],
			$info['phone2'],
			$info['addressId'],
			$searchField,
			$SID
		);
		
		$stmt->execute();
		$stmt->close();
		return 1;
	}
	
}