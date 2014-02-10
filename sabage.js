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
        message: 2
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

            locationM.init('#gmap');
            locationM.setMyMarker(function(myLocation){

                $('#start')[0].play();
                skywayM.init(team,player,function(peer){

                    myLocation.type = docType.firstLocation;
                    skywayM.sendMessage(myLocation,peer);

                },function(err){

                    UI.showError('Login Error', err);

                },function (peer,msg){

                    if(msg.type == docType.firstLocation){
                        locationM.updateOtherMarker(msg);
                        if(locationM.getMyLocation()){
                            var _msg = locationM.getMyLocation();
                            _msg.type = docType.updateLocation;
                            skywayM.sendMessage(_msg,peer);
                        }
                    }else if(msg.type == docType.updateLocation){
                        locationM.updateOtherMarker(msg);
                    }

                });

                locationM.updateMyMarker(function(myLocation){
                    myLocation.type = docType.updateLocation;
                    skywayM.sendMessage(myLocation);

                });

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

    $('#theme')[0].play();

});