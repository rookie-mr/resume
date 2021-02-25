$(function(){
	$('#header').load('header.php');
	$('#footer').load('footer.php');
});

$(function(){
	$.ajax({
		url:'data/cart_detail.php',
			data:{uname:sessionStorage['uname']},
			success:function(detailList){
				var html='';
				$.each(detailList,function(i,d){
					html+=`
						<tr>
							<td>
								<input type="checkbox"/>
								<input type="hidden" name="did" value="${d.did}" />
								<div><img src="${d.pic}" alt=""/></div>
							</td>
							<td><a href="">${d.pname}</a></td>
							<td>${d.price}</td>
							<td>
								<button>-</button><input type="text" value="${d.count}"/><button>+</button>
							</td>
							<td><span>${d.price*d.count}</span></td>
							<td><a href="${d.did}">删除</a></td>
						</tr>	
					`;	
				});
				$('#cart tbody').html(html);
			}
	})
});

$('#cart').on('click','button',function(){
	var operation=$(this).html();
	var self=this;
	var count=parseInt($(this).siblings('input').val());
	if (operation=='-' && count>1)
	{
		count--;
	}
	if (operation=='+')
	{
		count++;
	}
	var did=$(this).parent().parent().find('input[name="did"]').val();
	$.ajax({
		url:'data/cart_update.php',
		data:{did:did,count:count},
		success:function(txt){
			if (txt=='succ')
			{
				console.log('修改成功！');
				$(self).siblings('input').val(count);
			}else{
				console.log('修改失败！');
			}
		}
	})
});

$('#cart').on('click','a:contains("删除")',function(e){
	e.preventDefault();
	var did=$(this).attr('href');
	var self=this;
	$.ajax({
		url:'data/cart_detail_delete.php',
		data:{did:did},
		success:function(txt){
			if (txt=='succ')
			{
				console.log('删除成功！');
				$(self).parent().parent().remove();
			}else{
				console.log('删除失败！');
			}
		}
	})
});