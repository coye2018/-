function setChatBg(){
    var chatbg = window.localStorage.getItem('chatbg'),
        bgtar = document.querySelectorAll('.bg-chat')[0],
        chatbg_flag = false,
        defaultbg = 'bc-bg',
        bgsuffix = ['jpg', 'jpeg', 'bmp', 'gif'];
    
    if(chatbg == null){
        //没有缓存, 取默认值
        chatbg = defaultbg;
    }else{
        //判断是不是图片地址
        var chatbg_arr = chatbg.split('.'),
            chatbg_test = chatbg_arr[chatbg_arr.length-1];
        
        for(var x=0; x<bgsuffix.length; x++){
            if(chatbg_test.indexOf(bgsuffix[x])> -1){
                chatbg_flag = true;
                break;
            }
        }
    }
    
    if(chatbg_flag){
        //如果设置了背景图
        bgtar.style.backgroundImage = 'url('+ chatbg +')';
    }else{
        //如果设置了背景样式
        window.localStorage.setItem('chatbg', chatbg);
        bgtar.classList.add(chatbg);
    }
    //console.log('聊天背景:'+chatbg);
}
setChatBg();