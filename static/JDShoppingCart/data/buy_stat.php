<?php
    header('Content-Type:application/json');
    $uname=$_REQUEST['uname'];
    $output=[
        ['label'=>'1月','value'=>9000],
        ['label'=>'2月','value'=>0],
        ['label'=>'3月','value'=>3000],
        ['label'=>'4月','value'=>4000],
        ['label'=>'5月','value'=>5000],
        ['label'=>'6月','value'=>2000],
        ['label'=>'7月','value'=>4000],
        ['label'=>'8月','value'=>5000],
        ['label'=>'9月','value'=>5000],
        ['label'=>'10月','value'=>5000],
        ['label'=>'11月','value'=>10000],
        ['label'=>'12月','value'=>2000]
    ];
    echo json_encode($output);