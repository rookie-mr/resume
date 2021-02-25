<?php
	header('Content-Type:application/json');
	$uname=$_REQUEST['uname'];
	$pid=$_REQUEST['productId'];

	if(!$uname||!$pid){echo '{}';return;};

	$conn=mysqli_connect('localhost','root','','jd',3306);
	$sql='set names utf8';
	mysqli_query($conn,$sql);
	$output=[
		'msg'=>null,
		'uid'=>0,
		'cid'=>0,
		'pid'=>intval($pid),
		'count'=>0
	];

/*
	$sql="select uid from jd_user where uname='$uname'";
	$result=mysqli_query($conn,$sql);
	$row=mysqli_fetch_assoc($result);
	$uid=intval($row['uid']);
	$output['uid']=$uid;

	$sql="select cid from jd_cart where userId='$uid'";
	$result=mysqli_query($conn,$sql);
	$row=mysqli_fetch_assoc($result);
	if($row){
		$cid=$row['cid'];
	}else{
		$sql="insert into jd_cart values(null,'$uid')";
		$result=mysqli_query($conn,$sql);
		$cid=mysqli_insert_id($conn);
	}
	$cid=intval($cid);
	$output['cid']=$cid;

	$sql="select * from jd_cart_detail where cartId='$cid' and productId='$pid'";
	$result=mysqli_query($conn,$sql);
	$row=mysqli_fetch_assoc($result);
	if($row){
		$count=$row['count'];
		$count++;
		$sql="updata jd_cart_detail set count='$count' where cartId='$cid' and productId='$pid'";
		mysqli_query($conn,$sql);
	}else{
		$sql="insert into jd_cart_detail values(null,'$cid','$pid',1)";
		mysqli_query($conn,$sql);
		$count=1;
	}
	$output['count']=$count;
	echo json_encode($output);
*/
//SQL2：根据uname查询uid
$sql = "SELECT uid FROM jd_user WHERE uname='$uname'";
$result = mysqli_query($conn, $sql);
$row = mysqli_fetch_assoc($result);
$uid = intval($row['uid']);
$output['uid'] = $uid;

//SQL3: 根据用户编号查询购物车编号
$sql = "SELECT cid FROM jd_cart WHERE userId='$uid'";
$result = mysqli_query($conn, $sql);
$row = mysqli_fetch_assoc($result);
if($row){  //对应用户已有购物车
	$cid = $row['cid'];
}else {	//对用用户没有购物车
	//SQL4：购物车表中插入一行记录
	$sql = "INSERT INTO jd_cart VALUES(NULL, '$uid')";
	$result = mysqli_query($conn,$sql);
	$cid = mysqli_insert_id($conn);
}
$cid = intval($cid);
$output['cid'] = $cid;

//SQL5：根据购物车编号和产品编号，查询是否已经购买过该产品
$sql = "SELECT * FROM jd_cart_detail WHERE cartId='$cid' AND productId='$pid'";
$result = mysqli_query($conn,$sql);
$row = mysqli_fetch_assoc($result);
if($row){ //已经购买过该商品
	$count = $row['count']; 
	$count++;
	//SQL6：修改购买数量
	$sql = "UPDATE jd_cart_detail SET count='$count' WHERE cartId='$cid' AND productId='$pid'";
	mysqli_query($conn,$sql);
	
}else {  //没有购买过该商品
	//SQL7: 插入一行购买记录
	$sql = "INSERT INTO jd_cart_detail VALUES(NULL,'$cid','$pid',1)";
	mysqli_query($conn,$sql);
	$count = 1;
}
$output['count']=$count;

//把对象编码为JSON字符串并输出
echo json_encode($output);