const utilities = require("../utilities/")

const baseController = {}

baseController.buildHome = async function(req, res, next) {
  const nav = await utilities.getNav()
  req.flash("This is a flash message.")
  res.render("index", {
    title: "Home", 
    nav
  })
}

module.exports = baseController