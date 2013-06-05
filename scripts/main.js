$(function(){
	$(".header li.active").prev().find("a").css("background", "none");
});

$(function(){
	$(".serie .tabs li").live('click',function(){
		if(!$(this).hasClass('active')){
			$(this).addClass('active').siblings('.active').removeClass('active');
			$(this).parent().siblings('.content').find('.tab-inner.active').removeClass('active').siblings('.tab-inner').addClass('active');
		}
	});
});
$(function(){
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
        $(this).parent().find('.tech-conflict').fadeToggle();
    });
});


/*$(function(){
	$('.logo-block li').live('click',function(){
		var that=$(this),
		parent = that.parent(),
		sib = parent.siblings('.techs'),
		num = parent.find('li').index(that),
		active = sib.find('.tech-item.active'),
		newActive = sib.find('.tech-item').eq(num),
		hidden = active.find('.hidden-block');
		
		//sib.find('.tech-item').eq(num).addClass('active').siblings('.active').removeClass('active');
		hidden.slideUp(function(){
			hidden.removeClass('active');
			active.fadeOut(function(){
				$(this).removeClass('active');
				newActive.fadeIn(function(){
					$(this).addClass('active')
					
				});
			});
		});
		
		$('body').animate({ 'scrollTop':sib.offset().top-70 });
		
		
		
		
		
		
		
		that.addClass('active').siblings('.active').removeClass('active');
	});
	
	$('.tech-item .close-block').live('click',function(){
		$(this).closest('.tech-item').find('.hidden-block').slideUp(function(){
			$(this).removeClass('active');
		});
		
		$('body').animate({ 'scrollTop':$(this).closest('.techs').offset().top-70 });
		return false;
	});
	
	
	$('.tech-item .show').live('click',function(){
		$(this).closest('.tech-item').find('.hidden-block').slideDown(function(){
			$(this).addClass('active');
		});
		$(this).text('Свернуть').removeClass('show').addClass('hide');
		return false;
	});
	
	$('.tech-item .hide').live('click',function(){
		$(this).closest('.tech-item').find('.hidden-block').slideUp(function(){
			$(this).removeClass('active');
		});
		$(this).text('Узнать больше').removeClass('hide').addClass('show');
		return false;
	});
});*/
$(function () {
    $('.slider')
        .anythingSlider({
            resizeContents: true,
            addWmodeToObject: 'opaque'
        })
});
$(function () {
    $('#videoSlider')
        .anythingSlider({
            resizeContents: true,
            addWmodeToObject: 'opaque'
        })
        // Initialize video extension
        // see https://developers.google.com/youtube/player_parameters?hl=en#Parameters for a list of parameters
        .anythingSliderVideo({
            // video id prefix; suffix from $.fn.anythingSliderVideo.videoIndex
            videoId: 'asvideo',
            // auto load YouTube api script
            youtubeAutoLoad: true,
            // see: https://developers.google.com/youtube/player_parameters#Parameters
            youtubeParams: {
                modestbranding: 1,
                iv_load_policy: 3,
                fs: 1
            }
        });
});


//Запуск слайдера с прокруткой
$(function () {

	var sliders = $('.techs').scrollSlider({ fadeSpeed: 500 });
	sliders = sliders.add( $('.seria-slider-wrap').scrollSlider({
		slideSelector: '.seria-slider li',
		paginator: '.seria-slider-pag',
		prevSelector: '.left-arrow',
		nextSelector: '.right-arrow'
	}) );

        /*
		var sliders = $('.techs').scrollSlider(options);
		
		//Настройки по-умолчанию
		ScrollSLider.defaults = {
			paginator: 'next', || можно записать в виде селектора
			slideSelector: '.tech-item',
			openButtonSelector: 'a.show',
			closeButtonSelector: 'div.close-block',
			hidenBlockSelector: '.hidden-block',
			prevSelector: '.prev',
			nextSelector: '.next',
			offsetTop: -40,
			offsetBottom: -40,
			fadeSpeed: 300
		};
        */
});




