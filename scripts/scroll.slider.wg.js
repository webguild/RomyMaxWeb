	
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

	//Настройки плагина по-умолчанию
	ScrollSLider.defaults = {
		paginator: 'next',
		slideSelector: '.tech-item',
		openButtonSelector: 'a.show',
		closeButtonSelector: 'div.close-block, .close, .hide',
		hidenBlockSelector: '.hidden-block',
		prevSelector: '.prev',
		nextSelector: '.next',
		offsetTop: -40,
		offsetBottom: -40,
		fadeSpeed: 500,
		trottleTime: 200
	};

	
	//Инициализатор
	ScrollSLider.prototype.initialize = function () {
		this.$slides = this.$el.find(this.options.slideSelector);

		(new WindowListener()).listenTo(this);
		
		this.inRange = false;
		this.isSlideOpen = false;
		this.isTrottle = false;
		
		if (ScrollSLider.defaults.paginator == 'next')
			this.$paginator = this.$el.next();
		else 
			this.$paginator =  this.$el.find(this.options.paginator);

		this.$pages = this.$paginator.children();

		this.activeIdx = 0;
		this.setActive();

		this.$el.find(this.options.closeButtonSelector).fadeOut(0);
		
		this.$pages.on('click', {self: this}, this.pagerClick);
		this.$el.on('click', this.options.openButtonSelector, {self: this}, this.openSlide);
		this.$el.on('click', this.options.closeButtonSelector, {self: this}, this.closeSlide);
		this.$el.on('click', this.options.prevSelector, {self: this}, this.prevNext);
		this.$el.on('click', this.options.nextSelector, {self: this}, this.prevNext);
		console.log(this.$el.find(this.options.closeButtonSelector) );
		
		
	};

	//Смена слайда
	ScrollSLider.prototype.setActive = function () {
		//Смена указателя на пейджере
		this.$pages.eq(this.activeIdx).addClass('active')
			.siblings().removeClass('active');

		//Смена слайда с анимацией
		this.$slides.eq(this.activeIdx).fadeIn(this.options.fadeSpeed)
			.siblings().stop(true, true).fadeOut(0);
	}

	//Функции обработки событий
	//Открытие слайда
	ScrollSLider.prototype.openSlide = function (e) {
		e.preventDefault();
		
		var $this = $(e.currentTarget);
		var self = e.data.self;
		
		$this.closest(self.options.slideSelector)				//Поиск слайда
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
		
		$('body,html').stop(true, true).animate({ 'scrollTop': self.$el.offset().top - 100 });

		self.isSlideOpen = false;

	}

	
	ScrollSLider.prototype.pagerClick = function (e) {
		e.preventDefault();

		var $this = $(e.currentTarget);
		var self = e.data.self;

		self.activeIdx = $this.index();
		self.setActive();
	};

	ScrollSLider.prototype.prevNext = function (e) {
		e.preventDefault();

		var $this = $(e.currentTarget);
		var self = e.data.self;
		
		
		self.activeIdx += $this.is(self.options.prevSelector) ? -1 : 1; 
		self.activeIdx = self.activeIdx < 0 ? 0 : self.activeIdx;
		self.activeIdx = self.activeIdx >= self.$pages.length ? self.$pages.length - 1 : self.activeIdx;
		
		self.setActive();
	};

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

	}

	//Add Listener 
	WindowListener.prototype.listenTo = function (obj) {
		this.listeners.push(obj);
	};

	//Window Event Callbacks
	//Mousewheel Event Callback
	WindowListener.prototype.windowMousewheel = function (e, delta, deltaX, deltaY) {
		var self = e.data.self;
		for (var i = 0; i < self.listeners.length; i++) {
			var obj = self.listeners[i];
			if (obj.inRange) {
				obj.scrollCallback(e, deltaY, WindowListener.scrollSpeed || 0 );
			}
				
		}

	};

	//Windowscroll Event Callback
	WindowListener.prototype.windowScroll = function (e) {
		var self = e.data.self;
		
		
		for (var i = 0; i < self.listeners.length; i++) {
			var obj =  self.listeners[i];
//console.log($(document).scrollTop() < obj.$el.offset().top + obj.options.offsetTop, $(document).scrollTop(), obj.$el.offset().top + obj.options.offsetTop)
			//Определение попадания слайдера в пределы окна
			if ( $(document).scrollTop() < obj.$el.offset().top + obj.options.offsetTop
				&& ( $(document).scrollTop() + $(window).height() ) > 
					(obj.$el.offset().top + obj.$el.outerHeight(true) + obj.$paginator.outerHeight(true) + obj.options.offsetBottom) 
			) {
				obj.inRange = true;
			} else {
				obj.inRange = false;
			}

		}
		
	};


	
})();
