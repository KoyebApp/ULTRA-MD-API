var __path = process.cwd(),
    monk = require('monk'),
    { color } = require(__path + '/lib/color.js')

// Replace the URL with your database connection string
var url = 'mongodb+srv://mohsin:mohsin@cluster0.iauaztt.mongodb.net/?retryWrites=true&w=majority';

try {
  if (!url) throw console.log(color('Check database configuration, var url has not been set', 'red'));
} catch (e) {
  return;
}

var db = monk(url);

db.then(() => {
  console.log(color('Connected correctly to the database server', 'green'))
})
.catch((e) => {
  console.log(color('Error: ' + e + '\n\nFailed to connect to database. \nCheck if the database connection URL is correct', 'red'))
})

module.exports = db;
