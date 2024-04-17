import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegistrationPage from './components/RegistrationPage';
import LoginPage from './components/LoginPage';
import HomePage from './pages/HomePage';
import Userprofilepage from "./components/Userprofilepage";
import RecipePage from "./pages/RecipePage"
import ReceipeSearch from './components/receipeSearch';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarComp from './components/NavbarComp';
import AddRecipe from './components/AddRecipe';

const App = () => {
  return (
    <div>
      <NavbarComp />
      <div>
        <Router>
          <Routes>
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/userProfile/:id" element={<Userprofilepage />} />
            <Route path="/recipe/:id" element={<RecipePage />} />
            <Route path="/Search" element={<ReceipeSearch />} />
            <Route path="/addrecipe" element={ <AddRecipe /> } />
          </Routes>
        </Router>
      </div>
    </div>


  );
};

export default App;
