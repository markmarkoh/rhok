<?php 

require_once "../_/scripts/grab.php";

$con = mysql_connect($host,$user,$pass);
if (!$con)
  {
  die('Could not connect: ' . mysql_error());
  }
 mysql_select_db($db, $con); 
 
$handle = $_POST['handle'];
$url = $_POST['url'];
$img = $_POST['img'];
$name = $_POST['name'];

if(isset($handle)) {
	$url = addslashes($url);
	$img = addslashes($img);
	$handle = addslashes($handle);
	
	if(!empty($url)) {
		$sql = "SELECT * FROM twitter WHERE handle = '$handle'";
		$res = mysql_query($sql, $con);

		if (mysql_num_rows($res) == 0) {
			$sql="INSERT INTO twitter (handle, url, img, name)
			VALUES
			('$handle', '$url', '$img', '$name')";
			
			if (!mysql_query($sql,$con)) {
			  die('Error: ' . mysql_error());
		  	}

			echo '{"new": true}';
		} else {
			echo '{"new": false}';
 		}
	}

	mysql_close($con);
}
?>

