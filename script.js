document.addEventListener("DOMContentLoaded", function () {
    // Muestra la pantalla de carga
    var loaderWrapper = document.querySelector(".loader-wrapper");
    loaderWrapper.style.display = "flex"; // Asegurémonos de que esté visible
    var tiempoAleatorio = Math.floor(Math.random() * (6000 - 4000 + 1)) + 1000;
    setTimeout(function () {
        loaderWrapper.style.display = "none";
    }, tiempoAleatorio);
});

function buscarCocktail() {
    var input = document.getElementById('searchInput').value;

    // Verificar si se ingresó un término de búsqueda
    if (input.trim() === "") {
        alert("Ingresa el nombre de un cóctel o ID para buscar.");
        return;
    }

    // Construir la URL de la API
    var apiUrl;

    if (!isNaN(input)) {
        // Si la entrada es un número, asumimos que es un ID y construimos la URL de búsqueda por ID
        apiUrl = 'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=' + input;
    } else {
        // Si la entrada no es un número, asumimos que es un nombre y construimos la URL de búsqueda por nombre
        apiUrl = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + input;
    }

    // Realizar la solicitud a la API usando Fetch
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => mostrarResultados(data.drinks))
        .catch(error => console.error('Error:', error));
}

function mostrarResultados(cocteles) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = ""; // Limpiar resultados anteriores

    // Verificar si se encontraron resultados
    if (cocteles === null) {
        resultsContainer.innerHTML = "<p>No se encontraron resultados.</p>";
        return;
    }

    // Crear tarjetas para cada cóctel
    cocteles.forEach(coctel => {
        const card = document.createElement('div');
        card.className = 'cocktail-card';
        card.innerHTML = `
            <img src="${coctel.strDrinkThumb}" alt="${coctel.strDrink}">
            <h3>${coctel.strDrink}</h3>
            <div class="cocktail-details">
                <h3>Detalles:</h3>
                <p><strong>Categoría:</strong> ${coctel.strCategory}</p>
                <p><strong>Vaso:</strong> ${coctel.strGlass}</p>
                <p><strong>Instrucciones:</strong> ${coctel.strInstructions}</p>
                <h3>Ingredientes:</h3>
                <ul>
                    ${mostrarIngredientes(coctel)}
                </ul>
            </div>
        `;
        resultsContainer.appendChild(card);
    });
}


function mostrarPopOutDetalles(idDrink) {
    // Obtener el contenedor del pop-out
    const popOutContainer = document.getElementById("popOut");
    // Obtener el contenido del pop-out
    const popOutContent = document.getElementById("popOutContent");

    // Limpiar el contenido previo
    popOutContent.innerHTML = "";

    // Realizar una solicitud a la API para obtener detalles por idDrink
    const url = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${idDrink}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Verificar si se obtuvo información
            if (data.drinks && data.drinks.length > 0) {
                // Mostrar la información en el pop-out
                const cocktailDetails = data.drinks[0];
                popOutContent.innerHTML = `
                    <img src="${cocktailDetails.strDrinkThumb}" alt="${cocktailDetails.strDrink}">
                    <h3>${cocktailDetails.strDrink}</h3>
                    <p>Categoría: ${cocktailDetails.strCategory}</p>
                    <p>Instrucciones: ${cocktailDetails.strInstructions}</p>
                    <h4>Ingredientes:</h4>
                    <ul>
                        ${mostrarIngredientes(cocktailDetails)}
                    </ul>
                `;
            }

            // Mostrar el pop-out
            popOutContainer.style.display = "block";
        })
        .catch(error => console.error("Error al obtener detalles del cóctel:", error));
}

function cerrarPopOut() {
    var popOut = document.getElementById('popOut');
    popOut.style.display = 'none';
}

document.addEventListener("DOMContentLoaded", function() {
    // Hacer la solicitud para obtener un cóctel aleatorio al cargar la página
    obtenerCocktailAleatorio();
});

function obtenerCocktailAleatorio() {
    // URL para obtener un cóctel aleatorio
    const url = "https://www.thecocktaildb.com/api/json/v1/1/random.php";

    // Realizar la solicitud a la API
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Verificar si se obtuvo un cóctel
            if (data.drinks && data.drinks.length > 0) {
                // Mostrar la información del cóctel en la página
                mostrarCocktail(data.drinks[0]);
            }
        })
        .catch(error => console.error("Error al obtener cóctel aleatorio:", error));
}

function mostrarCocktail(cocktail) {
    // Obtener el contenedor de resultados
    const resultsContainer = document.getElementById("results");

    // Crear una nueva tarjeta de cóctel
    const cocktailCard = document.createElement("div");
    cocktailCard.className = "cocktail-card";
    cocktailCard.innerHTML = `
        <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}">
        <h3>${cocktail.strDrink}</h3>
        <div class="cocktail-details">
            <h3>Detalles:</h3>
            <p><strong>Categoría:</strong> ${cocktail.strCategory}</p>
            <p><strong>Vaso:</strong> ${cocktail.strGlass}</p>
            <p><strong>Instrucciones:</strong> ${cocktail.strInstructions}</p>
            <h3>Ingredientes:</h3>
            <ul>
                ${mostrarIngredientes(cocktail)}
            </ul>
        </div>
    `;

    // Agregar la tarjeta al contenedor de resultados
    resultsContainer.appendChild(cocktailCard);
}


function mostrarIngredientes(cocktail) {
    // Crear una lista de ingredientes y medidas
    let ingredientesHTML = "";
    for (let i = 1; i <= 15; i++) {
        const ingrediente = cocktail[`strIngredient${i}`];
        const medida = cocktail[`strMeasure${i}`];

        if (ingrediente && medida) {
            ingredientesHTML += `<li>${medida} ${ingrediente}</li>`;
        }
    }

    return ingredientesHTML;
}
