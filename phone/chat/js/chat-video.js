(function($) {
    appcan.ready(function() {
        var videoURL = appcan.locStorage.getVal('videoUrl');
                var videoPIC = appcan.locStorage.getVal('poster');
                
                var sourceDom = $('<source/>');
                sourceDom.attr({
                    'src': videoURL,
                    'type': 'video/mp4'
                });
                var videoDom = $('<video/>');
                videoDom.attr({
                    'id': 'my-video',
                    'poster': videoPIC,
                    'webkit-playsinline':true
                });
                var divDom = $('<div/>');
                divDom.attr({
                    'class': 'zy_media'
                });
                $('body').append(divDom);
                $('.zy_media').append(videoDom);
                $('#my-video').append(sourceDom);
                
                zymedia('video', {
                    'videoHeight': '100%',
                    'preload': 'metadata',
                    'enableFullscreen': false
                });
        
        
         
    });
    
})($);