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
//�����˵� ΪclassΪapp_jd��Ԫ�� ���������¼�
function showSub() { 
    //���庯��showSub
    //�ҵ�id��_itrms��β��Ԫ����������ʾ
    this.$("[id$='_items']").style.display = "block";
    //���ҵ�ǰԪ���µ�bԪ���Աߵ�a ������classΪhover
    this.$("b+a").className = "hover";
}
function hideSub() {
    //�ҵ�id��_items��β��Ԫ�� ����������
    this.$("[id$='_items']").style.display = "none";
    //���ҵ�ǰԪ���µ�bԪ���Աߵ�a �����class
    this.$("b+a").className = "";
}
//ȫ����Ʒ����
$("#category").on("mouseover", function () {
    $("#cate_box").style.display = "block";
});
$("#category").on("mouseout", function () {
    $("#cate_box").style.display = "none";
});
//Ϊid category��Ԫ�ذ������룺
$("#cate_box").on("mouseover", function (e) {
    var target = e.target;
    //���target��=this
    if (target != this) {
        while (target.parentNode != this) {
            target = target.parentNode;
        }
        target.$(".sub_cate_box").style.display = "block";
        target.firstElementChild.className = "hover";
    }
});
//����idΪcata_box��Ԫ�ذ�����Ƴ��¼�
$("#cate_box").on("mouseout", function (e) {
    var target = e.target;
    //���target��=this
    if (target != this) {
        while (target.parentNode != this) {
            target = target.parentNode;
        }
//Ϊid  cate_box��Ԫ�� ����������
        target.$(".sub_cate_box").style.display = "nome";
        target.firstElementChild.className = "";
    }
});

//��ǩҳ
//Ϊid product_datail�µ�classΪmain_tabs��Ԫ�ذ󶨵����¼���
$("#product_detail>.main_tabs").on("click",
  function(e){
  var target=e.target;//���target
  if(target!=this){//���target����this
      //���target��a���ͻ����丸Ԫ��
      target.nodeName=="A"&&
                (target=target.parentNode);
      //���target��class����current
      if(target.className!="current"){
          //�ҵ�idΪproduct_detail�µ�classΪmain_tabs�µ�classΪcurrent��Ԫ�أ������class
          $("#product_detail>.main_tabs>.current")
            .className="";
          //����target��classΪcurrent
          target.className="current";

          //�ҵ�idΪproduct_detail�µ�classΪshow��ֱ����Ԫ��,�����ڱ���show��
          var show=$("#product_detail>.show");
          //���show��Ϊnull���������class
          show!=null&&(show.className="");
          var i=target.dataset.i;
          //���target��i���Բ���-1
          if(i!=-1){
              //�ҵ�idΪproduct_detail�µ�id��product_��ͷ��Ԫ�أ�ȡ��i����������classΪshow
              $("#product_detail>[id^='product_']")[i]
                .className="show";
          }
      }
  }
  })

/*�Ŵ�*/
var zoom = {
    OFFSET: 0,//������ʼ��left
    LIWIDTH: 0,//����ÿ��li�Ŀ��
    moved: 0,//�����Լ����Ƶ�li����
    MSIZE:0,//
    MAXTOP:0,
    MAXLEFT:0,
    init: function () {
        //����idΪicon_list��ul ������������ʽ�е�left ������OFFSET
        this.OFFSET =parseFloat(getComputedStyle($("#icon_list")).left);
        //����idΪicon_list�µĵ�һ��li ��������������width ������LIWIDTH��
        this.LIWIDTH = parseFloat(getComputedStyle
            ($("#icon_list>li:first-child")).width);
        //����idΪmask��Ԫ�� ��������ʽ����widt
        this.MSIZE = parseFloat(getComputedStyle($("#mask")).width);
        //���idΪsuperMask��Ԫ�ؼ����Ŀ�
        var width = parseFloat(getComputedStyle($("#superMask")).width);
        this.MAX = width - this.MSIZE;
        $("#preview>h1>a").each(function (elem) {
            elem.on("click",this.move.bind(this))
        }.bind(this));
       
        $("#icon_list").on("mouseover", this.changeMImg);
        //Ϊid superMask��Ԫ�ذ��������¼� ��idΪmask��Ԫ����ʾ

        $("#superMask").on("mouseover", function () {
            $("#mask").style.display = "block";
            var src = $("#mImg").src;
            var i = src.lastIndexOf(".");
            $("#largeDiv").style.backgroundImage =
         "url(" + src.slice(0, i - 1) + "l"+ src.slice(i)+ ")";
            $("#largeDiv").style.display = "block";
        });
        //Ϊid superMask��Ԫ�ذ�����Ƴ��¼� ��idΪmask��Ԫ������
        $("#superMask").on("mouseout", function () {
            $("#mask").style.display = "none";
            $("#largeDiv").style.display = "none";
        });
        //Ϊ
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
        //���������Ը�Ԫ�ظ�Ԫ�ص�x�����y����
        var x=e.offsetX;
        var y = e.offsetY;
        //����top��y-MSIZE/2
        var top=y-this.MSIZE/2;
        top = top < 0 ? 0 : top > this.MAX ? this.MAX : top;
        //����left��x-MSIZE/2
        var left = x - this.MSIZE / 2;
        left = left < 0 ? 0 : left > this.MAX ? this.MAX : left;
        //����idΪmask��Ԫ�ص�topΪtop
        $("#mask").style.top = top + "px";
        //����idΪmask��Ԫ�ص�leftΪleft
        $("#mask").style.left = left + "px";
        //�޸�idΪlargeDiv��Ԫ�صı���λ��
        $("#largeDiv").style.backgroundPosition = -left * 16/7+ "px " + (-top * 16/7) + "px";
        
    },
        //����each������function��elem��{Ϊelem�󶨵����¼�Ϊ��ǰ�����move����}
    move: function (e) {
        //��moved+1
        //����idΪicon_list��ul��leftΪ��LIWIDTH*moved+OFFSET
        var target = e.target;
        if (target.className.indexOf("disabled") == -1) { 
        this.moved+=(target.className.indexOf("forward")!=-1?1:-1);
        $("#icon_list").style.left=-this.LIWIDTH*this.moved+this.OFFSET+"px";
        }
        this.checkA();
    },
    checkA: function () {
        if (this.moved == 0) {//���movedΪ0
            //����class������backward��ͷ��Ԫ�ص�classΪ��backward_disabled��
            $("[class^='backward']").className="backward_disabled";
        } else if ($("#icon_list>li").length - this.moved == 5) {
            //���� ���idΪicon_list�µ�����li�ĸ���-moved==5
            //����class�ǹ�������forward��ͷ��Ԫ�ص�classΪ��forward����disabled��
            $("[class^='forward']").className = "forward_disabled";
        } else {//����
            //����class������backward��ͷ������ŭ��classΪbackward
            $("[class^='backward']").className = "backward";
            //����class������forward��ͷ��Ԫ�ص�classΪ��class��Ϊforward
            $("[class^='forward']").className = "forward";
        }
    }
}
zoom.init();


