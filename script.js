const searchBox = document.querySelector('.searchBox');
const searchBtn = document.querySelector('.searchBtn');
const recipeContainer = document.querySelector('.recipe-container');
const recipeDetailsContent = document.querySelector('.recipe-details-content');
const recipeCloseBtn = document.querySelector('.recipeCloseBtn');
/* function to get recipes */
const fetchRecipes = async (query) => {
  recipeContainer.innerHTML = `<h1>Fetching Recipes...</h1>`;

  try {
    const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);

    const response = await data.json();
    /* console.log(response.meals[0]); */

    recipeContainer.innerHTML = "";

    response.meals.forEach(meal => {
      const recipeDiv = document.createElement('div');
      recipeDiv.classList.add('recipe');
      recipeDiv.innerHTML = `
    <img src="${meal.strMealThumb}">
    <div class="recipeContent">
    <h3>${meal.strMeal}</h3>
    <p><span>${meal.strArea}</span> Dish</p>
    <p>Belongs to <span> ${meal.strCategory}</span></p>
    </div>
    

    `;
      const recipeBtn = document.createElement('button');
      recipeBtn.textContent = "View Recipe";
      recipeDiv.appendChild(recipeBtn);

      recipeBtn.addEventListener('click', () => {
        openRecipePopup(meal);
      });

      recipeContainer.appendChild(recipeDiv);
    });
  } catch (error) {
    recipeContainer.innerHTML = `<h2>Error in fetching recipes...</h2>`
  }
}
/* fetching ingredents */
const fecthIngredents = (meal) => {
  let ingredentsList = "";

  for (let i = 1; i < 20; i++) {
    const ingredent = meal[`strIngredient${i}`];
    if (ingredent) {
      const measure = meal[`strMeasure${i}`]
      ingredentsList += `<li>${measure} ${ingredent}</li>`;
    } else {
      break;
    }
  }
  return ingredentsList;
}
const openRecipePopup = (meal) => {
  recipeDetailsContent.innerHTML = `
  <h2 class="recipeName">${meal.strMeal}</h2>
  <h3>Ingredents: </h3>
  <ul class="ingradientsList">${fecthIngredents(meal)}</ul>
  <div class="recipeInstructions">
    <h3>Instructions:</h3>
    <p>${meal.strInstructions}</p>
  </div>
  `;

  recipeDetailsContent.parentElement.style.display = "block";
}


recipeCloseBtn.addEventListener('click', () => {
  recipeDetailsContent.parentElement.style.display = "none";
})
searchBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const searchInput = searchBox.value.trim();
  if (!searchInput) {
    recipeContainer.innerHTML = `<h2>Type the Meal Name into Search Box.</h2>`;
    return;
  }
  fetchRecipes(searchInput);
});