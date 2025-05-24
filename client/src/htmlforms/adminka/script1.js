const form = document.getElementById("loginForm");
const errorMsg = document.getElementById("errorMsg");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorMsg.textContent = "";

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
        const response = await fetch("http://localhost:3000/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (response.ok) {
            // Перевіряємо токен перед перенаправленням
            const authCheck = await fetch("http://localhost:3000/auth/check-token", {
                method: "GET",
                credentials: "include"
            });
            
            
            if (authCheck.ok) {
                window.location.href = "/adminka";
            } else {
                errorMsg.textContent = "Помилка авторизації";
            }
        } else {
            errorMsg.textContent = result.error || "Невірний логін або пароль.";
        }
    } catch (err) {
        console.error("Error logging in", err);
        errorMsg.textContent = "Серверна помилка. Спробуйте ще раз";
    }
});