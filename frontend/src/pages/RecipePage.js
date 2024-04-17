import React, { useEffect, useState } from 'react';
import RecipeInfo from '../components/RecipeInfo';
import RecipeInstructions from '../components/RecipeInstructions';
import RecipeDetails from '../components/RecipeDetails';
import { useParams } from 'react-router-dom';
import './RecipePage.css'
const RecipePage = () => {

const { id } = useParams();
const [recipeId, setRecipeId] = useState(id);

useEffect(() => {
  setRecipeId(id);
}, [id]);

  return (
    <div className='body' style={{ 
      backgroundImage: `url("https://i.imgur.com/lUcjwuR.png")` 
    }}>
      <div className='components' style={{ fontFamily: 'Fira Sans' }}>
        <RecipeInfo infoId={recipeId} />
        <RecipeInstructions instructionsId={recipeId} />
      </div>
      <RecipeDetails detailsId={recipeId} />
    </div>
  );
};

export default RecipePage;