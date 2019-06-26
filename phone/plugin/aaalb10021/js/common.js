var serverPath="";

/*
 XDate v0.8.2
 Docs & Licensing: http://arshaw.com/xdate/
*/
var XDate=function(g,q,E,t){function h(){var a=this instanceof h?this:new h,c=arguments,b=c.length;if("boolean"==typeof c[b-1]){var d=c[--b];c=u(c,0,b)}if(b)if(1==b)if(b=c[0],b instanceof g)a[0]=new g(b.getTime());else if("number"==typeof b)a[0]=new g(b);else if(b instanceof h){var c=a,f=new g(b[0].getTime());n(b)&&(f.toString=z);c[0]=f}else{if("string"==typeof b){a[0]=new g(0);a:{for(var c=b,b=d||!1,f=h.parsers,A=0,e;A<f.length;A++)if(e=f[A](c,b,a)){a=e;break a}a[0]=new g(c)}}}else a[0]=new g(p.apply(g,c)),d||(a[0]=v(a[0]));else a[0]=new g;"boolean"==typeof d&&F(a,d);return a}function n(a){return a[0].toString===z}function F(a,c,b){c?n(a)||(b&&(c=a[0],c=new g(p(c.getFullYear(),c.getMonth(),c.getDate(),c.getHours(),c.getMinutes(),c.getSeconds(),c.getMilliseconds())),a[0]=c),a[0].toString=z):n(a)&&(a[0]=b?v(a[0]):new g(a[0].getTime()));return a}function G(a,c,b,d,f){var e=l(k,a[0],f);a=l(H,a[0],f);f=!1;2==d.length&&"boolean"==typeof d[1]&&(f=d[1],d=[b]);b=1==c?(b%12+12)%12:e(1);a(c,d);f&&e(1)!=b&&(a(1,[e(1)-1]),a(2,[I(e(0),e(1))]))}function J(a,c,b,d){b=Number(b);var f=q.floor(b);a["set"+r[c]](a["get"+r[c]]()+f,d||!1);f!=b&&6>c&&J(a,c+1,(b-f)*K[c],d)}function L(a,c,b){a=a.clone().setUTCMode(!0,!0);c=h(c).setUTCMode(!0,!0);var d=0;if(0==b||1==b){for(var f=6;f>=b;f--)d/=K[f],d+=k(c,!1,f)-k(a,!1,f);1==b&&(d+=12*(c.getFullYear()-a.getFullYear()))}else 2==b?(b=a.toDate().setUTCHours(0,0,0,0),d=c.toDate().setUTCHours(0,0,0,0),d=q.round((d-b)/864E5)+(c-d-(a-b))/864E5):d=(c-a)/[36E5,6E4,1E3,1][b-3];return d}function w(a){var c=a(0),b=a(1),d=a(2);a=new g(p(c,b,d));c=x(M(c,b,d));return q.floor(q.round((a-c)/864E5)/7)+1}function M(a,c,b){c=new g(p(a,c,b));return c<x(a)?a-1:c>=x(a+1)?a+1:a}function x(a){a=new g(p(a,0,4));a.setUTCDate(a.getUTCDate()-(a.getUTCDay()+6)%7);return a}function N(a,c,b,d){var f=l(k,a,d),e=l(H,a,d);b===t&&(b=M(f(0),f(1),f(2)));b=x(b);d||(b=v(b));a.setTime(b.getTime());e(2,[f(2)+7*(c-1)])}function O(a,c,b,d,f){var e=h.locales,g=e[h.defaultLocale]||{},P=l(k,a,f);b=("string"==typeof b?e[b]:b)||{};return B(a,c,function(a){if(d)for(var b=(7==a?2:a)-1;0<=b;b--)d.push(P(b));return P(a)},function(a){return b[a]||g[a]},f)}function B(a,c,b,d,e){for(var f,h,g="";f=c.match(S);){g+=c.substr(0,f.index);if(f[1]){h=g;for(var m=a,k=f[1],n=b,p=d,q=e,l=k.length,r="";0<l;)g=T(m,k.substr(0,l),n,p,q),g!==t?(r+=g,k=k.substr(l),l=k.length):l--;g=h+(r+k)}else f[3]?(h=B(a,f[4],b,d,e),parseInt(h.replace(/\D/g,""),10)&&(g+=h)):g+=f[7]||"'";c=c.substr(f.index+f[0].length)}return g+c}function T(a,c,b,d,f){var e=h.formatters[c];if("string"==typeof e)return B(a,e,b,d,f);if("function"==typeof e)return e(a,f||!1,d);switch(c){case "fff":return m(b(6),3);case "s":return b(5);case "ss":return m(b(5));case "m":return b(4);case "mm":return m(b(4));case "h":return b(3)%12||12;case "hh":return m(b(3)%12||12);case "H":return b(3);case "HH":return m(b(3));case "d":return b(2);case "dd":return m(b(2));case "ddd":return d("dayNamesShort")[b(7)]||"";case "dddd":return d("dayNames")[b(7)]||"";case "M":return b(1)+1;case "MM":return m(b(1)+1);case "MMM":return d("monthNamesShort")[b(1)]||"";case "MMMM":return d("monthNames")[b(1)]||"";case "yy":return(b(0)+"").substring(2);case "yyyy":return b(0);case "t":return y(b,d).substr(0,1).toLowerCase();case "tt":return y(b,d).toLowerCase();case "T":return y(b,d).substr(0,1);case "TT":return y(b,d);case "z":case "zz":case "zzz":return f?c="Z":(d=a.getTimezoneOffset(),a=0>d?"+":"-",b=q.floor(q.abs(d)/60),d=q.abs(d)%60,f=b,"zz"==c?f=m(b):"zzz"==c&&(f=m(b)+":"+m(d)),c=a+f),c;case "w":return w(b);case "ww":return m(w(b));case "S":return c=b(2),10<c&&20>c?"th":["st","nd","rd"][c%10-1]||"th"}}function y(a,c){return 12>a(3)?c("amDesignator"):c("pmDesignator")}function C(a){return!isNaN(a[0].getTime())}function k(a,c,b){return a["get"+(c?"UTC":"")+r[b]]()}function H(a,c,b,d){a["set"+(c?"UTC":"")+r[b]].apply(a,d)}function v(a){return new g(a.getUTCFullYear(),a.getUTCMonth(),a.getUTCDate(),a.getUTCHours(),a.getUTCMinutes(),a.getUTCSeconds(),a.getUTCMilliseconds())}function I(a,c){return 32-(new g(p(a,c,32))).getUTCDate()}function D(a){return function(){return a.apply(t,[this].concat(u(arguments)))}}function l(a){var c=u(arguments,1);return function(){return a.apply(t,c.concat(u(arguments)))}}function u(a,c,b){return E.prototype.slice.call(a,c||0,b===t?a.length:b)}function Q(a,c){for(var b=0;b<a.length;b++)c(a[b],b)}function m(a,c){c=c||2;for(a+="";a.length<c;)a="0"+a;return a}var r="FullYear Month Date Hours Minutes Seconds Milliseconds Day Year".split(" "),R=["Years","Months","Days"],K=[12,31,24,60,60,1E3,1],S=/(([a-zA-Z])\2*)|(\((('.*?'|\(.*?\)|.)*?)\))|('(.*?)')/,p=g.UTC,z=g.prototype.toUTCString,e=h.prototype;e.length=1;e.splice=E.prototype.splice;e.getUTCMode=D(n);e.setUTCMode=D(F);e.getTimezoneOffset=function(){return n(this)?0:this[0].getTimezoneOffset()};Q(r,function(a,c){e["get"+a]=function(){return k(this[0],n(this),c)};8!=c&&(e["getUTC"+a]=function(){return k(this[0],!0,c)});7!=c&&(e["set"+a]=function(a){G(this,c,a,arguments,n(this));return this},8!=c&&(e["setUTC"+a]=function(a){G(this,c,a,arguments,!0);return this},e["add"+(R[c]||a)]=function(a,d){J(this,c,a,d);return this},e["diff"+(R[c]||a)]=function(a){return L(this,a,c)}))});e.getWeek=function(){return w(l(k,this,!1))};e.getUTCWeek=function(){return w(l(k,this,!0))};e.setWeek=function(a,c){N(this,a,c,!1);return this};e.setUTCWeek=function(a,c){N(this,a,c,!0);return this};e.addWeeks=function(a){return this.addDays(7*Number(a))};e.diffWeeks=function(a){return L(this,a,2)/7};h.parsers=[function(a,c,b){if(a=a.match(/^(\d{4})(-(\d{2})(-(\d{2})([T ](\d{2}):(\d{2})(:(\d{2})(\.(\d+))?)?(Z|(([-+])(\d{2})(:?(\d{2}))?))?)?)?)?$/)){var d=new g(p(a[1],a[3]?a[3]-1:0,a[5]||1,a[7]||0,a[8]||0,a[10]||0,a[12]?1E3*Number("0."+a[12]):0));a[13]?a[14]&&d.setUTCMinutes(d.getUTCMinutes()+("-"==a[15]?1:-1)*(60*Number(a[16])+(a[18]?Number(a[18]):0))):c||(d=v(d));return b.setTime(d.getTime())}}];h.parse=function(a){return+h(""+a)};e.toString=function(a,c,b){return a!==t&&C(this)?O(this,a,c,b,n(this)):this[0].toString()};e.toUTCString=e.toGMTString=function(a,c,b){return a!==t&&C(this)?O(this,a,c,b,!0):this[0].toUTCString()};e.toISOString=function(){return this.toUTCString("yyyy-MM-dd'T'HH:mm:ss(.fff)zzz")};h.defaultLocale="";h.locales={"":{monthNames:"January February March April May June July August September October November December".split(" "),monthNamesShort:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),dayNames:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),dayNamesShort:"Sun Mon Tue Wed Thu Fri Sat".split(" "),amDesignator:"AM",pmDesignator:"PM"}};h.formatters={i:"yyyy-MM-dd'T'HH:mm:ss(.fff)",u:"yyyy-MM-dd'T'HH:mm:ss(.fff)zzz"};Q("getTime valueOf toDateString toTimeString toLocaleString toLocaleDateString toLocaleTimeString toJSON".split(" "),function(a){e[a]=function(){return this[0][a]()}});e.setTime=function(a){this[0].setTime(a);return this};e.valid=D(C);e.clone=function(){return new h(this)};e.clearTime=function(){return this.setHours(0,0,0,0)};e.toDate=function(){return new g(this[0].getTime())};h.now=function(){return(new g).getTime()};h.today=function(){return(new h).clearTime()};h.UTC=p;h.getDaysInMonth=I;"undefined"!==typeof module&&module.exports&&(module.exports=h);"function"===typeof define&&define.amd&&define([],function(){return h});return h}(Date,Math,Array);

/**
 * 日期时间处理
 *
 * @param {Object} d 日期, 可以是'2016-07-12',可以为毫秒数/秒数,null或不填则为当前日期
 * @param {Object} e 转换的格式, 支持任意格式如yyyy-MM-dd,yyyy年MM月dd日，yyyy.MM.dd,HH:ss
 */
function timeStemp(d, e){
    var weekList = ['周日','周一','周二','周三','周四','周五','周六'];
    var tianList = ['前天','昨天','今天','明天','后天'];
    
    //判断是否为秒级
    if (typeof(d) == 'number' && d.toString().length==10) {
       d = d*1000;
    }
    var todayDate = new XDate.today();
    var date = d ? new XDate(d) : new XDate();
    var num = todayDate.diffDays(new XDate(date.toString('yyyy-MM-dd')));
    var commonDate = date.toString(e);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    if (hours < 10) {
        hours = '0' + hours;
    }
    if (minutes < 10){
        minutes = '0' + minutes;
    }
    
    if (num >= -2 && num <= 2 ) {
        commonDate = tianList[num+2] + hours + ':' + minutes;
    }
    
    return {
        date: date.toString(e),//转换出来的格式
        weekDay: weekList[date.getDay()],//这个是星期几
        dateTimeSecond: Math.round(date.getTime()/1000),//秒数
        dateTime: date.getTime(),//毫秒数
        commonDate: commonDate,
        fullDate: date.toString('yyyy/MM/dd'),//年月日
        shortDate: date.toString('MM/dd'),//月日
        generalDate: date.toString('MM/dd HH:mm')//月日时分,常用
    };
}

/**
 * 初始化时间选择器的时间, 必须引入iosSelect的js和css
 *
 * @param {Object} showDateDom 存取时间的input框DOM节点
 * @param {Number} timestamp 时间戳, 10位或13位皆可, 不传或null则取当前时间
 * @param {Object} yearObj 接收往前能选的年数min和往后能选的年数max, 不填则默认5
 */
function initDate(showDateDom, timestamp, yearObj) {
    var stamp, now;
    if (timestamp) {
        stamp = timestamp.length == 13 ? timestamp : timestamp * 1000;
        now = new Date(stamp);
    } else {
        now = new Date();
    }
    var nowYear = now.getFullYear();
    var nowMonth = now.getMonth() + 1;
    var nowDate = now.getDate();
    var nowHours = now.getHours();
    var nowMinutes = now.getMinutes();
    showDateDom.setAttribute('data-year', nowYear);
    showDateDom.setAttribute('data-month', nowMonth);
    showDateDom.setAttribute('data-date', nowDate);
    showDateDom.setAttribute('data-hours', nowHours);
    showDateDom.setAttribute('data-minutes', nowMinutes);
    
    // 数据初始化
    function formatYear (nowYear, yearObject) {
        var arr = [];
        var minYear = yearObject && yearObject.min ? yearObject.min : 5;
        var maxYear = yearObject && yearObject.max ? yearObject.max : 5;
        for (var i = nowYear - minYear; i <= nowYear + maxYear; i++) {
            arr.push({
                id: i,
                value: i + '年'
            });
        }
        return arr;
    }
    function formatMonth () {
        var arr = [];
        for (var i = 1; i <= 12; i++) {
            arr.push({
                id: i,
                value: i + '月'
            });
        }
        return arr;
    }
    function formatDate (count) {
        var arr = [];
        for (var i = 1; i <= count; i++) {
            arr.push({
                id: i,
                value: i + '日'
            });
        }
        return arr;
    }
    var yearData = function(callback) {
        callback(formatYear(nowYear, yearObj))
    };
    var monthData = function (year, callback) {
        callback(formatMonth());
    };
    var dateData = function (year, month, callback) {
        if (/^(1|3|5|7|8|10|12)$/.test(month)) {
            callback(formatDate(31));
        }
        else if (/^(4|6|9|11)$/.test(month)) {
            callback(formatDate(30));
        }
        else if (/^2$/.test(month)) {
            if (year % 4 === 0 && year % 100 !==0 || year % 400 === 0) {
                callback(formatDate(29));
            }
            else {
                callback(formatDate(28));
            }
        }
        else {
            throw new Error('月份不合法。');
        }
    };
    var hourData = function(year, month, date, callback) {
        var hours = [];
        for (var i = 0,len = 24; i < len; i++) {
            hours.push({
                id: i,
                value: i + '时'
            });
        }
        callback(hours);
    };
    var minuteData = function(year, month, date, hour, callback) {
        var minutes = [];
        for (var i = 0, len = 60; i < len; i++) {
            minutes.push({
                id: i,
                value: i + '分'
            });
        }
        callback(minutes);
    };
    
    return {
        'yearData': yearData,
        'monthData': monthData,
        'dateData': dateData,
        'hourData': hourData,
        'minuteData': minuteData
    }
}

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
function layerToast(arg_1, arg_2) {
    var txt = arg_1 || 'Loading...',
        sec = arg_2 || 2;
    layer.open({
        content: txt,
        time: sec,
        skin: 'msg'
    });
}

/**
 *  添加loading遮罩
 * 
 *  @return{number} layerIndex 该遮罩的索引值
 */
function layerLoading() {
    //ModalHelper.afterOpen();
    var layerIndex = -1;
    layer.open({
        className: 'layer-a',
        type: 2,
        shadeClose: false,
        content: '加载中，请稍候……',
        success: function (elem) {
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
function layerRemove(idx) {
    if (typeof idx == 'undefined') return;
    layer.close(idx);
    [].forEach.call(document.body.classList, function (n, i) {
        if (n == 'layui-m-fix') {
            ModalHelper.beforeClose();
            return;
        }
    });
}

/**
 *  移除所有遮罩
 */
function layerRemoveAll() {
    layer.closeAll();
    [].forEach.call(document.body.classList, function (n, i) {
        if (n == 'layui-m-fix') {
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
    if (typeof (oldObj) != 'object') return oldObj;
    if (oldObj == null) return oldObj;
    var newObj = new Object();
    for (var i in oldObj)
        newObj[i] = oldObj[i] instanceof Array ? oldObj[i].slice(0) : cloneObj(oldObj[i]);
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
function addAlert(obj) {
    ModalHelper.afterOpen();
    var defaults = {
        className: 'layer-a',
        content: '操作成功！',
        btn: '确定',
        shadeClose: false
    };

    if (!obj.hasOwnProperty('yes')) {
        defaults.yes = function (index) {
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
function addConfirm(obj) {
    ModalHelper.afterOpen();
    var defaults = {
        className: 'layer-a',
        content: '确定执行该操作吗？',
        btn: ['确定', '取消'],
        shadeClose: false
    };
    if (!obj.hasOwnProperty('yes')) {
        defaults.yes = function (index) {
            layerRemove(index);
        };
    }
    if (!obj.hasOwnProperty('no')) {
        defaults.no = function (index) {
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
    return !(typeof para == 'undefined' || $.trim(para) == "" || para == "[]" || para == null || para == undefined ||
        para == 'undefined' || para == '[]' || para == "null");
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
    return str.substring(0, 3) + "****" + str.substring(8, 11);
}

/**
 *  换行符替换为换行标签，一般用在textarea
 *
 *  @param {string} str 要替换的字符串
 * 
 *  @return{string}     替换后的字符串
 */
function replaceEnter(str) {
    return str.replace(/\n/g, '<BR>');
}

/**
 *  换行标签还原为换行符，一般用在textarea
 *
 *  @param {string} str 要还原的字符串
 * 
 *  @return{string}     还原后的字符串
 */
function restoreEnter(str) {
    return str.replace(/<br\/>/gi, '\n').replace(/<\/br>/gi, '\n').replace(/<br>/gi, '\n');
}

/**
 *  打开子页面浮动窗口/调整窗口大小和位置
 *
 *  @param {Object} obj
 *  @param {Boolean} obj.isResize true需要调整窗口大小和位置, false或不传则为新打开窗口
 *  @param {String} obj.header 头部的id, 传空或不传则默认为Header
 *  @param {String} obj.footer 底部的id, 传空则默认为Footer, 不传则为无底部
 *  @param {String} obj.page 页面主体的id, 传空或不传则默认为Page
 *  @param {String} obj.name 页面名称
 *  @param {String} obj.url 页面的相对路径(如空则取页面名称)
 */
function popover(obj) {
    var dpr = localStorage.getItem('myPlatform') ? window.devicePixelRatio : 1;
    var header = obj.hasOwnProperty('header') && obj.header != '' ? obj.header : 'Header',
        footer = obj.hasOwnProperty('footer') ? ( obj.footer != '' ? obj.footer : 'Footer') : null,
        page = obj.hasOwnProperty('page') && obj.page != '' ? obj.page : 'Page';
    
    var titleHeight = parseInt($('#' + header).height() * dpr),
        footerHeight = footer ? parseInt($('#' + footer).height() * dpr) : 0,
        pageHeight = parseInt($('#' + page).height() * dpr),
        pageWidth = parseInt($('#' + page).width() * dpr);
    
    if (obj.isResize) {
        appcan.window.resizePopover({
            name: obj.name,
            left: 0,
            top: titleHeight,
            width: pageWidth,
            height: pageHeight - titleHeight - footerHeight
        });
    } else {
        appcan.window.openPopover({
            name: obj.name,
            url: obj.url || (obj.name + '.html'),
            left: 0,
            top: titleHeight,
            width: pageWidth,
            height: pageHeight - titleHeight - footerHeight
        });
    }
}
/**
 * 评论插件打开方法 
 * Author:cdl
 */
function uexInputOpen(){
    var data = {
            emojicons: "res://emojicons/emojicons.xml",
            placeHold: "请输入内容"
    };
    uexInputTextFieldView.open(data);
    uexInputTextFieldView.setInputFocused();
}
/**
 * 品论插件初始化方法，放在ready中
 * @param {Object} cb 返回函数(返回输入框的输入)
 * Author:cdl
 */
function uexInputInit(cb){
    //点击输入框右边完成按钮返回相应的输入的文字
    uexInputTextFieldView.onCommitJson = function(data){
        cb(data.emojiconsText);
    };
    //键盘弹出收起
    uexInputTextFieldView.onKeyBoardShow = function(json){
       var keyBoardToggleData = JSON.parse(json)
       if (keyBoardToggleData.status == 0) {
           uexInputTextFieldView.close();
       }
    };
}
