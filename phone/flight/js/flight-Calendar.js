function initCanlendar (globledate) {
    console.log(globledate)
// 初始化全局的年月日
    var sev_y = globledate.y,
        sev_m = globledate.m,
        sev_d = globledate.d;

// 存储点击后的日期  [y,m,d]
    var selectMark = [globledate.y, globledate.m, globledate.d];
    getAjaxData(globledate.y, globledate.m, globledate.d);


    /**
     * 获取当前日期年月日
     * @param null
     * return YYYY/MM/DD
     */
    function getYMD() {
        var dd = new Date();
        var y = dd.getFullYear();
        var m = dd.getMonth();
        var d = dd.getDate();
        return [y, m, d];
    }

    /**
     * 设置指定年月日Date对象
     * @param Number y & m & d 年 月 日
     * return Object 设置日期后的Date对象
     */
    function setCustomDate(y, m, d) {
        return new Date().setFullYear(y, m, d);
    }

    /**
     * 设置指定日Date对象
     * @param String | Number dd 时间戳或日期
     * @param Number addDays 当前日期前后的天数
     * return Object Date对象
     */
    function setCustomDateByDay(cd, addDays) {
        var dd = new Date(cd);
        dd.setDate(dd.getDate() + addDays);
        return dd;
    }


    /**
     * 获取农历及节假日名称
     * @param String | Number Y, M, D
     * return Object LunarName
     */
    function getLunarName (Y, M, D) {
        var lunarObj = LunarCalendar.solarToLunar(Y, M, D);
        return lunarObj.term || lunarObj.solarFestival || lunarObj.lunarFestival || lunarObj.lunarDayName;
    }


    /**
     * 渲染整月日历
     * @param Number a 日历第一天的周几
     * @param Number | String b 年
     * @param Number | String c 月
     * @param String e Element id
     * return false
     */
    function get_first(a, b, c, e) {
        c += 1;
        var yl = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        var str = '';
        if ((c - 2) < 0) {
            var ldays = 31;
            var lm = 12;
            var lb = b - 1;
        } else {
            var ldays = yl[c - 2];
            var lm = c - 1;
            var lb = b;
        }
        if (ldays == 28) {
            if ((lb % 4 == 0 && lb % 100 != 0) || (lb % 100 == 0 && lb % 400 == 0)) {
                ldays = 29;
            }
        }

        if (c == 12) {
            var xdays = 31;
            var xm = 1;
            var xb = b + 1;
        } else {
            var xdays = yl[c];
            var xm = (c * 1) + 1;
            var xb = b;
        }
        if (xdays == 28) {
            if ((xb % 4 == 0 && xb % 100 != 0) || (xb % 100 == 0 && xb % 400 == 0)) {
                xdays = 29;
            }
        }

        var dd;
        if (yl[c - 1] == 28) {
            if ((b % 4 == 0 && b % 100 != 0) || (b % 100 == 0 && b % 400 == 0)) {
                dd = 29;
            } else {
                dd = 28;
            }
        } else {
            dd = yl[c - 1];
        }


        for (var i = a; i > 0; i--) {
            var bday = ldays - i + 1;
            var fly = getLunarName(lb, lm, bday);

            str += '<div class="switch-day-color switch-item ub ub-pc calendar-week-color js-item" data_y="' + lb + '" data_m="' + lm + '" data_d="' + bday + '">';
            str += '<div class="switch-unit">';
            str += '<div class="switch-unit-box ub ub-ver ub-pc">';
            str += '<div class="switch-day">';
            str += '<span class="fz-md">'+ bday +'</span>';
            str += '</div>';
            str += '<div class="switch-name">';
            str += '<span class="fz-xs">'+ fly +'</span>';
            str += '</div>';
            str += '</div>';
            str += '</div>';
            str += '</div>';
        }

        var nowDate = getYMD();
        for (var i = 1; i <= dd; i++) {
            var bday = ldays - i + 1;
            var ly = getLunarName(b, c, i);

            var jd = "";
            var hb = b + "-" + c + "-" + i;

            var daysWeek = new Date(b, c - 1, i).getDay();

            var daysClass = ['switch-item', 'ub', 'ub-pc', 'js-view', 'js-item'];

            if (nowDate[2] == i &&  nowDate[0] == b && c == nowDate[1]+1) {
                daysClass.push("current");
            }

            if (selectMark[2] == i &&  selectMark[0] == b && c == selectMark[1]+1) {
                daysClass.push("actives");
            }

            str += '<div class="'+ daysClass.join(' ') +'" data_y="' + b + '" data_m="' + c + '" data_d="' + i + '">';
            str += '<div class="switch-unit">';
            str += '<div class="switch-unit-box ub ub-ver ub-pc">';
            str += '<div class="switch-day">';
            str += '<span class="fz-md">'+ i +'</span>';
            str += '</div>';
            str += '<div class="switch-name">';
            str += '<span class="fz-xs">'+ ly +'</span>';
            str += '</div>';
            str += '</div>';
            str += '</div>';
            str += '</div>';
        }

        var last = 42 - a - dd;
        for (var i = 1; i <= last; i++) {
            var lly = getLunarName(xb, xm, i);

            str += '<div class="switch-day-color switch-item ub ub-pc calendar-week-color js-item" data_y="' + xb + '" data_m="' + xm + '" data_d="' + i + '">';
            str += '<div class="switch-unit">';
            str += '<div class="switch-unit-box ub ub-ver ub-pc">';
            str += '<div class="switch-day">';
            str += '<span class="fz-md">'+ i +'</span>';
            str += '</div>';
            str += '<div class="switch-name">';
            str += '<span class="fz-xs">'+ lly +'</span>';
            str += '</div>';
            str += '</div>';
            str += '</div>';
            str += '</div>';
        }

        document.getElementById(e).innerHTML = str;
    };


    /*
     * 无需传入参数
     * 自动获取全局sev_y, sev_m, sev_d 渲染上月，今月，下月数据
     * 函数内调用get_first() 生成html数据
     */
    function createDateInHtml () {
        ;(function () {
            var nowweak = new Date(sev_y, sev_m, 1).getDay();
            if (nowweak == 0) nowweak = 7;
            get_first(nowweak, sev_y, sev_m, "d2");
            // console.log(nowweak, sev_y, sev_m, sev_d, "d3")
        })();

        ;(function () {
            var dateM = sev_m + 1;
            var dateY = sev_y;
            if (dateM > 11) {
                dateM = 0;
                dateY += 1;
            }
            nowweak = new Date(dateY, dateM, 1).getDay();
            if (nowweak == 0) nowweak = 7;
            get_first(nowweak, dateY, dateM, "d3");
            // console.log(nowweak, dateY, dateM, 1, "d3");
        })();

        ;(function () {
            var dateM = sev_m - 1;
            var dateY = sev_y;
            if (dateM < 0) {
                dateM = 11;
                dateY = sev_y - 1;
            }
            nowweak = new Date(dateY, dateM, 1).getDay();
            if (nowweak == 0) nowweak = 7;
            get_first(nowweak, dateY, dateM, "d1");

        })();
        $("#ymym").html(sev_y + "年" + (sev_m+1) + "月");
    };

    /**
     * 整月日历切换
     * Swiper初始化后自动执行onSlideChangeEnd渲染日期
     */
    ;(function () {
        var monthSwiper = new Swiper('.js-month', {
            initialSlide: 1,
            speed: 400,
            followFinger: false,
            noSwiping: true,
            onSlideChangeStart: function(swiper) {
                swiper.lockSwipes();
            },
            onSlideChangeEnd: function(swiper) {
                // 按索引判断左滑|右滑
                var swiperSlideActive = $(".js-month .swiper-slide-active").index();
                if (swiperSlideActive == 2) { sev_m = (sev_m * 1) + 1; }
                if (swiperSlideActive == 0) { sev_m = (sev_m * 1) - 1; }

                if (sev_m > 11) {
                    sev_m = 0;
                    sev_y++;
                } else if (sev_m < 0) {
                    sev_m = 11;
                    sev_y--;
                }
                createDateInHtml();
                // if (swiperSlideActive != 1) {
                //     // $("#d2").find(".js-view").eq(0).trigger("click");
                // }
                swiper.unlockSwipes();
                swiper.slideTo(1, 0, false);
            }
        });
    })();
// 请求数据
    function getAjaxData(Y, M, D) {
        var selectMark = [Y, M+1, D];
        var dateChange=selectMark.join("-");
        appcan.window.publish("dada",dateChange);
        appcan.locStorage.setVal("xDate",dateChange);
        // console.log(dateChange);
        return dateChange;
    };

// 判断只允许访问三天内数据
    function getDay(day){
        var today = new Date();
        var targetDay=today.getTime() + 1000*60*60*24*day;
        today.setTime(targetDay);
        var tYear = today.getFullYear();
        var tMonth = today.getMonth();
        var tDate = today.getDate();
        tMonth = tMonth + 1;
        return tYear+"-"+tMonth+"-"+tDate;
    }

// 返回今天
    $(".js-return-today").click(function() {
        var today = getYMD(),
            todayY = today[0],
            todayM = today[1],
            todayD = today[2];
        sev_y = todayY,
            sev_m = todayM,
            sev_d = todayD,
        selectMark = [todayY, todayM, todayD];

        // 渲染日期
        createDateInHtml();
        getAjaxData(todayY, todayM, todayD);
        console.log(getAjaxData(todayY, todayM, todayD))
    });
// 月日历选择
    $('.js-month').on('click', '.js-item', function() {
        // if (self.hasClass('switch-day-color')) { return; }
        var self = $(this);
        weekY = parseInt(self.attr('data_y'));
        weekM = parseInt(self.attr('data_m'))-1;
        weekD = parseInt(self.attr('data_d'));
        selectMark = [weekY, weekM, weekD];

        $('.js-month').find(".js-item").removeClass('actives');
        self.addClass('actives');
        getAjaxData(weekY, weekM, weekD);
//查询航班近三天的数据
//         var timer = timeStemp(new Date(),'yyyy-MM-dd').date;
        var clickT = getAjaxData(weekY, weekM, weekD).replace(/\-/g, '/');
        var clickT1=new Date(clickT);
        var clickT2 = clickT1.getTime();
        console.log(clickT2)
        var Get1 =getDay(-3).replace(/\-/g, '/');
        var Get2 =getDay(3).replace(/\-/g, '/');
        var get1=(new Date(Get1)).getTime();
        var get2=(new Date(Get2)).getTime();
        // alert(get1+"----"+get2+"----"+clickT2)
        if(clickT2<get1||clickT2>get2){
            layerToast('系统仅支持查询最近三天的数据。');
        }else{
            appcan.window.close(-1);
        }

    });

    $(".js-week").css("height","0px");
    $(".js-month").css("height","auto");
}

