exports.middlewareGlobal = (req, res, next) => {
  res.locals.umaVariavelLocal = "Este é o valor da var local.";
  next();
};

exports.outroMiddleware = (req, res, next) => {
  next();
};

exports.checkCsrfError = (err, req, res, next) => {
  if (err && "EBADCSRFTOKEN" === err.code) {
    return res.render("404");
  }
};

exports.csrfMidlleware = (req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
};
