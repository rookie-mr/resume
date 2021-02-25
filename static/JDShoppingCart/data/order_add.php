<?php
    $orderNum=rand();
    $shopName='京东自营';
    $rcvName=$_REQUEST['rcvName'];
    $price=$_REQUEST['price'];
    $payment=$_REQUEST['payment'];
    $orderTime=$_REQUEST['orderTime'];
    $status=1;
    $uname=$_REQUEST['uname'];
    $productList=$_REQUEST['productList'];
    $productList=json_decode($productList);
    $conn=mysqli_connect('localhost','root','','jd',3306);
    $sql='set names utf8';
    mysqli_query($conn,$sql);
    $sql="select uid from jd_user where uname=$uname";
    $result=mysqli_query($conn,$sql);
    $uid=mysqli_fetch_assoc($result)['uid'];
    $sql="insert into jd_order values('null','$orderNum','$shopName','$rcvName','$price','$orderTime','$status','$uid')";
    $result=mysqli_query($conn,$sql);
    $oid=mysqli_insert_id($conn);
    foreach($productList as $p){
        $pid=$p->productId;
        $count=$p->count;
        $sql="insert into jd_order_detail values(null,'$oid','$pid',$count)";
        mysqli_query($conn,$sql);
    }
    $output=[];
    if($oid){
        $output['msg']='succ';
        $output['oid']=$oid;
        $output['orderNum']=$ordernum;
    }else{
        $output['msg']='err';
    }
    echo json_encode($output);
?>