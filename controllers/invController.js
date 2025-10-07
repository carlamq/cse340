// Inventory controller
// Handles requests for vehicle listings and details

const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {} //this is a object to save all the functions

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  
  // Verificar si hay datos
  if (!data || data.length === 0) {
    // Si no hay vehículos, redirigir a home con un mensaje
    return res.redirect("/")
  }
  
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}
/* ***************************
 *  Build inventory item detail view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getInventoryByInvId(inv_id)
  const grid = await utilities.buildDetailGrid(data)
  let nav = await utilities.getNav()
  const vehicleName = `${data.rows[0].inv_make} ${data.rows[0].inv_model}`
  res.render("./inventory/detail", {
    title: vehicleName,
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory management view
 * ************************** */
async function buildManagementView(req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Trigger intentional error for testing
 * ************************** */
invCont.triggerError = async function (req, res, next) {
  // Intentionally throw an error to test error handling
  throw new Error("This is an intentional 500 error for testing purposes!")
}

/* ***************************
 *  Build add classification view
 * ************************** */
async function buildAddClassification(req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Process Add Classification
 * ************************** */
async function addClassification(req, res) {
  const { classification_name } = req.body
  
  const addResult = await invModel.addClassification(classification_name)
  
  if (addResult) {
    req.flash(
      "notice",
      `The ${classification_name} classification was successfully added.`
    )
    let nav = await utilities.getNav() //redo the navi whith the new classification
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Add New Classification",
      nav: await utilities.getNav(),
    })
  }
}

/* ***************************
 *  Build add inventory view
 * ************************** */
async function buildAddInventory(req, res, next) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()
  res.render("inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    classificationList,
    errors: null,
  })
}

/* ***************************
 *  Process Add Inventory
 * ************************** */
async function addInventory(req, res) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()
  
  const { 
    classification_id, 
    inv_make, 
    inv_model, 
    inv_year, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_miles, 
    inv_color 
  } = req.body
  
  const addResult = await invModel.addInventory(
    classification_id, 
    inv_make, 
    inv_model, 
    inv_year, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_miles, 
    inv_color
  )
  
  if (addResult) {
    req.flash(
      "notice",
      `The ${inv_make} ${inv_model} was successfully added.`
    )
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      errors: null,
    })
  }
}


invCont.buildManagementView = buildManagementView
invCont.buildAddClassification = buildAddClassification
invCont.addClassification = addClassification
invCont.buildAddInventory = buildAddInventory
invCont.addInventory = addInventory

module.exports = invCont