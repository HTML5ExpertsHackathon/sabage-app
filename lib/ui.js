/**
 * define namespace
 */
if(!window.UI) UI = {};

/**
 * define Location.manager
 */
(function(){

    /**
     * @constructor
     */
    function manager(){
        var _hammertime = Hammer($('body')[0], {
            drag:false,
            transform:false
        });

    }

    UI.manager = manager;

    /**
     * Public Method
     * @type {{setScreen: Function, showError: Function}}
     */
    manager.prototype = {

        setScreen : function ($newactive,callback){

            var $curactive = $('.active');
            // var $newactive = $('#'+pageid);
            if($curactive.is($newactive)){
                return;
            }
            $curactive.removeClass('active').fadeOut();

            setTimeout(function(){
                $newactive.addClass('active').fadeIn();
                switch ($newactive[0].id){
                    case 'radar-screen':
                        var $map = $('#map-container')
                        $map.height($map.width());
                        $map.width($map.width());
                        $('#gmap').height($map.width());
                        $('#gmap').width($map.width());
                        $('#overlay').height($map.width());
                        $('#overlay').width($map.width());

                        setTimeout(callback,100);
                        break;
                }
            }, 500)
        },

        showError : function(title, message){

            $('#dialog').attr('title', title);
            $('#dialog-text').text(message);
            $('#dialog').dialog();

        }

    }

})()