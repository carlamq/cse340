const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
  *  add classification validation rules
  * ********************************* */
validate.addClassificationRules = () => {
  return [
    //classification_name is required and must not contain spaces or special characters
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a classification name.")
      .matches(/^[a-zA-Z0-9]+$/)
      .withMessage("Classification name must not contain spaces or special characters."),
  ]
}

/*  **********************************
  *  add inventory validation rules
  * ********************************* */
validate.addInventoryRules = () => {
  return [
    //classification_id is required
    body("classification_id")
      .trim()
      .escape()
      .notEmpty()
      .isInt({ min: 1 })
      .withMessage("Please select a valid classification."),

    //inv_make is required
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a vehicle make."),

    //inv_model is required
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a vehicle model."),

    //inv_year is required and must be a 4-digit year
    body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 4, max: 4 })
      .withMessage("Year must be 4 digits.")
      .matches(/^[0-9]{4}$/)
      .withMessage("Year must contain only numbers.")
      .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
      .withMessage(`Year must be between 1900 and ${new Date().getFullYear() + 1}.`),

    //inv_description is required
    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a vehicle description."),

    //inv_image is required
    body("inv_image")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide an image path."),

    //inv_thumbnail is required
    body("inv_thumbnail")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a thumbnail path."),

    //inv_price is required and must be a positive number
    body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number."),

    //inv_miles is required and must be a positive number
    body("inv_miles")
      .trim()
      .escape()
      .notEmpty()
      .isInt({ min: 0 })
      .withMessage("Miles must be a positive number."),

    //inv_color is required
    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a vehicle color."),
  ]
}

/* ******************************
 * Check data and return errors or continue to add classification
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}

/* ******************************
 * Check data and return errors or continue to add inventory
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
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
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(classification_id)
    res.render("inventory/add-inventory", {
      errors,
      title: "Add New Vehicle",
      nav,
      classificationList,
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
    })
    return
  }
  next()
}

/* ******************************
 * Check data and return errors or continue to update inventory
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const { 
    inv_id,
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
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    res.render("inventory/edit-inventory", {
      errors,
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationList,
      classification_id,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
    })
    return
  }
  next()
}

module.exports = validate