/* 📚NOTES - MODELO DE INVENTARIO (CAPA DE DATOS)
   ====================================================
   Este archivo contiene todas las funciones que hablan con la base de datos:
   1. getClassifications() - Para navegación
   2. getInventoryByClassificationId() - Vehículos por tipo (Sport, SUV, etc.)
   3. getInventoryByInvId() - Detalles de un vehículo específico
   
   IMPORTANTE: Aquí es donde se pueded introducir errores de SQL para debugging
   ==================================================== */

const pool = require("../database/")

/* ***************************
 *  📚 NOTES 
 *  Get all classification data
 *  USADO PARA: Generar navegación dinámica (Custom, Sport, SUV, etc.)
 *  FLUJO: pool.query → BD → return resultset
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getInventoryByClassificationId error " + error)
  }
}

/* ***************************
 *  Get specific inventory item by inventory id
 * ************************** */
async function getInventoryByInvId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory 
      WHERE inv_id = $1`,
      [inv_id]
    )
    return data
  } catch (error) {
    console.error("getInventoryByInvId error " + error)
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryByInvId
}