<?php
	$uname=$_REQUEST['uname'];
	$productId=$_REQUEST['productId'];
	$conn=mysqli_connect('localhost','root','','jd',3306);
	$sql='set names utf8';
	mysqli_query($conn,$sql);
	$sql="select uid from jd_user where uname='$uname'";
	$result=mysqli_fetch_assoc(mysqli_query($conn,$sql));
	$uid=$result['uid'];
	var_dump($uid);
	$sql="select cid from jd_cart where userId='$uid'";
	$cartId=mysqli_fetch_assoc(mysqli_query($conn,$sql))['cid'];
	var_dump($cartId);
	if($cartId===null){
		$sql="insert into jd_cart values(null,'$uid')";
		$result=mysqli_query($conn,$sql);
		$cartId=mysqli_fetch_assoc($result)['cid'];
	}
	$sql="select productId,count from jd_cart_detail where cartId='$cartId' and productId='$productId'";
	$result=mysqli_fetch_assoc(mysqli_query($conn,$sql));
    var_dump($result);
	if(!$result){
		$productId=$result['productId'];
		$sql="insert into jd_cart_detail productId,count values('$productId',1)";
		mysqli_query($conn,$sql);
	}else{
		$result['count']=$result['count']+1;
		$sql="updata jd_cart_detail set count=($result['count']) where cartId='$cartId'";
		mysqli_query($conn,$sql);
	}