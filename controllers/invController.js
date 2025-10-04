/* 📚 NOTES - CONTROLADOR DE INVENTARIO 
   ===========================================
   Este controlador maneja las rutas de inventario:
   - Recibe requests de rutas como /inv/type/1
   - Llama al modelo para obtener datos de BD
   - Llama a utilities para generar HTML
   - Renderiza la vista con los datos
   =========================================== */

const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 *  📚 NOTES - FLUJO COMPLETO:
 *  1. Extrae classificationId de la URL anonymous function (req.params)
 *  2. Llama modelo para obtener vehículos de esa clasificación
 *  3. Llama utility para convertir datos en HTML grid
 *  4. Llama utility para generar navegación
 *  5. Renderiza vista con todo listo
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
 *  Trigger intentional error for testing
 *  📚 NOTES - TASK 3: generates an intentional error505
 *  para probar que el middleware de errores funciona correctamente
 * ************************** */
invCont.triggerError = async function (req, res, next) {
  // Intentionally throw an error to test error handling
  throw new Error("This is an intentional 500 error for testing purposes!")
}

module.exports = invCont