

document.addEventListener("DOMContentLoaded", async () => {
    //1. VERIFICAR SESIÓN
    //Recuperamos los datos que guardamos al iniciar sesión
    const userId = localStorage.getItem("soundAtlas_userId");
    const userName = localStorage.getItem("soundAtlas_userName");
    const userEmail = localStorage.getItem("soundAtlas_userEmail");

    //Si no hay ID, es que no está logueado -> Fuera
    if (!userId) {
        window.location.href = "index.html";
        return;
    }

    //2. RELLENAR DATOS BÁSICOS EN PANTALLA
    const nameElem = document.getElementById("profileName");
    const emailElem = document.getElementById("profileEmail");
    
    if(nameElem) nameElem.textContent = userName;
    if(emailElem) emailElem.textContent = userEmail;

    //3. OBTENER ESTADÍSTICAS DEL SERVIDOR
    try {
        const res = await fetch(`http://localhost/SoundAtlas/backend/api/get_user_stats.php?user_id=${userId}`);
        const data = await res.json();

        if (data.status === "success") {
            //Llamamos a la función de animación para que los números suban chulo
            //ID del elemento, Valor inicial, Valor final, Duración (ms)
            animateValue("statSongs", 0, data.data.canciones, 1000);
            animateValue("statLists", 0, data.data.listas, 1000);
        }

    } catch (err) {
        console.error("Error cargando estadísticas:", err);
    }

    //4. ACTIVAR EL BOTÓN DE BORRAR CUENTA
    const deleteBtn = document.querySelector('.delete-text');
    if(deleteBtn) {
        deleteBtn.onclick = deleteAccount; 
    }
});

//FUNCIÓN PARA ELIMINAR CUENTA
async function deleteAccount() {
    //Confirmación 1
    const confirm1 = confirm("⚠️ ¿Estás seguro de que quieres eliminar tu cuenta?");
    if (!confirm1) return;
    
    //Confirmación 2 (Seguridad extra)
    const confirm2 = confirm("⛔️ Esta acción borrará todas tus listas y canciones guardadas permanentemente. ¿Continuar?");
    if (!confirm2) return;

    const userId = localStorage.getItem("soundAtlas_userId");
    const formData = new FormData();
    formData.append('user_id', userId);

    try {
        const res = await fetch("http://localhost/SoundAtlas/backend/api/delete_account.php", {
            method: "POST",
            body: formData
        });
        const data = await res.json();

        if (data.status === "success") {
            alert("Tu cuenta ha sido eliminada correctamente. Lamentamos verte partir.");
            
            //Borramos todo rastro del navegador
            localStorage.clear(); 
            
            //Volvemos a la pantalla de Login/Registro
            window.location.href = "index.html"; 
        } else {
            alert("Error al eliminar: " + data.message);
        }
    } catch (err) {
        console.error(err);
        alert("Error de conexión con el servidor.");
    }
}

// UTILIDAD: ANIMACIÓN DE NÚMEROS
function animateValue(id, start, end, duration) {
    const obj = document.getElementById(id);
    if(!obj) return; //Si no encuentra el elemento, no hace nada
    
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}


//LÓGICA DE CONFIGURACIÓN (NOMBRE Y CONTRASEÑA)

//1. ABRIR MODAL
function openConfigModal(type) {
    const modal = document.getElementById('configModal');
    const nameSection = document.getElementById('formNameSection');
    const passSection = document.getElementById('formPassSection');
    const title = document.getElementById('configTitle');

    modal.style.display = 'flex';

    //Reseteamos inputs
    document.getElementById('inputNewName').value = '';
    document.getElementById('inputOldPass').value = '';
    document.getElementById('inputNewPass').value = '';

    if (type === 'name') {
        title.textContent = "Cambiar Nombre";
        nameSection.style.display = 'block';
        passSection.style.display = 'none';
    } else {
        title.textContent = "Cambiar Contraseña";
        nameSection.style.display = 'none';
        passSection.style.display = 'block';
    }
}

//2. CERRAR MODAL
function closeConfigModal() {
    document.getElementById('configModal').style.display = 'none';
}

//3. ENVIAR CAMBIO DE NOMBRE
async function submitNameChange() {
    const newName = document.getElementById('inputNewName').value;
    const userId = localStorage.getItem("soundAtlas_userId");

    if (newName.length < 2) { alert("El nombre es muy corto"); return; }

    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('action', 'update_name');
    formData.append('newName', newName);

    try {
        const res = await fetch("http://localhost/SoundAtlas/backend/api/update_profile.php", {
            method: "POST",
            body: formData
        });
        const data = await res.json();

        if (data.status === "success") {
            alert("¡Nombre actualizado!");
            //Actualizamos localStorage y la vista
            localStorage.setItem("soundAtlas_userName", newName);
            document.getElementById("profileName").textContent = newName;
            closeConfigModal();
        } else {
            alert("Error: " + data.message);
        }
    } catch (err) { alert("Error de conexión"); }
}

//4. ENVIAR CAMBIO DE CONTRASEÑA
async function submitPassChange() {
    const oldPass = document.getElementById('inputOldPass').value;
    const newPass = document.getElementById('inputNewPass').value;
    const userId = localStorage.getItem("soundAtlas_userId");

    if (!oldPass || !newPass) { alert("Rellena todos los campos"); return; }

    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('action', 'change_password');
    formData.append('oldPass', oldPass);
    formData.append('newPass', newPass);

    try {
        const res = await fetch("http://localhost/SoundAtlas/backend/api/update_profile.php", {
            method: "POST",
            body: formData
        });
        const data = await res.json();

        if (data.status === "success") {
            alert("¡Contraseña actualizada correctamente!");
            closeConfigModal();
        } else {
            alert("Error: " + data.message); //Aquí dirá si la contraseña vieja era incorrecta
        }
    } catch (err) { alert("Error de conexión"); }
}

// CONECTAR BOTONES
//Esto busca el botón "Cambiar Contraseña" que ya tenías y le asigna la función
document.addEventListener("DOMContentLoaded", () => {
    //Buscamos el botón por el texto o clase si es posible, 
    //pero como no tiene ID, lo mejor es añadirle un onclick directo en el HTML 
    //o buscar el botón específico.
    
    //añadir un pequeño icono de lápiz al lado del nombre para editarlo
    const nameHeader = document.getElementById('profileName');
    if(nameHeader) {
        nameHeader.style.cursor = "pointer";
        nameHeader.title = "Clic para cambiar nombre";
        nameHeader.innerHTML += ` <i class='bx bxs-pencil' style="font-size:1rem; color:#9191bd;"></i>`;
        nameHeader.onclick = () => openConfigModal('name');
    }
});