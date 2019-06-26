//打开页面方法
function openWindow(name, data, dataType) {
    //	name:新窗口的的名称，如果窗口存在直接打开，如果不存在先创建然后打开
    //  data:新窗口填充的数据
    //  dataType:新窗口填充的数据类型  默认 0: url(可不传)
    if (dataType == undefined || dataType == null || dataType == "") {
        dataType = 0;
    }
    var platForm = appcan.locStorage.getVal("platForm"); //是安卓还是IOS
    if (platForm == 1 || platForm == "undefined") { //安卓
        appcan.window.open({
            name: name,
            dataType: dataType,
            aniId: 2,
            data: data
        });
    } else { //IOS
        appcan.window.open({
            name: name,
            dataType: dataType,
            aniId: 0,
            type: 1024,
            data: data
        });
    }
}

//打开浮动窗口
function createPopover(name, url, pageID, headerID, footerID) {
    //	name:要打开弹出窗的名称
    //   url:弹出框要加载的页面的地址
    //pageID：主页面的ID(可不传，默认默认Page)
    //headerID:头部的ID(可不传,header)
    if (pageID == undefined || pageID == null || pageID == "") {
        pageID = "Page";
    }
    if (headerID == undefined || headerID == null || headerID == "") {
        headerID = "Header";
    }
    if (footerID == undefined || footerID == null || footerID == "") {
        footerID = "Footer";
    }
    var titleHeight = parseFloat($('#' + headerID).height()),
        footerHeight = parseFloat($('#' + footerID).height()),
        pageHeight = parseFloat($('#' + pageID).height()),
        pageWidth = parseFloat($('#' + pageID).width());
    if (isNaN(footerHeight)) {
        footerHeight = 0
    }
    appcan.window.openPopover({
        name: name,
        url: url,
        left: 0,
        top: titleHeight,
        width: pageWidth,
        height: pageHeight - titleHeight - footerHeight
    });
};

//连续返回两个页面,传页面name,离页面远的在数组里排在前面
/***
 * @param arr
 */
function closeMultiPages(arr) {
    for (var i = 0; i < arr.length; i++) {
        appcan.window.evaluateScript({
            name: arr[i],
            scriptContent: 'appcan.window.close(1);'
        });
    }
}
/*****
 * 打开图片全屏浏览
 * @param i  起始图片位置
 * @param picPathArray  图片路径数组
 */
function picView(i, picPathArray) {
    i = i || 0;
    var data = {
        displayActionButton: false,
        displayNavArrows: false,
        enableGrid: true,
        startIndex: i, //起始图片位置
        data: picPathArray,
        style: 1,
        gridBackgroundColor: "#4A88C1", // style为1时生效
        gridBrowserTitle: "图片浏览",
        viewFramePicPreview: { //位置、大小
            x: 0,
            y: 0,
            w: 1080,
            h: 1767
        },
        viewFramePicGrid: { //位置、大小
            x: 0,
            y: 0,
            w: 1080,
            h: 1767
        }
    };
    uexImage.openBrowser(data, function () {

    });
}

/***
 * vue过滤器,传起始位置和结束位置
 */
Vue.filter('getDate', function (str, start, end) {
    if (!str) {
        return false;
    } else {
        return str.substring(start, end)
    }
});
/****
 * vue过滤器,过滤掉中文和斜杠符号
 */
Vue.filter('numFmt', function (str) {
    if (!str) {
        return false
    } else {
        var reg = /[\u4E00-\u9FA5|/|\uff08|[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/g;
        var newStr = str.replace(reg, '');
        return newStr
    }
});
/****
 * Vue截取字符串过滤器
 * start:开始位置
 * end:结束位置
 */
Vue.filter('substr', function (str, start, end) {
    if (!str) {
        return false;
    } else {
        return str.substring(start, end)
    }
});
/**
 * json 中必须有path 和 data 参数。
 * @param {Object} json
 * @param {Object} cb(data,success) 第一个参数是返回的数据或者是错误数据，第二个是success or  error
 */
function ajaxPOST(json, cb) {
    var index;
    if (!json.hasOwnProperty('layer')) {
        index = layerLoading();
    } else {
        if (json.layer) {
            index = layerLoading();
        }
    }
    json.data.token = appcan.locStorage.getVal("token");
    //json.data.token="tTb8qsu3KHMXCGby1q8b6Q";
    appcan.request.ajax({
        url: json.path,
        type: "POST",
        //beforeSend: addHeader,
        data: json.data,
        dataType: 'json',
        contentType: 'application/json',
        timeout: 40000,
        offline: false,
        success: function (data) {
            if (data.success) {
                if (!json.hasOwnProperty('layer')) {
                    layerRemove(index);
                } else {
                    if (json.layer) {
                        layerRemove(index);
                    }
                }
                cb(data, "success");
            } else {
                if (!json.hasOwnProperty('layer')) {
                    layerRemove(index);
                } else {
                    if (json.layer) {
                        layerRemove(index);
                    }
                }
                cb(data, "error");
            }
        },
        error: function (err, e, errMsg, error) {
            if (json.hasOwnProperty("layerErr")) {
                if (json.layerErr) {
                    layerToast('网络错误，请检查网络环境', 2);
                }
            } else {
                layerToast('网络错误，请检查网络环境', 2);
            }
            layerRemove(index);
            //弹出接口访问失败原因

            var requestJson = {
                'obj': {
                    'state': '4'
                },
                'msg': '网络错误，请检查网络环境',
                'success': false
            };
            cb(requestJson, "error");
        }
    })
}

//获取用户角色
function getRole(cb) {
    var json = {
        path: serverPath + "focUserController.do?focgetRole",
        data: {},
        layer: false,
        layerErr: false
    };
    ajaxRequest(json, function (data, e) {
        if (e == "success") {
            var returnData = data.obj;
            console.log(returnData);
            var role;
            for (var i = 0; i < returnData.length; i++) {
                appcan.locStorage.setVal('patrol-reform-rolecode', returnData[i].rolecode);
                if (returnData[i].rolecode.indexOf("巡查督查经理") != -1) { //巡查督查经理
                    role = 0;
                } else if (returnData[i].rolecode.indexOf("中队长") != -1) { //中队长
                    role = 1
                } else if (returnData[i].rolecode.indexOf("副大队长") != -1) { //副大队长
                    role = 3
                }else if (returnData[i].rolecode.indexOf("普通值班账号") != -1 || returnData[i].rolecode.indexOf("02值班账号") != -1) { //值班账号
                    role = 2
                } else {
                    role = 4
                }
            }
            cb(role, "success")
        } else {
            cb(data, "errer")
        }

    })
}

//获取用户角色 -- 处罚模块
function getRoleForPunish(cb) {
    var json = {
        path: serverPath + "focUserController.do?focgetRole",
        data: {},
        layer: false,
        layerErr: false
    };
    ajaxRequest(json, function (data, e) {
        if (e == "success") {
            var returnData = data.obj;
            console.log(returnData);
            var json = {
                role: "",
                data: ""
            };
            for (var i = 0; i < returnData.length; i++) {
                if (returnData[i].rolecode.indexOf("巡查督查经理") != -1) { //巡查督查经理
                    json.role = 0;
                    json.data = returnData[i];
                } else if (returnData[i].rolecode.indexOf("中队长") != -1) { //中队长
                    json.role = 1;
                    json.data = returnData[i];
                } else if (returnData[i].rolecode.indexOf("副大队长") != -1) { //副大队长
                    json.role = 3;
                    json.data = returnData[i];
                } else if(returnData[i].rolecode.indexOf("普通值班账号") != -1 || returnData[i].rolecode.indexOf("02值班账号") != -1) {
                    json.role = 2;
                    json.data = returnData[i];
                }else{
                    json.role = 4;
                    json.data = returnData[i];
                }
            }
            cb(json, "success")
        } else {
            cb(data, "errer")
        }

    })
}

//获取当前时间
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var strMinutes = date.getMinutes();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    if (strMinutes >= 0 && strMinutes <= 9) {
        strMinutes = "0" + strMinutes;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
        " " + date.getHours() + seperator2 + strMinutes;
    return currentdate;
}

/***
 * 日期格式化
 * @param datetime
 * @returns {string}
 */
function dateToStr(datetime) {

    var year = datetime.getFullYear();
    var month = datetime.getMonth() + 1; //js从0开始取
    var date = datetime.getDate();
    var hour = datetime.getHours();
    var minutes = datetime.getMinutes();
    var second = datetime.getSeconds();

    if (month < 10) {
        month = "0" + month;
    }
    if (date < 10) {
        date = "0" + date;
    }
    if (hour < 10) {
        hour = "0" + hour;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (second < 10) {
        second = "0" + second;
    }

    var time = year + "-" + month + "-" + date + " " + hour + ":" + minutes + ":" + second; //2009-06-12 17:18:00
    // alert(time);
    return time;
}

/******
 * 深拷贝对象
 * @param obj
 * @param copyObj
 * @returns {boolean}
 */
function deepCopy(obj, copyObj) {
    if (typeof obj != 'object' || typeof copyObj != 'object') {
        return false;
    }

    for (var k in copyObj) {
        if (copyObj.hasOwnProperty(k)) {
            if (typeof copyObj[k] == 'object') {
                obj[k] = Array.isArray(copyObj[k]) ? [] : {};
                deepCopy(obj[k], copyObj[k])
            } else {
                obj[k] = copyObj[k];
            }
        }
    }
}
