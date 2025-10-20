// REGISTRO
const registerForm = document.getElementById('registerForm');
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(registerForm);
  const res = await fetch('http://localhost/soundatlas/backend/api/register.php', {
    method: 'POST',
    body: formData
  });
  const data = await res.json();
  alert(data.message);
});

// LOGIN
const loginForm = document.getElementById('loginForm');
const userPanel = document.getElementById('userPanel');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(loginForm);
  const res = await fetch('http://localhost/soundatlas/backend/api/login.php', {
    method: 'POST',
    body: formData
  });
  const data = await res.json();

  if(data.status === "success") {
    // Mostrar panel de usuario
    userPanel.style.display = "block";
    userName.textContent = data.user.nombre;
    userEmail.textContent = data.user.email;

    // Limpiar formulario
    loginForm.reset();
  } else {
    alert(data.message);
  }
});
