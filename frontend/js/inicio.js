document.addEventListener("DOMContentLoaded", () => {
    //1. SEGURIDAD: Verificar si el usuario está logueado
    const userId = localStorage.getItem("soundAtlas_userId");
    const userName = localStorage.getItem("soundAtlas_userName");

    if (!userId) {
        //Si no hay ID, expulsar al usuario al login
        window.location.href = "index.html";
        return; 
    }

    //2. ACTUALIZAR INTERFAZ CON DATOS DEL USUARIO
    const navUserName = document.getElementById("navUserName");
    const heroUserName = document.getElementById("heroUserName");

    if(navUserName) navUserName.textContent = userName;
    if(heroUserName) heroUserName.textContent = userName;

    //3. LÓGICA DEL MENÚ DESPLEGABLE
    const userMenuBtn = document.getElementById("userMenuBtn");
    const dropdownMenu = document.getElementById("dropdownMenu");

    if (userMenuBtn && dropdownMenu) {
        userMenuBtn.addEventListener("click", (e) => {
            e.stopPropagation(); //Evita que el click se propague al document inmediatamente
            dropdownMenu.classList.toggle("show");
        });

        //Cerrar el menú si clicamos fuera
        document.addEventListener("click", (e) => {
            if (!userMenuBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.remove("show");
            }
        });
    }

    //4. LÓGICA DE CERRAR SESIÓN
    const btnLogout = document.getElementById("btnLogout");
    
    if (btnLogout) {
        btnLogout.addEventListener("click", (e) => {
            e.preventDefault(); 
            
            //Borrar datos de sesión
            localStorage.removeItem("soundAtlas_userId");
            localStorage.removeItem("soundAtlas_userName");
            localStorage.removeItem("soundAtlas_userEmail");
            
            //Volver al login
            window.location.href = "index.html";
        });
    }
});