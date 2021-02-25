<?php
    header('Content-Type:application/json;charset=utf-8');
    $uname=$_REQUEST['uname'];
    $upwd=$_REQUEST['upwd'];
    $umail=$_REQUEST['umail'];
    $homepage=$_REQUEST['homepage'];
    $age=$_REQUEST['age'];
    $bir=$_REQUEST['birthday'];
    $bir=strtotime($bir)*1000;
    $conn=mysqli_connect('localhost','root','','jd',3306);
    $sql='set names utf8';
    mysqli_query($conn,$sql);
    $sql="insert into jd_user values(null,'$uname','$upwd','$umail','$homepage','$age','$bir')";
    $result=mysqli_query($conn,$sql);
    $output=[];
    if($result){
        $output['msg']='succ';
        $output['uid']=mysqli_insert_id($conn);
    }else{
        $output['msg']='succ';
        $output['uid']=$sql;
    }
    echo json_encode($output);