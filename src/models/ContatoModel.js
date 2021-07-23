const mongoose = require("mongoose");
const validator = require("validator");

const ContatoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  sobrenome: { type: String, required: false, default: "" },
  email: { type: String, required: false, default: "" },
  telefone: { type: String, required: false, default: "" },
  criadoEm: { type: Date, default: Date.now },
});

const ContatoModel = mongoose.model("Contato", ContatoSchema);

function Contato(body) {
  this.body = body;
  this.errors = [];
  this.contatos = null;
}

Contato.prototype.register = async function () {
  this.valida();
  if (this.errors.length > 0) return;
  this.contato = await ContatoModel.create(this.body);
};

Contato.prototype.valida = function () {
  this.cleanUp();
  // Validação do login
  // O e-mail precisa ser válido
  if (this.body.email && !validator.isEmail(this.body.email))
    this.errors.push("E-mail inválido");
  if (!this.body.nome) this.errors.push("Campo nome precisa ser preenchido");
  if (!this.body.email && !this.body.telefone)
    this.errors.push(
      "Ao menos um dos campos precisa ser preenchido - E-mail ou telefone"
    );
};

Contato.prototype.cleanUp = function () {
  for (let key in this.body) {
    if (typeof this.body[key] !== "string") {
      this.body[key] = "";
    }
  }

  this.body = {
    nome: this.body.nome,
    sobrenome: this.body.sobrenome,
    email: this.body.email,
    telefone: this.body.telefone,
  };
};

Contato.prototype.edit = async function (id) {
  if (typeof id !== "string") return;
  this.valida();
  if (this.errors.length > 0) return;
  this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, {
    new: true,
  });
};

//Métodos estáticos

Contato.buscaPorID = async function (id) {
  if (typeof id !== "string") return;
  const contato = await ContatoModel.findById(id);
  return contato;
};

Contato.buscaContatos = async function () {
  const contato = await ContatoModel.find().sort({ criadoEm: -1 });
  return contato;
};

Contato.delete = async function(id){
  if (typeof id !== "string") return;
  const resultado = await ContatoModel.findByIdAndDelete(id);
  return resultado;
}

module.exports = Contato;
