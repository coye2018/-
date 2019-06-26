Vue.component('zh-comment', {
    data: function() {
        return {
            replyShowMax: 2,
        }
    },
    props: {
        comment: {
            type: Array,
            required: true
        }
    },
    created: function() {
        this.replyStyleHandle();
    },
    mounted: function() {
    },
    methods: {
        replyStyleHandle: function() {
            var len = this.comment.length;
            if (len == 0) return;
            
            for (var d = 0; d < len; d++) {
                var comm = this.comment[d];
                var replyLen = comm.reply.length;
                var replyMore = replyLen > this.replyShowMax;
                
                this.$set(this.comment[d], 'contentReal', unescape(comm.content));//解码, 显示表情
                this.$set(this.comment[d], 'replyMore', replyMore);//回复是否超过2条
                this.$set(this.comment[d], 'replyFlag', false);//控制所有回复折叠或展开
                this.$set(this.comment[d], 'replyText', '查看'+replyLen+'条回复&gt;');
                
                if (comm.reply.length > 0) {
                    for (var f = 0; f < comm.reply.length; f++) {
                        this.$set(this.comment[d].reply[f], 'contentReal', unescape(comm.reply[f].content));//解码, 显示表情
                    }
                }
            }
        },
        replyMore: function(i) {
            var replyFlags = this.comment[i].replyFlag;
            var replyLens = this.comment[i].reply.length;
            
            this.$set(this.comment[i], 'replyText', replyFlags ? '查看'+replyLens+'条回复&gt;' : '收起∧');
            this.$set(this.comment[i], 'replyFlag', !replyFlags);
        },
        isReplyMoreShow: function(itm, idx) {
            //回复完全展开, 或者折叠时只显示前replyShowMax个
            return itm.hasOwnProperty('replyFlag') && (itm.replyFlag || idx < this.replyShowMax)
        },
        commentThis: function(obj) {
            //点击用户名字评论
            this.$emit('commentthis', obj);
        }
    },
    template: `
                        <div class="comment bg-white mg-box">
                            <div class="comment-item" v-for="(item, index) in comment">
                                <div class="comment-main">
                                    <span class="comment-name" @click="commentThis(item)">
                                        <span class="fc-main">{{item.name}}</span>
                                        <span class="fc-title">-{{item.department}}：</span>
                                    </span>
                                    <span class="comment-text fc-title" v-html="item.contentReal"></span>
                                    <em class="comment-time fc-text">{{item.date}}</em>
                                </div>
                                <div class="comment-reply" v-if="item.reply.length > 0">
                                    <div class="comment-main" v-for="(val, key) in item.reply" v-show="isReplyMoreShow(item, key)">
                                        <span class="comment-name" @click="commentThis(val)">
                                            <span class="fc-main">{{val.name}}</span>
                                            <span class="fc-title">-{{val.department}}</span>
                                        </span>
                                        <span class="comment-text fc-title">&nbsp;回复&nbsp;</span>
                                        <span class="comment-name">
                                            <span class="fc-main">{{val.reply_name}}</span>
                                            <span class="fc-title">-{{val.reply_department}}：</span>
                                        </span>
                                        <span class="comment-text fc-title" v-html="val.contentReal"></span>
                                        <em class="comment-time fc-text">{{val.date}}</em>
                                    </div>
                                    <div class="comment-more" v-if="item.replyMore">
                                        <div class="comment-more-text" @click="replyMore(index)" v-html="item.replyText"></div>
                                    </div>
                                </div>
                            </div>
                        </div>`
});