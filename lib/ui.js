UI = {
	init:function(){
	    var hammertime = Hammer($('body')[0], {
	        drag:false,
	        transform:false
	        // prevent_default:true
	    })
	    //set heights
	    // $('#screen')

	    //set triggers
	    $('body').on('click', '#title-screen.active', function(){
	        $('.blink').removeClass('blink').addClass('selected');
	        $('#confirm')[0].play();
	        $('#theme').animate({volume:0}, 1000);
	        setTimeout(function(){
	            UI.setScreen($('#login-screen'));
	        }, 1000)
	    });
	    $('body').on('click', '#login-button', UI.login);
	    $('.zoom').on('click', function(){
	    	if($(this).hasClass('zoom-in')){
	    		locationM.zoomIn();
	    	} else {
	    		locationM.zoomOut();
	    	}
	    })
	    $('input').on('input', function(){
	    	$('#type')[0].currentTime = 0;
	    	$('#type')[0].play();
	    })
	    $('input').on('keyup',function(){

    	  	var c = this.selectionStart,
	      	r = /[^a-zA-Z0-9]/gi,
	      	v = $(this).val();
		  	if(r.test(v)) {
		    $(this).val(v.replace(r, ''));
		    	c--;
		  	}
		  	this.setSelectionRange(c, c);
	    })
	    $('#theme')[0].play();
	},
	setScreen:function($newactive){
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

					setTimeout(function(){
	    				locationM.init('#gmap');
						locationM.setMyMarker();
					},100);
					break;
			}
		}, 500)
	},
	login:function(){
		var team = $('#team-input').val();
		var player = $('#player-input').val();
		if(!team.length || !player.length){
			UI.showError('Login Error', 'Please enter your team name and player name.')
			return;
		}
		//skyway code
		/*on success*/
		$('#start')[0].play();
		UI.setScreen($('#radar-screen'));
		return;
		//connect to all players
		/*on error*/
		UI.showError('Login Error', "Can't log in.");	
	},
	showError:function(title, message){
		$('#dialog').attr('title', title);
		$('#dialog-text').text(message);
		$('#dialog').dialog();
	}
}