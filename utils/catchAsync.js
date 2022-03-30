module.exports = (func) => (req, res, next) => {
  func(req, res).catch(next);
};
