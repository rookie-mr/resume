window.$ = HTMLElement.prototype.$ = function (selector) {
        var r=(this==window?document:this).querySelectorAll(selector);
        return r.length == 0 ? null : r.length == 1 ? r[0] : r;
}
HTMLElement.prototype.on = function (ename, fun) {
    this.addEventListener(ename, fun);
}

NodeList.prototype.each = function (callback) {
    for (var i = 0; i < this.length; i++) {
        callback(this[i]);
    }
}
$(".app_jd,.service").each(function (elem) {
    elem.on("mouseover", showSub);
    elem.on("mouseout", hideSub);
})
//顶部菜单 为class为app_jd的元素 绑定鼠标进入事件
function showSub() { 
    //定义函数showSub
    //找到id以_itrms结尾的元素设置其显示
    this.$("[id$='_items']").style.display = "block";
    //查找当前元素下的b元素旁边的a 设置其class为hover
    this.$("b+a").className = "hover";
}
function hideSub() {
    //找到id以_items结尾的元素 设置其隐藏
    this.$("[id$='_items']").style.display = "none";
    //查找当前元素下的b元素旁边的a 清除其class
    this.$("b+a").className = "";
}
//全部商品分类
$("#category").on("mouseover", function () {
    $("#cate_box").style.display = "block";
});
$("#category").on("mouseout", function () {
    $("#cate_box").style.display = "none";
});
//为id category的元素绑定鼠标进入：
$("#cate_box").on("mouseover", function (e) {
    var target = e.target;
    //如果target！=this
    if (target != this) {
        while (target.parentNode != this) {
            target = target.parentNode;
        }
        target.$(".sub_cate_box").style.display = "block";
        target.firstElementChild.className = "hover";
    }
});
//查找id为cata_box的元素绑定鼠标移除事件
$("#cate_box").on("mouseout", function (e) {
    var target = e.target;
    //如果target！=this
    if (target != this) {
        while (target.parentNode != this) {
            target = target.parentNode;
        }
//为id  cate_box的元素 设置其隐藏
        target.$(".sub_cate_box").style.display = "nome";
        target.firstElementChild.className = "";
    }
});

//标签页
//为id product_datail下的class为main_tabs的元素绑定单机事件：
$("#product_detail>.main_tabs").on("click",
  function(e){
  var target=e.target;//获得target
  if(target!=this){//如果target不是this
      //如果target是a，就换成其父元素
      target.nodeName=="A"&&
                (target=target.parentNode);
      //如果target的class不是current
      if(target.className!="current"){
          //找到id为product_detail下的class为main_tabs下的class为current的元素，清除其class
          $("#product_detail>.main_tabs>.current")
            .className="";
          //设置target的class为current
          target.className="current";

          //找到id为product_detail下的class为show的直接子元素,保存在变量show中
          var show=$("#product_detail>.show");
          //如果show不为null，才清除其class
          show!=null&&(show.className="");
          var i=target.dataset.i;
          //如果target的i属性不是-1
          if(i!=-1){
              //找到id为product_detail下的id以product_开头的元素，取第i个，设置其class为show
              $("#product_detail>[id^='product_']")[i]
                .className="show";
          }
      }
  }
  })

/*放大镜*/
var zoom = {
    OFFSET: 0,//保存起始的left
    LIWIDTH: 0,//保存每个li的宽度
    moved: 0,//保存以及左移的li个数
    MSIZE:0,//
    MAXTOP:0,
    MAXLEFT:0,
    init: function () {
        //查找id为icon_list的ul 获得其计算后的样式中的left 保存在OFFSET
        this.OFFSET =parseFloat(getComputedStyle($("#icon_list")).left);
        //查找id为icon_list下的第一个li 获得其计算后的样中width 保存在LIWIDTH中
        this.LIWIDTH = parseFloat(getComputedStyle
            ($("#icon_list>li:first-child")).width);
        //查找id为mask的元素 计算后的样式中我widt
        this.MSIZE = parseFloat(getComputedStyle($("#mask")).width);
        //获得id为superMask的元素计算后的宽
        var width = parseFloat(getComputedStyle($("#superMask")).width);
        this.MAX = width - this.MSIZE;
        $("#preview>h1>a").each(function (elem) {
            elem.on("click",this.move.bind(this))
        }.bind(this));
       
        $("#icon_list").on("mouseover", this.changeMImg);
        //为id superMask的元素绑定鼠标进入事件 让id为mask的元素显示

        $("#superMask").on("mouseover", function () {
            $("#mask").style.display = "block";
            var src = $("#mImg").src;
            var i = src.lastIndexOf(".");
            $("#largeDiv").style.backgroundImage =
         "url(" + src.slice(0, i - 1) + "l"+ src.slice(i)+ ")";
            $("#largeDiv").style.display = "block";
        });
        //为id superMask的元素绑定鼠标移除事件 让id为mask的元素隐藏
        $("#superMask").on("mouseout", function () {
            $("#mask").style.display = "none";
            $("#largeDiv").style.display = "none";
        });
        //为
        $("#superMask").on("mousemove", this.maskMove.bind(this));
    },
   
    changeMImg: function (e) {
        var target = e.target;
        if (target.nodeName="IMG") {
            var i = target.src.lastIndexOf(".");
            $("#mImg").src = target.src.slice(0, i) + "-m" + target.src.slice(i)
        }
    },
    maskMove:function(e){
        //获得数遍相对父元素父元素的x坐标和y坐标
        var x=e.offsetX;
        var y = e.offsetY;
        //计算top：y-MSIZE/2
        var top=y-this.MSIZE/2;
        top = top < 0 ? 0 : top > this.MAX ? this.MAX : top;
        //计算left：x-MSIZE/2
        var left = x - this.MSIZE / 2;
        left = left < 0 ? 0 : left > this.MAX ? this.MAX : left;
        //设置id为mask的元素的top为top
        $("#mask").style.top = top + "px";
        //设置id为mask的元素的left为left
        $("#mask").style.left = left + "px";
        //修改id为largeDiv的元素的背景位置
        $("#largeDiv").style.backgroundPosition = -left * 16/7+ "px " + (-top * 16/7) + "px";
        
    },
        //调用each方法：function（elem）{为elem绑定单击事件为当前对象的move方法}
    move: function (e) {
        //将moved+1
        //设置id为icon_list的ul的left为：LIWIDTH*moved+OFFSET
        var target = e.target;
        if (target.className.indexOf("disabled") == -1) { 
        this.moved+=(target.className.indexOf("forward")!=-1?1:-1);
        $("#icon_list").style.left=-this.LIWIDTH*this.moved+this.OFFSET+"px";
        }
        this.checkA();
    },
    checkA: function () {
        if (this.moved == 0) {//如果moved为0
            //设置class属性以backward开头的元素的class为“backward_disabled”
            $("[class^='backward']").className="backward_disabled";
        } else if ($("#icon_list>li").length - this.moved == 5) {
            //否则 如果id为icon_list下的所有li的个数-moved==5
            //设置class是公益性以forward开头的元素的class为“forward——disabled”
            $("[class^='forward']").className = "forward_disabled";
        } else {//否则
            //设置class属性以backward开头的雅俗怒的class为backward
            $("[class^='backward']").className = "backward";
            //设置class属性以forward开头的元素的class为“class”为forward
            $("[class^='forward']").className = "forward";
        }
    }
}
zoom.init();


