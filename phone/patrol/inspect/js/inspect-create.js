/**
 * Created by KC on 2017/12/22.
 */
var vm = new Vue({
    el: '#app',
    data: {
        items:{},
        path:mainPath
    },
    methods: {
        //选中标准
        isChoose: function (index,i) {
            if(this.items.standardList[index].list[i].exit) {
                layerToast('该标准已生成整改单!');
                return;
            }
            this.items.standardList[index].list[i].choose = !this.items.standardList[index].list[i].choose
        },
        //跳转到派发整改单界面
        appoint: function () {
            var flag = this.items.standardList.some(function (ele) {
                return ele.list.some(function (i) {
                    return i.choose
                })
            });
            if(!flag){
                layerToast('未选择不符合项!');
                return
            }
            var creatReform = JSON.stringify(vm.items);
            localStorage.setItem('patrol-creatReform',creatReform);
            localStorage.removeItem('patrol-chooseDepartName');
            openWindow("inspect-appoint", "inspect-appoint.html", "");
        },
        //点击图片全屏浏览
        openPic: function (index, i, k) {
            var that = this;
            var picArr = [];
            picArr = that.items.standardList[index].list[i].pictureList.map(function (val) {
                return mainPath + val
            });
            picView(k, picArr)
        }
    },
    created: function () {
        var inspectObj = JSON.parse(localStorage.getItem('patrol-inspectToReform'));
        for (var i = 0; i < inspectObj.standardList.length; i++) {
            var obj = inspectObj.standardList[i].list;
            for (var j = 0; j < obj.length; j++) {
                var obj1 = obj[j];
                obj1.choose = false;
                if(obj1.isSuitable=='符合'){
                    obj.splice(j--,1)
                }
            }
            if (obj.length==0){
                inspectObj.standardList.splice(i--,1)
            }
        }
        this.items = inspectObj
    }
});
(function ($) {
    appcan.ready(function () {
        //返回
        appcan.button("#nav-left", "btn-act", function () {
            appcan.window.close(1);
        });
    })
})($);