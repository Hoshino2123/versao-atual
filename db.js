const express = require('express');
mysql = require('mysql2');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const cors = require('cors');

const app = express();
app.use(cors({
  origin: '*'
}));
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'yoasobi',
  database: 'onevent',
  port: 3306,
});

// Establish the database connection
db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    process.exit(1); // Exit the process if the connection fails
  }
});

app.use(express.json()); // Add this to parse JSON requests

// Define a function to sanitize user input
function sanitizeInput(input) {
  return input.trim().replace(/[^a-zA-Z0-9]/g, ''); // Remove special characters and trim the input
}

app.post('/api/signup', (req, res) => {
  console.log(req.body) 
  const { email, password, username,  } = req.body;

  
  let sanitizedUsername = sanitizeInput(username)
  let sanitizedEmail = sanitizeInput(email)
  let sanitizedPassword = sanitizeInput(password)

  // Validate email format
  
  // Hash the password
  bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password:', err);
      return res.status(500).send({ message: 'Error creating user' });
    }

    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(query, [ sanitizedUsername, sanitizedEmail, hashedPassword], (err, results) => {
      if (err) {
        console.error('Error creating user:', err);
        return res.status(500).send({ message: 'Error creating user' });
      }

      res.send({ message: 'User created successfully' });
    });
  });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  process.exit(1); // Exit the process if an uncaught exception occurs
});