import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RecipeInfo.css';
import { GiAlarmClock } from 'react-icons/gi';
import { BsPersonLinesFill } from 'react-icons/bs';

const RecipeInfo = ({ infoId }) => {
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [cookDetails, setCookDetails] = useState(false);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/recipedetails/${infoId}`);
        const data = response.data;
        setRecipeDetails(data);
      } catch (error) {
        console.error('Error fetching recipe details:', error);
      }
    };

    const fetchCookData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/recipecookdetails/${infoId}`);
        setCookDetails(response.data[0]);
      } catch (error) {
        console.log('Error fetching cook details:', error);
      }
    };

    fetchRecipeDetails();
    fetchCookData();
  }, [infoId]);

  if (!recipeDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="recipe-container">
      <div className="infobox">
        <div className="foodsheet">
          <div className="author">
            <BsPersonLinesFill /> {recipeDetails.author}
          </div>
          <div className="cook-time">
            <GiAlarmClock /> {cookDetails.cook_time}
          </div>
          <div className="servings">Servings: {cookDetails.servings}</div>
        </div>
        <div className="description">
          <div className="title">{recipeDetails.name}</div>
          <div className="recipe-description">{recipeDetails.description}</div>
        </div>
        <div className="image">
          <img src={recipeDetails.imageurl} alt="Recipe Information" />
        </div>
      </div>
    </div>
  );
};

export default RecipeInfo;
