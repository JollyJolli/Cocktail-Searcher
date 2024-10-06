document.addEventListener("DOMContentLoaded", function() {
    // Load favorites on startup
    loadFavorites();
    fetchRandomCocktails(); // Fetch random cocktails instead of all
});

function showLoader() {
    document.getElementById('loader').style.display = 'flex'; // Show loader
}

function hideLoader() {
    document.getElementById('loader').style.display = 'none'; // Hide loader
}

function displayError(message) {
    const resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML = `<p class="error">${message}</p>`; // Display error message
    hideLoader(); // Hide loader in case of error
}

function fetchRandomCocktails() {
    const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // Random letter A-Z
    const url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${randomLetter}`; // Use letter to fetch cocktails
    showLoader(); // Show loader before fetching
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`); // Throw error for non-2xx responses
            }
            return response.json();
        })
        .then(data => {
            if (data.drinks) {
                displayResults(data.drinks);
            } else {
                displayError("No cocktails found.");
            }
            hideLoader(); // Hide loader when cocktails are loaded
        })
        .catch(error => {
            console.error("Error fetching cocktails:", error);
            displayError("Failed to load cocktails. Please try again later.");
        });
}

function displayResults(drinks) {
    const resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML = ""; // Clear previous results
    if (drinks && drinks.length > 0) {
        drinks.forEach(drink => {
            const card = document.createElement("div");
            card.classList.add("cocktail-card");
            card.innerHTML = `
                <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}">
                <h3>${drink.strDrink}</h3>
                <div class="cocktail-details">
                    <button onclick="showPopOutDetails('${drink.idDrink}')"><i class="fas fa-info-circle"></i> Details</button>
                    <button onclick="addToFavorites('${drink.idDrink}', '${drink.strDrink}', '${drink.strDrinkThumb}')"><i class="fas fa-heart"></i> Favorite</button>
                </div>
            `;
            resultsContainer.appendChild(card);
        });
    } else {
        displayError("No cocktails found.");
    }
}

function addToFavorites(idDrink, strDrink, strDrinkThumb) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    // Check if the drink is already a favorite
    if (!favorites.find(fav => fav.idDrink === idDrink)) {
        favorites.push({ idDrink, strDrink, strDrinkThumb });
        localStorage.setItem('favorites', JSON.stringify(favorites));
        loadFavorites(); // Reload favorites to display updated list
        alert(`${strDrink} has been added to favorites!`);
    } else {
        alert(`${strDrink} is already in favorites.`);
    }
}

function loadFavorites() {
    // Function to load favorite cocktails from local storage (if any)
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const favoritesContainer = document.getElementById("favorites");
    favoritesContainer.innerHTML = ""; // Clear previous favorites
    
    if (favorites.length > 0) {
        favorites.forEach(drink => {
            const card = document.createElement("div");
            card.classList.add("cocktail-card");
            card.innerHTML = `
                <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}">
                <h3>${drink.strDrink}</h3>
                <div class="cocktail-details">
                    <button onclick="showPopOutDetails('${drink.idDrink}')"><i class="fas fa-info-circle"></i> Details</button>
                    <button onclick="removeFromFavorites('${drink.idDrink}')"><i class="fas fa-trash-alt"></i> Remove</button>
                </div>
            `;
            favoritesContainer.appendChild(card);
        });
    } else {
        favoritesContainer.innerHTML = "<p>No favorites found.</p>";
    }
}

function removeFromFavorites(idDrink) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const updatedFavorites = favorites.filter(fav => fav.idDrink !== idDrink);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    loadFavorites(); // Reload favorites to display updated list
}

function searchCocktail() {
    const searchInput = document.getElementById("searchInput").value;
    if (searchInput) {
        const url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchInput}`;
        showLoader(); // Show loader before fetching
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`); // Throw error for non-2xx responses
                }
                return response.json();
            })
            .then(data => {
                if (data.drinks) {
                    displayResults(data.drinks);
                } else {
                    displayError("No cocktails found for your search.");
                }
            })
            .catch(error => {
                console.error("Error searching cocktails:", error);
                displayError("Failed to search cocktails. Please try again later.");
            });
    } else {
        fetchRandomCocktails(); // If no search, show random cocktails
    }
}

function displayIngredients(cocktail) {
    let ingredients = '';
    for (let i = 1; i <= 15; i++) {
        const ingredient = cocktail[`strIngredient${i}`];
        const measure = cocktail[`strMeasure${i}`];
        if (ingredient) {
            ingredients += `<li>${ingredient} - ${measure}</li>`;
        }
    }
    return ingredients;
}

function showPopOutDetails(idDrink) {
    const url = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${idDrink}`;
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`); // Throw error for non-2xx responses
            }
            return response.json();
        })
        .then(data => {
            const cocktail = data.drinks[0];
            const ingredients = displayIngredients(cocktail);
            const popOutContent = `
                <h3>${cocktail.strDrink}</h3>
                <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}">
                <h4>Ingredients:</h4>
                <ul>${ingredients}</ul>
                <h4>Instructions:</h4>
                <p>${cocktail.strInstructions}</p>
            `;
            document.getElementById('popOutContent').innerHTML = popOutContent;
            document.getElementById('popOut').style.display = 'flex'; // Show pop-out
        })
        .catch(error => {
            console.error("Error fetching cocktail details:", error);
            displayError("Failed to load cocktail details. Please try again later.");
        });
}

function closePopOut() {
    document.getElementById('popOut').style.display = 'none'; // Hide pop-out
}
