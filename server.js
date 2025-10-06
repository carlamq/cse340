/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const utilities = require("./utilities/")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const session = require("express-session")
const pool = require('./database/')
const accountRoute = require("./routes/accountRoute")
const bodyParser = require("body-parser")

/* ***********************
 * Middleware
 * ************************/
 app.use(session({ //app.use() applies whatever is being invoked throughout the entire application.
  store: new (require('connect-pg-simple')(session))({//creating a new session table in our PostgreSQL database using the "connect-pg-simple" package
    createTableIfMissing: true,//tells the session to create a "session" table in the database if it does not already exist.
    pool,
  }),
  secret: process.env.SESSION_SECRET,//indicates a "secret" name - value pair that will be used to protect the session. will be in .env
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
 }))
// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************////Notice that instead of router.use, it is now app.use, meaning that the application itself will use this resource.
app.use(static)
// Index route
app.get("/", utilities.handleErrors(baseController.buildHome))

// Inventory routes
app.use("/inv", inventoryRoute)

// Inventory routes
app.use("/inv", inventoryRoute)

// Account routes  
app.use("/account", accountRoute)

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message: err.message,
    nav
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT || 5500
const host = process.env.HOST || 'localhost'

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})


//ROUTES EXPLANATION
//app.get - The express application will watch the "get" object, within the HTTP Request, for a particular route.
//"/" - This is route being watched. It indicates the base route of the application or the route which has no specific resource requested.
//function(req, res){ - A JavaScript function that takes the request and response objects as parameters.
//res.render() - The "res" is the response object, while "render()" is an Express function that will retrieve the specified view - "index" - to be sent back to the browser.
//{title: "Home" } - The curly braces are an object (treated like a variable), which holds a name - value pair. This object supplies the value that the "head" partial file expects to receive. The object is passed to the view.
//}) - The right curly brace closes the function, while the right parentheses closes the "get" route

