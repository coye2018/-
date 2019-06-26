var vm = new Vue({
    el: '#duty_four_notice',
    data: {
        nt: [
            {
                title: '如何开始当天的四必巡查？',
                content: '进入APP功能页-四必执行，然后点击页面底部的“开始巡查”按钮即可开始执行当天的四必。如果您看不到“开始巡查”按钮，请确保贵单位昨天或更早的四必执行结果已提交，如果有未提交的四必执行，则系统将不会显示“开始巡查”按钮。'
            },{
                title: '当我到达必到地点时要如何签到？',
                content: '当到达必到地点时，您可以拍照上传巡查情况，在您拍照时，系统会自动定位并在图片上加上您当前位置的水印，您不必手动进行签到，只要拍照上传即可。'
            },{
                title: '“暂存草稿”功能是什么？要怎么使用？',
                content: '“暂存草稿”功能是指您在巡查时录入了巡查情况但并未完成改条目的巡查，而不希望提交只希望暂存时使用。当您点击“暂存草稿”功能后，系统会保存您录入的文字信息以及图片信息到手机缓存，而不会提交，接下来您可以继续编辑、暂存或是提交。'
            },{
                title: '交班时我要如何提交自己的四必执行结果？',
                content: '交班时您只需要点击四必执行主页面底部的交班按钮即可交班并提交今天的四必执行结果，在提交时，系统会自动校验您的四必执行情况，如果有未完成的条目，系统会提醒您继续完成，等完成后再提交。'
            }
        ]
    },
    methods: {
        
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
    
})($);