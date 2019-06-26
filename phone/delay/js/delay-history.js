var platForm = appcan.locStorage.getVal("platForm");

var vm = new Vue({
    el: '#ScrollContent',
    data: {
        lists: [],
        nothing: false,
        nonetwork: false
    },
    methods: {
        LinkHistorydetail: function(id){
            
            appcan.locStorage.setVal("delayHistoryID", id);
            
            if(platForm == "1"){
                appcan.window.open('delay-detail', 'delay-detail.html', 2);
            }else{
                appcan.window.open({
                    name:'delay-detail',
                    dataType:0,
                    data:'delay-detail.html',
                    aniId:0,
                    type:1024
                });  
            }
        }
    },
    filters: {
        formatDateDesc: function (value) {
            var d = new XDate(value*1000),
                year  = d.getFullYear(),
                month = d.getMonth() < 10 ? '0'+d.getMonth(): d.getMonth(),
                day   = d.getDate() < 10 ? '0'+d.getDate(): d.getDate(),
                hours = d.getHours() < 10 ? '0'+d.getHours(): d.getHours(),
                min   = d.getMinutes() < 10 ? '0'+d.getMinutes(): d.getMinutes();
            return year+'-'+month+'-'+day+' '+hours+':'+min;
        },
        formatDateTitle: function (value) {
            var d = new XDate(value*1000),
                year  = d.getFullYear(),
                month = d.getMonth() < 10 ? '0'+d.getMonth(): d.getMonth(),
                day   = d.getDate() < 10 ? '0'+d.getDate(): d.getDate();
            return year+''+month+''+day;
        },
        formatText: function (num) {
            var text;
            switch (num){
                case 1: 
                    text = '红色预警';
                    break;
                case 2: 
                    text = '橙色预警';
                    break;
                case 3: 
                    text = '黄色预警';
                    break;
                case 4: 
                    text = '蓝色预警';
                    break;
            }
            return text;
        }
    }
});


(function($) {
    
    appcan.button("#nav-left", "btn-act", function() {
        appcan.window.close(1);
    });

    appcan.ready(function() {
       
        getDelayHistory();
       
        //如果是ios设备，设置向右滑动关闭页面
        var platFormC = appcan.locStorage.getVal("platForm");
        uexWindow.setIsSupportSwipeCallback(JSON.stringify({
            isSupport: (platFormC == "1") ? false : true
        }));
        uexWindow.onSwipeRight = function(){
            appcan.window.close(1);
        };
       
    });
    
})($);



function getDelayHistory () {
    var json={
        path:serverPath+'focDelayController.do?focGetHistoryDelay',
        data:{}
    };
    console.log(json)
    ajaxRequest(json,function(data,e){
        console.log(data);
        if(e=="success"){
            if (data.obj.length == 0) {
                vm.nothing = true;
            } else {
                vm.lists = vm.lists.concat(data.obj)
            }
        } else {
            vm.nonetwork = true;
        }
    });
    
};
