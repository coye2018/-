$("#fromAlbum").on('click', function() {
    var json = {
        min: 1,
        max: 1,
        quality: 0.5,
        detailedInfo: true
    };
    uexImage.openPicker(json, function(error, data) {
        if (error == -1) {} else if (error == 0) {
            var param = {
                src: data.data[0],
                target: "wgts://"
            };
            uexFileMgr.copy(param, function() {
                if (!error) {
                    //平台版本0：IOS；1：Android;
                    var platForm = appcan.locStorage.getVal("platForm");
                    if (isDefine(platForm)) {
                        if (platForm == "1") {
                            appcan.locStorage.setVal("chatbg", "/storage/emulated/0/widgetone/widgets/" + data.data[0].split("/")[data.data[0].split("/").length - 1]);
                        } else {
                            var realPath = uexFileMgr.getFileRealPath("wgts://"+ data.data[0].split("/")[data.data[0].split("/").length - 1]);
                            appcan.locStorage.setVal("chatbg", realPath);
                             
                        }
                    } else {
                        appcan.locStorage.setVal("chatbg", "/storage/emulated/0/widgetone/widgets/" + data.data[0].split("/")[data.data[0].split("/").length - 1]);
                    }
                    layerToast("设置成功！");
                    appcan.window.publish('my-general-bg-name', '');
                }
            });
        }
    });
});
$("#fromCamera").on('click', function() {
    uexCamera.open(0, 99, function(filePath) {
        appcan.locStorage.setVal("chatbg", filePath);
        layerToast("设置成功！");
        appcan.window.publish('my-general-bg-name', '');
    })
})