$(function(){
	$('#header').load('header.php');
	$('#footer').load('footer.php');
	$('#plist').load('data/product_select.php',null,function(){
		$.ajax({
			type:'GET',
			url:'data/product_select.php',
			success:function(data){
				var html='<ul>';
				for (var i in data)
				{
					var n=data[i];
					html+=`
						<li>
                            <a href=""><img src=${n.pic}></a>
                            <p>￥${n.price}</p>
                            <h1><a href="">${n.pname}</a></h1>
                            <div>
                                <a href="" class="contrast"><i></i>对比</a>
                                <a href="" class="p-operate"><i></i>关注</a>
                                <a class="addcart" data-pid=${n.pid}><i></i>加入购物车</a>
                            </div>
                        </li>	
					`
				};
				html+=
					`
						</ul>
						<ol class="pager">
							<li><a href="#">1</a></li>
							<li><a href="#">2</a></li>
							<li class="active"><a href="#">3</a></li>
							<li><a href="#">4</a></li>
							<li><a href="#">5</a></li>
						</ol>
					`
				$('#plist').html(html);
			}
		})
	});
});

$('#btn-login').click(function(){
	var dataRequest=$('#login-form').serialize();
	$.ajax({
		type:'POST',
		url:'data/login.php',
		data:dataRequest,
		success:function(data){
			if (data.code!==1)
			{
				$('.modal .alert').html(data.msg);
			}else{
				$('.modal').fadeOut(500);
				var uname=$('[name="uname"]').val();
				$('#welcome').html('欢迎回来：'+uname);
			}
		}
	})
});

$('div#header').on('click','#bt-login',function(){
	$('.modal').fadeIn(300);
});

$('.addcart').click(function(){
	$.ajax({
		type:'GET',
		url:'data/cart_add.php',
		data:{productId:$(this).data('pid')},
		success:function(data){
					
		}
	})
})
