<?php
	header('Content-Type:application/json');
	$conn=mysqli_connect('localhost','root','','jd',3306);
	$sql='set names utf8';
	mysqli_query($conn,$sql);
	$sql="select * from jd_product";
	$result=mysqli_fetch_all(mysqli_query($conn,$sql),MYSQLI_ASSOC);
	$str=json_encode($result);
	echo $str;
?>
