export var checkPhone = function(rule,value,callback){
  var tel = /^(((0\d{2,3})?-?\d{7,8})|(1[3456789]\d{9}))$/;
  if(!value){
    return callback("请输入手机号或固机")
  }
  if(!tel.test(value)){
    return callback("号码格式不正确")
  }
  callback()
};
export var checkPhone1 = (rule,value,callback) => {
  if(!value){
    callback(new Error('×请输入手机号'));
  }else if(!value.match(/^[1][3,4,5,6,7,8,9][0-9]{9}$/)){
    callback(new Error('×请输入正确的手机号!'));
  }else{
    callback();
  }
};
export var checkPhone2 = function(rule,value,callback){
  var tel = /^((0\d{2,3})?-?\d{7,8})$/;
  if(!value){
    return callback("请输入固机号码")
  }
  if(!tel.test(value)){
    return callback("固话格式不正确")
  }
  callback()
};
export var checkIdcard = function(rule,value,callback){
  var isIDCard1 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
  if(!value){
    return callback("请输入身份证号")
  }
  if(!isIDCard1.test(value)){
    return callback("身份证号格式不正确")
  }
  callback()
};
export var checkStr = (rule,value,callback) => {
  var reg = /^[A-Za-z0-9]{6,20}$/;
  if(!value){
    callback("请输入")
  }
  if(!reg.test(value)){
    callback("格式不正确，只能输入6-20位数字和字母")
  }
  callback()
};
export var checkBankCard = function(rule,value,callback){
  var reg = /^([1-9]{1})(\d{15,18})$/;
  if(!value){
    return callback("请输入银行卡号")
  }
  let v = value.replace(/\D/g,"");
  if(!reg.test(v)){
    return callback("银行卡号格式不正确")
  }
  callback()
};
export var checkEmail = function(rule,value,callback){
  var reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
  if(!value){
    return callback("请输入邮箱")
  }
  if(!reg.test(value)){
    return callback("邮箱格式不正确")
  }
  callback()
};
export var filterStr = function(str){
  if(str){
    return str.replace("'","")
  }
  return str
};
