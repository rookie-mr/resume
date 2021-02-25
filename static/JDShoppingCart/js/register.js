uname.onblur = function(){
  if(this.validity.valueMissing){
    this.nextElementSibling.innerHTML = '用户名不能为空';
    this.nextElementSibling.className = 'msg-error';
    this.setCustomValidity('用户名不能为空');
  }else if(this.validity.tooShort){
    this.nextElementSibling.innerHTML = '用户名不能少于6位';
    this.nextElementSibling.className = 'msg-error';
    this.setCustomValidity('用户名不能少于6位');
  }else {
    this.nextElementSibling.innerHTML = '用户名格式正确';
    this.nextElementSibling.className = 'msg-success';
    this.setCustomValidity('');
  }
}
uname.onfocus = function(){
  this.nextElementSibling.innerHTML = '用户名长度在6到9位之间';
  this.nextElementSibling.className = 'msg-default';
}

/*3.对邮箱地址进行验证*/
umail.onblur = function(){
  if(this.validity.valueMissing){
    this.nextElementSibling.innerHTML = '邮箱不能为空';
    this.nextElementSibling.className = 'msg-error';
    this.setCustomValidity('邮箱不能为空');
  }else if(this.validity.typeMismatch){
    this.nextElementSibling.innerHTML = '邮箱格式不正确';
    this.nextElementSibling.className = 'msg-error';
    this.setCustomValidity('邮箱格式不正确');
  }else {
    this.nextElementSibling.innerHTML = '邮箱格式正确';
    this.nextElementSibling.className = 'msg-success';
    this.setCustomValidity('');
  }
}
umail.onfocus = function(){
  this.nextElementSibling.innerHTML = '请输入合法的邮箱地址';
  this.nextElementSibling.className = 'msg-default';
}

$('#bt-register').click(function(){
  var data=$('#form-register').serialize();
  $.ajax({
    type:'POST',
    url:'data/user_add.php',
    data:data,
    success:function(result){
      if(result.msg=='succ'){
        alert('注册成功！');
        location.href='productlist.html';
      }else{
        alert('注册失败！');
      }
    }
  });
})