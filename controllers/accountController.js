const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegistration(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body
    
    // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }


  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
    )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
*  Deliver account management view
* *************************************** */
async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/account-management", {
    title: "Account Management",
    nav,
    errors: null,
    accountData: res.locals.accountData
  })
}

/* ****************************************
*  Process logout request
* *************************************** */
async function accountLogout(req, res) {
  res.clearCookie("jwt")
  req.flash("notice", "You have been logged out.")
  res.redirect("/")
}

/* ****************************************
 * Deliver account update view
 **************************************** */
async function buildAccountUpdate(req, res, next) {
  let nav = await utilities.getNav()
  const account_id = parseInt(req.params.account_id)
  const accountData = await accountModel.getAccountById(account_id)
  res.render("account/update", {
    title: "Update Account",
    nav,
    errors: null,
    accountData
  })
}

/* ****************************************
 * Process account update
 **************************************** */
async function updateAccount(req, res, next) {
  let nav = await utilities.getNav()
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_id
  } = req.body

  const updateResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  )

  if (updateResult) {
    req.flash("success", "Account information updated successfully.")
    // Get updated account data
    const accountData = await accountModel.getAccountById(account_id)
    res.locals.accountData = accountData
    res.render("account/account-management", {
      title: "Account Management",
      nav,
      errors: null,
      accountData
    })
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      accountData: { account_id, account_firstname, account_lastname, account_email }
    })
  }
}

/* ****************************************
 * Process password change
 **************************************** */
async function changePassword(req, res, next) {
  let nav = await utilities.getNav()
  const { account_password, account_id } = req.body

  //hash the password before storing
  let hashedPassword
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the password change.')
    const accountData = await accountModel.getAccountById(account_id)
    res.status(500).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      accountData
    })
    return
  }

  const updateResult = await accountModel.updatePassword(hashedPassword, account_id)

  if (updateResult) {
    req.flash("success", "Password changed successfully.")
    const accountData = await accountModel.getAccountById(account_id)
    res.locals.accountData = accountData
    res.render("account/account-management", {
      title: "Account Management", 
      nav,
      errors: null,
      accountData
    })
  } else {
    req.flash("notice", "Sorry, the password change failed.")
    const accountData = await accountModel.getAccountById(account_id)
    res.status(501).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      accountData
    })
  }
}

/* ****************************************
 * Show User Orders
 **************************************** */
async function showUserOrders(req, res, next) {
  let nav = await utilities.getNav()
  const orderModel = require("../models/order-model")
  const account_id = res.locals.accountData.account_id
  const orders = await orderModel.getOrdersByAccount(account_id)
  
  res.render("purchase/user-orders", {
    title: "My Orders",
    nav,
    orders,
    errors: null
  })
}

/* ****************************************
 * Show Purchase Form
 **************************************** */
async function showPurchaseForm(req, res, next) {
  let nav = await utilities.getNav()
  const invModel = require("../models/inventory-model")
  const inv_id = parseInt(req.params.inv_id)
  
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
 * Process Purchase
 **************************************** */
async function processPurchase(req, res, next) {
  let nav = await utilities.getNav()
  const invModel = require("../models/inventory-model")
  const orderModel = require("../models/order-model")
  const { inv_id, delivery_address } = req.body
  const account_id = res.locals.accountData.account_id

  //get vehicle info for price
  const vehicleData = await invModel.getInventoryByInvId(inv_id)
  
  if (!vehicleData) {
    req.flash("notice", "Vehicle not found.")
    res.redirect("/")
    return
  }

  // Create the order
  const orderResult = await orderModel.createOrder(
    account_id,
    inv_id,
    delivery_address,
    vehicleData.inv_price
  )

  if (orderResult && orderResult.rows) {
    req.flash("success", "Your order has been placed successfully! We will contact you soon.")
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, there was an error processing your order.")
    res.redirect(`/account/purchase/${inv_id}`)
  }
}

/* ****************************************
 * Show Purchase Success
 **************************************** */
async function showPurchaseSuccess(req, res, next) {
  let nav = await utilities.getNav()
  res.render("purchase/succes", {
    title: "Purchase Successful",
    nav,
    errors: null
  })
}

module.exports = { buildLogin, buildRegistration, registerAccount, accountLogin, buildAccountManagement, accountLogout, buildAccountUpdate, updateAccount, changePassword, showUserOrders, showPurchaseForm, processPurchase, showPurchaseSuccess }