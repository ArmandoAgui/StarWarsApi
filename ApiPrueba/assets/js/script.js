let currentPage = 1; // Página actual para la paginación de personajes de la API
const apiBaseUrl = 'https://swapi.dev/api/people/';
const resultsPerPage = 1; // Mostrar 3 personajes por página

// Función para buscar un personaje por nombre en la SWAPI
function getCharacter() {
    const characterName = document.getElementById('character-name').value.toLowerCase();
    const resultDiv = document.getElementById('character-result');
    resultDiv.innerHTML = ''; // Limpiar resultados previos

    fetch(`${apiBaseUrl}?search=${characterName}`)
        .then(response => response.json())
        .then(data => {
            if (data.results.length === 0) {
                resultDiv.innerHTML = '<p style="color:red;">Personaje no encontrado</p>';
                return;
            }

            const character = data.results[0];
            const characterInfo = `
                <h3>${character.name}</h3>
                <p>Género: ${character.gender}</p>
                <p>Altura: ${character.height} cm</p>
                <p>Peso: ${character.mass} kg</p>
            `;
            resultDiv.innerHTML = characterInfo;
        })
        .catch(error => {
            resultDiv.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
        });
}

// Función para cargar personajes de la API con paginación
function loadCharacters(page) {
    if (page < 1) return; // Evitar que vaya a páginas negativas

    const resultDiv = document.getElementById('character-result');
    resultDiv.innerHTML = ''; // Limpiar resultados previos

    // Ajustamos el "offset" según la página actual (saltando personajes para que solo muestre 3 por página)
    const offset = (page - 1) * resultsPerPage;

    fetch(`${apiBaseUrl}?page=${Math.ceil((offset / 10) + 1)}`) // Usar la API y calcular la página correcta
        .then(response => response.json())
        .then(data => {
            // Filtramos los personajes para que solo muestre 3 por página
            const paginatedResults = data.results.slice(offset % 10, (offset % 10) + resultsPerPage);

            if (paginatedResults.length === 0) return; // Si no hay resultados, salir

            currentPage = page;
            // Mostrar solo los 3 personajes de la página actual
            resultDiv.innerHTML = paginatedResults
                .map(character => `
                    <div>
                        <h3>${character.name}</h3>
                        <p>Género: ${character.gender}</p>
                        <p>Altura: ${character.height} cm</p>
                        <p>Peso: ${character.mass} kg</p>
                    </div>
                `)
                .join('');
        })
        .catch(error => {
            resultDiv.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
        });
}

// Inicializamos la carga de personajes de la API en la página 1
loadCharacters(currentPage);

// Array para simular la lista de personajes personalizados
let customCharacterList = [];

// Función para agregar o actualizar un personaje personalizado
document.getElementById('character-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevenir que el formulario recargue la página

    const name = document.getElementById('custom-name').value;
    const gender = document.getElementById('custom-gender').value;

    // Si ya existe, lo actualizamos, sino lo agregamos
    const existingIndex = customCharacterList.findIndex(character => character.name === name);
    if (existingIndex > -1) {
        customCharacterList[existingIndex].gender = gender; // Actualizar
    } else {
        customCharacterList.push({ name: name, gender: gender }); // Agregar
    }

    displayCustomCharacterList();
    this.reset(); // Limpiar el formulario
});

// Función para mostrar la lista de personajes personalizados
function displayCustomCharacterList() {
    const list = document.getElementById('custom-character-list');
    list.innerHTML = '';

    customCharacterList.forEach((character, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            ${character.name} (Género: ${character.gender})
            <button onclick="editCharacter(${index})">Editar</button>
            <button onclick="deleteCharacter(${index})">Eliminar</button>
        `;
        list.appendChild(listItem);
    });
}

// Función para editar un personaje personalizado (cargar datos en el formulario)
function editCharacter(index) {
    const character = customCharacterList[index];
    document.getElementById('custom-name').value = character.name;
    document.getElementById('custom-gender').value = character.gender;
}

// Función para eliminar un personaje personalizado
function deleteCharacter(index) {
    customCharacterList.splice(index, 1); // Elimina el personaje del array
    displayCustomCharacterList(); // Vuelve a mostrar la lista actualizada
}
