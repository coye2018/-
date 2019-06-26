(function($) {
    appcan.ready(function() {
        
        appcan.button("#nav-left", "btn-act", function() {
            appcan.window.close(1);
        });
        
        var videoURL = appcan.locStorage.getVal('videoUrl'),
            videoName = appcan.locStorage.getVal('videoName'),
            videoPIC = appcan.locStorage.getVal('poster'),
            videoPath = 'wgt://'+ videoName;
        
        uexWindow.setInlineMediaPlaybackEnable(true);
        
        if (videoURL.indexOf("https") == -1) {
            createMedia(videoURL, videoPIC);
        } else {
            appcan.file.exists({
                filePath: videoPath,
                callback: function(err ,data, dataType, optId){
                    if(err){
                        //判断文件出错了
                        return;
                    }
                    if(data == 1){
                        //文件存在
                        getFilePath();
                    }else{
                        //文件不存在
                        downloadVideo();
                    }
                }
            });
        };
        
        function downloadVideo () {
            var downloader = uexDownloaderMgr.create();
            if (downloader) {
                uexDownloaderMgr.download(downloader, videoURL, videoPath, 1, function (fileSize, percent, status) {
                   if(status == 0){
                        // 下载中
                   }else if(status == 1){
                       // 下载完成
                       getFilePath();
                   }else{
                       // 下载发生错误
                   }
                });
            } else {
            }
        };
        
        function getFilePath() {
            var realPath = uexFileMgr.getFileRealPath(videoPath);
            createMedia(realPath, videoPIC)
        };     
        
    });
})($);

 
function createMedia (videoUrl, videoPIC) {
    
    var titleHeight = parseInt($('#Header').outerHeight()),
        pageWidth = parseInt($('#Page').width()),
        pageHeight = parseInt($('#Page').height());
    
    $('#ScrollContent').css({
        width: pageWidth,
        height: pageHeight
    });
        
    var mediaStr = '<video id="my-video" class="video-js" style="overflow:hidden;" controls x-webkit-airplay="true" webkit-playsinline playsinline="true" preload="none"';
        mediaStr += 'width="'+ pageWidth +'"';
        mediaStr += 'height="'+ (pageHeight - titleHeight) +'"';
        mediaStr += 'poster="'+ videoPIC +'"';
        mediaStr += 'data-setup="{}">';
        mediaStr += '<source src="'+ videoUrl +'" type="video/mp4">';
        mediaStr += '</video>';
    $('#ScrollContent').append(mediaStr);
     
    var options = {};
    var player = videojs('my-video', options, function onPlayerReady() {
      videojs.log('Your player is ready!');
      // In this context, `this` is the player that was created by Video.js.
         // this.play();
      // How about an event listener?
      // this.on('ended', function() {
        // videojs.log('Awww...over so soon?!');
      // });
    });
};  


