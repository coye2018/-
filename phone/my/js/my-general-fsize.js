(function($) {
    appcan.button("#nav-left", "btn-act",
    function() {
        appcan.window.close(1);
    });
    appcan.button("#nav-right", "btn-act",
    function() {});

    appcan.ready(function() {
        function stopSlide(f){
            var platFormC = appcan.locStorage.getVal("platForm");
            var isSupport = f;
            if(platFormC=="1"){
                isSupport = false;
            }
            var paramClose = {
                isSupport: isSupport
            };
            uexWindow.setIsSupportSwipeCallback(JSON.stringify(paramClose));
            uexWindow.onSwipeRight = function(){
                if(isSlide==0){
                    appcan.window.close(-1);
                }
            };
        }
        appcan.window.publish("my-general-click","my-general-click");
        stopSlide(true);
        
    });
    
    //滑动控件的封装
    ;(function($){
        var defaults = {
            step: '1',
            min: '0',
            max: '100',
            value: '50',
            scale: '-1'
        };
        var options = {};
        
        var methods = {
            init: function(opt){
                var options = $.extend(defaults, opt);
                return this.each(function(){
                    var _obj = $(this), _opt = options;
                    var slider = _obj.find('input[type=range]');
                    
                    if(!slider.length){
                        _obj.append('<input type="range" />');
                        slider = _obj.find('input[type=range]');
                    }
                    slider.addClass('range').attr(_opt);
                    
                    if(_opt.scale>-1){
                        var scalebox = 'range-scale-box',
                            scaleboxStr = '<div class="'+scalebox+'"></div>';
                        _obj.prepend(scaleboxStr);
                        
                        var scLength = _opt.max-_opt.min,
                            scPart = scLength/_opt.scale;
                        if(scLength%_opt.scale || _opt.scale%1){
                            layerToast('抱歉，滑动条的参数scale不符合要求。');
                            return false;
                        }else if(scPart>33){
                            layerToast('标记过于密集, 请选取大一点的scale值。');
                            return false;
                        }
                        for(var i=0; i<=scPart; i++){
                            var scaleper = (i*100/scPart)+'%';
                            $('.'+scalebox).append('<span class="range-scale" style="left:'+scaleper+';"></span>');
                        }
                    }
                });
            }
        };
        
        $.fn.rangeSlider = function(method){
            if(methods[method]){
                return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
            }else if(typeof method === 'object' || !method){
                return methods.init.apply(this, arguments);
            }else {
                layerToast('抱歉，该滑动条没有这种操作。');
            }
        };
    })(Zepto);
    
    var fontdeg = appcan.locStorage.getVal('fontDegree');
    $('.range-box').rangeSlider({
        step: '1',
        min: '1',
        max: '3',
        value: fontdeg,
        scale: '1'
    }).find('input[type=range]').on('input', function(){
        //console.log(this.value);
        appcan.locStorage.setVal('fontDegree', this.value);
        quanjuFontsize();
        
        appcan.window.publish('fontsize', this.value);
    });
    
})($);
