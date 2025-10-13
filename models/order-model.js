//File to handle the orders in the data base

const pool = require("../database/")

/* ***************************
 * Create new order
 * ************************** */
async function createOrder(account_id, inv_id, delivery_address, order_total) {
  try {
    const sql = `INSERT INTO public.orders 
      (account_id, inv_id, delivery_address, order_total) 
      VALUES ($1, $2, $3, $4) RETURNING *`
    return await pool.query(sql, [account_id, inv_id, delivery_address, order_total])
  } catch (error) {
    return error.message
  }
}

/* ***************************
 * Get orders by account ID
 * ************************** */
async function getOrdersByAccount(account_id) {
  try {
    const sql = `SELECT o.*, i.inv_make, i.inv_model, i.inv_year 
      FROM public.orders o 
      JOIN public.inventory i ON o.inv_id = i.inv_id 
      WHERE o.account_id = $1 
      ORDER BY o.order_date DESC`
    const data = await pool.query(sql, [account_id])
    return data.rows
  } catch (error) {
    console.error("getOrdersByAccount error: " + error)
  }
}

/* ***************************
 * Get all orders (for admin)
 * ************************** */
async function getAllOrders() {
  try {
    const sql = `SELECT o.*, i.inv_make, i.inv_model, i.inv_year, 
      a.account_firstname, a.account_lastname 
      FROM public.orders o 
      JOIN public.inventory i ON o.inv_id = i.inv_id 
      JOIN public.account a ON o.account_id = a.account_id 
      ORDER BY o.order_date DESC`
    const data = await pool.query(sql)
    return data.rows
  } catch (error) {
    console.error("getAllOrders error: " + error)
  }
}

module.exports = {
  createOrder,
  getOrdersByAccount,
  getAllOrders
}