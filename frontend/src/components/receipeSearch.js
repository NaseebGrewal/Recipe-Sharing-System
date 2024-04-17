import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './receipeSearch.css'; // Import the CSS file

const ReceipeSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState({
    authorResults: [],
    recipeResults: [],
    keywordResults: [],
  });

  const [isAuthorOpen, setIsAuthorOpen] = useState(true);
  const [isRecipeOpen, setIsRecipeOpen] = useState(true);
  const [isKeywordOpen, setIsKeywordOpen] = useState(true);
  const [sortField, setSortField] = useState('');

  const handleAuthorToggle = () => {
    setIsAuthorOpen(!isAuthorOpen);
  };

  const handleRecipeToggle = () => {
    setIsRecipeOpen(!isRecipeOpen);
  };

  const handleKeywordToggle = () => {
    setIsKeywordOpen(!isKeywordOpen);
  };

  const handleSortChange = (event) => {
    setSortField(event.target.value);
  };

  const sortResults = (results, field) => {
    const sortedResults = [...results].sort((a, b) => {

        // Use the default string comparison for other fields
        if (a[field] < b[field]) return -1;
        if (a[field] > b[field]) return 1;
        return 0;

    });
  
    return sortedResults;
  };
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('http://localhost:5000/api/Search', { searchTerm });
        setSearchResults(response.data);
      } catch (error) {
        console.error('Error searching recipes:', error);
      }
    };

    fetchData();
  }, [searchTerm]);

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const ReceipeItem = ({ receipeItem }) => {
    return (
      <div className="Receipe-item">
        <Link to={`/recipe/${receipeItem.id}`}>
          <img className="ReceipeIcon" src={receipeItem.imageurl} alt="Receipe Icon" />
          <div className="Receipe-name">{receipeItem.name}</div>
          <div className="Receipe-name">{receipeItem.servings} servings</div>
          <div className="Receipe-name">{receipeItem.cook_time}</div>
        </Link>
      </div>
    );
  };

  return (
    <div className="container">
      <div className="results-tab-header">
        <h2>Recipe Search Page</h2>
        <div className="sort-dropdown">
          Sort by : 
          <select value={sortField} onChange={handleSortChange}>
            <option value="">None</option>
            <option value="name">Name</option>
            <option value="servings">Servings</option>
            <option value="cook_time">Cooking Time</option>
          </select>
        </div>
      </div>
      <form>
        <input
          type="text"
          name="searchTerm"
          value={searchTerm}
          onChange={handleSearchTermChange}
          placeholder="Search by Recipe Name, Author Name, or Keyword"
        />
      </form>
      {searchTerm && (
        <div className="results-content">
          {searchResults.authorResults.length > 0 && (
            <div className="results-tab-content">
              <div className="results-tab-header" onClick={handleAuthorToggle}>
                <div className="title">Results by Author: {searchResults.authorResults.length} results found</div>
                <div className="arrows">  {isAuthorOpen ? "▼" : "►"}</div>
              </div>
              {isAuthorOpen && (
                <div className="results-tab-body">
                  {sortResults(searchResults.authorResults, sortField).map((result) => (
                    <ReceipeItem receipeItem={result} key={result.id} />
                  ))}
                </div>
              )}
            </div>
          )}
          {searchResults.recipeResults.length > 0 && (
            <div className="results-tab-content">
              <div className="results-tab-header" onClick={handleRecipeToggle}>
                <div className="title">Results by Recipe: {searchResults.recipeResults.length} results found</div>
                <div className="arrows">  {isRecipeOpen ? "▼" : "►"}</div>
              </div>
              {isRecipeOpen && (
                <div className="results-tab-body">        
                  {sortResults(searchResults.recipeResults, sortField).map((result) => (
                    <ReceipeItem receipeItem={result} key={result.id} />
                  ))}
                </div>
              )}
            </div>
          )}
          {searchResults.keywordResults.length > 0 && (
            <div className="results-tab-content">
              <div className="results-tab-header" onClick={handleKeywordToggle}>
                <div className="title">Results by Keyword: {searchResults.keywordResults.length} results found</div>
                <div className="arrows">  {isKeywordOpen ? "▼" : "►"}</div>
              </div>
              {isKeywordOpen && (
                <div className="results-tab-body">
                  {sortResults(searchResults.keywordResults, sortField).map((result) => (
                    <ReceipeItem receipeItem={result} key={result.id} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReceipeSearch;
