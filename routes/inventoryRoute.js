// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")

// Route to build inventory management view
router.get("/", utilities.handleErrors(invController.buildManagementView));// the / is /inv/ from the url

// Route to build add classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));

//Route to build add inventory
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));

// Route to trigger intentional 500 error for testing
router.get("/trigger-error", utilities.handleErrors(invController.triggerError));

// Route to build inventory by classification view (DEBE IR DESPUÉS de las rutas estáticas)
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory detail view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId));

// Route to process add classification
router.post("/add-classification", 
  invValidate.addClassificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification));

//Route to build add inventory
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));

// Route to process add inventory
router.post("/add-inventory", 
  invValidate.addInventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory));

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to build edit inventory view
router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventoryView));

// Route to update inventory
router.post("/update/", 
  invValidate.addInventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory))

module.exports = router;