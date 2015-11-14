<?php
class Akril
{
	public static $DB;
	
	function __construct()
	{
		new DB();
		session_start();
	}

	public function getP() {

		$stmt = DB::$DB->prepare(
			"SELECT `P` FROM `factors`
             WHERE 1"
		);
		$stmt->bind_result($P);
		$stmt->execute();
		$stmt->fetch();
		$stmt->close();
		return $P;
	}

	public function setP($P) {
		$stmt = DB::$DB->prepare(
			"UPDATE `factors` SET `P` = ?;"
		);
		$stmt->bind_param('d',$P);
		$stmt->execute();
		$stmt->fetch();
		$stmt->close();
		return DB::$DB-->affected_rows;
	}


}
?>