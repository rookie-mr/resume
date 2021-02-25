$(function(){
	$('#header').load('header.php');
	$('#footer').load('footer.php');
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
				$('.modal .alert').html(data.msg);
				$('.modal').fadeOut(500);
				var uname=sessionStorage.getItem('uname');
				$('#welcome').html('欢迎回来：'+uname);
			}
		}
	})
});

$('div#header').on('click','#bt-login',function(){
	$('.modal').fadeIn(300);
});

$(function(){
  loadProductByPage(1);
});

$('.pager').on('click','a',function(event){
  event.preventDefault(); //阻止跳转行为
  //获取要跳转的页号
  var pageNum = $(this).attr('href');
  loadProductByPage(pageNum);
});

function loadProductByPage(pageNum){
  $.ajax({
    url: 'data/product_select_new.php?pageNum='+pageNum,
    success: function(pager){
      //遍历读取到分页器对象，拼接HTML，追加到DOM树
      var html = ''; 
      $.each(pager.data,function(i,p){
        html += `
          <li>
              <a href=""><img src="${p.pic}"></a>
              <p>￥${p.price}</p>
              <h1><a href="">${p.pname}</a></h1>
              <div>
                  <a href="" class="contrast"><i></i>对比</a>
                  <a href="" class="p-operate"><i></i>关注</a>
                  <a href="${p.pid}" class="addcart"><i></i>加入购物车</a>
              </div>
          </li>
        `;
      });
      $('.plist').html(html);
      //根据返回的分页数据，动态创建分页条内容
      var html = '';
	  if (pager.pageNum-2>0)
	  {
	  html += `<li><a href="${pager.pageNum-2}">${pager.pageNum-2}</a></li> `;
	  }
	  if (pager.pageNum-1>0)
	  {
      html += `<li><a href="${pager.pageNum-1}">${pager.pageNum-1}</a></li> `;
	  }
      html += `<li class="active"><a href="#">${pager.pageNum}</a></li> `;
	  if (pager.pageNum+1<pager.pageCount)
	  {
      html += `<li><a href="${pager.pageNum+1}">${pager.pageNum+1}</a></li> `;
	  }
	  if (pager.pageNum+2<pager.pageCount)
	  {
      html += `<li><a href="${pager.pageNum+2}">${pager.pageNum+2}</a></li> `;
	  }
      $('.pager').html(html);
    }
  });
};

$('#plist').on('click','.addcart',function(e){
	e.preventDefault();
	var pid=$(this).attr('href');
	$.ajax({
		type:'POST',
		url:'data/cart_add_new.php',
		data:{'productId':pid,'uname':sessionStorage['uname']},
		success:function(obj){
			var count=obj.count;
			alert('添加成功！该商品购物车数量'+count);
		}
	})
});

$('#header').on('click','#settle_up',function(){
	location.href="shoppingcart.html?uname="+sessionStorage['uname'];
});

