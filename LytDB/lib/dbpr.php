<?php

$req=0;
if($req==0){
  $put=json_decode(file_get_contents("php://input"));
  $cols=$put->opt;
$url=$put->uri;

$op=fopen("../ds/ts/${url}.gini", "a+");

/*if(!file_exists("../ds/ts/${url}".".gini")){
echo "database does not exist";
}else{*/
$s= fwrite($op, $cols);
 fclose($op);
  echo "data inserted to db ${url}";
//}
 

 

}

?>