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

document.addEventListener("DOMContentLoaded", function () {
    const burgerMenu = document.getElementById("burger-menu");
    const navLinks = document.querySelector(".nav-links");

    burgerMenu.addEventListener("click", function () {
        navLinks.classList.toggle("active");
    });
});

// document.querySelector('.burger-menu').addEventListener('click', function() {
//     this.classList.toggle('active');
//     document.querySelector('.nav-links').classList.toggle('open');
// })

document.addEventListener("DOMContentLoaded", function () {
    const burger = document.querySelector(".burger-menu");
    const navLinks = document.querySelector(".nav-links");
    const dropdowns = document.querySelectorAll(".nav-links li > a.node");

    // Відкриття/закриття бургер-меню
    burger.addEventListener("click", function () {
        this.classList.toggle("active");
        navLinks.classList.toggle("open");
    });

    // Відкриття/закриття випадаючих списків
    dropdowns.forEach(link => {
        link.addEventListener("click", function (e) {
            const nextElement = this.nextElementSibling;
            if (nextElement && nextElement.tagName === "UL") {
                e.preventDefault();
                nextElement.classList.toggle("open");
            }
        });
    });
});
