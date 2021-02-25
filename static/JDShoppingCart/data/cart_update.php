<?php
/**接收客户端提交的购物车详情记录编号(did)和购买数量(count)，更新到数据库，返回succ或err**/
header('Content-Type: text/html');

$did = $_REQUEST['did'];
$count = $_REQUEST['count'];

//连接数据库
include('0_config.php'); //包含指定文件的内容在当前位置
$conn = mysqli_connect($db_url, $db_user, $db_pwd, $db_name, $db_port);

//SQL1: 设置编码方式
$sql = "SET NAMES UTF8";
mysqli_query($conn, $sql);

//SQL2：数据库更新语句
$sql = "UPDATE jd_cart_detail SET count='$count' WHERE did='$did'";
$result = mysqli_query($conn,$sql);

if($result){
	echo 'succ';
}else {
	echo 'sqlerr';
}