/**
 * Created by yusuke on 2014/02/08.
 */

$(document).ready(function(){

    locationM = new Location.manager();
    skywayM = new SkyWay.manager();
    UI = new UI.manager();

    var docType = {
        firstLocation: 1,
        updateLocation: 2,
        message: 3
    }

    $('body').on('click', '#title-screen.active', function(){
        $('.blink').removeClass('blink').addClass('selected');
        $('#confirm')[0].play();
        $('#theme').animate({volume:0}, 1000);
        setTimeout(function(){
                UI.setScreen($('#login-screen'));
            }, 1000);
    });

    $('body').on('click', '#login-button', function(){
        var team = $('#team-input').val();
        var player = $('#player-input').val();
        if(!team.length || !player.length){
            UI.showError('Login Error', 'Please enter your team name and player name.')
            return;
        }

        UI.setScreen($('#radar-screen'),function(){
            //GoogleMapの初期化と自分の位置にマーカを描画
            locationM.init('#gmap');
            locationM.setMyMarker(function(myLocation){

                $('#start')[0].play();

                //SkyWay関連の処理を開始
                skywayM.init(team,player,function(peer){
                    //init処理が完了したら全てのチームメンバに対して自分の位置情報を送信(STEP1)
                    //myLocation.type = docType.firstLocation;

                    myLocation.type = docType.updateLocation;
                    skywayM.sendMessage(myLocation,peer);
                    var _timer = setInterval(function(){
                        myLocation.type = docType.updateLocation;
                        skywayM.sendMessage(myLocation,peer);
                    },5000);
                    peer.timer = _timer;

                },function(err){
                    //init処理にエラーが発生した場合の処理
                    UI.showError('Login Error', err);

                },function (peer,msg){
                    //チームメンバから位置情報を受信したらマーカーを描画
                    locationM.updateOtherMarker(msg);

                    /*if(msg.type == docType.firstLocation){
                        locationM.updateOtherMarker(msg);
                        if(locationM.getMyLocation()){
                            var _msg = locationM.getMyLocation();
                            _msg.type = docType.updateLocation;
                                skywayM.sendMessage(_msg,peer);

                        }
                    }else if(msg.type == docType.updateLocation){
                        locationM.updateOtherMarker(msg);
                    }*/

                },function (peer){
                    //チームメンバが切断したらマーカーを削除
                    console.log('切断しました:'+peer);
                    locationM.deleteOtherMarker(peer);

                    //タイマーも解除
                    clearInterval(peer.timer);

                });

                //自分の位置情報が更新された場合は同じチームのメンバへマルチキャストする
                /*locationM.updateMyMarker(function(myLocation){
                    myLocation.type = docType.updateLocation;
                    skywayM.sendMessage(myLocation);

                });*/

            });

        });

    });

    $('.zoom').on('click', function(){
        if($(this).hasClass('zoom-in')){
            locationM.zoomIn();
        } else {
            locationM.zoomOut();
        }

    });

    $('input').on('input', function(){
        $('#type')[0].currentTime = 0;
        $('#type')[0].play();

    });

    $('#speak-button').on('click', function(){
        if(!skywayM.isSpeaking()){
            skywayM.startSpeak();
            $("#speak-button").text("stopSpeak");

        }else{
            skywayM.stopSpeak();
            $("#speak-button").text("Speak");

        }

    });


    $('input').on('keyup',function(){
        var c = this.selectionStart,
            r = /[^a-zA-Z0-9]/gi,
            v = $(this).val();
        if(r.test(v)) {
            $(this).val(v.replace(r, ''));
            c--;
        }
        this.setSelectionRange(c, c);

    });
});