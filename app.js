const express = require('express')
require('dotenv').config();
const app = express()
const auth = require('./src/auth')
const bodyParser = require('body-parser');
const expressSession = require('express-session')({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSession);

const TaskRouter = require('./src/routes/taskRoutes');
app.use('/tasks', TaskRouter);


//  Use auth routes  
auth(app);

const port = 3000
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})