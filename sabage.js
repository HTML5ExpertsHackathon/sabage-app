/**
 * Created by yusuke on 2014/02/08.
 */

$(document).ready(function(){
    locationM = new Location.manager();
    SkywayM = new SkyWay.manager();
    locationM.onposition = SkywayM.sendLocation;
    SkywayM.dcCallback = locationM.setOtherMarker;
    UI.init();

    setInterval(function(){
        var data = locationM.lastlocation;
        SkywayM.sendLocation(data)
    }, 1000)
    
    //LocationManager

    //LocationManagerを初期化

    //自分の位置を表示開始する
    // locationM.setMyMarker();


    // var other = {
    //     markerObject: null,
    //     latitude: 36.3005131,
    //     longitude: 138.8473839
    // }

    //相手の位置を表示する
    // locationM.setOtherMarker(other);
    //SkyWayManager

    //SkyWayManagerを初期化
    // SkywayM.init(2,'yusuke3');

    //接続を開始
    // SkywayM.setConnectionHandler(function(msg){
    //     console.log(msg);
    // });

    $('#sendLocation').on('click',function(e){
        e.preventDefault();
        SkywayM.sendLocation('test');
    });
});