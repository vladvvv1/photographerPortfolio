function toggleDropdown(e) {
    e.preventDefault();
    const parentLi = this.closest("li");
    const subMenu = parentLi.querySelector("ul");

    if (!subMenu) return;

    // Перемикаємо клас "open" у вибраному підменю
    subMenu.classList.toggle("open");
    this.classList.toggle("open"); // Додаємо клас до кнопки
}

document.addEventListener("DOMContentLoaded", function () {
    const burger = document.querySelector(".burger-menu");
    const navLinks = document.querySelector(".nav-links");
    const toggleDropdownBtn = document.querySelector(".toggle");
    const dropdown = document.querySelector(".toggle-node");
    // Відкриття/закриття бургер-меню
    burger.addEventListener("click", function () {
        this.classList.toggle("active");
        navLinks.classList.toggle("open");
    });

    function handleResize() {
        if (window.innerWidth > 920) {
            dropdown.addEventListener("click", toggleDropdown); 
        } else {
            dropdown.removeEventListener("click", toggleDropdown); 
        }
    }

    toggleDropdownBtn.addEventListener("click", toggleDropdown); 
});