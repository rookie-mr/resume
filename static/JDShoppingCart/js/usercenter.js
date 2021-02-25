$('#header').load('header.php', function () {
  $('#welcome').html('欢迎回来' + sessionStorage['uname']);
});
$('#footer').load('footer.php');

$('.affix ul li a').click(function (e) {
  e.preventDefault();
  $(this).parent().addClass('active').siblings().removeClass('active');
  var id = $(this).attr('href');
  $(id).addClass('active').siblings().removeClass('active');
})

$(
  $.ajax({
    type: 'GET',
    url: 'data/buy_stat.php',
    data: {uname: sessionStorage['uname']},
    //success:function(list){
    //  var w=800;
    //  var h=500;
    //  var count=list.length;
    //  var padding=80;
    //  var barWidth=(w-2*padding)/(2*count+1);
    //  var yPointCount=5;
    //  var yPointSpacing=(h-2*padding)/(yPointCount);
    //  var origin={
    //    x:padding,y:h-padding
    //  };
    //  var xEnd={x:w-padding,y:h-padding};
    //  var yEnd={x:padding,y:padding};
    //  var canvas=document.getElementById('canvas-buy-stat');
    //  canvas.width=800;
    //  canvas.height=500;
    //  var ctx=canvas.getContext('2d');
    //  ctx.baseline='bottom';
    //  ctx.font='12px SimHei';
    //  ctx.beginPath();
    //  ctx.moveTo(origin.x,origin.y);
    //  ctx.lineTo(xEnd.x,xEnd.y);
    //  ctx.lineTo(xEnd.x-10,xEnd.y-5);
    //  ctx.moveTo(xEnd.x,xEnd.y);
    //  ctx.lineTo(xEnd.x-10,xEnd.y+5);
    //  for(var i=0;i<count;i++){
    //    var x=origin.x+(2*i+1)*barWidth;
    //    var y=origin.y;
    //    ctx.moveTo(x,y);
    //    ctx.lineTo(x,y-5);
    //    var txt=list[i].label;
    //    var textWidth=ctx.measureText(txt).width;
    //    ctx.fillText(txt,x-textWidth/2,y+14);
    //  }
    //  ctx.moveTo(origin.x,origin.y);
    //  ctx.lineTo(yEnd.x,yEnd.y);
    //  ctx.lineTo(yEnd.x-5,yEnd.y+10);
    //  ctx.moveTo(yEnd.x,yEnd.y);
    //  ctx.lineTo(yEnd.x+5,yEnd.y+10);
    //  ctx.stroke();
    //  for(var i=0;i<count;i++){
    //    var barHeight=(list[i].value)*(h-2*padding)/(Math.max(list[i].value));
    //    var x=origin.x+(2*i+1)*barWidth;
    //    var y=origin.y-barHeight;
    //    ctx.strokeRect(x-barWidth/2,y,barWidth,barHeight);
    //  }
    //}
    success: function (list) {
      var fc = new FusionCharts({
        type: 'column3d',
        width: '800',
        height: '500',
        dataSource: {
          data: list
        }
      });
      fc.render('container-buy-stat-svg');
    }
  }),
  $.ajax({
    type: 'GET',
    url: 'data/lottery_stat.php',
    data: {uname: sessionStorage['uname']},
    success: function (result) {
      if (result.leftCount <= 0) {
        alert('剩余抽奖次数为0');
        return;
      }
      $('#bt-lottery').html(`开始抽奖(总次数：${result.totalCount},已使用次数：${result.usedCount},剩余次数：${result.leftCount})`).prop('disabled', false);
      drawLottery();
      function drawLottery() {
        var progress = 0;
        var pan = new Image();
        pan.src='img/pan.png';
        pan.onload=function(){
          progress+=80;
          if(progress==100){startDraw();}
        }
        var pin = new Image();
        pin.src="img/pin.png";
        pin.onload=function(){
          progress+=20;
          if(progress==100){startDraw();}
        }
        function startDraw(){
          var canvas=document.querySelector('#canvas-lottery');
          canvas.width=pan.width;
          canvas.height=pan.height;
          var ctx=canvas.getContext('2d');
          ctx.drawImage(pan,0,0);
          ctx.drawImage(pin,canvas.width/2-pin.width/2,canvas.width/2-pin.height/2);
          $('#bt-lottery').one('click',function(){
            var duration=Math.random()*4000+5000;
            console.log(duration);
            var last=0;
            var degree=0;
            ctx.translate(canvas.width/2,canvas.height/2);
            var timer=setInterval(function(){
              degree+=5;
              degree%=360;
              ctx.rotate(5*Math.PI/180);
              ctx.drawImage(pan,-pan.width/2,-pan.height/2);
              ctx.rotate(-5*Math.PI/180);
              ctx.drawImage(pin,-pin.width/2,-pin.height/2);
              last+=16.7;
              if(last>=duration){
                clearInterval(timer);
                ctx.translate(-canvas.width/2,-canvas.height/2);
                var level=0;
                if(degree>=270&&degree<300){
                  level=1;
                }else if((degree>=0&&degree<30)||(degree>=210&&degree<300)){
                  level=2;
                }else if((degree>=90&&degree<120)||(degree>=150&&degree<180)||(degree>=300&&degree<330)){
                  level=3;
                }else{
                  level=4;
                }
              }
            },16.7)
          });
        }
      }
    }
  })
)
