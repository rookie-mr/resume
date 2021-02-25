<?php
	header('Content-Type:text/html');
	$did=$_REQUEST['did'];
	$conn=mysqli_connect('localhost','root','','jd',3306);
	$sql='set names utf8';
	mysqli_query($conn,$sql);
	$sql="delete from jd_cart_detail where did='$did'";
	$result=mysqli_query($conn,$sql);
	if($result){
		echo 'succ';
	}else{
		echo 'err';
	}