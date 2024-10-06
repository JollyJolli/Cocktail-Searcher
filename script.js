document.addEventListener("DOMContentLoaded", function() {
    // Load favorites on startup
    loadFavorites();
    fetchCocktails();
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

function fetchCocktails() {
    const url = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s="; // Base API URL
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
                </div>
            `;
            resultsContainer.appendChild(card);
        });
    } else {
        displayError("No cocktails found.");
    }
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
        fetchCocktails(); // If no search, show all cocktails
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
            if (data.drinks && data.drinks.length > 0) {
                const cocktail = data.drinks[0];
                const popOutContent = document.getElementById("popOutContent");
                popOutContent.innerHTML = `
                    <h3>${cocktail.strDrink}</h3>
                    <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}">
                    <p><strong>Category:</strong> ${cocktail.strCategory}</p>
                    <p><strong>Glass:</strong> ${cocktail.strGlass}</p>
                    <p><strong>Instructions:</strong> ${cocktail.strInstructions}</p>
                    <h3>Ingredients:</h3>
                    <ul>${displayIngredients(cocktail)}</ul>
                `;
                document.getElementById("popOut").classList.add('show'); // Show pop-out with animation
            } else {
                displayError("Cocktail details not found.");
            }
        })
        .catch(error => {
            console.error("Error displaying cocktail details:", error);
            displayError("Failed to load cocktail details. Please try again later.");
        });
}

function closePopOut() {
    document.getElementById("popOut").classList.remove('show'); // Hide pop-out with animation
    setTimeout(() => {
        document.getElementById("popOutContent").innerHTML = ''; // Clear content
    }, 300); // Duration of the animation
}

function loadFavorites() {
    // Function to load favorite cocktails from local storage (if any)
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (favorites.length > 0) {
        displayResults(favorites); // Show favorites if they exist
    } else {
        displayError("No favorites found.");
    }
}
