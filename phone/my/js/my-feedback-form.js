(function($) {
    appcan.button("#nav-left", "btn-act",
    function() {
        appcan.window.close(1);
    });
    appcan.button("#nav-right", "btn-act",
    function() {});

    var platFormC=appcan.locStorage.getVal("platForm");
    appcan.ready(function() {
        var titleHeight = parseFloat($('#Header').height()),
            footerHeight = parseFloat($('#Footer').height()),
            pageHeight = parseFloat($('#Page').height()),
            pageWidth = parseFloat($('#Page').width());
        
        appcan.window.openPopover({
            name: 'my-feedback-form-page',
            url: 'my-feedback-form-page.html',
            left: 0,
            top: titleHeight,
            width: pageWidth,
            height: pageHeight-titleHeight-footerHeight
        });
        
        appcan.button("#handin", "btn-act", function() {
            appcan.window.publish('my-feedback-form-page', '1');
        });
        
        appcan.window.subscribe('my-feedback-form-shade', function(msg){
            var shade = $('.shade'), cls = 'shade-hide';
            msg=='0'?shade.addClass(cls):shade.removeClass(cls);
        });
        
        var isSupport=true;
        if(platFormC=="1"){
            isSupport=false;
        }
        var paramClose = {
            isSupport:isSupport
        };
        uexWindow.setIsSupportSwipeCallback(JSON.stringify(paramClose));
        uexWindow.onSwipeRight = function(){
             appcan.window.close(-1); 
        }
    });
})($);
