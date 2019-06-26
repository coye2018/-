// 动画方式
var aniId=0;

var vm = new Vue({
    el: '#duty_report',
    data: {
        dutyReport:[],
        nonet: false,
        nothing: false
    },
    methods: {
        unclick:function(item,index){ 
           //点击简报，下载查看PDF
           
           var ev = $(event.currentTarget);
          
           // 兼容红米手机, 解码后台返回的下载路径
           var filePath = item.filepath,
               fileName = item.filename;
               
            appcan.file.exists({
                filePath:'wgts://'+ fileName,
                callback:function(err,data,dataType,optId){
                    
                    if(err){
                        //判断文件文件出错了
                        return;
                    }
                    if(data == 1){
                        //文件存在
                          uexDocumentReader.openDocumentReader('wgts://'+ fileName);
                    }else{
                        ev.find('.fc-text').text('下载中...')
                        var downLoadjson={
                            serverUrl: serverPath + filePath,
                            downloadUrl: 'wgts://'+ fileName
                        };
                        appcan.plugInDownloaderMgr.download(downLoadjson,function(e){
                            if(e.status==1){
                                // 下载完成
                                ev.find('.fc-text').text('下载成功');
                                uexDocumentReader.openDocumentReader('wgts://'+ fileName);
                            }else if(e.status==2){
                                // 下载出错
                                ev.find('.fc-text').text('下载失败');
                            }else{
                                // 下载中
                                // percent(ev, e.percent);
                            }
                        });
                    }
                    
                }
            });         
        }
    }
});


;(function($) {
    
    appcan.button("#nav-left", "btn-act", function() {
        appcan.window.close(1);
    });
    
    appcan.ready(function() {
        
        updateOptionNum();
        
        appcan.window.publish('haveReadDutyReportNewMessages', 'haveReadDutyReportNewMessages');
        
        appcan.window.subscribe('fontsize', function(msg){
            quanjuFontsize();
        });
        
        //如果是ios设备，设置向右滑动关闭页面
        var platFormC = appcan.locStorage.getVal("platForm");
        uexWindow.setIsSupportSwipeCallback(JSON.stringify({
            isSupport: (platFormC == "1") ? false : true
        }));
        uexWindow.onSwipeRight = function(){
            appcan.window.close(1);
        };
        
    });
    
    // 上下拉加载
    var mescroll = new MeScroll('mescroll', {
        down: {
            use: true,
            auto: false
        },
        up: {
            use: true,
            auto: true,
            page: {
                num : 0, 
                size : 15
            },
            callback: loaddutyreport
        }
    });
    
    //加载值班简报列表，接口为focGetDutyReportList，page是页数，size是加载的简报个数
    function loaddutyreport(page){
        var pageNum = page.num - 1,
            pageSize = page.size;
        
        // 第一页时清空数据
        if (pageNum == 0) {
            vm.dutyReport = [];
        };
        
        var json={
            path:serverPath+'focBriefingBulletinController.do?focGetAppBulletinList',
            data:{
                pageStart: pageNum * pageSize,
                pageEnd: pageSize
            },
            layer: false
        };
        ajaxRequest(json,function(data,e){ //请求数据函数，data是返回的数据
            if(e=="success"){
                
                if (pageNum == 0 && data.obj.length == 0) {
                    vm.nothing = true;
                };
                
                vm.dutyReport = vm.dutyReport.concat(data.obj);
                
                mescroll.endSuccess(data.obj.length);
                
            } else {
                
                if (pageNum == 0) {
                    vm.nonet = true;
                };
                
                mescroll.endErr();
            }
        });
    };
    
})($);

/**
 * 修改通知的消息数。
 */
function updateOptionNum(){
    var json={
        path:serverPath+'focCommonController.do?focclearMessageNum',
        data:{
            model: appcan.locStorage.getVal("optionFunctionid")
        },
        layer:false
    }
    ajaxRequest(json, function(data,e){
        if(e == "success"){
            //通知功能页更新消息数
            appcan.window.publish("option-get-num","option-get-num");
        }else{
        }
    });
};

