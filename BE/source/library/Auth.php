<?php
class Auth
{
	public static $DB;
	
	function __construct()
	{
		new DB();
		session_start();
	}
	
	public function authorisation($mail, $password)
	{
		$id = 0;
		
		$stmt = DB::$DB->prepare(
			"SELECT `id` FROM users WHERE 
			`mail` = ? AND password = ?;"
		);
		
		$stmt->bind_param('ss', $mail, $password);
		$stmt->execute();
		$stmt->bind_result($id);
		$stmt->fetch();
		$stmt->close();
		if ($id)
		{
			$GUID = Chiper::GUID();
			$stmt = DB::$DB->prepare("UPDATE users SET `GUID` = ? WHERE `id` = ?");
			$stmt->bind_param('ss', $GUID, $id);
			$stmt->execute();
			$stmt->close();
			$_SESSION['userId'] = $id;
			$_SESSION['GUID'] = $GUID;
			$GLOBALS["RESPONSE"]['newGUID'] = $_SESSION['GUID'];
			return 1;
		}

		return 0;
	}

	public function authorisationByPhone($phone, $password)
	{
		$id = 0;

		$stmt = DB::$DB->prepare(
			"SELECT `id` FROM users WHERE
			`phone` = ? AND password = ?;"
		);

		$stmt->bind_param('ss', $phone, $password);
		$stmt->execute();
		$stmt->bind_result($id);
		$stmt->fetch();
		$stmt->close();
		if ($id)
		{
			$GUID = Chiper::GUID();
			$stmt = DB::$DB->prepare("UPDATE users SET `GUID` = ? WHERE `id` = ?");
			$stmt->bind_param('ss', $GUID, $id);
			$stmt->execute();
			$stmt->close();
			$_SESSION['userId'] = $id;
			$_SESSION['GUID'] = $GUID;
			$GLOBALS["RESPONSE"]['newGUID'] = $_SESSION['GUID'];
			return $id;
		}

		return 0;
	}

	public function authorisationByGUID()
	{
		$id = 0;

		$stmt = DB::$DB->prepare(
			"SELECT `id` FROM users WHERE
			`GUID` = ?;"
		);

		$stmt->bind_param('s', $_COOKIE['GUID']);
		$stmt->execute();
		$stmt->bind_result($id);
		$stmt->fetch();
		$stmt->close();
		if ($id)
		{
			$GUID = Chiper::GUID();
			$stmt = DB::$DB->prepare("UPDATE users SET `GUID` = ? WHERE `id` = ?");
			$stmt->bind_param('ss', $GUID, $id);
			$stmt->execute();
			$stmt->close();
			$_SESSION['GUID'] = $GUID;
			$_SESSION['userId'] = $id;
			$GLOBALS["RESPONSE"]['newGUID'] = $_SESSION['GUID'];
			return $id;
		}

		return 0;
	}

	public function authCheck()
	{
        if (isset($_SESSION['GUID']) && isset($_COOKIE['GUID']) && isset($_SESSION['userId'])) {

            $user = array();
            $userGUID = 0;
            $stmt = DB::$DB->prepare("SELECT `GUID` FROM users WHERE `id` = ? ");
            $stmt->bind_param('s', $_SESSION['userId']);
            $stmt->execute();
            $stmt->bind_result($userGUID);
            $stmt->fetch();
            $stmt->close();

            if ($userGUID === $_SESSION['GUID']) {
                $GUID = Chiper::GUID();
                $_SESSION['GUID'] = $GUID;
                $stmt = DB::$DB->prepare("UPDATE users SET `GUID` = ? WHERE `id` = ?");
                $stmt->bind_param('ss', $GUID, $_SESSION['userId']);
                $stmt->execute();
                $stmt->close();
                $GLOBALS["RESPONSE"]['newGUID'] = $_SESSION['GUID'];
                return $_SESSION['userId'];
            } else {
                $GUID = Chiper::GUID();
                $stmt = DB::$DB->prepare("UPDATE users SET `GUID` = ? WHERE `id` = ?");
                $stmt->bind_param('ss', $GUID, $_SESSION['userId']);
                $stmt->execute();
                $stmt->close();
                unset($_SESSION['GUID']);
                unset($_SESSION['userId']);
            }
        }

		return false;
	}
	
	public function getMyProfile()
	{
		if (isset($_SESSION['sid']))
		{
			$user = array();
			$id = 0;
			$stmt = DB::$DB->prepare("SELECT `id`, `mail`, `first_name`, `last_name` FROM users WHERE `sid` = ? ");
			$stmt->bind_param('s', $_SESSION['sid']);
			$stmt->execute();
			$stmt->bind_result($id, $user['mail'], $user['firstName'], $user['lastName']);
			$stmt->fetch();
			$stmt->close();
			if ($id) return $user;
		}

		return false;
	}
	
	public function getMyId()
	{
		if (isset($_SESSION['GUID']))
		{
			$id = 0;
			$stmt = DB::$DB->prepare("SELECT `id` FROM users WHERE `GUID` = ? ");
			$stmt->bind_param('s', $_SESSION['GUID']);
			$stmt->execute();
			$stmt->bind_result($id);
			$stmt->fetch();
			$stmt->close();
			if ($id) return $id;
		}

		return false;
	}

	public function resetPassword() {
	    $resetInfo = array();
        $password = Chiper::generateSmallPassword();
        $encodedPassword = Chiper::passwordEncode($password);
        if (isset($_SESSION['GUID']) && isset($_SESSION['userId'])) {
            $phone = false;
            $stmt = DB::$DB->prepare("SELECT `phone` FROM `users` WHERE `id` = ? AND `GUID` = ?");
            $stmt->bind_param('ss', $_SESSION['userId'], $_SESSION['GUID']);
            $stmt->execute();
            $stmt->bind_result($phone);
            $stmt->fetch();
            $stmt->close();
            if ($phone) {
                $stmt = DB::$DB->prepare("UPDATE `users` SET `password` = ? WHERE `id` = ? AND `GUID` = ?");
                $stmt->bind_param('sss', $encodedPassword, $_SESSION['userId'], $_SESSION['GUID']);
                $stmt->execute();
                $stmt->close();
                $resetInfo['password'] = $password;
                $resetInfo['phone'] = $phone;
                return $resetInfo;
            }
        }
        return $resetInfo;
	}
	
	public function signOut()
	{
        $GUID = Chiper::GUID();
        $stmt = DB::$DB->prepare("UPDATE users SET `GUID` = ? WHERE `id` = ?");
        $stmt->bind_param('ss', $GUID, $_SESSION['userId']);
        $stmt->execute();
        $stmt->close();
        unset($_SESSION['GUID']);
        unset($_SESSION['userId']);
	}
	
	public static function getGUID()
	{
		if (isset($_SESSION['GUID']))
		{
			return $_SESSION['GUID'];
		}
		else
		{
			return false;
		}
	}
	
}
?>