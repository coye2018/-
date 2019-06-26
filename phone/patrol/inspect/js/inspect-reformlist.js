/**
 * Created by KC on 2018/1/16.
 */
var vm = new Vue({
    el: '#app',
    data: {
        items: {},
        path: mainPath
    },
    methods: {
        back: function () {
            appcan.window.close(1);
        },
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
        var reformObj = JSON.parse(localStorage.getItem('patrol-creatReform'));
        //console.log(localStorage.getItem('patrol-creatReform'));
        for (var i = 0; i < reformObj.standardList.length; i++) {
            var obj = reformObj.standardList[i].list;
            for (var j = 0; j < obj.length; j++) {
                var obj1 = obj[j];
                if (obj1.choose == false) {
                    obj.splice(j--, 1)
                }
            }
            if (obj.length == 0) {
                reformObj.standardList.splice(i--, 1)
            }
        }
        this.items = reformObj
    }
});