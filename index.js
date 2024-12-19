const express = require('express');
const cors = require('cors');
const favicon = require('serve-favicon');
const secure = require('ssl-express-www');
const path = require('path');
const { color } = require('./lib/color.js');

const mainrouter = require('./routes/main');
const apirouter = require('./routes/api');

const PORT = process.env.PORT || 8080 || 5000 || 3000;

const app = express();

// Middleware setup
app.enable('trust proxy');
app.set("json spaces", 2);
app.use(cors());
app.use(secure);

// Serve favicon
app.use(favicon(path.join(__dirname, 'views', 'favicon.ico')));

// Static files from the "public" directory
app.use(express.static("public"));

// Route setup
app.use('/', mainrouter);
app.use('/api', apirouter);

// Serve the index.html page when the root route is accessed
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Serve the docs.html page when "/docs" route is accessed
app.get('/docs', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'docs.html'));
});

// Custom 404 Error Handler
app.use((req, res) => {
  res.status(404)
     .set("Content-Type", "text/html")
     .sendFile(path.join(__dirname, 'views', '404.html')); // Ensure correct path to 404.html
});

// Start the server
app.listen(PORT, () => {
  console.log(color(`Server running on port ${PORT}`, 'green'));
});

module.exports = app;
