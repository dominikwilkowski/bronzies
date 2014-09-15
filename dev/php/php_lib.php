<?php
/*****************************| MYSQLI CONNECTION FUNCTION |*****************************/
/**
	* Simple MySQLi abstraction layer
	*
	* @param resource $mysqli The MySQLi connection link
	* @param string   $query  The MySQL query for prepaired statement
	* @param array    $v      The parameters to replace ? in $query. First element must be the type
	* @param integer  $o      Option for more debug infos [0]=no infos(default) [1]=adding debug infos
	*
	* @return array [for select]=associative array of table result  [for everything else]=associative array with affectedRows,info and insertID
	*/
function connectDB($mysqli,$query,$v=array(),$o=0) {

	if($mysqli->connect_errno) {
		return array('info'=>array('error'=>'Connect failed: '.$mysqli->connect_error)); //error handling here
		exit();
	}

	if(substr_count($query,"?")!=strlen($v[0]) || strlen($v[0])!=((count($v)-1)>=0 ? (count($v)-1) : 0)) {
		return array('info'=>array('error'=>'Placeholders are unequal! placeholders:'.substr_count($query,"?").', replacements:'.strlen($v[0]).', param:'.(count($v)-1).' ('.$v[0].')')); //error handling here...
		exit();
	}

	if($res=$mysqli->prepare($query)) {
			//dynamically bind all $v
			if($v) {
			$values=array($v[0]);
			for($i=1; $i<count($v); $i++) {
				${'bind'.$i}=$v[$i];
				$values[]=&${'bind'.$i};
			}
			call_user_func_array(array($res,'bind_param'),$values);
		}
		$res->execute();

		//bind all table rows to result
		if(strtolower(substr($query,0,6))=="select") {
			$field=$fields=$tempRow=array();
			$meta=$res->result_metadata();
			while($field=$meta->fetch_field()) {
				$fieldName=$field->name;
				$fields[]=&$tempRow[$fieldName];
			}
			$meta->free_result();
			call_user_func_array(array($res,"bind_result"),$fields);

			//return associative array
			$results=array();
			$i=0;
			while($res->fetch()) {
				$results["res"][$i]=array();
				foreach($tempRow as $k=>$v2) $results["res"][$i][$k] = $v2;
				$i++;
			}
			$res->free_result();

		}
		else { //return infos about the query
			$results["info"]["affectedRows"]=$mysqli->affected_rows;
			$results["info"]["insertID"]=$mysqli->insert_id;
		}

		$res->close();
	}

	if($o===1) { //adding debug infos
		if($mysqli->warning_count) {
			if($err=$mysqli->query("SHOW WARNINGS")) {
				$row=$err->fetch_row();
				$results["info"]["error"].=$row[0].' ('.$row[1].'): '.$row[2];
				$err->close();
			}
		}
		$results["info"]["info"]=$mysqli->info;
		$q=$query;
		for($i=1;$i<count($v);$i++) $q=preg_replace("/\?/",(substr($v[0],($i-1),1)=="s" ? '"' : '').$v[$i].(substr($v[0],($i-1),1)=="s" ? '"' : ''),$q,1);
		$results["info"]["query"]=$q;
		$results["info"]["param"]=json_encode($v);
	}

	if(strtolower(substr($query,0,6))=="update" || strtolower(substr($query,0,6))=="delete") { //optimize at update or delete
		preg_match_all('/((update|delete) `(.*)` )/i',$query,$tables);
		foreach($tables[3] as $t) $mysqli->query('OPTIMIZE TABLE '.$t);
	}

	return $results;
}


/*****************************| SYSTEM MESSAGE FUNCTION |*****************************/
/**
	* TINY SYSTEM MESSAGE GATHERER
	*
	* addMsg($msg,$o)
	* @param string   $msg Message to be added
	* @param int      $o   Urgency [0](default)=normal [1]=warning [2]=error [3]=no HTML wrapper
	*
	* getMsg()
	* @return string All messages in HTML wrappers (unless $o=3)
	*/
class sysMsg {
	var $msg;
	var $o;

	public function addMsg($msg,$o=0) {
		if($o==3) $this->msg.=$msg;
		else $this->msg.='<h5 class="'.($o==1 ? 'w' : ($o==2 ? 'e' : 'd')).'">'.$msg.'</h5>';
	}

	public function getMsg() {
		return $this->msg;
	}
}


/*****************************| GLOBAL HTMLENTITIES FUNCTION |*****************************/
/**
	* TINY GLOBAL HTML STRIP
	*
	* @param string  $m  String to be striped
	*
	* @return string String stripped off html entities
	*/
function handleHTML($m) { return stripslashes(htmlspecialchars($m)); }


/*****************************| UPLOAD FILES |*****************************/
/**
	* TINY FILE UPLOAD ABSTRACTION LAYER
	*
	* @param object  $sysMsg   System Message object
	* @param string  $el       Name of _FILE element
	* @param string  $name     Name of new file
	* @param string  $kind     Kind of upload ["image"|"pdf"]
	* @param array   $dim      Dimension of image [0]=width [1]=height
	* @param string  $delFile  Name of file to be deleted
	*
	* @return array ["res"]=true|false
	*/
function uploadFile($sysMsg,$el,$name,$kind,$dim=array(),$delFile='') {
	$r=array();
	$r["res"]=false;

	if(empty($_FILES[$el]['type'])) $sysMsg->addMsg('No file selected',1);
	else {
		if(!is_writable(UPLOADF)) $sysMsg->addMsg('Upload folder not writeable',2);
		else {
			$chk=$chk2=0;
			$im=false;
			if($kind=="image") { //check through image conditions
				if($_FILES[$el]['type']!="image/jpeg") $sysMsg->addMsg('Image format not supported ('.$_FILES[$el]['type'].')',2);
				else {
					$dimEl=getimagesize($_FILES[$el]['tmp_name']);
					if(!empty($dim[0]) && $dimEl[0]<$dim[0] || !empty($dim[1]) && $dimEl[1]<$dim[1]) $sysMsg->addMsg('Image must be at least'.(!empty($dim[0]) ? ' '.$dim[0].'px wide' : '').(!empty($dim[1]) ? ' '.$dim[1].'px tall' : '').' (w:'.$dimEl[0].' h:'.$dimEl[1].')',2);
					else $im=true;
				}
			}
			$pdf=false;
			if($kind=="pdf" && $_FILES[$el]['type']!="application/pdf") $sysMsg->addMsg('PDF not recognized ('.$_FILES[$el]['type'].')',2);
			else $pdf=true;

			if($kind=="pdf" && $pdf===true || $kind=="image" && $im===true) { //upload file
				$chk+=move_uploaded_file($_FILES[$el]['tmp_name'],UPLOADF.$name);
				if((int)$chk!==1) $sysMsg->addMsg('Upload has failed ('.$_FILES[$el]['tmp_name'].'=>'.UPLOADF.$name.')',2);
			}
		}
	}

	if(!empty($delFile) && (int)$chk===1) { //delete old file
		$chk2=0;
		$chk2+=unlink(UPLOADF.$delFile);
		if((int)$chk2!==1) $sysMsg->addMsg('Unable to delete old image',1);
	}

	if((int)$chk===1) {
		$sysMsg->addMsg('Upload successful');
		$r["res"]=true;
	}

	return $r;
}


/*****************************| STRING TO URL |*****************************/
/**
	* TINY STING TO URL CLEANER
	*
	* @param string  $t  String to be converted
	*
	* @return string string stripped off of all characters but A-Za-z0-9 and dash, spaces are converted to dash
	*/
function makeURL($t) { return strtolower(substr(preg_replace("/[^\w-]+/","",str_replace(" ","-",$t)),0,20)); }


/*****************************| TRUNCATE WORDS |*****************************/
/**
	* TINY TRUNCATE WORD FUNCTION
	*
	* @param string  $t      String to be shortened
	* @param int     $count  Number of words to output
	* @param boolen  $dots   Add dots at the end with string is larger than $count. (optional) [default=true]
	*
	* @return string of $count words with added dots
	*/
function trancateWords($t, $count, $dots = true) {
	$words = implode(" ", array_slice( explode(" ", $t), 0, $count) );

	if( strlen($t) > strlen($words) && $dots ) $words .= '...';

	return $words;
}


/*****************************| SITE SPECIFIC |*****************************/




















?>