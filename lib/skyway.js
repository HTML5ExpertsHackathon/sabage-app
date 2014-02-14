/**
 * Created by yusuke on 2014/02/09.
 */

/**
* define namespace
*/
if(!window.SkyWay) SkyWay = {};

/**
 * define SkyWay.manager
 */
(function(){

    /**
     * @constructor
     */
    function manager(){
        util.supports.sctp = false
    }

    SkyWay.manager = manager;

    /**
     * 定数
     */
    const APIKEY = '1d3440c4-90de-11e3-8de1-c3aee638c094';
    const TURNSERVERHOST = '153.149.7.185';
    const TURNUSERNAME = 'iac';
    const TURNPASS = 'webcore';

    /**
     * メンバオブジェクト
     */
    var peer;
    var localStream;
    var speakStats = {
        stop: false,
        started: true
    };

    /**
     * メンバ変数
     */
    var connObjectList = [];
    var callObjectList = [];
    var myTeamId;
    var speakFlag = speakStats.stop;

    /**
     * Public Method
     */
    manager.prototype = {

        init : function(teamId, userName, successInitCallback, errorInitCallback, receivedMessageCallback,closePeerCallback){

            //チームIDを格納
            myTeamId = teamId;

            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            navigator.getUserMedia({ video: false,audio: true }, function(stream) {

                localStream = stream;

                peer = new Peer(myTeamId+'_'+userName,{
                    key: APIKEY,
                    config: { 'iceServers': [
                        { 'url':'turn:'+TURNSERVERHOST,'username':TURNUSERNAME,'credential':TURNPASS },
                        { 'url':'turn:'+TURNSERVERHOST+':443?transport=tcp','username':TURNUSERNAME,'credential':TURNPASS },
                    ] },
                    debug: 3
                });
                peer.on('connection', function(_conn) {
                    connObjectList.push(_conn);
                    console.log(_conn);
                    //DataConnectionのイベントを設置
                    _createDataConnectionEvents(_conn,receivedMessageCallback,closePeerCallback,successInitCallback);
                });

                peer.on('error', errorInitCallback);

                peer.on('open',function(){
                    //同じチーム内のメンバと接続を行い接続が完了したら関連イベントを設置する
                    _startConnection(function(conn){
                        _createDataConnectionEvents(conn,receivedMessageCallback,closePeerCallback,successInitCallback);
                    });
                });

                // MediaChannel関連のイベントを設置（相手からコールが来た場合）
                peer.on('call', function(call){

                    //answerには何も入れずに返す
                    call.answer();

                    // 相手からのメディアストリームを待ち受ける
                    call.on('stream', function(stream){
                        $('#otherAudio').prop('src', URL.createObjectURL(stream));
                    });

                    // 相手がクローズした場合
                    call.on('close', function(){
                        console.log('Media Connection Closed');
                    });

                });

            },  errorInitCallback);

        },

        sendMessage : function(message,peer){
            if(peer == null){
                for(var i = 0;i < connObjectList.length;i++){
                    _sendMessage(connObjectList[i],message);
                }
            }else{
                _sendMessage(peer,message);
            }
        },

        startSpeak: function(){

            //メディア接続を開始
            _startMediaConnection();
            speakFlag = speakStats.started;

        },

        stopSpeak : function(){

            //メディア接続を切断
            _stopMediaConnection();
            speakFlag = speakStats.stop;

        },

        isSpeaking : function(){

            return speakFlag;

        }

    }

    function _startConnection(callback){
        _getUserList(function(userlist){
            for(var i = 0;i < userlist.length;i++){
                //新規接続
                var _conn = null;
                if(userlist[i].substring(0,userlist[i].indexOf("_",0)) == myTeamId){
                    _conn = peer.connect(userlist[i],{serialize:'binary',reliable:'true'});
                    connObjectList.push(_conn);
                    callback(_conn);
                }

            }
        });
    }

    function _createDataConnectionEvents(conn,receivedMessageCallback,closePeerCallback,successInitCallback){
        conn.on('open', function() {
            // メッセージを受信
            conn.on('data', function(bin) {
                _binary2str(bin,function(str){
                    console.log("receiving:"+JSON.stringify(str));
                    receivedMessageCallback(conn,str);
                });
            });
            if(successInitCallback != null) successInitCallback(conn);
        });
        conn.on('close', function() {
            var _pos = connObjectList.indexOf(conn);
            if(_pos > 0){
                connObjectList.splice(_pos,1);
            }
            closePeerCallback(conn);
            conn.close();
        });

    }

    function _getUserList(callback){
        var _userList = [];
        $.get('https://skyway.io/active/list/'+APIKEY,
            function(list){
                for(var cnt = 0;cnt < list.length;cnt++){
                    if($.inArray(list[cnt],_userList)<0 && list[cnt] != peer.id){
                        _userList.push(list[cnt]);
                    }
                }
                callback(_userList);
            }
        );
    }

    function _sendMessage(conn,msg){
        msg.id = peer.id;
        _str2binary(JSON.stringify(msg),function(data){
            if(conn != null) {
                console.log("sending:"+JSON.stringify(msg));
                conn.send(data);
            }
        });
    }

    function _startMediaConnection(){
        for(var i = 0;i < connObjectList.length;i++){
            if(connObjectList[i] != null){
                var call = peer.call(connObjectList[i].peer,localStream);
                callObjectList.push(call);

                // 相手からのメディアストリームを受信しても何もしない
                call.on('stream', function(stream){
                });

                // 相手がクローズした場合はcallオブジェクトを削除
                call.on('close', function(){
                    console.log('Media Connection Closed');
                    var _pos = callObjectList.indexOf(call);
                    if(_pos > 0){
                        callObjectList.splice(_pos,1);
                        console.log(callObjectList);
                    }

                });
            }
            console.log(callObjectList);
        }
    }

    function _stopMediaConnection(){
        //stop時は全ての接続先を切断しcallオブジェクトを削除
        for(var i = 0;i < connObjectList.length;i++){
            if(callObjectList[i] != null){
                callObjectList[i].close();
                callObjectList.splice(i,1);
            }
        }

        console.log(callObjectList);
    }

    function _str2binary(str, callback){
        var reader = new FileReader();
        reader.onload = function(e){
            callback(reader.result);
        };
        reader.readAsArrayBuffer(new Blob([str]));
    }

    function _binary2str(bin, callback){
        var reader = new FileReader();
        reader.onload = function(e){
            callback(JSON.parse(reader.result));
        };
        reader.readAsText(new Blob([bin]));
    }


})()