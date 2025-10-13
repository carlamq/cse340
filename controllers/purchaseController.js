const utilities = require("../utilities/")
const invModel = require("../models/inventory-model")
const orderModel = require("../models/order-model")

const purchaseController = {}

/* ****************************************
*  Show Purchase Form
* *************************************** */
async function showPurchaseForm(req, res, next) {
  let nav = await utilities.getNav()
  const inv_id = parseInt(req.params.inv_id)
  
  // Get vehicle information
  const vehicleData = await invModel.getInventoryByInvId(inv_id)
  
  if (!vehicleData) {
    req.flash("notice", "Vehicle not found.")
    res.redirect("/")
    return
  }

  const vehicleName = `${vehicleData.inv_make} ${vehicleData.inv_model}`
  
  res.render("purchase/purchase-form", {
    title: `Purchase ${vehicleName}`,
    nav,
    vehicleData,
    errors: null
  })
}

/* ****************************************
*  Process Purchase
* ****************************************/
async function processPurchase(req, res, next) {
  let nav = await utilities.getNav()
  const { inv_id, delivery_address } = req.body
  const account_id = res.locals.accountData.account_id

  // Get vehicle info for price
  const vehicleData = await invModel.getInventoryByInvId(inv_id)

  // Create the order
  const orderResult = await orderModel.createOrder(
    account_id,
    inv_id,
    delivery_address,
    vehicleData.inv_price
  )

  if (orderResult && orderResult.rows) {
    req.flash("success", "Your order has been placed successfully! We will contact you soon.")
    res.redirect("/purchase/success")
  } else {
    req.flash("notice", "Sorry, there was an error processing your order.")
    res.redirect(`/purchase/${inv_id}`)
  }
}

/* ****************************************
*  Show Success Page
* *************************************** */
async function showSuccess(req, res, next) {
  let nav = await utilities.getNav()
  res.render("purchase/success", {
    title: "Purchase Successful",
    nav,
    errors: null
  })
}



purchaseController.showPurchaseForm = showPurchaseForm
purchaseController.processPurchase = processPurchase
purchaseController.showSuccess = showSuccess

module.exports = purchaseController