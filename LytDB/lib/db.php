<?php

$req=0;

function re(){
  $chars="12345abcdef";
  $loo=str_shuffle(substr($chars, 0, 5));
  return $loo;
}

if($req==0){
  $f=json_decode(file_get_contents("php://input"));
  
  $dt=$f->dbn;
  $ps=$f->dps;
  $data="<@GINI@>\n!gini file\n";
 $ree=re();
 
 $ap="[${ree}]\ndbn=${dt}\ndbp=${ps}\n______________________\n";
 
  $fo=fopen("../ds/ts/${dt}".".gini", "w+");
  $fw=fwrite($fo, $data."\n");
  fclose($fo);
 
 //wrjte t] dblist
 
 $l=fopen("../ds/dblist.gini", "a+");
 $read=fread($l, 2000000);
 if(stristr($read, $dt)){
 echo 3;
 }else{
  $lw=fwrite($l, $ap);
 }
 fclose($l);
echo 4;
}else{
  echo 3;
}

?>