<?php 

require_once "_/scripts/grab.php";

$con = mysql_connect($host,$user,$pass);
if (!$con)
  {
  die('Could not connect: ' . mysql_error());
  }
 mysql_select_db($db, $con); 
 

$sql="SELECT * FROM twitter";

$res = mysql_query($sql, $con);
if (!$res)
  {
  die('Error: ' . mysql_error());
  }
header("Content-type: application/json");


$rows = array();
while($data = mysql_fetch_assoc($res)) {
	$rows[] = $data;
}
echo json_encode($rows);


mysql_close($con);
?>

