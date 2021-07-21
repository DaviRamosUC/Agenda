//controlador usando sistema de module.exports para repassar funções de POST, GET e etc

exports.paginaInicial = (req, res) => {
  res.render("index", {
    titulo: "Este será o titulo da página",
    numeros: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  });
  return;
};

exports.trataPost = (req, res, next) => {
  res.send(req.body);
  next();
};
