<?php
	header('Content-Type:application/json');
	$uname=$_REQUEST['uname'];
	$conn=mysqli_connect('127.0.0.1','root','','jd',3306);
	$sql='set names utf8';
	mysqli_query($conn,$sql);

	$sql="select cid from jd_cart where userId=(select uid from jd_user where uname='$uname')";
	$result=mysqli_query($conn,$sql);
	$row=mysqli_fetch_assoc($result);
	$cid=$row['cid'];

	$sql="select did,cartId,productId,count,pname,price,pic from jd_cart_detail,jd_product where cartId='$cid' and productId=pid";
	$result=mysqli_query($conn,$sql);
	$list=mysqli_fetch_all($result,MYSQLI_ASSOC);

	echo json_encode($list);
