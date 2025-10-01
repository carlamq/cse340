
const Util = {}

Util.getNav = async function (req, res, next) {
  // Return empty string
  return ""
}

Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util