<?php
	header('Content-Type:application/json');
	$uname=$_REQUEST['uname'];
	$upwd=$_REQUEST['upwd'];
	//include()
	$conn=mysqli_connect('localhost','root','','jd',3306);
	$sql='set names utf8';
	mysqli_query($conn,$sql);
	$sql="select uid from jd_user where uname='$uname' and upwd='$upwd'";
	$result=mysqli_query($conn,$sql);
	$output=['code'=>0,'msg'=>''];
	if($result===false){
		$output['code']=-1;
		$output['msg']='执行失败！请检查SQL'.$sql;
	}else{
	$row = mysqli_fetch_assoc($result);
		if($row===null){
			$output['code']=-2;
			$output['msg']='用户名或密码错误！';
		}else{
			$output['code']=1;
			$output['msg']='登录成功！';
		}
	}
	echo json_encode($output);