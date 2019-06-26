//双击放大的效果。 如果文字放大了就不查历史记录
var isTextBig=false;
var unReadCount=0;
var isunreadScroll=false;
Vue.use(VueLazyload, {
    preLoad: 1.3
    //loading: '../img/pic-loading.png'
});

var vm = new Vue({
    el: '#chat-dialog',
    data: {
        file: {},
        Chat:[],
        //Chat: [{"chatType":"1","ext":"管理员1#IR94Q940JC7DGCM1KEC685BI3NP368IJQPDQ","from":"admin1","isAcked":"0","isGroup":"1","isRead":"1","messageBody":{"text":"68"},"messageId":"365344931427911716","messageTime":"1502628295577","messageType":"text","to":"282789367854924304","isRevoke":false,"chatFromUser":"我","hashead":true,"headerImg":"http://10.10.11.122:8080/single//upload/8a8a8bfc59977acf0159978d29db0002/personHead/crop_temp_1502432899288.jpg","isOthers":false,"sendMsgTimeHide":false,"chatStatus":true,"chatStatusWarning":false,"ownerType":"text"},{"chatType":"1","ext":"管理员1#8DM9H7I35RRF1LELSFTTNDJ2UO087BJK2A38","from":"admin1","isAcked":"0","isGroup":"1","isRead":"1","messageBody":{"text":"69"},"messageId":"365344939464198180","messageTime":"1502628297445","messageType":"text","to":"282789367854924304","isRevoke":false,"chatFromUser":"我","hashead":true,"headerImg":"http://10.10.11.122:8080/single//upload/8a8a8bfc59977acf0159978d29db0002/personHead/crop_temp_1502432899288.jpg","isOthers":false,"sendMsgTimeHide":false,"chatStatus":true,"chatStatusWarning":false,"ownerType":"text"},{"chatType":"1","ext":"管理员1#JE3N8G5PP6IQS7UCB5EHQFN4KHR3GCCTA4RJ","from":"admin1","isAcked":"0","isGroup":"1","isRead":"1","messageBody":{"text":"70"},"messageId":"365344949308229668","messageTime":"1502628299747","messageType":"text","to":"282789367854924304","isRevoke":false,"chatFromUser":"我","hashead":true,"headerImg":"http://10.10.11.122:8080/single//upload/8a8a8bfc59977acf0159978d29db0002/personHead/crop_temp_1502432899288.jpg","isOthers":false,"sendMsgTimeHide":false,"chatStatus":true,"chatStatusWarning":false,"ownerType":"text"},{"chatType":"1","ext":"管理员1#KD5DPH8RT93NCV9DJIJKSV3ULSF37TI79IID","from":"admin1","isAcked":"0","isGroup":"1","isRead":"1","messageBody":{"text":"71"},"messageId":"365344958325983268","messageTime":"1502628301848","messageType":"text","to":"282789367854924304","isRevoke":false,"chatFromUser":"我","hashead":true,"headerImg":"http://10.10.11.122:8080/single//upload/8a8a8bfc59977acf0159978d29db0002/personHead/crop_temp_1502432899288.jpg","isOthers":false,"sendMsgTimeHide":false,"chatStatus":true,"chatStatusWarning":false,"ownerType":"text"},{"chatType":"1","ext":"管理员1#3OD7GTLCQ1R5NMVP9LA5GCNQGH695AEDKVG5","from":"admin1","isAcked":"0","isGroup":"1","isRead":"1","messageBody":{"text":"72"},"messageId":"365344968102905892","messageTime":"1502628304109","messageType":"text","to":"282789367854924304","isRevoke":false,"chatFromUser":"我","hashead":true,"headerImg":"http://10.10.11.122:8080/single//upload/8a8a8bfc59977acf0159978d29db0002/personHead/crop_temp_1502432899288.jpg","isOthers":false,"sendMsgTimeHide":false,"chatStatus":true,"chatStatusWarning":false,"ownerType":"text"},{"chatType":"1","ext":"管理员1#5IBC08TVJPCLOHDQB478F81B4MNTO7MUUTCE","from":"admin1","isAcked":"0","isGroup":"1","isRead":"1","messageBody":{"text":"73"},"messageId":"365344976596371492","messageTime":"1502628306084","messageType":"text","to":"282789367854924304","isRevoke":false,"chatFromUser":"我","hashead":true,"headerImg":"http://10.10.11.122:8080/single//upload/8a8a8bfc59977acf0159978d29db0002/personHead/crop_temp_1502432899288.jpg","isOthers":false,"sendMsgTimeHide":false,"chatStatus":true,"chatStatusWarning":false,"ownerType":"text"},{"chatType":"1","ext":"管理员1#CDJ5H40QON9IBICG4QQ0FESMRQSA8PIJIIU0","from":"admin1","isAcked":"0","isGroup":"1","isRead":"1","messageBody":{"text":"74"},"messageId":"365344985840617508","messageTime":"1502628308238","messageType":"text","to":"282789367854924304","isRevoke":false,"chatFromUser":"我","hashead":true,"headerImg":"http://10.10.11.122:8080/single//upload/8a8a8bfc59977acf0159978d29db0002/personHead/crop_temp_1502432899288.jpg","isOthers":false,"sendMsgTimeHide":false,"chatStatus":true,"chatStatusWarning":false,"ownerType":"text"},{"chatType":"1","ext":"管理员1#J28JIJ8FHF4P0EJVN9OGD505UPVV7BRASLVD","from":"admin1","isAcked":"0","isGroup":"1","isRead":"1","messageBody":{"text":"75"},"messageId":"365344994837399588","messageTime":"1502628310336","messageType":"text","to":"282789367854924304","isRevoke":false,"chatFromUser":"我","hashead":true,"headerImg":"http://10.10.11.122:8080/single//upload/8a8a8bfc59977acf0159978d29db0002/personHead/crop_temp_1502432899288.jpg","isOthers":false,"sendMsgTimeHide":false,"chatStatus":true,"chatStatusWarning":false,"ownerType":"text"},{"chatType":"1","ext":"管理员1#6F2PKPKTFB7D1VQP85IIS1J5KCKCT77SMP4T","from":"admin1","isAcked":"0","isGroup":"1","isRead":"1","messageBody":{"text":"76"},"messageId":"365345003574134820","messageTime":"1502628312372","messageType":"text","to":"282789367854924304","isRevoke":false,"chatFromUser":"我","hashead":true,"headerImg":"http://10.10.11.122:8080/single//upload/8a8a8bfc59977acf0159978d29db0002/personHead/crop_temp_1502432899288.jpg","isOthers":false,"sendMsgTimeHide":false,"chatStatus":true,"chatStatusWarning":false,"ownerType":"text"},{"chatType":"1","ext":"管理员1#OCMOIMLJVGTTU8P9TK2570OERF6UT9SABKLE","from":"admin1","isAcked":"0","isGroup":"1","isRead":"1","messageBody":{"text":"77"},"messageId":"365345013468497956","messageTime":"1502628314690","messageType":"text","to":"282789367854924304","isRevoke":false,"chatFromUser":"我","hashead":true,"headerImg":"http://10.10.11.122:8080/single//upload/8a8a8bfc59977acf0159978d29db0002/personHead/crop_temp_1502432899288.jpg","isOthers":false,"sendMsgTimeHide":false,"chatStatus":true,"chatStatusWarning":false,"ownerType":"text"},{"chatType":"1","ext":"管理员1#HBQCESV27J312ES4JCKL82UR2TDSN9JU1BUM","from":"admin1","isAcked":"0","isGroup":"1","isRead":"1","messageBody":{"text":"78"},"messageId":"365345022167484452","messageTime":"1502628316707","messageType":"text","to":"282789367854924304","isRevoke":false,"chatFromUser":"我","hashead":true,"headerImg":"http://10.10.11.122:8080/single//upload/8a8a8bfc59977acf0159978d29db0002/personHead/crop_temp_1502432899288.jpg","isOthers":false,"sendMsgTimeHide":false,"chatStatus":true,"chatStatusWarning":false,"ownerType":"text"},{"chatType":"1","ext":"管理员1#413700D9SRPC3SJFH4GNNU1MG8EVJ8S419HN","from":"admin1","isAcked":"0","isGroup":"1","isRead":"1","messageBody":{"text":"79"},"messageId":"365345030988105764","messageTime":"1502628318759","messageType":"text","to":"282789367854924304","isRevoke":false,"chatFromUser":"我","hashead":true,"headerImg":"http://10.10.11.122:8080/single//upload/8a8a8bfc59977acf0159978d29db0002/personHead/crop_temp_1502432899288.jpg","isOthers":false,"sendMsgTimeHide":false,"chatStatus":true,"chatStatusWarning":false,"ownerType":"text"},{"chatType":"1","ext":"管理员1#LFK68NPUHBCM7EHFUKE13RVN7UEGTFGUUR0R","from":"admin1","isAcked":"0","isGroup":"1","isRead":"1","messageBody":{"text":"80"},"messageId":"365345045571700772","messageTime":"1502628322144","messageType":"text","to":"282789367854924304","isRevoke":false,"chatFromUser":"我","hashead":true,"headerImg":"http://10.10.11.122:8080/single//upload/8a8a8bfc59977acf0159978d29db0002/personHead/crop_temp_1502432899288.jpg","isOthers":false,"sendMsgTimeHide":false,"chatStatus":true,"chatStatusWarning":false,"ownerType":"text"},{"chatType":"1","ext":"管理员1#QHHHKQL62TH9TPVP7ENEU7OCNGJI2N5ER987#2","from":"admin1","isAcked":"0","isGroup":"1","isRead":"1","messageBody":{"displayName":"20-58-48.amr","length":"10","remotePath":"https://a1.easemob.com/1137161221178828/zhanghuibaiyun/chatfiles/2b6b9480-8027-11e7-846f-132230364db1","secretKey":"K2uUioAnEeeuD93vgnD5znRClXjQ6_1r0JSO_7hI1n-daoxK"},"messageId":"365348549363238948","messageTime":"1502629137950","messageType":"audio","to":"282789367854924304","isRevoke":false,"chatFromUser":"我","hashead":true,"headerImg":"http://10.10.11.122:8080/single//upload/8a8a8bfc59977acf0159978d29db0002/personHead/crop_temp_1502432899288.jpg","isOthers":false,"sendMsgTimeHide":false,"ownerType":"audio","audioS":"2","chatStatus":true,"chatStatusWarning":false,"isPlay":false},{"chatType":"1","ext":"管理员6#HA10V8V414I3VCSU6E7JONF9H6RT9CQKHU1T#1","from":"admin6","isAcked":"0","isGroup":"1","isRead":"1","messageBody":{"displayName":"20-59-18.amr","length":"10","remotePath":"https://a1.easemob.com/1137161221178828/zhanghuibaiyun/chatfiles/b4ce8f30-942b-1e7-9395-bd6eb18f65b1","secretKey":"OLl-moAnEeeWJ_0TcT47U7qxtDlBpS3ua0M1Yg8zLK5djTOw"},"messageId":"365348645404411904","messageTime":"1502629160274","messageType":"audio","to":"282789367854924304","isRevoke":false,"chatFromUser":"管理员6","hashead":false,"headtext":"员6","headbgclass":"bg-head-3","isOthers":true,"sendMsgTimeHide":false,"ownerType":"audio","audioS":"1","chatStatus":true,"chatStatusWarning":false,"isPlay":false},{"chatType":"1","ext":"管理员6#BSKKA1VC08FPQT7J3TARDEISRIB17G4KN5TC","from":"admin6","isAcked":"0","isGroup":"1","isRead":"1","messageBody":{"text":"5克"},"messageId":"365348693349500928","messageTime":"1502629171441","messageType":"text","to":"282789367854924304","isRevoke":false,"chatFromUser":"管理员6","hashead":false,"headtext":"员6","headbgclass":"bg-head-5","isOthers":true,"sendMsgTimeHide":false,"chatStatus":true,"chatStatusWarning":false,"ownerType":"text"},{"chatType":"1","ext":"管理员6#GIHD4UKVCH8GIGAIM8022329CP4NG3HV4O5T","from":"admin6","isAcked":"0","isGroup":"1","isRead":"1","messageBody":{"text":"哦啦啦"},"messageId":"365348715801610240","messageTime":"1502629176674","messageType":"text","to":"282789367854924304","isRevoke":false,"chatFromUser":"管理员6","hashead":false,"headtext":"员6","headbgclass":"bg-head-5","isOthers":true,"sendMsgTimeHide":false,"chatStatus":true,"chatStatusWarning":false,"ownerType":"text"},{"chatType":"1","ext":"管理员1#TCRMN8L7GA4P63CU5RLVN6H6MPC9I821L7DH","from":"admin1","isAcked":"0","isGroup":"1","isRead":"1","messageBody":{"text":"饿哦"},"messageId":"365348898136393764","messageTime":"1502629219142","messageType":"text","to":"282789367854924304","isRevoke":false,"chatFromUser":"我","hashead":true,"headerImg":"http://10.10.11.122:8080/single//upload/8a8a8bfc59977acf0159978d29db0002/personHead/crop_temp_1502432899288.jpg","isOthers":false,"sendMsgTimeHide":false,"chatStatus":true,"chatStatusWarning":false,"ownerType":"text"},{"chatType":"1","ext":"管理员1#TAAJKUKCU7Q9JCVQ59K1U2AIG2522RFBE0K7","from":"admin1","isAcked":"0","isGroup":"1","isRead":"1","messageBody":{"text":"摸摸"},"messageId":"365349013391673380","messageTime":"1502629245995","messageType":"text","to":"282789367854924304","isRevoke":false,"chatFromUser":"我","hashead":true,"headerImg":"http://10.10.11.122:8080/single//upload/8a8a8bfc59977acf0159978d29db0002/personHead/crop_temp_1502432899288.jpg","isOthers":false,"sendMsgTimeHide":false,"chatStatus":true,"chatStatusWarning":false,"ownerType":"text"},{"chatType":"1","ext":"管理员1#FNJUV906O9LRDP6S3BMKB0ASL9RNQV1KSDH9","from":"admin1","isAcked":"0","isGroup":"1","isRead":"1","messageBody":{"text":"额额"},"messageId":"365349206203828260","messageTime":"1502629290886","messageType":"text","to":"282789367854924304","isRevoke":false,"chatFromUser":"我","hashead":true,"headerImg":"http://10.10.11.122:8080/single//upload/8a8a8bfc59977acf0159978d29db0002/personHead/crop_temp_1502432899288.jpg","isOthers":false,"sendMsgTimeHide":false,"chatStatus":true,"chatStatusWarning":false,"ownerType":"text"}],
        //Chat: [{"chatType":"1","ext":"管理员1#LFK68NPUHBCM7EHFUKE13RVN7UEGTFGUUR0R","from":"admin1","isAcked":"0","isGroup":"1","isRead":"1","messageBody":{"text":"80"},"messageId":"365345045571700772","messageTime":"1502628322144","messageType":"text","to":"282789367854924304","isHide":false,"isRevoke":false,"chatFromUser":"我","hashead":true,"headerImg":"http://10.10.11.122:8080/single//upload/8a8a8bfc59977acf0159978d29db0002/personHead/crop_temp_1502432899288.jpg","isOthers":false,"sendMsgTimeHide":false,"chatStatus":true,"chatStatusWarning":false,"ownerType":"text"},{"chatType":"1","ext":"管理员1#QHHHKQL62TH9TPVP7ENEU7OCNGJI2N5ER987#2","from":"admin1","isAcked":"0","isGroup":"1","isRead":"1","messageBody":{"displayName":"20-58-48.amr","length":"10","remotePath":"http://placeimg.com/1920/1080","secretKey":"K2uUioAnEeeuD93vgnD5znRClXjQ6_1r0JSO_7hI1n-daoxK"},"messageId":"365348549363238948","messageTime":"1502629137950","messageType":"audio","to":"282789367854924304","isHide":false,"isRevoke":false,"chatFromUser":"我","hashead":true,"headerImg":"http://10.10.11.122:8080/single//upload/8a8a8bfc59977acf0159978d29db0002/personHead/crop_temp_1502432899288.jpg","isOthers":false,"sendMsgTimeHide":true,"sendMsgTime":"08-13 20:57","ownerType":"audio","audioS":"2","chatStatus":true,"chatStatusWarning":false,"isPlay":false},{"chatType":"1","ext":"管理员6#HA10V8V414I3VCSU6E7JONF9H6RT9CQKHU1T#1","from":"admin6","isAcked":"0","isGroup":"1","isRead":"1","messageBody":{"displayName":"20-59-18.amr","length":"10","remotePath":"http://placeimg.com/1080/1920","secretKey":"OLl-moAnEeeWJ_0TcT47U7qxtDlBpS3ua0M1Yg8zLK5djTOw"},"messageId":"365348645404411904","messageTime":"1502629160274","messageType":"audio","to":"282789367854924304","isHide":false,"isRevoke":false,"chatFromUser":"管理员6","hashead":false,"headtext":"员6","headbgclass":"bg-head-3","isOthers":true,"sendMsgTimeHide":false,"ownerType":"audio","audioS":"1","chatStatus":true,"chatStatusWarning":false,"isPlay":false},{"chatType":"1","ext":"管理员6#BSKKA1VC08FPQT7J3TARDEISRIB17G4KN5TC","from":"admin6","isAcked":"0","isGroup":"1","isRead":"1","messageBody":{"text":"5克"},"messageId":"365348693349500928","messageTime":"1502629171441","messageType":"text","to":"282789367854924304","isHide":false,"isRevoke":false,"chatFromUser":"管理员6","hashead":false,"headtext":"员6","headbgclass":"bg-head-6","isOthers":true,"sendMsgTimeHide":false,"chatStatus":true,"chatStatusWarning":false,"ownerType":"text"},{"chatType":"1","ext":"管理员6#GIHD4UKVCH8GIGAIM8022329CP4NG3HV4O5T","from":"admin6","isAcked":"0","isGroup":"1","isRead":"1","messageBody":{"text":"哦啦啦"},"messageId":"365348715801610240","messageTime":"1502629176674","messageType":"text","to":"282789367854924304","isHide":false,"isRevoke":false,"chatFromUser":"管理员6","hashead":false,"headtext":"员6","headbgclass":"bg-head-5","isOthers":true,"sendMsgTimeHide":false,"chatStatus":true,"chatStatusWarning":false,"ownerType":"text"},{"chatType":"1","ext":"管理员1#TCRMN8L7GA4P63CU5RLVN6H6MPC9I821L7DH","from":"admin1","isAcked":"0","isGroup":"1","isRead":"1","messageBody":{"text":"饿哦"},"messageId":"365348898136393764","messageTime":"1502629219142","messageType":"text","to":"282789367854924304","isHide":false,"isRevoke":false,"chatFromUser":"我","hashead":true,"headerImg":"http://10.10.11.122:8080/single//upload/8a8a8bfc59977acf0159978d29db0002/personHead/crop_temp_1502432899288.jpg","isOthers":false,"sendMsgTimeHide":false,"chatStatus":true,"chatStatusWarning":false,"ownerType":"text"},{"chatType":"1","ext":"管理员1#N2HKB8J5OA3PRU8LU4GA04J7FOITSBBAB7AQ#3","from":"admin1","isAcked":"0","isGroup":"1","isRead":"1","messageBody":{"displayName":"14-24-25.amr","length":"10","remotePath":"http://placeimg.com/1920/1080","secretKey":"QChWqoC5Eeeefs1Q9_xP_5ljquqwblV7MUmVJRP3S1p3HgzE"},"messageId":"365618021265311776","messageTime":"1502691879250","messageType":"audio","to":"282789367854924304","isHide":false,"isRevoke":false,"chatFromUser":"我","hashead":true,"headerImg":"http://10.10.11.122:8080/single//upload/8a8a8bfc59977acf0159978d29db0002/personHead/crop_temp_1502432899288.jpg","isOthers":false,"sendMsgTimeHide":true,"sendMsgTime":"08-14 14:39","ownerType":"audio","audioS":"3","chatStatus":true,"chatStatusWarning":false,"isPlay":false},{"chatType":"1","ext":"管理员1@365645001650079740","extObj":{"revoke":"true"},"from":"admin1","isAcked":"0","isGroup":"1","isRead":"1","messageBody":{"displayName":"temp_1502698166733.jpg","remotePath":"http://placeimg.com/1080/1920","secretKey":"4GalCoDHEeeB04_NCoMj7nc4YpyrC1BgWey02g48TrLWw4sX","thumbnailRemotePath":"http://placeimg.com/216/384","thumbnailSecretKey":"4GalCoDHEeeB04_NCoMj7nc4YpyrC1BgWey02g48TrLWw4sX"},"messageId":"365645001650079740","messageTime":"1502698161112","messageType":"image","to":"282789367854924304","isHide":false,"isRevoke":true,"chatFromUser":"您已"},{"chatType":"1","ext":"管理员1@365656118979987488","extObj":{"revoke":"true"},"from":"admin1","isAcked":"0","isGroup":"1","isRead":"1","messageBody":{"text":"看看咯"},"messageId":"365656118979987488","messageTime":"1502700749574","messageType":"text","to":"282789367854924304","isHide":false,"isRevoke":true,"chatFromUser":"您已"},{"chatType":"1","ext":"管理员1#FS18V61FJDLG9AR3MH8S742CBSSQJBDG6VCP","from":"admin1","isAcked":"0","isGroup":"1","isRead":"1","messageBody":{"displayName":"temp_1502702918434.jpg","remotePath":"http://placeimg.com/1920/1080","secretKey":"8NHTqoDSEeethO-nLmClKKRTOM7qPUixFZPDHCj8CbC4M0Xc","thumbnailRemotePath":"http://placeimg.com/384/216","thumbnailSecretKey":"8NHTqoDSEeethO-nLmClKKRTOM7qPUixFZPDHCj8CbC4M0Xc"},"messageId":"365665411489859628","messageTime":"1502702913146","messageType":"image","to":"282789367854924304","isHide":false,"isRevoke":false,"chatFromUser":"我","hashead":true,"headerImg":"http://10.10.11.122:8080/single//upload/8a8a8bfc59977acf0159978d29db0002/personHead/crop_temp_1502432899288.jpg","isOthers":false,"sendMsgTimeHide":true,"sendMsgTime":"08-14 17:33","ownerType":"image","chatStatus":true,"chatStatusWarning":false},{"chatType":"1","ext":"管理员1#8QE7I28SC0I5D4D7CSCHKHO9JD22RTJLTAUR","from":"admin1","isAcked":"0","isGroup":"1","isRead":"1","messageBody":{"text":"看看咯"},"messageId":"365668644186753060","messageTime":"1502703665831","messageType":"text","to":"282789367854924304","isHide":false,"isRevoke":false,"chatFromUser":"我","hashead":true,"headerImg":"http://10.10.11.122:8080/single//upload/8a8a8bfc59977acf0159978d29db0002/personHead/crop_temp_1502432899288.jpg","isOthers":false,"sendMsgTimeHide":true,"sendMsgTime":"08-14 17:05","chatStatus":true,"chatStatusWarning":false,"ownerType":"text"},{"chatType":"1","ext":"管理员1#C99VMDRJ9I77JFB4DCN45J5F2V66I0J8I8E8","from":"admin1","isAcked":"0","isGroup":"1","isRead":"1","messageBody":{"displayName":"temp_1502703680048.jpg","remotePath":"http://placeimg.com/1080/1920","secretKey":"trxfOoDUEeeTHU9UJmyRKVnLRhKQiWdGHsXk-VyvOelzAZDt","thumbnailRemotePath":"http://placeimg.com/216/384","thumbnailSecretKey":"trxfOoDUEeeTHU9UJmyRKVnLRhKQiWdGHsXk-VyvOelzAZDt"},"messageId":"365668682099066916","messageTime":"1502703674655","messageType":"image","to":"282789367854924304","isHide":false,"isRevoke":false,"chatFromUser":"我","hashead":true,"headerImg":"http://10.10.11.122:8080/single//upload/8a8a8bfc59977acf0159978d29db0002/personHead/crop_temp_1502432899288.jpg","isOthers":false,"sendMsgTimeHide":false,"ownerType":"image","chatStatus":true,"chatStatusWarning":false},{"chatType":"1","ext":"管理员1#LREHM4NVC1ID5RVNOF4KRDG7H27VEDG7OO4M","from":"admin1","isAcked":"0","isGroup":"1","isRead":"1","messageBody":{"text":"来咯"},"messageId":"365672151920936952","messageTime":"1502704482540","messageType":"text","to":"282789367854924304","isHide":false,"isRevoke":false,"chatFromUser":"我","hashead":true,"headerImg":"http://10.10.11.122:8080/single//upload/8a8a8bfc59977acf0159978d29db0002/personHead/crop_temp_1502432899288.jpg","isOthers":false,"sendMsgTimeHide":true,"sendMsgTime":"08-14 17:42","chatStatus":true,"chatStatusWarning":false,"ownerType":"text"},{"chatType":"1","ext":"管理员1@365672192907675640","extObj":{"revoke":"true"},"from":"admin1","isAcked":"0","isGroup":"1","isRead":"1","messageBody":{"displayName":"image833925820.jpg","remotePath":"http://placeimg.com/1920/1080","secretKey":"nevDSoDWEeelqwFoNuipsH1OwRnuGCp94dxpFgJqyn72w-1U","thumbnailRemotePath":"http://placeimg.com/384/216","thumbnailSecretKey":"nevDSoDWEeelqwFoNuipsH1OwRnuGCp94dxpFgJqyn72w-1U"},"messageId":"365672192907675640","messageTime":"1502704492068","messageType":"image","to":"282789367854924304","isHide":false,"isRevoke":true,"chatFromUser":"您已"},{"chatType":"1","ext":"管理员1#A1KVNB490H1C5VAQMDG5PALAPL6MLKTFF545","from":"admin1","isAcked":"0","isGroup":"1","isRead":"1","messageBody":{"displayName":"1502949581832.mp4","length":"7218","remotePath":"http://placeimg.com/1080/1920","secretKey":"Ug5IyoMREeedYrnRtOegDJOHi4fxVZheX2NwQlUxZa314Tl7","thumbnailRemotePath":"http://placeimg.com/216/384","thumbnailSecretKey":"Udq1qoMREeeb_Y0l5tBIlYqGAY6sL_UKokJ4mawgKXEDMkVf"},"messageId":"366724954961479640","messageTime":"1502949607343","messageType":"video","to":"282789367854924304","isHide":false,"isRevoke":false,"chatFromUser":"我","hashead":true,"headerImg":"http://10.10.11.122:8080/single//upload/8a8a8bfc59977acf0159978d29db0002/personHead/crop_temp_1502432899288.jpg","isOthers":false,"sendMsgTimeHide":true,"sendMsgTime":"今天 14:00","ownerType":"video","chatStatus":true,"chatStatusWarning":false},{"chatType":"1","ext":"管理员1#BD0MNRJUTC8KQLMGUVV37MIR761SGMKU7Q2M","from":"admin1","isAcked":"0","isGroup":"1","isRead":"1","messageBody":{"displayName":"1502949613398.mp4","length":"73277","remotePath":"http://placeimg.com/1920/1080","secretKey":"ZJj9CoMREeeQc3l8pBGV7haPjyrJAXvUmvH1pZTYlyU-4CyJ","thumbnailRemotePath":"http://placeimg.com/1920/1080","thumbnailSecretKey":"ZFR5-oMREee2dIHKMYmRrRBP6gvSpDJvqt0E9vfl8483Sk_9"},"messageId":"366725088600393688","messageTime":"1502949638460","messageType":"video","to":"282789367854924304","isHide":false,"isRevoke":false,"chatFromUser":"我","hashead":true,"headerImg":"http://10.10.11.122:8080/single//upload/8a8a8bfc59977acf0159978d29db0002/personHead/crop_temp_1502432899288.jpg","isOthers":false,"sendMsgTimeHide":false,"ownerType":"video","chatStatus":true,"chatStatusWarning":false},{"chatType":"1","ext":"管理员1#5MT15P1AETKM2ESL2MSIP56E6UVRE2DGO13H","from":"admin1","isAcked":"0","isGroup":"1","isRead":"1","messageBody":{"displayName":"image561269797.jpg","remotePath":"http://placeimg.com/1080/1920","secretKey":"7N3I2oMREee8HEmGp36qqAJuIEhqyriGhOqInlWa6FF-jKSB","thumbnailRemotePath":"http://placeimg.com/216/384","thumbnailSecretKey":"7N3I2oMREee8HEmGp36qqAJuIEhqyriGhOqInlWa6FF-jKSB"},"messageId":"366726070629566424","messageTime":"1502949867104","messageType":"image","to":"282789367854924304","isHide":false,"isRevoke":false,"chatFromUser":"我","hashead":true,"headerImg":"http://10.10.11.122:8080/single//upload/8a8a8bfc59977acf0159978d29db0002/personHead/crop_temp_1502432899288.jpg","isOthers":false,"sendMsgTimeHide":true,"sendMsgTime":"今天 14:04","ownerType":"image","chatStatus":true,"chatStatusWarning":false},{"chatType":"1","ext":"管理员6#BA33HLIUBUC581I3326NFLKAI2UD7NE8237J","from":"admin6","isAcked":"0","isGroup":"1","isRead":"1","messageBody":{"displayName":"image1246002687.jpg","remotePath":"http://placeimg.com/1920/1080","secretKey":"K1DOOoMUEeeYTC3TcIVAPVeSDt3oIbwX9wGwSV5n4rz5n8bC","thumbnailRemotePath":"http://placeimg.com/384/216","thumbnailSecretKey":"K1DOOoMUEeeYTC3TcIVAPVeSDt3oIbwX9wGwSV5n4rz5n8bC"},"messageId":"366730210055292928","messageTime":"1502950830875","messageType":"image","to":"282789367854924304","isHide":false,"isRevoke":false,"chatFromUser":"管理员6","hashead":false,"headtext":"员6","headbgclass":"bg-head-6","isOthers":true,"sendMsgTimeHide":true,"sendMsgTime":"今天 14:20","ownerType":"image","chatStatus":true,"chatStatusWarning":false},{"chatType":"1","ext":"管理员6#T5NSV0OTEHAJSF0FDROJ76HGMKIFBVQRF8CA#2","from":"admin6","isAcked":"0","isGroup":"1","isRead":"1","messageBody":{"displayName":"14-20-33.amr","length":"10","remotePath":"http://placeimg.com/1080/1920","secretKey":"Luk3OoMUEeekDBPpKjv_xkl-L7Yn9nUiAt3SjpIGT8kBMoSh"},"messageId":"366730235732822016","messageTime":"1502950836853","messageType":"audio","to":"282789367854924304","isHide":false,"isRevoke":false,"chatFromUser":"管理员6","hashead":false,"headtext":"员6","headbgclass":"bg-head-7","isOthers":true,"sendMsgTimeHide":false,"ownerType":"audio","audioS":"2","chatStatus":true,"chatStatusWarning":false,"isPlay":false},{"chatType":"1","ext":"管理员6#D5O6HD7KECC2723CI71MNIQ6NHR6KCR6D41B","from":"admin6","isAcked":"0","isGroup":"1","isRead":"1","messageBody":{"displayName":"1502950845445.mp4","length":"172898","remotePath":"http://placeimg.com/1920/1080","secretKey":"N4NdOoMUEee4eGXtVfQt5c36MqMaCCZSNHCf_msU8ImpBKue","thumbnailRemotePath":"http://placeimg.com/384/216","thumbnailSecretKey":"NxcG2oMUEeeld-kcWZWvTu2LPSoOODPIZq-6ufLVNqyXLxEa"},"messageId":"366730297774966784","messageTime":"1502950851285","messageType":"video","to":"282789367854924304","isHide":false,"isRevoke":false,"chatFromUser":"管理员6","hashead":false,"headtext":"员6","headbgclass":"bg-head-7","isOthers":true,"sendMsgTimeHide":false,"ownerType":"video","chatStatus":true,"chatStatusWarning":false}],
        shadeChat:{},
        chatNew:[],
        unReadCount:0,
        isunreadScroll:false,
        longtapFlag:-1
    },
    mounted: function () {
      //ios300ms延时
       FastClick.attach(document.body);  
    },
    methods: {
        unclick:function(item,index,event){
            if(index==0 && !item.chatStatus){
                    addConfirm({
                        content: '确定重新发送嘛？',
                        yes: function(i){
                            layerRemove(i);
                            againSend(item);
                        }
                    });    
                }else{
                    if(item.ownerType=="text"){
                        textOpenBig(item);
                    }else if(item.ownerType=="image"){
                        openImg(item);
                    }else if(item.ownerType=="video"){
                        openVideo(item);
                    }else if(item.ownerType=="audio"){
                        var _this=this;
                        openAudio(item,event.currentTarget);
                    }    
                }
        },
        headAt:function(item){
            var allPeopleHeadImg=appcan.locStorage.getVal("allPeopleHeadImg");
            var people;
            if(isDefine(allPeopleHeadImg)){
                var allPeoples=JSON.parse(allPeopleHeadImg);
                     for (var j=0; j < allPeoples.length; j++) {
                        if(item.from==allPeoples[j].username){
                            allPeoples[j].userNameShort=allPeoples[j].realname.substr(-2,2);
                            allPeoples[j].userCode=allPeoples[j].username;
                            allPeoples[j].userName=allPeoples[j].realname;
                            if(isDefine(allPeoples[j].head_image)){
                                allPeoples[j].hashead=true;
                                allPeoples[j].headurl=serverPath +allPeoples[j].head_image;
                            }else{
                                allPeoples[j].hashead=false;
                                allPeoples[j].headbgclass=getHeadClass(allPeoples[j].id);
                            }
                            people=allPeoples[j];
                            break;
                        }
                     };
            }
            
            
            appcan.locStorage.setVal('thispeoplefile', JSON.stringify(people));
            var platForm=appcan.locStorage.getVal("platForm");
            var aniId=0;
            //Android
            if(platForm=="1"){
                appcan.window.open('chat-file-people', 'chat-file-people.html', 2);
            }else{
                  appcan.window.open({
                    name:'chat-file-people',
                    dataType:0,
                    data:'chat-file-people.html',
                    aniId:aniId,
                    type:1024
                });  
            }
            
        },
        fileclick:function(item,index,i){
            if(index==1 && !item.chatStatus){
                    addConfirm({
                        content: '确定重新发送嘛？',
                        yes: function(i){
                            layerRemove(i);
                            againSend(item);
                        }
                    });    
                }else{
            
                var _this = $(event.currentTarget);
                var displayName="";
                if(item.messageBody.displayName.indexOf("http")!=-1){
                    displayName=item.messageBody.displayName.split("/")[item.messageBody.displayName.split("/").length-1];
                }else{
                    if(isDefine(item.ext)){
                        if(item.ext.indexOf("#")!=-1){
                            displayName=item.ext.split("#")[2];
                        }
                        if(item.ext.indexOf("@")!=-1){
                            displayName=item.ext.split("@")[2];
                        }
                    }
                    if(!isDefine(displayName)){
                        displayName=item.messageBody.displayName;
                    }
                }
                appcan.file.exists({
                    filePath:'wgts://'+displayName,
                    callback:function(err,data,dataType,optId){
                        if(err){
                            //判断文件文件出错了
                            return;
                        }
                        if(data == 1){
                            //文件存在
                              uexDocumentReader.openDocumentReader('wgts://'+displayName);
                        }else{
                            //文件不存在
                            if(index==0){
                                _this.find('.chat-docu-data').addClass('hide');
                                _this.find('.prog-chat').removeClass('hide').prog({
                                    total: 100,
                                    normal: 0,
                                    hastext: false
                                });
                            }
                            var downLoadjson={
                                serverUrl:item.messageBody.remotePath,
                                downloadUrl:'wgts://'+displayName
                             };
                            appcan.plugInDownloaderMgr.download(downLoadjson,function(e){
                                if(e.status==1){
                                    if(index==0){
                                         Vue.set(vm.Chat[i].messageBody,"hasReciveText","已接收");
                                    } 
                                    uexDocumentReader.openDocumentReader('wgts://'+displayName);
                                     
                                   }else if(e.status==2){
                                   }else{
                                       progChat(_this, e.percent);
                                   }
                            })
                        }
                    }
                });
             }    
            
        },
        openDutyProblem:function(item){
            appcan.locStorage.setVal('dataId',item.messageBody.dataId);
            //控制值班问题所有按钮的权限。
            appcan.locStorage.setVal('chatFromdutyProblemButton',"1");
            var platForm=appcan.locStorage.getVal("platForm");
            var aniId=0;
            
            //Android
            if(platForm=="1"){
                appcan.window.open("duty-problem-detail","../duty/duty-problem-detail.html",2);
            }else{
                  appcan.window.open({
                    name:'duty-problem-detail',
                    dataType:0,
                    data:'../duty/duty-problem-detail.html',
                    aniId:aniId,
                    type:1024
                });  
            }
        },
        openTaskShare:function(item){
            appcan.locStorage.setVal('taskId',item.messageBody.dataId);
            //控制任务所有按钮的权限。
            appcan.locStorage.setVal('chatFromTaskShareButton',"1");
            var platForm=appcan.locStorage.getVal("platForm");
            var aniId=0;
            //Android
            if(platForm=="1"){
                appcan.window.open("task-detail","../task/task-detail.html",2);
            }else{
                  appcan.window.open({
                    name:'task-detail',
                    dataType:0,
                    data:'../task/task-detail.html',
                    aniId:aniId,
                    type:1024
                });  
            }
        }
    },
    directives:{
        at:{
            bind:function(el,binding){
                var value = binding.value;
                $(el).longTap(function(){
                    var text= uexChatKeyboard.getText();
                    var chatIndex=vm.Chat[Number(value)];
                        
                    if(isDefine(text)){
                        //判断是否重复@，如果有重复的就不显示出来
                        if(text.indexOf(chatIndex.chatFromUser)==-1){
                            uexChatKeyboard.setText(text+" @"+chatIndex.chatFromUser);
                        }
                    }else{
                        uexChatKeyboard.setText("@"+chatIndex.chatFromUser+" ");
                    }
                });
            },
            update:function(binding){},　　
　　　　　　　unbind:function(){}
        },
        longtouch:{
            bind:function(el, binding){
                var value = binding.value;
                $(el).longTap(function(e){
                    e.stopPropagation();
                    if(vm.Chat[Number(value)].chatStatus){
                        //alert(value.messageBody.remotePath);
                        appcan.locStorage.setVal("chatMessageOnlong",vm.Chat[Number(value)]);
                        controlButton();
                    }
                });
            },
            update:function(binding){},
            unbind:function(){}
        },
        doubletap:{
            bind:function(el,binding){
                  var value = binding.value;
                  
                    $(el).doubleTap(function(){
                            isTextBig=true;
                            //打开相应的文字放大的页面
                            // var txtShow = '<div class="chat-panel-box"><div class="chat-panel-txt">'+vm.Chat[Number(value)].messageBody.text+'</div></div>';
                            // ModalHelper.afterOpen();
                            // var pageii = layer.open({
                               // type: 1,
                               // content: txtShow,
                               // anim: false,
                               // className: 'chat-panel bc-bg'
                            // });
                            // appcan.locStorage.setVal('chatcontent', uexChatKeyboard.getText());
                            // uexChatKeyboard.close();
                            
                            appcan.locStorage.setVal('chat-dialog-scale', vm.Chat[Number(value)].messageBody.text);
                            appcan.window.publish('chat-dialog-scale-open', '1');
                        
                    })
　　　　　　　　　　},
　　　　　　　　　　update:function(binding){
                    
　　　　　　　　　　},　　
　　　　　　　　　　unbind:function(){
　　　　　　　　　　}
        }
    }
});
vm.$Lazyload.$on('loading', function (e) {
   $(e.el).parents('.chat-img-box').addClass('loading');
});
vm.$Lazyload.$on('loaded', function (e) {
    var timeout = setInterval(function(){
        if(e.el.complete){
            $(e.el).parents('.chat-img-box').removeClass('loading');
            clearInterval(timeout);
        }
    }, 200);
});
 


//表示第一次进来，页面的滚动条在最底下
var flag1=true;
var isDown=false;

(function($) {
    var file = appcan.locStorage.getVal('chat-file-group');
    if(isDefine(file)){
        var fileJson = JSON.parse(file);
        vm.file = $.extend({}, fileJson);
    }
    
    appcan.ready(function() {
        
        var getunreadparam = {
            username:appcan.locStorage.getVal("chat-dialog-groupChatId"),//username | groupid
            chatType:appcan.locStorage.getVal("chatType")//聊天类别 0-单聊 1-群聊(仅iOS需要,默认0)
        };
         
        uexEasemob.getUnreadMsgCount(getunreadparam,function(data){
            unReadCount=data.count; 
            if(Number(unReadCount)>10){
                $("#unread").removeClass("hide");
                $("#unread span").html(unReadCount+"条新消息");
                vm.unReadCount=Number(unReadCount);
            }
         });
        //延迟10秒执行未读消息索引消失
        setTimeout('$("#unread").addClass("hide");', 10000 );
        appcan.window.subscribe('fontsize', function(msg){
            quanjuFontsize();
        });
        appcan.window.publish("yesClickLi","yesClickLi");
        uexWindow.setBounce(1);
        uexWindow.setBounceParams('0', "{'pullToReloadText':'下拉刷新','releaseToReloadText':'释放刷新','loadingText':'正在刷新，请稍候'}");
        uexWindow.showBounceView("0", "rgba(255,255,255,0)", "1");
        uexWindow.notifyBounceEvent(0, 1);
        uexWindow.onBounceStateChange =function(type, state){
            switch(type) {
            case 0:
                if (state == 2) {
                    flag1=false;
                    isDown=true;
                    if(!isTextBig){
                        //加载数据
                         getHistoryMessageById(); 
                         
                    }
                    
                }
                break;
            
            }
        }
         //初始化环信chat-dialog-easemob-ready.js
        onloadChat();
        appcan.window.subscribe("resetChatDialogBounce",function(msg){
            isTextBig=false;
        });
          
            
        
        
        
        var isAddress=appcan.locStorage.getVal("isAddress");
        //改变群名称之后改变对话框的群title
        appcan.window.subscribe("changGroupName",function(msg){
            Vue.set(vm.file,"groupName",msg);
        })
        
        //监听系统返回键，做未读消息清零及刷新会话列表页消息。
        uexWindow.setReportKey(0, 1);
        uexWindow.onKeyPressed = function(keyCode) {
            if (keyCode == 0) {
                 checkTexttDraft();
                appcan.window.publish("loadRecent","loadRecent");
                appcan.window.publish("reloadUnread","reloadUnread");
               //将未读消息数清零
                var resetReadparam = {
                    username:appcan.locStorage.getVal("chat-dialog-groupChatId")
                };
                uexEasemob.resetUnreadMsgCount(resetReadparam);
                var closeArr = ['chat-file-people','chat-dialog'];
                    closeArr.forEach(function(name){
                        appcan.window.evaluateScript({
                            name:name,
                            scriptContent:'appcan.window.close(13);'
                        });
                    });
            }
        };
        //监听@页面的回调
        appcan.window.subscribe("atSomeBody",function(msg){
            var text = uexChatKeyboard.getText();
            var mbs = JSON.parse(msg);
            mbs.forEach(function(n, i){
                text = text + n + ' @';
            });
            text = text.substring(0, text.length-1);
            uexChatKeyboard.setText(text);
        });
        
        Vue.nextTick(function(){
            
        });
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
                checkTexttDraft();
                appcan.window.publish("loadRecent","loadRecent");
                appcan.window.publish("reloadUnread","reloadUnread");
               //将未读消息数清零
                var resetReadparam = {
                    username:appcan.locStorage.getVal("chat-dialog-groupChatId")
                };
                uexEasemob.resetUnreadMsgCount(resetReadparam);
                var closeArr = ['chat-file-people','chat-dialog'];
                    closeArr.forEach(function(name){
                        appcan.window.evaluateScript({
                            name:name,
                            scriptContent:'appcan.window.close(13);'
                        });
                    });
        }
        
    });
    
})($);
 
// $('body').on('tap','.chat-panel', function(e){
    // layerRemoveAll();
    // isTextBig=false;
    // var jsonstr = {
        // "emojicons":"res://emojicons/emojicons.xml",
        // "shares":"res://shares/shares.xml",
        // "placeHold":"请输入内容",
        // "touchDownImg":"res://3.png",
        // "dragOutsideImg":"res://4.png",
        // "textColor":"#FFF",
        // "textSize":"15.5",
        // "sendBtnbgColorUp":"#45C01A",
        // "sendBtnbgColorDown":"#298409",
        // "sendBtnText":"发送",
        // //sendBtnTextSize:"15.5",
        // "sendBtnTextColor":"#FFF",
        // "keywords": ['@'],//(可选)输入监听关键字(字符串数组)
        // "inputMode":0,
        // "maxLines":4
    // };
    // uexChatKeyboard.open(JSON.stringify(jsonstr));
//     
    // uexChatKeyboard.setText(appcan.locStorage.getVal('chatcontent'));
    // setBottomHeight();
//     
// });

$('#chat-dialog').on('touchstart', '#shadeChat', function(e){
    e.stopPropagation();
    e.preventDefault();
    
    //点击遮罩层才关闭, 否则不关闭
    if(this.isEqualNode(e.target) && vm.longtapFlag){
        $(this).addClass('hide');
    }
});
$('#chat-dialog').on('touchstart', '.chat-modal-btn', function(e){
    e.stopPropagation();
    e.preventDefault();
});
$('#chat-dialog').on('touchend', '.chat-modal-btn', function(e){
    e.stopPropagation();
    e.preventDefault();
    
    if(vm.longtapFlag){
        $('#shadeChat').addClass('hide');
        vm.longtapFlag = -1;
    }
});

function progChat(e,i){
    var hid = 'hide';
     
    e.find('.prog-chat').prog('set', {
        normal: i
    });
    if(i>=100){
        e.find('.prog-chat').prog('destroy');
        e.find('.chat-docu-data').removeClass(hid);
    }
}

function loadunreadMsg(){
    isunreadScroll=true;
    vm.isunreadScroll=true;
    if(unReadCount<20){
        Vue.nextTick(function () {
        var el=document.getElementById("unreadLine");
        var scorllLength=el.offsetTop;
        $(window).scrollTop(Math.round(scorllLength));
        $("#unread").addClass("hide");
        })
    }else{
        $("#unread").addClass("hide");
        flag1=false;
            //获取历史聊天记录
            getHistoryMessageById();
        }
         
}


function checkTexttDraft(){
    //先判断输入框中有没有值,如果有值则保存到缓存中
     var t=uexChatKeyboard.getText();
     if(isDefine(t)){
         //草稿缓存存储格式是， [{text,code,groupId},{text,code,groupId}];
        var textDraft=appcan.locStorage.getVal("textDraft");
        if(isDefine(textDraft)){
            var textJson=JSON.parse(textDraft);
            var hasTex=false;
            for (var i=0; i < textJson.length; i++) {
                  if(textJson[i].code==appcan.locStorage.getVal("userCode") && textJson[i].groupId==appcan.locStorage.getVal("chat-dialog-groupChatId")){
                      textJson[i].text=t;
                      hasTex=true;
                      break;
                  }
            };
            if(hasTex){
                appcan.locStorage.setVal("textDraft",JSON.stringify(textJson));
            }else{
                var json={
                    text:t,
                    code:appcan.locStorage.getVal("userCode"),
                    groupId:appcan.locStorage.getVal("chat-dialog-groupChatId")
                }
                textJson.push(json);
                appcan.locStorage.setVal("textDraft",JSON.stringify(textJson));
            }
        }else{
                var textJson=new Array();
                var json={
                    text:t,
                    code:appcan.locStorage.getVal("userCode"),
                    groupId:appcan.locStorage.getVal("chat-dialog-groupChatId")
                }
                textJson.push(json);
                appcan.locStorage.setVal("textDraft",JSON.stringify(textJson));
        }
     }else{
            var textDraft=appcan.locStorage.getVal("textDraft");
            
            if(isDefine(textDraft)){
                var textJson=JSON.parse(textDraft);
                var index=0;
                var hasTex=false;
                for (var i=0; i < textJson.length; i++){
                      if(textJson[i].code==appcan.locStorage.getVal("userCode") && textJson[i].groupId==appcan.locStorage.getVal("chat-dialog-groupChatId")){
                          index=i;
                          hasTex=true;
                          break;
                      }
                };
                if(hasTex){
                    textJson.splice(index, 1);
                    appcan.locStorage.setVal("textDraft",JSON.stringify(textJson));
                }
                
                
            }
     }
}
