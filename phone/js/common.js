// 外网正式服务器的
// var serverPath="http://58.63.114.226:8080/zhanghui/"; 
//内网的
//var serverPath="http://10.10.236.215:8080/jeezz-single/";

//外网测试式服务器的
var serverPath="http://58.63.114.227:8080/jeezz-single/";

// var serverPath="http://10.135.16.100:9080/single/"; 
//道海本地的eclipse
//var serverPath = "http://10.135.16.105:9080/zhanghui/";
// var serverPath = "http://10.135.16.105:9080/single/";
//闪龙本地的eclipse
 //var serverPath="http://10.10.11.120:9080/single/";
//var serverPath = 'http://10.135.16.104:9080/single/'
//后台人员本地服务器
 // var serverPath = "http://10.135.16.102:9080/single/";
var chatRecentRefresh=false; 
//是否是第一次启动app
var isResume=false;

var _thisyear = (new Date()).getFullYear();
//添加请求头，把sessionid通过头信息回传。
//在ajax加参数 beforeSend : addHeader,

function addHeader(xhr) {
    var sessionId = '',nowTime=(new Date()).getTime(),ticket='';
    var storage = window.localStorage;
    xhr.setRequestHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8');
    xhr.setRequestHeader('Accept-Encoding', 'gzip, deflate, sdch');
    xhr.setRequestHeader('Accept-Language', 'zh-CN,zh;q=0.8');
    xhr.setRequestHeader('Connection', 'keep-alive');
    if (storage){
        sessionId = appcan.locStorage.getVal('sessionId');
    }
    if (sessionId != "") {
        sessionId = "JSESSIONID=" + sessionId +";type=app";
        sessionId = sessionId.replace(/\|[0-9]{10}\|/,'|'+parseInt(nowTime/1000)+'|');
        xhr.setRequestHeader('Cookie', sessionId);
    }
    xhr.setRequestHeader('Upgrade-Insecure-Requests', '1');
    xhr.setRequestHeader('User-Agent', 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36');
}
/**
 * json 中必须有path 和 data 参数。 
 * @param {Object} json
 * @param {Object} cb(data,success) 第一个参数是返回的数据或者是错误数据，第二个是success or  error
 */
function ajaxRequest(json,cb){
    var index;
    if(!json.hasOwnProperty('layer')){
             index=layerLoading();
    }else{
        if(json.layer){
             index=layerLoading();
        }
    }
    json.data.token=appcan.locStorage.getVal("token");
    //json.data.token="8a8a6c5764f496b90164f857912a0026@*@fRCARzxxmpHTHPEpdJrBIw";
    appcan.request.ajax({
        url: json.path,
        type: "POST",
        //beforeSend: addHeader,
        data: json.data,
        dataType: 'application/json',
        timeout:40000,
        success: function(data) {
            var requestJson=JSON.parse(data);
            if(!requestJson.success && requestJson.state==3){
                layerRemove(index);
                //loginRequest(json,index,cb);
               
                if(!json.hasOwnProperty('layer')){
                        loginRequest(json,index,cb);
                }else{
                    if(json.layer){
                        loginRequest(json,index,cb);
                    }else{
                        loginRequest(json,null,cb);
                    }
                }
            }else{
                if(requestJson.success){
                    if(!json.hasOwnProperty('layer')){
                        layerRemove(index);
                    }else{
                        if(json.layer){
                            layerRemove(index);
                        }
                    }
                    cb(requestJson,"success");
                }else{
                    if(!json.hasOwnProperty('layer')){
                        layerRemove(index);
                    }else{
                        if(json.layer){
                            layerRemove(index);
                        }
                    }
                    cb(requestJson,"error");
                }
                
                
            }
        },
        error: function(err, e, errMsg, error) {
            if(json.hasOwnProperty("layerErr")){
                if(json.layerErr){
                    layerToast('网络错误，请检查网络环境',2);
                }
            }else{
                layerToast('网络错误，请检查网络环境',2);
            }
            layerRemove(index);
            //弹出接口访问失败原因
            
            var requestJson={
                'obj':{'state':'4'},
                'msg':'网络错误，请检查网络环境',
                'success':false
            };
            cb(requestJson,"error");
        }
    })
}



/**
 * token失效之后重新自动登录一下。在发送请求请求原来的接口。
 * @param {Object} json　原接口的参数，
 * @param {Object} cb　　原接口的返回方法
 */

function loginRequest(json,index,cb){
    var uname = appcan.locStorage.getVal("uname");
    var upswd = appcan.locStorage.getVal("upswd");
    //这个是获取app的信息，其中有版本号
    var appInfo = uexWidgetOne.getCurrentWidgetInfo();
    var version;
    if(!isDefine(appInfo)){
        version="01.00.0002";
    }else{
            version=appInfo.version;
    }
    //平台Android、iOS
    var platformName=appcan.widgetOne.getPlatformName();
    var platForm;
    if(platformName=="android"){
        platForm=1;
    }else{
        platForm=0;
    }
    var imei= uexDevice.getInfo('10');
    appcan.request.ajax({
            url: serverPath+'focUserController.do?appLogin',
            type: "POST",
            data: {
                    'userName':uname,
                    'password':upswd,
                    'platform':platForm,
                    'imei':imei,
                    'method':'applogin',
                    'version':version
            },
            dataType: 'application/json',
            timeout:50000,
            success: function(data) {
                var j=JSON.parse(data);
                if(j.success){
                    appcan.locStorage.setVal("token",j.obj.token);
                    ajaxRequest(json,function(data,e){
                        if(isDefine(index)){
                            layerRemove(index);
                        }
                        cb(data,e);
                    });
                }else{
                    
                    if(isDefine(index)){
                            layerRemove(index);
                    }
                    //弹出接口访问失败原因
                    if(json.hasOwnProperty("layerErr")){
                        if(json.layerErr){
                            layerToast('网络错误，请检查网络环境',2);
                        }
                    }else{
                        layerToast('网络错误，请检查网络环境',2);
                    }
                    cb(j,"error");
                }
            },
            error: function(err, e, errMsg, error) {
                 
                if(isDefine(index)){
                            layerRemove(index);
                }
                if(json.hasOwnProperty("layerErr")){
                    if(json.layerErr){
                        layerToast('网络错误，请检查网络环境',2);
                    }
                }else{
                    layerToast('网络错误，请检查网络环境',2);
                }
                //弹出接口访问失败原因
                var requestJson={
                    'obj':{'state':'4'},
                    'msg':'网络错误，请检查网络!',
                    'success':false
                };
                 cb(requestJson,"error");
            }
        })
}
/* 
 * state 1 success false　 : 表示用户名密码错误　　　　　这个是登录接口返回的
 * state 2 success false  : 表示用户已在其他设备登录        这个是登录接口返回的
 * state 3 success false  : token 失效。 所有接口都会有这个状态，除了登录接口
 * state 4 success false  : 网络错误，请检查网络
 * 
 */


/*! layer mobile-v2.0 弹层组件移动版 License LGPL http://layer.layui.com/mobile By 贤心 */
;!function(a){"use strict";var b=document,c="querySelectorAll",d="getElementsByClassName",e=function(a){return b[c](a)},f={type:0,shade:!0,shadeClose:!0,fixed:!0,anim:"scale"},g={extend:function(a){var b=JSON.parse(JSON.stringify(f));for(var c in a)b[c]=a[c];return b},timer:{},end:{}};g.touch=function(a,b){a.addEventListener("click",function(a){b.call(this,a)},!1)};var h=0,i=["layui-m-layer"],j=function(a){var b=this;b.config=g.extend(a),b.view()};j.prototype.view=function(){var a=this,c=a.config,f=b.createElement("div");a.id=f.id=i[0]+h,f.setAttribute("class",i[0]+" "+i[0]+(c.type||0)),f.setAttribute("index",h);var g=function(){var a="object"==typeof c.title;return c.title?'<h3 style="'+(a?c.title[1]:"")+'">'+(a?c.title[0]:c.title)+"</h3>":""}(),j=function(){"string"==typeof c.btn&&(c.btn=[c.btn]);var a,b=(c.btn||[]).length;return 0!==b&&c.btn?(a='<span yes type="1">'+c.btn[0]+"</span>",2===b&&(a='<span no type="0">'+c.btn[1]+"</span>"+a),'<div class="layui-m-layerbtn">'+a+"</div>"):""}();if(c.fixed||(c.top=c.hasOwnProperty("top")?c.top:100,c.style=c.style||"",c.style+=" top:"+(b.body.scrollTop+c.top)+"px"),2===c.type&&(c.content='<i></i><i class="layui-m-layerload"></i><i></i><p>'+(c.content||"")+"</p>"),c.skin&&(c.anim="up"),"msg"===c.skin&&(c.shade=!1),f.innerHTML=(c.shade?"<div "+("string"==typeof c.shade?'style="'+c.shade+'"':"")+' class="layui-m-layershade"></div>':"")+'<div class="layui-m-layermain" '+(c.fixed?"":'style="position:static;"')+'><div class="layui-m-layersection"><div class="layui-m-layerchild '+(c.skin?"layui-m-layer-"+c.skin+" ":"")+(c.className?c.className:"")+" "+(c.anim?"layui-m-anim-"+c.anim:"")+'" '+(c.style?'style="'+c.style+'"':"")+">"+g+'<div class="layui-m-layercont">'+c.content+"</div>"+j+"</div></div></div>",!c.type||2===c.type){var k=b[d](i[0]+c.type),l=k.length;l>=1&&layer.close(k[0].getAttribute("index"))}document.body.appendChild(f);var m=a.elem=e("#"+a.id)[0];c.success&&c.success(m),a.index=h++,a.action(c,m)},j.prototype.action=function(a,b){var c=this;a.time&&(g.timer[c.index]=setTimeout(function(){layer.close(c.index)},1e3*a.time));var e=function(){var b=this.getAttribute("type");0==b?(a.no&&a.no(c.index),layer.close(c.index)):a.yes?a.yes(c.index):layer.close(c.index)};if(a.btn)for(var f=b[d]("layui-m-layerbtn")[0].children,h=f.length,i=0;h>i;i++)g.touch(f[i],e);if(a.shade&&a.shadeClose){var j=b[d]("layui-m-layershade")[0];g.touch(j,function(){layer.close(c.index,a.end)})}a.end&&(g.end[c.index]=a.end)},a.layer={v:"2.0",index:h,open:function(a){var b=new j(a||{});return b.index},close:function(a){var c=e("#"+i[0]+a)[0];c&&(c.innerHTML="",b.body.removeChild(c),clearTimeout(g.timer[a]),delete g.timer[a],"function"==typeof g.end[a]&&g.end[a](),delete g.end[a])},closeAll:function(){for(var a=b[d](i[0]),c=0,e=a.length;e>c;c++)layer.close(0|a[0].getAttribute("index"))}},"function"==typeof define?define(function(){return layer}):function(){var a=document.scripts,c=a[a.length-1],d=c.src,e=d.substring(0,d.lastIndexOf("/")+1);c.getAttribute("merge")||document.head.appendChild(function(){var a=b.createElement("link");return a.href=e+"../css/layer.css?2.0",a.type="text/css",a.rel="styleSheet",a.id="layermcss",a}())}()}(window);

/**
 *  防止点透, 遮罩出现时锁定body层
 *
 *  @param {string} bodyCls 加在body上的类, 用来锁定body
 */
var ModalHelper = (function(bodyCls) {
    var scrollTop;
    return {
        afterOpen: function() {
            scrollTop = document.documentElement.scrollTop||document.body.scrollTop;
            document.body.classList.add(bodyCls);
            document.body.style.top = -scrollTop + 'px'
        },
        beforeClose: function() {
            document.body.classList.remove(bodyCls);
            document.documentElement.scrollTop ? document.documentElement.scrollTop = scrollTop : document.body.scrollTop = scrollTop;
        }
    }
})('layui-m-fix');

/**
 *  添加提示框
 *
 *  @param {string} arg_1 显示文字
 *  @param {number} arg_2 停留时间(秒)
 */
function layerToast(arg_1, arg_2){
    var txt = arg_1 || 'Loading...',
        sec = arg_2 || 2;
    layer.open({
        content: txt
        ,time: sec
        ,skin: 'msg'
    });
}

/**
 *  添加loading遮罩
 * 
 *  @return{number} layerIndex 该遮罩的索引值
 */
function layerLoading(){
    //ModalHelper.afterOpen();
    var layerIndex = -1;
    layer.open({
        className: 'layer-a'
        ,type: 2
        ,shadeClose: false
        ,content: '加载中，请稍候……'
        ,success: function(elem){
            layerIndex = elem.getAttribute('index');
        }
    });
    return layerIndex;
}

/**
 *  移除某索引值对应的遮罩
 *
 *  @param {number} idx 该遮罩的索引值
 */
function layerRemove(idx){
    if(typeof idx == 'undefined') return;
    layer.close(idx);
    [].forEach.call(document.body.classList, function(n, i){
        if(n == 'layui-m-fix'){
            ModalHelper.beforeClose();
            return;
        }
    });
}
/**
 *  移除所有遮罩
 */
function layerRemoveAll(){
    layer.closeAll();
    [].forEach.call(document.body.classList, function(n, i){
        if(n == 'layui-m-fix'){
            ModalHelper.beforeClose();
            return;
        }
    });
}

/**
 *  复制对象
 *
 *  @param {object} oldObj 一个json对象
 * 
 *  @return{object} newObj oldObj的拷贝
 */
function cloneObj(oldObj) {
    if (typeof(oldObj) != 'object') return oldObj;
    if (oldObj == null) return oldObj;
    var newObj = new Object();
    for (var i in oldObj)
        newObj[i] = oldObj[i] instanceof Array ? oldObj[i].slice(0):cloneObj(oldObj[i]);
    return newObj;
};

/**
 *  扩展对象
 *
 *  @param {object} arguments[0], arguments[1], ... 各种json对象
 * 
 *  @return{object} temp 扩展后的json对象
 */
function extendObj() { //扩展对象
    var args = arguments;
    if (args.length < 2) return;
    var temp = cloneObj(args[0]); //调用复制对象方法
    for (var n = 1; n < args.length; n++) {
        for (var i in args[n]) {
            temp[i] = args[n][i];
        }
    }
    return temp;
}

/**
 *  一个alert框
 *
 *  @param {object} obj 各种配置项
 */
function addAlert(obj){
    ModalHelper.afterOpen();
    var defaults = {
        className: 'layer-a'
        ,content: '操作成功！'
        ,btn: '确定'
        ,shadeClose: false
    };
    
    if(!obj.hasOwnProperty('yes')){
        defaults.yes =  function(index){
            layerRemove(index);
        };
    }
    var option = extendObj(defaults, obj);
    layer.open(option);
}

/**
 *  一个confirm框
 *
 *  @param {object} obj 各种配置项
 */
function addConfirm(obj){
    ModalHelper.afterOpen();
    var defaults = {
        className: 'layer-a'
        ,content: '确定执行该操作吗？'
        ,btn: ['确定', '取消']
        ,shadeClose: false
    };
    if(!obj.hasOwnProperty('yes')){
        defaults.yes = function(index){
            layerRemove(index);
        };
    }
    if(!obj.hasOwnProperty('no')){
        defaults.no = function(index){
            layerRemove(index);
        };
    }
    var option = extendObj(defaults, obj);
    layer.open(option);
}

/**
 *  判断变量是否存在, 不为空, 不是未定义, 不是null
 *
 *  @param {object} para 需判断的变量
 * 
 *  @return{boolean}     是否变量
 */
function isDefine(para) {
    return !(typeof para=='undefined' || $.trim(para)=="" || para=="[]" || para==null || para==undefined || para=='undefined' || para=='[]'|| para=="null");
}
/**
 *  验证手机号格式
 *
 *  @param {number} str 手机号
 * 
 *  @return{boolean}    是否手机号
 */
function isPhoneNumber(str) {
    var pattern = /(13\d|14[57]|15[^4,\D]|17[13678]|18\d)\d{8}|170[0589]\d{7}/;
    return pattern.test(str);
}
/**
 *  验证密码格式, 必须由至少8位数字和字母组合而成, 不能为纯数字
 *
 *  @param {string} str 密码
 * 
 *  @return{boolean}    是否符合规范
 */
function isPassworkOK(str) {
    //var pattern = /(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,}/;
    var pattern = /(?![0-9]+$)[0-9A-Za-z]{8,}/;
    return pattern.test(str);
}
/**
 *  隐藏手机号中间4到7位号码, 变成星号
 *
 *  @param {string/number} str 手机号
 * 
 *  @return{string}     带星号的手机号
 */
function hidePhoneNumber(str) {
    return str.substring(0,3)+"****"+str.substring(8,11);
}
/**
 *  判断变量是否存在, 不为空, 不是未定义, 不是null
 *
 *  @param {object} para 需判断的变量
 * 
 *  @return{string} 如果符合为null '',[]等返回''否则返回它本身
 */
function replaceDefine(para) {
    if(typeof para=='undefined' || $.trim(para)=="" || para=="[]" || para==null || para==undefined || para=='undefined' || para=='[]'|| para=="null"){
       return ''; 
    }
    else{
      return  para;
    }
}
/**
 *  取随机整数
 *
 *  @param {number} min 最小值(含)
 *  @param {number} max 最大值(含)
 * 
 *  @return{number} 随机生成的整数
 */
function getRandomNum(min, max){
    var range = max - min;
    var rand = Math.random();
    return (min + Math.round(rand * range));
}

/**
 *  获取字母对应的数字
 *
 *  @param {string} s 英文字符
 * 
 *  @return{number} 对应数字
 */
function transformChars(s) {
    var chars = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

    function getCharIndex(string) {
        var strings = string.trim().toUpperCase().split("");
        var indexs = [];
        var temp = [];
        var result = 0;
        for (var i = 0; i < strings.length; i++) {
            indexs.push(chars.indexOf(strings[i]) + 1)
        }
        for (var i = 0; i < indexs.length; i++) {
            if (i === indexs.length - 1) {
                temp.push(indexs[i])
            } else {
                temp.push(indexs[i] * chars.length + (i === 0 ? 0 : Math.pow(chars.length, i + 1) - 26))
            }
        }
        for (var i = 0; i < temp.length; i++) {
            result += temp[i]
        }
        return result
    }
    return getCharIndex(s)
}

/**
 *  根据用户的id字段最后一位, 取对应颜色背景
 *
 *  @param {string} id 人员的id, 一个随机字符串
 * 
 *  @return{string} 背景的样式
 */
function getHeadClass(id){
    var randomStr = id.substr(id.length-1, 1),
        randomNum = -1;
    if(isNaN(randomStr)){
        //如果不是数字
        randomNum = transformChars(randomStr)%8;
    }else{
        //如果是数字, 取整即可
        randomNum = parseInt(randomStr)%8;
    }
    
    return 'bg-head-'+randomNum;
}

/**
 * 必须要在common.js前面引用XDate.js
 * @param {Object} d 为日期  可以是'2016-07-12'也可以为毫秒数,也可以是秒数
 * @param {Object} e 转换的格式为：支持任意格式比如：yyyy-MM-dd,yyyy年MM月dd日，yyyy.MM.dd,HH:ss
 */
function timeStemp(d,e){
    //判断是否为数字
    if(typeof(d)=='number'){
        //判断是否为秒级
        if(d.toString().length==10){
           d=d*1000;
        }
    }
    var todayDate=new XDate.today();
    var date=new XDate(d);
    var num=todayDate.diffDays(new XDate(date.toString("yyyy-MM-dd")));
    var commonDate=date.toString(e);
    var hours=date.getHours();
    var minutes=date.getMinutes();
    if(hours<10){
        hours="0"+ hours;
    }
    if(minutes<10){
        minutes="0"+ minutes;
    }
    if(num==-1){
        commonDate="昨天 "+hours+":"+minutes;
    }else if(num==-2){
        commonDate="前天 "+hours+":"+minutes;
    }else if(num==0){
        commonDate="今天 "+hours+":"+minutes;
    }else if(num==1){
        commonDate="明天 "+hours+":"+minutes;
    }else if(num==2){
        commonDate="后天 "+hours+":"+minutes;
    }
    var weekList = ['周日','周一','周二','周三','周四','周五','周六'];
    var json={
        date:date.toString(e),//转换出来的格式。
        weekDay:weekList[date.getDay()],//这个是星期几
        dateTimeSecond:Math.round(date.getTime()/1000),//秒数
        dateTime:date.getTime(),//毫秒数
        commonDate:commonDate
    }
    return json;
}
//表情转换图片
var brow={"brow":[
        {"key":"[强]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_80.png\">"},
        {"key":"[弱]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_81.png\">"},
        {"key":"[握手]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_82.png\">"},
        {"key":"[胜利]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_83.png\">"},
        {"key":"[抱拳]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_84.png\">"},
        {"key":"[勾引]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_85.png\">"},
        {"key":"[拳头]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_86.png\">"},
        {"key":"[差劲]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_87.png\">"},
        {"key":"[爱你]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_88.png\">"},
        {"key":"[NO]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_89.png\">"},
        {"key":"[OK]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_90.png\">"},
        {"key":"[微笑]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_1.png\">"},
        {"key":"[憋嘴]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_2.png\">"},
        {"key":"[色]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_3.png\">"},
        {"key":"[发呆]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_4.png\">"},
        {"key":"[得意]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_5.png\">"},
        {"key":"[流泪]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_6.png\">"},
        {"key":"[害羞]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_7.png\">"},
        {"key":"[闭嘴]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_8.png\">"},
        {"key":"[睡]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_9.png\">"},
        {"key":"[大哭]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_10.png\">"},
        {"key":"[尴尬]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_11.png\">"},
        {"key":"[发怒]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_12.png\">"},
        {"key":"[调皮]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_13.png\">"},
        {"key":"[呲牙]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_14.png\">"},
        {"key":"[惊讶]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_15.png\">"},
        {"key":"[难过]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_16.png\">"},
        {"key":"[酷]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_17.png\">"},
        {"key":"[冷汗]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_18.png\">"},
        {"key":"[抓狂]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_19.png\">"},
        {"key":"[吐]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_20.png\">"},
        {"key":"[偷笑]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_21.png\">"},
        {"key":"[愉快]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_22.png\">"},
        {"key":"[白眼]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_23.png\">"},
        {"key":"[傲慢]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_24.png\">"},
        {"key":"[饥饿]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_25.png\">"},
        {"key":"[困]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_26.png\">"},
        {"key":"[惊恐]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_27.png\">"},
        {"key":"[流汗]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_28.png\">"},
        {"key":"[憨笑]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_29.png\">"},
        {"key":"[悠闲]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_30.png\">"},
        {"key":"[奋斗]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_31.png\">"},
        {"key":"[咒骂]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_32.png\">"},
        {"key":"[疑问]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_33.png\">"},
        {"key":"[嘘]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_34.png\">"},
        {"key":"[晕]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_35.png\">"},
        {"key":"[疯了]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_36.png\">"},
        {"key":"[衰]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_37.png\">"},
        {"key":"[骷髅]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_38.png\">"},
        {"key":"[敲打]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_39.png\">"},
        {"key":"[再见]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_40.png\">"},
        {"key":"[擦汗]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_41.png\">"},
        {"key":"[抠鼻]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_42.png\">"},
        {"key":"[鼓掌]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_43.png\">"},
        {"key":"[糗大了]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_44.png\">"},
        {"key":"[坏笑]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_45.png\">"},
        {"key":"[左哼哼]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_46.png\">"},
        {"key":"[右哼哼]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_47.png\">"},
        {"key":"[哈欠]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_48.png\">"},
        {"key":"[鄙视]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_49.png\">"},
        {"key":"[委屈]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_50.png\">"},
        {"key":"[快哭了]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_51.png\">"},
        {"key":"[阴险]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_52.png\">"},
        {"key":"[亲亲]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_53.png\">"},
        {"key":"[吓]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_54.png\">"},
        {"key":"[可怜]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_55.png\">"},
        {"key":"[菜刀]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_56.png\">"},
        {"key":"[西瓜]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_57.png\">"},
        {"key":"[啤酒]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_58.png\">"},
        {"key":"[篮球]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_59.png\">"},
        {"key":"[乒乓]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_60.png\">"},
        {"key":"[咖啡]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_61.png\">"},
        {"key":"[饭]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_62.png\">"},
        {"key":"[猪头]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_63.png\">"},
        {"key":"[玫瑰]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_64.png\">"},
        {"key":"[凋谢]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_65.png\">"},
        {"key":"[嘴唇]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_66.png\">"},
        {"key":"[爱心]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_67.png\">"},
        {"key":"[心碎]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_68.png\">"},
        {"key":"[蛋糕]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_69.png\">"},
        {"key":"[闪电]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_70.png\">"},
        {"key":"[炸弹]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_71.png\">"},
        {"key":"[刀]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_72.png\">"},
        {"key":"[足球]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_73.png\">"},
        {"key":"[瓢虫]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_74.png\">"},
        {"key":"[便便]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_75.png\">"},
        {"key":"[月亮]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_76.png\">"},
        {"key":"[太阳]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_77.png\">"},
        {"key":"[礼物]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_78.png\">"},
        {"key":"[拥抱]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_79.png\">"},
        {"key":"[招财猫]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_106.png\">"},
        {"key":"[双喜]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_107.png\">"},
        {"key":"[鞭炮]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_108.png\">"},
        {"key":"[灯笼]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_109.png\">"},
        {"key":"[发财]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_110.png\">"},
        {"key":"[话筒]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_111.png\">"},
        {"key":"[购物]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_112.png\">"},
        {"key":"[邮件]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_113.png\">"},
        {"key":"[帅]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_114.png\">"},
        {"key":"[喝彩]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_115.png\">"},
        {"key":"[祈祷]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_116.png\">"},
        {"key":"[爆筋]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_117.png\">"},
        {"key":"[棒棒糖]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_118.png\">"},
        {"key":"[喝奶]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_119.png\">"},
        {"key":"[下面]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_120.png\">"},
        {"key":"[香蕉]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_121.png\">"},
        {"key":"[飞机]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_122.png\">"},
        {"key":"[开车]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_123.png\">"},
        {"key":"[左车头]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_124.png\">"},
        {"key":"[车厢]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_125.png\">"},
        {"key":"[右车头]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_126.png\">"},
        {"key":"[多云]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_127.png\">"},
        {"key":"[下雨]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_128.png\">"},
        {"key":"[钞票]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_129.png\">"},
        {"key":"[熊猫]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_130.png\">"},
        {"key":"[灯泡]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_131.png\">"},
        {"key":"[风车]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_132.png\">"},
        {"key":"[闹钟]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_133.png\">"},
        {"key":"[红伞]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_134.png\">"},
        {"key":"[气球]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_135.png\">"},
        {"key":"[钻戒]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_136.png\">"},
        {"key":"[沙发]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_137.png\">"},
        {"key":"[纸巾]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_138.png\">"},
        {"key":"[药]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_139.png\">"},
        {"key":"[手枪]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_140.png\">"},
        {"key":"[青蛙]","value":"<img src=\"../wgtRes/emojicons/ace_emoji_141.png\">"}
    ]}
//表情转换图片    
function filterBrow(name){
    if(name.indexOf("[")==-1){
        return name;
    }else{
        for (var i=0; i < brow.brow.length; i++) {
             name= name.replace(eval("/\\"+brow.brow[i].key+"/g"),brow.brow[i].value);
        };
        return name;
    }
}
/** 
 * 用于把用utf16编码的字符转换成实体字符，以供后台存储   utf16toEntities
 * @param  {string} str 将要转换的字符串，其中含有utf16字符将被自动检出 
 * @return {string}     转换后的字符串，utf16字符将被转换成&#xxxx;形式的实体字符 
 */  
function utf16(str) {  
    var patt=/[\ud800-\udbff][\udc00-\udfff]/g; // 检测utf16字符正则  
    str = str.replace(patt, function(char){  
            var H, L, code;  
            if (char.length===2) {  
                H = char.charCodeAt(0); // 取出高位  
                L = char.charCodeAt(1); // 取出低位  
                code = (H - 0xD800) * 0x400 + 0x10000 + L - 0xDC00; // 转换算法  
                return "&#" + code + ";";  
            } else {  
                return char;  
            }  
        });  
    return str;  
}  
function noClick(jqObj){
  jqObj.each(function(){
    $(this).addClass('no-click');
  });
}
function yesClick(jqObj){
  jqObj.each(function(){
    $(this).removeClass('no-click');
  });
}
/**
 * ele 对象。
 * param{
 *          'type':'pop'/'frame',
 *          'header':头部元素的id，必选
 *          'content':内容元素的id，当type为pop必选,其他非必选
 *          'footer':底部元素的id，  非必
 *          'id':当type为frame时   必选
 *          ‘name’:pop的名称 ，当type为pop必选
 *      } 
 */
function resetPage(ele){
    window.onorientationchange = window.onresize = function() {
        var titleHeight = parseInt($('#'+ele.header).height()),
            footerHeight = 0,
            pageHeight = parseInt($('#'+ele.content).height()),
            pageWidth = parseInt($('#'+ele.content).width());
        if(ele.hasOwnProperty('footer')){
            footerHeight=parseInt($('#'+ele.footer).height())
        }
         console.log(pageHeight-titleHeight-footerHeight);
        appcan.window.resizePopover({
            name: ele.name,
            left: 0,
            top: titleHeight,
            width: pageWidth,
            height: pageHeight-titleHeight-footerHeight
        })
        
    };
    
}
/**
 *  滑动页面收缩键盘
 *  input输入框添加 class="fix-search-ipt"
 */
$('body').on('mousedown touchstart', function(e){
    var platForm = appcan.locStorage.getVal('platForm');
    if(platForm == 0){
        //iOS
        $('.fix-search-ipt').blur();
    }
});

//之前状态2是重新提交, 现已统一为[待转派]
var dutyDisCommon=[{"text":"--","colour":"grey"},
            {"text":"待转派","colour":"blue"},
            {"text":"待转派","colour":"blue"},
            {"text":"已退回","colour":"red"},
            {"text":"待接收","colour":"green"},
            {"text":"拒收问题","colour":"orange"},
            {"text":"无法整改","colour":"grey"},
            {"text":"整改中","colour":"blue"},
            {"text":"待验收","colour":"green"},
            {"text":"验收不通过","colour":"red"},
            {"text":"已关闭","colour":"grey"},
            {"text":"超时未完成","colour":"yellow"},
            {"text":"超时已完成","colour":"grey"}];
var dutyMyCommon=[{"text":"--","colour":"grey"},
            {"text":"待转派","colour":"blue"},
            {"text":"待转派","colour":"blue"},
            {"text":"已退回","colour":"red"},
            {"text":"待接收","colour":"green"},
            {"text":"拒收问题","colour":"orange"},
            {"text":"无法整改","colour":"grey"},
            {"text":"整改中","colour":"blue"},
            {"text":"整改完成","colour":"green"},
            {"text":"验收不通过","colour":"red"},
            {"text":"已关闭","colour":"grey"},
            {"text":"超时未完成","colour":"yellow"},
            {"text":"超时已完成","colour":"grey"}]
// appcan.ready(function () {
//
//     appcan.window.subscribe("abc",function () {
//
//         uexWindow.confirm({
//             title:"12",
//             message:"你有未提交",
//             buttonLabels:"yes,no"
//         },function(index) {
//             if (index == 0) {
//                 var platForm = appcan.locStorage.getVal("platForm");
//                         if (platForm == "1") {
//                             appcan.window.open('../duty/duty-four-2', '../duty/duty-four-2.html', 2);
//                         } else {
//                             appcan.window.open({
//                                 name: '../duty/duty-four-2',
//                                 dataType: 0,
//                                 data: '../duty/duty-four-2.html',
//                                 type: 1024
//                             });
//                         }
//             } else {
//                 appcan.window.publish("setTime");
//             }
//         });
//
//     })
//     }
// );
