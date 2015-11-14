<?php
class AdminAuth
{
	public static $DB;
	
	function __construct()
	{
		new DB();
		session_start();
	}
	
	public function authorisation($username, $password)
	{
		session_start();
		$id = 0;
		
		$stmt = DB::$DB->prepare(
			"SELECT `id` FROM admin_users WHERE
			`username` = ? AND password = ?;"
		);
		
		$stmt->bind_param('ss', $username, $password);
		$stmt->execute();
		$stmt->bind_result($id);
		$stmt->fetch();
		$stmt->close();
		if ($id)
		{
			$sid = Chiper::GUID();
			$stmt = DB::$DB->prepare("UPDATE admin_users SET `sid` = ? WHERE `id` = ?");
			$stmt->bind_param('ss', $sid, $id);
			$stmt->execute();
			$stmt->close();
			$_SESSION['admin_sid'] = $sid;
			return 1;
		}
		
		return 0;
	}
	
	public function authCheck()
	{
		if (isset($_SESSION['admin_sid']))
		{
			$user = array();
			$id = 0;
			$stmt = DB::$DB->prepare("SELECT `id` FROM admin_users WHERE `sid` = ? ");
			$stmt->bind_param('s', $_SESSION['admin_sid']);
			$stmt->execute();
			$stmt->bind_result($id);
			$stmt->fetch();
			$stmt->close();
			if ($id) return $id;
		}

		return 0;
	}
	
	public function getMyId()
	{
		if (isset($_SESSION['admin_sid']))
		{
			$id = 0;
			$stmt = DB::$DB->prepare("SELECT `id` FROM admin_users WHERE `sid` = ? ");
			$stmt->bind_param('s', $_SESSION['admin_sid']);
			$stmt->execute();
			$stmt->bind_result($id);
			$stmt->fetch();
			$stmt->close();
			if ($id) return $id;
		}

		return false;
	}
	
	public function signOut()
	{
		unset($_SESSION['admin_sid']);
	}
	
	public static function getSID()
	{
		if (isset($_SESSION['admin_sid']))
		{
			return $_SESSION['admin_sid'];
		}
		else
		{
			return false;
		}
	}
	
}
?>