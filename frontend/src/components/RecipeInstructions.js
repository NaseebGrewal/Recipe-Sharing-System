import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RecipeInstructions.css';

const RecipeInstructions = ({ instructionsId }) => {
  const [instructions, setInstructions] = useState([]);

  //Get Instructions from database
  useEffect(() => {
    const fetchInstructions = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/recipeinstructions/${instructionsId}`);
        const data = response.data;
        setInstructions(data);
      } catch (error) {
        console.error('Error fetching instructions:', error);
      }
    };

    fetchInstructions();
  }, [instructionsId]);

  return (
    <div className='recipe-instructions'>
      <div className='instructions-header'>Instructions</div>

      <ol className='olist'>
        {instructions.map((instruction, index) => (
          <li key={instruction.step} className='listInstructions'>
            <div className='step-number'>Step {index + 1}</div>
            <div className='instruction-text'>{instruction.recipeinstructions}</div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default RecipeInstructions;
