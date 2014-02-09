/**
 * Created by yusuke on 2014/02/08.
 */

$(document).ready(function(){

    //SkyWayManager
    var SkywayM = new SkyWay.manager();

    $('#join').on('click',function(e){
        e.preventDefault();
        
        //SkyWayManagerを初期化
        SkywayM.init(1,$('#id').val());

        //接続を開始
        SkywayM.setConnectionHandler(function(msg){
            console.log(msg);
        });

        $('#sendLocation').on('click',function(e){
            e.preventDefault();
            SkywayM.sendLocation('test');
        });

        $('#startTalk').on('click',function(e){
            e.preventDefault();
            SkywayM.startTalk();
        });

        $('#stopTalk').on('click',function(e){
            e.preventDefault();
            SkywayM.stopTalk();
        });


    });


});