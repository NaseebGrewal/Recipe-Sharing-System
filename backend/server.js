// Import the required modules
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dbClient = require('./dbconfig'); // Path to your database connection file
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());
app.options("*", cors());
// Check if the users table exists, and create it if it doesn't
dbClient
  .query('SELECT 1 FROM users LIMIT 1')
  .catch(() => {
    const createUsersTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        age INT NOT NULL,
        password VARCHAR(255) NOT NULL
      );
    `;
    return dbClient.query(createUsersTableQuery);
  })
  .then(() => {
    // Route to handle the GET request at the root
    app.get('/', (req, res) => {
      res.send('GET request received');
    });

  // Route to fetch recipe data
  app.get('/recipes', (req, res) => {
    const categories = ['Chicken','Fish','Vegetarian','Pasta', 'Vegan','Vegetable','Spring'];
    const categoryData = [];
    
    const fetchRecipeData = async (category) => {
      const keywordResult = await dbClient.query('SELECT recipe_id FROM recipe_keywords WHERE keyword ILIKE $1', [category]);
      const recipeIds = keywordResult.rows.map((row) => row.recipe_id);
    
      if (recipeIds.length > 0) {
        const recipeResult = await dbClient.query('SELECT id, name, imageurl FROM recipe_details WHERE id = ANY($1::int[])', [recipeIds]);
        const recipes = recipeResult.rows;
        categoryData.push({ category, recipes });
      }
    };

    const fetchCategoryData = async () => {
      for (const category of categories) {
        await fetchRecipeData(category);
      }
      res.json(categoryData);
    };

    fetchCategoryData().catch((error) => {
      console.error('Error fetching recipe data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
  });



// Check if the emailpassword table exists, and create it if it doesn't
dbClient
  .query('SELECT 1 FROM emailpassword LIMIT 1')
  .catch(() => {
    const createEmailPasswordTableQuery = `
      CREATE TABLE IF NOT EXISTS emailpassword (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        password TEXT NOT NULL
      );
    `;
    return dbClient.query(createEmailPasswordTableQuery);
  })
  .catch((error) => {
    console.error('Error creating emailpassword table:', error);
    process.exit(1);
  });



// Route to check if a username exists
app.get('/checkUsername', (req, res) => {
  const { username } = req.query;

  const findUserQuery = `
    SELECT * FROM users WHERE username = $1;
  `;

  dbClient
    .query(findUserQuery, [username])
    .then(result => {
      const exists = result.rows.length > 0;
      if (exists) { res.json({ exists });
    }
    else {
      res.json({ exists });
    }
      
    })
    .catch(error => {
      console.error('Error finding user:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    });
});




// Route to check if an email exists
app.get('/checkEmail', (req, res) => {
  const { email } = req.query;

  const findEmailQuery = `
    SELECT * FROM users WHERE email = $1;
  `;

  dbClient
    .query(findEmailQuery, [email])
    .then(result => {
      const exists = result.rows.length > 0;
      res.json({ exists });
    })
    .catch(error => {
      console.error('Error finding email:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    });
});








// Route to handle user registration
app.post('/register', (req, res) => {
  const { username, email, age, password } = req.body;

  const insertUserQuery = `
    INSERT INTO users (username, email, age, password)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      dbClient
        .query(insertUserQuery, [username, email, age, hashedPassword])
        .then((result) => {
          const user = result.rows[0];


          // Create a JWT token for the registered user
          const token = jwt.sign({ userId: user.id }, 'your-secret-key', { expiresIn: '1h' });

          res.json({ message: 'User registered successfully', user, token });

          // Store email and hashed password in emailpassword table
          dbClient
            .query('INSERT INTO emailpassword (email, password) VALUES ($1, $2)', [email, password])
            .catch((error) => {
              console.error('Error inserting email and password:', error);
            });
        }).catch((error) => {
          console.error('Error inserting user:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        });
    }
  });
});


// Route to handle user login 
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const findUserQuery = `
    SELECT * FROM users WHERE email = $1;
  `;

  dbClient
    .query(findUserQuery, [email])
    .then((result) => {
      const user = result.rows[0];
      if (!user) {
        // User not found
        res.json({ success: false, message: 'User not found' });
      } else {
        // User found, check password
        bcrypt.compare(password, user.password, (err, passwordMatch) => {
          if (err) {
            console.error('Error comparing passwords:', err);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
          } else {
            if (passwordMatch) {

              // Create a JWT token for the logged-in user
            const token = jwt.sign({ userId: user.id }, 'your-secret-key', { expiresIn: '24h' });

              // Password matches
              res.json({ success: true, message: 'Login successful', user, token });
            } else {
              // Incorrect password
              res.json({ success: false, message: 'Incorrect password' });
            }
          }
        });
      }
    })
    .catch((error) => {
      console.error('Error finding user:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    });
});


app.get('/authenticate', (req, res) => {
  const token = req.headers.authorization;
  const modifiedToken = token.replace("Bearer ", "");

  jwt.verify(modifiedToken, 'your-secret-key', (error, decoded) => {
    if (error) {
      console.error('Token verification error:', error);
      res.status(401).json({ success: false, message: 'Token verification failed' });
      return;
    }

    const userId = decoded.userId;
    console.log(userId);

    // Retrieve the ID from the previous response
    const authorId = req.headers['x-id'];
    console.log(authorId);

    // Perform a database query to check if the userId matches the authorId
    dbClient.query('SELECT * FROM users WHERE id = $1 AND author_id = $2', [userId, authorId], (err, result) => {
      if (err) {
        console.error('Database query error:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
        return;
      }

      if (result.rows.length === 0) {
        console.log('User not found');
        res.status(401).json({ success: false, username: userId, message: 'User not authorized' });
        return;
      }

      // User is authorized
      console.log('User is authorized');
      res.json({ success: true });
    });
  });
});


// new code between implemented Harshita's routes here ------------------------------------------------------------------------------------------------------------------------------------------------------------------


// Define the route for retrieving recipe data
app.get('/api/recipedetails/:id', (req, res) => {
  const recipeId = req.params.id; 

  // SQL query to retrieve recipe data
  const sqlQuery = 'SELECT recipe_details.*, recipe_author.id, recipe_author.author FROM recipe_details JOIN recipe_author ON recipe_details.id = recipe_author.id WHERE recipe_details.id = $1;'
  dbClient.query(sqlQuery, [recipeId], (err, results) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).json({ error: 'An error occurred' });
      return;
    }

    // Format and return the retrieved data
    const recipeData = results.rows[0]; // Assuming only one recipe with the given ID
    res.json(recipeData);
  });
});

app.get('/users/:id', async (req, res) => {
  try {
    const authorId = req.params.id;

    // Check if the authorId is a valid integer
    if (!Number.isInteger(parseInt(authorId))) {
      res.status(400).json({ error: 'Invalid user ID' });
      return;
    }

    const sqlQuery = 'SELECT * FROM recipe_author WHERE author_id = $1;';
    const values = [authorId];

    dbClient.query(sqlQuery, values, (err, results) => {
      if (err) {
        console.error('Error executing SQL query:', err);
        res.status(500).json({ error: 'An error occurred' });
        return;
      }

      // Check if the user exists
      if (results.rows.length === 0) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      // Format and return the retrieved data
      const userData = results.rows[0];
      res.json(userData);
    });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Define an endpoint to create a new user
app.post('/createusers', async (req, res) => {
  const { author, email, aboutme } = req.body;

  try {
    const query = 'INSERT INTO recipe_author (author, email, aboutme) VALUES ($1, $2, $3) RETURNING *';
    const values = [author, email, aboutme];

    const result = await dbClient.query(query, values);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating user:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Define an endpoint to update a users
app.put('/users/:id', async (req, res) => {
  const id = req.params.id;
  const { author, email, aboutme } = req.body;

  try {
    const query = 'UPDATE recipe_author SET author = $1, email = $2, aboutme = $3 WHERE id = $4 RETURNING *';
    const values = [author, email, aboutme, id];

    const result = await dbClient.query(query, values);

    if (result.rowCount === 0) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.status(200).json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error updating user:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/recipelist/:id', async (req, res) => {
  try {
    const authorId = req.params.id;

    // Check if the authorId is a valid integer
    if (!Number.isInteger(parseInt(authorId))) {
      res.status(400).json({ error: 'Invalid author ID' });
      return;
    }

    // SQL query to retrieve recipe data
    const sqlQuery =
      'SELECT DISTINCT rd.*, ra.author FROM recipe_details rd JOIN recipe_author ra ON rd.author_id = ra.author_id WHERE ra.author_id = $1 ORDER BY rd.name ASC;';
    const results = await dbClient.query(sqlQuery, [authorId]);

    // Format and return the retrieved data
    const recipeData = results.rows;
    res.json(recipeData);
  } catch (error) {
    console.error('Error executing SQL query:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// created new route to send username from the userid obtained by decoding token

// Route to fetch username based on userId
app.get('/users/:id/username', (req, res) => {
  const userId = req.params.id;

  const findUsernameQuery = `
    SELECT username FROM users WHERE id = $1;
  `;

  dbClient
    .query(findUsernameQuery, [userId])
    .then((result) => {
      if (result.rows.length > 0) {
        const username = result.rows[0].username;
        res.json({ username });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    })
    .catch((error) => {
      console.error('Error finding username:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});
// ------------------------------------------------------------------------------------------

// Define the route for retrieving recipe data
app.get('/api/recipedetails/:id', (req, res) => {
  const recipeId = req.params.id;

  // SQL query to retrieve recipe data
  const sqlQuery =
    'SELECT recipe_details.*, recipe_author.id, recipe_author.author FROM recipe_details JOIN recipe_author ON recipe_details.id = recipe_author.id WHERE recipe_details.id = $1;';
  dbClient.query(sqlQuery, [recipeId], (err, results) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).json({ error: 'An error occurred' });
      return;
    }

    // Format and return the retrieved data
    const recipeData = results.rows[0]; // Assuming only one recipe with the given ID
    res.json(recipeData);
  });
});

// Define the route for retrieving recipe instructions data
app.get('/api/recipeinstructions/:id', (req, res) => {
  const recipeId = req.params.id;

  const sqlQuery = 'SELECT step, recipeinstructions FROM recipe_instructions WHERE recipe_id = $1';
  dbClient.query(sqlQuery, [recipeId], (err, results) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).json({ error: 'An error occurred' });
      return;
    }

    // Format and return the retrieved data
    const recipeInstructions = results.rows;
    res.json(recipeInstructions);
  });
});

// Define the route for retrieving recipe ingredients data
app.get('/api/recipeingredients/:id', (req, res) => {
  const recipeId = req.params.id;

  // Construct the SQL query to retrieve recipe data
  const sqlQuery = 'SELECT ingredient FROM recipe_ingredients WHERE recipe_id = $1';
  dbClient.query(sqlQuery, [recipeId], (err, results) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).json({ error: 'An error occurred' });
      return;
    }

    // Format and return the retrieved data
    const recipeIngredients = results.rows;
    res.json(recipeIngredients);
  });
});

// Define the route for retrieving recipe nutrition data
app.get('/api/recipenutrition/:id', (req, res) => {
  const recipeId = req.params.id;

  // Construct the SQL query to retrieve recipe data
  const sqlQuery = 'SELECT calories, fat, carbs, fiber, sugar, protein FROM recipe_nutrition WHERE id = $1';
  dbClient.query(sqlQuery, [recipeId], (err, results) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).json({ error: 'An error occurred' });
      return;
    }

    // Format and return the retrieved data
    const recipeNutrition = results.rows;
    res.json(recipeNutrition);
  });
});

// Define the route for retrieving recipe servings, cooktime data
app.get('/api/recipecookdetails/:id', (req, res) => {
  const recipeId = req.params.id;

  // Construct the SQL query to retrieve recipe data
  const sqlQuery =
    'SELECT recipe_details.id, recipe_details.servings, recipe_time.cook_time FROM recipe_details INNER JOIN recipe_time ON recipe_details.id = recipe_time.recipe_id WHERE recipe_details.id = $1;';
  dbClient.query(sqlQuery, [recipeId], (err, results) => {
    if (err) {
      console.error('Error executing SQL query:', err);
      res.status(500).json({ error: 'An error occurred' });
      return;
    }

    // Format and return the retrieved data
    const cookDetails = results.rows;
    res.json(cookDetails);
  });
});


// new code between  ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//Sumathhi

// //Import Routes
// const receipeSearch = require('./routes/receipeSearch');
// //Route Middlewares
// app.use('/api', receipeSearch);

app.post('/api/search', async (req, res) => {
  try {
    const { searchTerm } = req.body;

    // Search in recipe_author table
    const authorResultsQuery = `SELECT distinct recipe_details.*, recipe_time.cook_time
                                FROM recipe_details
                                INNER JOIN recipe_author ON recipe_details.author_id = recipe_author.author_id 
                                INNER JOIN recipe_time ON recipe_details.id = recipe_time.recipe_id
                                WHERE recipe_author.author ILIKE $1;`;
    const authorResults = await dbClient.query(authorResultsQuery, [`%${searchTerm}%`]);

    // Search in recipe_details table
    const recipeResultsQuery = 'SELECT distinct recipe_details.*, recipe_time.cook_time FROM recipe_details INNER JOIN recipe_time ON recipe_details.id = recipe_time.recipe_id WHERE name ILIKE $1;';
    const recipeResults = await dbClient.query(recipeResultsQuery, [`%${searchTerm}%`]);

    // Search in recipe_ingredients table
    const keywordResultsQuery =  `SELECT distinct recipe_details.*, recipe_time.cook_time
                                  FROM recipe_details
                                  INNER JOIN recipe_keywords ON recipe_details.id = recipe_keywords.recipe_id 
                                  INNER JOIN recipe_time ON recipe_details.id = recipe_time.recipe_id
                                  WHERE recipe_keywords.keyword ILIKE $1;`;
    const keywordResults = await dbClient.query(keywordResultsQuery, [`%${searchTerm}%`]);

    // Create a combined result object
    const combinedResults = {
      authorResults: authorResults.rows,
      recipeResults: recipeResults.rows,
      keywordResults: keywordResults.rows,
    };

    res.json(combinedResults);
  } catch (error) {
    console.error('Error searching recipes:', error.message);
    res.status(500).json({ error: 'Error searching recipes' });
  }
});

// Preethi

app.post('/AddRecipe', async (req,res) => {
  try{
      console.log("Hit- 1");
      var recipeID = -1;
      const { name, 
              description, 
              ingredientlist, 
              imageurl, 
              servings, 
              cooking_time, 
              instructionlist, 
              nutritions, 
              authorID } = req.body;

      //console.log(nutritions.calories);

      //Check Name already exists or not
      let result1 = await dbClient.query("select * from recipe_details where name = $1", [name]);

      if(result1.rows.length){
          res.send("Recipe Name Already Exists!!!");
      }
      else{
          //Get Latest Id value
          //var newIdValue = await getTopCount();
          //newIdValue = newIdValue + 1;

          //Inserting new recipe details
          var recipeReults = await dbClient.query("INSERT INTO recipe_details (name, description, imageurl, servings, author_id) VALUES ($1, $2, $3, $4, $5) RETURNING id", 
              [name, description, imageurl, servings, authorID]);

          recipeID = parseInt(recipeReults.rows[0].id);
          //console.log('RecipeID -- ' + recipeID);
          
          //After Getting Recipe ID, allowing to insert child tables
          if(recipeID > 0)
          {
              //Inserting Recipe Ingredients
              if(ingredientlist.length > 0){
                  ingredientlist.forEach(element => {
                      //console.log("recipeID : " + recipeID + ", ingre - " + element);
                      var resultIng = dbClient.query("INSERT INTO recipe_ingredients (recipe_id, ingredient) VALUES ($1, $2) returning id", [recipeID, element]);
                      //console.log("Ingredient Id - " + resultIng);
                  });
              }

              //Inerting Recipe Cooking time
              var resultCooktime = dbClient.query("INSERT INTO recipe_time (recipe_id, cook_time) VALUES ($1, $2) returning id", [recipeID, cooking_time]);

              //Inerting Recipe Instruction Steps
              if(instructionlist.length > 0){
                  var stepCount = 0;
                  instructionlist.forEach(item =>{
                      stepCount++;
                      var resultInstructions = dbClient.query("INSERT INTO recipe_instructions (recipe_id, step, recipeinstructions) VALUES ($1, $2, $3) returning id", [recipeID, stepCount, item]);
                  });
              }

              //Inserting Recipe Nutritions
              var resultNutrition = dbClient.query("INSERT INTO recipe_nutrition (recipe_id, calories, fat, carbs, protein, sugar, fiber) values ($1,$2,$3,$4,$5,$6,$7) returning id", 
                  [recipeID, nutritions.calories, nutritions.fat, nutritions.carbs, nutritions.protein, nutritions.sugar, nutritions.fiber]);

          }
          res.status(200).json(recipeID);
      }
  } catch (err) {
      console.log(err.message); 
      return res.status(403).json(err + ": You are not authorized");
  }
});


//

    // Start the server
    const port = 5000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error creating users table:', error);
    process.exit(1);
  });




// code without jwt below

// // Import the required modules
// const express = require('express');
// const app = express();
// const bodyParser = require('body-parser');
// const path = require('path');
// const dbClient = require('./dbconfig'); // Path to your database connection file
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
// // Middleware
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// const cors = require('cors');
// app.use(cors());

// // Check if the users table exists, and create it if it doesn't
// dbClient
//   .query('SELECT 1 FROM users LIMIT 1')
//   .catch(() => {
//     const createUsersTableQuery = `
//       CREATE TABLE IF NOT EXISTS users (
//         id SERIAL PRIMARY KEY,
//         username VARCHAR(255) NOT NULL,
//         email VARCHAR(255) NOT NULL,
//         age INT NOT NULL,
//         password VARCHAR(255) NOT NULL
//       );
//     `;
//     return dbClient.query(createUsersTableQuery);
//   })
//   .then(() => {
//     // Route to handle the GET request at the root
//     app.get('/', (req, res) => {
//       res.send('GET request received');
//     });


//   // Route to fetch recipe data
//   app.get('/recipes', (req, res) => {
//     const categories = ['Chicken','Fish','Vegetarian','Pasta', 'Vegan','Vegetable','Spring'];
//     const categoryData = [];
    
//     const fetchRecipeData = async (category) => {
//       const keywordResult = await dbClient.query('SELECT recipe_id FROM recipe_keywords WHERE keyword ILIKE $1', [category]);
//       const recipeIds = keywordResult.rows.map((row) => row.recipe_id);
    
//       if (recipeIds.length > 0) {
//         const recipeResult = await dbClient.query('SELECT id, name, imageurl FROM recipe_details WHERE id = ANY($1::int[])', [recipeIds]);
//         const recipes = recipeResult.rows;
//         categoryData.push({ category, recipes });
//       }
//     };

//     const fetchCategoryData = async () => {
//       for (const category of categories) {
//         await fetchRecipeData(category);
//       }
//       res.json(categoryData);
//     };

//     fetchCategoryData().catch((error) => {
//       console.error('Error fetching recipe data:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     });
//   });



// // Check if the emailpassword table exists, and create it if it doesn't
// dbClient
//   .query('SELECT 1 FROM emailpassword LIMIT 1')
//   .catch(() => {
//     const createEmailPasswordTableQuery = `
//       CREATE TABLE IF NOT EXISTS emailpassword (
//         id SERIAL PRIMARY KEY,
//         email VARCHAR(255) NOT NULL,
//         password TEXT NOT NULL
//       );
//     `;
//     return dbClient.query(createEmailPasswordTableQuery);
//   })
//   .catch((error) => {
//     console.error('Error creating emailpassword table:', error);
//     process.exit(1);
//   });



// // Route to check if a username exists
// app.get('/checkUsername', (req, res) => {
//   const { username } = req.query;

//   const findUserQuery = `
//     SELECT * FROM users WHERE username = $1;
//   `;

//   dbClient
//     .query(findUserQuery, [username])
//     .then(result => {
//       const exists = result.rows.length > 0;
//       if (exists) { res.json({ exists });
//     }
//     else {
//       res.json({ exists });
//     }
      
//     })
//     .catch(error => {
//       console.error('Error finding user:', error);
//       res.status(500).json({ success: false, message: 'Internal Server Error' });
//     });
// });




// // Route to check if an email exists
// app.get('/checkEmail', (req, res) => {
//   const { email } = req.query;

//   const findEmailQuery = `
//     SELECT * FROM users WHERE email = $1;
//   `;

//   dbClient
//     .query(findEmailQuery, [email])
//     .then(result => {
//       const exists = result.rows.length > 0;
//       res.json({ exists });
//     })
//     .catch(error => {
//       console.error('Error finding email:', error);
//       res.status(500).json({ success: false, message: 'Internal Server Error' });
//     });
// });








// // Route to handle user registration
// app.post('/register', (req, res) => {
//   const { username, email, age, password } = req.body;

//   const insertUserQuery = `
//     INSERT INTO users (username, email, age, password)
//     VALUES ($1, $2, $3, $4)
//     RETURNING *;
//   `;

//   bcrypt.hash(password, 10, (err, hashedPassword) => {
//     if (err) {
//       console.error('Error hashing password:', err);
//       res.status(500).json({ error: 'Internal Server Error' });
//     } else {
//       dbClient
//         .query(insertUserQuery, [username, email, age, hashedPassword])
//         .then((result) => {
//           const user = result.rows[0];
//           res.json({ message: 'User registered successfully', user });

//           // Store email and hashed password in emailpassword table
//           dbClient
//             .query('INSERT INTO emailpassword (email, password) VALUES ($1, $2)', [email, password])
//             .catch((error) => {
//               console.error('Error inserting email and password:', error);
//             });
//         }).catch((error) => {
//           console.error('Error inserting user:', error);
//           res.status(500).json({ error: 'Internal Server Error' });
//         });
//     }
//   });
// });







// // Route to handle user login 
// app.post('/login', (req, res) => {
//   const { email, password } = req.body;

//   const findUserQuery = `
//     SELECT * FROM users WHERE email = $1;
//   `;

//   dbClient
//     .query(findUserQuery, [email])
//     .then((result) => {
//       const user = result.rows[0];
//       if (!user) {
//         // User not found
//         res.json({ success: false, message: 'User not found' });
//       } else {
//         // User found, check password
//         bcrypt.compare(password, user.password, (err, passwordMatch) => {
//           if (err) {
//             console.error('Error comparing passwords:', err);
//             res.status(500).json({ success: false, message: 'Internal Server Error' });
//           } else {
//             if (passwordMatch) {
//               // Password matches
//               res.json({ success: true, message: 'Login successful' });
//             } else {
//               // Incorrect password
//               res.json({ success: false, message: 'Incorrect password' });
//             }
//           }
//         });
//       }
//     })
//     .catch((error) => {
//       console.error('Error finding user:', error);
//       res.status(500).json({ success: false, message: 'Internal Server Error' });
//     });
// });



//     // Start the server
//     const port = 5000;
//     app.listen(port, () => {
//       console.log(`Server is running on port ${port}`);
//     });
//   })
//   .catch((error) => {
//     console.error('Error creating users table:', error);
//     process.exit(1);
//   });

