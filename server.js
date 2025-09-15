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
//index route
app.get("/", function (req, res) {
  res.render("index", { title: "Home" })
})
/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

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
