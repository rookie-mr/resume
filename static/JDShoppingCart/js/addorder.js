$('#header').load('header.php');
$('#footer').load('footer.php');

if(!sessionStorage['uname']){
  location.href='productlist.html';
}

$('.payment-list li').click(function(){
  $(this).addClass('payment-item-selected').siblings('.payment-item-selected').removeClass('.payment-item-selected');
  var i=$('.payment-list li').index(this);
  $('input[name="payment"]').val(i+1);
});

$(function(){
  $.ajax({
    url:'data/cart_detail.php',
    data:{uname:sessionStorage['uname']},
    success:function(detailList){
      var html='';
      $.each(detailList,function(i,d){
        html+=`
					<div class="goods-item">
            <div class="p-img">
                <a target="_blank" href=""><img src="images/phone/phone_01.jpg" alt=""></a>
            </div>
            <div class="p-name">
                <a href="" target="_blank">
                    小米 Note 全网通 白色 移动联通电信4G手机 双卡双待
                </a>
            </div>
            <div class="p-price">
                <strong class="jd-price">￥1199.00</strong>
                <span class="p-num">x1</span>
                <span class="p-state">有货</span>
            </div>
          </div>
					`;
      });
      $('.goods-items').html(html);
    }
  })
});

$('.checkout-submit').click(function(){
  $('input[name="uname"]').val(sessionStorage['uname']);

})
