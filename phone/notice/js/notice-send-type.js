var vm = new Vue({
    el: '#sendtype_container',
    data: {
        sendtypeData: []
            // {groupName: '全员发送', total: 321, sendtypeshort: '全员',type:1},
            // {groupName: '只发给值班人员',total: 22, sendtypeshort: '值班人员',type:2},
            // {groupName: '我要自己选择',total: -1, sendtypeshort: '',type:0}}
    },
    methods: {
        returnPickData: function(itm){
            var str = JSON.stringify(itm);
            appcan.locStorage.setVal('noticesendtype', str);
            appcan.window.publish('notice-send', str);
            
            if(itm.total>=0){
                appcan.window.close(1);
            }else{
                appcan.locStorage.setVal('address-pick-from', 'notice-send-inside');
                if(appcan.locStorage.getVal('platForm')=='1'){
                    //Android
                    appcan.window.open('address-pick', '../address/address-pick.html', 2);
                }else{
                    appcan.window.open({
                        name: 'address-pick',
                        dataType: 0,
                        data: '../address/address-pick.html',
                        aniId: 0,
                        type: 1024
                    });  
                }
            }
        }
    }
});

(function($) {
    appcan.button("#nav-left", "btn-act",
    function() {
        appcan.window.close(1);
    });
    appcan.button("#nav-right", "btn-act",
    function() {});

    appcan.ready(function() {
        var nst = appcan.locStorage.getVal('noticesendtype');
        
        //监听从address-pick publish的分组名
          appcan.window.subscribe('notice-send-inside', function(){
            appcan.window.close(1);
        });
        
        /*
        if(isDefine(nst)){
            var nstJson = JSON.parse(nst);
            $('.lists-box').each(function(i, n){
                if(n.dataset.value==nstJson.sendtype){
                    $(n).find('.lists-item-right').removeClass('hide');
                }
            });
        }*/
        
        loadNoticeType();
        appcan.window.publish('pick-send-click', 'pick-send-click');
        
        appcan.window.subscribe('notice-send-inside', function(){
            appcan.window.close(1);
        });
        
        var platFormC=appcan.locStorage.getVal("platForm");
        var isSupport=true;
        if(platFormC=="1"){
            isSupport=false;
        }
        var paramClose = {
            isSupport:isSupport
        };
        uexWindow.setIsSupportSwipeCallback(JSON.stringify(paramClose));
        uexWindow.onSwipeRight = function(){
            appcan.window.close(1);
        }
    });
    
    //单选
    $('.lists-radio').on('click', '.lists-box', function(){
        var that = $(this),
            thatval = that.data('value'),
            thatnum = 0,
            hid = 'hide';
        
        that.siblings().find('.lists-item-right').addClass(hid);
        if(isDefine(thatval)){
            that.find('.lists-item-right').removeClass(hid);
        }
    });
    
})($);
function loadNoticeType(){
    var json={
        path:serverPath+'focCommonController.do?focgetPeopleNum',
        data:{}
    }
    ajaxRequest(json,function (data,e){
        console.log(data);
        if(e=="success"){
            // console.log(data);
            var other = {groupName: '我要自己选择',total: -1, sendtypeshort: '',type:0};
            data.obj.push(other);
            vm.sendtypeData = data.obj;
           
            for (var i=0; i < data.obj.length; i++) {  
                
                if(data.obj[i].type==1){
                    
                   vm.sendtypeData[i].sendtypeshort = '全员';
                                 
                   }else if(vm.sendtypeData[i].type==2){
                       
                    vm.sendtypeData[i].sendtypeshort = '值班人员'; 
                           
                    }
            };
    
        }
    })
}
