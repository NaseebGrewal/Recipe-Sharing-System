import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './HomePage.css';
import { Col, List, Row} from 'antd';
// import Dashboard from '../Dashboard';
import { FacebookOutlined, InstagramOutlined, YoutubeOutlined} from '@ant-design/icons';

const HomePage = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [displayedRecipes, setDisplayedRecipes] = useState({});
  const recipesPerBatch = 6;

  useEffect(() => {
    axios
      .get('http://localhost:5000/recipes')
      .then((response) => {
        const initialDisplayedRecipes = {};
        response.data.forEach((category) => {
          initialDisplayedRecipes[category.category] = recipesPerBatch;
        });
        setDisplayedRecipes(initialDisplayedRecipes);
        setCategoryData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching category data:', error);
      });
  }, []);

  const handleLoadMore = (category) => {
    setDisplayedRecipes((prevDisplayedRecipes) => ({
      ...prevDisplayedRecipes,
      [category]: prevDisplayedRecipes[category] + recipesPerBatch,
    }));
  };

  return (
    <div className="homepage">
      <div className="flex-card">
        {categoryData.map((category) => (
          <div key={category.category} className="category-container">
            <h2 className="category-title">{category.category} recipes</h2>
            <div className="recipe-list">
              {category.recipes
                .filter((recipe) => recipe.name !== 'Chicken Recipe' && recipe.name !== 'Pasta Recipe')
                .slice(0, displayedRecipes[category.category])
                .map((recipe) => (
                  <div key={recipe.id} className="recipe-item">
                    <Link to={`/recipe/${recipe.id}`}>
                      <div className="recipe-image">
                        <img src={recipe.imageurl} alt={recipe.name} />
                        <h3 className="recipe-name">{recipe.name}</h3>
                      </div>
                    </Link>
                  </div>
                ))}
            </div>
            {displayedRecipes[category.category] < category.recipes.length && (
              <button
                className="load-more-button"
                onClick={() => handleLoadMore(category.category)}
              >
                Load More
              </button>
            )}
          </div>
        ))}
      </div>
      <div style={{width: '100%'}}>
            <Row style={{ backgroundColor: 'yellow', padding: '2%', justifyContent: "space-between" }}>
                <div>
                    <h2>yummytummy</h2>
                    <p>Leave your cooking worries behind and embark on a delicious journey with our website's user-friendly recipes</p>

                </div>
                <div style={{display:'flex', flexDirection:'column'}}>
                    <h2>Recipes</h2>
                    <Link to={"/"} style={{ color: 'black', fontSize: 15 }}>
                        How to 
                    </Link>
                    <Link to={"/"} style={{ color: 'black', fontSize: 15 }}>
                        Kitchen Basics
                    </Link>
                </div>
                <div style={{display:'flex', flexDirection:'column'}}>
                    <h2>About</h2>
                    <Link to={"/"} style={{ color: 'black', fontSize: 15}}>
                        About us
                    </Link>
                    <Link to={"/"} style={{ color: 'black', fontSize: 15 }}>
                        contact
                    </Link>

                </div>

                <div style={{display:'flex', flexDirection:'column'}}>
                    <h2>Contact</h2>
                    <Link to={"https://www.facebook.com/login/"} style={{ color: 'black', fontSize: 15 }}>
                    <FacebookOutlined 
                    style={{
                        fontSize: "25px",
                        color:'white',
                        background:'blue'}}
                         /> {"   "}
                        facebook
                    </Link>

                    <Link to={"https://www.instagram.com/accounts/login/"} style={{ color: 'black', fontSize: 15 }}>
                    <InstagramOutlined 
                          style={{
                            fontSize: "25px",
                            color:'#E4405F',
                            background:'white'}}
                            /> {"   "}
                        instagram
                    </Link>

                    <Link to={"https://www.youtube.com/"} style={{ color: 'black' }}>
                    <YoutubeOutlined 
                    style={{
                        fontSize: "25px",
                        color:'white',
                        background:'red'}}
                    /> {"   "}
                        youtube
                    </Link>
                </div>
            </Row>
        </div>
    </div>
  );
};

export default HomePage;






// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import './HomePage.css';
// import { Col, List, Row } from 'antd';
// import { FacebookOutlined, InstagramOutlined, YoutubeOutlined } from '@ant-design/icons';

// const PUBLIC_URL = process.env.PUBLIC_URL;

// const HomePage = () => {
//   const [categoryData, setCategoryData] = useState([]);
//   const [displayedRecipes, setDisplayedRecipes] = useState({});
//   const [isSignedIn, setIsSignedIn] = useState(false); // Track user sign-in status
//   const recipesPerBatch = 6;

//   useEffect(() => {
//     axios
//       .get('http://localhost:5000/recipes')
//       .then((response) => {
//         const initialDisplayedRecipes = {};
//         response.data.forEach((category) => {
//           initialDisplayedRecipes[category.category] = recipesPerBatch;
//         });
//         setDisplayedRecipes(initialDisplayedRecipes);
//         setCategoryData(response.data);
//       })
//       .catch((error) => {
//         console.error('Error fetching category data:', error);
//       });
//   }, []);

//   const handleLoadMore = (category) => {
//     setDisplayedRecipes((prevDisplayedRecipes) => ({
//       ...prevDisplayedRecipes,
//       [category]: prevDisplayedRecipes[category] + recipesPerBatch,
//     }));
//   };

//   const handleAddRecipe = () => {
//     if (isSignedIn) {
//       // Add recipe functionality
//       console.log('Add recipe');
//     } else {
//       alert('Please sign in to add a recipe.');
//     }
//   };

//   return (
//     <div className="homepage">
//       <div className="top-bar">
//         <h1 className="logo">Recipe App</h1>
//         <nav className="navbar">
//           <Link to="/" className="nav-link">
//             Home
//           </Link>
//           <button className="nav-link" onClick={handleAddRecipe} disabled={!isSignedIn}>
//             Add Recipe
//           </button>
//           <Link to="/search" className="nav-link">
//             Search Recipe
//           </Link>
//           {!isSignedIn ? (
//             <>
//               <Link to="/signin" className="nav-link">
//                 Sign In
//               </Link>
//               <Link to="/signup" className="nav-link">
//                 Sign Up
//               </Link>
//             </>
//           ) : null}
//         </nav>
//       </div>
//       {/* Rest of the component */}
//       <div className="flex-card">
//         {categoryData.map((category) => (
//           <div key={category.category} className="category-container">
//             <h2 className="category-title">{category.category} recipes</h2>
//             <div className="recipe-list">
//               {category.recipes
//                 .filter((recipe) => recipe.name !== 'Chicken Recipe' && recipe.name !== 'Pasta Recipe')
//                 .slice(0, displayedRecipes[category.category])
//                 .map((recipe) => (
//                   <div key={recipe.id} className="recipe-item">
//                     <Link to={`/recipe/${recipe.id}`}>
//                       <div className="recipe-image">
//                         <img src={recipe.imageurl} alt={recipe.name} />
//                         <h3 className="recipe-name">{recipe.name}</h3>
//                       </div>
//                     </Link>
//                   </div>
//                 ))}
//             </div>
//             {displayedRecipes[category.category] < category.recipes.length && (
//               <button
//                 className="load-more-button"
//                 onClick={() => handleLoadMore(category.category)}
//               >
//                 Load More
//               </button>
//             )}
//           </div>
//         ))}
//       </div>
//       <div style={{width: '100%'}}>
//             <Row style={{ backgroundColor: 'yellow', padding: '2%', justifyContent: "space-between" }}>
//                 <div>
//                     <h2>yummytummy</h2>
//                     <p>Leave your cooking worries behind and embark on a delicious journey with our website's user-friendly recipes</p>

//                 </div>
//                 <div style={{display:'flex', flexDirection:'column'}}>
//                     <h2>Recipes</h2>
//                     <Link to={"/"} style={{ color: 'black', fontSize: 15 }}>
//                         How to 
//                     </Link>
//                     <Link to={"/"} style={{ color: 'black', fontSize: 15 }}>
//                         Kitchen Basics
//                     </Link>
//                 </div>
//                 <div style={{display:'flex', flexDirection:'column'}}>
//                     <h2>About</h2>
//                     <Link to={"/"} style={{ color: 'black', fontSize: 15}}>
//                         About us
//                     </Link>
//                     <Link to={"/"} style={{ color: 'black', fontSize: 15 }}>
//                         contact
//                     </Link>

//                 </div>

//                 <div style={{display:'flex', flexDirection:'column'}}>
//                     <h2>Contact</h2>
//                     <Link to={"https://www.facebook.com/login/"} style={{ color: 'black', fontSize: 15 }}>
//                     <FacebookOutlined 
//                     style={{
//                         fontSize: "25px",
//                         color:'white',
//                         background:'blue'}}
//                          /> {"   "}
//                         facebook
//                     </Link>

//                     <Link to={"https://www.instagram.com/accounts/login/"} style={{ color: 'black', fontSize: 15 }}>
//                     <InstagramOutlined 
//                           style={{
//                             fontSize: "25px",
//                             color:'#E4405F',
//                             background:'white'}}
//                             /> {"   "}
//                         instagram
//                     </Link>

//                     <Link to={"https://www.youtube.com/"} style={{ color: 'black' }}>
//                     <YoutubeOutlined 
//                     style={{
//                         fontSize: "25px",
//                         color:'white',
//                         background:'red'}}
//                     /> {"   "}
//                         youtube
//                     </Link>
//                 </div>
//             </Row>
//         </div>
//     </div>
//   );
// };

// export default HomePage;








// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import './HomePage.css';
// import { Col, List, Row } from 'antd';
// import { FacebookOutlined, InstagramOutlined, YoutubeOutlined } from '@ant-design/icons';

// const PUBLIC_URL = process.env.PUBLIC_URL;

// const HomePage = () => {
//   const [categoryData, setCategoryData] = useState([]);
//   const [displayedRecipes, setDisplayedRecipes] = useState({});
//   const [isSignedIn, setIsSignedIn] = useState(false); // Track user sign-in status
//   const recipesPerBatch = 6;

//   useEffect(() => {
//     axios
//       .get('http://localhost:5000/recipes')
//       .then((response) => {
//         const initialDisplayedRecipes = {};
//         response.data.forEach((category) => {
//           initialDisplayedRecipes[category.category] = recipesPerBatch;
//         });
//         setDisplayedRecipes(initialDisplayedRecipes);
//         setCategoryData(response.data);
//       })
//       .catch((error) => {
//         console.error('Error fetching category data:', error);
//       });
//   }, []);

//   const handleLoadMore = (category) => {
//     setDisplayedRecipes((prevDisplayedRecipes) => ({
//       ...prevDisplayedRecipes,
//       [category]: prevDisplayedRecipes[category] + recipesPerBatch,
//     }));
//   };

//   const handleAddRecipe = () => {
//     if (isSignedIn) {
//       // Add recipe functionality
//       console.log('Add recipe');
//     } else {
//       alert('Please sign in to add a recipe.');
//     }
//   };

//   return (
//     <div className="homepage">
//       <div className="flex-card">
//         <div className="top-bar">
//           <h1 className="logo">Recipe App</h1>
//           <nav className="navbar">
//             <Link to="/" className="nav-link">
//               Home
//             </Link>
//             <button className="nav-link add-recipe" onClick={handleAddRecipe} disabled={!isSignedIn}>
//               Add Recipe
//             </button>
//             <Link to="/search" className="nav-link">
//               Search Recipe
//             </Link>
//             {!isSignedIn ? (
//               <>
//               <Link to="/register" className="signup-link">
//                 Sign Up
//               </Link>
//               <Link to="/login" className="signin-link">
//                 Login
//               </Link>
//                 {/* <Link to="/login" className="nav-link">
//                   Sign In
//                 </Link>
//                 <Link to="/register" className="nav-link">
//                   Sign Up
//                 </Link> */}
//               </>
//             ) : null}
//           </nav>
//         </div>
//         {/* Rest of the component */}
//       </div>



//       <div className="flex-card2">
//         {categoryData.map((category) => (
//           <div key={category.category} className="category-container">
//             <h2 className="category-title">{category.category} recipes</h2>
//             <div className="recipe-list">
//               {category.recipes
//                 .filter((recipe) => recipe.name !== 'Chicken Recipe' && recipe.name !== 'Pasta Recipe')
//                 .slice(0, displayedRecipes[category.category])
//                 .map((recipe) => (
//                   <div key={recipe.id} className="recipe-item">
//                     <Link to={`/recipe/${recipe.id}`}>
//                       <div className="recipe-image">
//                         <img src={recipe.imageurl} alt={recipe.name} />
//                         <h3 className="recipe-name">{recipe.name}</h3>
//                       </div>
//                     </Link>
//                   </div>
//                 ))}
//             </div>
//             {displayedRecipes[category.category] < category.recipes.length && (
//               <button
//                 className="load-more-button"
//                 onClick={() => handleLoadMore(category.category)}
//               >
//                 Load More
//               </button>
//             )}
//           </div>
//         ))}
//       </div>
//       <div style={{width: '100%'}}>
//             <Row style={{ backgroundColor: 'yellow', padding: '2%', justifyContent: "space-between" }}>
//                 <div>
//                     <h2>yummytummy</h2>
//                     <p>Leave your cooking worries behind and embark on a delicious journey with our website's user-friendly recipes</p>

//                 </div>
//                 <div style={{display:'flex', flexDirection:'column'}}>
//                     <h2>Recipes</h2>
//                     <Link to={"/"} style={{ color: 'black', fontSize: 15 }}>
//                         How to 
//                     </Link>
//                     <Link to={"/"} style={{ color: 'black', fontSize: 15 }}>
//                         Kitchen Basics
//                     </Link>
//                 </div>
//                 <div style={{display:'flex', flexDirection:'column'}}>
//                     <h2>About</h2>
//                     <Link to={"/"} style={{ color: 'black', fontSize: 15}}>
//                         About us
//                     </Link>
//                     <Link to={"/"} style={{ color: 'black', fontSize: 15 }}>
//                         contact
//                     </Link>

//                 </div>

//                 <div style={{display:'flex', flexDirection:'column'}}>
//                     <h2>Contact</h2>
//                     <Link to={"https://www.facebook.com/login/"} style={{ color: 'black', fontSize: 15 }}>
//                     <FacebookOutlined 
//                     style={{
//                         fontSize: "25px",
//                         color:'white',
//                         background:'blue'}}
//                          /> {"   "}
//                         facebook
//                     </Link>

//                     <Link to={"https://www.instagram.com/accounts/login/"} style={{ color: 'black', fontSize: 15 }}>
//                     <InstagramOutlined 
//                           style={{
//                             fontSize: "25px",
//                             color:'#E4405F',
//                             background:'white'}}
//                             /> {"   "}
//                         instagram
//                     </Link>

//                     <Link to={"https://www.youtube.com/"} style={{ color: 'black' }}>
//                     <YoutubeOutlined 
//                     style={{
//                         fontSize: "25px",
//                         color:'white',
//                         background:'red'}}
//                     /> {"   "}
//                         youtube
//                     </Link>
//                 </div>
//             </Row>
//         </div>

//     </div>
//   );
// };

// export default HomePage;





// worked on implementing Preethi's code with my code ------------------------------------------------------------------------------------------------------------------------------------------------------------------

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Link, Redirect } from "react-router-dom";
// import "./HomePage.css";
// import { Col, List, Row } from "antd";
// import NavbarComp from "../components/NavbarComp";
// import { FacebookOutlined, InstagramOutlined, YoutubeOutlined } from "@ant-design/icons";

// const PUBLIC_URL = process.env.PUBLIC_URL;

// const HomePage = () => {
//   const [categoryData, setCategoryData] = useState([]);
//   const [displayedRecipes, setDisplayedRecipes] = useState({});
//   const recipesPerBatch = 6;

//   useEffect(() => {
//     axios
//       .get("http://localhost:5000/recipes")
//       .then((response) => {
//         const initialDisplayedRecipes = {};
//         response.data.forEach((category) => {
//           initialDisplayedRecipes[category.category] = recipesPerBatch;
//         });
//         setDisplayedRecipes(initialDisplayedRecipes);
//         setCategoryData(response.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching category data:", error);
//       });
//   }, []);

//   const handleLoadMore = (category) => {
//     setDisplayedRecipes((prevDisplayedRecipes) => ({
//       ...prevDisplayedRecipes,
//       [category]: prevDisplayedRecipes[category] + recipesPerBatch,
//     }));
//   };

//   const decodeToken = (token) => {
//     try {
//       const base64Url = token.split(".")[1];
//       const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//       const jsonPayload = decodeURIComponent(
//         atob(base64)
//           .split("")
//           .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
//           .join("")
//       );

//       const decodedPayload = JSON.parse(jsonPayload);
//       return decodedPayload;
//     } catch (error) {
//       console.error("Error decoding token:", error);
//       return null;
//     }
//   };

//   const token = localStorage.getItem("token");
//   const isAuthenticated = token ? true : false;
//   const decodedToken = token ? decodeToken(token) : null;
//   const username = decodedToken ? decodedToken.username : "";

//   const handleSignOut = () => {
//     localStorage.removeItem("token");
//     window.location.reload();
//   };

//   // Check if token is expired
//   if (token && decodedToken) {
//     const currentTime = Math.floor(Date.now() / 1000); // Convert to seconds
//     if (currentTime > decodedToken.exp) {
//       localStorage.removeItem("token");
//       return <Link to="/" />;
//     }
//   }

//   return (
//     <div className="homepage">
//       <NavbarComp /> {/* Add the Navbar component here */}
//       {/* Rest of the JSX code for the homepage */}
//     </div>
//   );
// };

// export default HomePage;
