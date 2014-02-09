/**
 * Created by yusuke on 2014/02/08.
 */

/**
 * define namespace
 */
if(!window.Location) Location = {};

/**
 * define Location.manager
 */
(function(){

    /**
     * @constructor
     */
    function manager(){
    }

    Location.manager = manager;

    /**
     * メンバオブジェクト
     */
    var myMap;
    var myGmaps;
    var myGeolocation;
    var watchId;
    var myMarker;

    // var zoom = 30;

    /**
     * メンバ変数
     */
    var otherMarkers = [];

    /**
     * Public Method
     * @type {{init: Function, setMyMarker: Function}}
     */
    manager.prototype = {

        init : function(dom){

            //地図を表示

            myGmaps = GMaps;
            myGeolocation = navigator.geolocation;
            
            myMap = new GMaps({
                div: dom,
                zoom: 30,
                lat: 35.65858,
                lng: 139.745433,
                disableDefaultUI: true,
                styles: [{
                    stylers: [
                        {   hue: '#2985f5'},
                        {   gamma: 1.50},
                        {   saturation: -40}]
                }]
            });

        },

        setMyMarker : function(){

            _getMylocation(myGmaps,function(myLocation){

                //位置情報が取得できていなければエラー
                if(myLocation.mes != ''){
                    console.log(myLocation.mes);
                }

                //センタリング
                myMap.setCenter(myLocation.latitude,myLocation.longitude);

                var image = {
                    url: 'resource/kaeru.svg.med.png',
                    origin: new google.maps.Point(0,0),
                    anchor: new google.maps.Point(15,15),
                    scaledSize: new google.maps.Size(30, 30)
                }
                //自分の位置にマーカーを設置
                myMarker = myMap.addMarker({
                    lat:myLocation.latitude,
                    lng:myLocation.longitude,
                    title:'Your Position',
                    icon:image
                });

                _watchPos(watchId,myGeolocation,function(myLocation){

                    //位置情報が取得できていなければエラー
                    if(myLocation.mes != ''){
                        console.log(myLocation.mes);
                    }

                    console.log(myLocation);

                    //古いマーカーを削除
                    myMap.removeMarker(myMarker);
                    //自分の位置にマーカーを設置
                    myMarker = myMap.addMarker({
                        lat:myLocation.latitude,
                        lng:myLocation.longitude,
                        title:'Your Position',
                        icon: image
                    });

                    //移動
                    myMap.setCenter(myLocation.latitude,myLocation.longitude);

                });

            });

        },

        setOtherMarker : function(other){

            var _index = otherMarkers.indexOf(other.markerId);
            var image = {
                url: 'resource/frog.svg.med.png',
                origin: new google.maps.Point(0,0),
                anchor: new google.maps.Point(15,15),
                scaledSize: new google.maps.Size(30, 30)
            }
            if(_index >= 0){
                //すでにユーザが存在する場合
                myMap.removeMarker(other.id);
                return otherMarkers[_index] = myMap.addMarker({
                    lat:other.latitude,
                    lng:other.longitude,
                    title:'Other Position',
                    icon:image
                });
            }else{
                //ユーザが存在しない場合
                var _markerId = myMap.addMarker({
                    lat:other.latitude,
                    lng:other.longitude,
                    title:'Other Position',
                    icon:image
                });
                otherMarkers.push(_markerId);
                return _markerId;
            }

        },

        zoomIn: function(){
            var listener = google.maps.event.addListener(myMap, "idle", function() { 
                var zoom = myMap.getZoom();
                if (zoom > 30) {myMap.setZoom(Math.max(zoom-2,30));}
                google.maps.event.removeListener(listener); 
            });
            
        },
        zoomOut: function(){
            var listener = google.maps.event.addListener(myMap, "idle", function() { 
                var zoom = myMap.getZoom();
                if (zoom < 40) {myMap.setZoom(Math.min(zoom+2,40));}
                google.maps.event.removeListener(listener); 
            });
        }


    }

    //Private Method ----------

    /**
     * 自分の位置情報を取得する
     * @private
     *
     */
    function _getMylocation(myGmaps,callback){

        myGmaps.geolocate({
            success: function(position) {
                var _myLocation = {
                    latitude:position.coords.latitude,
                    longitude:position.coords.longitude,
                    mes: ''
                };
                callback(_myLocation);
            },
            error: function(error) {
                var _myLocation = {
                    latitude:null,
                    longitude:null,
                    mes: error.message
                };
                callback(_myLocation);
            },
            not_supported: function() {
                var _myLocation = {
                    latitude:null,
                    longitude:null,
                    mes: "ブラウザが対応していません。"
                };
                callback(_myLocation);
            },
            always: function() {
            }
        });

    }

    /**
     * 継続的に位置情報を取得する
     * @private
     *
     */
    function _watchPos(watchId,myGeolocation,callback){

        watchId = myGeolocation.watchPosition(
            function(position){
                var _myLocation = {
                    latitude:position.coords.latitude,
                    longitude:position.coords.longitude,
                    heading:position.coords.heading,
                    mes:''
                };
                callback(_myLocation);
            },function(err){
                var _errCause = "";
                switch(err.code) {
                    case err.TIMEOUT:
                        errCause = 'Timeout';
                        break;
                    case err.POSITION_UNAVAILABLE:
                        errCause = 'Position unavailable';
                        break;
                    case err.PERMISSION_DENIED:
                        errCause = 'Permission denied';
                        break;
                    case err.UNKNOWN_ERROR:
                        errCause = 'Unknown error';
                        break;
                }
                var _myLocation = {
                    latitude:null,
                    longitude:null,
                    heading:null,
                    mes:errCause
                };
                callback(_myLocation);
            },
            {
                enableHighAccuracy:true,
                maximumAge:0
            }
        );

        console.log('Started Watch Position.');
    }


    /**
     * 継続的な位置情報取得を終了する
     * @private
     */
    function _clearWatchPos(){
        this.myGeolocation.clearWatch(this.watchId);
        console.log('Stoped Watch Position.');
    }


})()
