const express = require('express')
const app = express()
const auth = require('./src/auth')
require('dotenv').config();

const bodyParser = require('body-parser');
const expressSession = require('express-session')({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSession);




//  Use auth routes  
auth(app);

const port = 3000
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})