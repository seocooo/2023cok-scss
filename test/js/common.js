/* [SEPTEM] UI Dev Team :: 콕뱅크 com js */
"use strict";

$(function () {
	$(window).scroll(function(){
        $('.footer').fadeOut(100);
    })

    $.fn.scrollStopped = function(callback) {
        var that = this, $this = $(that);
        $this.scroll(function(ev) {
            clearTimeout($this.data('scrollTimeout'));
            $this.data('scrollTimeout', setTimeout(callback.bind(that), 400, ev));
        });
    };

    $(window).scrollStopped(function(ev){
        $('.footer').fadeIn();
    });
})
