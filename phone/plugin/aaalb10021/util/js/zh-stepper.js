Vue.component('zh-stepper', {
    data: function() {
        return {
            element: {},
            timer: {},
            startTime: 0,
            events: {}
        }
    },
    props: {
        count: {
            type: Number,
            required: true
        },
        isread: {
            type: Boolean,
            default: true
        },
        min: {
            type: Number,
            default: 0
        },
        max: {
            type: Number,
            default: 9999
        }
    },
    mounted: function() {
        //判断是否移动端
        if ('ontouchend' in document) {
            this.events = {
                start: 'touchstart',
                end: 'touchend',
                cancel: 'touchcancel'
            };
        } else {
            this.events = {
                start: 'mousedown',
                end: 'mouseup',
                cancel: 'mouseleave'
            };
        }
    },
    methods: {
        tapEvent: function(type) {
            event.preventDefault();
            event.stopPropagation();
            
            this.startTime = new Date().getTime() / 1000;
            this.type = type;
            this.element = event.target;
            
            this.element.addEventListener(this.events.end, this.clearTimer, false);
            this.element.addEventListener(this.events.cancel, this.clearHandler, false);
            
            this.changeNumber();
        },
        changeNumber: function() {
            //根据长按的时间改变数值变化幅度
            var that = this;
            var currentDate = new Date().getTime() / 1000;
            var intervalTime = currentDate - this.startTime;
            
            if (intervalTime < 1) {
                intervalTime = 0.5;
            }
            var secondCount = intervalTime * 10;
            if (intervalTime == 3) {
                secondCount = 50;
            }
            if (intervalTime >= 4) {
                secondCount = 100;
            }
            
            if (this.type > 0) {
                this.count = Math.min(this.count+1, this.max);
            } else {
                this.count = Math.max(this.count-1, this.min);
            }
            
            this.timer = setTimeout(function() {
                that.changeNumber();
            }, 1000 / secondCount);
        },
        clearHandler: function() {
            this.clearTimer();
            
            this.element.removeEventListener(this.events.end, this.clearTimer, false);
            this.element.removeEventListener(this.events.cancel, this.clearHandler, false);
        },
        clearTimer: function() {
            clearTimeout(this.timer);
            this.timer = {};
        },
        inputCheck: function() {
            if (!(/(^[1-9]\d*$)/.test(this.count))) {
                this.count = 0;
            }
            
            this.count = Math.min(this.count, this.max);
        }
    },
    template: '<div class="step">'+
                '<div class="step-btn minus" @mousedown="tapEvent(-1)" @touchstart="tapEvent(-1)"></div>'+
                '<div class="step-show">'+
                    '<input class="step-input" type="number" :readonly="isread" v-model="count" @input="inputCheck" />'+
                '</div>'+
                '<div class="step-btn plus" @mousedown="tapEvent(1)" @touchstart="tapEvent(1)"></div>'+
            '</div>'
});