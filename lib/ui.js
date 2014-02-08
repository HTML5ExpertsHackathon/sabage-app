$(window).ready(function(){
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
		setTimeout(function(){
			UI.setScreen($('#login-screen'));
		}, 1000)
	});
	$('body').on('click', '#login-button', UI.login);
});

UI = {
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