# Recipe-Sharing-System

Welcome to **Recipe-Sharing-System**, a full-stack application built with Node.js and React.js where users can contribute their favorite recipes and become members of a vibrant cooking community! Whether you're a seasoned chef or a cooking enthusiast, this platform allows you to share and discover delicious recipes from around the world.

## Features

- **Recipe Sharing**: Users can submit their own recipes, including ingredients, preparation steps, and an image to showcase their dish.
- **Member Registration**: Users can create an account to become a member, allowing them to save their favorite recipes, leave comments, and follow other chefs.
- **User Authentication**: Secure sign-up and login process using JWT (JSON Web Tokens) for safe access and account management.
- **Search & Filter**: Easily search and filter recipes by ingredients, cuisine, difficulty level, or recipe name.
- **Comment & Rating**: Users can comment on and rate recipes to give feedback and help others discover the best dishes.
- **Responsive Design**: Fully responsive user interface built with React.js to ensure a great experience on both desktop and mobile devices.

## Tech Stack

- **Frontend**:
  - React.js
  - HTML, CSS, JavaScript
  - React Router (for page navigation)
  - Axios (for API requests)

- **Backend**:
  - Node.js
  - Express.js
  - MongoDB (Database)
  - JWT Authentication
  - Mongoose (ODM)

- **Deployment**:
  - Heroku (Backend)
  - Netlify or Vercel (Frontend)

## Getting Started

To run the **Recipe-Sharing-System** locally on your machine, follow these steps:

### Prerequisites

Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/Recipe-Sharing-System.git
    cd Recipe-Sharing-System
    ```

2. **Install dependencies for the backend**:
    ```bash
    cd backend
    npm install
    ```

3. **Install dependencies for the frontend**:
    ```bash
    cd frontend
    npm install
    ```

4. **Setup the environment**:
    - Create a `.env` file in the `backend` directory and configure your MongoDB URI and JWT secret:
      ```txt
      MONGODB_URI=mongodb://localhost:27017/recipe-sharing
      JWT_SECRET=your_jwt_secret
      ```

5. **Run the application**:
    - Start the backend server:
      ```bash
      cd backend
      npm start
      ```

    - Start the frontend React app:
      ```bash
      cd frontend
      npm start
      ```

6. **Visit the app**:
    - Open your browser and go to [http://localhost:3000](http://localhost:3000) to see the frontend.
    - The backend will be running on [http://localhost:5000](http://localhost:5000).

### Optional: Deploying the App

- **Backend**: You can deploy the backend to Heroku by following [this guide](https://devcenter.heroku.com/articles/git).
- **Frontend**: You can deploy the frontend on platforms like [Netlify](https://www.netlify.com/) or [Vercel](https://vercel.com/).

## Contributing

We welcome contributions! Here’s how you can contribute to the **Recipe-Sharing-System**:

1. Fork this repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to your branch (`git push origin feature-name`).
6. Open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

If you have any questions or feedback, feel free to open an issue on GitHub or contact me directly at [my email](mailto:your-email@example.com).

Happy cooking! 🍳🍲🥗
