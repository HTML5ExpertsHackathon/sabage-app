/**
 * Created by yusuke on 2014/02/08.
 */

$(document).ready(function(){

    //SkyWayManager
    var SkywayM = new SkyWay.manager();

    //SkyWayManagerを初期化
    SkywayM.init(2,'yusuke3');

    //接続を開始
    SkywayM.setConnectionHandler(function(msg){
        console.log(msg);
    });

    $('#sendLocation').on('click',function(e){
        e.preventDefault();
        SkywayM.sendLocation('test');
    });
});