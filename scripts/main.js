$(function () {
    $(".header li.active").prev().find("a").css("background", "none");
    $(".screenSize ul li a span").parent().css("padding-top", "4px");
    $(".screenSize ul li.active a span").parent().css("padding-top", "10px");


	$(".serie .tabs li").live('click',function(){
		if(!$(this).hasClass('active')){
			$(this).addClass('active').siblings('.active').removeClass('active');
			$(this).parent().siblings('.content').find('.tab-inner.active').removeClass('active').siblings('.tab-inner').addClass('active');
		}
	});


    $(".header a.compareLink").click(
      function () {
         $(this).addClass('compareHover');
		 $('body').animate({ 'scrollTop':0});
		 $('#modal-compare').modal('show');
		 return false;
		 
      }
    );
	
	$('#modal-compare').on('hide', function () {
		$('a.compareLink').removeClass('compareHover');
	})
	$('.question').click (function(){
		
		if( $(this).parent().find('.tech-conflict').is(':hidden') ) {
			$('.tech-conflict').fadeOut();
			$(this).parent().find('.tech-conflict').fadeToggle();
		}
		
    });	
});



$(function(){

	$('.info .btn.hide').hide();
	$('.info .logo-block li').live('click',function(){
		var that=$(this),
		parent = that.parent(),
		sib = parent.siblings('.techs'),
		num = parent.find('li').index(that),
		active = sib.find('.tech-item.active').length>0?sib.find('.tech-item.active') :sib.find('.tech-item').first(),
		newActive = sib.find('.tech-item').eq(num),
		hidden = active.find('.hidden-block');
		
		
		hidden.slideUp(function(){
			hidden.removeClass('active');
			active.fadeOut(function(){
				$(this).removeClass('active');
				newActive.fadeIn(function(){
					$(this).addClass('active')
					
				});
				
				if(parent.hasClass('without-fade')){
					parent.removeClass('without-fade');
				}
			});
		});
		active.find('.btn.hide').hide().siblings('.show').show();
		$('body').animate({ 'scrollTop':sib.offset().top-70 });
		
		
		
		
		
		
		
		that.addClass('active').siblings('.active').removeClass('active');
	});
	
	$('.info .tech-item .close-block').live('click',function(){
		$(this).closest('.tech-item').find('.hidden-block').slideUp(function(){
			$(this).removeClass('active');
		});
		$(this).closest('.tech-item').find('.btn.hide').hide().siblings('.show').show();
		$('body').animate({ 'scrollTop':$(this).closest('.techs').offset().top-70 });
		return false;
	});
	
	
	$('.info .tech-item .show').live('click',function(){
		$(this).closest('.tech-item').find('.hidden-block').slideDown(function(){
			$(this).addClass('active');
		});
		$(this).hide().siblings('.hide').show();
		return false;
	});
	
	$('.info .tech-item .hide').live('click',function(){
		$(this).closest('.tech-item').find('.hidden-block').slideUp(function(){
			$(this).removeClass('active');
		});
		$(this).hide().siblings('.show').show();
		return false;
	});
});



$(function () {
    // Youtube and Vimeo Flexslider Control

    var tag = document.createElement('script');
    tag.src = "http://www.youtube.com/player_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    jQuery(window).load(function () {
        jQuery('.videoSlider').flexslider({
            directionNav: false,
            pauseOnHover: false,
            video: true,
            controlsContainer: ".narrow-slider",
			start: function(slider){
				slider.slides.each(function(n){
					if($(this).find('iframe').length>0){
						slider.controlNav.eq(n).addClass('videoSlide');
					}
				});
				
			}
        });

        var vimeoPlayers = jQuery('.flexslider').find('iframe'), player;

        for (var i = 0, length = vimeoPlayers.length; i < length; i++) {
            player = vimeoPlayers[i];
            $f(player).addEvent('ready', ready);
        }

        function addEvent(element, eventName, callback) {
            if (element.addEventListener) {
                element.addEventListener(eventName, callback, false)
            } else {
                element.attachEvent(eventName, callback, false);
            }
        }

        function ready(player_id) {
            var froogaloop = $f(player_id);
            froogaloop.addEvent('play', function (data) {
                jQuery('.flexslider').flexslider("pause");
            });

            froogaloop.addEvent('pause', function (data) {
                jQuery('.flexslider').flexslider("play");
            });
        }
	/*-------------------------------------------------------------------------------------------------------------------------------------------------*/
        jQuery(".flexslider")

        .flexslider({
            before: function (slider) {
                if (slider.slides.eq(slider.currentSlide).find('iframe').length !== 0)
                    $f(slider.slides.eq(slider.currentSlide).find('iframe').attr('id')).api('pause');
               
                playVideoAndPauseOthers($('iframe')[0]);
            },
			start: function(slider){
				slider.slides.each(function(n){
					if($(this).find('iframe')){
						slider.slider.controlNav.find('li').eq(n).addClass('videoSlide');
					}
				});
			}


        });
		jQuery(".info")

        .flexslider();
		
		/*-------------------------------------------------------------------------------------------------------------------------------------------------*/
        function playVideoAndPauseOthers(frame) {
            jQuery('iframe').each(function (i) {
                var func = this === frame ? 'playVideo' : 'stopVideo';
                this.contentWindow.postMessage('{"event":"command","func":"' + func + '","args":""}', '*');
            });
        }

        /* ------------------ PREV & NEXT BUTTON FOR FLEXSLIDER (YOUTUBE) ------------------ */
        jQuery('.flex-next, .flex-prev').click(function () {
            playVideoAndPauseOthers($('iframe')[0]);
        });



        //YOUTUBE STUFF

        function controlSlider(event) {
            console.log(event);
            var playerstate = event.data;
            console.log(playerstate);
            if (playerstate == 1 || playerstate == 3) {
                jQuery('.flexslider').flexslider("pause");
            };
            if (playerstate == 0 || playerstate == 2) {
                jQuery('.flexslider').flexslider("play");
            };
        };

        var player = new YT.Player('youtubevideo', {
            events: {
                'onReady': function (event) { console.log(event); },
                'onStateChange': function (event) { controlSlider(event); }
            }
        });
    });
});

//Запуск слайдера с прокруткой

$(function () {
	
	var sliders = $('.block .techs').scrollSlider();
	sliders = sliders.add( $('.seria-slider-wrap').scrollSlider({
		slideSelector: '.seria-slider li',
		paginator: '.seria-slider-pag',
		prevSelector: '.left-arrow',
		nextSelector: '.right-arrow',
		slideDistance: 120
	}) );
        /*
		var sliders = $('.techs').scrollSlider(options);
		
		//Настройки по-умолчанию
		ScrollSLider.defaults = {
			paginator: 'next',
			slideSelector: '.tech-item',
			sliderEffect: 'fade', //  fade | move
			openButtonSelector: 'a.show',
			closeButtonSelector: 'div.close-block, .close, .hide',
			hidenBlockSelector: '.hidden-block',
			prevSelector: '.prev',
			nextSelector: '.next',
			offsetTop: 0,
			offsetBottom: 70,
			fadeSpeed: 500,
			slideSpeed: 300,
			slideDistance: 0,
			trottleTime: 200
		};
        */
});


