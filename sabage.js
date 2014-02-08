/**
 * Created by yusuke on 2014/02/08.
 */

$(document).ready(function(){

    //LocationManager
    var locationM = new Location.manager();

    //LocationManagerを初期化
    locationM.init('#gmap');

    //自分の位置を表示開始する
    locationM.setMyMarker();


    var other = {
        markerObject: null,
        latitude: 36.3005131,
        longitude: 138.8473839
    }

    //相手の位置を表示する
    locationM.setOtherMarker(other);

});