<?php
    
  ini_set("display_errors", 0);

  if ($_FILES["file"]["error"] > 0){
    
    echo "Return Code: " . $_FILES["file"]["error"] . "<br />";
  
  }else{
    
    echo "Upload: " . $_FILES["file"]["name"] . "<br />";
    echo "Type: " . $_FILES["file"]["type"] . "<br />";
    echo "Size: " . ($_FILES["file"]["size"] / 1024) . " Kb<br />";
   

    if (file_exists($_FILES["file"]["name"])){
        unlink($_FILES["file"]["name"]);
    }
    
    if(move_uploaded_file($_FILES["file"]["tmp_name"],$_FILES["file"]["name"])){
      echo "View image <a href='" . $_FILES["file"]["name"]."' target='_blank'>here</a>";
    }else{
      echo "The file wasn't uploaded";
    }
  }
  

?>