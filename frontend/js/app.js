

// REFERENCIAS DOM 
const registerForm = document.querySelector(".form-register");
const loginForm = document.querySelector(".form-login");
const containerRegister = document.querySelector(".register");
const containerLogin = document.querySelector(".login");
const btnSignIn = document.getElementById("sign-in");
const btnSignUp = document.getElementById("sign-up");

// LIMPIEZA INICIAL
localStorage.removeItem("soundAtlas_userId");
localStorage.removeItem("soundAtlas_userName");
localStorage.removeItem("soundAtlas_userEmail");

//INTERCAMBIO ENTRE LOGIN Y REGISTRO
if (btnSignIn && btnSignUp) {
    btnSignIn.addEventListener("click", () => {
        containerRegister.classList.add("hide");
        containerLogin.classList.remove("hide");
        hideAlerts(registerForm); //Limpiar alertas al cambiar
    });

    btnSignUp.addEventListener("click", () => {
        containerLogin.classList.add("hide");
        containerRegister.classList.remove("hide");
        hideAlerts(loginForm); //Limpiar alertas al cambiar
    });
}

// FUNCIÓN PARA MOSTRAR ALERTAS HTML 
function showHTMLAlert(form, type, message) {
    //type puede ser 'error' o 'exito'
    const alertDiv = form.querySelector(`.alerta-${type}`);
    if (alertDiv) {
        alertDiv.textContent = message;
        alertDiv.classList.add("alerta-visible");
        
        //Ocultar automáticamente después de 4 segundos
        setTimeout(() => {
            alertDiv.classList.remove("alerta-visible");
        }, 4000);
    }
}

function hideAlerts(form) {
    const alerts = form.querySelectorAll('.alerta-error, .alerta-exito');
    alerts.forEach(a => a.classList.remove("alerta-visible"));
}

// LÓGICA DE REGISTRO
if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        hideAlerts(registerForm); //Limpiar previos
        const formData = new FormData(registerForm);

        try {
            const res = await fetch("http://localhost/SoundAtlas/backend/api/register.php", {
                method: "POST",
                body: formData
            });

            if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
            const data = await res.json();

            if (data.status === "success") {
                showHTMLAlert(registerForm, 'exito', data.message);
                registerForm.reset();
                //Opcional: Cambiar al login tras 1.5 seg
                setTimeout(() => {
                    containerRegister.classList.add("hide");
                    containerLogin.classList.remove("hide");
                }, 1500);
            } else {
                showHTMLAlert(registerForm, 'error', data.message);
            }
        } catch (err) {
            console.error(err);
            showHTMLAlert(registerForm, 'error', "Error de conexión con el servidor.");
        }
    });
}

// LÓGICA DE LOGIN
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        hideAlerts(loginForm);
        const formData = new FormData(loginForm);

        try {
            const res = await fetch("http://localhost/SoundAtlas/backend/api/login.php", {
                method: "POST",
                body: formData
            });

            if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
            const data = await res.json();

            if (data.status === "success") {
                localStorage.setItem("soundAtlas_userId", data.user.id);
                localStorage.setItem("soundAtlas_userName", data.user.nombre);
                localStorage.setItem("soundAtlas_userEmail", data.user.email);
                
                showHTMLAlert(loginForm, 'exito', "¡Bienvenido! Redirigiendo...");
                
                setTimeout(() => {
                    window.location.href = "inicio.html"; 
                }, 1000);

            } else {
                showHTMLAlert(loginForm, 'error', data.message);
            }
        } catch (err) {
            console.error(err);
            showHTMLAlert(loginForm, 'error', "Error de conexión.");
        }
    });
}

//BOTONES SOCIALES (SIMULACIÓN)
const socialIcons = document.querySelectorAll('.icons i');

socialIcons.forEach(icon => {
    icon.addEventListener('click', (e) => {
        let network = "Google";
        if (e.target.classList.contains('bxl-github')) network = "GitHub";
        if (e.target.classList.contains('bxl-linkedin')) network = "LinkedIn";
        
        // Aquí mostramos un mensaje para la demo.
        alert(`Funcionalidad de Login con ${network} en desarrollo.\n(Requiere configuración de API Keys en el servidor).`);
    });
});