/**
 * define namespace
 */
if(!window.UI) UI = {};

/**
 * define Location.manager
 */
(function(){

<<<<<<< HEAD
    /**
     * @constructor
     */
    function manager(){
        var _hammertime = Hammer($('body')[0], {
            drag:false,
            transform:false
        });
=======
    	  	var c = this.selectionStart,
	      	r = /[^a-zA-Z0-9]/gi,
	      	v = $(this).val();
		  	if(r.test(v)) {
		    $(this).val(v.replace(r, ''));
		    	c--;
		  	}
		  	this.setSelectionRange(c, c);
	    })
	},
	setScreen:function($newactive){
		var $curactive = $('.active');
		// var $newactive = $('#'+pageid);
		if($curactive.is($newactive)){
			return;
		}
		$curactive.removeClass('active').fadeOut();
>>>>>>> ui

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
                        var $map = $('#map-container');
                        var _width = $map.width();
                        $map.height(_width);
                        $map.width(_width);
                        $('#gmap').height(_width);
                        $('#gmap').width(_width);
                        $('#overlay').height(_width);
                        $('#overlay').width(_width);

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
