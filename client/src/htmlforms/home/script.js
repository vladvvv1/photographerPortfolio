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
    const burger = document.querySelector(".burger-menu");
    const navLinks = document.querySelector(".nav-links");
    const dropdowns = document.querySelectorAll(".nav-links li > a.node");

    // Відкриття/закриття бургер-меню
    burger.addEventListener("click", function () {
        this.classList.toggle("active");
        navLinks.classList.toggle("open");
    });

    nodeToggles.forEach(toggle => {
        toggle.addEventListener("click", function (e) {
            e.preventDefault();
            const parentLi = this.closest("li");
            const subMenu = parentLi.querySelector("ul");

            if (!subMenu) return;

            // Закриваємо всі інші відкриті підменю на тому ж рівні
            parentLi.parentElement.querySelectorAll(":scope > li > ul").forEach(ul => {
                if (ul !== subMenu) {
                    ul.classList.remove("open");
                    ul.previousElementSibling?.classList.remove("open");
                }
            });

            // Перемикаємо клас "open" у вибраному підменю
            subMenu.classList.toggle("open");
            this.classList.toggle("open"); // Додаємо клас до кнопки
        });
    });
});

// document.addEventListener("DOMContentLoaded", function () {
//     const burgerMenu = document.getElementById("burger-menu");
//     const navLinks = document.querySelector(".nav-links");

//     burgerMenu.addEventListener("click", function () {
//         this.classList.toggle("active");
//         navLinks.classList.toggle("open");
//     });
// });

// document.addEventListener("DOMContentLoaded", function () {
//     InitMainNav();
// });

// function InitMainNav() {
//     const mainNav = document.querySelector("#siteNav .mainNav");
//     const burger = document.querySelector("#mainNavBurger");
//     const nodeToggles = mainNav.querySelectorAll(".toggle");

//     // Обробка кліку на бургер-меню
//     burger.addEventListener("click", function () {
//         burger.classList.toggle("open");
//         mainNav.classList.toggle("open");
//     });

//     // Обробка кліку на кнопки розгортання підменю
//     nodeToggles.forEach(toggle => {
//         toggle.addEventListener("click", function (e) {
//             e.preventDefault();
//             const parentLi = this.closest("li");
//             const subMenu = parentLi.querySelector("ul");

//             if (!subMenu) return;

//             // Закриваємо всі інші відкриті підменю на тому ж рівні
//             parentLi.parentElement.querySelectorAll(":scope > li > ul").forEach(ul => {
//                 if (ul !== subMenu) {
//                     ul.classList.remove("open");
//                     ul.previousElementSibling?.classList.remove("open");
//                 }
//             });

//             // Перемикаємо клас "open" у вибраному 
//             subMenu.classList.toggle("open");
//             this.classList.toggle("open");
//         });
//     });
// }
