<?php
include 'ini.php';
$mysqli = new mysqli(HOST,USER,PW,DATABASE);

/*********************************************
 * highscore get
 */
if($_POST["action"] == "get") {
	$output = '';
	$mSql = connectDB($mysqli, 'select * from `'.STAB.'` order by `score` desc limit 50', array(), DEBUG);
	foreach($mSql["res"] as $qRes) {
		$output .= '<li class="highscore-item"><strong class="highscore-score">'.$qRes["score"].'</strong> '.handleHTML($qRes["name"]).'<small class="nays highscore-nays" title="nays">'.(empty($qRes["nays"]) ? '' : '('.$qRes["nays"].')').'</small></li>';
	}

	echo $output;
}

/*********************************************
 * highscore set
 */
if($_POST["action"] == "set" && !empty($_POST["name"])) {

	$chk = connectDB($mysqli, 'insert `'.STAB.'` set `name` = ?, `score` = ?, `nays` = ?', array("ssi", $_POST["name"], $_POST["score"], $_POST["nays"]), DEBUG);

	if($chk["info"]["affectedRows"] > 0) echo '1';
	else echo $chk["info"]["error"];
}

$mysqli->close();
?>