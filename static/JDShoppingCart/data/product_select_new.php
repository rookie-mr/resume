<?php
	header('Content-Type:application/json');
	$conn=mysqli_connect('localhost','root','','jd',3306);
	//接受客户端提交数据
	$pageNum=$_REQUEST['pageNum'];
	//向客户端输出的数据
	$pager=[
		'recordCount'=>0,
		'pageSize'=>8,
		'pageCount'=>0,
		'pageNum'=>intval($pageNum),
		'data'=>null
	];
	//设置编码方式
	$sql='set names utf8';
	mysqli_query($conn,$sql);

$sql = "SELECT COUNT(*) FROM jd_product";
$result = mysqli_query($conn,$sql);
$row = mysqli_fetch_assoc($result);
$pager['recordCount'] = intval($row['COUNT(*)']);//把字符串解析为整数
$pager['pageCount'] = ceil(($pager['recordCount'])/($pager['pageSize']));  //计算总页数

//SQL3：获取当前指定页中的记录
$start = ($pager['pageNum']-1)*$pager['pageSize']; //从哪一行开始读取记录
$count = $pager['pageSize']; //读取多少行
$sql = "SELECT * FROM jd_product LIMIT $start,$count";
$result = mysqli_query($conn, $sql);

//读取所有的产品记录
$pager['data'] = mysqli_fetch_all($result, MYSQLI_ASSOC);


//把分页对象编码为JSON字符串并输出
echo json_encode($pager);
