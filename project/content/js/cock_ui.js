/*
 * [SEPTEM] UI Dev Team
 * @description [SEPTEM] Core Library
 */
;
(function () {
	var Class = {
		winHeight: 0,
		winWidth: 0,
		didScroll: false,
        theme: 'light',
		isMobile: navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i) ? true : false,
		isWide: false,
		evTouchStart: navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i) ? 'touchstart' : 'mousedown',
		evTouchMove: navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i) ? 'touchmove' : 'mousemove',
		evTouchEnd: navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i) ? 'touchend' : 'mouseup',
		evTouchCancel: navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i) ? 'touchcancel' : 'mouseover',
		animEndEventName: {
			'WebkitAnimation': 'webkitAnimationEnd',
			'OAnimation': 'oAnimationEnd',
			'msAnimation': 'MSAnimationEnd',
			'animation': 'animationend'
		} [Modernizr.prefixed('animation')],
        /* debug */
        debug: function debug(str) {
			var $debug = $('#debug');
			if($debug.length<1) {
				$debug=$('<div id="debug"></div>');
				$('body').append($debug);
			}
			$debug.append('<span>'+str+'</span>').scrollTop(1000000);
		},
		/* initBrowser */
		initBrowserOnce: function initBrowserOnce() {
			var ua = navigator.userAgent;
			if ((/Android/i).test(ua)) {
				$('html').addClass('Android').data('browser', 'Android');
				var androidversion = parseFloat(ua.slice(ua.indexOf("Android") + 8));
				//console.log(androidversion);
			} else if ((/iPad|iPhone|iPod/i).test(ua)) {
				$('html').addClass('iOS').data('browser', 'iOS');
			} else if ((/Chrome/i).test(ua)) {
				$('html').addClass('Chrome').data('browser', 'Chrome');
			}
		},
		/* a preventDefault */
		initHrefOnce: function initHrefOnce() {
			$(document)
				.on('click', 'a[href="#"]', function (e) {
					e.preventDefault();
				});
		},
		/* address bar 감추기 */
		initHideAddressBarOnce: function initHideAddressBarOnce() {
			setTimeout(function () {
				window.scrollTo(0, 1)
			}, 100);
		},
		/* Toast 세팅 */
		initToastOnce: function initToastOnce() {
			var toastTimer = null;

			$(document)
				.on('show', '#js_Toast', function (e, msg) {
					var $toast = $(this);
					$toast.find('span').text(msg);
					$toast.addClass('cs_active');

					clearTimeout(toastTimer);
					toastTimer = setTimeout(function () {
						$toast.trigger('hide');
					}, 4000);
				})
				.on('hide', '#js_Toast', function () {
					$(this).removeClass('cs_active');
				})
				.on('click', '#js_Toast', function (e) {
					var $toast = $(this);
					clearTimeout(toastTimer);
					toastTimer = setTimeout(function () {
						$toast.trigger('hide');
					}, 4000);
					e.preventDefault();
				});
		},
		/* Toast 보이기 */
		toast: function toast(msg) {
			var $toast = $('#js_Toast');
			if ($toast.length < 1) {
				$toast = $('<div id="js_Toast" class="toast" role="alert" aria-live="assertive" aria-atomic="true"><span></span></div>').appendTo('body');
				setTimeout(function () {
					$toast.trigger('show', msg);
				}, 100);
			} else {
				$toast.trigger('show', msg);
			}
		},
        /* showLoading */
        showLoading: function showLoading() {
			var $loading = $('#loading');
			if($loading.length<1) {
				$loading = $('<div id="loading"><div class="inr">Loading ...</div></div>').appendTo('body');
				setTimeout(function() {
					$loading.addClass('cs_active');
				}, 100);
			} else {
				$loading.addClass('cs_active');
			}

		},
		/* hideLoading */
        hideLoading: function hideLoading() {
			$('#loading').removeClass('cs_active');
		},
		/* jsModal */
		initModalOnce: function initModalOnce() {
			$(document)
				.on('click', '.js_modal-open', function (e) {
					e.preventDefault();
					const $openModalId = $(this).attr('href') || $(this).data('modal');
					$('#' + $openModalId).trigger('openModal');
				})
				.on('click', '.modal .js_modal-close, .modal-dim', function () {
					const $closeModalId = $(this).closest('.modal').attr('id')
					$('#' + $closeModalId).trigger('closeModal');
				})
				.on('click', '.modal-select-item a', function () {
					const $selectedItem = $(this).closest(".modal-select-item");
					const $selectedText = $selectedItem.text();
					$selectedItem.addClass("cs_active").siblings().removeClass("cs_active");
					const $modal = $(this).closest(".modal");
					$('#' + $modal.attr('id')).trigger('closeModal');
					const $formSelect = $modal.prev(".form-group").find(".form-select");
					$formSelect.text($selectedText).val($selectedText);
				})
				.on('keydown', 'modal', function (event) {
					if (event.key === 'Escape') {
						const modalID = $(this).attr('id');
						$('#' + modalID).trigger('closeModal');
					}
				})
				.on('openModal', '.modal', function () {
					const $modalId = $(this);
					$modalId
						.fadeIn(function () {
							const $modalTitle = $modalId.find('.modal-title');
							$modalTitle.attr('tabindex', -1).focus();
							if ($modalId.hasClass('st_bottom-sheet') === true) {
								;
								$modalId.find('.modal-inner').css('bottom', '0%');
							}
						}).attr('aria-hidden', 'false');
					$('body').css('overflow', 'hidden');
				})
				.on('closeModal', '.modal', function () {
					const $modalId = $(this);
					if ($modalId.hasClass('st_bottom-sheet') === true) {
						$modalId.find('.modal-inner').css('bottom', '-100%');
					}
					$modalId.fadeOut().attr('aria-hidden', 'true');
					$('body').css('overflow', '');
				});

		},
		/* jsTooltip */
		initTooltipOnce: function initTooltipOnce() {
			Class.winWidth = window.innerWidth;
			Class.winHeight = window.innerHeight;
			const $tooltips = $(document).find('.tooltip');
			$tooltips.each(function () {
				const $toolTip = $(this);
				const $tooltipBtn = $toolTip.find('button');
				const $tooltipCont = $toolTip.find('.tooltip-cont');
				const $tooltipClose = $toolTip.find('.tooltip-close');
				const $tooltipW = Math.floor(Class.winWidth / 2);
				const tooltipMargin = 40;
				if ($tooltipCont) {
					if ($tooltipCont.closest('.tooltip').hasClass('js_tooltip-full')) {
						$tooltipCont.css({
							'width': Class.winWidth - tooltipMargin + 'px'
						});
					} else {
						$tooltipCont.css({
							'width': $tooltipW + 'px'
						});
					}
				}
				if ($tooltipBtn) {
					$tooltipBtn.on('click', function (e) {
						e.stopPropagation();
						if ($(this).hasClass('tooltip-close')) {
							$toolTip.removeClass('cs_active');
						} else {
							const isActive = $toolTip.addClass('cs_active');
							if ($tooltipCont) {
								$tooltipCont.attr('aria-hidden', !isActive);
							}
						}
					});
				}
				if ($tooltipClose) {
					$tooltipClose.on('click', function (e) {
						e.stopPropagation();
						$toolTip.removeClass('cs_active');
						if ($tooltipCont) {
							$tooltipCont.attr('aria-hidden', true);
						}
					});
				}
			});

			$(document)
				.on('click', '.tooltip', function () {
					let $tooltip = $(this);
					$tooltip.each(function () {
						$(this).removeClass('cs_active');
						let $tooltipCont = $(this).find(".tooltip-cont");
						if ($tooltipCont) {
							$tooltipCont.attr('aria-hidden', 'true');
						}
					})
				});
		},
		/* jsTabs */
		initTabsCtrlOnce: function initTabsCtrlOnce() {
			$(document)
				.on('click', '.tab-item', function () {
					const $clickedTab = $(this);
                    const $tabWrap = $clickedTab.closest('.tab-wrap');
					const $panelId = $clickedTab.attr('aria-controls');
                    const $btnTabFold = $tabWrap.find('.btn-tab-fold');
                    $clickedTab.addClass('cs_active').attr('aria-selected', 'true').parent().siblings().find('.tab-item').removeClass('cs_active').attr('aria-selected', 'false');
                    if(!$tabWrap.hasClass('st_fold')){
					    $('#' + $panelId).addClass('cs_active').siblings('.tab-panel').removeClass('cs_active');
                    } else {
                        $btnTabFold.attr('aria-controls', $panelId).removeClass('cs_folded').removeClass('cs_folded').attr('aria-selected', 'false');
                        $('#' + $panelId).removeClass('cs_active').siblings('.tab-panel').removeClass('cs_active');
                    }
				})
                .on('click','.st_fold .btn-tab-fold' ,function(){
                    const $btnTabFold = $(this);
                    const $panelId = $btnTabFold.attr('aria-controls');
                    const $tabNav = $btnTabFold.prev('.tab-nav');

                    //$tabNav.find('.tab-item').removeClass('cs_active').attr('aria-selected', 'false');
                    if(!$btnTabFold.hasClass('cs_folded')){
                        $btnTabFold.addClass('cs_folded').attr('aria-selected', 'true');
                        //$tabNav.find('.tab-item[aria-controls="'+ $panelId +'"]').addClass('cs_active').attr('aria-selected', 'true');
                        $('#' + $panelId).addClass('cs_active').siblings('.tab-panel').removeClass('cs_active');
                    } else {
                        $btnTabFold.removeClass('cs_folded').attr('aria-selected', 'false');
                        $('#' + $panelId).removeClass('cs_active').siblings('.tab-panel').removeClass('cs_active');
                    }

                });
		},
        /* jsFold */
        initFoldOnce: function initFoldOnce(){
            $(document)
                .on('click','.js_fold-btn',function(e){
                    var $jsFoldBtn = $(this);
                    var target = $jsFoldBtn.attr('aria-describedby');
                    var $target;
                    if(typeof target === 'undefined') {
                        $target= $jsFoldBtn;
                    } else {
                        $target = $('.fold-wrap[id="'+ target +'"]');
                    }
                    if(!$jsFoldBtn.hasClass('cs_folded')){
                        $jsFoldBtn.addClass('cs_folded').attr('aria-expanded', 'true');
                        $target.slideDown(200).addClass('cs_show').attr('aria-hidden', 'false');
                    } else {
                        $jsFoldBtn.removeClass('cs_folded').attr('aria-expanded', 'false');
                        $target.slideUp(200).removeClass('cs_show').attr('aria-hidden','true'); //.attr('tabindex', 0).focus();
                    }
                    e.preventDefault();
                })
                .on('click','.fold-wrap .fold-close', function(e){
                    var target = $(this).closest('.fold-wrap').attr('id');
                    var $target = $('.js_fold-btn.cs_folded[aria-describedby="'+ target +'"]');
                    $(this).closest('.fold-wrap').slideUp(200).removeClass('cs_show').attr('aria-hidden', 'true');
                    $target.removeClass('cs_folded').attr('aria-expanded', 'false').focus();
                });
        },
		/* jsScrollSpy */
		initScrollspyOnce: function initScrollspyOnce() {
			const $headerHeight = $('header').outerHeight();
			const $scrollspyNav = $('.scrollspy-nav');
			const $thisTop = $scrollspyNav.length > 0 ? $scrollspyNav.offset().top : 0;
			$(document)
				.on('focus', '.scrollspy-nav .nav-item', function () {
					var $this = $(this);
					var $thisPosLeft = $this.position().left;
					$('.scrollspy-nav').stop().animate({
						scrollLeft: $thisPosLeft
					}, 400, function () {});
				})
				.on('click', '.scrollspy-nav .nav-item', function () {
					const $thisBtn = $(this);
					const $thisAttrMenu = $thisBtn.attr('anchor-title');
					const $scrollspy = $thisBtn.closest('.scrollspy');
					const $contList = $scrollspy.find('.cont-list');
					$contList.each(function () {
						const $cont = $(this);
						const $thisAttrCont = $cont.attr('anchor-cont');
						console.log($thisAttrCont, $thisAttrMenu)
						if ($thisAttrCont === $thisAttrMenu) {
							const $thisOffSet = $cont.offset().top;
							$('html, body').stop().animate({
								scrollTop: $thisOffSet - $headerHeight - 36
							}, 400, function () {
								$('.scrollspy-nav .nav-item').removeClass('cs_active').attr('aria-selected', 'false');
								$thisBtn.addClass('cs_active').attr('aria-selected', 'true');
								$cont.find('.cont-header').focus();
							})
						}
					});
				});

			$(window)
				.on('scroll', function (e) {
					const $scrollTop = $('html, body').scrollTop();
					const $scrollMove = $thisTop - $headerHeight;
					const $contHeight = $('.scrollspy-cont').outerHeight();
					const $scrollMoveEnd = $scrollMove + $contHeight;
					if ($scrollspyNav.length > 0) {
						if ($scrollTop >= $scrollMove && $scrollTop <= $scrollMoveEnd && $scrollMove != 0) {
							$('.scrollspy-nav').addClass('st-sticky');
						} else {
							$('.scrollspy-nav').removeClass('st-sticky');
						}
					}
				});
		},
		/* jsAcc */
		initAccordionOnce: function initAccordionOnce() {
			$('.accordion-item').each(function () {
				const $accordionBtn = $(this).find('.js_accordion-btn:eq(0)');
				const $accordionCollapse = $(this).find('.accordion-collapse:eq(0)');
				const $accordionWrapBtn = $(this).find('.accordion-btn-wrap .js_accordion-btn');

				$accordionBtn.on('click', function (e) {
					const isCollapsed = $accordionBtn.hasClass('cs_collapsed');
					if (isCollapsed) {
						$accordionBtn.removeClass('cs_collapsed');
						$accordionBtn.attr('aria-expanded', 'true');
						$accordionWrapBtn.text('상세열기');
					} else {
						$accordionBtn.addClass('cs_collapsed');
						$accordionBtn.attr('aria-expanded', 'false');
						$accordionWrapBtn.text('상세닫기');
					}

					$accordionCollapse.toggleClass('cs_show', !isCollapsed);
				});
			});
		},
		/* swiper js */
		initSwiperOnce: function initSwiperOnce() {
		},
		/* radio, checkbox 세팅 */
		initCheckboxRadioOnce: function initCheckboxRadioOnce() {
		},
		/* 레이아웃 세팅 */
		setLayout: function setLayout() {
		},
        /* 테마 */
        initSetThemeOnce: function initSetThemeOnce() {
            var $html = $('html');
            $(document)
                .on('click','.js-theme',function(){
                    if(Class.theme === 'light'){
                        $html.attr('data-theme', 'dark');
                        $(this).addClass('cs_changed');
                        Class.theme = 'dark';
                    } else {
                        $html.attr('data-theme', 'light');
                        $(this).removeClass('cs_changed');
                        Class.theme = 'light';
                    }
                });

            /*if (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
              document.documentElement.setAttribute('data-theme', 'dark')
            } else {
              document.documentElement.setAttribute('data-theme', theme)
            }*/
        },
		/* window load */
		initLoadOnce: function initLoadOnce() {
			$(window)
				.on('load', function () {

				});
		},
		/* scroll */
		initWindowScroll: function initWindowScroll() {
			$(window)
				.on('scroll', function (e) {


				});
		},
		//항상 마지막에
		/* 스크린 크기 변경시 */
		initResizeOnce: function initResizeOnce() {
			$(window)
				.on('resize', function () {
					Class.winWidth = window.innerWidth;
					Class.winHeight = window.innerHeight;

					/* 가로비율 */
					if (Class.winWidth >= 380) {
						$('html').removeClass('small normal').addClass('wide');
						Class.isWide = true;
					} else if (Class.winWidth <= 320) {
						$('html').removeClass('wide normal').addClass('small');
						Class.isWide = false;
					} else {
						$('html').removeClass('wide small').addClass('normal');
						Class.isWide = false;
					}
					Class.setLayout();
				})
				.trigger('resize');
		},
		/* cockUi 초기화 */
		init: function () {
			for (var func in Class) {
				if (Class.hasOwnProperty(func)) {
					if (func !== 'init' && func.indexOf('init') == 0) {
						var $document = $(document);
						if (func.lastIndexOf('Once') + 4 == func.length && !$document.data(func)) {
							$document.data(func, true);
							Class[func].call(this);
						} else if (func.lastIndexOf('Once') + 4 != func.length) {
							Class[func].call(this);
						}
					}
				}
			}
		}
	};
	if (typeof this['cockUi'] !== 'undefined') {
		this['cockUi']['mobile'] = Class;
	} else {
		this['cockUi'] = {
			mobile: Class
		};
	}
})();

//cockUi.mobile.toast(navigator.userAgent);
$.fn.cockUi = cockUi.mobile.init;
$(function () {
	$(document).cockUi();
	/*
	setTimeout(function() {
		cockUi.mobile.showLoading()
	}, 2000);
	*/

	//cockUi.mobile.debug(navigator.userAgent);
});
