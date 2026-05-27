const USER_KEY = "QuickBites_User";

document.addEventListener("DOMContentLoaded", () => {

    // ================= LOGIN PAGE =================

    const form = document.getElementById("loginForm");

    if (form) {

        // already login
        if (localStorage.getItem(USER_KEY)) {

            window.location.replace("index.html");
        }

        form.addEventListener("submit", (e) => {

            e.preventDefault();

            const email =
                document.getElementById("email").value.trim();

            const password =
                document.getElementById("password").value.trim();

            if (!email || !password) {

                alert("Please fill all fields");
                return;
            }

            if (password.length !== 6) {

                alert("Password must be 6 digits");
                return;
            }

            // SAVE USER
            localStorage.setItem(USER_KEY, email);

            alert("Login Successful");

            // GO HOME
            window.location.replace("index.html");
        });
    }

    // ================= PROTECT INDEX =================

    const isLoginPage =
        window.location.pathname.includes("login.html");

    if (!isLoginPage) {

        const user =
            localStorage.getItem(USER_KEY);

        // not login
        if (!user) {

            window.location.replace("login.html");
        }
    }

    // ================= SHOW SIGN OUT =================

    const authWrapper =
        document.getElementById("auth-wrapper");

    if (authWrapper) {

        const user =
            localStorage.getItem(USER_KEY);

        if (user) {

            authWrapper.innerHTML = `
                <button
                    class="btn btn-danger btn-sm"
                    id="logoutBtn">

                    Sign Out
                </button>
            `;

            // LOGOUT BUTTON
            document
                .getElementById("logoutBtn")
                .addEventListener("click", () => {

                    localStorage.removeItem(USER_KEY);

                    alert("Signed Out");

                    window.location.replace("login.html");
                });
        }
    }
});