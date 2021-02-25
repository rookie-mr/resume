/*广告图片数组*/
var imgs=[
	{"i":0,"img":"images/index/banner_01.jpg"},
    {"i":1,"img":"images/index/banner_02.jpg"},
    {"i":2,"img":"images/index/banner_03.jpg"},
    {"i":3,"img":"images/index/banner_04.jpg"},
    {"i":4,"img":"images/index/banner_05.jpg"},
];
var slider={
	LIWIDTH:0,//保存每个li的宽度，其实就是#slider的初始宽
	DURATION:800,//动画的总时间
	WAIT:3000,//自动轮播之间的等待时间
	timer:null,
	canAuto:true,
	init:function(){
		this.LIWIDTH=parseFloat($("#slider").css("width"));
		this.updateView();
		//为id为indexs的ul添加鼠标进入世事件代理，只有不是hover的li才能响应事件
		$("#indexs").on("mouseover","li:not(.hover)",
			function(e){
			//获得目标元素$target
			var $target=$(e.target);
			//调用move方法，传入要移动的个数
				//目标元素的内容-目标元素的兄弟中class为hover的li的内容
			this.move($target.html()-$target.siblings(".hover").html());
		}.bind(this));
		
		$("#slider").hover(function(){this.canAuto=false;}.bind(this),function(){this.canAuto=true;}.bind(this))
		this.autoMove();
	},
	autoMove:function(){
		//启动一次性定时器
		this.timer=setTimeout(function(){
			if (this.canAuto)
			{
				this.move(1);
			}else{
				this.autoMove();	
			}
		}.bind(this),this.WAIT);
	},
	move:function(n){
		$("#imgs").stop(true);
		this.timer=null;
		  
		//获得#imgs当前的left，转为浮点数
		var left=parseFloat($("#imgs").css("left"));
		if (n<0)
		{
			n*=-1;
			imgs=imgs.splice(imgs.length-n,n).concat(imgs);
			this.updateView();
			$("#imgs").css("left",left-n*this.LIWIDTH);
			$("#imgs").animate({left:"0"},this.DURATION,this.autoMove.bind(this));
		}else{
			$("#imgs").animate({left:-n*this.LIWIDTH+"px"},this.DURATION,this.endMove.bind(this,n));
		}
	},
	endMove:function(n){
		//删除数组开头的n个元素，再拼到结尾
		imgs=imgs.concat(imgs.splice(0,n));
		this.updateView();//更新页面
		$("#imgs").css("left",0);//设置#imgs的left为0
		this.autoMove();
	},
	updateView:function(){//将数组中的元素更新到页面
		for (var i=0,html="",idxs="";i<imgs.length;i++)
		{
			html+="<li><img src='"+imgs[i].img+"'></li>";
			idxs+="<li>"+(i+1)+"</li>";
		}
		//设置id为imgs的内容为html，设置其宽为LIWIDTH*imgs的元素个数
		$("#imgs").html(html).css("width",this.LIWIDTH*imgs.length);
		//设置id为indexs的内容为idxs
		$("#indexs").html(idxs);
		//获得#indexs下的和imgs中第一个元素的i属性对应的li，设置其class为hover，选择兄弟中的class为hover的li，清除其class
		$("#indexs>li:eq("+imgs[0].i+")").addClass("hover").siblings(".hover").removeClass("hover");
	},
}
	slider.init();