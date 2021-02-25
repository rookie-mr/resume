<?php
    //header('Content-Type:application/json;charset=utf-8');
	//$uname=$_REQUEST['uname'];
	//$conn=mysqli_connect('127.0.0.1','root','','jd',3306);
	//$sql='set names utf8';
	//mysqli_query($conn,$sql);

	//$sql="select uid from jd_user where uname='$uname'";
	//$result=mysqli_query($conn,$sql);
	//$uid=mysqli_fetch_assoc($result)['uid'];
	
	//$sql="select * from jd_order where userId='$uid';
	//$result=mysqli_query($conn,$sql);
	//$list=mysqli_fetch_all($result,MYSQLI_ASSOC);
	header('Content-Type: application/json;charset=UTF-8');

    //接收并处理客户端提交的请求数据
    $uname = $_REQUEST['uname'];
  	$conn=mysqli_connect('127.0.0.1','root','','jd',3306);
    //SQL1: 设置编码方式
    $sql = "SET NAMES UTF8";
    mysqli_query($conn,$sql);

    //SQL2: 根据用户名查询用户编号
    $sql = "SELECT uid FROM jd_user WHERE uname='$uname'";
    $result = mysqli_query($conn,$sql);
    $uid = mysqli_fetch_assoc($result)['uid'];

    //SQL3: 根据用户编号查询其对应的订单
    $sql = "SELECT * FROM jd_order WHERE userId=$uid";
    $result = mysqli_query($conn,$sql);
    $orderList = mysqli_fetch_all($result,MYSQLI_ASSOC);
	foreach($list as $i=>$o){
	    //$list[$i]['productList']=[];
	    $oid=$list[$i]['oid'];
	    $sql="select pid,pname,pic from jd_product where pid IN (select productId from jd_order_detail where orderId=$oid)";
	    $result=mysqli_query($conn,$sql);
	    $plist=mysqli_fetch_all($result,MYSQLI_ASSOC);
	    $list[$i]['productList']=$plist;
	}


	echo json_encode($list);
?>