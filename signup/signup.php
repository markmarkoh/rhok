<?php

require_once('_/scripts/grab.php');

$output = array(
  'errors' => array(),
  'response' => array('success' => false)
);

if (empty($_POST['name']))
  $output['errors'][] = "no name specified!";

try {
  $db_conn = new PDO("mysql:host=$host;dbname=$db", $user, $pass, array(PDO::FETCH_ASSOC => true));
}
catch (PDOException $e) {
  $output['errors'][] = "could not connect to database :[";
}

if (empty($output['errors'])) {
  try {
    $query = "
    INSERT INTO
      signups (name)
    VALUES
      (:name)
    ";
    $stmt = $db_conn->prepare($query);
    $stmt->execute(array('name' => $_POST['name']));
  
    $query = "SELECT LAST_INSERT_ID()";
    $signup_id = $db_conn->query($query);
    if (empty($signup_id))
      throw new Exception("could not retrieve signup ID");

    $signup_id = current(current($result));
  
    $query = "
    INSERT INTO
      signup_skills (signup_id, skill)
    VALUES
      (:signup_id, :skill)
    ";
    $stmt = $db_conn->prepare($query);
    $params = array(
      'signup_id' => $signup_id,
      'skill' => ''
    );
    foreach (explode(',', $_POST['skills']) as $skill) {
      $params['skill'] = $skill;
      $stmt->execute($params);
    }
  
    $output['response']['success'] = true;
  }
  catch (Exception $e) {
    error_log($e->getMessage);
    $output['errors'][] = "an error occured when writing your signup to the database :[";
  }
}

header('Content-Type: application/json');
echo json_encode($output);
?>
