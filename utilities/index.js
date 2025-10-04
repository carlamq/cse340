
/* 📚 NOTES - ARCHIVO CLAVE DE UTILITIES 
   ==============================================
   Este archivo contiene funciones de utilidad que se reusan en toda la app:
   1. getNav() - Genera navegación dinámica desde base de datos
   2. buildClassificationGrid() - Convierte datos en HTML para mostrar vehículos  
   3. handleErrors() - Wrapper para manejo de errores
   
   FLUJO: Controller llama estas funciones → Procesan datos → Devuelven HTML listo
   ============================================== */

const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 * 📚 NOTES - IMPORTANTE: Esta función se conecta a la BD para generar navegación dinámica
 * FLUJO: BD → getClassifications() → forEach → HTML string → return
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* 📚 NOTES - IMPORTANTE: Convierte array de vehículos en HTML grid
* FLUJO: data array → forEach → construye <li> por cada vehículo → return HTML
* USADO EN: invController.buildByClassificationId()
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* **************************************
* Build the detail view HTML
* ************************************ */
Util.buildDetailGrid = async function(data){
  let grid
  if(data.rows.length > 0){
    let vehicle = data.rows[0]
    grid = '<div class="vehicle-detail">'
    grid += '<div class="vehicle-image">'
    grid += '<img src="' + vehicle.inv_image + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model + '">'
    grid += '</div>'
    grid += '<div class="vehicle-info">'
    grid += '<h2>' + vehicle.inv_make + ' ' + vehicle.inv_model + ' Details</h2>'
    grid += '<div class="vehicle-specs">'
    grid += '<p><strong>Year:</strong> ' + vehicle.inv_year + '</p>'
    grid += '<p><strong>Price:</strong> $' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</p>'
    grid += '<p><strong>Mileage:</strong> ' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + ' miles</p>'
    grid += '<p><strong>Color:</strong> ' + vehicle.inv_color + '</p>'
    grid += '</div>'
    grid += '<div class="vehicle-description">'
    grid += '<p>' + vehicle.inv_description + '</p>'
    grid += '</div>'
    grid += '</div>'
    grid += '</div>'
  } else { 
    grid = '<p class="notice">Sorry, no matching vehicle could be found.</p>'
  }
  return grid
}

module.exports = Util