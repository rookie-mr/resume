<?php
    header('Content-Type:application/json;charset=utf-8');
    $uname=$_REQUEST['uname'];
    $conn=mysqli_connect('localhost','root','','jd',3306);
    $sql='set names utf8';
    mysqli_query($conn,$sql);
    $sql="select uid from jd_user where uname='$uname'";
    $result=mysqli_query($conn,$sql);
    $uid=mysqli_fetch_assoc($result)['uid'];
    mysqli_query($conn,$sql);

    $sql="select sum(price) as sp from jd_order where userId='$uid'";
    $result=mysqli_query($conn,$sql);
    $sp=mysqli_fetch_assoc($result)['sp'];
    $output['totalCount']=floor($sp/1000);

    $sql="select count(*) as c from jd_lottery where uid='$uid'";
    $result=mysqli_query($conn,$sql);
    $c=mysqli_fetch_assoc($result)['c'];
    $output['usedCount']=intval($c);

    $output['leftCount']=$output['totalCount']-$output['usedCount'];

    echo json_encode($output);
?>