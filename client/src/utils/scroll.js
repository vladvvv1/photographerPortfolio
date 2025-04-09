$(document).ready(function () {
    var scrollToTopBtn = $("#scrollToTopBtn");
  
    scrollToTopBtn.hide();
  
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            scrollToTopBtn.fadeIn();
        } else {
            scrollToTopBtn.fadeOut();
        }
    });
  
    scrollToTopBtn.click(function () {
        $("html, body").animate({ scrollTop: 0 });
    });
  });