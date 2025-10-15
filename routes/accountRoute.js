// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const accountValidate = require('../utilities/account-validation')

// Route to build account management view (default route)
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement));

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build registration view
router.get("/registration", utilities.handleErrors(accountController.buildRegistration));

// Process the registration data
router.post("/register", accountValidate.registationRules(), accountValidate.checkRegData, utilities.handleErrors(accountController.registerAccount))

// Process the login data
router.post("/login", accountValidate.loginRules(), accountValidate.checkLoginData, utilities.handleErrors(accountController.accountLogin))

// Process the logout request
router.get("/logout", utilities.handleErrors(accountController.accountLogout))

// Route to build account update view
router.get("/update/:account_id", utilities.handleErrors(accountController.buildAccountUpdate))

// Route to process account update
router.post("/update", accountValidate.updateAccountRules(), accountValidate.checkUpdateData, utilities.handleErrors(accountController.updateAccount))

// Route to process password change
router.post("/change-password", accountValidate.changePasswordRules(), accountValidate.checkPasswordData, utilities.handleErrors(accountController.changePassword))

// Route to show user orders (alternative route)
router.get("/orders", utilities.checkLogin, utilities.handleErrors(accountController.showUserOrders))

// Route to show purchase form
router.get("/purchase/:inv_id", utilities.checkLogin, utilities.handleErrors(accountController.showPurchaseForm))

// Route to process purchase
router.post("/purchase/confirm", utilities.checkLogin, utilities.handleErrors(accountController.processPurchase))

// Route to show purchase success
router.get("/purchase/success", utilities.checkLogin, utilities.handleErrors(accountController.showPurchaseSuccess))

module.exports = router;