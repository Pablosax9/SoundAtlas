// 1. VARIABLES Y SELECTORES
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const resultsContainer = document.querySelector('.grid-container'); 
const sectionTitle = document.querySelector('.section-title h3'); 
const btnMyLists = document.getElementById('btnMyLists');
const navLinks = document.querySelectorAll('.nav-links a');

const DEEZER_API_URL = "https://api.deezer.com"; 

// Variables globales
let tempSongData = {};      
let currentListId = null;   
let currentListName = null; 

// 0. UTILIDADES

function setActiveNav(id) {
    navLinks.forEach(link => link.classList.remove('active'));
    const activeLink = document.getElementById(id);
    if(activeLink) activeLink.classList.add('active');
}

function formatDuration(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

// 1. LÓGICA DE BÚSQUEDA

async function searchMusic(query) {
    if(!query) return;
    setActiveNav('');
    resultsContainer.innerHTML = '<p>Buscando en SoundAtlas...</p>';
    if(sectionTitle) sectionTitle.textContent = `Resultados para: "${query}"`;

    try {
        const script = document.createElement('script');
        script.src = `${DEEZER_API_URL}/search?q=${query}&output=jsonp&callback=handleDeezerResults`;
        document.body.appendChild(script);
    } catch (error) {
        console.error("Error buscando:", error);
    }
}

function handleDeezerResults(data) {
    renderSongCards(data.data);
}

// 2. NUEVAS SECCIONES

function loadTrends() {
    setActiveNav('navTrends');
    resultsContainer.innerHTML = '<p>Cargando Top Mundial...</p>';
    if(sectionTitle) sectionTitle.textContent = "Tendencias Mundiales";
    const script = document.createElement('script');
    script.src = `${DEEZER_API_URL}/chart?output=jsonp&callback=handleTrendsResults`;
    document.body.appendChild(script);
}

function handleTrendsResults(data) {
    if(data.tracks && data.tracks.data) {
        renderSongCards(data.tracks.data);
    } else {
        resultsContainer.innerHTML = '<p>No se pudieron cargar las tendencias.</p>';
    }
}

function loadTopArtists() {
    setActiveNav('navArtists');
    resultsContainer.innerHTML = '<p>Cargando Artistas Top...</p>';
    if(sectionTitle) sectionTitle.textContent = "Artistas Más Escuchados";
    const script = document.createElement('script');
    script.src = `${DEEZER_API_URL}/chart/0/artists?output=jsonp&callback=handleArtistsResults`;
    document.body.appendChild(script);
}

function handleArtistsResults(data) {
    if(!data.data) return;
    resultsContainer.innerHTML = '';
    data.data.forEach(artist => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.onclick = () => searchMusic(artist.name);
        card.innerHTML = `
            <img src="${artist.picture_medium}" alt="${artist.name}" class="card-img" style="height:auto; width:100%; border-radius:50%;">
            <h4 style="text-align:center; margin-top:10px;">${artist.name}</h4>
            <p style="text-align:center;">Posición #${artist.position}</p>
        `;
        resultsContainer.appendChild(card);
    });
}

function loadDiscovery() {
    setActiveNav('navDiscover');
    resultsContainer.innerHTML = '<p>Cargando géneros...</p>';
    if(sectionTitle) sectionTitle.textContent = "Explora por Géneros";
    const script = document.createElement('script');
    script.src = `${DEEZER_API_URL}/genre?output=jsonp&callback=handleGenreResults`;
    document.body.appendChild(script);
}

function handleGenreResults(data) {
    if(!data.data) return;
    resultsContainer.innerHTML = '';
    const genres = data.data.filter(g => g.id !== 0);
    genres.forEach(genre => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.onclick = () => searchMusic(`genre:"${genre.name}"`);
        card.innerHTML = `
            <img src="${genre.picture_medium}" alt="${genre.name}" class="card-img" style="height:auto; width:100%; border-radius:10px;">
            <h4 style="text-align:center; margin-top:10px;">${genre.name}</h4>
        `;
        resultsContainer.appendChild(card);
    });
}

// Función auxiliar para pintar canciones (MODIFICADA CON BOTÓN INFO)
function renderSongCards(songs) {
    if (!songs || songs.length === 0) {
        resultsContainer.innerHTML = '<p>No se encontraron resultados.</p>';
        return;
    }
    resultsContainer.innerHTML = '';

    songs.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('card');
        
        const safeTitle = item.title.replace(/'/g, "\\'");
        const safeArtist = item.artist.name.replace(/'/g, "\\'");
        const safeImg = item.album.cover_medium.replace(/'/g, "\\'");

        // AÑADIDO: Botón Info
        card.innerHTML = `
            <img src="${item.album.cover_medium}" alt="${item.title}" class="card-img" style="height:auto; width:100%; border-radius:10px;">
            <h4>${item.title}</h4>
            <p>${item.artist.name}</p>
            
            <div style="margin-top:10px; display:flex; justify-content:space-between; align-items:center;">
                <a href="${item.preview}" target="_blank" style="font-size:0.8rem; color:#9191bd; text-decoration:none;">
                    <i class='bx bx-play-circle'></i> Escuchar
                </a>
                
                <i class='bx bx-info-circle' style="cursor:pointer; font-size:1.3rem; color:#555;" 
                   onclick="showSongDetails('${item.id}')"></i>

                <i class='bx bx-heart' style="cursor:pointer; font-size:1.3rem; color:#ccc;" 
                   onclick="toggleFavorite(this, '${item.id}', '${safeTitle}', '${safeArtist}', '${safeImg}')">
                </i>
            </div>
        `;
        resultsContainer.appendChild(card);
    });
}

// 3. LISTENERS GLOBALES

if(searchBtn) {
    searchBtn.addEventListener('click', () => searchMusic(searchInput.value));
}
if(searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchMusic(searchInput.value);
    });
}
window.addEventListener('load', () => {
    if(resultsContainer.innerHTML.includes('background-color')) { 
        loadDiscovery();
    }
});

// 4. LÓGICA DE GUARDAR FAVORITO (MODAL)

async function toggleFavorite(btn, api_id, title, artist, img) {
    const userId = localStorage.getItem("soundAtlas_userId");
    if (!userId) { alert("Inicia sesión primero"); return; }

    tempSongData = { btn, api_id, title, artist, img };

    const modal = document.getElementById('saveModal');
    const modalTitle = document.getElementById('modalSongTitle');
    const select = document.getElementById('listSelect');
    
    if(modal) {
        modal.style.display = 'flex'; 
        modalTitle.textContent = `${artist} - ${title}`;
        select.innerHTML = '<option value="">❤️ Favoritos Generales</option>'; 
        
        try {
            const res = await fetch(`http://localhost/SoundAtlas/backend/api/get_lists.php?user_id=${userId}`);
            const data = await res.json();
            if (data.status === "success") {
                data.data.forEach(lista => {
                    const option = document.createElement('option');
                    option.value = lista.id;
                    option.textContent = `📂 ${lista.nombre}`;
                    select.appendChild(option);
                });
            }
        } catch (err) { console.error("Error listas modal"); }
    }
}

function closeModal() {
    const modal = document.getElementById('saveModal');
    if(modal) modal.style.display = 'none';
    tempSongData = {}; 
}

const btnConfirmSave = document.getElementById('btnConfirmSave');
if(btnConfirmSave){
    btnConfirmSave.addEventListener('click', async () => {
        const userId = localStorage.getItem("soundAtlas_userId");
        const listaId = document.getElementById('listSelect').value; 
        const { btn, api_id, title, artist, img } = tempSongData;

        const formData = new FormData();
        formData.append('user_id', userId);
        formData.append('api_id', api_id);
        formData.append('titulo', title);
        formData.append('artista', artist);
        formData.append('imagen', img);
        formData.append('lista_id', listaId); 

        try {
            const res = await fetch("http://localhost/SoundAtlas/backend/api/add_favorite.php", {
                method: "POST",
                body: formData
            });
            const data = await res.json();

            if (data.status === "success") {
                alert("¡Guardado correctamente!");
                if(btn) { 
                    btn.classList.remove('bx-heart'); 
                    btn.classList.add('bxs-heart'); 
                    btn.style.color = "red"; 
                }
            } else if (data.status === "exists") {
                alert("Esta canción ya está en esa lista.");
            } else {
                alert("Error: " + data.message);
            }
        } catch (err) { alert("Error conexión"); }
        closeModal(); 
    });
}

// 5. GESTIÓN DE LISTAS (VISUALIZACIÓN)

if (btnMyLists) {
    btnMyLists.addEventListener('click', (e) => {
        e.preventDefault();
        loadUserLists(); 
    });
}

async function loadUserLists() {
    const userId = localStorage.getItem("soundAtlas_userId");
    if (!userId) return;

    setActiveNav('btnMyLists');
    if (sectionTitle) sectionTitle.textContent = "Mis Listas de Reproducción";
    
    resultsContainer.innerHTML = `
        <div class="card" onclick="createNewList()" style="background: #f0f0f0; border: 2px dashed #ccc; display:flex; flex-direction:column; justify-content:center; align-items:center; cursor:pointer; min-height: 250px;">
            <i class='bx bx-plus' style="font-size:3rem; color:#999;"></i>
            <p style="color:#555; font-weight:600; margin-top:10px;">Crear Nueva Lista</p>
        </div>
        <div class="card" onclick="loadFavorites('general', null)"> 
            <div class="card-img" style="background: linear-gradient(45deg, #ff9a9e, #fad0c4); height:150px; display:flex; align-items:center; justify-content:center; border-radius:10px;">
                <i class='bx bxs-heart' style="font-size:4rem; color:white;"></i>
            </div>
            <h4 style="margin-top:10px;">Favoritos Generales</h4>
            <p>Todas tus canciones sueltas</p>
        </div>
    `;

    try {
        const res = await fetch(`http://localhost/SoundAtlas/backend/api/get_lists.php?user_id=${userId}`);
        const data = await res.json();
        if (data.status === "success") {
            data.data.forEach(lista => {
                const listCard = document.createElement('div');
                listCard.className = 'card';
                listCard.onclick = () => loadFavorites(lista.id, lista.nombre); 
                listCard.innerHTML = `
                    <div class="card-img" style="background-color: #c7eef3; height:150px; display:flex; align-items:center; justify-content:center; border-radius:10px;">
                        <i class='bx bxs-playlist' style="font-size:4rem; color:#9191bd;"></i>
                    </div>
                    <h4 style="margin-top:10px;">${lista.nombre}</h4>
                    <p>Playlist personalizada</p>
                `;
                resultsContainer.appendChild(listCard);
            });
        }
    } catch (err) { console.error("Error listas", err); }
}

async function createNewList() {
    const nombre = prompt("¿Cómo quieres llamar a tu nueva lista?");
    if (!nombre) return;
    const userId = localStorage.getItem("soundAtlas_userId");
    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('nombre', nombre);
    try {
        const res = await fetch("http://localhost/SoundAtlas/backend/api/create_list.php", { method: "POST", body: formData });
        const data = await res.json();
        if (data.status === "success") { alert("Lista creada!"); loadUserLists(); } 
        else { alert("Error: " + data.message); }
    } catch (err) { alert("Error conexión"); }
}

async function loadFavorites(lista_id, nombre_lista) {
    const userId = localStorage.getItem("soundAtlas_userId");
    currentListId = lista_id;
    currentListName = nombre_lista;

    let tituloMostrar = "Mis Favoritos";
    if (lista_id === 'general') tituloMostrar = "Favoritos Generales (Sueltos)";
    else if (nombre_lista) tituloMostrar = `Playlist: ${nombre_lista}`;
    
    if (sectionTitle) sectionTitle.textContent = tituloMostrar;
    resultsContainer.innerHTML = '<p>Cargando canciones...</p>';

    try {
        let url = `http://localhost/SoundAtlas/backend/api/get_favorites.php?user_id=${userId}`;
        if (lista_id) url += `&lista_id=${lista_id}`;

        const res = await fetch(url);
        const data = await res.json();
        if (data.status === "success") displayFavorites(data.data);
        else resultsContainer.innerHTML = '<p>Error al cargar favoritos.</p>';
    } catch (err) { resultsContainer.innerHTML = '<p>Error de conexión.</p>'; }
}

function displayFavorites(favorites) {
    resultsContainer.innerHTML = '';
    const backBtn = document.createElement('div');
    backBtn.style.width = "100%";
    backBtn.style.marginBottom = "20px";
    backBtn.innerHTML = `<button onclick="loadUserLists()" style="padding:10px 20px; cursor:pointer; background:#ddd; border:none; border-radius:20px; font-weight:bold;"><i class='bx bx-arrow-back'></i> Volver a Mis Listas</button>`;
    resultsContainer.appendChild(backBtn);

    if (favorites.length === 0) {
        resultsContainer.innerHTML += '<p>Aún no tienes canciones aquí.</p>';
        return;
    }
    favorites.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('card');
        const rating = item.rating || 0;

        // AÑADIDO: Generar Estrellas
        let stars = `<div style="text-align:center; margin:5px 0;">`;
        for(let i=1; i<=5; i++) {
            stars += `<i class='bx bxs-star' style="cursor:pointer; color:${i<=rating?'#FFD700':'#ccc'}; font-size:1.2rem;" onclick="rateSong(${item.id}, ${i})"></i>`;
        }
        stars += `</div>`;

        // AÑADIDO: Info + Delete (usando api_id para info, id para delete)
        card.innerHTML = `
            <img src="${item.imagen_url}" alt="${item.titulo}" class="card-img" style="height:auto; width:100%; border-radius:10px;">
            <h4>${item.titulo}</h4>
            <p>Guardado: ${new Date(item.created_at).toLocaleDateString()}</p>
            ${stars}
            <div style="margin-top:10px; display:flex; justify-content:space-around; align-items:center;">
                <i class='bx bx-info-circle' style="cursor:pointer; font-size:1.4rem; color:#9191bd;" title="Detalles" onclick="showSongDetails('${item.api_id}')"></i>
                <i class='bx bxs-trash' style="cursor:pointer; font-size:1.4rem; color:#e74c3c;" title="Eliminar" onclick="deleteFavorite(${item.id})"></i>
            </div>
        `;
        resultsContainer.appendChild(card);
    });
}

async function deleteFavorite(favId) {
    const userId = localStorage.getItem("soundAtlas_userId");
    if(!confirm("¿Seguro que quieres borrar esta canción?")) return;
    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('fav_id', favId);
    try {
        const res = await fetch("http://localhost/SoundAtlas/backend/api/delete_favorite.php", { method: "POST", body: formData });
        const data = await res.json();
        if (data.status === "success") { loadFavorites(currentListId, currentListName); } 
        else { alert("Error: " + data.message); }
    } catch (err) { alert("Error conexión al borrar"); }
}

// 6. FUNCIONALIDADES NUEVAS (DETALLES Y RATING)

function showSongDetails(deezerId) {
    //Llamada JSONP a Deezer Track
    const script = document.createElement('script');
    script.src = `${DEEZER_API_URL}/track/${deezerId}?output=jsonp&callback=handleTrackDetails`;
    document.body.appendChild(script);
}

function handleTrackDetails(track) {
    if(track.error) { alert("No se pudieron cargar los detalles."); return; }

    document.getElementById('detailImg').src = track.album.cover_medium;
    document.getElementById('detailTitle').textContent = track.title;
    document.getElementById('detailArtist').textContent = track.artist.name;
    document.getElementById('detailAlbum').textContent = track.album.title;
    document.getElementById('detailDuration').textContent = formatDuration(track.duration);
    document.getElementById('detailDate').textContent = track.release_date;
    document.getElementById('detailExplicit').textContent = track.explicit_lyrics ? 'Sí ⚠️' : 'No';
    
    document.getElementById('detailsModal').style.display = 'flex';
}

function closeDetailsModal() {
    document.getElementById('detailsModal').style.display = 'none';
}

async function rateSong(favId, rating) {
    const formData = new FormData();
    formData.append('fav_id', favId);
    formData.append('rating', rating);
    try {
        const res = await fetch("http://localhost/SoundAtlas/backend/api/update_rating.php", { method: "POST", body: formData });
        const data = await res.json();
        if (data.status === "success") { loadFavorites(currentListId, currentListName); }
        else { alert("Error al valorar: " + data.message); }
    } catch (err) { console.error(err); }
}