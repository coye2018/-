/*
 * 调用方法 $('最好是单独一个class名或者id名').prog();
 * 
 * 可传参数:
 * total: 总数
 * normal: 正常数
 * normalBg: 正常数对应进度条的背景色样式, 可传一个class名, 也可直接传带#的6位Hex序列
 * abnormal: 异常数(选填, 默认0)
 * abnormalBg: 异常数对应进度条的背景色样式(选填)
 * hastext: 是否显示完成率(选填, 默认true)
 * textstyle: 完成率显示形式(选填, 默认'scale'. 'scale'分数, 'percent'百分比)
 * 
 */
;(function($){
    var defaults = {
        total: 20,
        normal: 12,
        normalBg: 'bg-main',
        abnormal: 0,
        abnormalBg: 'bg-abnormal',
        hastext: true,
        textstyle: 'scale'
    };
    var opt = {};
    
    //字符串str是否含有指定字符串str_target
    var hasThisString = function(str, str_target){
        if(typeof str==='string' || typeof str_target==='string'){
            return str.indexOf(str_target)>-1;
        }else{
            return false;
        }
    };
    
    var getPercent = function(fenzi, fenmu, xiaoshuwei){
        fenzi = parseFloat(fenzi);
        fenmu = parseFloat(fenmu) || 1;
        xiaoshuwei = Math.ceil(xiaoshuwei) || 0;
        if(xiaoshuwei <0 || xiaoshuwei >20) xiaoshuwei = 0;
        
        var results = (fenzi*100/fenmu).toFixed(xiaoshuwei);
        if(results>100) results = 100;
        
        return results+'%';
    };
    
    //结构类似这样
    //<div class="prog prog-1-0">
    //    <div class="prog-case">
    //        <div class="prog-item"></div>
    //        <div class="prog-item bg-abnormal"></div>
    //    </div>
    //    <div class="prog-text">
    //        <span class="fz-md fc-text">12/18</span>
    //    </div>
    //</div>
    
    var methods = {
        init: function(options){
            opt = $.extend({}, defaults, options);
            return this.each(function(){
                var prog = $(this);
                
                var dom_first = '<div class="prog-case"><div class="prog-item"></div></div>';
                prog.empty().append(dom_first);
                
                var prog_case = prog.find('.prog-case'),
                    prog_item = prog_case.find('.prog-item'),
                    prog_item_nor = prog_item.eq(0),
                    prog_item_abn = null;
                
                if(hasThisString(opt.normalBg, '#')){
                    prog_item_nor.css({'background-color': opt.normalBg});
                }else{
                    prog_item_nor.addClass(opt.normalBg);
                }
                
                if(opt.abnormal!=0 && opt.abnormal<=opt.total-opt.normal){
                    var dom_abn = '<div class="prog-item"></div>';
                    prog_case.append(dom_abn);
                    
                    prog_item = prog_case.find('.prog-item');
                    prog_item_abn = prog_item.eq(1);
                    
                    if(hasThisString(opt.abnormalBg, '#')){
                        prog_item_abn.css({'background-color': opt.abnormalBg});
                    }else{
                        prog_item_abn.addClass(opt.abnormalBg);
                    }
                }else if(opt.abnormal>opt.total-opt.normal){
                    ///console.log('数据有误，请自行排查。');
                }
                
                prog_item_nor.css({'width': getPercent(opt.normal, opt.total)});
                
                if(opt.abnormal!=0 && opt.abnormal<=opt.total-opt.normal){
                    prog_item_abn.css({'width': getPercent(opt.abnormal, opt.total)});
                }
                
                if(opt.hastext){
                    var dom_text = '<div class="prog-text"><span class="fz-md fc-text"></span></div>';
                    prog.append(dom_text);
                    
                    var prog_text = prog.find('.prog-text span');
                    var txt = '';
                    
                    if(opt.textstyle == 'scale'){
                        txt = (opt.normal+opt.abnormal)+'/'+opt.total;
                    }else if(opt.textstyle == 'percent'){
                        txt = getPercent((opt.normal+opt.abnormal), opt.total);
                    }
                    
                    prog_text.text(txt);
                }
            });
        },
        set: function(options){
            opt = $.extend({}, opt, options);
            
            return this.each(function(){
                var prog = $(this),
                    prog_case = prog.find('.prog-case'),
                    prog_item = prog_case.find('.prog-item'),
                    prog_item_nor = prog_item.eq(0),
                    prog_item_abn = null;
                
                if(prog_item.length>1){
                    prog_item_abn = prog_item.eq(1);
                }
                
                prog_item_nor.css({'width': getPercent(opt.normal, opt.total)});
                
                if(opt.abnormal!=0 && opt.abnormal<=opt.total-opt.normal){
                    prog_item_abn.css({'width': getPercent(opt.abnormal, opt.total)});
                }
            });
        },
        destroy: function(){
            return this.each(function(){
                $(this).remove();
            });
        }
    };
    
    $.fn.prog = function(method){
        if(methods[method]){
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }else if(typeof method === 'object' || !method){
            return methods.init.apply(this, arguments);
        }else {
            layerToast('抱歉，进度条初始化不成功。');
        }
    };
})(Zepto);

/*
 * 调用方法 $('最好是单独一个class名或者id名').pie();
 * 
 * 必传参数:
 * status: 0是未开始, 1是正在执行, 2是已提交, 3是未提交
 * 
 * 可传参数:
 * percent: 百分比
 * text: 各种状态对应的文本显示
 * class: 普通状态、高亮状态对应的文本class
 * 
 */
;(function($){
    var defaults = {
        'status': 0,
        'percent': 0,
        'text': ['未开始', '', '已提交', '未提交'],
        'class': ['pie-text-no', 'pie-text-yes']
    };
    var opt = {};
    
    var domStar = '<div class="pie-stars"></div>';
    
    var handleData = function(opi, sta, per) {
        var obj = {
            'strStar': '',
            'labelStyle': opi.class[0],
            'rotateLeftStyle': '',
            'rotateRightStyle': '',
            'labelText': opi.text[sta]
        };
        
        switch (sta) {
            case 0:
                //未开始
                obj.strStar = domStar;
                break;
            case 1:
                //正在执行
                obj.strStar = domStar;
                
                if (per >= 0 && per <= 180) {
                    obj.rotateRightStyle = 'transform: rotate(' + per + 'deg); -webkit-transform: rotate(' + per + 'deg)';
                } else if (per > 180 && per <= 360) {
                    obj.rotateRightStyle = 'transform: rotate(180deg); -webkit-transform: rotate(180deg)';
                    obj.rotateLeftStyle = 'transform: rotate(' + (per-180) + 'deg); -webkit-transform: rotate(' + (per-180) + 'deg)';
                } else {
                    obj.console.log('百分比输入有误, 您的输入为' + per + '。');
                }
                break;
            case 2:
                //已提交
                opi.per = 100;
                obj.rotateRightStyle = 'transform: rotate(180deg); -webkit-transform: rotate(180deg)';
                obj.rotateLeftStyle = 'transform: rotate(180deg); -webkit-transform: rotate(180deg)';
                obj.labelStyle = opi.class[1];
                break;
            case 3:
                //未提交
                obj.labelStyle = opi.class[0];
                break;
        }
        
        return obj;
    };
    
    //结构类似这样
    //  <div class="pie">
    //      <div class="pie-container">
    //          <div class="pie-content-left">
    //              <div class="pie-left"></div>
    //          </div>
    //          <div class="pie-content-right">
    //              <div class="pie-right"></div>
    //          </div>
    //          <div class="pie-stars"></div>
    //          <div class="pie-text-content"></div>
    //      </div>
    //  </div>
    
    var methods = {
        init: function(options) {
            opt = $.extend({}, defaults, options);
            return this.each(function() {
                var pie = $(this),
                    status = Number(opt.status),
                    percent = Number(opt.percent) * 3.6;
                
                var res = handleData(opt, status, percent);
                
                var dom_first = '<div class="pie-container">'+
                                    '<div class="pie-content-left">'+
                                        '<div class="pie-left" style="' + res.rotateLeftStyle + '"></div>'+
                                    '</div>'+
                                    '<div class="pie-content-right">'+
                                        '<div class="pie-right" style="' + res.rotateRightStyle + '"></div>'+
                                    '</div>'+
                                    res.strStar+
                                    '<div class="pie-text-content ' + res.labelStyle + '">'+
                                        res.labelText+
                                    '</div>'+
                                '</div>';
                
                pie.empty().append(dom_first);
                this.dataset.percent = opt.percent;
            });
        },
        set: function(options) {
            opt = $.extend({}, opt, options);
            
            return this.each(function(){
                var pie = $(this),
                    status = Number(opt.status),
                    percent = Number(opt.percent) * 3.6;
                
                
            });
        },
        destroy: function() {
            return this.each(function(){
                $(this).remove();
            });
        }
    };
    
    $.fn.pie = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            //layerToast('抱歉，饼状图初始化不成功。');
        }
    };
})(Zepto);