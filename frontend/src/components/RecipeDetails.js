import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Ingredients and Nutrients button icons
import { faList, faChartPie, faCircleNotch as faCircleUnchecked, faCheckCircle as faCircleChecked } from '@fortawesome/free-solid-svg-icons';
import { GiFire as Calories, GiBubbles as Fat, GiBreadSlice as Carbs, GiWheat as Fiber, GiMeat as Protein } from "react-icons/gi";
import { BsBoxes as Sugar } from "react-icons/bs";
import axios from 'axios';
import './RecipeDetails.css';

// Handles the display of a recipe's details
// Uses state variables to manage the visibility and data of the ingredient and nutrient lists
// Fetches ingredient and nutrient data
// Renders the appropriate list based on the state values and provides buttons to toggle between them
const RecipeDetails = ({ detailsId }) => {
  const [showIngredients, setShowIngredients] = useState(true); // State for displaying ingredient list
  const [showNutrients, setShowNutrients] = useState(false); // State for displaying nutrient list
  const [ingredientList, setIngredientList] = useState([]); // State for storing ingredient list
  const [nutrientList, setNutrientList] = useState(null); // State for storing nutrient list

  // Fetch ingredient and nutrient list when component mounts or detailsId changes
  useEffect(() => {
    fetchIngredients();
    fetchNutrients();
  }, [detailsId]);

  const fetchIngredients = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/recipeingredients/${detailsId}`);
      setIngredientList(response.data); // Update ingredient list state with the fetched data
    } catch (error) {
      console.log('Error fetching ingredients:', error);
    }
  };

  const fetchNutrients = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/recipenutrition/${detailsId}`);
      setNutrientList(response.data[0]); // Update nutrient list state with the fetched data
    } catch (error) {
      console.log('Error fetching nutrients:', error);
    }
  };

  // Show ingredient and hide nutrient list
  const handleIngredientButtonClick = () => {
    setShowIngredients(true);
    setShowNutrients(false);
  };

  // Show nutrient list and hide ingredient list
  const handleNutrientButtonClick = () => {
    setShowIngredients(false);
    setShowNutrients(true);
  };

  // Toggle the checked state of the clicked ingredient and update the ingredient list state
  const handleIngredientItemClick = (index) => {
    const updatedList = [...ingredientList];
    updatedList[index].checked = !updatedList[index].checked;
    setIngredientList(updatedList);
  };

  return (
    <div className="box" style={{ fontFamily: 'Fira Sans'}}>
      <div className="listRecipeDetails">
        {showIngredients && (
          <div>
            <h2 className="listHeader">Ingredient List</h2>
            <ul className="listItems">
              {ingredientList.map((item, index) => (
                <li
                  key={index}
                  className="listInformation"
                  onClick={() => handleIngredientItemClick(index)}
                >
                  <FontAwesomeIcon
                    icon={item.checked ? faCircleChecked : faCircleUnchecked}
                  />{' '}
                  {item.ingredient}
                </li>
              ))}
            </ul>
          </div>
        )}
        {showNutrients && nutrientList && (
          <div>
            <h2 className="listHeader">Nutrient List</h2>
            <ul className="listItems">
              <li className="listInformation">
                <Calories /> Calories: {nutrientList.calories} kcal
              </li>
              <li className="listInformation">
                <Fat /> Fat: {nutrientList.fat} g
              </li>
              <li className="listInformation">
                <Carbs /> Carbs: {nutrientList.carbs} g
              </li>
              <li className="listInformation">
                <Fiber /> Fiber: {nutrientList.fiber} g
              </li>
              <li className="listInformation">
                <Sugar /> Sugar: {nutrientList.sugar} g
              </li>
              <li className="listInformation">
                <Protein /> Protein: {nutrientList.protein} g
              </li>
            </ul>
          </div>
        )}
      </div>
      <div className="buttons">
        <button onClick={handleIngredientButtonClick}>
          <FontAwesomeIcon icon={faList} />
        </button>
        <button onClick={handleNutrientButtonClick}>
          <FontAwesomeIcon icon={faChartPie} />
        </button>
      </div>
    </div>
  );
};

export default RecipeDetails;
