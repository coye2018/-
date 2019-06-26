/**
 * 1、初始化jpush
 *
 */
function initJpush() {
	uexJPush.onReceiveNotification = function(data) {
	    // alert("进来了");
		appcan.window.publish("option-get-num", "option-get-num");
	};
	//点击推送跳转到详情页面 -- 现场巡查督查助手
    uexJPush.onReceiveNotificationOpen = function(data) {
        //type patrol-inspect=巡查单  patrol-reform=整改单 patrol-punish=处罚单
        var patrol=JSON.parse(data);
        // alert(JSON.stringify(patrol));
        for (var val in patrol.extras) {
            if(patrol.extras[val] == "patrol-inspect") {
                localStorage.setItem('patrol-inspectId',patrol.extras['id']);
                var myPlatForm = localStorage.getItem('platForm');
                if(myPlatForm =='1'){
                //    安卓
                    localStorage.setItem('patrol-title',patrol.title);
                }else{
                //    iOS
                    localStorage.setItem('patrol-title',patrol.content);
                }
                openPatrol("inspect-submit","patrol/inspect-submit.html", "");
            }
            if(patrol.extras[val] == "patrol-reform") {
                var json = {
                    path: serverPath + "focUserController.do?focgetRole",
                    data: {},
                    layer: false,
                    layerErr: false
                };
                ajaxRequest(json, function(data, e) {
                    if(e == "success") {
                        var returnData = data.obj;
                        var role;
                        for(var i = 0; i < returnData.length; i++) {
                            appcan.locStorage.setVal('patrol-reform-rolecode', returnData[i].rolecode);
                            if(returnData[i].rolecode.indexOf("巡查督查经理") != -1) { //巡查督查经理
                                role = '0'
                            } else if(returnData[i].rolecode.indexOf("中队长") != -1 || returnData[i].rolecode.indexOf("副大队长") != -1) { //中队长,副队长
                                role = ''
                            } else if (returnData[i].rolecode.indexOf("普通值班账号") != -1 || returnData[i].rolecode.indexOf("02值班账号") != -1){
                                role = '1'
                            }else {
                                role = '2'
                            }
                        }
                        appcan.locStorage.setVal("patrol-reformId", patrol.extras['id']);
                        appcan.locStorage.setVal('patrol-status', patrol.extras['status']);
                        appcan.locStorage.setVal('patrol-role', role);
                        // alert(patrol.extras['id']+' :: '+patrol.extras['status']+' :: '+role);
                        openPatrol("reform-rectification-details","patrol/reform-rectification-details.html", "");
                    } else {

                    }

                })
            }
            if(patrol.extras[val] == "patrol-punish") {
                appcan.locStorage.setVal("patrol-punishId", patrol.extras['id']);
                openPatrol("punish-detail", "patrol/punish-detail.html", "");
            }
        }


        //alert(JSON.stringify(data));

    };

}

/**
 *@param {string} name 新窗口的的名称，如果窗口存在直接打开，如果不存在先创建然后打开
 *@param {string} data 新窗口填充的数据
 *@param {string} dataType 新窗口填充的数据类型  默认 0: url(可不传)
 *
 */
function openPatrol(name, data, dataType) {
	if(dataType == undefined || dataType == null || dataType == "") {
		dataType = 0;
	}
	var platForm = appcan.locStorage.getVal("platForm"); //是安卓还是IOS
	if(platForm == '1' || platForm == "undefined") { //安卓
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