(function($) {
    appcan.ready(function() {
        var t = appcan.locStorage.getVal('chat-dialog-scale');
        $('#txt').html(t);
        
        $('.dlg').on('tap', function(){
            appcan.window.publish("resetChatDialogBounce","resetChatDialogBounce");
            appcan.window.closePopover('chat-dialog-scale');
            
        });
    });
})($);