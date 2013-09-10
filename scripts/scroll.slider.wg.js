	
;(function (){

	

	//Обертка в стиле jQuery
	$.prototype.scrollSlider = function (options) {
		
		return $(this).each(function () {
			return new ScrollSLider(this, options);
		});
	};

	//Конструктор плагина
	function ScrollSLider (element, options) {
		//Настройки базовых отношений
		this.el = element;
		element.ui = this;
		this.$el = $(this.el);
		this.options = $.extend({}, ScrollSLider.defaults,options);

		//Инициализация
		this.initialize();
	}

	window.ScrollSLider = ScrollSLider;

	ScrollSLider.blockAll = true;

	//Настройки плагина по-умолчанию
	ScrollSLider.defaults = {
		paginator: 'next',
		slideSelector: '.tech-item',
		sliderEffect: 'move', //  fade | move
		openButtonSelector: 'a.show',
		closeButtonSelector: 'div.close-block, .close, .hide',
		hidenBlockSelector: '.hidden-block',
		prevSelector: '.prev',
		nextSelector: '.next',
		middleLineOffset: 40,
		middleLineGap: 75,
		offsetTop: 0,
		offsetBottom: 70,
		fadeSpeed: 500,
		slideSpeed: 300,
		slideDistance: 0,
		trottleTime: 300
	};

	
	//Инициализатор
	ScrollSLider.prototype.initialize = function () {
		this.$slides = this.$el.find(this.options.slideSelector);

		if (! ($.browser.msie && $.browser.version < 9 ) ) {
			(new WindowListener()).listenTo(this);
		}
		
		
		this.inRange = false;
		this.isSlideOpen = false;
		this.isTrottle = false;
		
		if (this.options.paginator == 'next')
			this.$paginator = this.$el.next();
		else 
			this.$paginator =  this.$el.find(this.options.paginator);

		this.$pages = this.$paginator.children().not(this.options.prevSelector).not(this.options.nextSelector);
		this.$prevNext = this.$el.find(this.options.prevSelector).add( this.$el.find(this.options.nextSelector) );
		this.$prevNext = this.$prevNext.add( this.$paginator.find(this.options.prevSelector) )
							.add( this.$paginator.find(this.options.nextSelector) );

		this.activeIdx = 0;

		//Переход на слайдер и врокручивание на нужный таб при хеше
		if (location.hash.toString() && location.hash.toString().split('#')[1].split('/')[0] == this.$el.attr('name') ) {
			this.activeIdx = (location.hash.toString().split('/')[1] || 1) - 1;
			
			var self = this;
			setTimeout(function () {
				$(document).scrollTop(self.$el.offset().top - 100);
			}, 1000);
			
		}

		var self = this;
		$(window).on('hashchange', function() {
			if (location.hash.toString() && location.hash.toString().split('#')[1].split('/')[0] == self.$el.attr('name') ) {
				$('html, body').animate({scrollTop: self.$el.offset().top - 100}, self.options.slideSpeed, function (){
					self.activeIdx = (location.hash.toString().split('/')[1] || 1) - 1;
					self.setActive();
				});
			}
		});

		if (this.options.sliderEffect == 'move') {
			this.$slides.wrapAll('<div class="slider-wrapper slide"></div>');
			this.$slides.css({ 'position' : 'absolute', 'width' : '100%',top: 0, left: 0});
			this.$slides.hide().eq(this.activeIdx).show();
		}


		this.setActive();

		this.$el.find(this.options.closeButtonSelector).hide();
		
		//Выбор слайда через таб
		this.$pages.on('click', {self: this}, this.pagerClick);
		
		//Выбор слайда стрелками
		this.$prevNext.on('click', {self: this}, this.prevNext);
		this.$prevNext.on('mousedown, selectstart', function() {return false;} );
		
		//Открытие/закрытие слайдов
		this.$el.on('click', this.options.openButtonSelector, {self: this}, this.openSlide);
		this.$el.on('click', this.options.closeButtonSelector, {self: this}, this.closeSlide);
		
		

		//Слайдинг табов
		this.pagesWidth = this.$pages.outerWidth(true);
		var pagerWidth = this.pagesWidth * this.$pages.length;
		
		//Добавление стрелок к пигинатору если длина его элементов больше его ширины
		if (pagerWidth > this.$paginator.width() ) {
			//this.$paginator.append('<span class="prev"></span><span class="next"></span>');
			this.$pages.wrapAll('<div class="slider-band"></div>');
			this.$paginator.find('.slider-band').wrapAll('<div class="slider-wrapper"></div>');

			this.visiblePages = this.$paginator.width() / this.pagesWidth;
			this.visiblePages = Math.ceil(this.visiblePages);

			var prevWidth = this.$paginator.find('.slider-wrapper').width();
			var nextWidth = this.visiblePages * this.pagesWidth;
			this.$paginator.find('.slider-wrapper').width(nextWidth).css({ 'margin-left': -(nextWidth - prevWidth)/2 });

			this.pagerPosition = 0;
			this.maxPagerPosition = this.$pages.length - this.visiblePages + 1;
			this.$paginator.find('.prev').hide();

		}
		

		
		

	};

	//Смена слайда
	ScrollSLider.prototype.setActive = function () {
		if (this.options.sliderEffect == 'move') { 
			var prevIdx = this.$pages.index( this.$pages.filter('.active') );
		}
		
		//Смена указателя на пейджере
		this.$pages.eq(this.activeIdx).addClass('active')
			.siblings().removeClass('active');

		//Смена слайда с анимацией
		if (this.options.sliderEffect == 'move') {
			
			if (prevIdx != this.activeIdx && prevIdx != -1) {
				this.$slides.eq(this.activeIdx).show();
				var width = this.$slides.parent().width() + this.options.slideDistance;
				
				this.$slides.eq(this.activeIdx).css({'margin-left': width * (prevIdx > this.activeIdx ? -1 : 1) })
					.animate({ 'margin-left' : 0 }, this.options.slideSpeed);
			
				this.$slides.eq(prevIdx).animate({'margin-left': width * (prevIdx > this.activeIdx ? 1 : -1)}, this.options.slideSpeed, function () {
					$(this).hide();
				});

				this.$slides.eq(0).parent().animate({'height':this.$slides.eq(this.activeIdx).outerHeight()}, this.options.slideSpeed );
			} else {
				this.$slides.eq(0).parent().height( this.$slides.eq(prevIdx).outerHeight() );
			}
			
		} else {
			this.$slides.eq(this.activeIdx).fadeIn(this.options.fadeSpeed);
			this.$slides.not(this.$slides.eq(this.activeIdx)).stop(true, true).fadeOut(0);
		}

		//Скрытие/отображение стрелок
		if (this.activeIdx == 0) {
			this.$prevNext.filter(this.options.prevSelector).hide();
		} else {
			this.$prevNext.filter(this.options.prevSelector).show();
		}

		if (this.activeIdx >= this.$pages.length - 1) {
			this.$prevNext.filter(this.options.nextSelector).hide();
		} else {
			this.$prevNext.filter(this.options.nextSelector).show();
		}

		//Прокручивание табов при достижении края
		if (typeof this.pagerPosition == "number") {
			
			//if (this.pagerPosition + this.visiblePages <= this.activeIdx) { //Нормальное
			if (this.pagerPosition < this.activeIdx && this.pagerPosition < this.maxPagerPosition) { //То что зак захотел
				this.pagerPrevNext();
			}
			if (this.pagerPosition > this.activeIdx) {
				this.pagerPrevNext(-1);
			}
		}

	}

	//Функции обработки событий
	//Открытие слайда
	ScrollSLider.prototype.openSlide = function (e) {
		e.preventDefault();
		
		var $this = $(e.currentTarget);
		var self = e.data.self;
		if (self.options.sliderEffect == 'move') {
			$this.closest('.slider-wrapper.slide').css({ height: 'auto' });
			$this.closest(self.options.slideSelector).css({ position: 'static' });
		}
		//$this.closest('.slider-wrapper.slide').css({ height: 'auto' });
		$this.closest(self.options.slideSelector)//.css({ position: 'static' })			//Поиск слайда
			.find(self.options.openButtonSelector).hide()			//Скрытие кнопки отображения а
			.end().find(self.options.closeButtonSelector).show()		//Отображение кнопки показа
			.end().find(self.options.hidenBlockSelector).stop(true, true).fadeIn(self.options.fadeSpeed); //Анимация слайда

		self.isSlideOpen = true;
		
	}

	//Закрытие слайда
	ScrollSLider.prototype.closeSlide = function (e) {
		e.preventDefault();

		var $this = $(e.currentTarget);
		var self = e.data.self;
		$this.closest(self.options.slideSelector)				//Поиск слайда
			.find(self.options.openButtonSelector).show()			//Скрытие кнопки отображения а
			.end().find(self.options.closeButtonSelector).hide()		//Отображение кнопки показа
			.end().find(self.options.hidenBlockSelector).stop(true, true).fadeOut(self.options.fadeSpeed); //Анимация слайда
		
		$('body,html').stop(true, true).animate({ 'scrollTop': self.$el.offset().top - 100 }, 
			self.options.sliderEffect == 'move' ? self.options.slideSpeed : self.options.fadeSpeed);

		self.isSlideOpen = false;

	}

	
	ScrollSLider.prototype.pagerClick = function (e) {
		e.preventDefault();

		var $this = $(e.currentTarget);
		var self = e.data.self;
		
		if ( $this.hasClass('active') ) 
			return;

		if (self.isSlideOpen)
			self.$slides.eq(self.activeIdx).find(self.options.closeButtonSelector).eq(0).click();

		self.activeIdx = self.$pages.index(this);
		self.setActive();
	};

	ScrollSLider.prototype.prevNext = function (e) {
		e.preventDefault();

		var $this = $(e.currentTarget);
		var self = e.data.self;
		
		if (self.isSlideOpen)
			self.$slides.eq(self.activeIdx).find(self.options.closeButtonSelector).eq(0).click();

		self.activeIdx += $this.is(self.options.prevSelector) ? -1 : 1; 
		self.activeIdx = self.activeIdx < 0 ? 0 : self.activeIdx;
		self.activeIdx = self.activeIdx >= self.$pages.length ? self.$pages.length - 1 : self.activeIdx;
		


		self.setActive();
	};

	
	ScrollSLider.prototype.pagerPrevNext = function (dir) {
		dir = dir || 1;

		this.pagerPosition += dir;

		if (this.pagerPosition >= this.maxPagerPosition)
			this.pagerPosition = this.maxPagerPosition - 1;

		if (this.pagerPosition < 0)
			this.pagerPosition = 0;


		this.$paginator.find('.slider-band').stop(true, false)
			.animate({ 'margin-left': -this.pagesWidth * this.pagerPosition }, this.options.slideSpeed);
	}

	ScrollSLider.prototype.scrollCallback = function (e, delta, scrollSpeed) {

		//delta: -1 - вниз, +1 - вверх
		if (this.isTrottle) {
			e.preventDefault();
			return;
		}
		
		this.isTrottle = true;
		var self = this;
		setTimeout(function () {
			self.isTrottle = false;
		}, this.options.trottleTime);
		
		if (delta < 0 && this.activeIdx < this.$pages.length - 1 && !this.isSlideOpen) {
			e.preventDefault();
			this.activeIdx++;
			this.setActive();
		}

		if (delta > 0 && this.activeIdx > 0 && !this.isSlideOpen) {
			e.preventDefault();
			this.activeIdx--;
			this.setActive();
		}
		
	};


	//Window Singleton listener ****************************************************************************
	function WindowListener () {
		if (WindowListener.singelton)
			return WindowListener.singelton;

		
		this.listeners = [];
		$(window).on('mousewheel', {self: this}, this.windowMousewheel);
		$(window).on('scroll', {self: this}, this.windowScroll);
		
		WindowListener.singelton = this;

		$(window).scroll();
	}

	//Add Listener 
	WindowListener.prototype.listenTo = function (obj) {
		this.listeners.push(obj);
	};

	//Window Event Callbacks
	//Mousewheel Event Callback
	WindowListener.prototype.windowMousewheel = function (e, delta, deltaX, deltaY) {
		var self = e.data.self;

		if (ScrollSLider.blockAll)
			return;

		for (var i = 0; i < self.listeners.length; i++) {
			var obj = self.listeners[i];
			if (obj.inRange) {
				obj.scrollCallback(e, delta, WindowListener.scrollSpeed || 0 );
			}
				
		}

	};

	//Windowscroll Event Callback
	WindowListener.prototype.windowScroll = function (e) {
		//console.log($(document).scrollTop())
		var self = e.data.self;
		
		/*if (ScrollSLider.blockAll)
			return;*/
		
		for (var i = 0; i < self.listeners.length; i++) {
			var obj =  self.listeners[i];

			//Средняя линия слайдера
			//var objMiddleLine = obj.$el.outerHeight() / 2 +  obj.$el.offset().top;
			//if (!obj.$el.has(obj.$pager)) 
			//	objMiddleLine += obj.$pager.outerHeight() / 2;
			//Средняя линия окна
			//var windowMiddleLine = $(document).scrollTop() + $(window).height() / 2 + obj.options.middleLineOffset;
			
			var sliderHeight = obj.$el.outerHeight();
			if (!obj.$el.has(obj.$pager)) 
				sliderHeight += obj.$pager.outerHeight();

			var sliderTop = obj.$el.offset().top + obj.options.offsetTop;
			var windowTop = $(document).scrollTop();

			var sliderBottom = sliderTop - obj.options.offsetTop + sliderHeight + obj.options.offsetBottom;
			var windowBottom = windowTop + $(window).height();
			//console.log(windowTop < sliderTop && windowBottom > sliderBottom, windowTop, sliderTop, windowBottom, sliderBottom);
			//Определение попадания слайдера в пределы окна
			if (windowTop < sliderTop && windowBottom > sliderBottom ) {

			//if (Math.abs(windowMiddleLine - objMiddleLine) < obj.options.middleLineGap
			//	|| ) {
		
				obj.inRange = true;
			} else {
				
				obj.inRange = false;
			}

		}
		
	};


	
})();
